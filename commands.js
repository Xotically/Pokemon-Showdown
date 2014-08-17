/**
 * System commands
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * These are system commands - commands required for Pokemon Showdown
 * to run. A lot of these are sent by the client.
 *
 * If you'd like to modify commands, please go to config/commands.js,
 * which also teaches you how to use commands.
 *
 * @license MIT license
 */

var crypto = require('crypto');
var fs = require('fs');

const MAX_REASON_LENGTH = 300;

if (typeof shop == "undefined") setTimeout(function() {shop = require('./shop.js').shop;}, 3000);
/*--------------
	nightclub
  --------------*/
urlify = function(str) {return str.replace(/(https?\:\/\/[a-z0-9-.]+(\/([^\s]*[^\s?.,])?)?|[a-z0-9]([a-z0-9-\.]*[a-z0-9])?\.(com|org|net|edu|tk)((\/([^\s]*[^\s?.,])?)?|\b))/ig, '<a href="$1" target="_blank">$1</a>').replace(/<a href="([a-z]*[^a-z:])/g, '<a href="http://$1').replace(/(\bgoogle ?\[([^\]<]+)\])/ig, '<a href="http://www.google.com/search?ie=UTF-8&q=$2" target="_blank">$1</a>').replace(/(\bgl ?\[([^\]<]+)\])/ig, '<a href="http://www.google.com/search?ie=UTF-8&btnI&q=$2" target="_blank">$1</a>').replace(/(\bwiki ?\[([^\]<]+)\])/ig, '<a href="http://en.wikipedia.org/w/index.php?title=Special:Search&search=$2" target="_blank">$1</a>').replace(/\[\[([^< ]([^<`]*?[^< ])?)\]\]/ig, '<a href="http://www.google.com/search?ie=UTF-8&btnI&q=$1" target="_blank">$1</a>');}
nightclub = new Object();
function colorify(given_text){
	var sofar = "";
	var splitting = given_text.split("");
	var text_length = given_text.length;
	var colorification = true;
	var beginningofend = false;
	for (var i in splitting) {
		if (splitting[i] == "<" && splitting[i + 1] != "/") {
			//open tag <>
			colorification = false;
		}
		if (splitting[i] == "/" && splitting[i -  1] == "<") {
			//closing tag </>
			//find exact spot
			beginningofend = i;
		}
		if (beginningofend && splitting[i - 1] == ">") {
			colorification = true;
			beginningofend = false;
		}
		var letters = 'ABCDE'.split('');
		var color = "";
		for (var f = 0; f < 6; f++) {
			color += letters[Math.floor(Math.random() * letters.length)];
		}
		if (colorification) {
			if (splitting[i] == " ") sofar += " "; else sofar += "<font color='" + "#" + color + "'>" + splitting[i] + "</font>";
		} else sofar += splitting[i];

	}
	return sofar;
}
 
function colorify_absolute(given_text){
	var sofar = "";
	var splitting = given_text.split("");
	var text_length = given_text.length;
	for (i = 0; i < text_length; i++) {
		var color = (Math.random()*(0xFFFFFF+1)<<0).toString(16);
		if (splitting[i] == " ") sofar += " "; else sofar += "<font color='" + "#" + color + "'>" + splitting[i] + "</font>";
	}
	return sofar;
}
nightclubify = colorify;
/*--------------
	demfeels
  --------------*/
demfeels = ["batming","blu","china","coo","creep","cry","dad1","dad2","dafuq","datass","dazza1","dd","deal","dealw","disgust","drow","duckwat","duclol","Dx","eleming","evild","excite","falone","feel","feelsal","feelsbd","feelsbeard","feelsbn","feelsbr","feelsbu","feelscanada","feelsce","feelscommy","feelscr","feelscute","feelsdd","feelsde","feelsdr","feelsduke","feelseye","feelsgd","feelsgn","feelsgt","feelshitler","feelshp","feelshr","feelsht","feelsjew","feelsmario","feelsmd","feelsmoke","feelsms","feelsmug","feelsnv","feelsok","feelsold","feelspink","feelsq","feelsrs","feelssc","feelsscr","feelssp","feelsusa","feelsvp","feelswg","feelswp","feelsws","feelsww","feelszb","fliptbl","foreveralone","fuu","fuu2","fuumar","fyeah","g","goatse","gtfo","hellyeah","hface","hipnig","hmm","how","how3","how4","kid1","ling","lolnig","man","maybe","megusta","ming","mit","mit3","mit4","mog","nface","nface2","nggawat","nggwat","nicetit","nigcook","nigcry","nigglet","nighuh","nigig","niglad","nigleaf","niglol","nigmar","nigmonk","nignig","nignod","nigoof","nigrin","nigwho","nigya","ning","no","nomegusta","notbad","notsure","ohgod","okay","okay2","omd","omg","oshit","pedo","pface","pff","pirate","pirate2","santa","santrl","seewat","serious","sir","smellsgd","smugob","srs","srsno","taylor","ting","trldrum","trlfing","trollface","w","wat","who","win1","wtf","wtf2","wut","xa","XD","xd2","xe","yay","yds","yeayou","yes","yface","yuno","2cute","ahuevo","aing","alakno","allfeel","awd","babed"];
/*--------------
	spamroom
  --------------*/
if (typeof spamroom == "undefined") {
	spamroom = new Object();
}
if (!Rooms.rooms.spamroom) {
	Rooms.rooms.spamroom = new Rooms.ChatRoom("spamroom", "spamroom");
	Rooms.rooms.spamroom.isPrivate = true;
}
setTimeout(function() {
	commands.msg = function (target, room, user) {
		if (!target) return this.parse('/help msg');
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!target) {
			this.sendReply("You forgot the comma.");
			return this.parse('/help msg');
		}
		if (!targetUser || !targetUser.connected) {
			if (targetUser && !targetUser.connected) {
				this.popupReply("User " + this.targetUsername + " is offline.");
			} else if (!target) {
				this.popupReply("User " + this.targetUsername + " not found. Did you forget a comma?");
			} else {
				this.popupReply("User "  + this.targetUsername + " not found. Did you misspell their name?");
			}
			return this.parse('/help msg');
		}

		if (Config.pmmodchat) {
			var userGroup = user.group;
			if (Config.groupsranking.indexOf(userGroup) < Config.groupsranking.indexOf(Config.pmmodchat)) {
				var groupName = Config.groups[Config.pmmodchat].name || Config.pmmodchat;
				this.popupReply("Because moderated chat is set, you must be of rank " + groupName + " or higher to PM users.");
				return false;
			}
		}

		if (user.locked && !targetUser.can('lock', user)) {
			return this.popupReply("You can only private message members of the moderation team (users marked by %, @, &, or ~) when locked.");
		}
		if (targetUser.locked && !user.can('lock', targetUser)) {
			return this.popupReply("This user is locked and cannot PM.");
		}
		if (targetUser.ignorePMs && !user.can('lock')) {
			if (!targetUser.can('lock')) {
				return this.popupReply("This user is blocking Private Messages right now.");
			} else if (targetUser.can('hotpatch')) {
				return this.popupReply("This admin is too busy to answer Private Messages right now. Please contact a different staff member.");
			}
		}

		target = this.canTalk(target, null);
		if (!target) return false;

		var message = '|pm|' + user.getIdentity() + '|' + targetUser.getIdentity() + '|' + target;
		user.send(message);
		//spamroom shit
		// if user is not in spamroom
		if(spamroom[user.userid] === undefined){
				// check to see if an alt exists in list
				for(var u in spamroom){
						if(Users.get(user.userid) === Users.get(u)){
								// if alt exists, add new user id to spamroom, break out of loop.
								spamroom[user.userid] = true;
								break;
						}
				}
		}

		if (user.userid in spamroom) {
				Rooms.rooms.spamroom.add('|c|' + user.getIdentity() + '|(__Private to ' + targetUser.getIdentity()+ "__) " + target );
		} else {
				if (targetUser !== user) targetUser.send(message);
				targetUser.lastPM = user.userid;
		}
		user.lastPM = targetUser.userid;
	};
}, 1000);

var announcement = "";
fs.readFile('./announcement.html', function(err, data) {
	if (err) return;
	data = ('' + data).split("\n").join("");
	announcement = data;
});

var broadcast = {
	url: ""
};
var commands = exports.commands = {
		'rated': function(target, room, user) {
			if (!this.can('hotpatch')) return false;
			room.rated = true;
			room.addRaw('This battle is now rated.');
		},
		
    ud: 'urbandefine',
    urbandefine: function (target, room, user) {
				if (typeof request == "undefined") request = require('request');
        if (!this.canBroadcast()) return;
        if (!target) return this.parse('/help urbandefine')
        if (target > 50) return this.sendReply('Phrase can not be longer than 50 characters.');

        var self = this;
        var options = {
            url: 'http://www.urbandictionary.com/iphone/search/define',
            term: target,
            headers: {
                'Referer': 'http://m.urbandictionary.com'
            },
            qs: {
                'term': target
            }
        };

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                var page = JSON.parse(body);
                var definitions = page['list'];
                if (page['result_type'] == 'no_results') {
                    self.sendReplyBox('No results for <b>"' + Tools.escapeHTML(target) + '"</b>.');
                    return room.update();
                } else {
                    if (!definitions[0]['word'] || !definitions[0]['definition']) {
                        self.sendReplyBox('No results for <b>"' + Tools.escapeHTML(target) + '"</b>.');
                        return room.update();
                    }
                    var output = '<b>' + Tools.escapeHTML(definitions[0]['word']) + ':</b> ' + Tools.escapeHTML(definitions[0]['definition']).replace(/\r\n/g, '<br />').replace(/\n/g, ' ');
                    if (output.length > 400) output = output.slice(0, 400) + '...';
                    self.sendReplyBox(output);
                    return room.update();
                }
            }
        }
        request(options, callback);
    },

    def: 'define',
    define: function (target, room, user) {
				if (typeof request == "undefined") request = require('request');
        if (!this.canBroadcast()) return;
        if (!target) return this.parse('/help define');
        target = toId(target);
        if (target > 50) return this.sendReply('Word can not be longer than 50 characters.');

        var self = this;
        var options = {
            url: 'http://api.wordnik.com:80/v4/word.json/' + target + '/definitions?limit=3&sourceDictionaries=all' +
                '&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5',
        };

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                var page = JSON.parse(body);
                var output = '<font color="blueviolet"><b>Definitions for ' + target + ':</b></font><br />';
                if (!page[0]) {
                    self.sendReplyBox('No results for <b>"' + target + '"</b>.');
                    return room.update();
                } else {
                    var count = 1;
                    for (var u in page) {
                        if (count > 3) break;
                        output += '(' + count + ') ' + page[u]['text'] + '<br />';
                        count++;
                    }
                    self.sendReplyBox(output);
                    return room.update();
                }
            }
        }
        request(options, callback);
    },

	update: function(target, room, user) {
		if (!this.can('hotpatch')) return false;
		
		this.parse('/hotpatch chat');
		this.parse('/updateshop');
		CommandParser.uncacheTree('./tour.js');
		tour = require('./tour.js').tour(tour);
		return this.sendReply("Updated chat commands, booty-bot, the shop, and legit tour scripts.");
	},
	customclient: function(target, room, user, connection, cmd, message) {
		user.customClient = true;
		if (broadcast.url) for (var i in user.connections) user.connections[i].send('|broadcast|' + broadcast.url);
	},
	broadcast: function(target, room, user, connection, cmd, message) {
		var videoid = target.split("?v=");
		if (videoid.length - 1 == 0) return false;
		videoid = videoid[1].substr(0, 11);
		if (videoid.length != 11) return false;
		var url = "http://youtube.com/embed/" + videoid + "?autoplay=1";
		broadcast.url = url;
		room.addRaw("For those of you on the <a href='' target='_BLANK'>custom client</a>, " + user.name + " just broadcasted " + target + ". OK? OK.");
		for (var i in room.users) if (room.users[i].customClient) for (var x in room.users[i].connections) room.users[i].connections[x].send('|broadcast|' + url);
	},
	customclients: 'ccs',
	cccount: 'ccs',
	ccs: function(target, room, user, connection, cmd, message) {
		var insides = '';
		var count = 0;
		for (var i in room.users) {
			if (room.users[i].customClient) {
				insides += room.users[i].name + ", ";
				count++;
			}
		}
		this.sendReply('|raw|<b>Custom Client Users:</b> ' + insides + '<br /><b>Users on custom client:</b> ' + count);
	},
	announcement: function(target, room, user, connection, cmd, message) {
		if (!this.can('hotpatch')) return this.sendReply('Access denied.');
		if (!target) return this.sendReply(announcement);
		announcement = target;
		fs.writeFile('./announcement.html', target);
		this.sendReply('Announcement updated.');
	},
    debug: function (target, room, user, connection, cmd, message) {
        if (!user.hasConsoleAccess(connection)) {
            return this.sendReply('/debug - Access denied.');
        }
        if (!this.canBroadcast()) return;
 
        if (!this.broadcasting) this.sendReply('||>> ' + target);
        try {
            var battle = room.battle;
            var me = user;
            if (target.indexOf('-h') >= 0 || target.indexOf('-help') >= 0) {
                return this.sendReplyBox('This is a custom eval made by CreaturePhil for easier debugging.<br/>' +
                    '<b>-h</b> OR <b>-help</b>: show all options<br/>' +
                    '<b>-k</b>: object.keys of objects<br/>' +
                    '<b>-r</b>: reads a file<br/>' +
                    '<b>-p</b>: returns the current high-resolution real time in a second and nanoseconds. This is for speed/performance tests.');
            }
            if (target.indexOf('-k') >= 0) {
                target = 'Object.keys(' + target.split('-k ')[1] + ');';
            }
            if (target.indexOf('-r') >= 0) {
                this.sendReply('||<< Reading... ' + target.split('-r ')[1]);
                return this.popupReply(eval('fs.readFileSync("' + target.split('-r ')[1] + '","utf-8");'));
            }
            if (target.indexOf('-p') >= 0) {
                target = 'var time = process.hrtime();' + target.split('-p')[1] + 'var diff = process.hrtime(time);this.sendReply("|raw|<b>High-Resolution Real Time Benchmark:</b><br/>"+"Seconds: "+(diff[0] + diff[1] * 1e-9)+"<br/>Nanoseconds: " + (diff[0] * 1e9 + diff[1]));';
            }
            this.sendReply('||<< ' + eval(target));
        } catch (e) {
            this.sendReply('||<< error: ' + e.message);
            var stack = '||' + ('' + e.stack).replace(/\n/g, '\n||');
            connection.sendTo(room, stack);
        }
    },
	img: function(target, room, user, connection) {
		if (!this.can('broadcast')) return this.sendReply('Not enough auth.');
		target = target.split(',');
		var extra = "";
		if (target.length - 1 >= 1) extra += " width='" + target[1] + "'";
		if (target.length - 1 >= 2) extra += " height='" + target[2] + "'";
		room.addRaw(user.name + ': <img src="' + target[0] + '"' + extra + ' />');
	},
	
	
kick: 'k',
	k: function(target, room, user) {
		if (!this.can('ban')) return false;
		target = this.splitTarget(target);
		targetUser = this.targetUser;
		if (!targetUser) return this.sendReply('/kick - Kicks a user from the room.');
		targetUser.leaveRoom(room);
		return this.add(user.name+' has kicked '+targetUser.name+' from the room.');
	},	
	
	
	
	
	
	
	
	/*--------------
		nightclub
	  --------------*/
	nightclub: function(target, room, user, connection) {
		if (!this.can('broadcast')) return this.sendReply('You must at least be voice in order to force us all to be disco dancing freakazoids.');
		if (nightclub[room.id]) return this.sendReply('This room is already engulfed in nightclubness.');
		nightclub[room.id] = true;
		room.addRaw('<div class="nightclub"><font size=6>' + nightclubify('LETS GET FITZY!! nightclub mode: ON!!!') + '</font><font size="2"> started by: ' + user.userid + '</font></div>');
	},
	dayclub: function(target, room, user, connection) {
		if (!this.can('broadcast')) return this.sendReply('You must at least be voice in order to force us all to stop dancin\'.');
		if (!nightclub[room.id]) return this.sendReply('This room is already in broad daylight.');
		delete nightclub[room.id];
		room.addRaw('<div class="nightclub"><font size=6>' + nightclubify('sizzle down now... nightclub mode: off.') + '</font><font size="2"> ended by: ' + user.userid + '</font></font>');
	},
	/*--------------
		spamroom
	  --------------*/
	spam: 'spamroom',
	spammer: 'spamroom',
	spamroom: function(target, room, user, connection) {
		var target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.sendReply('The user \'' + this.targetUsername + '\' does not exist.');
		}
		if (!this.can('mute', targetUser)) {
			return false;
		}
		if (spamroom[targetUser]) {
			return this.sendReply('That user\'s messages are already being redirected to the spamroom.');
		}
		spamroom[targetUser] = true;
		Rooms.rooms['spamroom'].add('|raw|<b>' + this.targetUsername + ' was added to the spamroom list.</b>');
		this.logModCommand(targetUser + ' was added to spamroom by ' + user.name);
		return this.sendReply(this.targetUsername + ' was successfully added to the spamroom list.');
	},

	unspam: 'unspamroom',
	unspammer: 'unspamroom',
	unspamroom: function(target, room, user, connection) {
		var target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.sendReply('The user \'' + this.targetUsername + '\' does not exist.');
		}
		if (!this.can('mute', targetUser)) {
			return false;
		}
		if (!spamroom[targetUser]) {
			return this.sendReply('That user is not in the spamroom list.');
		}
		for(var u in spamroom)
			if(targetUser == Users.get(u))
				delete spamroom[u];
		Rooms.rooms['spamroom'].add('|raw|<b>' + this.targetUsername + ' was removed from the spamroom list.</b>');
		this.logModCommand(targetUser + ' was removed from spamroom by ' + user.name);
		return this.sendReply(this.targetUsername + ' and their alts were successfully removed from the spamroom list.');
	},	
	/*--------------
		normal commands
	  --------------*/
	version: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox("Server version: <b>" + CommandParser.package.version + "</b>");
	},

	me: function (target, room, user, connection) {
		// By default, /me allows a blank message
		if (target) target = this.canTalk(target);
		if (!target) return;

		return '/me ' + target;
	},

	
hex: function (target, room, user) {
		if (!this.canBroadcast()) return;
		if(!target){
			this.sendReplyBox('<center><b>Your name\'s hexcode is:<font color="'+hashColor(''+toId(user.name)+'')+'"> '+hashColor(''+toId(user.name)+''));
			return;
		}
		if(target.indexOf('#') < 0){
			this.sendReplyBox('Please include the \'#\' symbol');
			return false;
		}
		var verify = /^#[0-9A-F]{6}$/i;
		if(verify.test(target)){
			this.sendReplyBox('<center><b><font size="5" color="' + target + '">' + target + '</font></b></center>');
		}else{
			this.sendReplyBox('Could not find a valid color to match your hex code');
		}
	},	
	
	
poof: 'd',
	d: function(target, room, user){
		if(room.id !== 'lobby') return false;
		muted = Object.keys(user.mutedRooms);
		for (var u in muted) if (muted[u] == 'lobby') return this.sendReply('You can\'t poof while muted');
		var btags = '<strong><font color='+hashColor(Math.random().toString())+'" >';
		var etags = '</font></strong>'
		var targetid = toId(user);
		if(target){
			var tar = toId(target);
			var targetUser = Users.get(tar);
			if(user.can('poof', targetUser)){
				if(!targetUser){
					user.emit('console', 'Cannot find user ' + target + '.', socket);	
				}else{
					var escapedName = escapeHTML(targetUser.name);
					var escapedUser = escapeHTML(user.name);
					if(poofeh)
						Rooms.rooms.lobby.addRaw(btags + '~~ '+escapedName+' was vanished into nothingness by ' + escapedUser +'! ~~' + etags);
						targetUser.disconnectAll();
						return	this.logModCommand(targetUser.name+ ' was poofed by ' + user.name);
					}
				} else {
					return this.sendReply('/poof target - Access denied.');
				}
			}
		if(poofeh && !user.locked){
			Rooms.rooms.lobby.addRaw(btags + getRandMessage(user)+ etags);
			user.disconnectAll();	
		}else{
			return this.sendReply('poof is currently disabled.');
		}
	},

	
