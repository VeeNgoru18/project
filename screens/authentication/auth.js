//getting the required modules
const electron = require ('electron');
const ipc = electron.ipcRenderer;

//add event listener for for the login button i.e 'on click'
//calling function login()
document.getElementById('sb').addEventListener('click',function()  {
    login();
     document.getElementById("uName").value = "";
    document.getElementById("pass").value = "";

});



document.getElementById('cp').addEventListener('click', ()=>{
   ipc.send('change', '') ;
});
