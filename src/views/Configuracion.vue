<template>
  <v-container>
    <v-tabs v-model="tab" grow>
      <v-tab href="#ruta">Ruta</v-tab>
      <v-tab href="#parada">Paradas</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item value="ruta">
        <ruta></ruta>
      </v-tab-item>
      <v-tab-item value="parada">
        <parada></parada>
      </v-tab-item>
    </v-tabs-items>
    <router-view></router-view>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import ruta from './ConfigRuta'
import parada from './ConfigParada'
export default {
  mounted(){
    this.setDato('dato1',"eh we")
  },
  data: () => ({
    tab: "ruta"
  }),
  computed: {
    ...mapGetters({
      getDato: 'datos/getDato'
    })
  },
  methods:{
    ...mapMutations({
      setDato: 'datos/setDato'
    })
  },
  components: {
    ruta,
    parada
  }
}
</script>

<style>

</style>