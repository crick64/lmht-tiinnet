import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';

import './partyAdd.html';
import { Parties } from '../../../api/parties';

class PartyAdd {
  constructor() {
    this.party = {};
    this.pricesList = ["2000","3000","5000","10000"];
  }

  init() {
    console.log('Im fired!');
    $('#frmAddParty').validate();
  }

  submit(event) {
    event.preventDefault();

    this.party.owner = Meteor.user()._id;
    this.party.createdAt = Date.now();
    this.party.isStarted = false;
    this.party.isEnded = false;
    this.party.isVictory = false;

    insertedId = Parties.insert(this.party);

    if(this.done) {
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
