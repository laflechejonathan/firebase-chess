// imports
var http = require('http');
var firebase = require('firebase');
var express = require('express');
var swig  = require('swig');
var chess = require('chess');
var shortid = require('shortid');

// initialize web app
var app = express();
// static files in 'static' directory
app.use('/static', express.static('static'));
// we use the 'swig' template engine for rendering files
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// setup firebase client
var config = {
    apiKey: 'AIzaSyACofSRECHHqlF7SWrQkr48ZaHX7ps7LYY',
    serviceAccount: `${__dirname}/chess-game-b00bdb1d898a.json`,
    databaseURL: 'https://chess-game-2dce5.firebaseio.com',
};
firebase.initializeApp(config);

// routes go here

app.get('/', function (req, res) {
    firebase.database().ref('games/').once('value', snapshot => {
        res.render('index.html', {'games': snapshot.val()});
        console.log(snapshot.val());
    });
});

app.get('/new-game', function (req, res) {
    const gameId = shortid.generate();
    firebase.database().ref(`games/${gameId}`).set({
        'fen': ['rnbqkbnr', 'pppppppp', '8', '8', '8', '8', 'PPPPPPPP', 'RNBQKBNR'],
        'id': gameId,
        'turn': 'white'
    });
    res.redirect(`/game/${gameId}_W`);
});

app.get('/games', function (req, res) {
});

app.get('/game/:gameId', function (req, res) {
    const fullId = req.params.gameId;
    const gameId = fullId.substring(0, fullId.length - 2);
    const isWhite = fullId.substring(fullId.length - 2) === '_W';
    console.log('getting ', gameId);
    firebase.database().ref(`games/${gameId}`).once('value', snapshot => {
        console.log('got ', snapshot.val());
        res.render('game.html', {
            'opponentId': gameId + (isWhite ? '_B' : '_W'),
            'fullId': fullId,
            'gameId': gameId,
            'player': isWhite ? 'white' : 'black',
            'gameObj': snapshot.val(),
        });        
    })
});

// server listens on port 8080

app.listen(8080, function () {
  console.log('Listening on port 8080...');
});
