import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';

import { Counts } from 'meteor/tmeasday:publish-counts';

import './partiesList.html';
import { Parties } from '../../../api/parties';
import { name as Trans } from '../trans/trans';
import { name as PartiesSort } from '../partiesSort/partiesSort';
import { name as PartyAddButton } from '../partyAddButton/partyAddButton';
import { name as PartyRemove } from '../partyRemove/partyRemove';
import { name as PartyCreator } from '../partyCreator/partyCreator';
import { name as PartyRsvp } from '../partyRsvp/partyRsvp';
import { name as PartyRsvpsList } from '../partyRsvpsList/partyRsvpsList';

class PartiesList {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.perPage = 20;
    this.page = 1;
    this.sort = {
      createdAt: -1
    };
    this.searchText = '';

    this.subscribe('parties', () => [{
        limit: parseInt(this.perPage),
        skip: parseInt((this.getReactively('page') - 1) * this.perPage),
        sort: this.getReactively('sort')
      }, this.getReactively('searchText')
    ]);

    this.subscribe('users');

    this.helpers({
      parties() {
        return Parties.find({}, {
          sort : this.getReactively('sort')
        });
      },
      partiesCount() {
        return Counts.get('numberOfParties');
      },
      isLoggedIn() {
        return !!Meteor.userId();
      },
      currentUserId() {
        return Meteor.userId();
      },
      currentUser() {
        return Meteor.user();
      },
      date() {
        return new Date();
      }
    });
  }

  isOwner(party) {
    return this.isLoggedIn && party.owner === this.currentUserId;
  }

  // popNote() {
  //   document.getElementsByName('note')[0].value = this.currentUserName + ' nạp tiền mệnh giá ';
  // }

  pageChanged(newPage) {
    this.page = newPage;
  }

  sortChanged(sort) {
    this.sort = sort;
  }
}

const name = 'partiesList';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination,
  PartiesSort,
  // PartiesMap,
  PartyAddButton,
  PartyRemove,
  PartyCreator,
  PartyRsvp,
  PartyRsvpsList,
  Trans
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: PartiesList
})
  .config(config);

function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('parties', {
      url: '/parties',
      template: '<parties-list></parties-list>'
    });
}
