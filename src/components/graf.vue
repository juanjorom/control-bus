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
                    labels: true,
                    columns: this.datos.times,
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