/*********************************************************
	 * Custom commands
	 *********************************************************/

	afk: 'away',
	away: function (target, room, user) {
		user.away = !user.away;
		user.updateIdentity();
		room.add("" + user.name + " is " + (user.away ? "now" : "no longer") + " away.");
	},

	cc: 'customcolour',
	customcolour: function (target, room) {
		var targets = target.split(',');
		if (targets.length < 2) return this.sendReply("/customcolour OR /cc [colour], [message] - Outputs a message in a custom colour. Requires: " + Users.getGroupsThatCan('customcolour', room).join(" "));
		if (!this.can('customcolour', room) || !this.canBroadcast('!cc')) return false;

		this.sendReply('|raw|<font color="' + targets[0].toLowerCase().replace(/[^#a-z0-9]+/g, '') + '">' + Tools.escapeHTML(targets.slice(1).join(",")) + '</font>');
	},

	customavatars: 'customavatar',
	customavatar: (function () {
		const script = (function () {/*
			FILENAME=`mktemp`
			function cleanup {
				rm -f $FILENAME
			}
			trap cleanup EXIT

			set -xe

			timeout 10 wget "$1" -nv -O $FILENAME

			FRAMES=`identify $FILENAME | wc -l`
			if [ $FRAMES -gt 1 ]; then
				EXT=".gif"
			else
				EXT=".png"
			fi

			timeout 10 convert $FILENAME -layers TrimBounds -coalesce -adaptive-resize 80x80\> -background transparent -gravity center -extent 80x80 "$2$EXT"
		*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

		var pendingAdds = {};
		return function (target) {
			var parts = target.split(',');
			var cmd = parts[0].trim().toLowerCase();

			if (cmd in {'':1, show:1, view:1, display:1}) {
				var message = "";
				for (var a in Config.customAvatars)
					message += "<strong>" + Tools.escapeHTML(a) + ":</strong> " + Tools.escapeHTML(Config.customAvatars[a]) + "<br />";
				return this.sendReplyBox(message);
			}

			if (!this.can('customavatar')) return false;

			switch (cmd) {
				case 'set':
					var userid = toId(parts[1]);
					var user = Users.getExact(userid);
					var avatar = parts.slice(2).join(',').trim();

					if (!userid) return this.sendReply("You didn't specify a user.");
					if (Config.customAvatars[userid]) return this.sendReply(userid + " already has a custom avatar.");

					var hash = require('crypto').createHash('sha512').update(userid + '\u0000' + avatar).digest('hex').slice(0, 8);
					pendingAdds[hash] = {userid: userid, avatar: avatar};
					parts[1] = hash;

					if (!user) {
						this.sendReply("Warning: " + userid + " is not online.");
						this.sendReply("If you want to continue, use: /customavatar forceset, " + hash);
						return;
					}
					// Fallthrough

				case 'forceset':
					var hash = parts[1].trim();
					if (!pendingAdds[hash]) return this.sendReply("Invalid hash.");

					var userid = pendingAdds[hash].userid;
					var avatar = pendingAdds[hash].avatar;
					delete pendingAdds[hash];

					require('child_process').execFile('bash', ['-c', script, '-', avatar, './config/avatars/' + userid], (function (e, out, err) {
						if (e) {
							this.sendReply(userid + "'s custom avatar failed to be set. Script output:");
							(out + err).split('\n').forEach(this.sendReply.bind(this));
							return;
						}

						reloadCustomAvatars();
						this.sendReply(userid + "'s custom avatar has been set.");
					}).bind(this));
					break;

				case 'delete':
					var userid = toId(parts[1]);
					if (!Config.customAvatars[userid]) return this.sendReply(userid + " does not have a custom avatar.");

					if (Config.customAvatars[userid].toString().split('.').slice(0, -1).join('.') !== userid)
						return this.sendReply(userid + "'s custom avatar (" + Config.customAvatars[userid] + ") cannot be removed with this script.");
					require('fs').unlink('./config/avatars/' + Config.customAvatars[userid], (function (e) {
						if (e) return this.sendReply(userid + "'s custom avatar (" + Config.customAvatars[userid] + ") could not be removed: " + e.toString());

						delete Config.customAvatars[userid];
						this.sendReply(userid + "'s custom avatar removed successfully");
					}).bind(this));
					break;

				default:
					return this.sendReply("Invalid command. Valid commands are `/customavatar set, user, avatar` and `/customavatar delete, user`.");
			}
		};
	})(),

	gym: 'gymleaders',
	gymleaders: (function () {
		const gyms = [
			{
				name: "Psychic",
				leader: "Mike2936",
				rules: ["OU BATTLE", "6v6 BATTLE", "No Destiny Bond Wobbuffet"]
			},{
				name: "Water",
				leader: "Bowenn",
				rules: ["OU BATTLE", "6v6 BATTLE"]
			},{
				name: "Dark",
				leader: "DoctorJoey",
				rules: ["OU BATTLE", "6v6 BATTLE"]
			},{
				name: "Flying",
				leader: "ProfessorPsy",
				rules: ["OU BATTLE", "6v6 BATTLE"]
			},{
				name: "Dragon",
				leader: "Matias",
				rules: ["OU BATTLE", "6v6 BATTLE"]
			},{
				name: "Ice",
				leader: "XavierFlynt",
				rules: ["OU BATTLE", "6v6 BATTLE"]
			},{
				name: "Fire",
				leader: "Olearne",
				rules: ["OU BATTLE", "6v6 BATTLE"]
			},{
				name: "NeedWeed",
				leader: "Ground",
				rules: ["OU BATTLE", "6v6 BATTLE"]
			}
		];

		return function (target) {
			if (!this.canBroadcast()) return;

			var parts = target.split(',').map(function (p) { return p.trim(); });
			if (!parts[0]) parts = Object.keys(gyms).map(function (p) { return parseInt(p, 10) + 1; });

			var buffer = [];
			parts.forEach(function (part) {
				var gym = gyms[part - 1];
				if (!gym) {
					buffer.push("<center><strong>" + Tools.escapeHTML(part) + " is not a valid gym number</strong></center>");
					return;
				}


				buffer.push(
					"<center><strong>~Gym " + part + " - " + Tools.escapeHTML(gym.name) + " Gym~</strong></center>" +
					"<strong>~~Leader: " + Tools.escapeHTML(gym.leader) + "~~</strong><br />" +
					"<strong>~Gym Rules~</strong><br />"+
					"<ul>" +
						gym.rules.map(function (rule) { return '<li>' + Tools.escapeHTML(rule) + '</li>'; }).join('') +
					"</ul>"
				);
			});
			this.sendReplyBox(buffer.join('<br />'));
		};
	})(),

	donate: function () {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"<center><strong>~Donator Shop~</strong></center>" +
			"Donator rank = $3" +
			"<ul>" +
			"<li>Access to !cc</li>" +
			"<li>Donator rank symbol</li>" +
			"<li>Custom Avatar</li>" +
			"<li>Access to Donator Lounge</li>" +
			"<li>Access to new vip features</li>" +
			"</ul>" +
			"CONTACT (Krister or MarcusPareli) TO DONATE"
		);
	},

	/*********************************************************
	 * Help commands
	 *********************************************************/

	commands: 'help',
	h: 'help',
	'?': 'help',
	help: function (target, room, user) {
		target = target.toLowerCase();
		var roomType = room.auth ? room.type + 'Room' : 'global';
		var matched = false;
		if (target === 'all' || target === 'msg' || target === 'pm' || target === 'whisper' || target === 'w') {
			matched = true;
			this.sendReply("/msg OR /whisper OR /w [username], [message] - Send a private message.");
		}
		if (target === 'all' || target === 'r' || target === 'reply') {
			matched = true;
			this.sendReply("/reply OR /r [message] - Send a private message to the last person you received a message from, or sent a message to.");
		}
		if (target === 'all' || target === 'rating' || target === 'ranking' || target === 'rank' || target === 'ladder') {
			matched = true;
			this.sendReply("/rating - Get your own rating.");
			this.sendReply("/rating [username] - Get user's rating.");
		}
		if (target === 'all' || target === 'nick') {
			matched = true;
			this.sendReply("/nick [new username] - Change your username.");
		}
		if (target === 'all' || target === 'avatar') {
			matched = true;
			this.sendReply("/avatar [new avatar number] - Change your trainer sprite.");
		}
		if (target === 'all' || target === 'whois' || target === 'alts' || target === 'ip' || target === 'rooms') {
			matched = true;
			this.sendReply("/whois - Get details on yourself: alts, group, IP address, and rooms.");
			this.sendReply("/whois [username] - Get details on a username: alts (Requires: % @ & ~), group, IP address (Requires: @ & ~), and rooms.");
		}
		if (target === 'all' || target === 'data') {
			matched = true;
			this.sendReply("/data [pokemon/item/move/ability] - Get details on this pokemon/item/move/ability/nature.");
			this.sendReply("!data [pokemon/item/move/ability] - Show everyone these details. Requires: " + Users.getGroupsThatCan('broadcast', room).join(" "));
		}
		if (target === 'all' || target === 'details' || target === 'dt') {
			matched = true;
			this.sendReply("/details [pokemon] - Get additional details on this pokemon/item/move/ability/nature.");
			this.sendReply("!details [pokemon] - Show everyone these details. Requires: " + Users.getGroupsThatCan('broadcast', room).join(" "));
		}
		if (target === 'all' || target === 'analysis') {
			matched = true;
			this.sendReply("/analysis [pokemon], [generation] - Links to the Smogon University analysis for this Pokemon in the given generation.");
			this.sendReply("!analysis [pokemon], [generation] - Shows everyone this link. Requires: " + Users.getGroupsThatCan('broadcast', room).join(" "));
		}
		if (target === 'all' || target === 'groups') {
			matched = true;
			this.sendReply("/groups - Explains what the " + Config.groups[roomType + 'ByRank'].filter(function (g) { return g.trim(); }).join(" ") + " next to people's names mean.");
			this.sendReply("!groups - Show everyone that information. Requires: " + Users.getGroupsThatCan('broadcast', room).join(" "));
		}
		if (target === 'all' || target === 'opensource') {
			matched = true;
			this.sendReply("/opensource - Links to PS's source code repository.");
			this.sendReply("!opensource - Show everyone that information. Requires: " + Users.getGroupsThatCan('broadcast', room).join(" "));
		}
		if (target === 'all' || target === 'avatars') {
			matched = true;
			this.sendReply("/avatars - Explains how to change avatars.");
			this.sendReply("!avatars - Show everyone that information. Requires: " + Users.getGroupsThatCan('broadcast', room).join(" "));
		}
		if (target === 'all' || target === 'intro') {
			matched = true;
			this.sendReply("/intro - Provides an introduction to competitive pokemon.");
			this.sendReply("!intro - Show everyone that information. Requires: " + Users.getGroupsThatCan('broadcast', room).join(" "));
		}
		if (target === 'all' || target === 'cap') {
			matched = true;
			this.sendReply("/cap - Provides an introduction to the Create-A-Pokemon project.");
			this.sendReply("!cap - Show everyone that information. Requires: " + Users.getGroupsThatCan('broadcast', room).join(" "));
		}
		if (target === 'all' || target === 'om') {
			matched = true;
			this.sendReply("/om - Provides links to information on the Other Metagames.");
			this.sendReply("!om - Show everyone that information. Requires: " + Users.getGroupsThatCan('broadcast', room).join(" "));
		}
		if (target === 'all' || target === 'learn' || target === 'learnset' || target === 'learnall') {
			matched = true;
			this.sendReply("/learn [pokemon], [move, move, ...] - Displays how a Pokemon can learn the given moves, if it can at all.");
			this.sendReply("!learn [pokemon], [move, move, ...] - Show everyone that information. Requires: " + Users.getGroupsThatCan('broadcast', room).join(" "));
		}
		if (target === 'all' || target === 'calc' || target === 'calculator') {
			matched = true;
			this.sendReply("/calc - Provides a link to a damage calculator");
			this.sendReply("!calc - Shows everyone a link to a damage calculator. Requires: " + Users.getGroupsThatCan('broadcast', room).join(" "));
		}
		if (target === 'all' || target === 'blockchallenges' || target === 'away' || target === 'idle') {
			matched = true;
			this.sendReply("/away - Blocks challenges so no one can challenge you. Deactivate it with /back.");
		}
		if (target === 'all' || target === 'allowchallenges' || target === 'back') {
			matched = true;
			this.sendReply("/back - Unlocks challenges so you can be challenged again. Deactivate it with /away.");
		}
		if (target === 'all' || target === 'faq') {
			matched = true;
			this.sendReply("/faq [theme] - Provides a link to the FAQ. Add deviation, doubles, randomcap, restart, or staff for a link to these questions. Add all for all of them.");
			this.sendReply("!faq [theme] - Shows everyone a link to the FAQ. Add deviation, doubles, randomcap, restart, or staff for a link to these questions. Add all for all of them. Requires: " + Users.getGroupsThatCan('broadcast', room).join(" "));
		}
		if (target === 'all' || target === 'highlight') {
			matched = true;
			this.sendReply("Set up highlights:");
			this.sendReply("/highlight add, word - add a new word to the highlight list.");
			this.sendReply("/highlight list - list all words that currently highlight you.");
			this.sendReply("/highlight delete, word - delete a word from the highlight list.");
			this.sendReply("/highlight delete - clear the highlight list");
		}
		if (target === 'all' || target === 'timestamps') {
			matched = true;
			this.sendReply("Set your timestamps preference:");
			this.sendReply("/timestamps [all|lobby|pms], [minutes|seconds|off]");
			this.sendReply("all - change all timestamps preferences, lobby - change only lobby chat preferences, pms - change only PM preferences");
			this.sendReply("off - set timestamps off, minutes - show timestamps of the form [hh:mm], seconds - show timestamps of the form [hh:mm:ss]");
		}
		if (target === 'all' || target === 'effectiveness' || target === 'matchup' || target === 'eff' || target === 'type') {
			matched = true;
			this.sendReply("/effectiveness OR /matchup OR /eff OR /type [attack], [defender] - Provides the effectiveness of a move or type on another type or a Pokémon.");
			this.sendReply("!effectiveness OR !matchup OR !eff OR !type [attack], [defender] - Shows everyone the effectiveness of a move or type on another type or a Pokémon.");
		}
		if (target === 'all' || target === 'dexsearch' || target === 'dsearch' || target === 'ds') {
			matched = true;
			this.sendReply("/dexsearch [type], [move], [move], ... - Searches for Pokemon that fulfill the selected criteria.");
			this.sendReply("Search categories are: type, tier, color, moves, ability, gen.");
			this.sendReply("Valid colors are: green, red, blue, white, brown, yellow, purple, pink, gray and black.");
			this.sendReply("Valid tiers are: Uber/OU/BL/UU/BL2/RU/BL3/NU/LC/CAP.");
			this.sendReply("Types must be followed by ' type', e.g., 'dragon type'.");
			this.sendReply("Parameters can be excluded through the use of '!', e.g., '!water type' excludes all water types.");
			this.sendReply("The parameter 'mega' can be added to search for Mega Evolutions only, and the parameters 'FE' or 'NFE' can be added to search fully or not-fully evolved Pokemon only.");
			this.sendReply("The order of the parameters does not matter.");
		}
		if (target === 'all' || target === 'dice' || target === 'roll') {
			matched = true;
			this.sendReply("/dice [optional max number] - Randomly picks a number between 1 and 6, or between 1 and the number you choose.");
			this.sendReply("/dice [number of dice]d[number of sides] - Simulates rolling a number of dice, e.g., /dice 2d4 simulates rolling two 4-sided dice.");
		}
		if (target === 'all' || target === 'pick' || target === 'pickrandom') {
			matched = true;
			this.sendReply("/pick [option], [option], ... - Randomly selects an item from a list containing 2 or more elements.");
		}
		if (target === 'all' || target === 'join') {
			matched = true;
			this.sendReply("/join [roomname] - Attempts to join the room [roomname].");
		}
		if (target === 'all' || target === 'ignore') {
			matched = true;
			this.sendReply("/ignore [user] - Ignores all messages from the user [user].");
			this.sendReply("Note that staff messages cannot be ignored.");
		}
		if (target === 'all' || target === 'invite') {
			matched = true;
			this.sendReply("/invite [username], [roomname] - Invites the player [username] to join the room [roomname].");
		}
		if (Users.can(target, 'lock') || target === 'lock' || target === 'l') {
			matched = true;
			this.sendReply("/lock OR /l [username], [reason] - Locks the user from talking in all chats. Requires: " + Users.getGroupsThatCan('lock', room).join(" "));
		}
		if (Users.can(target, 'lock') || target === 'unlock') {
			matched = true;
			this.sendReply("/unlock [username] - Unlocks the user. Requires: " + Users.getGroupsThatCan('lock', room).join(" "));
		}
		if (Users.can(target, 'redirect') || target === 'redirect' || target === 'redir') {
			matched = true;
			this.sendReply("/redirect or /redir [username], [roomname] - Attempts to redirect the user [username] to the room [roomname]. Requires: " + Users.getGroupsThatCan('redirect', room).join(" "));
		}
		if (Users.can(target, 'staff') || target === 'modnote') {
			matched = true;
			this.sendReply("/modnote [note] - Adds a moderator note that can be read through modlog. Requires: " + Users.getGroupsThatCan('staff', room).join(" "));
		}
		if (Users.can(target, 'forcerename') || target === 'forcerename' || target === 'fr') {
			matched = true;
			this.sendReply("/forcerename OR /fr [username], [reason] - Forcibly change a user's name and shows them the [reason]. Requires: " + Users.getGroupsThatCan('forcerename').join(" "));
		}
		if (Users.can(target, 'ban') || target === 'roomban') {
			matched = true;
			this.sendReply("/roomban [username] - Bans the user from the room you are in. Requires: " + Users.getGroupsThatCan('ban', room).join(" "));
		}
		if (Users.can(target, 'ban') || target === 'roomunban') {
			matched = true;
			this.sendReply("/roomunban [username] - Unbans the user from the room you are in. Requires: " + Users.getGroupsThatCan('ban', room).join(" "));
		}
		if (Users.can(target, 'ban') || target === 'ban') {
			matched = true;
			this.sendReply("/ban OR /b [username], [reason] - Kick user from all rooms and ban user's IP address with reason. Requires: " + Users.getGroupsThatCan('ban').join(" "));
		}
		if (Users.can(target, 'roompromote') || target === 'roompromote') {
			matched = true;
			this.sendReply("/roompromote [username], [group] - Promotes the user to the specified group or next ranked group. Requires: " + Users.getGroupsThatCan('roompromote', room).join(" "));
		}
		if (Users.can(target, 'roompromote') || target === 'roomdemote') {
			matched = true;
			this.sendReply("/roomdemote [username], [group] - Demotes the user to the specified group or previous ranked group. Requires: " + Users.getGroupsThatCan('roompromote', room).join(" "));
		}
		if (Users.can(target, 'rangeban') || target === 'banip') {
			matched = true;
			this.sendReply("/banip [ip] - Kick users on this IP or IP range from all rooms and bans it. Accepts wildcards to ban ranges. Requires: " + Users.getGroupsThatCan('rangeban').join(" "));
		}
		if (Users.can(target, 'rangeban') || target === 'unbanip') {
			matched = true;
			this.sendReply("/unbanip [ip] - Kick users on this IP or IP range from all rooms and bans it. Accepts wildcards to ban ranges. Requires: " + Users.getGroupsThatCan('rangeban').join(" "));
		}
		if (Users.can(target, 'ban') || target === 'unban') {
			matched = true;
			this.sendReply("/unban [username] - Unban a user. Requires: " + Users.getGroupsThatCan('ban').join(" "));
		}
		if (Users.can(target, 'ban') || target === 'unbanall') {
			matched = true;
			this.sendReply("/unbanall - Unban all IP addresses. Requires: " + Users.getGroupsThatCan('ban').join(" "));
		}
		if (Users.can(target, 'staff') || target === 'modlog') {
			matched = true;
			this.sendReply("/modlog [roomid|all], [n] - Roomid defaults to current room. If n is a number or omitted, display the last n lines of the moderator log. Defaults to 15. If n is not a number, search the moderator log for 'n' on room's log [roomid]. If you set [all] as [roomid], searches for 'n' on all rooms's logs. Requires: " + Users.getGroupsThatCan('staff', room).join(" "));
		}
		if (Users.can(target, 'kick') || target === 'kickbattle ') {
			matched = true;
			this.sendReply("/kickbattle [username], [reason] - Kicks a user from a battle with reason. Requires: " + Users.getGroupsThatCan('kick').join(" "));
		}
		if (Users.can(target, 'warn') || target === 'warn' || target === 'k') {
			matched = true;
			this.sendReply("/warn OR /k [username], [reason] - Warns a user showing them the Pokemon Showdown Rules and [reason] in an overlay. Requires: " + Users.getGroupsThatCan('warn', room).join(" "));
		}
		if (Users.can(target, 'mute') || target === 'mute' || target === 'm') {
			matched = true;
			this.sendReply("/mute OR /m [username], [reason] - Mutes a user with reason for 7 minutes. Requires: " + Users.getGroupsThatCan('mute', room).join(" "));
		}
		if (Users.can(target, 'mute') || target === 'hourmute' || target === 'hm') {
			matched = true;
			this.sendReply("/hourmute OR /hm [username], [reason] - Mutes a user with reason for an hour. Requires: " + Users.getGroupsThatCan('mute', room).join(" "));
		}
		if (Users.can(target, 'mute') || target === 'unmute' || target === 'um') {
			matched = true;
			this.sendReply("/unmute [username] - Removes mute from user. Requires: " + Users.getGroupsThatCan('mute', room).join(" "));
		}
		if (Users.can(target, 'promote') || target === 'promote') {
			matched = true;
			this.sendReply("/promote [username], [group] - Promotes the user to the specified group or next ranked group. Requires: " + Users.getGroupsThatCan('promote').join(" "));
		}
		if (Users.can(target, 'promote') || target === 'demote') {
			matched = true;
			this.sendReply("/demote [username], [group] - Demotes the user to the specified group or previous ranked group. Requires: " + Users.getGroupsThatCan('promote').join(" "));
		}
		if (Users.can(target, 'forcewin') || target === 'forcetie') {
			matched = true;
			this.sendReply("/forcetie - Forces the current match to tie. Requires: " + Users.getGroupsThatCan('forcewin').join(" "));
		}
		if (Users.can(target, 'declare') || target === 'showimage') {
			matched = true;
			this.sendReply("/showimage [url], [width], [height] - Show an image. Requires: " + Users.getGroupsThatCan('declare', room).join(" "));
		}
		if (Users.can(target, 'declare') || target === 'declare') {
			matched = true;
			this.sendReply("/declare [message] - Anonymously announces a message. Requires: " + Users.getGroupsThatCan('declare', room).join(" "));
		}
		if (Users.can(target, 'gdeclare') || target === 'chatdeclare' || target === 'cdeclare') {
			matched = true;
			this.sendReply("/cdeclare [message] - Anonymously announces a message to all chatrooms on the server. Requires: " + Users.getGroupsThatCan('gdeclare').join(" "));
		}
		if (Users.can(target, 'gdeclare') || target === 'globaldeclare' || target === 'gdeclare') {
			matched = true;
			this.sendReply("/globaldeclare [message] - Anonymously announces a message to every room on the server. Requires: " + Users.getGroupsThatCan('gdeclare').join(" "));
		}
		if (target === '~' || target === 'htmlbox') {
			matched = true;
			this.sendReply("/htmlbox [message] - Displays a message, parsing HTML code contained. Requires: ~ # with global authority");
		}
		if (Users.can(target, 'announce') || target === 'announce' || target === 'wall') {
			matched = true;
			this.sendReply("/announce OR /wall [message] - Makes an announcement. Requires: " + Users.getGroupsThatCan('announce', room).join(" "));
		}
		if (Users.can(target, 'modchat') || target === 'modchat') {
			matched = true;
			this.sendReply("/modchat [off/autoconfirmed/" +
				Config.groups[roomType + 'ByRank'].filter(function (g) { return g.trim(); }).join("/") +
				"] - Set the level of moderated chat. Requires: " +
				Users.getGroupsThatCan('modchat', room).join(" ") +
				" for off/autoconfirmed/" +
				Config.groups[roomType + 'ByRank'].slice(0, 2).filter(function (g) { return g.trim(); }).join("/") +
				" options, " +
				Users.getGroupsThatCan('modchatall', room).join(" ") +
				" for all the options");
		}
		if (Users.can(target, 'hotpatch') || target === 'hotpatch') {
			matched = true;
			this.sendReply("Hot-patching the game engine allows you to update parts of Showdown without interrupting currently-running battles. Requires: " + Users.getGroupsThatCan('hotpatch').join(" "));
			this.sendReply("Hot-patching has greater memory requirements than restarting.");
			this.sendReply("/hotpatch chat - reload chat-commands.js");
			this.sendReply("/hotpatch battles - spawn new simulator processes");
			this.sendReply("/hotpatch formats - reload the tools.js tree, rebuild and rebroad the formats list, and also spawn new simulator processes");
		}
		if (Users.can(target, 'lockdown') || target === 'lockdown') {
			matched = true;
			this.sendReply("/lockdown - locks down the server, which prevents new battles from starting so that the server can eventually be restarted. Requires: " + Users.getGroupsThatCan('lockdown').join(" "));
		}
		if (Users.can(target, 'lockdown') || target === 'kill') {
			matched = true;
			this.sendReply("/kill - kills the server. Can't be done unless the server is in lockdown state. Requires: " + Users.getGroupsThatCan('lockdown').join(" "));
		}
		if (Users.can(target, 'hotpatch') || target === 'loadbanlist') {
			matched = true;
			this.sendReply("/loadbanlist - Loads the bans located at ipbans.txt. The command is executed automatically at startup. Requires: " + Users.getGroupsThatCan('hotpatch').join(" "));
		}
		if (Users.can(target, 'makeroom') || target === 'makechatroom') {
			matched = true;
			this.sendReply("/makechatroom [roomname] - Creates a new room named [roomname]. Requires: " + Users.getGroupsThatCan('makeroom').join(" "));
		}
		if (Users.can(target, 'makeroom') || target === 'deregisterchatroom') {
			matched = true;
			this.sendReply("/deregisterchatroom [roomname] - Deletes room [roomname] after the next server restart. Requires: " + Users.getGroupsThatCan('makeroom').join(" "));
		}
		if (Users.can(target, 'roompromote', Config.groups[roomType + 'ByRank'].slice(-1)[0]) || target === 'roomowner') {
			matched = true;
			this.sendReply("/roomowner [username] - Appoints [username] as a room owner. Removes official status. Requires: " + Users.getGroupsThatCan('roompromote', Config.groups[roomType + 'ByRank'].slice(-1)[0]).join(" "));
		}
		if (Users.can(target, 'roompromote', Config.groups[roomType + 'ByRank'].slice(-1)[0]) || target === 'roomdeowner') {
			matched = true;
			this.sendReply("/roomdeowner [username] - Removes [username]'s status as a room owner. Requires: " + Users.getGroupsThatCan('roompromote', Config.groups[roomType + 'ByRank'].slice(-1)[0]).join(" "));
		}
		if (Users.can(target, 'privateroom') || target === 'privateroom') {
			matched = true;
			this.sendReply("/privateroom [on/off] - Makes or unmakes a room private. Requires: " + Users.getGroupsThatCan('privateroom', room).join(" "));
		}
		if (target === 'all' || target === 'help' || target === 'h' || target === '?' || target === 'commands') {
			matched = true;
			this.sendReply("/help OR /h OR /? - Gives you help.");
		}
		if (target === 'all' || target === 'krister' || target === 'kris') {
			matched = true;
			this.sendReply("Krister is super cool !");
		}
		if (!target) {
			this.sendReply("COMMANDS: /nick, /avatar, /rating, /whois, /msg, /reply, /ignore, /away, /back, /timestamps, /highlight");
			this.sendReply("INFORMATIONAL COMMANDS: /data, /dexsearch, /groups, /opensource, /avatars, /faq, /rules, /intro, /tiers, /othermetas, /learn, /analysis, /calc (replace / with ! to broadcast. (Requires: " + Users.getGroupsThatCan('broadcast', room).join(" ") + "))");
			this.sendReply("For details on all room commands, use /roomhelp");
			this.sendReply("For details on all commands, use /help all");
			if (user.group !== Config.groups.default[roomType]) {
				this.sendReply("DRIVER COMMANDS: /warn, /mute, /unmute, /alts, /forcerename, /modlog, /lock, /unlock, /announce, /redirect");
				this.sendReply("MODERATOR COMMANDS: /ban, /unban, /ip");
				this.sendReply("LEADER COMMANDS: /declare, /forcetie, /forcewin, /promote, /demote, /banip, /unbanall");
				this.sendReply("For details on all moderator commands, use /help " + Users.getGroupsThatCan('staff', room)[0]);
			}
			this.sendReply("For details of a specific command, use something like: /help data");
		} else if (!matched) {
			this.sendReply("The command '" + target + "' was not found. Try /help for general help");
		}
	},

};
