'use strict'

var {BrowserWindow} = require('electron')

var defaultProps = {
  width: 500,
  height: 800,
  show:false
}
class Window extends BrowserWindow {
  constructor ({file, ...windowSettings}) {
    // super({...defaultProps, ...windowSettings})

    // load the html
    this.loadFile(file)
    this.webContents.openDevTools()

    this.once('ready-to-show', () => {
      this.show()
    })
  }
}

module.exports = Window
