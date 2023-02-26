const request = (...args) => import ('node-fetch').then(({default: fetch}) => fetch(...args));
const { ActivityType } = require('discord.js');

const handleStatus = (client, status) => {
    client.user.setStatus(status.state);
    client.user.setActivity(status.name, {
        type: ActivityType.Listening
    });
};

module.exports = {
    handleStatus
};