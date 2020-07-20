import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Login from '@/views/Login'
import Vision from "@/views/Vision"
import Detail from "@/views/Detail"
import Historial from "@/views/Historial"
import Mapa from "@/views/Mapa"
import Tiempos from "@/views/Tiempos"
import Configuracion from "@/views/Configuracion"


Vue.use(Router)

const routes= [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: "/real",
        name: "real",
        component: Vision
    },
    {
        path: "/detail",
        name: "detail",
        component: Detail
    },
    {
        path: "/historial",
        name: "historial",
        component: Historial
    },
    {
        path: "/mapa",
        name: "mapa",
        component: Mapa
    },
    {
        path: "/tiempos",
        name: "tiempos",
        component: Tiempos
    },
    {
        path: "/configuracion",
        name: "configuracion",
        component: Configuracion
    },
    {
        path: '/home',
        name: 'home',
        component: Home,
        children :[
            {
                path: '/',
                redirect: '/real'
            },
        ]
    }
]

const router= new Router({
    routes
})

export default router