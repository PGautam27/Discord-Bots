require('dotenv').config();
let { Client, Events, GatewayIntentBits } = require('discord.js');
let { getRandomQuote} = require('./quote');


const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ] 
});

// Handle messages
// Handle messages
client.on('messageCreate', async (message) => {
    // Ignore messages from bots
    if(message.author.bot) return;
    
    // Only respond to !quote command
    console.log("this is message", message.content.toLowerCase())
    if(message.content.toLowerCase() === '<@1325164928344129566>') {
        const quote = await getRandomQuote();
        message.reply({
            content: quote
        });
    }
});

// Handle ready event
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Handle errors
client.on('error', error => {
    console.error('Discord client error:', error);
});

// Login with token
client.login(process.env.DISCORD_TOKEN)
    .catch(error => {
        console.error('Failed to log in:', error);
    });
