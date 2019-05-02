const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
require('dotenv/config');
const http = require('http');
const port = process.env.PORT || 3000;
http.createServer().listen(port);

const token = process.env.TOKEN;


client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});


client.on("message", async message => {
  if(message.author.bot) return;
  
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  if(command === "ping") {
    const m = await message.channel.send("Ping?");
    const embed = new Discord.RichEmbed()
    .setDescription(`*Latency* - ${m.createdTimestamp - message.createdTimestamp}ms. \n*API Latency* - ${Math.round(client.ping)}ms`)
    .setColor('#00fff2');
    m.edit(embed);
  }
  
  if(command === "say") {
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{}); 
    message.channel.send(sayMessage);
  }
  
  if(command === "kick") {
    var embed = new Discord.RichEmbed()
    .setDescription("Sorry, you don't have permissions to use this!")
    .setColor('#ff0000');
    if(!message.member.roles.some(r=>["SNE | Admin", "Moderator", "Owner", "SNE | Co-Owner", "Discord Manager, "].includes(r.name)) )
    return message.channel.send(embed);

    var embed = new Discord.RichEmbed()
    .setDescription("Please mention a valid member of this server")
    .setColor('#ff0000');
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.channel.send(embed);
      var embed = new Discord.RichEmbed()
      .setDescription("I cannot kick this user! They have a higher role or I do not have kick permissions.")
      .setColor('#ff0000');
    if(!member.kickable) 
      return message.channel.send(embed);
    
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
      var embed = new Discord.RichEmbed()
      .setDescription(`${member.user.tag} has been kicked by ${message.author.tag} \nreason: \`${reason}\``)
      .setColor("#00cc00")
    message.channel.send(embed);

  }
  
  if(command === "ban") {
    var embed = new Discord.RichEmbed()
    .setDescription("Sorry, you don't have permissions to use this!")
    .setColor('#ff0000');
    if(!message.member.roles.some(r=>["SNE | Admin", "Owner", "SNE | Co-Owner", "Discord Manager, "].includes(r.name)) )
      return message.channel.send(embed);
    
      var embed = new Discord.RichEmbed()
      .setDescription("Please mention a valid member of this server")
      .setColor('#ff0000')
    let member = message.mentions.members.first();
    if(!member)
      return message.channel.send(embed);
      var embed = new Discord.RichEmbed()
      .setDescription("I cannot ban this user! They have a higher role or I do not have ban permissions?")
      .setColor('#ff0000')
    if(!member.bannable) 
      return message.channel.send(embed);

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
      var embed = new Discord.RichEmbed()
      .setDescription(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`)
      .setColor('#00cc00')
    message.channel.send(embed);
  }
  
  if(command === "purge") {
    const deleteCount = parseInt(args[0], 10);
    
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }
});

client.on('error', err => {
  console.log(err);
});

client.login(token);