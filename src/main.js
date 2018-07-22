'use strict'
var util = require('./script/common/util.js')
var Preloader = require('./script/engine/preloader.js')
var Game = require('./script/engine/game.js')
var Renderer = require('./script/engine/renderer.js')
var Canvas = require('./script/engine/canvas.js')
var UI = require('./script/ui/ui.js')
var bs = require('browser-storage')
var ninjas = require('./ninjas.js')

// TODO: Loading screen while preloading images, connecting to websocket, and generating world
console.log('Loading...')
var packageInfo = require('../package.json')
var version = packageInfo.version
var preloader = new Preloader(initGame)
var game

function initGame (images) {
  game = new Game({ step: 1000 / 60 })
  game.renderer = new Renderer({ game: game, images: images })
  var canvas = new Canvas({ id: 'main', game: game, initialScale: 2, backgroundColor: '#181213' })
  game.renderer.addCanvas(canvas)
  game.bindCanvas(canvas)
  game.ui = new UI(game)
  // game.showGrid = true;
  // game.timeRenders = true;

  // game.on('update', function () {
  //    // Update
  // });
  initWebsocket()

  window.pause = function () { game.paused = true }
  window.unpause = function () { game.paused = false }
  window.game = game
}

function initWebsocket () {
  var World = require('./script/environment/world.js')
  var Users = require('./script/actors/users.js')
  var Decorator = require('./script/props/decorator.js')
  var users, world, decorator

  // var TestSocket = require('./script/engine/tester.js'),
  //    ws = new TestSocket(50,3000);
  const _onData = data => {
    onData(JSON.parse(data))
  }
  const onData = data => {
    if (decorator) decorator.beacon.ping()
    if (data.type == 'server-list') {
      game.servers = data.data
      console.log('Got server list:', game.servers)
      // Server button
      // Help button
      game.ui.addButton({ text: '?',
        bottom: 3,
        right: 3,
        w: 18,
        h: 18,
        onPress: function () {
          if (game.helpPanel) {
            game.helpPanel.remove()
            delete game.helpPanel
            return
          }
          game.helpPanel = game.ui.addPanel({ left: 'auto', top: 'auto', w: 200, h: 75 })
          game.ui.addLabel({ text: 'D-Zone ' + version, top: 5, left: 'auto', parent: game.helpPanel })
          game.ui.addLabel({
            text: packageInfo.description, top: 20, left: 2, maxWidth: 196, parent: game.helpPanel
          })
          game.ui.addLabel({
            text: ':icon-npm: View on npm',
            hyperlink: 'https://www.npmjs.com/package/d-zone',
            top: 50,
            left: 8,
            parent: game.helpPanel
          })
          game.ui.addLabel({
            text: ':icon-github: View on GitHub',
            hyperlink: 'https://github.com/vegeta897/d-zone',
            top: 50,
            right: 8,
            parent: game.helpPanel
          })
        }})
      var startupServer = getStartupServer()
      joinServer(startupServer)
    } else if (data.type == 'server-join') { // Initial server status
      game.reset()
      game.renderer.clear()
      var userList = data.data.users
      world = new World(game, Math.round(3.3 * Math.sqrt(Object.keys(userList).length)))
      decorator = new Decorator(game, world)
      game.decorator = decorator
      users = new Users(game, world)
      //      var params = '?s=' + data.data.request.server
      //      if (data.data.request.password) params += '&p=' + data.data.request.password
      //        if (window.location.protocol != 'file:') {
      //        window.history.replaceState(
      //          data.data.request, data.data.request.server, window.location.pathname + params
      //        )
      //      }
      // return;
      // console.log('Initializing actors',data.data);
      game.setMaxListeners(Object.keys(userList).length + 50)
      users.setMaxListeners(Object.keys(userList).length)
      for (var uid in userList) {
        if (!userList.hasOwnProperty(uid)) continue
        // if(uid != '86913608335773696') continue;
        // if(data.data[uid].status != 'online') continue;
        if (!userList[uid].username) continue
        const actor = users.addActor(userList[uid])
        actor.updatePresence('online')
        // break;
      }
      console.log((Object.keys(users.actors).length).toString() + ' actors created')
      game.renderer.canvases[0].onResize()
    } else if (data.type == 'presence') { // User status update
      if (!users.actors[data.data.uid]) return
      users.actors[data.data.uid].updatePresence(data.data.status)
    } else if (data.type == 'message') { // Chatter
      users.queueMessage(data.data)
    } else if (data.type == 'error') {
      window.alert(data.data.message)
      if (!game.world) joinServer({id: 'default'})
    } else {
      // console.log('Websocket data:',data);
    }
  }

  const hashCode = (s) => (
    s.split('')
      .reduce((a, b) => { a = ((a << 2) - a) + b.charCodeAt(0); return a & a }, 0) % 0xffffff)
    .toString(16).padStart(6, '0')

  const mockData = {
    type: 'server-join',
    data: {
      users: ninjas.reduce((acc, cur) => (Object.assign({
        [cur.uid]: {
          username: '@' + cur.uid,
          id: cur.uid,
          link: 'https://twitter.com/' + cur.uid,
          roleColor: '#' + hashCode(cur.uid)
        }
      }, acc)), {}),
      request: {}
    }
  }

  const sendMessage = (ninja) => (
    onData({
      type: 'message',
      data: {
        uid: ninja.uid,
        message: ninja.says,
        channel: 'Ninja General'
      }
    })
  )

  console.error(mockData)
  onData(mockData)

  setInterval(() => {
    if (Math.random() * 10 < 8) return

    sendMessage(util.pickInArray(ninjas))
  }, 500)
  setInterval(() => (onData({type: 'ping'})), 2000)

  window.testMessage = function (message) {
    var msg = message ? message.text : 'hello, test message yo!'
    var uid = message ? message.uid : users.actors[Object.keys(users.actors)[0]].uid
    var channel = message ? message.channel : '1'
    /* ws.emit('data', JSON.stringify({ type: 'message',
      data: {
        uid: uid, message: msg, channel: channel
      }})) */
  }
}

window.onpopstate = function (event) {
  var server = { id: event.state.server }
  if (event.state.password) server.password = event.state.password
  joinServer(server)
}

function joinServer (server) {
  var connectionMessage = { type: 'connect', data: { server: server.id } }
  if (server.password) connectionMessage.data.password = server.password
  console.log('Requesting to join server', server.id)
//  ws.write(new Buffer(JSON.stringify(connectionMessage)))
}

function getStartupServer () {
  // Get startup server, first checking URL params, then localstorage
  var startupServer = { id: util.getURLParameter('s') } // Check URL params
  if (!startupServer.id) {
    startupServer = bs.getItem('dzone-default-server') // Check localstorage
    if (startupServer) startupServer = JSON.parse(startupServer)
  }
  if (!startupServer/* || !game.servers[startupServer.id] */) startupServer = { id: 'default' }
  if (util.getURLParameter('p')) startupServer.password = util.getURLParameter('p')
  return startupServer
}

// setTimeout(function() { game.paused = true; },1000);
