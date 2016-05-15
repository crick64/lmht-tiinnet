import _ from 'underscore';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Email } from 'meteor/email';

import { Trans } from './collection';

function getContactEmail(user) {
  if (user.emails && user.emails.length)
    return user.emails[0].address;

  if (user.services && user.services.facebook && user.services.facebook.email)
    return user.services.facebook.email;

  return null;
}

export function gettrans() {
  //check(param1, String);
  //check(param2, String);

  // if (!this.userId) {
  //   throw new Meteor.Error(403, 'You must be logged in to RSVP');
  // }

  // if (!_.contains(['yes', 'no', 'maybe'], rsvp)) {
  //   throw new Meteor.Error(400, 'Invalid RSVP');
  // }

  const trans = Trans.find({
      $and: [{
        success: true
      }, {
        success: {
          $exists: true
        }
      }]
  });

}

Meteor.methods({
  gettrans
});
