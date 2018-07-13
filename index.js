// Dependiciens
const botconfig = require("./botconfig.json");
const Discord = require('discord.js');
const client = new Discord.Client();
// Database
const sql = require("sqlite");
sql.open("./userdata.sqlite");

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

// Message handler
client.on('message', msg => {
	if (msg.author.bot == true) return;
	if (msg.channel.type === "dm") return;
	var prefix = botconfig.prefix;
	// Command handler
	if (msg.content.charAt() == prefix) {
		var msgArray = msg.content.split(" ");
		var cmd = msgArray[0];
		var args = msgArray.slice(1);
		cmd = cmd.substr(1);
		// Insert commands here
		if (cmd == "ping") {
			msg.reply("pong");
		}else if (cmd == "sandwich") {
			msg.channel.send(".\n:bread:\n:bacon:\n:salad:\n:tomato:\n:bread:")
		}else if (cmd == "lvl") {
			sql.get(`SELECT * FROM UserData WHERE userId ="${msg.author.id}"`).then(row => {
				if (!row) return msg.reply("Your current lvl is 0");
				msg.reply(`Your current lvl is ${row.lvl}`);
			});
		}else if (cmd == "exp") {
			sql.get(`SELECT * FROM UserData WHERE userId ="${msg.author.id}"`).then(row => {
				if (!row) return msg.reply("Your current exp are 0");
				msg.reply(`Your current exp is ${row.exp}`);
			});
		}else{
			msg.reply("Command does not exist")
		}
	}
	// Userdata database handler
	sql.get(`SELECT * FROM UserData WHERE userId = "${msg.author.id}"`).then(row => {
		if (!row) { // Can't find the row.
			sql.run("INSERT INTO UserData (userId, exp, lvl) VALUES (?, ?, ?)", [msg.author.id, 1, 0]);
		} else { // Can find the row.
			var curLvl = Math.floor(0.1 * row.exp);
			if (curLvl > row.lvl) {
				row.lvl = curLvl;
				sql.run(`UPDATE UserData SET exp = ${row.exp + 1}, lvl = ${row.lvl} WHERE userId = ${msg.author.id}`);
				msg.reply(`You've leveled up to level **${curLvl}**!`);
			}
			sql.run(`UPDATE UserData SET exp = ${row.exp + 1} WHERE userId = ${msg.author.id}`);
		}
	}).catch(() => {
		console.error; // Gotta log those errors
		sql.run("CREATE TABLE IF NOT EXISTS UserData (userId TEXT, exp INTEGER, lvl INTEGER)").then(() => {
			sql.run("INSERT INTO UserData (userId, exp, lvl) VALUES (?, ?, ?)", [msg.author.id, 1, 0]);
		});
	});
});


client.login(botconfig.token);

/* Command template
else if (cmd == "") {
	
		}
*/
