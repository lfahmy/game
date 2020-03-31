const Constants = require('../shared/constants');
const Player = require('./player');
const Balcony = require('./balcony');
const applyCollisions = require('./collisions');

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.coins = [];
    this.lastUpdateTime = Date.now();
    //this.begin = Date.now();
    this.shouldSendUpdate = false;
    this.numPlayers = 0;
    setInterval(this.update.bind(this), 1000 / 60);

    this.balconies = [];
    for(let i = 0; i < Math.floor(Constants.MAP_HEIGHT/Constants.BALCONY_HEIGHT); i++) {
      this.balconies.unshift(new Balcony("", i*Constants.BALCONY_HEIGHT)); //add each balcony to the end
      //this.balconies[i].setOccupied(true, "");
    }
  }

  addPlayer(socket, username) {
    this.sockets[socket.id] = socket;

    // Generate a position to start this player at.
    /*const x = Constants.MAP_WIDTH * (0.25 + Math.random() * 0.5);
    const y = Constants.MAP_HEIGHT * (0.25 + Math.random() * 0.5);*/
    const x = Constants.MAP_WIDTH/2;
    const y = Constants.MAP_HEIGHT/2 - Constants.PLAYER_HEIGHT/2;
    this.numPlayers++;
    this.balconies[this.numPlayers-1].setOccupied(true, socket.id);
    this.players[socket.id] = new Player(socket.id, username, x, y, this.numPlayers-1);
  }

  removePlayer(socket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  handleInput(socket, dir) {
    if (this.players[socket.id]) {
      //this.players[socket.id].setDirection(dir);
      this.players[socket.id].addVector(100, dir);
      //console.log(this.players[socket.id].speed, this.players[socket.id].direction * 180/Math.PI);
    }
  }

  handleMouse(socket, x, y) {
    if(this.players[socket.id]) {
      //console.log("x:", x + player.x,"-- y:", y + player.y);
    }
  }

  update() {
    // Calculate time elapsed
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    // Update each coin
    const coinsToRemove = [];
    this.coins.forEach(coin => {
      if (coin.update(dt)) {
        // Destroy this coin
        coinsToRemove.push(coin);
      }
    });
    this.coins = this.coins.filter(coin => !coinsToRemove.includes(coin));

    // Update each player
    Object.keys(this.sockets).forEach(playerID => {
      const player = this.players[playerID];
      //console.log(now - this.begin);
      const newCoin = player.update(dt);
      //console.log(player.speed);
      if(player.calcThreshold()) player.findNextBalc(this.balconies);
      if (newCoin) {
        this.coins.push(newCoin);
      }
    });

    // Apply collisions, give players score for hitting coins
    const destroyedCoins = applyCollisions(Object.values(this.players), this.coins);
    destroyedCoins.forEach(c => {
      if (this.players[c.hitterID]) {
        this.players[c.hitterID].onCoinHit();
        if(this.players[c.hitterID].calcThreshold()) this.players[c.hitterID].findNextBalc(this.balconies);
      }
    });
    this.coins = this.coins.filter(coin => !destroyedCoins.includes(coin));

    // Check if any players are dead
    Object.keys(this.sockets).forEach(playerID => {
      const socket = this.sockets[playerID];
      const player = this.players[playerID];
      if (player.hp <= 0) {
        socket.emit(Constants.MSG_TYPES.GAME_OVER);
        this.removePlayer(socket);
      }
    });

    // Send a game update to each player every other time
    if (this.shouldSendUpdate) {
      const leaderboard = this.getLeaderboard();
      Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        const player = this.players[playerID];
        socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player, leaderboard));
      });
      this.shouldSendUpdate = false;
    } else {
      this.shouldSendUpdate = true;
    }
  }

  getLeaderboard() {
    return Object.values(this.players)
      .sort((p1, p2) => p2.score - p1.score)
      .slice(0, 5)
      .map(p => ({ username: p.id, score: Math.round(p.score) }));
  }

  createUpdate(player, leaderboard) {
    const nearbyPlayers = Object.values(this.players).filter(
      p => p !== player && p.distanceTo(player.x, player.y) >= 0/*<= Constants.MAP_SIZE / 2*/,
    );
    const nearbyCoins = this.coins/*.filter(
      c => c.distanceTo(player) <= Constants.MAP_SIZE / 2,
    )*/;

    return {
      t: Date.now(),
      me: player.serializeForUpdate(),
      others: nearbyPlayers.map(p => p.serializeForUpdate()),
      coins: nearbyCoins.map(c => c.serializeForUpdate()),
      balconies: this.balconies.map(balc => balc.serializeForUpdate()),
      leaderboard,
    };
  }
}

module.exports = Game;