poofoff: 'nopoof',
	nopoof: function(target, room, user){
		if(!user.can('warn')) return this.sendReply('/nopoof - Access denied.');
		if(!poofeh) return this.sendReply('poof is currently disabled.');
		poofeh = false;
		this.logModCommand(user.name + ' disabled poof.');
		return this.sendReply('poof is now disabled.');
	},	
	

poofon: function(target, room, user){
		if(!user.can('warn')) return this.sendReply('/poofon - Access denied.');
		if(poofeh) return this.sendReply('poof is currently enabled.');
		poofeh = true;
		this.logModCommand(user.name + ' enabled poof');
		return this.sendReply('poof is now enabled.');
	},
	

cpoof: function(target, room, user){
		if(!user.can('broadcast') && !user.vip) return this.sendReply('/cpoof - Access Denied');
		if (!target) return this.sendReply('/cpoof - Please specify a custom poof message to use.');
		if (target.length > 100) return this.sendReply('/cpoof - Poof messages can\'t be longer than 100 characters.');
		if(poofeh) {
			var btags = '<strong><font color="'+hashColor(Math.random().toString())+'" >';
			var etags = '</font></strong>'
			escapedTarget = escapeHTML(target);
			Rooms.rooms.lobby.addRaw(btags + '~~ '+user.name+' '+escapedTarget+'! ~~' + etags);
			this.logModCommand(user.name + ' used a custom poof message: \n "'+target+'"');
			user.disconnectAll();	
		}else{
			return this.sendReply('Poof is currently disabled.');
		}
	},

	
	
	
	
	
	
	
	
	mee: function (target, room, user, connection) {
		// By default, /mee allows a blank message
		if (target) target = this.canTalk(target);
		if (!target) return;

		return '/mee ' + target;
	},

	avatar: function (target, room, user) {
		if (!target) return this.parse('/avatars');
		var parts = target.split(',');
		var avatar = parseInt(parts[0]);
		if (!avatar || avatar > 294 || avatar < 1) {
			if (!parts[1]) {
				this.sendReply("Invalid avatar.");
			}
			return false;
		}

		user.avatar = avatar;
		if (!parts[1]) {
			this.sendReply("Avatar changed to:\n" +
				'|raw|<img src="//play.pokemonshowdown.com/sprites/trainers/' + avatar + '.png" alt="" width="80" height="80" />');
		}
	},

	
	
	
	
	
	
	
	logout: function (target, room, user) {
		user.resetName();
	},

restart: function(target, room, user) {
                if (!this.can('lockdown')) return false;

                if (!Rooms.global.lockdown) {
                        return this.sendReply('For safety reasons, /restart can only be used during lockdown.');
                }

                if (CommandParser.updateServerLock) {
                        return this.sendReply('Wait for /updateserver to finish before using /kill.');
                }
                this.logModCommand(user.name + ' used /restart');
                var exec = require('child_process').exec;
                exec('./restart.sh');
                Rooms.global.send('|refresh|');
        },	
	

spop: 'sendpopup',
sendpopup: function(target, room, user) {
if (!this.can('hotpatch')) return false;

target = this.splitTarget(target);
var targetUser = this.targetUser;

if (!targetUser) return this.sendReply('/sendpopup [user], [message] - You missed the user');
if (!target) return this.sendReply('/sendpopup [user], [message] - You missed the message');

targetUser.popup(target);
this.sendReply(targetUser.name + ' got the message as popup: ' + target);

targetUser.send(user.name+' sent a popup message to you.');

this.logModCommand(user.name+' send a popup message to '+targetUser.name);
},	
	
	
masspm: 'pmall',
pmall: function(target, room, user) {
if (!target) return this.parse('/pmall [message] - Sends a PM to every user in a room.');
if (!this.can('pban')) return false;

var pmName = '~Johto Server [Do Not Reply]';

for (var i in Users.users) {
var message = '|pm|'+pmName+'|'+Users.users[i].getIdentity()+'|'+target;
Users.users[i].send(message);
}
},	
	
pb: 'permaban',
pban: 'permaban',
        permban: 'permaban',
        permaban: function(target, room, user) {
                if (!target) return this.sendReply('/permaban [username] - Permanently bans the user from the server. Bans placed by this command do not reset on server restarts. Requires: & ~');
                if (!this.can('pban')) return false;
                target = this.splitTarget(target);
                var targetUser = this.targetUser;
                if (!targetUser) {
                        return this.sendReply('User '+this.targetUsername+' not found.');
                }
                if (Users.checkBanned(targetUser.latestIp) && !target && !targetUser.connected) {
                        var problem = ' but was already banned';
                        return this.privateModCommand('('+targetUser.name+' would be banned by '+user.name+problem+'.)');
                }
               
                targetUser.popup(user.name+" has permanently banned you.");
                this.addModCommand(targetUser.name+" was permanently banned by "+user.name+".");
this.add('|unlink|' + targetUser.userid);
                targetUser.ban();
                ipbans.write('\n'+targetUser.latestIp);
        },


control: function (target, room, user) {
        if (!this.can('control')) return;
        var parts = target.split(',');

        if (parts.length < 3) return this.parse('/help control');

        if (parts[1].trim().toLowerCase() === 'say') {
            return room.add('|c|' + Users.get(parts[0].trim()).group + Users.get(parts[0].trim()).name + '|' + parts[2].trim());
        }
        if (parts[1].trim().toLowerCase() === 'pm') {
            return Users.get(parts[2].trim()).send('|pm|' + Users.get(parts[0].trim()).group + Users.get(parts[0].trim()).name + '|' + Users.get(parts[2].trim()).group + Users.get(parts[2].trim()).name + '|' + parts[3].trim());
        }
    },


model: 'sprite',
sprite: function(target, room, user) {
        if (!this.canBroadcast()) return;
var targets = target.split(',');
target = targets[0];
target1 = targets[1];
if (target.toLowerCase().indexOf(' ') !== -1) {
target.toLowerCase().replace(/ /g,'-');
}
        if (target.toLowerCase().length < 4) {
        return this.sendReply('Model not found.');
        }
var numbers = ['1','2','3','4','5','6','7','8','9','0'];
for (var i = 0; i < numbers.length; i++) {
if (target.toLowerCase().indexOf(numbers) == -1 && target.toLowerCase() !== 'porygon2') {
        
        

if (target && !target1) {
        return this.sendReply('|html|<img src = "http://www.pkparaiso.com/imagenes/xy/sprites/animados/'+target.toLowerCase().trim().replace(/ /g,'-')+'.gif">');
        }
if (toId(target1) == 'back' || toId(target1) == 'shiny' || toId(target1) == 'front') {
if (target && toId(target1) == 'back') {
        return this.sendReply('|html|<img src = "http://play.pokemonshowdown.com/sprites/xyani-back/'+target.toLowerCase().trim().replace(/ /g,'-')+'.gif">');
}
if (target && toId(target1) == 'shiny') {
        return this.sendReply('|html|<img src = "http://play.pokemonshowdown.com/sprites/xyani-shiny/'+target.toLowerCase().trim().replace(/ /g,'-')+'.gif">');
}
if (target && toId(target1) == 'front') {
        return this.sendReply('|html|<img src = "http://www.pkparaiso.com/imagenes/xy/sprites/animados/'+target.toLowerCase().trim().replace(/ /g,'-')+'.gif">');
}
}

} else {
return this.sendReply('Model not found.');
}
}
},
	
	
donate: function(target, room, user) {
if (!this.canBroadcast()) return;
this.sendReplyBox('<center>Like this server and want to help keep the server running?<br /><a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=4PHAVXW3SHVCG"><img src="https://www.paypalobjects.com/en_AU/i/btn/btn_donate_SM.gif" /></a><br />Donations over $5 will get you a custom avatar! The money will go towards paying for the server.<br />After you\'ve donated, PM Champion Legit, or Champion Iyan to receive your avatar</center>');
},
	
	
pas: 'pmallstaff',
pmallstaff: function(target, room, user) {
if (!target) return this.sendReply('/pmallstaff [message] - Sends a PM to every user in a room.');
if (!this.can('pban')) return false;
for (var u in Users.users) { if (Users.users[u].isStaff) {
Users.users[u].send('|pm|~Staff PM|'+Users.users[u].group+Users.users[u].name+'|'+target+' (by: '+user.name+')'); }
}
},roomauth: function(target, room, user, connection) {
if (!room.auth) return this.sendReply("/roomauth - This room isn't designed for per-room moderation and therefore has no auth list.");
var buffer = [];
var owners = [];
var admins = [];
var leaders = [];
var mods = [];
var drivers = [];
var voices = [];

room.owners = ''; room.admins = ''; room.leaders = ''; room.mods = ''; room.drivers = ''; room.voices = '';
for (var u in room.auth) {
if (room.auth[u] == '#') {
room.owners = room.owners +u+',';
}
if (room.auth[u] == '~') {
room.admins = room.admins +u+',';
}
if (room.auth[u] == '&') {
room.leaders = room.leaders +u+',';
}
if (room.auth[u] == '@') {
room.mods = room.mods +u+',';
}
if (room.auth[u] == '%') {
room.drivers = room.drivers +u+',';
}
if (room.auth[u] == '+') {
room.voices = room.voices +u+',';
}
}

if (!room.founder) founder = '';
if (room.founder) founder = room.founder;

room.owners = room.owners.split(',');
room.mods = room.mods.split(',');
room.drivers = room.drivers.split(',');
room.voices = room.voices.split(',');

for (var u in room.owners) {
if (room.owners[u] != '') owners.push(room.owners[u]);
}
for (var u in room.mods) {
if (room.mods[u] != '') mods.push(room.mods[u]);
}
for (var u in room.drivers) {
if (room.drivers[u] != '') drivers.push(room.drivers[u]);
}
for (var u in room.voices) {
if (room.voices[u] != '') voices.push(room.voices[u]);
}
if (owners.length > 0) {
owners = owners.join(', ');
}
if (mods.length > 0) {
mods = mods.join(', ');
}
if (drivers.length > 0) {
drivers = drivers.join(', ');
}
if (voices.length > 0) {
voices = voices.join(', ');
}
connection.popup('Room Auth in "'+room.id+'"\n\n**Founder**: \n'+founder+'\n**Owner(s)**: \n'+owners+'\n**Moderator(s)**: \n'+mods+'\n**Driver(s)**: \n'+drivers+'\n**Voice(s)**: \n'+voices);
},	
		

stafflist: 'stafflist',
stafflist: function(target, room, user, connection) {
        var buffer = [];
        var admins = [];
        var leaders = [];
        var mods = [];
        var drivers = [];
        var voices = [];
        
        admins2 = ''; leaders2 = ''; mods2 = ''; drivers2 = ''; voices2 = '';
        stafflist = fs.readFileSync('config/usergroups.csv','utf8');
        stafflist = stafflist.split('\n');
        for (var u in stafflist) {
            line = stafflist[u].split(',');
if (line[1] == '~') {
                admins2 = admins2 +line[0]+',';
            }
            if (line[1] == '&') {
                leaders2 = leaders2 +line[0]+',';
            }
            if (line[1] == '@') {
                mods2 = mods2 +line[0]+',';
            }
            if (line[1] == '%') {
                drivers2 = drivers2 +line[0]+',';
            }
            if (line[1] == '+') {
                voices2 = voices2 +line[0]+',';
             }
        }
        admins2 = admins2.split(',');
        leaders2 = leaders2.split(',');
        mods2 = mods2.split(',');
        drivers2 = drivers2.split(',');
        voices2 = voices2.split(',');
        for (var u in admins2) {
            if (admins2[u] != '') admins.push(admins2[u]);
        }
        for (var u in leaders2) {
            if (leaders2[u] != '') leaders.push(leaders2[u]);
        }
        for (var u in mods2) {
            if (mods2[u] != '') mods.push(mods2[u]);
        }
        for (var u in drivers2) {
            if (drivers2[u] != '') drivers.push(drivers2[u]);
        }
        for (var u in voices2) {
            if (voices2[u] != '') voices.push(voices2[u]);
        }
        if (admins.length > 0) {
            admins = admins.join(', ');
        }
        if (leaders.length > 0) {
            leaders = leaders.join(', ');
        }
        if (mods.length > 0) {
            mods = mods.join(', ');
        }
        if (drivers.length > 0) {
            drivers = drivers.join(', ');
        }
        if (voices.length > 0) {
            voices = voices.join(', ');
        }
        connection.popup('Johto Staff list \n\n**Administrators**: \n'+admins+'\n**Leaders**: \n'+leaders+'\n**Moderators**: \n'+mods+'\n**Drivers**: \n'+drivers+'\n**Voices**: \n'+voices);
},		
	

tpm: 'tourpm',
tourpm: function(target, room, user) {
if (!target) return this.parse('/tourpm [message] - Sends a PM to every user in a room.');
if (!this.can('pban')) return false;

var pmName = '~Tournaments Note';

for (var i in Users.users) {
var message = '|pm|'+pmName+'|'+Users.users[i].getIdentity()+'|'+target;
Users.users[i].send(message);
}
},


openshop: function(target, room, user) {
		if (!user.can('hotpatch')) return this.sendReply('You do not have enough authority to do this.');

		if (!closeShop && closedShop === 1) closedShop--;

		if (!closeShop) {
			return this.sendRepy('The shop is already closed. Use /closeshop to close the shop to buyers.');
		}
		else if (closeShop) {
			if (closedShop === 0) {
				this.sendReply('Are you sure you want to open the shop? People will be able to buy again. If you do, use the command again.');
				closedShop++;
			}
			else if (closedShop === 1) {
				closeShop = false;
				closedShop--;
				this.add('|raw|<center><h4><b>The shop has been opened, you can now buy from the shop.</b></h4></center>');
			}
		}
	},


lockshop: 'closeshop',
	closeshop: function(target, room, user) {
		if (!user.can('hotpatch')) return this.sendReply('You do not have enough authority to do this.');

		if(closeShop && closedShop === 1) closedShop--;

		if (closeShop) {
			return this.sendReply('The shop is already closed. Use /openshop to open the shop to buyers.');
		}
		else if (!closeShop) {
			if (closedShop === 0) {
				this.sendReply('Are you sure you want to close the shop? People will not be able to buy anything. If you do, use the command again.');
				closedShop++;
			}
			else if (closedShop === 1) {
				closeShop = true;
				closedShop--;
				this.add('|raw|<center><h4><b>The shop has been temporarily closed, during this time you cannot buy items.</b></h4></center>');
			}
		}
	},

	

badgelist: 'badgeslist',
	badgeslist: function(target, room, user){
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<b>This is a list of badges and how you can earn them.</b><br/>' +
		'<img src="http://i.imgur.com/5Dy544w.png" title="is a Super Moderator">Super Moderator - Become a very active moderator.<br/>'+
		'<img src="http://i.imgur.com/oyv3aga.png" title="is a Developer">Developer - Become a coder for the server.<br/>'+
		'<img src="http://i.imgur.com/lfPYzFG.png" title="is a Server Host">Server Host - Become a host of the server.<br/>'+
		'<img src="http://i.imgur.com/oeKdHgW.png" title="is a Recruiter">Recruiter - Recruit people to the server consecutively and consistently.<br/>'+
		'<img src="http://i.imgur.com/yPAXWE9.png" title="is a Tournament Director">Tournament Director - Invite people and host tournaments consecutively and consistently in the server.<br/>' +
		'<img src="http://i.imgur.com/EghmFiY.png" title="is a Frequenter">Frequenter - Consistently and frequently comes to the server. Time estimate for earning this badge is around two to three weeks.');
	},
	
	
hide: function(target, room, user) {
		if (this.can('lock')) {
			user.getIdentity = function(){
				if(this.muted)	return '!' + this.name;
				if(this.locked) return '?' + this.name;
				return ' ' + this.name;
			};
			user.updateIdentity();
			this.sendReply('You have hidden your staff symbol.');
			return false;
		}
	},	
	

show: function(target, room, user) {
		if (this.can('lock')) {
			delete user.getIdentity
			user.updateIdentity();
			this.sendReply('You have revealed your staff symbol.');
			return false;
		}
	},


/*********************************************************
	 * Money and Shop
	 *********************************************************/
	 
	jackpot: function(target, room, user) {
		if (!this.canBroadcast()) return;
		return this.sendReplyBox('The current jackpot is '+jackpot+' bucks.');
	},
	
	gamble: function(target, room, user) {
		if (!this.canBroadcast()) return;
		var amount = readMoney('money', user.userid);
		target = target.split(',');
		if (!target[0] || !target[1]) return this.sendReply('/gamble [amount],[roll] - Rolls a 12-sided dice. If your roll matches the dice\'s roll, your bet amount multiplies by 11, else, you lose that amount.');

		if ((Math.floor(Math.random()*500)+1) == 1) {
			var jackpotwin = jackpot;
		 	writeMoney('money', user.userid, jackpotwin);
		 	return this.sendReply('You won the jackpot. Congratulations, you win '+jackpotwin+' bucks!');
		}

		var dice = Math.floor(Math.random()*12)+1;
		if (target[0] < 1) return this.sendReply('You can\'t gamble less than 0.');
		if (target[0] % 1 != 0 || target[1] % 1 != 0) return this.sendReply('No decimals.');
		if (target[0] > amount) return this.sendReply('You can\'t bet more than you have.');
		if (target[1] > 12 || target[1] < 1) return this.sendReply('The roll number has to be between 1 and 12');
		if (isNaN(target[0]) || isNaN(target[1])) return this.sendReply("Funny, now enter in a real number.");


		if (target[1] == dice) {
			writeMoney('money', user.userid, target[0]*11);
			return this.sendReplyBox('You gambled on '+target[1]+' and the dice rolled '+dice+'. Congratulations, you win!');
		} else {
			writeMoney('money', user.userid, -target[0]);
			return this.sendReplyBox('You gambled on '+target[1]+' and the dice rolled '+dice+'. You lost, sorry.');
		}
	},	
	

clearall: function (target, room, user) {
        if (!this.can('clearall')) return;
        var len = room.log.length,
            users = [];
        while (len--) {
            room.log[len] = '';
        }
        for (var user in room.users) {
            users.push(user);
            Users.get(user).leaveRoom(room, Users.get(user).connections[0]);
        }
        len = users.length;
        setTimeout(function() {
            while (len--) {
                Users.get(users[len]).joinRoom(room, Users.get(users[len]).connections[0]);
            }
        }, 1000);
    },
	

