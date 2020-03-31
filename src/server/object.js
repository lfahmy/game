class Object {
  constructor(id, x, y, dir, speed, acceleration) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.direction = dir;
    this.speed = speed;
    this.acceleration = acceleration;
  }

  update(dt) {
    //this.speed -= dt * 9.81;
    //console.log("Speed Before:", this.speed, "-- Dir Before:", this.direction * 180/Math.PI);
    const vx = this.speed * Math.cos(this.direction);
    const vy = this.speed * Math.sin(this.direction) + dt * this.acceleration;
    this.x += dt * vx;
    this.y -= dt * vy;
    this.speed = Math.sqrt(vx * vx + vy * vy);
    this.direction = Math.atan2(vy, vx);
    //console.log("Speed After:", this.speed, "-- Dir After:", this.direction * 180/Math.PI);
  }

  distanceTo(object) {
    console.log("hey");
    const dx = this.x - object.x;
    const dy = this.y - object.y;
    console.log("this.x:", this.x, "-- object.x:", object.x, "-- this.y:", this.y, "-- object.y:", object.y);
    return Math.sqrt(dx * dx + dy * dy);
  }

  distanceTo(x, y) {
    const dx = this.x - x;
    const dy = this.y - y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  setDirection(dir) {
    this.direction = dir;
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  addVector(speed, dir) {
    const vx = this.speed * Math.cos(this.direction) + speed * Math.cos(dir);
    const vy = this.speed * Math.sin(this.direction) + speed * Math.sin(dir);
    this.speed = Math.sqrt(vx * vx + vy * vy);
    this.direction = Math.atan2(vy, vx);
  }

  serializeForUpdate() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
    };
  }
}

module.exports = Object;
