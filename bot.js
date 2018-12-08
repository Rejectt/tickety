const Discord = require("discord.js");
const client = new Discord.Client();
const prefix = "+";

client.on("ready", () => {
  console.log("Mohamed | Logged in! Server count: ${client.guilds.size}");
  client.user.setGame(`Ticket|${prefix}new`);
});


client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  if (message.content.toLowerCase().startsWith(prefix + `help`)) {
    const embed = new Discord.RichEmbed()
    .setTitle(`:mailbox_with_mail: Vulnix Help`)
    .setColor(0xCF40FA)
    .setDescription(`مرحبا ! انا تيكيت بوت , ارحب بك , ان كنت تريد اوامري هذه هي :`)
    .addField(`Tickets`, `[${prefix}new]() > Opens up a new ticket and tags the Support Team\n[${prefix}close]() > Closes a ticket that has been resolved or been opened by accident`)
    .addField(`Other`, `[${prefix}help]() > Shows you this help menu your reading\n[${prefix}ping]() > Pings the bot to see how long it takes to react\n[${prefix}about]() > Tells you all about Vulnix`)
    message.channel.send({ embed: embed });
  }

  if (message.content.toLowerCase().startsWith(prefix + `ping`)) {
    message.channel.send(`Hoold on!`).then(m => {
    m.edit(`:ping_pong: Wew, made it over the ~waves~ ! **Pong!**\nMessage edit time is ` + (m.createdTimestamp - message.createdTimestamp) + `ms, Discord API heartbeat is ` + Math.round(client.ping) + `ms.`);
    });
}

if (message.content.toLowerCase().startsWith(prefix + `new`)) {
    const reason = message.content.split(" ").slice(1).join(" ");
    if (!message.guild.roles.exists("name", "Support Team")) return message.channel.send(`هذا السيرفر لا يملك رتبه \`Support Team\`  لهذا لا يمكنك فتح تيكيت.\n نرجو انشاء ترتبه Support Team حتي يمكنني انشاء التذاكر.`);
    if (message.guild.channels.exists("name", "ticket-" + message.author.id)) return message.channel.send(`بلفعل انت تملك تيكيت , لا يمكنك انشاء اكثر من واحده .`);
    message.guild.createChannel(`ticket-${message.author.id}`, "text").then(c => {
        let role = message.guild.roles.find("name", "Support Team");
        let role2 = message.guild.roles.find("name", "@everyone");
        c.overwritePermissions(role, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true
        });
        c.overwritePermissions(role2, {
            SEND_MESSAGES: false,
            READ_MESSAGES: false
        });
        c.overwritePermissions(message.author, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true
        });
        message.channel.send(`:white_check_mark: تم انشاء التيكيت الخاص بك وهو بأسم , #${c.name}.`);
        const embed = new Discord.RichEmbed()
        .setColor(0xCF40FA)
        .addField(`Hey ${message.author.username}!`, `مرحبا , يجب ان تشرح لنا ماهي مشكلتك وسيكون فريق الدعم موجودا هنا لمساعدتك , شكرا .`)
        .setTimestamp();
        c.send({ embed: embed });
    }).catch(console.error);
}
if (message.content.toLowerCase().startsWith(prefix + `close`)) {
    if (!message.channel.name.startsWith(`ticket-`)) return message.channel.send(`لا يمكنك ان تقفل تيكيت خارج القناه الخاصه به.`);

    message.channel.send(`هل انت متاكد من انك تريد غلق هذا التيكيت ؟ \nTo لنتاكد , قم بكتابه  \`-confirm\`. سيتم قفل هذا الفعل في غضوان 10 ثواني .`)
    .then((m) => {
      message.channel.awaitMessages(response => response.content === '-confirm', {
        max: 1,
        time: 10000,
        errors: ['time'],
      })
      .then((collected) => {
          message.channel.delete();
        })
        .catch(() => {
          m.edit('Ticket close timed out, the ticket was not closed.').then(m2 => {
              m2.delete();
          }, 3000);
        });
    });
}

});

client.login(process.env.BOT_TOKEN);
