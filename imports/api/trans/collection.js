import { Mongo } from 'meteor/mongo';

export const Trans = new Mongo.Collection('transactions');

Trans.allow({
  insert(userId, tran) {
    return userId && tran.owner === userId;
  },
  update(userId, tran, fields, modifier) {
    return userId && tran.owner === userId;
  },
  remove(userId, tran) {
    return userId && tran.owner === userId;
  }
});
