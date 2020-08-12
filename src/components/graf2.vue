<template>
  <v-container fluid>
      <v-col cols="12">
          <span>{{datos.nombre}}</span>
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
                    columns: this.datos.vueltas,
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
            handler: new Vue()
        }
    },
    updated(){
        console.log(this.datos.vueltas);
    },
    methods: {
        ...mapActions('sock',{
            addInfo: 'actualizar'
        }),
    },
    mounted(){
        this.handler.$emit('init',this.options)
        console.log(this.datos.vueltas);
    },
    components: {
        Vuec3
    }
}
</script>

<style>
</style>