emoticons: function (target, room, user) {
         if (!this.canBroadcast()) return;
         return this.sendReplyBox(
             '<b><u>Emoticons are case-sensitive:</b></u> <br/>' +
             '<img src="http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-ebf60cd72f7aa600-24x18.png">:) ' +
             '<img src="http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-ae4e17f5b9624e2f-24x18.png">:O ' +
             '<img src="http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-d570c4b3b8d8fc4d-24x18.png">:( ' +
             '<img src="http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-cfaf6eac72fe4de6-24x18.png">;) ' +
             '<img src="http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-e838e5e34d9f240c-24x18.png">:P ' +
             '<img src="http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-374120835234cb29-24x18.png">:/ ' +
             '<img src="http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-3407bf911ad2fd4a-24x18.png">;P ' +
             '<img src="http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-2cde79cfe74c6169-24x18.png">B) ' +
             '<img src="http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-8e128fa8dc1de29c-24x18.png">O_o ' +
             '<img src="http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-0536d670860bf733-24x18.png">R) ' +
             '<img src="http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-9f2ac5d4b53913d7-24x18.png">:D ' +
             '<img src="http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-b9cbb6884788aa62-24x18.png">:z ' +
             '<img src="http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-f124d3a96eff228a-41x28.png">BloodTrail ' +
             '<img src="http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-f6c13c7fc0a5c93d-36x30.png">BibleThump ' +
             '<img src="http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-76292ac622b0fc38-20x30.png"> 4Head ' +
             '<img src="http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-ddc6e3a8732cb50f-25x28.png">Kappa ' +
             '<img src="http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-60aa1af305e32d49-23x30.png">PogChamp ' +
             '<img src="http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-1ddcc54d77fc4a61-28x28.png">ResidentSleeper ' +
             '<img src="http://static-cdn.jtvnw.net/jtv_user_pictures/emoticon-3227-src-77d12eca2603dde0-28x28.png">crtNova ' +
             '<img src="http://static-cdn.jtvnw.net/jtv_user_pictures/emoticon-3228-src-d4b613767d7259c4-28x28.png">crtSSoH ' +
             '<img src="http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-5d019b356bd38360-24x24.png">SSSsss ' +
             '<img src="http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-680b6b3887ef0d17-21x28.png">SwiftRage ' +
             '<img src="http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-ce52b18fccf73b29-25x32.png">DansGame ' +
             '<img src="http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-3a624954918104fe-19x27.png">Kreygasm ' +
             '<img src="http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-c8a77ec0c49976d3-22x30.png">FailFish ' +
             '<img src="http://static-cdn.jtvnw.net/jtv_user_pictures/emoticon-10413-src-9e30fb4e8b42c21a-28x28.png">pikaQQ ' +
             '<img src="http://e.deviantart.net/emoticons/n/ninja.gif">:ninja: ' +
             '<img src="http://e.deviantart.net/emoticons/k/katana.gif">:katana: ' +
             '<img src="http://e.deviantart.net/emoticons/n/ninjabattle.gif">:ninjabattle: ' +
             '<img src="http://e.deviantart.net/emoticons/j/jawdrop.gif">:jawdrop:' +
			 '<img src="https://s.yimg.com/lq/i/mesg/emoticons7/19.gif">:devil:' +
			 '<img src="http://e.deviantart.net/emoticons/h/heart.gif">:heart:' +
			 '<img src="https://s.yimg.com/lq/i/mesg/emoticons7/46.gif">:sigh:' +
			 '<img src="http://www.sherv.net/cm/emo/lol/moving-lol.gif">LOL' +
			 '<img src="http://e.deviantart.net/emoticons/t/tears.gif">:cry:' +
			 '<img src="http://e.deviantart.net/emoticons/l/lmao.gif">:lmao: ' +
			 '<img src="http://e.deviantart.net/emoticons/a/above.gif">^' +
             '<img src="http://e.deviantart.net/emoticons/h/hump.gif">:hump:'
         );
     },
	
	
/*********************************************************
	* Nature Commands                                  
	*********************************************************/
	nature: 'n',
        n: function(target, room, user) {
                if (!this.canBroadcast()) return;
                target = target.toLowerCase();
                target = target.trim();
                var matched = false;
                if (target === 'hardy') {
                        matched = true;
                        this.sendReplyBox('<b>Hardy</b>: <font color="blue"><b>Neutral</b></font>');
                }
                if (target === 'lonely' || target ==='+atk -def') {
                        matched = true;
                        this.sendReplyBox('<b>Lonely</b>: <font color="green"><b>Attack</b></font>, <font color="red"><b>Defense</b></font>');
                }
                if (target === 'brave' || target ==='+atk -spe') {
                        matched = true;
                        this.sendReplyBox('<b>Brave</b>: <font color="green"><b>Attack</b></font>, <font color="red"><b>Speed</b></font>');
                }
                if (target === 'adamant' || target === '+atk -spa') {
                        matched = true;
                        this.sendReplyBox('<b>Adamant</b>: <font color="green"><b>Attack</b></font>, <font color="red"><b>Special Attack</b></font>');
                }
                if (target === 'naughty' || target ==='+atk -spd') {
                        matched = true;
                        this.sendReplyBox('<b>Naughty</b>: <font color="green"><b>Attack</b></font>, <font color="red"><b>Special Defense</b></font>');
                }
                if (target === 'bold' || target ==='+def -atk') {
                        matched = true;
                        this.sendReplyBox('<b>Bold</b>: <font color="green"><b>Defense</b></font>, <font color="red"><b>Attack</b></font>');
                }
                if (target === 'docile') {
                        matched = true;
                        this.sendReplyBox('<b>Docile</b>: <font color="blue"><b>Neutral</b></font>');
                }
                if (target === 'relaxed' || target ==='+def -spe') {
                        matched = true;
                        this.sendReplyBox('<b>Relaxed</b>: <font color="green"><b>Defense</b></font>, <font color="red"><b>Speed</b></font>');
                }
                if (target === 'impish' || target ==='+def -spa') {
                        matched = true;
                        this.sendReplyBox('<b>Impish</b>: <font color="green"><b>Defense</b></font>, <font color="red"><b>Special Attack</b></font>');
                }
                if (target === 'lax' || target ==='+def -spd') {
                        matched = true;
                        this.sendReplyBox('<b>Lax</b>: <font color="green"><b>Defense</b></font>, <font color="red"><b>Special Defense</b></font>');
                }
                if (target === 'timid' || target ==='+spe -atk') {
                        matched = true;
                        this.sendReplyBox('<b>Timid</b>: <font color="green"><b>Speed</b></font>, <font color="red"><b>Attack</b></font>');
                }
                if (target ==='hasty' || target ==='+spe -def') {
                        matched = true;
                        this.sendReplyBox('<b>Hasty</b>: <font color="green"><b>Speed</b></font>, <font color="red"><b>Defense</b></font>');
                }
                if (target ==='serious') {
                        matched = true;
                        this.sendReplyBox('<b>Serious</b>: <font color="blue"><b>Neutral</b></font>');
                }
                if (target ==='jolly' || target ==='+spe -spa') {
                        matched= true;
                        this.sendReplyBox('<b>Jolly</b>: <font color="green"><b>Speed</b></font>, <font color="red"><b>Special Attack</b></font>');
                }
                if (target==='naive' || target ==='+spe -spd') {
                        matched = true;
                        this.sendReplyBox('<b>NaÃƒÂ¯ve</b>: <font color="green"><b>Speed</b></font>, <font color="red"><b>Special Defense</b></font>');
                }
                if (target==='modest' || target ==='+spa -atk') {
                        matched = true;
                        this.sendReplyBox('<b>Modest</b>: <font color="green"><b>Special Attack</b></font>, <font color="red"><b>Attack</b></font>');
                }
                if (target==='mild' || target ==='+spa -def') {
                        matched = true;
                        this.sendReplyBox('<b>Mild</b>: <font color="green"><b>Special Attack</b></font>, <font color="red"><b>Defense</b></font>');
                }
                if (target==='quiet' || target ==='+spa -spe') {
                        matched = true;
                        this.sendReplyBox('<b>Quiet</b>: <font color="green"><b>Special Attack</b></font>, <font color="red"><b>Speed</b></font>');
                }
                if (target==='bashful') {
                        matched = true;
                        this.sendReplyBox('<b>Bashful</b>: <font color="blue"><b>Neutral</b></font>');
                }
                if (target ==='rash' || target === '+spa -spd') {
                        matched = true;
                        this.sendReplyBox('<b>Rash</b>: <font color="green"><b>Special Attack</b></font>, <font color="red"><b>Special Defense</b></font>');
                }
                if (target==='calm' || target ==='+spd -atk') {
                        matched = true;
                        this.sendReplyBox('<b>Calm</b>: <font color="green"><b>Special Defense</b></font>, <font color="red"><b>Attack</b></font>');
                }
                if (target==='gentle' || target ==='+spd -def') {
                        matched = true;
                        this.sendReplyBox('<b>Gentle</b>: <font color="green"><b>Special Defense</b></font>, <font color="red"><b>Defense</b></font>');
                }
                if (target==='sassy' || target ==='+spd -spe') {
                        matched = true;
                        this.sendReplyBox('<b>Sassy</b>: <font color="green"><b>Special Defense</b></font>, <font color="red"><b>Speed</b></font>');
                }
                if (target==='careful' || target ==='+spd -spa') {
                        matched = true;
                        this.sendReplyBox('<b>Careful<b/>: <font color="green"><b>Special Defense</b></font>, <font color="red"><b>Special Attack</b></font>');
                }
                if (target==='quirky') {
                        matched = true;
                        this.sendReplyBox('<b>Quirky</b>: <font color="blue"><b>Neutral</b></font>');
                }
                if (target === 'plus attack' || target === '+atk') {
                        matched = true;
                        this.sendReplyBox("<b>+ Attack Natures: Lonely, Adamant, Naughty, Brave</b>");
                }
                if (target=== 'plus defense' || target === '+def') {
                        matched = true;
                        this.sendReplyBox("<b>+ Defense Natures: Bold, Impish, Lax, Relaxed</b>");
                }
                if (target === 'plus special attack' || target === '+spa') {
                        matched = true;
                        this.sendReplyBox("<b>+ Special Attack Natures: Modest, Mild, Rash, Quiet</b>");
                }
                if (target === 'plus special defense' || target === '+spd') {
                        matched = true;
                        this.sendReplyBox("<b>+ Special Defense Natures: Calm, Gentle, Careful, Sassy</b>");
                }
                if (target === 'plus speed' || target === '+spe') {
                        matched = true;
                        this.sendReplyBox("<b>+ Speed Natures: Timid, Hasty, Jolly, NaÃƒÆ’Ã‚Â¯ve</b>");
                }
                if (target === 'minus attack' || target==='-atk') {
                        matched = true;
                        this.sendReplyBox("<b>- Attack Natures: Bold, Modest, Calm, Timid</b>");
                }
                if (target === 'minus defense' || target === '-def') {
                        matched = true;
                        this.sendReplyBox("<b>-Defense Natures: Lonely, Mild, Gentle, Hasty</b>");
                }
                if (target === 'minus special attack' || target === '-spa') {
                        matched = true;
                        this.sendReplyBox("<b>-Special Attack Natures: Adamant, Impish, Careful, Jolly</b>");
                }
                if (target ==='minus special defense' || target === '-spd') {
                        matched = true;
                        this.sendReplyBox("<b>-Special Defense Natures: Naughty, Lax, Rash, NaÃƒÆ’Ã‚Â¯ve</b>");
                }
                if (target === 'minus speed' || target === '-spe') {
                        matched = true;
                        this.sendReplyBox("<b>-Speed Natures: Brave, Relaxed, Quiet, Sassy</b>");
                }
                if (!target) {
                        this.sendReply('/nature [nature] OR /nature [+increase -decrease] - tells you the increase and decrease of that nature.');
                }
                if (!matched) {
                        this.sendReply('Nature "'+target+'" not found. Check your spelling?');
                }
        },

	



	



	
	
	
	r: 'reply',
	reply: function (target, room, user) {
		if (!target) return this.parse('/help reply');
		if (!user.lastPM) {
			return this.sendReply("No one has PMed you yet.");
		}
		return this.parse('/msg ' + (user.lastPM || '') + ', ' + target);
	},




	
	
	
	
	
	
	pm: 'msg',
	whisper: 'msg',
	w: 'msg',
	msg: function (target, room, user) {
		if (!target) return this.parse('/help msg');
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!target) {
			this.sendReply("You forgot the comma.");
			return this.parse('/help msg');
		}
		if (!targetUser || !targetUser.connected) {
			if (targetUser && !targetUser.connected) {
				this.popupReply("User " + this.targetUsername + " is offline.");
			} else if (!target) {
				this.popupReply("User " + this.targetUsername + " not found. Did you forget a comma?");
			} else {
				this.popupReply("User "  + this.targetUsername + " not found. Did you misspell their name?");
			}
			return this.parse('/help msg');
		}

		if (Config.pmmodchat) {
			var userGroup = user.group;
			if (Config.groupsranking.indexOf(userGroup) < Config.groupsranking.indexOf(Config.pmmodchat)) {
				var groupName = Config.groups[Config.pmmodchat].name || Config.pmmodchat;
				this.popupReply("Because moderated chat is set, you must be of rank " + groupName + " or higher to PM users.");
				return false;
			}
		}

		if (user.locked && !targetUser.can('lock', user)) {
			return this.popupReply("You can only private message members of the moderation team (users marked by %, @, &, or ~) when locked.");
		}
		if (targetUser.locked && !user.can('lock', targetUser)) {
			return this.popupReply("This user is locked and cannot PM.");
		}
		if (targetUser.ignorePMs && !user.can('lock')) {
			if (!targetUser.can('lock')) {
				return this.popupReply("This user is blocking Private Messages right now.");
			} else if (targetUser.can('hotpatch')) {
				return this.popupReply("This admin is too busy to answer Private Messages right now. Please contact a different staff member.");
			}
		}

		target = this.canTalk(target, null);
		if (!target) return false;

		var message = '|pm|' + user.getIdentity() + '|' + targetUser.getIdentity() + '|' + target;
		user.send(message);
		if (targetUser !== user) targetUser.send(message);
		targetUser.lastPM = user.userid;
		user.lastPM = targetUser.userid;
	},

	blockpm: 'ignorepms',
	blockpms: 'ignorepms',
	ignorepm: 'ignorepms',
	ignorepms: function (target, room, user) {
		if (user.ignorePMs) return this.sendReply("You are already blocking Private Messages!");
		if (user.can('lock') && !user.can('hotpatch')) return this.sendReply("You are not allowed to block Private Messages.");
		user.ignorePMs = true;
		return this.sendReply("You are now blocking Private Messages.");
	},

	unblockpm: 'unignorepms',
	unblockpms: 'unignorepms',
	unignorepm: 'unignorepms',
	unignorepms: function (target, room, user) {
		if (!user.ignorePMs) return this.sendReply("You are not blocking Private Messages!");
		user.ignorePMs = false;
		return this.sendReply("You are no longer blocking Private Messages.");
	},

	makechatroom: function (target, room, user) {
		if (!this.can('makeroom')) return;
		var id = toId(target);
		if (!id) return this.parse('/help makechatroom');
		if (Rooms.rooms[id]) return this.sendReply("The room '" + target + "' already exists.");
		if (Rooms.global.addChatRoom(target)) {
			return this.sendReply("The room '" + target + "' was created.");
		}
		return this.sendReply("An error occurred while trying to create the room '" + target + "'.");
	},

	deregisterchatroom: function (target, room, user) {
		if (!this.can('makeroom')) return;
		var id = toId(target);
		if (!id) return this.parse('/help deregisterchatroom');
		var targetRoom = Rooms.get(id);
		if (!targetRoom) return this.sendReply("The room '" + target + "' doesn't exist.");
		target = targetRoom.title || targetRoom.id;
		if (Rooms.global.deregisterChatRoom(id)) {
			this.sendReply("The room '" + target + "' was deregistered.");
			this.sendReply("It will be deleted as of the next server restart.");
			return;
		}
		return this.sendReply("The room '" + target + "' isn't registered.");
	},

	
sca: 'giveavatar',
	setcustomavatar: 'giveavatar',
	setcustomavi: 'giveavatar',
	giveavatar: function(target, room, user, connection) {
        if (!this.can('giveavatar')) return this.sendReply('/giveavatar - Access denied.');
        try { 
            request = require('request');
        } catch (e) {
            return this.sendReply('/giveavatar requires the request module. Please run "npm install request" before using this command.');
        }
        if (!target) return this.sendReply('Usage: /giveavatar [username], [image] - Gives [username] the image specified as their avatar. -' +
            'Images are required to be .PNG or .GIF. Requires: & ~');
        parts = target.split(',');
        if (!parts[0] || !parts[1]) return this.sendReply('Usage: /giveavatar [username], [image] - Gives [username] the image specified as their avatar. -<br />' +
            'Images are required to be .PNG or .GIF. Requires: & ~');
        targetUser = Users.get(parts[0].trim());
        filename = parts[1].trim();
        uri = filename;
        filename = targetUser.userid + filename.slice(filename.toLowerCase().length - 4,filename.length);
        filetype = filename.slice(filename.toLowerCase().length - 4,filename.length);
        if (filetype != '.png' && filetype != '.gif') {
            return this.sendReply('/giveavatar - Invalid image format. Images are required to be in either PNG or GIF format.');
        }
        if (!targetUser) return this.sendReply('User '+target+' not found.');
        self = this;
        var download = function(uri, filename, callback) {
            request.head(uri, function(err, res, body) {
                var r = request(uri).pipe(fs.createWriteStream('config/avatars/'+filename));
                r.on('close', callback);
            });
        };
        download(uri, filename, function(err, res, body){
            if (err) return console.log('/giveavatar error: '+err);
            fs.readFile('config/avatars.csv','utf8',function(err, data) {
                if (err) return self.sendReply('/giveavatar erred: '+e.stack);
                match = false;
                var row = (''+data).split("\n");
                var line = '';
                for (var i = row.length; i > -1; i--) {
                    if (!row[i]) continue;
                    var parts = row[i].split(",");
                    if (targetUser.userid == parts[0]) {
                        match = true;
                        line = line + row[i];
                        break;
                    }
                }
                if (match === true) {
                    var re = new RegExp(line,"g");
                    var result = data.replace(re, targetUser.userid+','+filename);
                    fs.writeFile('config/avatars.csv', result, 'utf8', function (err) {
                        if (err) return console.log(err);
                    });
			for (var u in Users.customAvatars) {
				var column = Users.customAvatars[u].split(',');
				if (column[0] == targetUser.userid) {
					Users.customAvatars[u] = targetUser.userid+','+filename;
					break;
				}
			}
                } else {
                    fs.appendFile('config/avatars.csv','\n'+targetUser.userid+','+filename);
                    Users.customAvatars.push(targetUser.userid+','+filename);
                }
                
                targetUser.sendTo(room, 'You have received a custom avatar from ' + user.name + '.');
                for (var u in Users.users) {
                    if (Users.users[u].group == "~" || Users.users[u].group == "&") {
                        
                    }
                }
                
                if (filetype == '.gif' && targetUser.canAnimatedAvatar) targetUser.canAnimatedAvatar = false;
                if (filetype == '.png' && targetUser.canCustomAvatar) targetUser.canCustomAvatar = false;
            });
        });
	},	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	privateroom: function (target, room, user) {
		if (!this.can('privateroom', null, room)) return;
		if (target === 'off') {
			delete room.isPrivate;
			this.addModCommand("" + user.name + " made this room public.");
			if (room.chatRoomData) {
				delete room.chatRoomData.isPrivate;
				Rooms.global.writeChatRoomData();
			}
		} else {
			room.isPrivate = true;
			this.addModCommand("" + user.name + " made this room private.");
			if (room.chatRoomData) {
				room.chatRoomData.isPrivate = true;
				Rooms.global.writeChatRoomData();
			}
		}
	},

	
leagueroom: function (target, room, user) {
		if (!this.can('makeroom')) return;
		if (!room.chatRoomData) {
			return this.sendReply('/leagueroom - This room can\'t be marked as a league');
		}
		if (target === 'off') {
			delete room.isLeague;
			this.addModCommand(user.name+' has made this chat room a normal room.');
			delete room.chatRoomData.isLeague;
			Rooms.global.writeChatRoomData();
		} else {
			room.isLeague = true;
			this.addModCommand(user.name+' made this room a league room.');
			room.chatRoomData.isLeague = true;
			Rooms.global.writeChatRoomData();
		}
	},	
	

