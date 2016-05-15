import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';

import './partyInvited.html';
import { name as InvitedFilter } from '../../filters/invitedFilter';
import { name as DisplayNameFilter } from '../../filters/displayNameFilter';

class PartyInvited {
  constructor($scope) {
    'ngInject';

    $scope.viewModel(this);

    this.helpers({
      users() {
        return Meteor.users.find({});
      }
    });
  }

  viewlmss(user) {
    document.getElementById('gm-info').src = "http://lienminhsamsoi.vn/profile?name=" + user.profile.ign;
  }

  isAnswer(userID) {
    if (this.party) {
      var filtered = $.grep(this.party.rsvps,
        function(o)  {
        return o.rsvp === 'yes';
      });
      var retObj =
      $.grep(filtered, function (e) {return e.user === userID;});
      return retObj.length > 0;
    }
  }

  totalGoes() {
    if (this.party) {
      var filtered = $.grep(this.party.rsvps,
        function(o)  {
        return o.rsvp === 'yes' && o.user !== Meteor.userId();
      });
      if (filtered)
      return filtered.length;
      else return 0;
    }
  }

  unInvite(user) {
    Meteor.call('uninvite', this.party._id, user._id,
      (error) => {
        if (error) {
          console.log('Oops, unable to un-invite!');
          console.log(error);
        } else {
          console.log('Un-invited!');
        }
      }
    );
  }
}

const name = 'partyInvited';

// create a module
export default angular.module(name, [
  angularMeteor,
  InvitedFilter,
  DisplayNameFilter
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  bindings: {
    party: '<'
  },
  controller: PartyInvited
});
