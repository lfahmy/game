const Constants = require('../shared/constants');

// Returns an array of coins to be destroyed.
function applyCollisions(players, coins) {
  const destroyedCoins = [];
  for (let i = 0; i < coins.length; i++) {
    // Look for a player to collide each coin with.
    // As soon as we find one, break out of the loop to prevent double counting a coin.
    for (let j = 0; j < players.length; j++) {
      const coin = coins[i];
      const player = players[j];

      let testX = coin.x;
      let testY = coin.y;
      if (coin.x < player.x - Constants.PLAYER_WIDTH/2) testX = player.x - Constants.PLAYER_WIDTH/2;        // left edge
      else if (coin.x > player.x + Constants.PLAYER_WIDTH/2) testX = player.x + Constants.PLAYER_WIDTH/2;     // right edge
      if (coin.y < player.y - Constants.PLAYER_HEIGHT/2) testY = player.y - Constants.PLAYER_HEIGHT/2;        // top edge
      else if (coin.y > player.y + Constants.PLAYER_HEIGHT/2) testY = player.y + Constants.PLAYER_HEIGHT/2;     // bottom edge
      
      if (coin.distanceTo(testX, testY) <= Constants.COIN_RADIUS) {
        coin.hitterID = player.id;
        destroyedCoins.push(coin);
        break;
      }
    }
  }
  return destroyedCoins;
}

module.exports = applyCollisions;
