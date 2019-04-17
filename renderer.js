// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
//getting the required modules
const electron = require ('electron');
const url = require('url');
const path = require ('path');
const Menu = electron.Menu;
const ipc = electron.ipcMain;
const mysql = require('mysql');
const {app, BrowserWindow} = electron;
require('electron-reload')(__dirname);

//declaring all the required window variables and other variables with a global reference
let mainWindow;
let homeWindow;
let addWindow;
let addSWindow;
let backWindow;
let changeWindow;



//creating connection to db
let con = mysql.createConnection({
    host: 'localhost',
    user: 'username',
    password: 'password',
    database: 'project',

});

con.connect();

//creating the menu template
let template = [{
    label: 'Exit',
    submenu: [{
        label: 'minimize',
        accelerator: "ctrl+",
        role: "minimize",
    }, {
        type: 'separator'
    }, {
        label: "Quit",
        accelerator: "ctrl+q",
        role: "quit",
    }]
}];


//Checking if app is ready to launch and
//creating the login/main window
app.on('ready', function(){
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    mainWindow = new BrowserWindow({
        show : false,
        backgroundColor: '#fff',
        fullscreen: true,
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'auth.html'),
        protocol: 'file:',
        slashes: true
    }));
    mainWindow.webContents.openDevTools();
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

});


//creating the home window
ipc.on('login', (event, arg) => {
    user = arg.userName;
    let pass = arg.pass;

    let sql = 'SELECT * FROM `users` WHERE idNO = ' + mysql.escape(user);
    con.query(sql, function (err, result) {
        console.log(err);
        if (result[0] == null) {
            event.sender.send('invalid', 'wrong username');
        } else {
            if (result[0].status === 0) {
                event.sender.send('invalid', 'User No longer exist');
            } else if (result[0].username !== user) {
                event.sender.send('invalid', 'wrong username');
            } else if (result[0].password !== pass) {
                event.sender.send('invalid', 'wrong password');
            }else{
                event.sender.send('invalid', '');

                isAdmin = result[0].is_admin;
                fnam = result[0].fname;
                lnam = result[0].lname;
                id = result[0].user_id;

                const menu = Menu.buildFromTemplate(template);
                Menu.setApplicationMenu(menu);
                homeWindow = new BrowserWindow({
                    backgroundColor: '#fff',
                    fullscreen: true,
                });

                homeWindow.loadURL(url.format({
                    pathname: path.join(__dirname, sales.html'),
                    protocol: 'file:',
                    slashes: true
                }));

                mainWindow.hide();
                homeWindow.webContents.openDevTools();

            }

        }
    });

});

ipc.on('show', ()=>{
    mainWindow.show();
});


//creating the returning  homewindow;
ipc.on('back', () => {
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    backWindow = new BrowserWindow({
        backgroundColor: '#fff',
         fullscreen: true,
    });

    backWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'sales.html'),
        protocol: 'file:',
        slashes: true
    }));

    backWindow.webContents.openDevTools();
});




//sending user details to the renderer process i.e homewindow
ipc.on('isAdmin', (event) => {
    event.sender.send('user', isAdmin, user, fnam, lnam, id);
});

//creating the change password window
ipc.on('change',  () => {
    changeWindow = new BrowserWindow({
        backgroundColor: '#fff',
        width: 250,
        height: 400,
        title: "change password",
        resizable: false,
        alwaysOnTop: true,
    });

    changeWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'change.html'),
        protocol: 'file:',
        slashes: true
    }));

    changeWindow.webContents.openDevTools()
});


//creating the admin window and
ipc.on('admin', () => {
     adminWindow = new BrowserWindow({
        backgroundColor: '#fff',
         fullscreen: true,
     });

    adminWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'adm.html'),
        protocol: 'file:',
        slashes: true,
    }));

   adminWindow.webContents.openDevTools();
});


//creating the add user window
ipc.on('addUser', () => {
    addWindow = new BrowserWindow({
        backgroundColor: '#fff',
        width: 500,
        height: 700,
        title: "add User",
        resizable: false,
        alwaysOnTop: true,
    });

    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addUser.html'),
        protocol: 'file:',
        slashes: true
    }));

   addWindow.webContents.openDevTools();
});


//adding the user details provided t the database
ipc.on('cAddUser', (event, arg) => {
    con.connect();

    con.query('INSERT INTO users(fname, lname, id_no, contact, email, username, password, status)' +
        ' values("'+arg.firstName+'","'+arg.lastName+'","'+arg.idNumber+'","'+arg.phoneNumber+'",' +
        '"'+arg.email+'","'+arg.userName+'","'+arg.password+'", "'+1+'")', function(err) {
       console.log(arg.price);
        if(err){
           console.log(err);
       } else{
           console.log('we good');
       }

    });
    con.end();

});


//creating the add stock window
ipc.on('addStock', () => {
    addSWindow = new BrowserWindow({
        backgroundColor: '#fff',
        width: 300,
        height: 550,
        title: "add stock",
        resizable: false,
        alwaysOnTop: true,
    });

    addSWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addStock.htm'),
        protocol: 'file:',
        slashes: true
    }));

});

//adding the stock details provided to the database
ipc.on('cAddStock', (event, arg) => {
    con.connect();

    con.query('INSERT INTO stock(name_description, keyword, quantity_available, unit_of_measure, price_per_unit)' +
        ' values("'+arg.name+'","'+arg.keyword+'","'+arg.quantity+'","'+arg.Unit_of_measure+'","'+arg.price+'")', function(err) {
        if(err){
            console.log(err);
        } else{
            console.log('we good');
        }
    });

    con.end();
});
