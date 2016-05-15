import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';

import './partyAdd.html';
import { Parties } from '../../../api/parties';

class PartyAdd {
  constructor() {
    this.party = {};
    this.party.prices = ["2000","3000","5000","10000"];
  }


  submit() {
    this.party.owner = Meteor.user()._id;
    insertedId = Parties.insert(this.party);

    if(this.done) {
      console.log('ID: ', insertedId);
      Meteor.call('rsvp', insertedId, 'yes', (error) => {
        if (error) {
          console.error('Adding, Oops, unable to rsvp!');
        } else {
          console.log('Added - Yes RSVP done!')
        }
      });
      this.done();
    }

    this.reset();
  }

  reset() {
    this.party = {};
  }
}

const name = 'partyAdd';

// create a module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  bindings: {
    done: '&?'
  },
  controllerAs: name,
  controller: PartyAdd
});
