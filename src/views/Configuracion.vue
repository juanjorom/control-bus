<template>
  <v-container>
    {{getDato}}
  </v-container>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  mounted(){
    this.setDato('dato1',"eh we")
  },
  computed: {
    ...mapGetters({
      getDato: 'datos/getDato'
    })
  },
  methods:{
    ...mapMutations({
      setDato: 'datos/setDato'
    })
  }
}
</script>

<style>

</style>