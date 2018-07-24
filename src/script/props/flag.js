'use strict'
var inherits = require('inherits')
var util = require('./../common/util.js')
var WorldObject = require('./../engine/worldobject.js')
var BetterCanvas = require('./../common/bettercanvas.js')
var Sheet = require('./sheet.js')

module.exports = Flag
inherits(Flag, WorldObject)

function Flag (options) {
  this.unwalkable = true
  WorldObject.call(this, {
    position: options,
    pixelSize: { x: 12, y: 16, z: 16 },
    height: 1
  })
  this.origin = options.origin
  // var canvas = new BetterCanvas(1,1);
  var self = this
  this.on('draw', function (canvas) {
    if (self.exists) canvas.drawEntity(self)
  })
  this.sheet = new Sheet('flag')
  this.sprite.image = 'props'
  this.sprite.metrics = this.sheet.map
  this.boundGrow = this.grow.bind(this)
  this.growTime = 20
  this.growStage = 0
}

Flag.prototype.addToGame = function (game) {
  WorldObject.prototype.addToGame.call(this, game)
  this.tickDelay(this.boundGrow, this.growTime + util.randomIntRange(this.growTime / -6, this.growTime / 6))
}

Flag.prototype.grow = function () {
  this.growStage = (this.growStage + 1)%3
  var metrics = JSON.parse(JSON.stringify(this.sheet.map))
  metrics.x += this.sprite.metrics.w * this.growStage
  this.sprite.metrics = metrics
  var nextGrowth = this.growTime + util.randomIntRange(this.growTime / -6, this.growTime / 6)
  this.tickDelay(this.boundGrow, nextGrowth)
}

// Flag.prototype.onUpdate = function() {
// if(this.position.z > 0) {
//    this.velocity.z = Math.max(-0.02,this.velocity.z-0.0001);
//    this.velocity.x = util.clamp(this.velocity.x + util.randomIntRange(-1,1)/1000,-0.01,0.01);
//    this.velocity.y = util.clamp(this.velocity.y + util.randomIntRange(-1,1)/1000,-0.01,0.01);
//    this.position.x += this.velocity.x;
//    this.position.y += this.velocity.y;
//    this.position.z = Math.max(0,this.position.z + this.velocity.z);
//    this.zDepth = this.calcZDepth();
//    this.updateScreen();
// } else {
//    this.velocity.z = 0; this.velocity.x = 0; this.velocity.y = 0;
// }
// };

// Flag.prototype.calcZDepth = function() {
//    return Math.round(this.position.x) + Math.round(this.position.y);
// };
