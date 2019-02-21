"use strict";

const {app} = require("electron")
const Window = require('./Window')

function main() {
  let mainWindow = new Window({
    file: 'index.html',
    name: 'jdahs'
  })
}

app.on('ready', main);

app.on('window-all-closed', function() {
  alert('goodbye')
  app.quit()
})
