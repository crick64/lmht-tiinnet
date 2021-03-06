import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Meteor } from 'meteor/meteor';

import './partyDetails.html';
import { Parties } from '../../../api/parties';
import { name as PartyUninvited } from '../partyUninvited/partyUninvited';
import { name as PartyInvited } from '../partyInvited/partyInvited';
// import { name as PartyMap } from '../partyMap/partyMap';

class PartyDetails {
  constructor($stateParams, $scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.partyId = $stateParams.partyId;
    this.subscribe('parties');
    this.subscribe('users');

    this.helpers({
      party() {
        return Parties.findOne({
          _id: $stateParams.partyId
        });
      },
      users() {
        return Meteor.users.find({});
      },
      isLoggedIn() {
        return !!Meteor.userId();
      }
    });
  }

  owner_ign() {
    return Meteor.users.findOne(this.party.owner).profile.ign || 'sccare';
  }

  canInvite() {
    if (!this.party) {
      return false;
    }

    return !this.party.public && this.party.owner === Meteor.userId();
  }

  save() {
    Parties.update({
      _id: this.party._id
    }, {
      $set: {
        name: this.party.name,
        description: this.party.description,
        public: this.party.public
      }
    }, (error) => {
      if (error) {
        console.log('Oops, unable to update the party...');
      } else {
        console.log('Done!');
      }
    });
  }
}

const name = 'partyDetails';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  PartyUninvited,
  PartyInvited
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: PartyDetails
})
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('partyDetails', {
    url: '/parties/:partyOwner/:partyId',
    template: '<party-details></party-details>',
    resolve: {
      currentUser($q, $stateParams) {
        if (Meteor.userId() === null) {
          return $q.reject('AUTH_REQUIRED');
        } else if ($stateParams.partyOwner !== Meteor.userId()) {
          return $q.reject('PARTY_OWNER_REQUIRED');
        } else {
          return $q.resolve();
        }
      }
    }
  });
}
