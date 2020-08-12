<template>
  <v-container>
    <graf v-for="ele in organizar" :key="ele" :datos="ele"></graf>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import graf from '@/components/graf'
export default {
  computed:{
    ...mapGetters({
      info: "sock/getInfo"
    }),
    organizar(){
      var ar= []
      this.info.forEach(element => {
        var ind = ar.findIndex(el => el.rutaName==element.rutaName)
        if(ind<0){
          var valor = {
            rutaName: element.rutaName,
            ruta: element.ruta,
            vueltas: []
          }
          ar.push(valor)
          ind = ar.findIndex(el => el.rutaName==element.rutaName)
        }
        for(var i=0; i < element.times.length; i++ ){
          var st = "Unidad "+ element.nombre
          var nuevo = Array.from(element.times[i].tiempos)
          nuevo.unshift(st)
          ar[ind].vueltas.push({direccion:element.times[i].direccion, vuelta:element.times[i].vuelta, tiempos:nuevo})
        }
      });
      console.log(ar);
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