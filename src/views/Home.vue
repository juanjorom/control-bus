<template>
    <div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    created(){
        console.log(this.mensaje);
        console.log(this.logeado);
        console.log(this.arbol);
        
        
    },
    computed:{
        ...mapGetters('logdata',{
            mensaje:'getMensaje',
            logeado:'getSucess',
            arbol: 'getArbol'
        })
    }
}
</script>

<style>

</style>