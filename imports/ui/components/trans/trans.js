import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import './trans.html';
import { name as DisplayNameFilter } from '../../filters/displayNameFilter';


import { Trans } from '../../../api/trans';

const name = 'trans';

class Transaction {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.subscribe('trans');

    this.helpers({
      authorized() {
        return true;
      },
      isLoggedIn() {
        return !!Meteor.userId();
      },
      currentUser() {
        return Meteor.user();
      },
      trans() {
        return Trans.find({}, {
          sort: { createdAt : -1}
        });
      }
    });
  }

  getUserById(uID) {
    check(uID, String);
    return Meteor.users.findOne(uID);
  }

  logout() {
    Accounts.logout();
  }
}

// create a module
export default angular.module(name, [
  angularMeteor,
  DisplayNameFilter
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: Transaction
}).config(config);

function config($stateProvider) {
'ngInject';
$stateProvider
  .state('trans', {
    url: '/trans',
    template: '<trans><trans>'
  });
}
