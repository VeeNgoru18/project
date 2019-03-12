'use strict'//uses stricter version of js

const {BrowserWindow } = require('electron')

//default window windowSettings
const defaultProps = {
  width: 500,
  height: 800,
  show: false
}

class Window extends BrowserWindow
{
  constructor ({file, ...windowSettings}) {
    //calls new BrowserWindow with these defaultProps
    super({...defaultProps, ...windowSettings })

    //load the html and open openDevTools
    this.loadFile(file)
    this.webContents.openDevTools()

    //gracefully show when readyto prevent flickering
    this.once('ready-to-show', ()=> {
      this.show()
    })
  }
}
module.exports = Window
