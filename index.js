require("dotenv").config();
const Discord = require("discord.js");
const discordClient = new Discord.Client();
const { MessageEmbed, MessageCollector } = require("discord.js")
const request = require('request')
const Twitter = require('twitter')
const twitterClient = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_SECRET
});
//twitterAccountId= '253172741' //Molg
twitterAccountId= '1134552730146500608' //Fall guys
let twitterStream = twitterClient.stream('statuses/filter', {follow: twitterAccountId});

discordClient.on('ready', () => {
   
    
    discordClient.user.setStatus('online')
    discordClient.user.setActivity('Twitter spy bot')
    
    let generalChannels = discordClient.channels.cache.filter(Channel => Channel.name =='general')

    twitterStream.on('data', function(event) {
        event.user.id==twitterAccountId && generalChannels.map(channel=>sendToChannel(channel,event))
    });

    twitterStream.on('error',function(err){
        console.error(err)
    })

})

discordClient.on('message',message=>{
    switch(message.content){
        case 'tsa! clean':
           message.channel.messages.fetch()
            .then(messages => {
                let msgs= messages.filter(m => m.author.id === discordClient.user.id)
                msgs.each(msg=>{
                    msg.delete({ timeout: 5000 })
                    .then(msg)
                    .catch(console.error)
                })
                // let commands= messages.filter(m => m.content.includes('tsa!'))
                // commands.each(msg=>{
                //     msg.delete({ timeout: 5000 })
                //     .then(msg)
                //     .catch(console.error)
                // })
            })
            .catch(console.error);
        break;
        
        case 'tsa! greet':
            message.reply("Hello world")
    }
})



function sendToChannel(channel,event){

    const embed = new MessageEmbed()
    // Set the title of the field
    // Set the color of the embed
    .setColor('#326ada')
    // Set the main content of the embed
    .setDescription(event.text)
    .setTimestamp(new Date(event.created_at))
    .setURL(event.user.url)
    .setAuthor(event.user.name,event.user.profile_image_url_https);
  // Send the embed to the same channel as the message
    channel.send(embed)
}




discordClient.login(process.env.BOT_TOKEN);