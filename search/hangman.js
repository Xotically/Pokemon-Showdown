hangman.reset(room.id)
}
else {
if (hangman[room.id].guessedwords.indexOf(target) != -1) {
return this.sendReply('Someone has already guessed this word.')
}
hangman[room.id].givenguesses = hangman[room.id].givenguesses - 1;
hangman[room.id].guessedwords.push(target);
if(hangman[room.id].givenguesses === 0) {
hangman.reset(room.id)
return this.add('|html|<b>' + user.name + '</b> guessed the word \'' + targetword + '\', but it was not the word. You have failed to guess the word, so the man has been hanged.');
}
this.add('|html|<b>' + user.name + '</b> guessed the word \'' + targetword + '\', but it was not the word.');
}
},

endhangman: function(target, room, user) {
/*if(room.id === 'lobby') {
return this.sendReply('|html|Please play this in another room; it\'s too spammy for lobby.');
}*/
if (!user.can('broadcast', null, room)) {
return this.sendReply('You do not have enough authority to do this.');
}
if(hangman[room.id].hangman === false) {
return this.sendReply('There is no game going on.');
}
if(hangman[room.id].hangman === true) {
this.add('|html|<b>' + user.name + '</b> ended the game of hangman.');
hangman.reset(room.id);
}
}
};

for (var i in cmds) CommandParser.commands[i] = cmds[i];
