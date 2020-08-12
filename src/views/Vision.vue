<template>
    <v-container>
        <v-col cols="12" align="center">
            <div v-for="arbol in cuadros" :key="arbol.groupid" >
                <invocador :datos="arbol" :ruta="paradas(arbol.groupname)"></invocador>
            </div>
        </v-col>
    </v-container>
</template>

<script>
import invocador from '@/components/invocador'
import {mapGetters} from 'vuex'
export default {
    computed: {
        ...mapGetters({
            cuadros: 'carros/getAllArboles',
            paradas: 'sock/getRuta',
        })
    },
    components: {
        invocador
    }
}
</script>

<style>

</style>