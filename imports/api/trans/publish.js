import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Trans } from './collection';

if (Meteor.isServer) {
  Meteor.publish('trans', function(options) {
    const selector = {
    };

    Counts.publish(this, 'numberOfTrans', Trans.find(selector), {
      noReady: true
    });

    return Trans.find(selector, options);
  });
}
