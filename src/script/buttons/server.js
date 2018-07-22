module.exports = (game) => ({ text: 'Server',
  top: 3,
  right: 3,
  onPress: function () {
    if (game.serverListPanel) {
      game.serverListPanel.remove()
      delete game.serverListPanel
      return
    }
    var joinThisServer = function (server) {
      return function () {
        var params = '?s=' + server.id
        if (server.password) params += '&p=' + server.password
        if (server.passworded) {
          var submitPassword = function (pass) {
            bs.setItem('dzone-default-server', JSON.stringify({
              id: server.id, password: pass
            }))
            server.password = pass
            if (window.location.protocol != 'file:') {
              window.history.pushState(
                {server: server.id, password: server.password},
                server.id, window.location.pathname + params
              )
            }
            joinServer(server)
            game.passwordPromptPanel.remove()
            delete game.passwordPromptPanel
          }
          game.passwordPromptPanel = game.ui.addPanel({
            left: 'auto', top: 'auto', w: 102, h: 28
          })
          game.passwordPromptInput = game.ui.addInput({
            left: 5,
            top: 5,
            w: 65,
            h: 18,
            parent: game.passwordPromptPanel,
            onSubmit: submitPassword,
            text: server.password ? server.password : ''
          })
          game.passwordPromptInput.focus()
          game.passwordPromptOK = game.ui.addButton({
            text: 'OK',
            right: 5,
            top: 5,
            w: 24,
            h: 18,
            parent: game.passwordPromptPanel,
            onPress: game.passwordPromptInput.submit.bind(game.passwordPromptInput)
          })
        } else {
          bs.setItem('dzone-default-server', JSON.stringify({ id: server.id }))
          if (window.location.protocol != 'file:') {
            window.history.pushState(
              {server: server.id, password: server.password},
              server.id, window.location.pathname + params
            )
          }
          joinServer(server)
        }
        game.serverListPanel.remove()
        delete game.serverListPanel
      }
    }
    game.serverListPanel = game.ui.addPanel({
      left: 'auto', top: 'auto', w: 146, h: 28 + 21 * (Object.keys(game.servers).length - 2)
    })
    var widestButton = 136
    var serverButtonY = 0
    var button
    for (var sKey in game.servers) {
      if (!game.servers.hasOwnProperty(sKey)) continue
      if (sKey == 'default') continue
      var server = game.servers[sKey]
      var serverLock = game.servers[sKey].passworded ? ':icon-lock-small: ' : ''
      button = game.ui.addButton({
        text: serverLock + game.servers[sKey].name,
        left: 5,
        top: 5 + serverButtonY * 21,
        w: 136,
        h: 18,
        parent: game.serverListPanel,
        onPress: new joinThisServer(server)
      })
      widestButton = Math.max(widestButton, button.textCanvas.width + 2)
      serverButtonY++
    }
    game.serverListPanel.resize(widestButton + 10, game.serverListPanel.h)
    game.serverListPanel.resizeChildren(widestButton, button.h)
    game.serverListPanel.reposition()
  } })
