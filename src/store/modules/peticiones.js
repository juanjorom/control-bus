import axios from 'axios'
const state = {
    
}

const getters = {

}

const mutations = {

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