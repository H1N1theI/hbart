var Discord = require("discord.js");

var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

var commands = require("./commands.js");

var hbart = new Discord.Client();

console.log("Bot Management: https://discordapp.com/oauth2/authorize?client_id=221469856346800129&scope=bot");

hbart.login(config.token, null, null).then(retString => {
        console.log("Authentification successful, joining servers...");

        hbart.on("message", function(message) {
            if(message.author.bot){
                return;
            }
            
            try{
                commands.declCmd(message);
            } catch (e) {
                console.log("Error during message parsing.");
                console.log(e);
            }
        });},

    error => {
        if(error != null){
            console.log("Authentification unseccessful!");
            console.log(error);
            return;
        }});

