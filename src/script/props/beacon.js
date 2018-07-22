'use strict'
var inherits = require('inherits')
var WorldObject = require('./../engine/worldobject.js')
var BetterCanvas = require('./../common/bettercanvas.js')
var Sheet = require('./sheet.js')

module.exports = Beacon
inherits(Beacon, WorldObject)

function Beacon (x, y, z) {
  WorldObject.call(this, {
    position: { x: x, y: y, z: z },
    pixelSize: { x: 15, y: 16, z: 45 },
    height: 2.5
  })
  // console.log('beacon:',this.position);
  this.link = 'https://telegram.org'
  this.unWalkable = true
  var self = this
  this.on('draw', function (canvas) {
    if (self.exists) canvas.drawEntity(self)
  })
  this.imageName = 'props'
  this.sheet = new Sheet('beacon')
  this.sprite.metrics = this.sheet.map.main
}

Beacon.prototype.addToGame = function (game) {
  WorldObject.prototype.addToGame.call(this, game)
  this.game.on('update', this.onUpdate.bind(this))
  this.drawSprite()
}

Beacon.prototype.drawSprite = function () {
  var canvas = new BetterCanvas(this.sheet.map.main.w, this.sheet.map.main.h)
  canvas.drawImage(this.game.renderer.images[this.imageName],
    this.sheet.map.main.x, this.sheet.map.main.y, this.sheet.map.main.w, this.sheet.map.main.h,
    0, 0, this.sheet.map.main.w, this.sheet.map.main.h)
  if (this.pinging) {
    canvas.drawImage(this.game.renderer.images[this.imageName],
      this.sheet.map.light.x, this.sheet.map.light.y, this.sheet.map.light.w, this.sheet.map.light.h,
      this.sheet.map.light.ox, 0, this.sheet.map.light.w, this.sheet.map.light.h, this.pinging / 100)
  }
  this.sprite.image = canvas.canvas
}

Beacon.prototype.onUpdate = function () {
  if (this.pinging) {
    this.pinging = Math.max(0, this.pinging - 1)
    this.drawSprite()
  }
  if (this.game.mouseOut || (this.game.mouseOver &&
        (this.game.mouseOver.zDepth > this.zDepth || // Don't override closer objects
        this.game.mouseOver.position.z > this.position.z)) || // Don't override higher objects
    this.game.ui.mouseOnElement) return // Ignore if mouse on UI element
  var mouse = {
    x: this.game.centerMouseX - this.game.renderer.canvases[0].panning.panned.x,
    y: this.game.centerMouseY - this.game.renderer.canvases[0].panning.panned.y
  }
  var metrics = this.sheet.map.main
  if (mouse.x >= metrics.ox &&
        mouse.x < metrics.w + metrics.ox &&
        mouse.y >= metrics.oy &&
        mouse.y < metrics.h + metrics.oy) {
    this.game.mouseOver = this
  } else if (this.game.mouseOver === this) {
    this.game.mouseOver = false
  }
}

Beacon.prototype.ping = function () {
  this.pinging = 100
}
