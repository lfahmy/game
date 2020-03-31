const shortid = require('shortid');
const ObjectClass = require('./object');
const Constants = require('../shared/constants');

class Coin extends ObjectClass {
  constructor(hitterID, x, y, dir) {
    super(shortid(), x + Constants.COIN_RADIUS, y + Constants.COIN_RADIUS, dir, 0, 0);
    this.hitterID = hitterID;
  }

  // Returns true if the coin should be destroyed
  update(dt) {
    super.update(dt);
    return this.x < 0 || this.x > Constants.MAP_WIDTH || this.y < 0 || this.y > Constants.MAP_HEIGHT;
  }
}

module.exports = Coin;
