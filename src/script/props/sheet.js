'use strict'

var map = {
  beacon: {
    main: {x: 0, y: 13, w: 39, h: 70, ox: 0, oy: 13},
    light: {x: 0, y: 0, w: 5, h: 4, ox: 13, oy: 13}
  },
  seed: {
    plant: {x: 36, y: 0, w: 16, h: 22, ox: 2, oy: 2},
    orb: {x: 36, y: 22, w: 8, h: 8, ox: 8, oy: 4}
  },
  flag: {x: 6, y: 0, w: 9, h: 13, ox: 11, oy: -25}
}

module.exports = Sheet

function Sheet (spriteName) {
  this.map = JSON.parse(JSON.stringify(map[spriteName]))
}
