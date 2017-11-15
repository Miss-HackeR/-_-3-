const Discord = require("discord.js");
const { prefix, token } = require('./config.json');
var client = new Discord.Client();
const config = require('./config.json');
var client = new Discord.Client();
var channel = client.channels.find("name", "general");
var request = require ("request");
var resultOpts = ["Result", "Exact result", "Decimal approximation"];
const weather = require('weather-js'); 
const formatTime = require('formatTime');

//help
client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (message.content === `${prefix}helpme`) {
        message.channel.send(
            "  ```Commands List\n\
[1]  help      ||    Display this message\n\
[2]  server    ||    Display Server Name and ID\n\
[3]  whois     ||    Display Your/User Info\n\
[4]  ping      ||    Display Bot Ping\n\
[5]  avatar    ||    Display Your/User Avatar\n\
[6]  8ball     ||    Ask a Question\n\
[7]  kick      ||    Kick a User\n\
[8]  roll      ||    Roll a Dice\n\
[9]  flip      ||    Flip a Coin\n\
[10] purge     ||    Delete Messages\n\
[11] weather   ||    Display Current Weather```\n``` [IMPORTANT] All commands are in Lower Case```");

    }
    //avatar
    else if (command === 'avatar') {
        if (!message.mentions.users.size) {
            return message.channel.send(`Your avatar: ${message.author.displayAvatarURL}`);
        }
    
        const avatarList = message.mentions.users.map(user => {
            return `${user.username}'s avatar: ${user.displayAvatarURL}`;
        });
    
        message.channel.send(avatarList);
    }
//ping
else if (message.content === `${prefix}ping`) {
    message.channel.send(`:ping_pong: My ping is ${client.ping}. You are on **${message.guild.name}**`);
    console.log("a user has executed a ping command!");
}
//server

else if (message.content === `${prefix}server`) {
    message.channel.send(`Name:   ||   **${message.guild.name}**\n\
Id:           ||    **${message.guild.id}**\n\
Region:  ||    **${message.guild.region}**\n`);
    console.log("a user has executed a server command!");
}
//whois
else if (command === 'whois') {
    if (!message.mentions.users.size) {
        message.channel.send(`Your username: **${message.author.username}**\nYour ID: **${message.author.id}**`)

    }

    const avatarList = message.mentions.users.map(user => {
        message.channel.send( `**Username**: ${user.username} \n **ID**: ${message.author.id}`)
    });

}

//kick
else if (command === 'kick') {
    
    const taggedUser = message.mentions.users.first();
    if (!message.mentions.users.size) {
        return message.reply('Mention a user to kick!');
    }
    message.channel.send(`LMAO :flushed: You think You can **KICK** :joy: **${taggedUser.username}** xD`);
}
//roll?
if (message.content === "--roll") {
    var result = Math.floor((Math.random() * 100) + 1);
    message.channel.send( "You rolled a: " + result);
}
//8ball?
if (message.content.startsWith('--8ball')) {
    var sayings = ["It is certain",
                                    "It is decidedly so",
                                    "Without a doubt",
                                    "Yes, definitely",
                                    "You may rely on it",
                                    "As I see it, yes",
                                    "Most likely",
                                    "Outlook good",
                                    "Yes",
                                    "Signs point to yes",
                                    "Reply hazy try again",
                                    "Ask again later",
                                    "Better not tell you now",
                                    "Cannot predict now",
                                    "Concentrate and ask again",
                                    "Don't count on it",
                                    "My reply is no",
                                    "My sources say no",
                                    "Outlook not so good",
                                    "Very doubtful"];

        var result = Math.floor((Math.random() * sayings.length) + 0);
        message.channel.send( sayings[result]);
}
//flip
if (message.content === "--flip") {
    var result = Math.floor((Math.random() * 2) + 1);
    if (result == 1) {
        message.reply( "You got **HEADS**");
    } else if (result == 2) {
        message.reply( "You got **Tails**");
    }
}
//embed
if(message.content==="--info"){
    message.channel.send({embed: {
        color: 3447003,
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL
        },
        title: "Invite Bot Here",
        url: "https://discordapp.com/api/oauth2/authorize?client_id=379561893905563649&scope=bot&permissions=1",
        description: "This Bot is just for Fun.",
        fields: [{
            name: "Developer",
            value: "Hmmmm.. I guess i developed myself LOL"
          },
          {
            name: "YT Channel",
            value: "Here is the   [YouTubeChannel](https://www.youtube.com/channel/UCjlKuj6P-zAqeu5YaQte3jQ?view_as=subscriber) "
          },
        ],
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL,
          text: "© ﾉﾑ™_り3ﾑり"
        }
      }
    });
}

