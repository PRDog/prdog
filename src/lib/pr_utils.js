const formatUser = (user, userMap) => {
    return userMap.has(user) ?
        `<@${userMap.get(user)}>` : `${user}`;
};

module.exports = {
    formatUser,
};
