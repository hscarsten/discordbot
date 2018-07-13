const botconfig = require("./botconfig.json");
const Discord = require("discord.js");

const bot = new Discord.Client({disableEveryone: true});

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online`);
  bot.user.setActivity("la gratar!");
});

bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  if(cmd === `${prefix}ping`){
    return message.channel.send("Pong :ping_pong:");
  }

  if(cmd === `${prefix}botinfo`){

    let bicon = bot.user.displayAvatarURL;
    let botembed = new Discord.RichEmbed()
    .setDescription("Informatie Bot")
    .setColor("#732626")
    .setThumbnail(bicon)
    .addField("Numele Bot-ului", bot.user.username)
    .addField("Creat Pe Data De", bot.user.createdAt);

    return message.channel.send(botembed);
  }

  if(cmd === `${prefix}serverinfo`){

    let sicon = message.guild.iconURL;
    let serverembed = new Discord.RichEmbed()
    .setDescription("Informatie Server")
    .setColor("#732626")
    .setThumbnail(sicon)
    .addField("Numele Server-ului", message.guild.name)
    .addField("Creat Pe Data De", message.guild.createdAt)
    .addField("Tu Ai Intrat Pe Data De", message.member.joinedAt)
    .addField("Numarul De Membrii", message.guild.memberCount);

    return message.channel.send(serverembed);
  }

  if(cmd === `${prefix}report`){



    let rUser = message.guild.member(message.mention.users.first() || message.guild.members.get(args[0]))
    if(!rUser) return message.channel.send("Nu am putut gasi utilizatorul");
    let reason = args.join(" ").slick(22);

    let reportEmbed = new Discord.RichEmbed()
    .setDescription("Raport-uri")
    .setColor("#732626")
    .addField("Raporteaza Utilizator", `${rUser} with ID: ${rUser.id}`)
    .addField("Raportat De", `${message.author} with ID: ${message.author.id}`)
    .addField("Canalul", message.channel)
    .addField("Timp", message.createdAt)
    .addField("Motiv", reason)

    let reportschannel = message.guil.channels.find(`name`, "player-report");
    if(!reportschannel) return message.channel.send("Nu putem gasi report channel-ul")

    message.delete().catch(O_o=>{});
    reportschannel.send(reportEmbed);
    return;
  }
});

bot.login(botconfig.token);