const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent
    ]
});
const {
    token,
    chat,
    status
} = require('./config.json');
const request = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const {
    URL,
    URLSearchParams
} = require('url');
const mainURL = new URL(chat.url);
const urlOptions = {
    bid: chat.brainID,
    key: chat.key,
    uid: null,
    msg: null
};

client.util = require('./util.js');

client.on('warn', err => console.warn('Warning', err));
client.on('error', err => console.error('Error', err));
client.on('disconnect', () => {
    console.warn('Disconnected');
    process.exit(0);
});
client.on('uncaughtException', err => {
    console.log('Uncaught Exception: ' + err);
    process.exit(1);
});

client.on('message.Create', (msg) => {
    if (msg.author.id == client.user.id) return;
    if (msg.author.bot) return;
    if (msg.content.startsWith(`<@1073842496196587639> `)) {
        const handleTalk = async (msg) => {
            urlOptions.uid = msg.author.id;
            urlOptions.msg = msg.content.replace(`<@1073842496196587639> `, '');
            const params = new URLSearchParams(urlOptions);
            const response = await request(mainURL + '?' + params);
            const json = await response.json();
            msg.channel.sendTyping();
            setTimeout(() => {
                msg.channel.send(json.cnt);
            }, msg.content.length * 50);
        };
        handleTalk(msg);
    }
});

client.on('ready', () => {
    client.util.handleStatus(client, status);
    console.log(`Logged in as ${client.user.tag}.`);
});

client.on('unhandledRejection', (reason) => {
    console.log('Fatal, Unhandled Rejection: ' + reason);
});

client.login(token);