//purge
if (message.content==="--purge") { // This time we have to use startsWith, since we will be adding a number to the end of the command.
    // We have to wrap this in an async since awaits only work in them.
    async function purge() {
         // Let's delete the command message, so it doesn't interfere with the messages we are going to delete.
         message.delete();
        // Now, we want to check if the user has the `bot-commander` role, you can change this to whatever you want.
        if (!message.member.roles.find("name", "bot-commander")) { // This checks to see if they DONT have it, the "!" inverts the true/false
            message.channel.send('You need the \`bot-commander\` role to use this command.'); // This tells the user in chat that they need the role.
            return; // this returns the code, so the rest doesn't run.
        }

        // We want to check if the argument is a number
        if (isNaN(args[0])) {
            // Sends a message to the channel.
            message.channel.send('Please use a number as your arguments. \n\n Usage: ' + prefix + 'purge <amount>'); //\n means new line.
            // Cancels out of the script, so the rest doesn't run.
           
            return;
        }

        const fetched = await message.channel.fetchMessages({limit: args[0]}); // This grabs the last number(args) of messages in the channel.
        console.log(fetched.size + ' messages found, deleting...'); // Lets post into console how many messages we are deleting

        // Deleting the messages
        message.channel.bulkDelete(fetched)
            .catch(error => message.channel.send(`Error: ${error}`)); // If it finds an error, it posts it into the channel.
            
    }

    // We want to make sure we call the function whenever the purge command is run.
    purge();// Make sure this is inside the if(msg.startsWith)

}
//weather bruhh
if (message.content.startsWith( '--weather')) { 
    if (!message.mentions.users.size) {
        

    }
    weather.find({search: args.join(" "), degreeType: 'C'}, function(err, result) { // Make sure you get that args.join part, since it adds everything after weather.
        if (err) message.channel.send(err);

        // We also want them to know if a place they enter is invalid.
        if (result === undefined || result.length === 0) {
            message.channel.send('**Please enter a valid location.**') // This tells them in chat that the place they entered is invalid.
            return; // This exits the code so the rest doesn't run.
        }

        // Variables
        var current = result[0].current; // This is a variable for the current part of the JSON output
        var location = result[0].location; // This is a variable for the location part of the JSON output

        // Let's use an embed for this.
        const embed = new Discord.RichEmbed()
            .setDescription(`**${current.skytext}**`) // This is the text of what the sky looks like, remember you can find all of this on the weather-js npm page.
            .setAuthor(`Weather for ${current.observationpoint}`) // This shows the current location of the weather.
            .setThumbnail(current.imageUrl) // This sets the thumbnail of the embed
            .setColor(0x00AE86) // This sets the color of the embed, you can set this to anything if you look put a hex color picker, just make sure you put 0x infront of the hex
            .addField('Timezone',`UTC${location.timezone}`, true) // This is the first field, it shows the timezone, and the true means `inline`, you can read more about this on the official discord.js documentation
            .addField('Degree Type',location.degreetype, true)// This is the field that shows the degree type, and is inline
            .addField('Temperature',`${current.temperature} Degrees`, true)
            .addField('Feels Like', `${current.feelslike} Degrees`, true)
            .addField('Wind',current.winddisplay, true)
            .addField('Humidity', `${current.humidity}%`, true)

            // Now, let's display it when called
            message.channel.send({embed});
    });
}
//help
if (command == "help") { // creates a command *help
    var embedhelpmember = new Discord.RichEmbed() // sets a embed box to the variable embedhelpmember
        
        .setTitle("**Current Commands**\n")
        .addField(" - Prefix", ":robot: Current Prefix is    --") // sets the title to List of Commands
        .addField(" - help", ":fast_forward: Displays this message (Correct usage: --help)") // sets the first field to explain the command *help
        .addField(" - info", ":information_source: Tells info about myself :grin:") // sets the field information about the command *info
        .addField(" - ping", ":ping_pong: Tests your ping (Correct usage: --ping)") // sets the second field to explain the command *ping
        .addField(" - weather", ":thunder_cloud_rain:Grab Weather around the world (Correct usage: --weather [location]") // sets the third field to explain the command *cookie
        .addField(" - 8ball", ":8ball: Answers to all of your questions! (Correct usage: *8ball [question])") // sets the field to the 8ball command
        .addField(" - flip", ":black_circle: Flip a Coin (Correct usage: --flip)")
        .addField(" - roll", ":game_die: Roll a Dice (Correct usage: --roll)") // sets a field
        .addField(" - avatar", ":frame_photo: Grab Your/User Avatar  (Correct usage: --avatar <@user>)")
        .addField(" - whois", ":spy: Get Info about User/yourself (Correct usage: --whois <@user>)") //sets a field
        .addField(" - purge", ":x: Delete some trash  (Correct Usage:) --purge [amount] ")
        .addField(" - server", ":couple: Grab Server Info  (Correct Usage: --server")
        .setColor(0xFF0000)
        .setFooter("All commands are in lowercase  ") // sets the footer to "You need help, do you?" 
}
          message.channel.send(embedhelpmember);
});

//joined
client.on('guildMemberAdd', member => {
    let guild = member.guild;
    const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTimestamp()
    .addField('User Update',
      `${member.user} has joined! :white_check_mark: `)
      client.channels.find("name", "spawn_point").sendEmbed(embed);
  });
//leave
client.on('guildMemberRemove', member => {
    let guild = member.guild;
    const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTimestamp()
    .addField('User Update',
      `${member.user} has left! :neutral_face: `)
      client.channels.find("name", "spawn_point").sendEmbed(embed);
  });
//role made
client.on('roleCreate', role => {
    let channel =  
    client.channels.find("name", "testing-").sendMessage(`**${role.name}** has been made :spy:`);
 });

client.on('disconnect', function() {
    console.log("An error cause your bot to go offline! ");
  });





client.login(process.env.BOT_TOKEN);
