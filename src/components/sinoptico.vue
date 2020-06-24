<template>
    <v-container>
        <v-row justify="center">
            <span>{{datos.groupname}}</span>
        </v-row>
        <v-row>
            <div class="contenedor">
            <svg>
                <path d="M 200 50 L 800 50 Q 950 150 800 250 L 200 250 Q 50 150 200 50" class="ruta"></path>
                <g class="paradas">
                    <circle v-for="par in paradas" :key="par" :cx="calcularPositionX(par)" :cy="calcularPositionY(par)" r=5 @click="detail(par)" @mouseover="mostrar(par)" @mouseout="desMostrar(par)" ref="eti"></circle>
                </g>
                <g class="etiquetas" >
                    <text v-show="etiqueta" x=0 y=0 ref="vista">{{etiqueta}}</text>
                </g>
                <g v-for="ocupado in ocupados" :key="ocupado.deviceid">
                    <cam :xGeneral="calcularCamionesXGeneral(ocupado.fence)" :yGeneral="calcularCamionesYGeneral(ocupado.fence)"></cam>-->
                </g>
            </svg>
        </div>
        </v-row>
    </v-container>
</template>

<script>
import {mapGetters} from 'vuex'
import cam from './camion'

export default {
    name: "sinoptico",
    props: {
        datos: Object,
        paradas: Array
    },

    data(){
        return{
            puntos: [{}],
            etiqueta: null
        }
    },
    computed: {
        ...mapGetters({
            cars: 'carros/getCarsbyArbol',
            posiciones: 'sock/getGeocercasOcupadas'
        }),
        ocupados(){
            console.log(this.cars(this.datos.groupid))
            return this.posiciones(this.cars(this.datos.groupid))
        }
    },
    methods: {
        calcularCamionesYGeneral(parada){
            return this.puntos.find(pun => pun.nombre==parada).cory
        },
        calcularCamionesXGeneral(parada){
            return this.puntos.find(pun => pun.nombre==parada).corx
        },
        mostrar(parada){
            this.etiqueta=parada
            var ind = this.paradas.indexOf(parada)
            this.$refs.eti[ind].setAttribute('r',15)
            this.$refs.vista.setAttribute('x', this.$refs.eti[ind].getAttribute('cx')-20)
            this.$refs.vista.setAttribute('y', this.$refs.eti[ind].getAttribute('cy')-30)
        },
        desMostrar(parada){
            this.$refs.eti[this.paradas.indexOf(parada)].setAttribute('r',5)
            this.etiqueta=null
        },
        detail(parada){
            console.log(parada)
        },
        calcularPositionX(parada){
            var index = this.puntos.findIndex(el => el.nombre==parada) 
            if(index<0){
                this.puntos.push({id:this.paradas.indexOf(parada), nombre:parada})
                index = this.puntos.findIndex(el => el.nombre==parada)
            }
            var medio = this.paradas.indexOf(this.datos.groupname)
            var pos = this.paradas.indexOf(parada)
            var x
            if(pos==0){
                this.puntos[index].corx = 125
                return 125
            }
            else if(pos<medio){
                x= (600/(medio-2))*(pos-1)+200
                this.puntos[index].corx = x
                return x
            }
            else if(pos==medio){
                this.puntos[index].corx = 875
                return 875
            }
            else{
                x = 1400-(600/(this.paradas.length-medio-2)*(pos-3))
                this.puntos[index].corx = x
                return x
            }
        },
        calcularPositionY(parada){
            var index = this.puntos.findIndex(el => el.nombre==parada) 
            if(index<0){
                this.puntos.push({id:this.paradas.indexOf(parada), nombre:parada})
                index = this.puntos.findIndex(el => el.nombre==parada)
            }
            var medio=this.paradas.indexOf(this.datos.groupname)
            var pos = this.paradas.indexOf(parada)
            if(pos==0) {
                this.puntos[index].cory=150
                return 150
            }
            else if(pos<medio){
                this.puntos[index].cory=50
                return 50
            }
            else if(pos==medio){
                this.puntos[index].cory=150
                return 150
            }
            else{
                this.puntos[index].cory=250
                return 250
            }
        }
    },
    components: {
        cam
    }
}
</script>

<style>
    .contenedor{
        display: inline-block;
        overflow-x: auto;
        margin-left: 50px;
        margin-right: 40px;
    }

    svg {
        width: 1000px;
        height: 300px;
    }
    .ruta {
        fill: none;
        stroke:darkkhaki;
    }

    .tabla {
        width: 500px;
    }
</style>