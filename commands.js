var fs = require('fs');
var path = require('path');

module.exports = {
    declCmd : function(message){
        var cmdParams = cmdParser(message.content);
        if(cmdParams[0] == "/ht"){
            htDispatch(cmdParams.slice(1), message);
            return;
        }
        cmdlist.forEach(function(value, key, map) {
            if(cmdParams[0] == key){
                value(cmdParams.slice(1), message);
                return;
            }
        });
    }
}

var cmdlist = new Map();

function loadPlugins(){
    cmdlist.clear();

    fs.readdirSync("./plugins").forEach(function (file){
        console.log("Loading: " + file)
        try{
            require(path.join(__dirname, "plugins", file)).init(cmdlist);
        } catch(e) {
            console.log("Error loading plugin \"" + file + '"' );
            console.log(e);
        }
    });

    return;
}


function cmdParser(messageContent){
    var cmdParams = [];

    var cmdParamSize = 0;
    
    var currentToken = "";

    var ignoreSpace = false;

    for(it = 0; it < messageContent.length; it++){
        if(messageContent.charAt(it) == ' ' && !ignoreSpace){
            cmdParams[cmdParamSize] = currentToken;
            cmdParamSize += 1;
            currentToken = "";
        } else if (messageContent.charAt(it) == '"'){
            ignoreSpace = !ignoreSpace;
        } else {
            currentToken += messageContent.charAt(it);
        }
    }

    if(currentToken != ""){
        cmdParams.push(currentToken);
        cmdParamSize += 1;
    }

    return cmdParams;
}

var htCmdList = new Map();

htCmdList.set("ping", function(cmdParams, message){
    message.reply("Pong!");
});

htCmdList.set("help", function(cmdParams, message){
    message.reply("No help for you!");
});

htCmdList.set("reload", function(cmdParams, message){
    loadPlugins();
});

function htDispatch(cmdParams, message){
    htCmdList.forEach(function(value, key, map) {
        if(cmdParams[0] == key){
            value(cmdParams.shift(), message);
            return;
        }
    });
    message.delete();
}
