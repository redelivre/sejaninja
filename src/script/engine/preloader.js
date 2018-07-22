'use strict'
var BetterCanvas = require('./../common/bettercanvas.js')

module.exports = Preloader

var imageList = {
  actors: require('./../../img/actors.png'),
  environment: require('./../../img/environment.png'),
  'static-tiles': require('./../../img/static-tiles.png'),
  props: require('./../../img/props.png'),
  font: require('./../../img/font.png')
}

const imageCount = Object.keys(imageList).length

function Preloader (onComplete) {
  this.images = {}
  this.imagesLoaded = 0
  this.onComplete = onComplete
  Object.entries(imageList).map(e => {
    const name = e[0]
    const uri = e[1]

    var image = new Image()
    image.addEventListener('load', this.onImageLoad.bind(this, image, name))
    image.src = uri
    // if (image.complete) this.onImageLoad(image, name)
  })
}

Preloader.prototype.onImageLoad = function (image, imageName) {
  var canvas = new BetterCanvas(image.width, image.height)
  this.images[imageName] = canvas.canvas
  canvas.drawImage(image, 0, 0, image.width, image.height, 0, 0, image.width, image.height)
  this.imagesLoaded++
  if (this.imagesLoaded == imageCount) this.onComplete(this.images)
}
