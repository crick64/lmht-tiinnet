import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Trans } from './collection';

if (Meteor.isServer) {
  Meteor.publish('trans', function(options) {
    const selector = {      
    };

    return Trans.find(selector, options);
  });
}
