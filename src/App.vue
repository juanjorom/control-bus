<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      absolute
    >
    <v-app-bar-nav-icon v-if="logeado" @click="mostrar=true"></v-app-bar-nav-icon>
      <v-toolbar-title>{{mensaje}}</v-toolbar-title>
      <template v-slot:extension v-if="logeado">
        <v-tabs align-with-title >
          <v-tab to="/real">Vista</v-tab>
          <!--<v-tab to="historial">Historial</v-tab>-->
          <v-tab to="/mapa">Mapa</v-tab>
          <v-tab to="/tiempos">Tiempos y Frecuencias</v-tab>
          <v-tab :to="{name:'detail'}" exact>Grafica</v-tab>
          <v-tab to="/configuracion">Configuracion</v-tab>
        </v-tabs>
      </template>
      <v-spacer></v-spacer>
      <v-img src="../public/img/startLogin.gif" aspect-ratio="2" max-width="100px" contain></v-img>
    </v-app-bar> 
    <v-navigation-drawer v-model="mostrar" absolute temporary>
      <v-list>
        <arbolitem :arbol="arbol" @select="showData"></arbolitem>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import arbolitem from '@/components/arbolItem'

import { mapGetters } from 'vuex';
export default {
  name: 'App',
  data: () => ({
    mostrar: false
  }),
  computed:{
    ...mapGetters('logdata',{
      mensaje:'getMensaje',
      logeado:'getSucess',
      arbol:'getArbol'
    })
  },
  components:{
    arbolitem
  }

};
</script>
