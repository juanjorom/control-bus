import rutitas from '@/assets/docs/data'
import io from 'socket.io-client'

const state = {
    info: [],
    prevdata: [],
    rutas: rutitas.rutas,
    position: [],
    socket: null,
    ubicacion: [],
    lineas: rutitas.tiempos,
    bases: rutitas.bases,
    paradas: rutitas.paradas,
    rutaParada: []
}

const getters = {
    getInfo: state => {
        return state.info
    },
    getPrev: state =>{
        return state.prevdata
    },
    getRuta: state => ruta => {
        var result = state.rutas.find(bus=> bus.name==ruta) 
        return result
    },
    getPosition: state => {
        return state.position
    },
    getTiempos: state => linea => {
        return state.lineas.find(com => com.name==linea)
    },
    getDatos: state => linea => {
        return state.lineas.find(com => com.name==linea)
    },
    getAllParadas: state => {
        return state.paradas
    },
    getParadas: state => ruta => {
        var par =state.lineas.find(com => com.name== ruta)
        return par.paradas.map(ele => ele.name)
    },

    getBases: state => base => {
        return state.bases.find(base)
    },
    getGeocercasOcupadas: state => carros =>{
        var result= []
        carros.forEach(el =>{
            var bus =state.position.find(ele => ele.deviceid==el.deviceid)
            if(bus!=undefined){
                bus.devicename = el.carlicence
                result.push(bus)
            }else{
                result.push({deviceid: el.deviceid, devicename:el.carlicence, fence: "ATM", hora:"0000-00-00 00:00:00", direccion:"BASE"})
            }
        })
        return result
    },
    getUbicacion: state =>{
        return state.ubicacion
    }
}

const mutations = {
    eliminarParada(state, value){
        var ind  = state.paradas.indexOf(value)
        state.paradas.splice(ind, 1)
    },
    agregarParada(state){
        var id = state.paradas.length+1
        state.paradas.push({id:id, name:"Nueva Parada", points:[]})
    },
    agregarPunto(state,value){
        var indice = state.paradas.findIndex(e => e.id==value.id)
        state.paradas[indice].points.push(value.punto)
    },
    deletePoint(state,value){
        console.log(value);
        var ind = state.paradas.findIndex(e => e.id==value.id)
        var indice = state.paradas[ind].points.findIndex(i => i==value.punto)
        state.paradas[ind].points.splice(indice, 1)
    },
    updateRutaParadaFromSet(state, value){
        state.rutaParada = value
    },
    updateRutaParada(state, value){
        console.log(value);
        var ind = state.rutaParada.findIndex(e => e.id==value.id)
        console.log(ind);
        if(ind<0){
            state.rutaParada.push(value)
        }else{
            state.rutaParada.splice(ind,1)
        }
    },
    iniciarSocket(state,host){
        state.socket= io('http://'+host+':12056')
    },
    addInfo(state,data){
        state.info=data
    },
    addDatos(state, data){
        state.datos = data
    },
    addCarPosition(state, car){
        state.position.push(car)
    },
    actualizarPosition(state, pos){
        var index =state.position.findIndex(x => x.deviceid==pos.deviceno)  
        if(index<0){
            state.position.push({deviceid: pos.deviceno, devicename: pos.carlicense, fence: "ATM", hora:"0000-00-00 00:00:00", direccion: "BASE"})
            index = state.position.findIndex(x => x.deviceid==pos.deviceno)
        }
        var ant = state.position[index].fence
        state.position[index].fence = pos.content.substring(pos.content.indexOf(':')+1,pos.content.lastIndexOf(','))
        state.position[index].hora = pos.dateTime
        var ruta = state.rutas.find(e => e.name==pos.groupName)
        var ind = ruta.paradas.findIndex(e=> e===ant)
        var indice = ruta.paradas.findIndex(e => e===state.position[index].fence)
        if(ind!=indice){
            if(ruta.bases.find(e=> e == state.position[index].fence)){
                state.position[index].direccion = "BASE"
            }
            else if(indice<ind){
                state.position[index].direccion = "REGRESO"
            }
            else {
                state.position[index].direccion = "IDA"
            }
        }
    },
    actualizarUbicacion(state, pos){
        var index =state.ubicacion.findIndex(x => x.deviceno==pos.deviceno)
        /*var final = {
            deviceno: pos.deviceno,
            coord: [pos.lat,pos.lng],
            speed: pos.speed,
            direction: pos.direction,
            altitud: pos.altitude,
            dateTime: pos.dateTime,
            carlicence: pos.carlicense,
            groupName: pos.groupName
        }*/
        if(index<0){
            state.ubicacion.push({
                deviceno: pos.deviceno,
                coord: [pos.lat,pos.lng],
                speed: pos.speed,
                direction: pos.direction,
                altitude: pos.altitude,
                dateTime: pos.dateTime,
                carlicense: pos.carlicense,
                groupName: pos.groupName})
        }else{
            state.ubicacion[index].coord= [pos.lat,pos.lng]
            state.ubicacion[index].speed= pos.speed
            state.ubicacion[index].direction= pos.direction
            state.ubicacion[index].altitude=pos.altitude
            state.ubicacion[index].dateTime=pos.dateTime
        }
        
    }
}

const actions = {
    actualizar({commit}, data){
        commit('addInfo',data)
    },

    conectarSocket({commit, rootState}, host){
        
        commit('iniciarSocket', host)
        state.socket.emit('sub_alarm', {
            key: rootState.logdata.key,
            didArray: rootState.carros.carros.map(x=> x.deviceid),
            alarmType: [18]
        })
        state.socket.on('sub_alarm', (data) => {
            commit('actualizarPosition', data)
        })
        state.socket.emit('sub_gps',{
            key: rootState.logdata.key,
            didArray: rootState.carros.carros.map(x => x.deviceid)
        })
        state.socket.on('sub_gps', (data) => {
            commit('actualizarUbicacion', data)
        })
    }

}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}