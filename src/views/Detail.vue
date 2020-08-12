<template>
    <v-container>
        <v-row>
            <span>UNIDADES</span>
        </v-row>
        <v-row no-gutters>
            <v-col cols="3">
                <v-date-picker v-model="fechaIni"></v-date-picker>
            </v-col>
            <v-col cols="9">
                <v-tabs v-model="tab" grow="true">
                    <v-tab v-for="i in tabs" :key="i" :href="'#'+i">{{i}}</v-tab>
                </v-tabs>
                <v-tabs-items v-model="tab">
                    <v-tab-item value="Unidad">
                        <detailunidad></detailunidad>
                    </v-tab-item>
                    <v-tab-item value="Vuelta">
                        <detailvuelta></detailvuelta>
                    </v-tab-item>
                </v-tabs-items>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import moment from 'moment'
import detailunidad from "@/views/DetalleUnidad"
import detailvuelta from "@/views/DetalleVuelta"

export default {
    name: 'report-recorrido',
    data: () =>{
        return {
            tab:"Unidad",
            prevdata: [],
            fechaIni: new Date().toISOString().substr(0, 10),
            tabs: ["Unidad", "Vuelta"]
        }
    },
    created(){
        this.pedir()
    },
    watch: {
        fechaIni(){
            this.pedir()
        },
        cars() {
            this.pedir()
        }
    },
    computed: {
        ...mapGetters({
            info: 'sock/getInfo',
            cars: 'carros/getCarsSelected',
            getRuta: 'sock/getRuta',
            getArbol: 'carros/getArbolById',
        }),
    },
    methods: {
         ...mapMutations({
            anadir: 'sock/addInfo',
            agregar: 'sock/addDatos',
        }),
        ...mapActions({
            alarmDetail: 'peticiones/alarmDetail'
        }),
        darData(data){
            this.agregar(data)
        },
        async pedir(){
            this.anadir(await this.obtenerPrevio(this.cars,this.fechaIni))
        },
        async obtenerPrevio(cars,fechaIni){    
            
            var fehcina= fechaIni+" 00:00:00"
            var fechafin= fechaIni + " 23:59:59"

            
            var carritos = []
            cars.forEach(it =>{
                carritos.push(it.deviceid)
            })
            
            var params = {carritos:carritos, fechaInicio: fehcina, fechaFin:fechafin}
            var request= await this.alarmDetail(params)
            
            var respuest= []
            
            carritos.forEach( element => {
                var filtrado = request.data.data.filter(item => item.terid == element)
                 
                if(filtrado.length>0){
                    respuest.push(filtrado)
                }
            });
            var organizado = this.organizarRuta(respuest, cars)
            
            return organizado
        },

        organizarRuta(elementos, carros){
            var conjunt = []
            elementos.forEach(element => {
                element.reverse()
                var dat= {
                    device: element[0].terid,
                    times: [],
                    vueltas: []
                }
                var arbol= this.getArbol(dat.device)
                dat.rutaName = arbol
                var par = 0
                var vuelt = 0
                var bases = this.getRuta(arbol).bases
                var ruta =  this.getRuta(arbol).paradas
                var fech = Array.from(ruta)
                fech.fill(null)
                element.forEach(item => {
                    if(item.content.includes("Enter")){
                        var lug = (item.content.substring(item.content.indexOf(':')+1,item.content.lastIndexOf(',')))
                        if(bases.find(f =>f==lug) != undefined){
                            par++
                            if(par>3){
                                fech[ruta.indexOf(lug)]=moment(item.gpstime).format('x')
                                var v = {}
                                if(lug==bases[0]){
                                    v.vuelta= vuelt
                                    v.direccion= "Regreso"
                                }else{
                                    vuelt = vuelt+1
                                    v.vuelta= vuelt
                                    v.direccion= "Ida"
                                }
                                v.tiempos = Array.from(fech)
                                dat.times.push(v)
                            }
                            fech.fill(null)
                            v={}
                            par=0
                        }
                        if(fech[ruta.indexOf(lug)]==null){
                            fech[ruta.indexOf(lug)]=moment(item.gpstime).format('x')
                            par++
                        }
                        
                    }else if(item.content.includes("Exit") && item.content.includes(bases[0])){
                        fech[ruta.indexOf(bases[0])]=moment(item.gpstime).format('x')
                        par++
                    }else if(item.content.includes("Exit") && item.content.includes(bases[1])){
                        fech[ruta.indexOf(bases[1])]=moment(item.gpstime).format('x')
                        par++
                    }
                })
                if(dat.times.length>0){
                    var buscado = carros.findIndex(busc=> busc.deviceid==dat.device)
                    dat.nombre= carros[buscado].carlicence
                    dat.ruta = ruta
                    dat.id = "diagrama-"+ carros[buscado].groupid
                    conjunt.push(dat)
                }
            });
            return conjunt
        },
    },
    components: {
        detailunidad,
        detailvuelta
    }
}
</script>

<style>

</style>