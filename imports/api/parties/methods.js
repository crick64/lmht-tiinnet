import _ from 'underscore';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Email } from 'meteor/email';

import { Parties } from './collection';
import { Trans } from '../trans/collection';

function getContactEmail(user) {
  if (user.emails && user.emails.length)
    return user.emails[0].address;

  if (user.services && user.services.facebook && user.services.facebook.email)
    return user.services.facebook.email;

  return null;
}

export function invite(partyId, userId) {
  check(partyId, String);
  check(userId, String);

  if (!this.userId) {
    throw new Meteor.Error(400, 'You have to be logged in!');
  }

  const party = Parties.findOne(partyId);

  if (!party) {
    throw new Meteor.Error(404, 'No such party!');
  }

  if (party.owner !== this.userId) {
    throw new Meteor.Error(404, 'No permissions!');
  }

  if (party.public) {
    throw new Meteor.Error(400, 'That party is public. No need to invite people.');
  }

  if (userId !== party.owner && ! _.contains(party.invited, userId)) {
    Parties.update(partyId, {
      $addToSet: {
        invited: userId
      }
    });

    const replyTo = getContactEmail(Meteor.users.findOne(this.userId));
    const to = getContactEmail(Meteor.users.findOne(userId));

    // if (Meteor.isServer && to) {
    //   // Email.send({
    //   //   to,
    //   //   replyTo,
    //   //   from: 'noreply@tiiin.net',
    //   //   subject: `[hipyo.net] Bạn nhận được một lời mời chơi game`,
    //   //   text: `
    //   //     Hey, có người vừa mời bạn chơi cùng họ, thắng sẽ nhận được tiền thưởng trên hipyo.net.
    //   //     Click vào đây để xem chi tiết: ${Meteor.absoluteUrl()}
    //   //   `
    //   // });
    //
    //   Meteor.call('sendEmail', {
    //     to: to,
    //     replyTo: replyTo,
    //     from: 'noreply@hipyo.net',
    //     subject: '[hipyo.net] Bạn nhận được một lời mời chơi game',
    //     text: 'Mailgun is totally awesome for sending emails!',
    //     html: `
    //       Hey, có người vừa mời bạn chơi cùng họ, thắng sẽ nhận được tiền thưởng trên hipyo.net.
    //       Click vào đây để xem chi tiết: ${Meteor.absoluteUrl()}
    //     `
    //   });
    // }
  }
}

export function startgame(partyId, invitedUsers) {
  check(partyId, String);
  check(invitedUsers, Array);

  if (!this.userId) {
    throw new Meteor.Error(400, 'You have to be logged in!');
  }

  const party = Parties.findOne(partyId);

  if (!party) {
    throw new Meteor.Error(404, 'No such party!');
  }

  if (party.owner !== this.userId) {
    throw new Meteor.Error(404, 'No permissions!');
  }

  // ok let's change users' status to Un-Available
  invitedUsers.forEach(function (u) {
    Meteor.users.update(u.user, {$set: {
      'profile.isAvailable' : false,
      'profile.isInvited' : true
      }});

  });

  _.map(invitedUsers, function (o) {
    o.name = getContactEmail(Meteor.users.findOne(o.user));
  });


  // then, insert a transaction

  Trans.insert({
    createdAt: new Date(),
    name: party.name,
    amount: parseInt(party.description),
    totalAmount: parseInt(party.description) * invitedUsers.length,
    fromGamer: party.owner,
    toGamers: invitedUsers,
    status: 'on-going'
  });

  Parties.update(partyId, {
    $set: {
      isStarted: true
    }
  });

}

export function uninvite(partyId, userId) {
  check(partyId, String);
  check(userId, String);

  if (!this.userId) {
    throw new Meteor.Error(400, 'You have to be logged in!');
  }

  const party = Parties.findOne(partyId);

  if (!party) {
    throw new Meteor.Error(404, 'No such party!');
  }

  if (party.owner !== this.userId) {
    throw new Meteor.Error(404, 'No permissions!');
  }

  if (party.public) {
    throw new Meteor.Error(400, 'That party is public. No need to invite people.');
  }

  if (userId == party.owner && _.contains(party.invited, userId)) {
    Parties.update(partyId, {
      $pull: {
        invited: userId
      }
    });

  }
}

export function rsvp(partyId, rsvp) {
  check(partyId, String);
  check(rsvp, String);

  if (!this.userId) {
    throw new Meteor.Error(403, 'You must be logged in to RSVP');
  }

  if (!_.contains(['yes', 'no', 'maybe'], rsvp)) {
    throw new Meteor.Error(400, 'Invalid RSVP');
  }

  const party = Parties.findOne({
    _id: partyId,
    $or: [{
      // is public
      $and: [{
        public: true
      }, {
        public: {
          $exists: true
        }
      }]
    },{
      // is owner
      $and: [{
        owner: this.userId
      }, {
        owner: {
          $exists: true
        }
      }]
    }, {
      // is invited
      $and: [{
        invited: this.userId
      }, {
        invited: {
          $exists: true
        }
      }]
    }]
  });

  if (!party) {
    throw new Meteor.Error(404, 'No such party');
  }

  const hasUserRsvp = _.findWhere(party.rsvps, {
    user: this.userId
  });

  if (!hasUserRsvp) {
    // add new rsvp entry
    Parties.update(partyId, {
      $push: {
        rsvps: {
          rsvp,
          user: this.userId
        }
      }
    });
  } else {
    // update rsvp entry
    const userId = this.userId;
    Parties.update({
      _id: partyId,
      'rsvps.user': userId
    }, {
      $set: {
        'rsvps.$.rsvp': rsvp
      }
    });
  }
}

Meteor.methods({
  invite,
  uninvite,
  rsvp,
  startgame
});