closeleague: 'openleague',
	openleague: function (target, room, user, connection, cmd) {
		if (!room.isLeague) return this.sendReply("This is not a league room, if it is, get a Leader or Admin to set the room as a league room.");
		if (!this.can('roommod', null, room)) return false;
		if (!room.chatRoomData) {
			return this.sendReply("This room cannot have a league toggle option.");
		}
		if (cmd === 'closeleague') {
			if (!room.isOpen) return this.sendReply('The league is already marked as closed.');
			delete room.isOpen;
			delete room.chatRoomData.isOpen;
			Rooms.global.writeChatRoomData();
			return this.sendReply('This league has now been marked as closed.');
		}
		else {
			if (room.isOpen) return this.sendReply('The league is already marked as open.');
			room.isOpen = true;
			room.chatRoomData.isOpen = true;
			Rooms.global.writeChatRoomData();
			return this.sendReply('This league has now been marked as open.');
		}
	},


leaguestatus: function (target, room, user) {
		if (!room.isLeague) return this.sendReply("This is not a league room, if it is, get a Leader or Admin to set the room as a league room.");
		if (!this.canBroadcast()) return;
		if (room.isOpen) {
			return this.sendReplyBox(room.title+' is <font color="green"><b>open</b></font> to challengers.');
		}
		else if (!room.isOpen) {
			return this.sendReplyBox(room.title+' is <font color="red"><b>closed</b></font> to challengers.');
		}
		else return this.sendReply('This league does not have a status set.');
	},
	
	
	
	
	
	
	
	
	
	
	
	modjoin: function (target, room, user) {
		if (!this.can('privateroom', null, room)) return;
		if (target === 'off') {
			delete room.modjoin;
			this.addModCommand("" + user.name + " turned off modjoin.");
			if (room.chatRoomData) {
				delete room.chatRoomData.modjoin;
				Rooms.global.writeChatRoomData();
			}
		} else {
			room.modjoin = true;
			this.addModCommand("" + user.name + " turned on modjoin.");
			if (room.chatRoomData) {
				room.chatRoomData.modjoin = true;
				Rooms.global.writeChatRoomData();
			}
		}
	},

	officialchatroom: 'officialroom',
	officialroom: function (target, room, user) {
		if (!this.can('makeroom')) return;
		if (!room.chatRoomData) {
			return this.sendReply("/officialroom - This room can't be made official");
		}
		if (target === 'off') {
			delete room.isOfficial;
			this.addModCommand("" + user.name + " made this chat room unofficial.");
			delete room.chatRoomData.isOfficial;
			Rooms.global.writeChatRoomData();
		} else {
			room.isOfficial = true;
			this.addModCommand("" + user.name + " made this chat room official.");
			room.chatRoomData.isOfficial = true;
			Rooms.global.writeChatRoomData();
		}
	},

	roomowner: function (target, room, user) {
		if (!room.chatRoomData) {
			return this.sendReply("/roomowner - This room isn't designed for per-room moderation to be added");
		}
		var target = this.splitTarget(target, true);
		var targetUser = this.targetUser;

		if (!targetUser) return this.sendReply("User '" + this.targetUsername + "' is not online.");

		if (!this.can('makeroom', targetUser, room)) return false;

		if (!room.auth) room.auth = room.chatRoomData.auth = {};

		var name = targetUser.name;

		room.auth[targetUser.userid] = '#';
		this.addModCommand("" + name + " was appointed Room Owner by " + user.name + ".");
		room.onUpdateIdentity(targetUser);
		Rooms.global.writeChatRoomData();
	},

	
roomfounder: function (target, room, user) {
		if (!room.chatRoomData) {
			return this.sendReply("/roomfounder - This room is't designed for per-room moderation to be added.");
		}
		var target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		if (!targetUser) return this.sendReply("User '"+this.targetUsername+"' is not online.");
		if (!this.can('makeroom')) return false;
		if (!room.auth) room.auth = room.chatRoomData.auth = {};
		var name = targetUser.name;
		room.auth[targetUser.userid] = '#';
		room.founder = targetUser.userid;
		this.addModCommand(''+name+' was appointed to Room Founder by '+user.name+'.');
		room.onUpdateIdentity(targetUser);
		room.chatRoomData.founder = room.founder;
		Rooms.global.writeChatRoomData();
	},	
	
	
	
	
	
	
	
	
	
	
	
	
	
	roomdeowner: 'deroomowner',
	deroomowner: function (target, room, user) {
		if (!room.auth) {
			return this.sendReply("/roomdeowner - This room isn't designed for per-room moderation");
		}
		var target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		var name = this.targetUsername;
		var userid = toId(name);
		if (!userid || userid === '') return this.sendReply("User '" + name + "' does not exist.");

		if (room.auth[userid] !== '#') return this.sendReply("User '" + name + "' is not a room owner.");
		if (!this.can('makeroom', null, room)) return false;

		delete room.auth[userid];
		this.sendReply("(" + name + " is no longer Room Owner.)");
		if (targetUser) targetUser.updateIdentity();
		if (room.chatRoomData) {
			Rooms.global.writeChatRoomData();
		}
	},

	roomdesc: function (target, room, user) {
		if (!target) {
			if (!this.canBroadcast()) return;
			var re = /(https?:\/\/(([-\w\.]+)+(:\d+)?(\/([\w/_\.]*(\?\S+)?)?)?))/g;
			if (!room.desc) return this.sendReply("This room does not have a description set.");
			this.sendReplyBox("The room description is: " + room.desc.replace(re, '<a href="$1">$1</a>'));
			return;
		}
		if (!this.can('roommod', null, room)) return false;
		if (target.length > 80) return this.sendReply("Error: Room description is too long (must be at most 80 characters).");

		room.desc = target;
		this.sendReply("(The room description is now: " + target + ")");

		if (room.chatRoomData) {
			room.chatRoomData.desc = room.desc;
			Rooms.global.writeChatRoomData();
		}
	},

	
roomintro: function (target, room, user) {
		if (!target) {
			if (!this.canBroadcast()) return;
			var re = /(https?:\/\/(([-\w\.]+)+(:\d+)?(\/([\w/_\.]*(\?\S+)?)?)?))/g;
			if (!room.introMessage) return this.sendReply("This room does not have an introduction set.");
			this.sendReplyBox(room.introMessage);
			if (!this.broadcasting && user.can('declare', null, room)) {
				this.sendReply('Source:');
				this.sendReplyBox('<code>'+Tools.escapeHTML(room.introMessage)+'</code>');
			}
			return;
		}
		if (!this.can('declare', null, room)) return false;
		if (!this.canHTML(target)) return;
		if (!/</.test(target)) {
			// not HTML, do some simple URL linking
			var re = /(https?:\/\/(([-\w\.]+)+(:\d+)?(\/([\w/_\.]*(\?\S+)?)?)?))/g;
			target = target.replace(re, '<a href="$1">$1</a>');
		}

		if (!target.trim()) target = '';
		room.introMessage = target;
		this.sendReply("(The room introduction has been changed to:)");
		this.sendReplyBox(target);

		if (room.chatRoomData) {
			room.chatRoomData.introMessage = room.introMessage;
			Rooms.global.writeChatRoomData();
		}
	},	
	
	
	
	
	
	
	
	
	
	roomdemote: 'roompromote',
	roompromote: function (target, room, user, connection, cmd) {
		if (!room.auth) {
			this.sendReply("/roompromote - This room isn't designed for per-room moderation");
			return this.sendReply("Before setting room mods, you need to set it up with /roomowner");
		}
		if (!target) return this.parse('/help roompromote');

		target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		var userid = toId(this.targetUsername);
		var name = targetUser ? targetUser.name : this.targetUsername;

		if (!userid) return this.parse('/help roompromote');
		if (!targetUser && (!room.auth || !room.auth[userid])) {
			return this.sendReply("User '" + name + "' is offline and unauthed, and so can't be promoted.");
		}

		var currentGroup = ((room.auth && room.auth[userid]) || ' ')[0];
		var nextGroup = target || Users.getNextGroupSymbol(currentGroup, cmd === 'roomdemote', true);
		if (target === 'deauth') nextGroup = Config.groupsranking[0];
		if (!Config.groups[nextGroup]) {
			return this.sendReply("Group '" + nextGroup + "' does not exist.");
		}

		if (Config.groups[nextGroup].globalonly) {
			return this.sendReply("Group 'room" + Config.groups[nextGroup].id + "' does not exist as a room rank.");
		}

		var groupName = Config.groups[nextGroup].name || "regular user";
		if (currentGroup === nextGroup) {
			return this.sendReply("User '" + name + "' is already a " + groupName + " in this room.");
		}
		if (currentGroup !== ' ' && !user.can('room' + Config.groups[currentGroup].id, null, room)) {
			return this.sendReply("/" + cmd + " - Access denied for promoting from " + Config.groups[currentGroup].name + ".");
		}
		if (nextGroup !== ' ' && !user.can('room' + Config.groups[nextGroup].id, null, room)) {
			return this.sendReply("/" + cmd + " - Access denied for promoting to " + Config.groups[nextGroup].name + ".");
		}

		if (nextGroup === ' ') {
			delete room.auth[userid];
		} else {
			room.auth[userid] = nextGroup;
		}

		if (Config.groups[nextGroup].rank < Config.groups[currentGroup].rank) {
			this.privateModCommand("(" + name + " was demoted to Room " + groupName + " by " + user.name + ".)");
			if (targetUser) targetUser.popup("You were demoted to Room " + groupName + " by " + user.name + ".");
		} else if (nextGroup === '#') {
			this.addModCommand("" + name + " was promoted to " + groupName + " by " + user.name + ".");
		} else {
			this.addModCommand("" + name + " was promoted to Room " + groupName + " by " + user.name + ".");
		}

		if (targetUser) targetUser.updateIdentity();
		if (room.chatRoomData) Rooms.global.writeChatRoomData();
	},

	
lockroom: function(target, room, user) {
		if (!room.auth) {
			return this.sendReply("Only unofficial chatrooms can be locked.");
		}
		if (room.auth[user.userid] != '#' && user.group != '~') {
			return this.sendReply('/lockroom - Access denied.');
		}
		room.lockedRoom = true;
		this.addModCommand(user.name + ' has locked the room.');
	},	
	

unlockroom: function(target, room, user) {
		if (!room.auth) {
			return this.sendReply("Only unofficial chatrooms can be unlocked.");
		}
		if (room.auth[user.userid] != '#' && user.group != '~') {
			return this.sendReply('/unlockroom - Access denied.');
		}
		room.lockedRoom = false;
		this.addModCommand(user.name + ' has unlocked the room.');
	},







	
	
	
	
	
	
	
	
	
	autojoin: function (target, room, user, connection) {
		Rooms.global.autojoinRooms(user, connection);
	},

	join: function (target, room, user, connection) {
		if (!target) return false;
		var targetRoom = Rooms.get(target) || Rooms.get(toId(target));
		if (!targetRoom) {
			return connection.sendTo(target, "|noinit|nonexistent|The room '" + target + "' does not exist.");
		}
		if (targetRoom.isPrivate) {
			if (targetRoom.modjoin) {
				var userGroup = user.group;
				if (targetRoom.auth) {
					userGroup = targetRoom.auth[user.userid] || ' ';
				}
				if (Config.groupsranking.indexOf(userGroup) < Config.groupsranking.indexOf(targetRoom.modchat)) {
					return connection.sendTo(target, "|noinit|nonexistent|The room '" + target + "' does not exist.");
				}
			}
			if (!user.named) {
				return connection.sendTo(target, "|noinit|namerequired|You must have a name in order to join the room '" + target + "'.");
			}
		}
		if (!user.joinRoom(targetRoom || room, connection)) {
			return connection.sendTo(target, "|noinit|joinfailed|The room '" + target + "' could not be joined.");
		}
		if (target == "lobby") this.sendReply('|raw|' + announcement);
	},

	rb: 'roomban',
	roomban: function (target, room, user, connection) {
		if (!target) return this.parse('/help roomban');
		if (user.locked || user.mutedRooms[room.id]) return this.sendReply("You cannot do this while unable to talk.");

		target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		var name = this.targetUsername;
		var userid = toId(name);

		if (!userid || !targetUser) return this.sendReply("User '" + name + "' does not exist.");
		if (!this.can('ban', targetUser, room)) return false;
		if (!room.bannedUsers || !room.bannedIps) {
			return this.sendReply("Room bans are not meant to be used in room " + room.id + ".");
		}
		room.bannedUsers[userid] = true;
		for (var ip in targetUser.ips) {
			room.bannedIps[ip] = true;
		}
		targetUser.popup("" + user.name + " has banned you from the room " + room.id + ". To appeal the ban, PM the moderator that banned you or a room owner." + (target ? " (" + target + ")" : ""));
		this.addModCommand("" + targetUser.name + " was banned from room " + room.id + " by " + user.name + "." + (target ? " (" + target + ")" : ""));
		var alts = targetUser.getAlts();
		if (alts.length) {
			this.addModCommand("" + targetUser.name + "'s alts were also banned from room " + room.id + ": " + alts.join(", "));
			for (var i = 0; i < alts.length; ++i) {
				var altId = toId(alts[i]);
				this.add('|unlink|' + altId);
				room.bannedUsers[altId] = true;
			}
		}
		this.add('|unlink|' + this.getLastIdOf(targetUser));
		targetUser.leaveRoom(room.id);
	},

	roomunban: function (target, room, user, connection) {
		if (!target) return this.parse('/help roomunban');
		if (user.locked || user.mutedRooms[room.id]) return this.sendReply("You cannot do this while unable to talk.");

		target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		var name = this.targetUsername;
		var userid = toId(name);
		var success;

		if (!userid || !targetUser) return this.sendReply("User '" + name + "' does not exist.");
		if (!this.can('ban', targetUser, room)) return false;
		if (!room.bannedUsers || !room.bannedIps) {
			return this.sendReply("Room bans are not meant to be used in room " + room.id + ".");
		}
		if (room.bannedUsers[userid]) {
			delete room.bannedUsers[userid];
			success = true;
		}
		for (var ip in targetUser.ips) {
			if (room.bannedIps[ip]) {
				delete room.bannedIps[ip];
				success = true;
			}
		}
		if (!success) return this.sendReply("User " + targetUser.name + " is not banned from room " + room.id + ".");

		targetUser.popup("" + user.name + " has unbanned you from the room " + room.id + ".");
		this.addModCommand("" + targetUser.name + " was unbanned from room " + room.id + " by " + user.name + ".");
		var alts = targetUser.getAlts();
		if (!alts.length) return;
		for (var i = 0; i < alts.length; ++i) {
			var altId = toId(alts[i]);
			if (room.bannedUsers[altId]) delete room.bannedUsers[altId];
		}
		this.addModCommand("" + targetUser.name + "'s alts were also unbanned from room " + room.id + ": " + alts.join(", "));
	},

	roomauth: function (target, room, user, connection) {
		if (!room.auth) return this.sendReply("/roomauth - This room isn't designed for per-room moderation and therefore has no auth list.");
		var buffer = [];
		for (var u in room.auth) {
			buffer.push(room.auth[u] + u);
		}
		if (buffer.length > 0) {
			buffer = buffer.join(", ");
		} else {
			buffer = "This room has no auth.";
		}
		connection.popup(buffer);
	},

	leave: 'part',
	part: function (target, room, user, connection) {
		if (room.id === 'global') return false;
		var targetRoom = Rooms.get(target);
		if (target && !targetRoom) {
			return this.sendReply("The room '" + target + "' does not exist.");
		}
		user.leaveRoom(targetRoom || room, connection);
	},

	/*********************************************************
	 * Moderating: Punishments
	 *********************************************************/

	w: 'warn',
	warns: 'warn',
	warn: function (target, room, user) {
		if (!target) return this.parse('/help warn');
		if (user.locked || user.mutedRooms[room.id]) return this.sendReply("You cannot do this while unable to talk.");

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) return this.sendReply("User '" + this.targetUsername + "' does not exist.");
		if (room.isPrivate && room.auth) {
			return this.sendReply("You can't warn here: This is a privately-owned room not subject to global rules.");
		}
		if (target.length > MAX_REASON_LENGTH) {
			return this.sendReply("The reason is too long. It cannot exceed " + MAX_REASON_LENGTH + " characters.");
		}
		if (!this.can('warn', targetUser, room)) return false;

		this.addModCommand("" + targetUser.name + " was warned by " + user.name + "." + (target ? " (" + target + ")" : ""));
		targetUser.send('|c|~|/warn ' + target);
		this.add('|unlink|' + this.getLastIdOf(targetUser));
	},

	redirect: 'redir',
	redir: function (target, room, user, connection) {
		if (!target) return this.parse('/help redirect');
		if (user.locked || user.mutedRooms[room.id]) return this.sendReply("You cannot do this while unable to talk.");
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		var targetRoom = Rooms.get(target) || Rooms.get(toId(target));
		if (!targetRoom) {
			return this.sendReply("The room '" + target + "' does not exist.");
		}
		if (!this.can('warn', targetUser, room) || !this.can('warn', targetUser, targetRoom)) return false;
		if (!targetUser || !targetUser.connected) {
			return this.sendReply("User " + this.targetUsername + " not found.");
		}
		if (Rooms.rooms[targetRoom.id].users[targetUser.userid]) {
			return this.sendReply("User " + targetUser.name + " is already in the room " + target + "!");
		}
		if (!Rooms.rooms[room.id].users[targetUser.userid]) {
			return this.sendReply("User " + this.targetUsername + " is not in the room " + room.id + ".");
		}
		if (targetUser.joinRoom(target) === false) return this.sendReply("User " + targetUser.name + " could not be joined to room " + target + ". They could be banned from the room.");
		var roomName = (targetRoom.isPrivate)? "a private room" : "room " + targetRoom.title;
		this.addModCommand("" + targetUser.name + " was redirected to " + roomName + " by " + user.name + ".");
		targetUser.leaveRoom(room);
	},

	m: 'mute',
	mute: function (target, room, user) {
		if (!target) return this.parse('/help mute');
		if (user.locked || user.mutedRooms[room.id]) return this.sendReply("You cannot do this while unable to talk.");

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) return this.sendReply("User '" + this.targetUsername + "' does not exist.");
		if (target.length > MAX_REASON_LENGTH) {
			return this.sendReply("The reason is too long. It cannot exceed " + MAX_REASON_LENGTH + " characters.");
		}
		if (!this.can('mute', targetUser, room)) return false;
		if (targetUser.mutedRooms[room.id] || targetUser.locked || !targetUser.connected) {
			var problem = " but was already " + (!targetUser.connected ? "offline" : targetUser.locked ? "locked" : "muted");
			if (!target) {
				return this.privateModCommand("(" + targetUser.name + " would be muted by " + user.name + problem + ".)");
			}
			return this.addModCommand("" + targetUser.name + " would be muted by " + user.name + problem + "." + (target ? " (" + target + ")" : ""));
		}

		targetUser.popup("" + user.name + " has muted you for 7 minutes. " + target);
		this.addModCommand("" + targetUser.name + " was muted by " + user.name + " for 7 minutes." + (target ? " (" + target + ")" : ""));
		var alts = targetUser.getAlts();
		if (alts.length) this.addModCommand("" + targetUser.name + "'s alts were also muted: " + alts.join(", "));
		this.add('|unlink|' + this.getLastIdOf(targetUser));

		targetUser.mute(room.id, 7 * 60 * 1000);
	},

	hm: 'hourmute',
	hourmute: function (target, room, user) {
		if (!target) return this.parse('/help hourmute');
		if (user.locked || user.mutedRooms[room.id]) return this.sendReply("You cannot do this while unable to talk.");

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) return this.sendReply("User '" + this.targetUsername + "' does not exist.");
		if (target.length > MAX_REASON_LENGTH) {
			return this.sendReply("The reason is too long. It cannot exceed " + MAX_REASON_LENGTH + " characters.");
		}
		if (!this.can('mute', targetUser, room)) return false;

		if (((targetUser.mutedRooms[room.id] && (targetUser.muteDuration[room.id] || 0) >= 50 * 60 * 1000) || targetUser.locked) && !target) {
			var problem = " but was already " + (!targetUser.connected ? "offline" : targetUser.locked ? "locked" : "muted");
			return this.privateModCommand("(" + targetUser.name + " would be muted by " + user.name + problem + ".)");
		}

		targetUser.popup("" + user.name + " has muted you for 60 minutes. " + target);
		this.addModCommand("" + targetUser.name + " was muted by " + user.name + " for 60 minutes." + (target ? " (" + target + ")" : ""));
		var alts = targetUser.getAlts();
		if (alts.length) this.addModCommand("" + targetUser.name + "'s alts were also muted: " + alts.join(", "));
		this.add('|unlink|' + this.getLastIdOf(targetUser));

		targetUser.mute(room.id, 60 * 60 * 1000, true);
	},

	
