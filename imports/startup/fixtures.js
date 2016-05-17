import { Meteor } from 'meteor/meteor';
import { Parties } from '../api/parties';
import { Trans } from '../api/trans';

Meteor.startup(() => {
  if (Parties.find().count() === 0) {
    const parties = [{
      'name': 'Dubstep-Free Zone',
      'description': 'Fast just got faster with Nexus S.'
    }, {
      'name': 'All dubstep all the time',
      'description': 'Get it on!'
    }, {
      'name': 'Savage lounging',
      'description': 'Leisure suit required. And only fiercest manners.'
    }];

    parties.forEach((party) => {
      Parties.insert(party)
    });

  }

  if (Trans.find().count() === 0) {
    const trans = [{
      'name': 'Dubstep-Free Zone',
      'amount': 2000,
      'fromGamer': 'fromID',
      'toGamers' : [{ 'userId':'to_ID_1' }, { 'userId':'to_ID_2' }],
      'createdAt': Date.now()
    }, {
      'name': 'All dubstep all the time',
      'amount': 3000,
      'fromGamer': 'fromID',
      'toGamers' : [{ 'userId':'to_ID_1' }, { 'userId':'to_ID_2' }, { 'userId':'to_ID_3' }],
      'createdAt': Date.now()
    }, {
      'name': 'Savage lounging',
      'amount': 5000,
      'fromGamer': 'fromID',
      'toGamers' : [{ 'userId':'to_ID_1' }],
      'createdAt': Date.now()
    }];

    trans.forEach((t) => {
      Trans.insert(t)
    });
  }
});
