<template>
    <v-container>
        <v-col cols="12" align="center">
            <div v-for="arbol in cuadros" :key="arbol.groupid" >
                <sinoptico :datos="arbol" :paradas="paradas(arbol.groupname)"></sinoptico>
            </div>
        </v-col>
    </v-container>
</template>

<script>
import sinoptico from '@/components/sinoptico'
import {mapGetters, mapState} from 'vuex'
export default {
    computed: {
        ...mapGetters({
            cuadros: 'carros/getAllArboles',
            paradas: 'sock/getRuta',
        }),
        ...mapState({
            carros: state => state.carros.carsSelected
        })
    },
    components: {
        sinoptico
    }
}
</script>

<style>

</style>