
//import { ipcRenderer } from 'electron'
function leerLoginData(arg = String) {
    /*ipcRenderer.send('getLoginData', arg)
    return ipcRenderer.on('loginValues', function (event, val){
        return val
    })*/
    console.log(arg);
}

function escribirLoginData(arg = String, valor){
    //ipcRenderer.send('setLoginData', {arg: arg, valor:valor})
    console.log(arg, valor);
}
export { leerLoginData, escribirLoginData };