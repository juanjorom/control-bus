<template>
    <v-container v-if="ruta!=undefined">
        <div v-if="ruta.tipo == 'LINEAL'">
            <sinoptico-lineal :datos="datos" :paradas="ruta.paradas"></sinoptico-lineal>
        </div>
        <div v-else-if="ruta.tipo == 'LINEAL-VARIANTE'">
            <sinoptico-lineal-variante :datos="datos" :paradas="ruta.paradas"></sinoptico-lineal-variante>
        </div>
        <div v-else-if="ruta.tipo == 'CIRCUITO'">
            <sinoptico-circuito :datos="datos" :paradas="ruta.paradas"></sinoptico-circuito>
        </div>
        <div v-else-if="ruta.tipo == 'SEMI-CIRCUITO'">
            <sinoptico-semi-circuito :datos="datos" :paradas="ruta.paradas"></sinoptico-semi-circuito>
        </div>
    </v-container>
</template>

<script>
import sinopticoLineal from '@/components/sinopticoLineal'
import sinopticoCircuito from '@/components/sinopticoCircuito'
import sinopticoLinealVariante from '@/components/sinopticoLinealVariante'
import sinopticoSemiCircuito from '@/components/sinopticoSemiCircuito'

export default {
    props: {
        datos: Object,
        ruta: Object
    },
    components: {
        sinopticoLineal,
        sinopticoCircuito,
        sinopticoLinealVariante,
        sinopticoSemiCircuito
    }

}
</script>

<style>

</style>