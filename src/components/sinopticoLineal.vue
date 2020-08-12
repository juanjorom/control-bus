<template>
    <v-container>
        <v-row>
            <v-col cols="8">
                <v-card>
                    <v-card-title>
                        <span>{{datos.groupname}}</span>
                    </v-card-title>
                    <v-card-text class="contenedor">
                        <div>
                            <svg class="dibujo">
                                <path d="M 200 50 L 800 50 Q 950 150 800 250 L 200 250 Q 50 150 200 50" class="ruta"></path>
                                <g class="paradas">
                                    <circle v-for="par in puntos" :key="par.id" :cx="par.corx" :cy="par.cory" r=5 @click="detail(par)" @mouseover="mostrar(par)" @mouseout="desMostrar(par)" ref="eti"></circle>
                                </g>
                                <g class="etiquetas" >
                                    <text v-show="etiqueta" x=0 y=0 ref="vista">{{etiqueta}}</text>
                                </g>
                                <g v-for="ocupado in ocupados" :key="ocupado.deviceid">
                                    <text :x="calcularCamionesXGeneral(ocupado)-10" :y="calcularCamionesYGeneral(ocupado)-20" >{{ocupado.devicename}}</text>
                                    <cam :xGeneral="calcularCamionesXGeneral(ocupado)" :yGeneral="calcularCamionesYGeneral(ocupado)"></cam>-->
                                </g>
                            </svg>
                        </div>
                    </v-card-text>
                    <v-card-actions>
                    </v-card-actions>
                </v-card>
            </v-col>
            <v-col cols="4">
                <v-card>
                    <v-card-title>
                        <span>INFORMACION DE {{datos.groupname}}</span>
                    </v-card-title>
                    <v-card-text>
                        <v-data-table  :headers="heads" :items="ocupados" :item-key="devicename"></v-data-table>
                    </v-card-text>
                </v-card>
            </v-col>
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
        paradas: Array,
    },
    async created(){
        var vol = await Array.from(this.paradas)
        var cop = await Array.from(this.paradas)
        vol.pop()
        vol.shift()
        
        this.extendido =  cop.concat(vol)
        
        this.extendido.forEach(par => {
            this.calcularPositiones(par)
        })
    },
    data(){
        return{
            puntos: [],
            etiqueta: null,
            verCamion: false,
            heads:[
                {text: 'Unidad', value: 'devicename'},
                {text: 'Geocerca', value: 'fence'},
                {text: 'Fecha y Hora', value: 'hora'},
                {text: 'Direccion', value: 'direccion'}
            ],
            extendido: []
        }
    },
    computed: {
        ...mapGetters({
            cars: 'carros/getCarsbyArbol',
            posiciones: 'sock/getGeocercasOcupadas',
            seleccionados: 'carros/getCarsSelected'
        }),
        ocupados(){
            return this.posiciones(this.cars(this.datos.groupid))
        },
    },
    methods: {
        calcularCamionesYGeneral(parada){
            var valor = this.puntos.find(pun => pun.nombre==parada.fence && pun.orientacion==parada.direccion)
            if(valor != undefined){
                return valor.cory
            }
            return 0
        },
        calcularCamionesXGeneral(parada){
            var valor = this.puntos.find(pun => pun.nombre==parada.fence && pun.orientacion==parada.direccion)
            if(valor != undefined){
                return valor.corx
            }
            return 0
        },
        mostrar(parada){
            this.etiqueta=parada.nombre
            var ind = this.puntos.findIndex(pun => pun.id==parada.id)
            this.$refs.eti[ind].setAttribute('r',15)
            this.$refs.vista.setAttribute('x', this.$refs.eti[ind].getAttribute('cx')-20)
            this.$refs.vista.setAttribute('y', this.$refs.eti[ind].getAttribute('cy')-30)
        },
        desMostrar(parada){
            this.$refs.eti[this.puntos.findIndex(pun => pun.id==parada.id)].setAttribute('r',5)
            this.etiqueta=null
        },
        detail(parada){
            console.log(parada)
        },
        calcularPositiones(parada){
            var index = this.puntos.findIndex(el => el.nombre==parada)
            if(index<0){
                this.puntos.push({id:this.paradas.indexOf(parada), nombre:parada})
                index = this.puntos.findIndex(el => el.nombre==parada)
            }
            var pos = this.paradas.indexOf(parada)
            var medio = this.paradas.indexOf(this.datos.groupname)
            var x
            if(pos==0){
                this.puntos[index].id = this.puntos[index].id + "-B"
                this.puntos[index].orientacion = "BASE"
                this.puntos[index].corx = 125
                this.puntos[index].cory=150
            }
            else if(pos==medio){
                this.puntos[index].id = this.puntos[index].id + "-B"
                this.puntos[index].orientacion = "BASE"
                this.puntos[index].corx = 875
                 this.puntos[index].cory=150
            }
            else if(this.puntos[index].corx == undefined){
                this.puntos[index].id = this.puntos[index].id + "-I"
                this.puntos[index].orientacion = "IDA"
                x= (600/(medio-2))*(pos-1)+200
                this.puntos[index].corx = x
                this.puntos[index].cory = 50
            }
            else if(this.puntos.filter(el => el.nombre==parada).length <= 2) {
                x= (600/(medio-2))*(pos-1)+200
                var nuevo = this.puntos.push({id:this.paradas.indexOf(parada)+"-R", nombre:parada, orientacion: "REGRESO"})
                this.puntos[nuevo-1].corx = x
                this.puntos[nuevo-1].cory = 250
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
        overflow-x: auto;
    }

    .dibujo {
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