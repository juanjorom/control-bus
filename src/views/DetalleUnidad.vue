<template>
  <v-container>
    <graf v-for="elemento in organizar" :key="elemento" :datos="elemento" ></graf>  
  </v-container>
</template>

<script>
import graf from '@/components/graf2' 
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      info: "sock/getInfo"
    }),
    organizar(){
      var ar= []
      this.info.forEach(element => {
          var valor = {
            nombre: element.nombre,
            ruta: element.ruta,
            vueltas: []
          }
          for(var i=0; i < element.times.length; i++ ){
            var st = "Vuelta "+ element.times[i].vuelta +" "+element.times[i].direccion
            var nuevo = [st]
            valor.vueltas.push(nuevo.concat(element.times[i].tiempos))
          }
          ar.push(valor)
      });
      return ar
    }
  },
  components:{
    graf
  }
}
</script>

<style>

</style>