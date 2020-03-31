const ObjectClass = require('./object');
const Coin = require('./coin');
const Constants = require('../shared/constants');

class Player extends ObjectClass {
  constructor(id, username, x, y, balc) {
    super(id, x, y, Constants.UP, Constants.PLAYER_SPEED, Constants.G);
    this.username = username;
    this.hp = Constants.PLAYER_MAX_HP;
    this.coinCooldown = 0;
    this.score = 0;
    this.currentThresh = 0;
    this.balc = balc;
  }

  // Returns a newly created coin, or null.
  update(dt) {
    //console.log("Speed Before:", this.speed, "-- Dir Before:", this.direction * 180/Math.PI);
    super.update(dt);
    //console.log("Speed After:", this.speed, "-- Dir After:", this.direction * 180/Math.PI);

    // Update score
    this.score += dt * Constants.SCORE_PER_SECOND;

    // Make sure the player stays in bounds
    this.x = Math.max(Constants.PLAYER_WIDTH/2, Math.min(Constants.MAP_WIDTH - Constants.PLAYER_WIDTH/2, this.x));
    this.y = Math.max(Constants.PLAYER_HEIGHT/2, Math.min(Constants.MAP_HEIGHT - Constants.PLAYER_HEIGHT/2, this.y));

    // Set speed to 0 if player hit top or bottom
    if(this.y == Constants.PLAYER_HEIGHT/2 || this.y == Constants.MAP_HEIGHT - Constants.PLAYER_HEIGHT/2) {
      this.speed = 0;
    }

    // Spawn a coin, if needed
    this.coinCooldown -= dt;
    if (this.coinCooldown <= 0) {
      this.coinCooldown += Constants.PLAYER_COIN_COOLDOWN;
      const x = Constants.MAP_WIDTH * (0.25 + Math.random() * 0.5);
      const y = Constants.MAP_HEIGHT * (0.25 + Math.random() * 0.5);
      return new Coin("", x, y, 0);
    }

    return null;
  }

  /*takeBulletDamage() {
    this.hp -= Constants.BULLET_DAMAGE;
  }*/

  onCoinHit() {
    this.score += Constants.SCORE_COIN_HIT;
  }

  //returns true if we should find next balcony
  calcThreshold() {
    const thresh = Math.floor(this.score/500)*500;
    if(this.currentThresh != thresh) {
      this.currentThresh = thresh;
      return true;
    }
    return false;
  }

  findNextBalc(balconies) {
    let i = Math.floor(this.score/Constants.BALCONY_HEIGHT);
    while(i < balconies.length) {
      if(!balconies[i].occupied) {
        balconies[i].setOccupied(true, this.id);
        balconies[this.balc].setOccupied(false, "");
        this.balc = i;
        break;
      }
      i++;
    }
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      direction: this.direction,
      hp: this.hp,
    };
  }
}

module.exports = Player;
