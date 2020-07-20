<template>
<v-container>
    <v-row>
        <v-col cols="2">
            <v-row>
                <v-menu v-model="menuFechaIni" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="fechaIni" label="Seleccione Fecha Inicial" readonly v-bind="attrs" v-on="on">
                        </v-text-field>
                    </template>
                    <v-date-picker v-model="fechaIni" @input="menuFechaIni = false"></v-date-picker>
                </v-menu>
            </v-row>
                <v-row>
                <v-menu v-model="menuHoraIni" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="horaIni" label="Seleccione Hora Inicial" readonly v-bind="attrs" v-on="on" >
                        </v-text-field>
                    </template>
                    <v-time-picker v-model="horaIni" format="24hr" scrollable ></v-time-picker>
                </v-menu>
            </v-row>
            <v-row>
                <v-menu v-model="menuFechaFin" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="fechaFin" label="Seleccione Fecha Final" readonly v-bind="attrs" v-on="on">
                        </v-text-field>
                    </template>
                    <v-date-picker v-model="fechaFin" @input="menuFechaFin = false"></v-date-picker>
                </v-menu>
            </v-row>
                <v-row>
                <v-menu v-model="menuHoraFin" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="horaFin" label="Seleccione Hora Final" readonly v-bind="attrs" v-on="on" >
                        </v-text-field>
                    </template>
                    <v-time-picker v-model="horaFin" format="24hr" scrollable ></v-time-picker>
                </v-menu>
            </v-row>
            <v-row>
                <v-btn @click="pedir">
                    <span>Consultar</span>
                </v-btn>
            </v-row>
        </v-col>
        <v-col cols="10">
            <v-row>
                <v-card v-for="item in camiones" :key="item.name">
                    <v-card-title>{{item.nombre}}</v-card-title>
                    <v-card-text>

                        <v-row v-for="vuelta in item.vueltas" :key="vuelta">
                            <tabla :paradas="vuelta" :direccion="vuelta.direccion" ></tabla>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-row>    
        </v-col>
    </v-row>
</v-container>
</template>

<script>
import tabla from '@/components/tabla'
import { mapGetters, mapActions } from 'vuex'

export default {
    data: () =>{
        return {
            fechaIni: new Date().toISOString().substring(0,10),
            fechaFin: new Date().toISOString().substring(0,10),
            horaIni: '00:00',
            horaFin: '23:59',
            menuFechaIni: false,
            menuHoraIni: false,
            menuFechaFin: false,
            menuHoraFin: false,
            camiones: []
        }
    },
    computed: {
        ...mapGetters({
            info: 'sock/getInfo',
            historial: 'peticiones/getHistorial',
            datos: 'datos/getDato',
            carros: 'carros/getCarsSelected',
        })
    },
    components: {
        tabla
    },
    methods: {
        ...mapActions({
            alarmDetail: 'peticiones/alarmDetail'
        }),

        async pedir(){
            if(this.carros.length==0){
                alert("Por favor seleccione una unidad!!")
                return    
            }
            this.loading=true
            var fehcina = ""
            var fechafin = ""
            fehcina= this.fechaIni + " " + this.horaIni + ":00"
            fechafin= this.fechaFin + " " + this.horaFin + ":00"
            

            var carritos = []
            this.carros.forEach(it =>{
                carritos.push(it.deviceid)
            })
            var params = {carritos:carritos, fechaInicio: fehcina, fechaFin:fechafin}
            
            var reques = await this.alarmDetail(params)
            
            var respuest= []
            
            carritos.forEach( element => {
                var filtrado = reques.data.data.filter(item => item.terid == element)
                
                if(filtrado.length>0){
                    respuest.push(filtrado)
                }
            });
            
            this.camiones= this.organizarRuta(respuest, this.carros)
        },

        organizarRuta(elementos, carros){
            var conjunt = []
            elementos.forEach(element => {
                element.reverse()
                var dat= {
                    device: element[0].terid,
                    vueltas: []
                }
                //var arbol= this.getArbol(dat.device)
                var vuelt = 0
                var obje = {}
                var paradas= 0
                obje.paradas = []
                element.forEach(item => {
                    if(item.content.includes("Enter")){
                        var lug= (item.content.substring(item.content.indexOf(':')+1,item.content.lastIndexOf(',')))
                        var time =item.gpstime.substring(item.gpstime.indexOf(' ') +1)
                        var fecha = item.gpstime
                        obje.paradas.push(
                            {
                                time:time,
                                parada: lug,
                                fecha: fecha
                            }
                        )
                        paradas++
                        if(lug=="ATM" || lug=="LA MISION"){
                            if(paradas>3){
                                if(lug=="ATM"){
                                    obje.direccion="Regreso"
                                    obje.vuelta = "Vuelta " + vuelt
                                }
                                else{
                                    obje.direccion="Ida"
                                    vuelt = vuelt+1
                                    obje.vuelta = "Vuelta " + vuelt
                                }
                                dat.vueltas.push(obje)
                            }
                            obje={}
                            obje.paradas = []
                            paradas=0
                        }
                        
                        
                    }else if(item.content.includes("Exit") && item.content.includes("ATM")){
                        obje.paradas.push(
                            {
                                time: item.gpstime.substring(item.gpstime.indexOf(' ') +1),
                                parada: "ATM",
                                fecha: item.gpstime
                            }
                        )
                        paradas++
                    }else if(item.content.includes("Exit") && item.content.includes("LA MISION")){
                        obje.paradas.push(
                            {
                                time: item.gpstime.substring(item.gpstime.indexOf(' ') +1),
                                parada: "LA MISION",
                                fecha: item.gpstime
                            }
                        )
                        paradas++
                    }
                })
                if(dat.vueltas.length>0){
                    var buscado = carros.findIndex(busc=> busc.deviceid==dat.device)
                    dat.nombre= carros[buscado].carlicence
                    dat.encabezados = [
                        {text: "Vuelta", value: "vuelta"}
                        ]
                    
                    conjunt.push(dat)
                }
            });
            this.loading=false
            console.log(conjunt);
            return conjunt
        },
    }
}
</script>

<style>

</style>