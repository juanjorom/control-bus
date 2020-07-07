import rutitas from '@/assets/docs/data'
import io from 'socket.io-client'
//import { stat } from 'fs'
//import axios from 'axios'

const state = {
    info: [],
    prevdata: [],
    rutas: rutitas.rutas,
    position: [],
    socket: null,
    ubicacion: []
}

const getters = {
    getInfo: state => {
        return state.info
    },
    getPrev: state =>{
        return state.prevdata
    },
    getDatos: state => {
        return state.datos
    },
    getRuta: state => ruta =>{
        return state.rutas.find(bus=> bus.name==ruta).paradas
    },
    getPosition: state =>{
        return state.position
    },
    getGeocercasOcupadas: state => carros =>{
        var result= []
        carros.forEach(el =>{
            var bus =state.position.find(ele => ele.deviceid==el.deviceid)
            if(bus!=null){
                bus.devicename = el.carlicence
                result.push(bus)
            }else{
                result.push({deviceid: el.deviceid, devicename:el.carlicence, fence: "ATM", hora:"0000-00-00 00:00:00"})
            }
        })
        return result
    },
    getUbicacion: state =>{
        return state.ubicacion
    }
}

const mutations = {
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
            state.position.push({deviceid: pos.deviceno, fence: "ATM", hora:"0000-00-00 00:00:00"})
            index = state.position.findIndex(x => x.deviceid==pos.deviceno)
        }
        state.position[index].fence = pos.content.substring(pos.content.indexOf(':')+1,pos.content.lastIndexOf(','))
        state.position[index].hora = pos.dateTime
        //console.log(state.position)
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