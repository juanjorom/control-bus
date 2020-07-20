import axios from 'axios'

const state = {
    historial: null,
}

const getters = {
    getHistorial: state => {
        return state.historial
    }
}

const mutations = {
    setHistorial(state, historial){
        state.historial = historial
    }
}

const actions = {
    async alarmDetail({rootState},params){
        var request= await axios.post('http://'+rootState.logdata.host+':12056/api/v1/basic/alarm/detail',{
                key: rootState.logdata.key,
                terid: params.carritos,
                type: [18],
                starttime: params.fechaInicio,
                endtime: params.fechaFin
            })
        return request
    }
}


export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}