dmute : 'daymute',
	daymute: function(target, room, user) {
		if (!target) return this.parse('/help hourmute');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (target.length > MAX_REASON_LENGTH) {
			return this.sendReply('The reason is too long. It cannot exceed ' + MAX_REASON_LENGTH + ' characters.');
		}
		if (!this.can('mute', targetUser, room)) return false;
		if (targetUser.punished) return this.sendReply(targetUser.name+' has recently been warned, muted, or locked. Please wait a few seconds before muting them.');
		if (targetUser.mutedRooms[room.id] || targetUser.locked || !targetUser.connected) {
			var problem = ' but was already '+(!targetUser.connected ? 'offline' : targetUser.locked ? 'locked' : 'muted');
			if (!target && !room.auth) {
				return this.privateModCommand('('+targetUser.name+' would be muted by '+user.name+problem+'.)');
			}
			return this.addModCommand(''+targetUser.name+' would be muted by '+user.name+problem+'.' + (target ? " (" + target + ")" : ""));
		}
		targetUser.punished = true;
		targetUser.punishTimer = setTimeout(function(){
			targetUser.punished = false;
		},7000);
		targetUser.popup(user.name+' has muted you for 24 hours. '+target);
		this.addModCommand(''+targetUser.name+' was muted by '+user.name+' for 24 hours.' + (target ? " (" + target + ")" : ""));
		var alts = targetUser.getAlts();
		if (alts.length) this.privateModCommand("(" + targetUser.name + "'s alts were also muted: " + alts.join(", ") + ")");
		this.add('|unlink|' + this.getLastIdOf(targetUser));

		targetUser.mute(room.id, 60 * 60 * 1000, true);
		try {
			frostcommands.addMuteCount(user.userid);
		} catch (e) {
			return;
		}
	},	
	
	
	
	
	
	
	
	um: 'unmute',
	unmute: function (target, room, user) {
		if (!target) return this.parse('/help unmute');
		if (user.locked || user.mutedRooms[room.id]) return this.sendReply("You cannot do this while unable to talk.");
		var targetUser = Users.get(target);
		if (!targetUser) return this.sendReply("User '" + target + "' does not exist.");
		if (!this.can('mute', targetUser, room)) return false;

		if (!targetUser.mutedRooms[room.id]) {
			return this.sendReply("" + targetUser.name + " is not muted.");
		}

		this.addModCommand("" + targetUser.name + " was unmuted by " + user.name + ".");

		targetUser.unmute(room.id);
	},

	l: 'lock',
	ipmute: 'lock',
	lock: function (target, room, user) {
		if (!target) return this.parse('/help lock');
		if (user.locked || user.mutedRooms[room.id]) return this.sendReply("You cannot do this while unable to talk.");

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) return this.sendReply("User '" + this.targetUsername + "' does not exist.");
		if (target.length > MAX_REASON_LENGTH) {
			return this.sendReply("The reason is too long. It cannot exceed " + MAX_REASON_LENGTH + " characters.");
		}
		if (!this.can('lock', targetUser)) return false;

		if ((targetUser.locked || Users.checkBanned(targetUser.latestIp)) && !target) {
			var problem = " but was already " + (targetUser.locked ? "locked" : "banned");
			return this.privateModCommand("(" + targetUser.name + " would be locked by " + user.name + problem + ".)");
		}

		targetUser.popup("" + user.name + " has locked you from talking in chats, battles, and PMing regular users.\n\n" + target + "\n\nIf you feel that your lock was unjustified, you can still PM staff members (%, @, &, and ~) to discuss it.");

		this.addModCommand("" + targetUser.name + " was locked from talking by " + user.name + "." + (target ? " (" + target + ")" : ""));
		var alts = targetUser.getAlts();
		if (alts.length) this.addModCommand("" + targetUser.name + "'s alts were also locked: " + alts.join(", "));
		this.add('|unlink|' + this.getLastIdOf(targetUser));

		targetUser.lock();
	},

	unlock: function (target, room, user) {
		if (!target) return this.parse('/help unlock');
		if (user.locked || user.mutedRooms[room.id]) return this.sendReply("You cannot do this while unable to talk.");
		if (!this.can('lock')) return false;

		var unlocked = Users.unlock(target);

		if (unlocked) {
			var names = Object.keys(unlocked);
			this.addModCommand(names.join(", ") + " " +
				((names.length > 1) ? "were" : "was") +
				" unlocked by " + user.name + ".");
		} else {
			this.sendReply("User '" + target + "' is not locked.");
		}
	},

	b: 'ban',
	ban: function (target, room, user) {
		if (!target) return this.parse('/help ban');
		if (user.locked || user.mutedRooms[room.id]) return this.sendReply("You cannot do this while unable to talk.");

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) return this.sendReply("User '" + this.targetUsername + "' does not exist.");
		if (target.length > MAX_REASON_LENGTH) {
			return this.sendReply("The reason is too long. It cannot exceed " + MAX_REASON_LENGTH + " characters.");
		}
		if (!this.can('ban', targetUser)) return false;

		if (Users.checkBanned(targetUser.latestIp) && !target && !targetUser.connected) {
			var problem = " but was already banned";
			return this.privateModCommand("(" + targetUser.name + " would be banned by " + user.name + problem + ".)");
		}

		targetUser.popup("" + user.name + " has banned you." + (Config.appealurl ? (" If you feel that your banning was unjustified you can appeal the ban:\n" + Config.appealurl) : "") + "\n\n" + target);

		this.addModCommand("" + targetUser.name + " was banned by " + user.name + "." + (target ? " (" + target + ")" : ""), " (" + targetUser.latestIp + ")");
		var alts = targetUser.getAlts();
		if (alts.length) {
			this.addModCommand("" + targetUser.name + "'s alts were also banned: " + alts.join(", "));
			for (var i = 0; i < alts.length; ++i) {
				this.add('|unlink|' + toId(alts[i]));
			}
		}

		this.add('|unlink|' + this.getLastIdOf(targetUser));
		targetUser.ban();
	},

	
bh: 'banhammer',
	banhammer: function(target, room, user) {
		if (!target) return this.parse('/help ban');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (target.length > MAX_REASON_LENGTH) {
			return this.sendReply('The reason is too long. It cannot exceed ' + MAX_REASON_LENGTH + ' characters.');
		}
		if (!this.can('ban', targetUser)) return false;

		if (Users.checkBanned(targetUser.latestIp) && !target && !targetUser.connected) {
			var problem = ' but was already banned';
			return this.privateModCommand('('+targetUser.name+' would be banned by '+user.name+problem+'.)');
		}

		targetUser.popup(user.name+" has has hit you with their ban hammer." + (config.appealurl ? ("  If you feel that your banning was unjustified you can appeal the ban:\n" + config.appealurl) : "") + "\n\n"+target);

		this.addModCommand(""+targetUser.name+" was hit by "+user.name+"\'s ban hammer." + (target ? " (" + target + ")" : ""), ' ('+targetUser.latestIp+')');
		var alts = targetUser.getAlts();
		if (alts.length) {
			this.addModCommand(""+targetUser.name+"'s alts were also hit: "+alts.join(", "));
			for (var i = 0; i < alts.length; ++i) {
				this.add('|unlink|' + toId(alts[i]));
			}
		}

		this.add('|unlink|' + targetUser.userid);
		targetUser.ban();
	},	
	
	
	
	
	
	
	
	
	
	
	
	
	
lockdt: 'lockdetails',
	lockdetails: function (target, room, user) {
		if (!this.can('lock')) return false;
		var targetUser = Users.get(target);
		if (!targetUser) return this.sendReply("User '" + target + "' does not exist.");
		if (!targetUser.locked) return this.sendReply("User '" + targetUser.name + "' was not locked from chat.");
		var canIp = user.can('ip', targetUser);
		for (var ip in targetUser.ips) {
			if (Dnsbl.cache[ip]) return this.sendReply("User '" + targetUser.name + "' is locked due to their IP " + (canIp ? "(" + ip + ") " : "") + "being in a DNS-based blacklist" + (canIp ? " (" + Dnsbl.cache[ip] + ")." : "."));
		}
		return this.sendReply("User '" + targetUser.name + "' is locked for unknown reasons. Check their modlog?");
	},	
	
	
	
	
	
	
	
	
	unban: function (target, room, user) {
		if (!target) return this.parse('/help unban');
		if (user.locked || user.mutedRooms[room.id]) return this.sendReply("You cannot do this while unable to talk.");
		if (!this.can('ban')) return false;

		var name = Users.unban(target);

		if (name) {
			this.addModCommand("" + name + " was unbanned by " + user.name + ".");
		} else {
			this.sendReply("User '" + target + "' is not banned.");
		}
	},

	unbanall: function (target, room, user) {
		if (!this.can('rangeban')) return false;
		if (user.locked || user.mutedRooms[room.id]) return this.sendReply("You cannot do this while unable to talk.");
		// we have to do this the hard way since it's no longer a global
		for (var i in Users.bannedIps) {
			delete Users.bannedIps[i];
		}
		for (var i in Users.lockedIps) {
			delete Users.lockedIps[i];
		}
		this.addModCommand("All bans and locks have been lifted by " + user.name + ".");
	},

	banip: function (target, room, user) {
		if (user.locked || user.mutedRooms[room.id]) return this.sendReply("You cannot do this while unable to talk.");
		target = target.trim();
		if (!target) {
			return this.parse('/help banip');
		}
		if (!this.can('rangeban')) return false;

		Users.bannedIps[target] = '#ipban';
		this.addModCommand("" + user.name + " temporarily banned the " + (target.charAt(target.length - 1) === '*' ? "IP range" : "IP") + ": " + target);
	},

	unbanip: function (target, room, user) {
		if (user.locked || user.mutedRooms[room.id]) return this.sendReply("You cannot do this while unable to talk.");
		target = target.trim();
		if (!target) {
			return this.parse('/help unbanip');
		}
		if (!this.can('rangeban')) return false;
		if (!Users.bannedIps[target]) {
			return this.sendReply("" + target + " is not a banned IP or IP range.");
		}
		delete Users.bannedIps[target];
		this.addModCommand("" + user.name + " unbanned the " + (target.charAt(target.length - 1) === '*' ? "IP range" : "IP") + ": " + target);
	},

	/*********************************************************
	 * Moderating: Other
	 *********************************************************/

	modnote: function (target, room, user, connection, cmd) {
		if (!target) return this.parse('/help modnote');
		if (target.length > MAX_REASON_LENGTH) {
			return this.sendReply("The note is too long. It cannot exceed " + MAX_REASON_LENGTH + " characters.");
		}
		if (!this.can('mute')) return false;
		return this.privateModCommand("(" + user.name + " notes: " + target + ")");
	},

	demote: 'promote',
	promote: function (target, room, user, connection, cmd) {
		if (!target) return this.parse('/help promote');

		target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		var userid = toId(this.targetUsername);
		var name = targetUser ? targetUser.name : this.targetUsername;

		if (!userid) return this.parse('/help promote');

		var currentGroup = ((targetUser && targetUser.group) || Users.usergroups[userid] || ' ')[0];
		var nextGroup = target ? target : Users.getNextGroupSymbol(currentGroup, cmd === 'demote', true);
		if (target === 'deauth') nextGroup = Config.groupsranking[0];
		if (!Config.groups[nextGroup]) {
			return this.sendReply("Group '" + nextGroup + "' does not exist.");
		}
		if (Config.groups[nextGroup].roomonly) {
			return this.sendReply("Group '" + nextGroup + "' does not exist as a global rank.");
		}

		var groupName = Config.groups[nextGroup].name || "regular user";
		if (currentGroup === nextGroup) {
			return this.sendReply("User '" + name + "' is already a " + groupName);
		}
		if (!user.canPromote(currentGroup, nextGroup)) {
			return this.sendReply("/" + cmd + " - Access denied.");
		}

		if (!Users.setOfflineGroup(name, nextGroup)) {
			return this.sendReply("/promote - WARNING: This user is offline and could be unregistered. Use /forcepromote if you're sure you want to risk it.");
		}
		if (Config.groups[nextGroup].rank < Config.groups[currentGroup].rank) {
			this.privateModCommand("(" + name + " was demoted to " + groupName + " by " + user.name + ".)");
			if (targetUser) targetUser.popup("You were demoted to " + groupName + " by " + user.name + ".");
		} else {
			this.addModCommand("" + name + " was promoted to " + groupName + " by " + user.name + ".");
		}

		if (targetUser) targetUser.updateIdentity();
	},

	forcepromote: function (target, room, user) {
		// warning: never document this command in /help
		if (!this.can('forcepromote')) return false;
		target = this.splitTarget(target, true);
		var name = this.targetUsername;
		var nextGroup = target || Users.getNextGroupSymbol(' ', false);

		if (!Users.setOfflineGroup(name, nextGroup, true)) {
			return this.sendReply("/forcepromote - Don't forcepromote unless you have to.");
		}

		this.addModCommand("" + name + " was promoted to " + (Config.groups[nextGroup].name || "regular user") + " by " + user.name + ".");
	},

	deauth: function (target, room, user) {
		return this.parse('/demote ' + target + ', deauth');
	},

	modchat: function (target, room, user) {
		if (!target) return this.sendReply("Moderated chat is currently set to: " + room.modchat);
		if (user.locked || user.mutedRooms[room.id]) return this.sendReply("You cannot do this while unable to talk.");
		if (!this.can('modchat', null, room)) return false;

		if (room.modchat && room.modchat.length <= 1 && Config.groupsranking.indexOf(room.modchat) > 1 && !user.can('modchatall', null, room)) {
			return this.sendReply("/modchat - Access denied for removing a setting higher than " + Config.groupsranking[1] + ".");
		}

		target = target.toLowerCase();
		var currentModchat = room.modchat;
		switch (target) {
		case 'off':
		case 'false':
		case 'no':
			room.modchat = false;
			break;
		case 'ac':
		case 'autoconfirmed':
			room.modchat = 'autoconfirmed';
			break;
		case '*':
		case 'player':
			target = '\u2605';
			// fallthrough
		default:
			if (!Config.groups[target]) {
				return this.parse('/help modchat');
			}
			if (Config.groupsranking.indexOf(target) > 1 && !user.can('modchatall', null, room)) {
				return this.sendReply("/modchat - Access denied for setting higher than " + Config.groupsranking[1] + ".");
			}
			room.modchat = target;
			break;
		}
		if (currentModchat === room.modchat) {
			return this.sendReply("Modchat is already set to " + currentModchat + ".");
		}
		if (!room.modchat) {
			this.add("|raw|<div class=\"broadcast-blue\"><b>Moderated chat was disabled!</b><br />Anyone may talk now.</div>");
		} else {
			var modchat = Tools.escapeHTML(room.modchat);
			this.add("|raw|<div class=\"broadcast-red\"><b>Moderated chat was set to " + modchat + "!</b><br />Only users of rank " + modchat + " and higher can talk.</div>");
		}
		this.logModCommand(user.name + " set modchat to " + room.modchat);

		if (room.chatRoomData) {
			room.chatRoomData.modchat = room.modchat;
			Rooms.global.writeChatRoomData();
		}
	},

	
declaregreen: 'declare',
	declarered: 'declare',
	declare: function(target, room, user, connection, cmd) {
		/*if (user.userid === 'shadowninjask') return false;**/
		if (!target) return this.parse('/help declare');
		if (!this.can('declare', null, room)) return false;

		if (!this.canTalk()) return;

		if (cmd === 'declare') {
			this.add('|raw|<div class="broadcast-blue"><b>'+target+'</b></div>');
		}
		else if (cmd === 'declarered') {
			this.add('|raw|<div class="broadcast-red"><b>'+target+'</b></div>');
		}
		else if (cmd === 'declaregreen') {
			this.add('|raw|<div class="broadcast-green"><b>'+target+'</b></div>');
		}
		this.logModCommand(user.name+' declared '+target);
	},

	gdeclarered: 'gdeclare',
	gdeclaregreen: 'gdeclare',
	gdeclare: function(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help '+cmd);
		if (!this.can('gdeclare')) return false;
		var staff = '';
		staff = 'a ' + Config.groups[user.group].name;
		if (user.group == '~') staff = 'an Administrator';
		if (user.frostDev) staff = 'a Developer';

		//var roomName = (room.isPrivate)? 'a private room' : room.id;

		if (cmd === 'gdeclare'){
			for (var id in Rooms.rooms) {
				if (id !== 'global' && !Rooms.rooms[id].blockGlobalDeclares) Rooms.rooms[id].addRaw('<div class="broadcast-blue"><b><font size=1><i>Global declare from '+staff+'<br /></i></font size>'+target+'</b></div>');
			}
		}
		if (cmd === 'gdeclarered'){
			for (var id in Rooms.rooms) {
				if (id !== 'global' && !Rooms.rooms[id].blockGlobalDeclares) Rooms.rooms[id].addRaw('<div class="broadcast-red"><b><font size=1><i>Global declare from '+staff+'<br /></i></font size>'+target+'</b></div>');
			}
		}
		else if (cmd === 'gdeclaregreen'){
			for (var id in Rooms.rooms) {
				if (id !== 'global' && !Rooms.rooms[id].blockGlobalDeclares) Rooms.rooms[id].addRaw('<div class="broadcast-green"><b><font size=1><i>Global declare from '+staff+'<br /></i></font size>'+target+'</b></div>');
			}
		}
		this.logModCommand(user.name + " globally declared " + target);
	},
	
	pgdeclare: function(target, room, user) {
		if (!target) return this.parse('/help pgdeclare');
		if (!this.can('pgdeclare')) return;

		if (!this.canTalk()) return;

		for (var r in Rooms.rooms) {
			if (Rooms.rooms[r].type === 'chat' && !Rooms.rooms[r].blockGlobalDeclares) Rooms.rooms[r].add('|raw|<b>'+target+'</b></div>');
		}

		this.logModCommand(user.name+' declared '+target+' to all rooms.');
	},

	staffdeclare: 'declaremod',
	modmsg: 'declaremod',
	moddeclare: 'declaremod',
	declaremod: function(target, room, user) {
		if (!target) return this.sendReply('/declaremod [message] - Also /moddeclare and /modmsg');
		if (!this.can('declare', null, room)) return false;

		if (!this.canTalk()) return;

		this.privateModCommand('|raw|<div class="broadcast-red"><b><font size=1><i>Global declare from '+user.name+'<br /></i></font size>'+target+'</b></div>');

		this.logModCommand(user.name+' mod declared '+target);
	},

	cdeclare: 'chatdeclare',
	chatdeclare: function (target, room, user) {
		if (!target) return this.parse('/help chatdeclare');
		if (!this.can('gdeclare')) return false;

		for (var id in Rooms.rooms) {
			if (id !== 'global') if (Rooms.rooms[id].type !== 'battle' && !Rooms.rooms[id].blockGlobalDeclares) Rooms.rooms[id].addRaw('<div class="broadcast-blue"><b>'+target+'</b></div>');
		}
		this.logModCommand(user.name + " globally declared (chat level) " + target);
	},
	

	
	
	
	
	
	
	
	
	
	htmldeclare: function (target, room, user) {
		if (!target) return this.parse('/help htmldeclare');
		if (!this.can('gdeclare', null, room)) return false;

		if (!this.canTalk()) return;

		this.add('|raw|<div class="broadcast-blue"><b>' + target + '</b></div>');
		this.logModCommand(user.name + " declared " + target);
	},

	gglobaldeclare: 'globaldeclare',
	globaldeclare: function (target, room, user) {
		if (!target) return this.parse('/help globaldeclare');
		if (!this.can('gdeclare')) return false;

		for (var id in Rooms.rooms) {
			if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-blue"><b>' + target + '</b></div>');
		}
		this.logModCommand(user.name + " globally declared " + target);
	},

	cdeclare: 'chatdeclare',
	chatdeclare: function (target, room, user) {
		if (!target) return this.parse('/help chatdeclare');
		if (!this.can('gdeclare')) return false;

		for (var id in Rooms.rooms) {
			if (id !== 'global') if (Rooms.rooms[id].type !== 'battle') Rooms.rooms[id].addRaw('<div class="broadcast-blue"><b>' + target + '</b></div>');
		}
		this.logModCommand(user.name + " globally declared (chat level) " + target);
	},

	wall: 'announce',
	announce: function (target, room, user) {
		if (!target) return this.parse('/help announce');

		if (!this.can('announce', null, room)) return false;

		target = this.canTalk(target);
		if (!target) return;

		return '/announce ' + target;
	},

	fr: 'forcerename',
	forcerename: function (target, room, user) {
		if (!target) return this.parse('/help forcerename');
		if (user.locked || user.mutedRooms[room.id]) return this.sendReply("You cannot do this while unable to talk.");
		target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply("User '" + this.targetUsername + "' was not found or had already changed its name.");
		}
		if (!this.can('forcerename', targetUser)) return false;

		var entry = targetUser.name + " was forced to choose a new name by " + user.name + (target ? ": " + target: "");
		this.privateModCommand("(" + entry + ")");
		Rooms.global.cancelSearch(targetUser);
		targetUser.resetName();
		targetUser.send("|nametaken||" + user.name + " has forced you to change your name. " + target);
	},

	
