<template>
  <v-list-group>
      <template v-slot:activator>
          <v-list-item-title>
            {{arbol.name}}
          </v-list-item-title>
      </template>
      <v-list>
          <arbolitem v-bind:key="key.id" v-for="key in arbol.hijos" :arbol="key" @select="getCarros"></arbolitem>
          <v-list-item v-bind:key="car.deviceid" v-for="car in arbol.carros">
              <v-checkbox v-model="carros" :value="car" :label="car.carlicence">
              </v-checkbox>
          </v-list-item>
      </v-list>
  </v-list-group>
</template>

<script>

export default {    
    name: 'arbolitem',
    props: {
        clase: String,
        arbol: Object,
        clear: Boolean,

    },
    computed:{
        carros:{
            get(){
                return this.$store.state.carros.carsSelected
            },
            set(value){
                this.$store.commit('carros/updateCarsSelected', value)
            }
        }
    },
    data: () => ({
        clicked: false,
        selected: false,
    }),

    components: {
        arbolitem: 'arbolitem'
    },
    methods: {
        getCarros(carros){
            this.childCars=carros
        },
    }
}
</script>

<style>

</style>