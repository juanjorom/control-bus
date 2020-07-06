<template>
    <div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
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