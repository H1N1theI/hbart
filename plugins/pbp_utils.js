module.exports = {
    init : function(extCmdList){
        extCmdList.set("/pbp", cmdDispatch);
    }
}

var cmdlist = new Map();

cmdlist.set("purge", function(cmdParams, message){
    if(!message.channel.permissionsFor(message.author).hasPermission("MANAGE_MESSAGES")){
        message.delete()
        return;
    }

    var channel = message.channel;
    var messages = channel.messages;
    messages.forEach(function(message){
        if(message.content.charAt(0) == '(' && message.content.charAt(message.content.charAt(message.content.length-1) == ')')){
            message.delete();
        }
    });

    message.delete();
});

function cmdDispatch(cmdParams, message){
    cmdlist.forEach(function(value, key, map) {
        if(cmdParams[0] == key){
            value(cmdParams.shift(), message);
            return;
        }
    });
}