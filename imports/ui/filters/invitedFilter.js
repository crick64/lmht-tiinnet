import angular from 'angular';
import _ from 'underscore';

const name = 'invitedFilter';

function InvitedFilter(users, party) {
  if (!party) {
    return false;
  }

  return users.filter((user) => {
    // if not the owner and is invited
    return user._id !== party.owner && _.contains(party.invited, user._id);
  });
}

// create a module
export default angular.module(name, [])
  .filter(name, () => {
    return InvitedFilter;
  });
