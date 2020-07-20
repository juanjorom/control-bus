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
                <graf v-for="elemento in info" :key="elemento" :datos="elemento" ></graf>    
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import graf from '@/components/graf'

export default {
    name: 'report-recorrido',
    data: () =>{
        return {
            prevdata: [],
            fechaIni: new Date().toISOString().substr(0, 10),
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
                    vueltas: [],
                    times: []
                }
                var arbol= this.getArbol(dat.device)
                var paradas = []
                var tiempos = []
                var vuelt = 0
                var ruta =  this.getRuta(arbol)
                var llen = Array.from(ruta)
                llen.fill(null)
                element.forEach(item => {
                    if(item.content.includes("Enter")){
                        var lug= (item.content.substring(item.content.indexOf(':')+1,item.content.lastIndexOf(',')))
                        var time =(((item.gpstime.substring(item.gpstime.indexOf(' ')+1)).replace(':','')).replace(/(:\d{2})$/g,''))
                        
                        if(lug=="ATM"){
                            if(paradas.length>3){
                                vuelt = vuelt+1
                                tiempos.push('Vuelta '+vuelt)
                                paradas.unshift('paradas')
                                dat.vueltas.push(paradas)
                                dat.times.push(tiempos.concat(llen))
                                
                            }
                            llen.fill(null)
                            paradas= []
                            tiempos= []
                        }
                        if(llen[ruta.indexOf(lug)]==null){
                            llen[ruta.indexOf(lug)]=time
                            paradas.push(lug)
                        }
                        
                    }else if(item.content.includes("Exit") && item.content.includes("ATM")){
                        paradas.push(item.content.substring(item.content.indexOf(':')+1,item.content.lastIndexOf(',')))
                        llen[0] = (((item.gpstime.substring(item.gpstime.indexOf(' ')+1)).replace(':','')).replace(/(:\d{2})$/g,''))
                    }
                })
                if(dat.vueltas.length>0){
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
    components:{
        graf
    }
}
</script>

<style>

</style>