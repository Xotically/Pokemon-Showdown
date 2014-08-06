},

bryanaa: 'bryanaa',
bryan: 'bryanaa',
bryanaa: function(target, room, user) {
if (!this.canBroadcast()) return;
this.sendReplyBox('<center><img src="http://imgur.com/D23ynY8.png">' +
'<img src="http://imgur.com/VEX0Eia.png" height="80" width="290">' +
'<img src=http://imgur.com/BspnJAR.png><br />' +
'<b>Ace:</b> nope<br />' +
'<b>Catchphrase:</b> nope\no.<center>');
},

shofu: function(target, room, user) {
if (!this.canBroadcast()) return;
this.sendReplyBox('<center><img src="http://static2.businessinsider.com/image/508807266bb3f70f5d000000/15-things-that-make-barack-obama-sad.jpg" height="476" width="357"><br />' +
'<img src="http://pbs.twimg.com/profile_images/1538004667/Document0002.png"><br />' +
'<b><blink>Ace: Darniggatan</blink></b><br />' +
'<b>The realest nigga you have ever seen</b>');
},

legit: 'legitbutton',
legitbutton: function(target, room, user) {
if (!this.canBroadcast()) return;
this.sendReplyBox('<center><img height=150 src=""http://imgur.com/ivb5I1m.png>' +
'<img src="http://imgur.com/ogGLuEb.png">' +
'<img height=150 src="http://imgur.com/ivb5I1m.png"><br />' +
'<b>Ace: </b>Mo\' Fuckin\' Common Sense!<br />' +
'<b>Quote: </b>Would you like some fresh cut nanis? No? Well your mom bought some. She LOVED it ;D</center>');
},
};

Object.merge(CommandParser.commands, trainerCards);
exports.trainerCards = trainerCards;
