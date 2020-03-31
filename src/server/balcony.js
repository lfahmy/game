const shortid = require('shortid');
const ObjectClass = require('./object');
const Constants = require('../shared/constants');

class Balcony extends ObjectClass {
  constructor(parentID, y) {
    super(shortid(), Constants.MAP_WIDTH - Constants.NO_BALCONY_WIDTH, y, 0, 0, 0);
    this.parentID = parentID;
    this.occupied = false;
  }

  setOccupied(occupied, parentID) {
  	this.occupied = occupied;
  	this.parentID = parentID;
  	this.x  = occupied ? Constants.MAP_WIDTH - Constants.BALCONY_WIDTH : Constants.MAP_WIDTH - Constants.NO_BALCONY_WIDTH;
  }

  // Returns true if the balcony should be destroyed
  update(dt) {
    super.update(dt);
    return this.x < 0 || this.x > Constants.MAP_SIZE || this.y < 0 || this.y > Constants.MAP_SIZE;
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      occupied: this.occupied,
    };
  }
}

module.exports = Balcony;