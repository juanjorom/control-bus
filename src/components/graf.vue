<template>
  <v-container fluid>
      <v-col cols="12">
          <span>{{datos.rutaName}}</span>
          <v-row>
              <v-col cols="6">
                  <v-select v-model="vueltaNo" :items="datosVueltas" label="Vuelta"></v-select>
              </v-col>
              <v-col cols="6">
                  <v-select v-model="direccionSel" :items="direccion" label="Sentido"></v-select>
              </v-col>
          </v-row>
          <vuec3 :handler="handler"></vuec3>
      </v-col>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import Vue from 'vue'
import Vuec3 from 'vue-c3'
import moment from 'moment'

export default {
    name: 'graf',
    props: {
        datos: Object
    },
    computed: {
        datosVueltas(){
            var res= this.datos.vueltas.map(v => v.vuelta);
            return res
        },
        recorridos(){
            var res = []
            if(this.vueltaNo >= 0 & this.direccionSel !=""){
                var vuel = this.vueltaNo
                var direccion = this.direccionSel
                this.datos.vueltas.forEach(function (e) {
                        if(e.vuelta==vuel && e.direccion==direccion){
                            res.push(Array.from(e.tiempos))
                        }
                    })
            }
            return res
        },
        options(){
            return {
                size: {
                    height: 500
                },
                data: {
                    labels: {
                        format: function(d){
                            if(d!=null){
                                var x= moment(d)
                                return x.format('HH:mm')
                            }
                            return null
                        }
                    },
                    columns: this.recorridos,
                    type: 'line'
                },
                axis: {
                    x: {
                        type: "category",
                        categories: this.datos.ruta,
                        tick: {
                            rotate: 90,
                            multiline: false
                        },
                        height: 130
                    },
                    y:{
                        tick: {
                            format: function(d) {
                                var x= moment(d)
                                return x.format('HH:mm')
                            }
                        }
                    }
                },
                line: {
                    connectNull: true
                }
            }
        }
    },
    data() {
        return {
            handler: new Vue(),
            direccion: ["Ida", "Regreso"],
            vueltaNo: Number,
            direccionSel: "",
            actual: []
        }
    },
    watch: {
        vueltaNo: function() {
            console.log(this.recorridos);
            this.handler.$emit('dispatch', (chart) => chart.load({columns:this.recorridos}))
        },
        direccionSel: function() {
            console.log(this.recorridos);
            this.handler.$emit('dispatch', (chart) => chart.load({columns:this.recorridos}))
        }
    },
    methods: {
        ...mapActions('sock',{
            addInfo: 'actualizar'
        })
    },
    mounted(){
        this.handler.$emit('init',this.options)
    },
    components: {
        Vuec3
    }
}
</script>

<style>
</style>