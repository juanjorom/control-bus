import { leerLoginData } from '../../assets/js/natives'

const state = {
    username: leerLoginData('username')
}

const getters = {
    
    getDato: state => {
        console.log(state.username);
        return state.username
    },

    getTiempos: state => linea => {
        return state.lineas.find(com => com.name==linea)
    },
    getDatos: state => linea => {
        return state.lineas.find(com => com.name==linea)
    },
    getParadas: state => ruta => {
        var par =state.lineas.find(com => com.name== ruta)
        return par.paradas.map(ele => ele.name)
    },
    getAllParadas: state => {
        return state.paradas
    },

}

const mutations = {
    /*setDato(state, dato, valor){
        console.log(dato);
        console.log(valor);
        state.datos.set(dato, valor)
    },
    delDato(state, dato){
        state.datos.delete(dato)
    }*/
}

const actions = {

}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}