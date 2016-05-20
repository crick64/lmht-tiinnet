import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import './auth.html';
import { name as DisplayNameFilter } from '../../filters/displayNameFilter';
import { name as Login } from '../login/login';
import { name as Register } from '../register/register';
import { name as Password } from '../password/password';

//import { Trans } from '../../../api/trans';

const name = 'auth';

class Auth {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    //this.subscribe('trans');

    this.helpers({
      isLoggedIn() {
        return !!Meteor.userId();
      },
      currentUser() {
        return Meteor.user();
      }
    });
  }

  toggleAvailable() {
    Meteor.users.update(Meteor.userId(), {$set: {'profile.isAvailable' : this.currentUser.profile.isAvailable}});
  }

  logout() {
    Meteor.users.update(Meteor.userId(), {$set: {'profile.isAvailable' : false}});
    Accounts.logout();
  }
}

// create a module
export default angular.module(name, [
  angularMeteor,
  DisplayNameFilter,
  Login,
  Register,
  Password
  //Trans
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: Auth
});
