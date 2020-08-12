<template>
  <v-container>
    <v-simple-table>
        <caption><h2>VUELTA: {{vuelta}}  DIRECCION: {{direccion}} </h2></caption>
        <thead>
            <tr>
                <th>PARADAS</th>
                <th class="text-left" v-for="item in cabeza" :key="item">{{item}}</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th>Llegada</th>
                <td v-for="time in tiempos" :key="time">{{time}}</td>
            </tr>
            <tr>
                <th>Estimado A Inicio</th>
                <td v-for="est in estimacionIn" :key="est" style=" text-align:center; " >{{est}}</td>
            </tr>
            <tr>
                <th>Tiempo a Inicio</th>
                <td v-for="ti in datosIn" :key="ti" style=" text-align:center; ">{{ti}}</td>
            </tr>
            <tr>
                <th>Diferencia de Inicio</th>
                <td v-for="ti in diferenciaIn" :key="ti" :style=" ti.color ">{{ti.dato}}</td>
            </tr>
            <tr>
                <th>Estimado A Parada</th>
                <td v-for="est in estimacionPar" :key="est" style=" text-align:center; ">{{est}}</td>
            </tr>
            <tr>
                <th>Tiempo a Parada</th>
                <td v-for="ti in datosPar" :key="ti" style=" text-align:center; ">{{ti}}</td>
            </tr>
            <tr>
                <th>Diferencia entre paradas</th>
                <td v-for="ti in diferenciaPar" :key="ti" :style=" ti.color ">{{ti.dato}}</td>
            </tr>
        </tbody>
    </v-simple-table>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
    props: {
        paradas: Array,
        direccion: String,
        vuelta: String,
        ruta: String
    },
    async mounted(){
        var result = this.conjunto('LA MISION')
        this.completo = result.paradas
        var enca = await result.paradas.map(ele => ele.name)

        if(this.direccion=="Regreso"){
               await enca.reverse()
            }

        this.cabeza = await enca
        this.calcularDiferencias()
    },
    computed: {
        ...mapGetters({
            conjunto: 'sock/getDatos'
        })
    },
    data: () =>{
        return {
            datosIn: [],
            datosPar: [],
            estimacionIn: [],
            estimacionPar: [],
            cabeza: [],
            tiempos: [],
            completo: [],
            diferenciaIn: [],
            diferenciaPar: []
        }
    },
    methods: {
        calcularDiferencias(){
            this.cabeza.forEach((element, index) =>{
                var actual = this.paradas.paradas.find(ele => ele.parada==element)
                var esti = this.completo.find(ele => ele.name==element)
                if(index==0){
                    this.datosIn.push(null)
                    this.datosPar.push(null)
                    this.diferenciaIn.push({dato:null, color:"background-color: #bfbdbd;"})
                    this.diferenciaPar.push({dato:null, color:"background-color: #bfbdbd;"})
                    this.estimacionIn.push(esti[this.direccion].estimacionIn)
                    this.estimacionPar.push(esti[this.direccion].estimacionPar)
                    if(actual!=undefined){
                        this.tiempos.push(actual.time)
                    }else{
                        this.tiempos.push("S/D")
                    }
                }
                else
                {
                    if(actual!=undefined){
                        this.tiempos.push(actual.time)
                        var inicial = this.paradas.paradas.find(ele => ele.parada==this.cabeza[0])
                        var anterior = this.paradas.paradas.find(ele => ele.parada==this.cabeza[index-1])
                        var comparIn= "S/D"
                        var comparPar= "S/D"
                        var diffIn= {dato:"S/D", color:"background-color: #bfbdbd; text-aling: center;"}
                        var diffPar= {dato:"S/D", color:"background-color: #bfbdbd; text-aling: center;"}
                        if(inicial!=undefined){
                            comparIn = moment(actual.fecha).diff(moment(inicial.fecha), 'minutes')
                             diffIn.dato = esti[this.direccion].estimacionIn - comparIn
                            if(diffIn.dato<0){
                                diffIn.color = "background-color: #ffa51f; text-aling: 'center';"
                            }
                            else if(diffIn.dato==0){
                                diffIn.color = "background-color: #6dad4c; text-aling: 'center';"
                            }
                            else{
                                diffIn.color = "background-color: #4c8bb5; text-aling: 'center';"
                            }
                           
                            
                        }
                        if(anterior!=undefined){
                            comparPar = moment(actual.fecha).diff(moment(anterior.fecha),'minutes')
                            diffPar.dato = esti[this.direccion].estimacionPar - comparPar
                            if(diffPar.dato<0){
                                diffPar.color = "background-color: #ffa51f; text-aling: 'center';"
                            }
                            else if(diffPar.dato==0){
                                diffPar.color = "background-color: #6dad4c; text-aling: 'center';"
                            }
                            else{
                                diffPar.color = "background-color: #4c8bb5; text-aling: 'center';"
                            }
                        }
                        this.datosIn.push(comparIn)
                        this.datosPar.push(comparPar)
                        this.diferenciaIn.push(diffIn)
                        this.diferenciaPar.push(diffPar)
                        this.estimacionIn.push(esti[this.direccion].estimacionIn)
                        this.estimacionPar.push(esti[this.direccion].estimacionPar)
                    }
                    else
                    {
                        this.tiempos.push("S/D")
                        this.datosIn.push("S/D")
                        this.datosPar.push("SD")
                        this.diferenciaIn.push({dato:"S/D", color:"background-color: #bfbdbd; text-aling: 'center';"})
                        this.diferenciaPar.push({dato:"S/D", color:"background-color: #bfbdbd; text-aling: 'center';"})
                        this.estimacionIn.push(esti[this.direccion].estimacionIn)
                        this.estimacionPar.push(esti[this.direccion].estimacionPar)
                    }
                }

            });
        }
    }
}
</script>

<style>

</style>