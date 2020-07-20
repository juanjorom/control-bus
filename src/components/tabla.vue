<template>
  <v-container>
    <v-simple-table>
        <caption>{{direccion}}</caption>
        <thead>
            <tr>
                <th>VUELTA</th>
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
                <td v-for="ti in diferenciaIn" :key="ti" style=" text-align:center; ">{{ti}}</td>
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
                <td v-for="ti in diferenciaPar" :key="ti" style=" text-align:center; ">{{ti}}</td>
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
        direccion: String
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
                    this.diferenciaIn.push(null)
                    this.diferenciaPar.push(null)
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
                        var diffIn= "S/D"
                        var diffPar= "S/D"
                        if(inicial!=undefined){
                            comparIn = moment(actual.fecha).diff(moment(inicial.fecha), 'minutes')
                            diffIn = esti[this.direccion].estimacionIn - comparIn
                            
                        }
                        if(anterior!=undefined){
                            comparPar = moment(actual.fecha).diff(moment(anterior.fecha),'minutes')
                            diffPar = esti[this.direccion].estimacionPar - comparPar
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
                        this.diferenciaIn.push("S/D","S/D")
                        this.diferenciaPar.push("S/D")
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