const _ = require('lodash');

const formatUser = (user, userMap) => {
  const display_name = _.get(userMap, `${user}.display_name`);
  if (display_name) {
    return `<@${display_name}>`;
  } else {
    return user;
  }
};

module.exports = {
  formatUser
};