inactiverooms: function(target, room, user, connection) {
		if (!user.can('makeroom')) return false;
		for (var u in Rooms.rooms) {
			if (!Rooms.rooms[u].active && Rooms.rooms[u].type == 'chat') {
				if (Rooms.rooms[u].isPrivate) {
					connection.sendTo(room.id, '|raw|INACTIVE and PRIVATE: <font color=red><b>'+u+'</b></font>');
				} else {
					connection.sendTo(room.id, '|raw|INACTIVE: <font color=red><b>'+u+'</b></font>');
				}
			}
		}
	},	
	


roomlist: function(target, room, user, connection) {
		if (!user.can('makeroom')) return false;
			for (var u in Rooms.rooms) {
				if (Rooms.rooms[u].type === "chat") {
					if (!Rooms.rooms[u].active && !Rooms.rooms[u].isPrivate) {
						connection.sendTo(room.id, '|raw|INACTIVE: <font color=red><b>'+u+'</b></font>');
					}
					if (Rooms.rooms[u].isPrivate && Rooms.rooms[u].active) {
						connection.sendTo(room.id, '|raw|PRIVATE: <b>'+u+'</b>');
					}
					if (!Rooms.rooms[u].active && Rooms.rooms[u].isPrivate) {
						connection.sendTo(room.id, '|raw|INACTIVE and PRIVATE: <font color=red><b>'+u+'</font></b>');
					}
					if (Rooms.rooms[u].active && !Rooms.rooms[u].isPrivate) {
						connection.sendTo(room.id, '|raw|<font color=green>'+u+'</font>');
					}
				}
			}
		},









	
	
	
	
	
	
	
	
	
	
	modlog: function (target, room, user, connection) {
		var lines = 0;
		// Specific case for modlog command. Room can be indicated with a comma, lines go after the comma.
		// Otherwise, the text is defaulted to text search in current room's modlog.
		var roomId = room.id;
		var roomLogs = {};

		if (target.indexOf(',') > -1) {
			var targets = target.split(',');
			target = targets[1].trim();
			roomId = toId(targets[0]) || room.id;
		}

		// Let's check the number of lines to retrieve or if it's a word instead
		if (!target.match('[^0-9]')) {
			lines = parseInt(target || 15, 10);
			if (lines > 100) lines = 100;
		}
		var wordSearch = (!lines || lines < 0);

		// Control if we really, really want to check all modlogs for a word.
		var roomNames = '';
		var filename = '';
		var command = '';
		if (roomId === 'all' && wordSearch) {
			if (!this.can('modlog')) return;
			roomNames = 'all rooms';
			// Get a list of all the rooms
			var fileList = fs.readdirSync('logs/modlog');
			for (var i = 0; i < fileList.length; ++i) {
				filename += 'logs/modlog/' + fileList[i] + ' ';
			}
		} else {
			if (!this.can('modlog', null, Rooms.get(roomId))) return;
			roomNames = 'the room ' + roomId;
			filename = 'logs/modlog/modlog_' + roomId + '.txt';
		}

		// Seek for all input rooms for the lines or text
		command = 'tail -' + lines + ' ' + filename;
		var grepLimit = 100;
		if (wordSearch) { // searching for a word instead
			if (target.match(/^["'].+["']$/)) target = target.substring(1, target.length - 1);
			command = "awk '{print NR,$0}' " + filename + " | sort -nr | cut -d' ' -f2- | grep -m" + grepLimit + " -i '" + target.replace(/\\/g, '\\\\\\\\').replace(/["'`]/g, '\'\\$&\'').replace(/[\{\}\[\]\(\)\$\^\.\?\+\-\*]/g, '[$&]') + "'";
		}

		// Execute the file search to see modlog
		require('child_process').exec(command, function (error, stdout, stderr) {
			if (error && stderr) {
				connection.popup("/modlog empty on " + roomNames + " or erred - modlog does not support Windows");
				console.log("/modlog error: " + error);
				return false;
			}
			if (lines) {
				if (!stdout) {
					connection.popup("The modlog is empty. (Weird.)");
				} else {
					connection.popup("Displaying the last " + lines + " lines of the Moderator Log of " + roomNames + ":\n\n" + stdout);
				}
			} else {
				if (!stdout) {
					connection.popup("No moderator actions containing '" + target + "' were found on " + roomNames + ".");
				} else {
					connection.popup("Displaying the last " + grepLimit + " logged actions containing '" + target + "' on " + roomNames + ":\n\n" + stdout);
				}
			}
		});
	},

	bw: 'banword',
	banword: function (target, room, user) {
		if (!this.can('declare')) return false;
		target = toId(target);
		if (!target) {
			return this.sendReply("Specify a word or phrase to ban.");
		}
		Users.addBannedWord(target);
		this.sendReply("Added '" + target + "' to the list of banned words.");
	},

	ubw: 'unbanword',
	unbanword: function (target, room, user) {
		if (!this.can('declare')) return false;
		target = toId(target);
		if (!target) {
			return this.sendReply("Specify a word or phrase to unban.");
		}
		Users.removeBannedWord(target);
		this.sendReply("Removed '" + target + "' from the list of banned words.");
	},

	/*********************************************************
	 * Server management commands
	 *********************************************************/

	hotpatch: function (target, room, user) {
		if (!target) return this.parse('/help hotpatch');
		if (!this.can('hotpatch')) return false;

		this.logEntry(user.name + " used /hotpatch " + target);

		if (target === 'chat' || target === 'commands') {

			try {
				CommandParser.uncacheTree('./command-parser.js');
				CommandParser = require('./command-parser.js');

				var runningTournaments = Tournaments.tournaments;
				CommandParser.uncacheTree('./tournaments/frontend.js');
				Tournaments = require('./tournaments/frontend.js');
				Tournaments.tournaments = runningTournaments;

				return this.sendReply("Chat commands have been hot-patched.");
			} catch (e) {
				return this.sendReply("Something failed while trying to hotpatch chat: \n" + e.stack);
			}

		} else if (target === 'tournaments') {

			try {
				var runningTournaments = Tournaments.tournaments;
				CommandParser.uncacheTree('./tournaments/frontend.js');
				Tournaments = require('./tournaments/frontend.js');
				Tournaments.tournaments = runningTournaments;
				return this.sendReply("Tournaments have been hot-patched.");
			} catch (e) {
				return this.sendReply("Something failed while trying to hotpatch tournaments: \n" + e.stack);
			}

		} else if (target === 'battles') {

			/*Simulator.SimulatorProcess.respawn();
			return this.sendReply("Battles have been hotpatched. Any battles started after now will use the new code; however, in-progress battles will continue to use the old code.");*/
			return this.sendReply("Battle hotpatching is not supported with the single process hack.");

		} else if (target === 'formats') {
			/*try {
				// uncache the tools.js dependency tree
				CommandParser.uncacheTree('./tools.js');
				// reload tools.js
				Tools = require('./tools.js'); // note: this will lock up the server for a few seconds
				// rebuild the formats list
				Rooms.global.formatListText = Rooms.global.getFormatListText();
				// respawn validator processes
				TeamValidator.ValidatorProcess.respawn();
				// respawn simulator processes
				Simulator.SimulatorProcess.respawn();
				// broadcast the new formats list to clients
				Rooms.global.send(Rooms.global.formatListText);

				return this.sendReply("Formats have been hotpatched.");
			} catch (e) {
				return this.sendReply("Something failed while trying to hotpatch formats: \n" + e.stack);
			}*/
			return this.sendReply("Formats hotpatching is not supported with the single process hack.");

		} else if (target === 'learnsets') {
			try {
				// uncache the tools.js dependency tree
				CommandParser.uncacheTree('./tools.js');
				// reload tools.js
				Tools = require('./tools.js'); // note: this will lock up the server for a few seconds

				return this.sendReply("Learnsets have been hotpatched.");
			} catch (e) {
				return this.sendReply("Something failed while trying to hotpatch learnsets: \n" + e.stack);
			}

		}
		this.sendReply("Your hot-patch command was unrecognized.");
	},

	
eating: 'away',
	gaming: 'away',
    	sleep: 'away',
	work: 'away',
    	working: 'away',
    	sleeping: 'away',
    	busy: 'away',    
	afk: 'away',
	away: function(target, room, user, connection, cmd) {
		if (!this.can('away')) return false;
		// unicode away message idea by Siiilver
		var t = 'Ⓐⓦⓐⓨ';
		var t2 = 'Away';
		switch (cmd) {
			case 'busy':
			t = 'Ⓑⓤⓢⓨ';
			t2 = 'Busy';
			break;
			case 'sleeping':
			t = 'Ⓢⓛⓔⓔⓟⓘⓝⓖ';
			t2 = 'Sleeping';
			break;
			case 'sleep':
			t = 'Ⓢⓛⓔⓔⓟⓘⓝⓖ';
			t2 = 'Sleeping';
			break;
			case 'gaming':
			t = 'Ⓖⓐⓜⓘⓝⓖ';
			t2 = 'Gaming';
			break;
			case 'working':
			t = 'Ⓦⓞⓡⓚⓘⓝⓖ';
			t2 = 'Working';
			break;
			case 'work':
			t = 'Ⓦⓞⓡⓚⓘⓝⓖ';
			t2 = 'Working';
			break;
			case 'eating':
			t = 'Ⓔⓐⓣⓘⓝⓖ';
			t2 = 'Eating';
			break;
			default:
			t = 'Ⓐⓦⓐⓨ'
			t2 = 'Away';
			break;
		}

		if (user.name.length > 18) return this.sendReply('Your username exceeds the length limit.');

		if (!user.isAway) {
			user.originalName = user.name;
			var awayName = user.name + ' - '+t;
			//delete the user object with the new name in case it exists - if it does it can cause issues with forceRename
			delete Users.get(awayName);
			user.forceRename(awayName, undefined, true);
			
			if (user.isStaff) this.add('|raw|-- <b><font color="#7FFF00">' + user.originalName +'</font color></b> is now '+t2.toLowerCase()+'. '+ (target ? " (" + escapeHTML(target) + ")" : ""));

			user.isAway = true;
		}
		else {
			return this.sendReply('You are already set as a form of away, type /back if you are now back.');
		}

		user.updateIdentity();
	},

	back: function(target, room, user, connection) {
		if (!this.can('away')) return false;

		if (user.isAway) {
			if (user.name === user.originalName) {
				user.isAway = false; 
				return this.sendReply('Your name has been left unaltered and no longer marked as away.');
			}

			var newName = user.originalName;
			
			//delete the user object with the new name in case it exists - if it does it can cause issues with forceRename
			delete Users.get(newName);

			user.forceRename(newName, undefined, true);
			
			//user will be authenticated
			user.authenticated = true;
			
			if (user.isStaff) this.add('|raw|-- <b><font color="#7FFF00">' + newName + '</font color></b> is no longer away.');

			user.originalName = '';
			user.isAway = false;
		}
		else {
			return this.sendReply('You are not set as away.');
		}

		user.updateIdentity();
	},	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	savelearnsets: function (target, room, user) {
		if (!this.can('hotpatch')) return false;
		fs.writeFile('data/learnsets.js', 'exports.BattleLearnsets = ' + JSON.stringify(BattleLearnsets) + ";\n");
		this.sendReply("learnsets.js saved.");
	},

	disableladder: function (target, room, user) {
		if (!this.can('disableladder')) return false;
		if (LoginServer.disabled) {
			return this.sendReply("/disableladder - Ladder is already disabled.");
		}
		LoginServer.disabled = true;
		this.logModCommand("The ladder was disabled by " + user.name + ".");
		this.add("|raw|<div class=\"broadcast-red\"><b>Due to high server load, the ladder has been temporarily disabled</b><br />Rated games will no longer update the ladder. It will be back momentarily.</div>");
	},

	enableladder: function (target, room, user) {
		if (!this.can('disableladder')) return false;
		if (!LoginServer.disabled) {
			return this.sendReply("/enable - Ladder is already enabled.");
		}
		LoginServer.disabled = false;
		this.logModCommand("The ladder was enabled by " + user.name + ".");
		this.add("|raw|<div class=\"broadcast-green\"><b>The ladder is now back.</b><br />Rated games will update the ladder now.</div>");
	},

	lockdown: function (target, room, user) {
		if (!this.can('lockdown')) return false;
		
		this.parse('/updateshop');
		Rooms.global.lockdown = true;
		for (var id in Rooms.rooms) {
			if (id !== 'global') Rooms.rooms[id].addRaw("<div class=\"broadcast-red\"><b>The server is restarting soon.</b><br />Please finish your battles quickly. No new battles can be started until the server resets in a few minutes.</div>");
			if (Rooms.rooms[id].requestKickInactive && !Rooms.rooms[id].battle.ended) Rooms.rooms[id].requestKickInactive(user, true);
		}

		this.logEntry(user.name + " used /lockdown");

	},

	endlockdown: function (target, room, user) {
		if (!this.can('lockdown')) return false;

		if (!Rooms.global.lockdown) {
			return this.sendReply("We're not under lockdown right now.");
		}
		Rooms.global.lockdown = false;
		for (var id in Rooms.rooms) {
			if (id !== 'global') Rooms.rooms[id].addRaw("<div class=\"broadcast-green\"><b>The server shutdown was canceled.</b></div>");
		}

		this.logEntry(user.name + " used /endlockdown");

	},

	emergency: function (target, room, user) {
		if (!this.can('lockdown')) return false;

		if (Config.emergency) {
			return this.sendReply("We're already in emergency mode.");
		}
		Config.emergency = true;
		for (var id in Rooms.rooms) {
			if (id !== 'global') Rooms.rooms[id].addRaw("<div class=\"broadcast-red\">The server has entered emergency mode. Some features might be disabled or limited.</div>");
		}

		this.logEntry(user.name + " used /emergency");
	},

	endemergency: function (target, room, user) {
		if (!this.can('lockdown')) return false;

		if (!Config.emergency) {
			return this.sendReply("We're not in emergency mode.");
		}
		Config.emergency = false;
		for (var id in Rooms.rooms) {
			if (id !== 'global') Rooms.rooms[id].addRaw("<div class=\"broadcast-green\"><b>The server is no longer in emergency mode.</b></div>");
		}

		this.logEntry(user.name + " used /endemergency");
	},

	kill: function (target, room, user) {
		if (!this.can('lockdown')) return false;

		if (!Rooms.global.lockdown) {
			return this.sendReply("For safety reasons, /kill can only be used during lockdown.");
		}

		if (CommandParser.updateServerLock) {
			return this.sendReply("Wait for /updateserver to finish before using /kill.");
		}

		/*for (var i in Sockets.workers) {
			Sockets.workers[i].kill();
		}*/

		if (!room.destroyLog) {
			process.exit();
			return;
		}
		room.destroyLog(function () {
			room.logEntry(user.name + " used /kill");
		}, function () {
			process.exit();
		});

		// Just in the case the above never terminates, kill the process
		// after 10 seconds.
		setTimeout(function () {
			process.exit();
		}, 10000);
	},

	loadbanlist: function (target, room, user, connection) {
		if (!this.can('hotpatch')) return false;

		connection.sendTo(room, "Loading ipbans.txt...");
		fs.readFile('config/ipbans.txt', function (err, data) {
			if (err) return;
			data = ('' + data).split('\n');
			var rangebans = [];
			for (var i = 0; i < data.length; ++i) {
				var line = data[i].split('#')[0].trim();
				if (!line) continue;
				if (line.indexOf('/') >= 0) {
					rangebans.push(line);
				} else if (line && !Users.bannedIps[line]) {
					Users.bannedIps[line] = '#ipban';
				}
			}
			Users.checkRangeBanned = Cidr.checker(rangebans);
			connection.sendTo(room, "ipbans.txt has been reloaded.");
		});
	},

	refreshpage: function (target, room, user) {
		if (!this.can('hotpatch')) return false;
		Rooms.global.send('|refresh|');
		this.logEntry(user.name + " used /refreshpage");
	},

	updateserver: function (target, room, user, connection) {
		if (!user.hasConsoleAccess(connection)) {
			return this.sendReply("/updateserver - Access denied.");
		}

		if (CommandParser.updateServerLock) {
			return this.sendReply("/updateserver - Another update is already in progress.");
		}

		CommandParser.updateServerLock = true;

		var logQueue = [];
		logQueue.push(user.name + " used /updateserver");

		connection.sendTo(room, "updating...");

		var exec = require('child_process').exec;
		exec('git diff-index --quiet HEAD --', function (error) {
			var cmd = 'git pull --rebase';
			if (error) {
				if (error.code === 1) {
					// The working directory or index have local changes.
					cmd = 'git stash && ' + cmd + ' && git stash pop';
				} else {
					// The most likely case here is that the user does not have
					// `git` on the PATH (which would be error.code === 127).
					connection.sendTo(room, "" + error);
					logQueue.push("" + error);
					logQueue.forEach(function (line) {
						room.logEntry(line);
					});
					CommandParser.updateServerLock = false;
					return;
				}
			}
			var entry = "Running `" + cmd + "`";
			connection.sendTo(room, entry);
			logQueue.push(entry);
			exec(cmd, function (error, stdout, stderr) {
				("" + stdout + stderr).split("\n").forEach(function (s) {
					connection.sendTo(room, s);
					logQueue.push(s);
				});
				logQueue.forEach(function (line) {
					room.logEntry(line);
				});
				CommandParser.updateServerLock = false;
			});
		});
	},

	crashfixed: function (target, room, user) {
		if (!Rooms.global.lockdown) {
			return this.sendReply('/crashfixed - There is no active crash.');
		}
		if (!this.can('hotpatch')) return false;

		Rooms.global.lockdown = false;
		if (Rooms.lobby) {
			Rooms.lobby.modchat = false;
			Rooms.lobby.addRaw("<div class=\"broadcast-green\"><b>We fixed the crash without restarting the server!</b><br />You may resume talking in the lobby and starting new battles.</div>");
		}
		this.logEntry(user.name + " used /crashfixed");
	},

	'memusage': 'memoryusage',
	memoryusage: function (target) {
		if (!this.can('hotpatch')) return false;
		target = toId(target) || 'all';
		if (target === 'all') {
			this.sendReply("Loading memory usage, this might take a while.");
		}
		if (target === 'all' || target === 'rooms' || target === 'room') {
			this.sendReply("Calculating Room size...");
			var roomSize = ResourceMonitor.sizeOfObject(Rooms);
			this.sendReply("Rooms are using " + roomSize + " bytes of memory.");
		}
		if (target === 'all' || target === 'config') {
			this.sendReply("Calculating config size...");
			var configSize = ResourceMonitor.sizeOfObject(Config);
			this.sendReply("Config is using " + configSize + " bytes of memory.");
		}
		if (target === 'all' || target === 'resourcemonitor' || target === 'rm') {
			this.sendReply("Calculating Resource Monitor size...");
			var rmSize = ResourceMonitor.sizeOfObject(ResourceMonitor);
			this.sendReply("The Resource Monitor is using " + rmSize + " bytes of memory.");
		}
		if (target === 'all' || target === 'cmdp' || target === 'cp' || target === 'commandparser') {
			this.sendReply("Calculating Command Parser size...");
			var cpSize = ResourceMonitor.sizeOfObject(CommandParser);
			this.sendReply("Command Parser is using " + cpSize + " bytes of memory.");
		}
		if (target === 'all' || target === 'sim' || target === 'simulator') {
			this.sendReply("Calculating Simulator size...");
			var simSize = ResourceMonitor.sizeOfObject(Simulator);
			this.sendReply("Simulator is using " + simSize + " bytes of memory.");
		}
		if (target === 'all' || target === 'users') {
			this.sendReply("Calculating Users size...");
			var usersSize = ResourceMonitor.sizeOfObject(Users);
			this.sendReply("Users is using " + usersSize + " bytes of memory.");
		}
		if (target === 'all' || target === 'tools') {
			this.sendReply("Calculating Tools size...");
			var toolsSize = ResourceMonitor.sizeOfObject(Tools);
			this.sendReply("Tools are using " + toolsSize + " bytes of memory.");
		}
		if (target === 'all' || target === 'v8') {
			this.sendReply("Retrieving V8 memory usage...");
			var o = process.memoryUsage();
			this.sendReply(
				"Resident set size: " + o.rss + ", " + o.heapUsed + " heap used of " + o.heapTotal  + " total heap. "
				 + (o.heapTotal - o.heapUsed) + " heap left."
			);
			delete o;
		}
		if (target === 'all') {
			this.sendReply("Calculating Total size...");
			var total = (roomSize + configSize + rmSize + cpSize + simSize + toolsSize + usersSize) || 0;
			var units = ["bytes", "K", "M", "G"];
			var converted = total;
			var unit = 0;
			while (converted > 1024) {
				converted /= 1024;
				++unit;
			}
			converted = Math.round(converted);
			this.sendReply("Total memory used: " + converted + units[unit] + " (" + total + " bytes).");
		}
		return;
	},

	bash: function (target, room, user, connection) {
		if (!user.hasConsoleAccess(connection)) {
			return this.sendReply("/bash - Access denied.");
		}

		var exec = require('child_process').exec;
		exec(target, function (error, stdout, stderr) {
			connection.sendTo(room, ("" + stdout + stderr));
		});
	},

	eval: function (target, room, user, connection, cmd, message) {
		if (!user.hasConsoleAccess(connection)) {
			return this.sendReply("/eval - Access denied.");
		}
		if (!this.canBroadcast()) return;

		if (!this.broadcasting) this.sendReply('||>> ' + target);
		try {
			var battle = room.battle;
			var me = user;
			this.sendReply('||<< ' + eval(target));
		} catch (e) {
			this.sendReply('||<< error: ' + e.message);
			var stack = '||' + ('' + e.stack).replace(/\n/g, '\n||');
			connection.sendTo(room, stack);
		}
	},

	evalbattle: function (target, room, user, connection, cmd, message) {
		if (!user.hasConsoleAccess(connection)) {
			return this.sendReply("/evalbattle - Access denied.");
		}
		if (!this.canBroadcast()) return;
		if (!room.battle) {
			return this.sendReply("/evalbattle - This isn't a battle room.");
		}

		room.battle.send('eval', target.replace(/\n/g, '\f'));
	},

	/*********************************************************
	 * Battle commands
	 *********************************************************/

	forfeit: function (target, room, user) {
		if (!room.battle) {
			return this.sendReply("There's nothing to forfeit here.");
		}
		if (!room.forfeit(user)) {
			return this.sendReply("You can't forfeit this battle.");
		}
	},

	savereplay: function (target, room, user, connection) {
		if (!room || !room.battle) return;
		var logidx = 2; // spectator log (no exact HP)
		if (room.battle.ended) {
			// If the battle is finished when /savereplay is used, include
			// exact HP in the replay log.
			logidx = 3;
		}
		var data = room.getLog(logidx).join("\n");
		var datahash = crypto.createHash('md5').update(data.replace(/[^(\x20-\x7F)]+/g, '')).digest('hex');

		LoginServer.request('prepreplay', {
			id: room.id.substr(7),
			loghash: datahash,
			p1: room.p1.name,
			p2: room.p2.name,
			format: room.format
		}, function (success) {
			if (success && success.errorip) {
				connection.popup("This server's request IP " + success.errorip + " is not a registered server.");
				return;
			}
			connection.send('|queryresponse|savereplay|' + JSON.stringify({
				log: data,
				id: room.id.substr(7)
			}));
		});
	},

	mv: 'move',
	attack: 'move',
	move: function (target, room, user) {
		if (!room.decision) return this.sendReply("You can only do this in battle rooms.");

		room.decision(user, 'choose', 'move ' + target);
	},

	sw: 'switch',
	switch: function (target, room, user) {
		if (!room.decision) return this.sendReply("You can only do this in battle rooms.");

		room.decision(user, 'choose', 'switch ' + parseInt(target, 10));
	},

	choose: function (target, room, user) {
		if (!room.decision) return this.sendReply("You can only do this in battle rooms.");

		room.decision(user, 'choose', target);
	},

	undo: function (target, room, user) {
		if (!room.decision) return this.sendReply("You can only do this in battle rooms.");

		room.decision(user, 'undo', target);
	},

	team: function (target, room, user) {
		if (!room.decision) return this.sendReply("You can only do this in battle rooms.");

		room.decision(user, 'choose', 'team ' + target);
	},

	joinbattle: function (target, room, user) {
		if (!room.joinBattle) return this.sendReply("You can only do this in battle rooms.");
		if (!user.can('joinbattle', null, room)) return this.popupReply("You must be a roomvoice to join a battle you didn't start. Ask a player to use /roomvoice on you to join this battle.");

		room.joinBattle(user);
	},

	partbattle: 'leavebattle',
	leavebattle: function (target, room, user) {
		if (!room.leaveBattle) return this.sendReply("You can only do this in battle rooms.");

		room.leaveBattle(user);
	},

	kickbattle: function (target, room, user) {
		if (!room.leaveBattle) return this.sendReply("You can only do this in battle rooms.");

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.sendReply("User " + this.targetUsername + " not found.");
		}
		if (!this.can('kick', targetUser)) return false;

		if (room.leaveBattle(targetUser)) {
			this.addModCommand("" + targetUser.name + " was kicked from a battle by " + user.name + (target ? " (" + target + ")" : ""));
		} else {
			this.sendReply("/kickbattle - User isn't in battle.");
		}
	},

	kickinactive: function (target, room, user) {
		if (room.requestKickInactive) {
			room.requestKickInactive(user);
		} else {
			this.sendReply("You can only kick inactive players from inside a room.");
		}
	},

	timer: function (target, room, user) {
		target = toId(target);
		if (room.requestKickInactive) {
			if (target === 'off' || target === 'false' || target === 'stop') {
				room.stopKickInactive(user, user.can('timer'));
			} else if (target === 'on' || target === 'true' || !target) {
				room.requestKickInactive(user, user.can('timer'));
			} else {
				this.sendReply("'" + target + "' is not a recognized timer state.");
			}
		} else {
			this.sendReply("You can only set the timer from inside a room.");
		}
	},

	autotimer: 'forcetimer',
	forcetimer: function (target, room, user) {
		target = toId(target);
		if (!this.can('autotimer')) return;
		if (target === 'off' || target === 'false' || target === 'stop') {
			Config.forcetimer = false;
			this.addModCommand("Forcetimer is now OFF: The timer is now opt-in. (set by " + user.name + ")");
		} else if (target === 'on' || target === 'true' || !target) {
			Config.forcetimer = true;
			this.addModCommand("Forcetimer is now ON: All battles will be timed. (set by " + user.name + ")");
		} else {
			this.sendReply("'" + target + "' is not a recognized forcetimer setting.");
		}
	},

	forcetie: 'forcewin',
	forcewin: function (target, room, user) {
		if (!this.can('forcewin')) return false;
		if (!room.battle) {
			this.sendReply("/forcewin - This is not a battle room.");
			return false;
		}

		room.battle.endType = 'forced';
		if (!target) {
			room.battle.tie();
			this.logModCommand(user.name + " forced a tie.");
			return false;
		}
		target = Users.get(target);
		if (target) target = target.userid;
		else target = '';

		if (target) {
			room.battle.win(target);
			this.logModCommand(user.name + " forced a win for " + target + ".");
		}

	},

	/*********************************************************
	 * Challenging and searching commands
	 *********************************************************/

	cancelsearch: 'search',
	search: function (target, room, user) {
		if (target) {
			if (Config.pmmodchat) {
				var userGroup = user.group;
				if (Config.groupsranking.indexOf(userGroup) < Config.groupsranking.indexOf(Config.pmmodchat)) {
					var groupName = Config.groups[Config.pmmodchat].name || Config.pmmodchat;
					this.popupReply("Because moderated chat is set, you must be of rank " + groupName + " or higher to search for a battle.");
					return false;
				}
			}
			Rooms.global.searchBattle(user, target);
		} else {
			Rooms.global.cancelSearch(user);
		}
	},

	chall: 'challenge',
	challenge: function (target, room, user, connection) {
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.popupReply("The user '" + this.targetUsername + "' was not found.");
		}
		if (targetUser.blockChallenges && !user.can('bypassblocks', targetUser)) {
			return this.popupReply("The user '" + this.targetUsername + "' is not accepting challenges right now.");
		}
		if (Config.pmmodchat) {
			var userGroup = user.group;
			if (Config.groupsranking.indexOf(userGroup) < Config.groupsranking.indexOf(Config.pmmodchat)) {
				var groupName = Config.groups[Config.pmmodchat].name || Config.pmmodchat;
				this.popupReply("Because moderated chat is set, you must be of rank " + groupName + " or higher to challenge users.");
				return false;
			}
		}
		user.prepBattle(target, 'challenge', connection, function (result) {
			if (result) user.makeChallenge(targetUser, target);
		});
	},

	idle: 'blockchallenges',
	blockchallenges: function (target, room, user) {
		user.blockChallenges = true;
		this.sendReply("You are now blocking all incoming challenge requests.");
	},

	allowchallenges: function (target, room, user) {
		user.blockChallenges = false;
		this.sendReply("You are available for challenges from now on.");
	},

	cchall: 'cancelChallenge',
	cancelchallenge: function (target, room, user) {
		user.cancelChallengeTo(target);
	},

	accept: function (target, room, user, connection) {
		var userid = toId(target);
		var format = '';
		if (user.challengesFrom[userid]) format = user.challengesFrom[userid].format;
		if (!format) {
			this.popupReply(target + " cancelled their challenge before you could accept it.");
			return false;
		}
		user.prepBattle(format, 'challenge', connection, function (result) {
			if (result) user.acceptChallengeFrom(userid);
		});
	},

	reject: function (target, room, user) {
		user.rejectChallengeFrom(toId(target));
	},

	saveteam: 'useteam',
	utm: 'useteam',
	useteam: function (target, room, user) {
		user.team = target;
	},

	/*********************************************************
	 * Low-level
	 *********************************************************/

	cmd: 'query',
	query: function (target, room, user, connection) {
		// Avoid guest users to use the cmd errors to ease the app-layer attacks in emergency mode
		var trustable = (!Config.emergency || (user.named && user.authenticated));
		if (Config.emergency && ResourceMonitor.countCmd(connection.ip, user.name)) return false;
		var spaceIndex = target.indexOf(' ');
		var cmd = target;
		if (spaceIndex > 0) {
			cmd = target.substr(0, spaceIndex);
			target = target.substr(spaceIndex + 1);
		} else {
			target = '';
		}
		if (cmd === 'userdetails') {

			var targetUser = Users.get(target);
			if (!trustable || !targetUser) {
				connection.send('|queryresponse|userdetails|' + JSON.stringify({
					userid: toId(target),
					rooms: false
				}));
				return false;
			}
			var roomList = {};
			for (var i in targetUser.roomCount) {
				if (i === 'global') continue;
				var targetRoom = Rooms.get(i);
				if (!targetRoom || targetRoom.isPrivate) continue;
				var roomData = {};
				if (targetRoom.battle) {
					var battle = targetRoom.battle;
					roomData.p1 = battle.p1 ? ' ' + battle.p1 : '';
					roomData.p2 = battle.p2 ? ' ' + battle.p2 : '';
				}
				roomList[i] = roomData;
			}
			if (!targetUser.roomCount['global']) roomList = false;
			var userdetails = {
				userid: targetUser.userid,
				avatar: targetUser.avatar,
				rooms: roomList
			};
			if (user.can('ip', targetUser)) {
				var ips = Object.keys(targetUser.ips);
				if (ips.length === 1) {
					userdetails.ip = ips[0];
				} else {
					userdetails.ips = ips;
				}
			}
			connection.send('|queryresponse|userdetails|' + JSON.stringify(userdetails));

		} else if (cmd === 'roomlist') {
			if (!trustable) return false;
			connection.send('|queryresponse|roomlist|' + JSON.stringify({
				rooms: Rooms.global.getRoomList(true)
			}));

		} else if (cmd === 'rooms') {
			if (!trustable) return false;
			connection.send('|queryresponse|rooms|' + JSON.stringify(
				Rooms.global.getRooms()
			));

		}
	},

	trn: function (target, room, user, connection) {
		var commaIndex = target.indexOf(',');
		var targetName = target;
		var targetAuth = false;
		var targetToken = '';
		if (commaIndex >= 0) {
			targetName = target.substr(0, commaIndex);
			target = target.substr(commaIndex + 1);
			commaIndex = target.indexOf(',');
			targetAuth = target;
			if (commaIndex >= 0) {
				targetAuth = !!parseInt(target.substr(0, commaIndex), 10);
				targetToken = target.substr(commaIndex + 1);
			}
		}
		user.rename(targetName, targetToken, targetAuth, connection);
	},

};


//poof functions, still not neat
function getRandMessage(user){
	user = escapeHTML(user.name);
	var numMessages = 48; // numMessages will always be the highest case # + 2, as Math.floor(Math.random() * numMessages) returns a range of 0 to numMessages - 1 //increasing this will make the default appear more often
	var message = '~~ ';
	switch(Math.floor(Math.random()*numMessages)){
		case 0: message = message + user + ' knocked Cosy\'s tea out of his hand... RIP.';
		break;
		case 1: message = message + user + ' looked at Aura\'s face!';
		break;
		case 2: message = message + user + ' used Explosion!';
		break;
		case 3: message = message + user + ' was swallowed up by the Earth!';
		break;
		case 4: message = message + user + ' was sold in a slave trade to a Chinese man!';
		break;	
		case 5: message = message + user + ' was eaten by Lex!';
		break;
		case 6: message = message + user + ' was sucker punched by Absol!';
		break;
		case 7: message = message + user + ' has left the building.';
		break;
		case 8: message = message + user + ' got lost in the woods!';
		break;
		case 9: message = message + user + ' left for their lover!';
		break;
		case 10: message = message + user + ' couldn\'t handle the coldness of Frost!';
		break;
		case 11: message = message + user + ' was hit by Magikarp\'s Revenge!';
		break;
		case 12: message = message + user + ' was sucked into a whirlpool!';
		break;
		case 13: message = message + user + ' got scared and left the server!';
		break;
		case 14: message = message + user + ' went into a cave without a repel!';
		break;
		case 15: message = message + user + ' got eaten by a bunch of piranhas!';
		break;
		case 16: message = message + user + ' ventured too deep into the forest without an escape rope';
		break;
		case 17: message = message + 'A large spider descended from the sky and picked up ' + user + '.';
		break;
		case 18: message = message + user + ' was tricked by Fizz!';
		break;
		case 19: message = message + user + ' woke up an angry Snorlax!';
		break;
		case 20: message = message + user + ' was forced to give jd an oil massage!'; 
		break;
		case 21: message = message + user + ' was used as shark bait!';
		break;
		case 22: message = message + user + ' peered through the hole on Shedinja\'s back';
		break;
		case 23: message = message + user + ' received judgment from the almighty Arceus!';
		break;
		case 24: message = message + user + ' used Final Gambit and missed!';
		break;
		case 25: message = message + user + ' went into grass without any Pokemon!';
		break;
		case 26: message = message + user + ' made a Slowbro angry!';
		break;
		case 27: message = message + user + ' took a focus punch from Breloom!';
		break;
		case 28: message = message + user + ' got lost in the illusion of reality.';
		break;
		case 29: message = message + user + ' ate a bomb!';
		break;
		case 30: message = message + 'BrittleWind accidentally spanked ' + user + ' too hard!';
		break;
		case 31: message = message + user + ' left for a timeout!';
		break;
		case 32: message = message + user + ' fell into a snake pit!'; 
		break;
		case 33: message = message + user + ' was swallowed whole by a Wailord!'; // Bought by Selena
		break;
		case 34: message = message + user + ' was swallowed whole by a giant wigglytuff!'; // Bought by Lyrical WigglyTuff 
		break;
		case 35: message = message + user + ' was fused with Zarif!'; //bought by Infernape/Zarif
		break;
		case 36: message = message + user + ' fades into nothingness!'; // bought by Unknown's Remnant
		break;
		case 37: message = message + user + ' was swept to sleep by frost janitor'; // bought by frost janitor
		break;
		case 38: message = message + user + ' flies into the air and does three backward somersaults in quick succession then belts out in a rhythmic tune UP UP AND AWAY'; // bought by EricSaysHi
		break;
		case 39: message = message + user + ' forgot their towel!'; // bought by Alphayocom
		break;
		case 40: message = message + user + ' got pimp slapped by jd!'; // bought by Jordan-Moo
		break;
		case 41: message = message + user + ' is blasting off again!'; // bought by Noiprocs
		break;
		case 42: message = message + user + ' flies back to their comfy nest!'; // bought by Aerodactylol
		break;
		case 43: message = message + user + ' tried to eat Piscean!'; // bought by Piscean
		break;
		case 44: message = message + user + ' away!'; // bought by CrazyClown94
		break;
		case 45: message = message + user + ' disapparated!'; // bought by Jedi Lion Potter
		break;
		case 46: message = message + user + ' was hugged by Figgybear!'; // bought by Figgy
		break;
		case 47: message = message + user + ' was thrown into the TV world by P4 Ka\'elbasa'; // bought by E4 Kael
		break;
		case 48: message = message + user + ' was accidentally killed in a shaving accident'; // bought by DeltaFlame
		break;
		case 49: message = message + user + ' faced a Xerneas with geomancy and powerherb'; // bought by FireDudeWind
		break;
		case 50: message = message + user + ' drowned in the ocean trying to find SeaNanners'; // bought by SeaNanners
		break;
		case 51: message = message + user + ' was killed by Donald'; // bought by REV Czim
		break;
		case 52: message = message + user + ' is blasting off again'; // bought by L Chevy 12
		break;
		case 53: message = message + user + ' use defog on Bisharp'; // bought by Hope/Fallen Blood
		break;
		default: message = message + user + ' bought a poisoned Pepsi!';
	};
	message = message + ' ~~';
	return message;
}

//i was going to format this, but wtf
function MD5(f){function i(b,c){var d,e,f,g,h;f=b&2147483648;g=c&2147483648;d=b&1073741824;e=c&1073741824;h=(b&1073741823)+(c&1073741823);return d&e?h^2147483648^f^g:d|e?h&1073741824?h^3221225472^f^g:h^1073741824^f^g:h^f^g}function j(b,c,d,e,f,g,h){b=i(b,i(i(c&d|~c&e,f),h));return i(b<<g|b>>>32-g,c)}function k(b,c,d,e,f,g,h){b=i(b,i(i(c&e|d&~e,f),h));return i(b<<g|b>>>32-g,c)}function l(b,c,e,d,f,g,h){b=i(b,i(i(c^e^d,f),h));return i(b<<g|b>>>32-g,c)}function m(b,c,e,d,f,g,h){b=i(b,i(i(e^(c|~d),
f),h));return i(b<<g|b>>>32-g,c)}function n(b){var c="",e="",d;for(d=0;d<=3;d++)e=b>>>d*8&255,e="0"+e.toString(16),c+=e.substr(e.length-2,2);return c}var g=[],o,p,q,r,b,c,d,e,f=function(b){for(var b=b.replace(/\r\n/g,"\n"),c="",e=0;e<b.length;e++){var d=b.charCodeAt(e);d<128?c+=String.fromCharCode(d):(d>127&&d<2048?c+=String.fromCharCode(d>>6|192):(c+=String.fromCharCode(d>>12|224),c+=String.fromCharCode(d>>6&63|128)),c+=String.fromCharCode(d&63|128))}return c}(f),g=function(b){var c,d=b.length;c=
d+8;for(var e=((c-c%64)/64+1)*16,f=Array(e-1),g=0,h=0;h<d;)c=(h-h%4)/4,g=h%4*8,f[c]|=b.charCodeAt(h)<<g,h++;f[(h-h%4)/4]|=128<<h%4*8;f[e-2]=d<<3;f[e-1]=d>>>29;return f}(f);b=1732584193;c=4023233417;d=2562383102;e=271733878;for(f=0;f<g.length;f+=16)o=b,p=c,q=d,r=e,b=j(b,c,d,e,g[f+0],7,3614090360),e=j(e,b,c,d,g[f+1],12,3905402710),d=j(d,e,b,c,g[f+2],17,606105819),c=j(c,d,e,b,g[f+3],22,3250441966),b=j(b,c,d,e,g[f+4],7,4118548399),e=j(e,b,c,d,g[f+5],12,1200080426),d=j(d,e,b,c,g[f+6],17,2821735955),c=
j(c,d,e,b,g[f+7],22,4249261313),b=j(b,c,d,e,g[f+8],7,1770035416),e=j(e,b,c,d,g[f+9],12,2336552879),d=j(d,e,b,c,g[f+10],17,4294925233),c=j(c,d,e,b,g[f+11],22,2304563134),b=j(b,c,d,e,g[f+12],7,1804603682),e=j(e,b,c,d,g[f+13],12,4254626195),d=j(d,e,b,c,g[f+14],17,2792965006),c=j(c,d,e,b,g[f+15],22,1236535329),b=k(b,c,d,e,g[f+1],5,4129170786),e=k(e,b,c,d,g[f+6],9,3225465664),d=k(d,e,b,c,g[f+11],14,643717713),c=k(c,d,e,b,g[f+0],20,3921069994),b=k(b,c,d,e,g[f+5],5,3593408605),e=k(e,b,c,d,g[f+10],9,38016083),
d=k(d,e,b,c,g[f+15],14,3634488961),c=k(c,d,e,b,g[f+4],20,3889429448),b=k(b,c,d,e,g[f+9],5,568446438),e=k(e,b,c,d,g[f+14],9,3275163606),d=k(d,e,b,c,g[f+3],14,4107603335),c=k(c,d,e,b,g[f+8],20,1163531501),b=k(b,c,d,e,g[f+13],5,2850285829),e=k(e,b,c,d,g[f+2],9,4243563512),d=k(d,e,b,c,g[f+7],14,1735328473),c=k(c,d,e,b,g[f+12],20,2368359562),b=l(b,c,d,e,g[f+5],4,4294588738),e=l(e,b,c,d,g[f+8],11,2272392833),d=l(d,e,b,c,g[f+11],16,1839030562),c=l(c,d,e,b,g[f+14],23,4259657740),b=l(b,c,d,e,g[f+1],4,2763975236),
e=l(e,b,c,d,g[f+4],11,1272893353),d=l(d,e,b,c,g[f+7],16,4139469664),c=l(c,d,e,b,g[f+10],23,3200236656),b=l(b,c,d,e,g[f+13],4,681279174),e=l(e,b,c,d,g[f+0],11,3936430074),d=l(d,e,b,c,g[f+3],16,3572445317),c=l(c,d,e,b,g[f+6],23,76029189),b=l(b,c,d,e,g[f+9],4,3654602809),e=l(e,b,c,d,g[f+12],11,3873151461),d=l(d,e,b,c,g[f+15],16,530742520),c=l(c,d,e,b,g[f+2],23,3299628645),b=m(b,c,d,e,g[f+0],6,4096336452),e=m(e,b,c,d,g[f+7],10,1126891415),d=m(d,e,b,c,g[f+14],15,2878612391),c=m(c,d,e,b,g[f+5],21,4237533241),
b=m(b,c,d,e,g[f+12],6,1700485571),e=m(e,b,c,d,g[f+3],10,2399980690),d=m(d,e,b,c,g[f+10],15,4293915773),c=m(c,d,e,b,g[f+1],21,2240044497),b=m(b,c,d,e,g[f+8],6,1873313359),e=m(e,b,c,d,g[f+15],10,4264355552),d=m(d,e,b,c,g[f+6],15,2734768916),c=m(c,d,e,b,g[f+13],21,1309151649),b=m(b,c,d,e,g[f+4],6,4149444226),e=m(e,b,c,d,g[f+11],10,3174756917),d=m(d,e,b,c,g[f+2],15,718787259),c=m(c,d,e,b,g[f+9],21,3951481745),b=i(b,o),c=i(c,p),d=i(d,q),e=i(e,r);return(n(b)+n(c)+n(d)+n(e)).toLowerCase()};



var colorCache = {};

function hashColor(name) {
	if (colorCache[name]) return colorCache[name];

	var hash = MD5(name);
	var H = parseInt(hash.substr(4, 4), 16) % 360;
	var S = parseInt(hash.substr(0, 4), 16) % 50 + 50;
	var L = parseInt(hash.substr(8, 4), 16) % 20 + 25;

	var m1, m2, hue;
	var r, g, b
	S /=100;
	L /= 100;
	if (S == 0)
	r = g = b = (L * 255).toString(16);
	else {
	if (L <= 0.5)
	m2 = L * (S + 1);
	else
	m2 = L + S - L * S;
	m1 = L * 2 - m2;
	hue = H / 360;
	r = HueToRgb(m1, m2, hue + 1/3);
	g = HueToRgb(m1, m2, hue);
	b = HueToRgb(m1, m2, hue - 1/3);
}


colorCache[name] = '#' + r + g + b;
return colorCache[name];
}

function HueToRgb(m1, m2, hue) {
	var v;
	if (hue < 0)
		hue += 1;
	else if (hue > 1)
		hue -= 1;

	if (6 * hue < 1)
		v = m1 + (m2 - m1) * hue * 6;
	else if (2 * hue < 1)
		v = m2;
	else if (3 * hue < 2)
		v = m1 + (m2 - m1) * (2/3 - hue) * 6;
	else
		v = m1;

	return (255 * v).toString(16);
}

function escapeHTML(target) {
	if (!target) return false;
	target = target.replace(/&(?!\w+;)/g, '&amp;')
  	target = target.replace(/</g, '&lt;')
    target = target.replace(/>/g, '&gt;')
   	target = target.replace(/"/g, '&quot;');
   	return target;
}

function splint(target) {
	//splittyDiddles
	var cmdArr =  target.split(",");
	for (var i = 0; i < cmdArr.length; i++) cmdArr[i] = cmdArr[i].trim();
	return cmdArr;
}
//Made by PanPawn
function MD5(e){function t(e,t){var n,r,i,s,o;i=e&2147483648;s=t&2147483648;n=e&1073741824;r=t&1073741824;o=(e&1073741823)+(t&1073741823);return n&r?o^2147483648^i^s:n|r?o&1073741824?o^3221225472^i^s:o^1073741824^i^s:o^i^s}function n(e,n,r,i,s,o,u){e=t(e,t(t(n&r|~n&i,s),u));return t(e<<o|e>>>32-o,n)}function r(e,n,r,i,s,o,u){e=t(e,t(t(n&i|r&~i,s),u));return t(e<<o|e>>>32-o,n)}function i(e,n,r,i,s,o,u){e=t(e,t(t(n^r^i,s),u));return t(e<<o|e>>>32-o,n)}function s(e,n,r,i,s,o,u){e=t(e,t(t(r^(n|~i),s),u));return t(e<<o|e>>>32-o,n)}function o(e){var t="",n="",r;for(r=0;r<=3;r++)n=e>>>r*8&255,n="0"+n.toString(16),t+=n.substr(n.length-2,2);return t}var u=[],a,f,l,c,h,p,d,v,e=function(e){for(var e=e.replace(/\r\n/g,"\n"),t="",n=0;n<e.length;n++){var r=e.charCodeAt(n);r<128?t+=String.fromCharCode(r):(r>127&&r<2048?t+=String.fromCharCode(r>>6|192):(t+=String.fromCharCode(r>>12|224),t+=String.fromCharCode(r>>6&63|128)),t+=String.fromCharCode(r&63|128))}return t}(e),u=function(e){var t,n=e.length;t=n+8;for(var r=((t-t%64)/64+1)*16,i=Array(r-1),s=0,o=0;o<n;)t=(o-o%4)/4,s=o%4*8,i[t]|=e.charCodeAt(o)<<s,o++;i[(o-o%4)/4]|=128<<o%4*8;i[r-2]=n<<3;i[r-1]=n>>>29;return i}(e);h=1732584193;p=4023233417;d=2562383102;v=271733878;for(e=0;e<u.length;e+=16)a=h,f=p,l=d,c=v,h=n(h,p,d,v,u[e+0],7,3614090360),v=n(v,h,p,d,u[e+1],12,3905402710),d=n(d,v,h,p,u[e+2],17,606105819),p=n(p,d,v,h,u[e+3],22,3250441966),h=n(h,p,d,v,u[e+4],7,4118548399),v=n(v,h,p,d,u[e+5],12,1200080426),d=n(d,v,h,p,u[e+6],17,2821735955),p=n(p,d,v,h,u[e+7],22,4249261313),h=n(h,p,d,v,u[e+8],7,1770035416),v=n(v,h,p,d,u[e+9],12,2336552879),d=n(d,v,h,p,u[e+10],17,4294925233),p=n(p,d,v,h,u[e+11],22,2304563134),h=n(h,p,d,v,u[e+12],7,1804603682),v=n(v,h,p,d,u[e+13],12,4254626195),d=n(d,v,h,p,u[e+14],17,2792965006),p=n(p,d,v,h,u[e+15],22,1236535329),h=r(h,p,d,v,u[e+1],5,4129170786),v=r(v,h,p,d,u[e+6],9,3225465664),d=r(d,v,h,p,u[e+11],14,643717713),p=r(p,d,v,h,u[e+0],20,3921069994),h=r(h,p,d,v,u[e+5],5,3593408605),v=r(v,h,p,d,u[e+10],9,38016083),d=r(d,v,h,p,u[e+15],14,3634488961),p=r(p,d,v,h,u[e+4],20,3889429448),h=r(h,p,d,v,u[e+9],5,568446438),v=r(v,h,p,d,u[e+14],9,3275163606),d=r(d,v,h,p,u[e+3],14,4107603335),p=r(p,d,v,h,u[e+8],20,1163531501),h=r(h,p,d,v,u[e+13],5,2850285829),v=r(v,h,p,d,u[e+2],9,4243563512),d=r(d,v,h,p,u[e+7],14,1735328473),p=r(p,d,v,h,u[e+12],20,2368359562),h=i(h,p,d,v,u[e+5],4,4294588738),v=i(v,h,p,d,u[e+8],11,2272392833),d=i(d,v,h,p,u[e+11],16,1839030562),p=i(p,d,v,h,u[e+14],23,4259657740),h=i(h,p,d,v,u[e+1],4,2763975236),v=i(v,h,p,d,u[e+4],11,1272893353),d=i(d,v,h,p,u[e+7],16,4139469664),p=i(p,d,v,h,u[e+10],23,3200236656),h=i(h,p,d,v,u[e+13],4,681279174),v=i(v,h,p,d,u[e+0],11,3936430074),d=i(d,v,h,p,u[e+3],16,3572445317),p=i(p,d,v,h,u[e+6],23,76029189),h=i(h,p,d,v,u[e+9],4,3654602809),v=i(v,h,p,d,u[e+12],11,3873151461),d=i(d,v,h,p,u[e+15],16,530742520),p=i(p,d,v,h,u[e+2],23,3299628645),h=s(h,p,d,v,u[e+0],6,4096336452),v=s(v,h,p,d,u[e+7],10,1126891415),d=s(d,v,h,p,u[e+14],15,2878612391),p=s(p,d,v,h,u[e+5],21,4237533241),h=s(h,p,d,v,u[e+12],6,1700485571),v=s(v,h,p,d,u[e+3],10,2399980690),d=s(d,v,h,p,u[e+10],15,4293915773),p=s(p,d,v,h,u[e+1],21,2240044497),h=s(h,p,d,v,u[e+8],6,1873313359),v=s(v,h,p,d,u[e+15],10,4264355552),d=s(d,v,h,p,u[e+6],15,2734768916),p=s(p,d,v,h,u[e+13],21,1309151649),h=s(h,p,d,v,u[e+4],6,4149444226),v=s(v,h,p,d,u[e+11],10,3174756917),d=s(d,v,h,p,u[e+2],15,718787259),p=s(p,d,v,h,u[e+9],21,3951481745),h=t(h,a),p=t(p,f),d=t(d,l),v=t(v,c);return(o(h)+o(p)+o(d)+o(v)).toLowerCase()}function hslToRgb(e,t,n){var r,i,s,o,u,a;if(!isFinite(e))e=0;if(!isFinite(t))t=0;if(!isFinite(n))n=0;e/=60;if(e<0)e=6- -e%6;e%=6;t=Math.max(0,Math.min(1,t/100));n=Math.max(0,Math.min(1,n/100));u=(1-Math.abs(2*n-1))*t;a=u*(1-Math.abs(e%2-1));if(e<1){r=u;i=a;s=0}else if(e<2){r=a;i=u;s=0}else if(e<3){r=0;i=u;s=a}else if(e<4){r=0;i=a;s=u}else if(e<5){r=a;i=0;s=u}else{r=u;i=0;s=a}o=n-u/2;r=Math.round((r+o)*255);i=Math.round((i+o)*255);s=Math.round((s+o)*255);return{r:r,g:i,b:s}}function rgbToHex(e,t,n){return toHex(e)+toHex(t)+toHex(n)}function toHex(e){if(e==null)return"00";e=parseInt(e);if(e==0||isNaN(e))return"00";e=Math.max(0,e);e=Math.min(e,255);e=Math.round(e);return"0123456789ABCDEF".charAt((e-e%16)/16)+"0123456789ABCDEF".charAt(e%16)}function hashColor(e){if(colorCache[e])return colorCache[e];var t=MD5(e);var n=parseInt(t.substr(4,4),16)%360;var r=parseInt(t.substr(0,4),16)%50+50;var i=parseInt(t.substr(8,4),16)%20+25;var s,o,u;var a,f,l;r/=100;i/=100;if(r==0)a=f=l=(i*255).toString(16);else{if(i<=.5)o=i*(r+1);else o=i+r-i*r;s=i*2-o;u=n/360;a=HueToRgb(s,o,u+1/3);f=HueToRgb(s,o,u);l=HueToRgb(s,o,u-1/3)}colorCache[e]="#"+a+f+l;return colorCache[e]}function HueToRgb(e,t,n){var r;if(n<0)n+=1;else if(n>1)n-=1;if(6*n<1)r=e+(t-e)*n*6;else if(2*n<1)r=t;else if(3*n<2)r=e+(t-e)*(2/3-n)*6;else r=e;return(255*r).toString(16)}var colorCache={};hashColor=function(e){if(colorCache[e])return colorCache[e];var t=MD5(e);var n=parseInt(t.substr(4,4),16)%360;var r=parseInt(t.substr(0,4),16)%50+50;var i=parseInt(t.substr(8,4),16)%20+25;var s=hslToRgb(n,r,i);colorCache[e]="#"+rgbToHex(s.r,s.g,s.b);return colorCache[e]};var colorCache={}


//readMoney and writeMoney functions
function readMoney(filename, user) {
	var data = fs.readFileSync('config/'+filename+'.csv', 'utf8');
	var rows = data.split("\n");
	var matched = false;
	for (var i = 0; i < rows.length; i++) {
		if (!rows[i]) continue;
		var parts = rows[i].split(",");
		var userid = toId(parts[0]);
		if (user === userid) {
			var matched = true;
			var amount = Number(parts[1]);
			break;
		}
	}
	if (matched === true) {
		return amount;
	} else {
		return 0;
	}
}

function writeMoney(filename, targetUser, added) {
	var data = fs.readFileSync('config/'+filename+'.csv', 'utf8');
	var rows = data.split("\n");
	var matched = false;
	var line = '';
	for (var i = 0; i < rows.length; i++) {
		if (!rows[i]) continue;
		var parts = rows[i].split(",");
		var userid = toId(parts[0]);
		if (targetUser === userid) {
			var matched = true;
			var amount = Number(parts[1]);
			line += rows[i];
			break;
		}
	}
	amount += added;
	if (matched === true) {
		var re = new RegExp(line,"g");
		fs.readFile('config/'+filename+'.csv', 'utf8', function (err,data) {
			if (err) {
				return console.log(err);
			}
			var result = data.replace(re, Users.get(targetUser).userid+','+amount);
			fs.writeFile('config/'+filename+'.csv', result, 'utf8', function (err) {
				if (err) return console.log(err);
			});
		});
	} else {
		var log = fs.createWriteStream('config/'+filename+'.csv', {'flags': 'a'});
		amount = added;
		log.write("\n"+Users.get(targetUser).userid+','+amount);
	}
	return amount;
}


function getAvatar(user) {
        if (!user) return false;
        var user = toId(user);
        var data = fs.readFileSync('config/avatars.csv','utf8');
        var line = data.split('\n');
        var count = 0;
        var avatar = 1;
        
        for (var u = 1; u > line.length; u++) {
            if (line[u].length < 1) continue;
            column = line[u].split(',');
            if (column[0] == user) {
                avatar = column[1];
                break;
            }
        }
        
        for (var u in line) {
                count++;
                if (line[u].length < 1) continue;
                column = line[u].split(',');
                if (column[0] == user) {
                        avatar = column[1];
                        break;
                }
        }

        return avatar;
}
