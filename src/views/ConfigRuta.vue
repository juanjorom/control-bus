<template>
  <v-container>
    <v-row>
      <v-col cols="2">
        <v-list>
          <v-subheader>Rutas</v-subheader>
          <v-list-item-group v-model="itemSelected">
            <v-list-item v-for="i in rutas" :key="i" :value="i.groupname">
              <v-list-item-content>
                {{i.groupname}}
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
      <v-col cols="10">
        <v-card v-if="itemSelected">
          <v-card-title>{{itemSelected}}</v-card-title>
          <v-card-text>
            <v-col cols="12" align-self="center">
              <v-select v-model="tipoRuta" label="Tipo" :items="tipos"></v-select>
              <v-row>
                <v-col>
                  <v-card>
                    <v-card-text>
                      <v-list>
                        <v-subheader>Paradas de la Ruta {{itemSelected}}</v-subheader>
                        <draggable v-model="paradasRutas">
                          <v-list-item v-for="i in paradasRutas" :key="i.id" @click="quitarParada(i)" >{{i.name}}</v-list-item>
                        </draggable>
                      </v-list>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col>
                  <v-card>
                    <v-card-text>
                      <v-list>
                        <v-subheader>Todas las paradas</v-subheader>
                        <v-list-item v-for="f in paradas" :value="f" :key="f.id"  selectable @click="quitarParada(f)">{{f.name}}</v-list-item>
                      </v-list>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-card-text>
          <v-card-actions>
            <v-col>
              <v-btn @click="guardar()">Guardar</v-btn>
              <v-btn @click="limpiar()">Limpiar</v-btn>
              <v-btn @click="itemSelected=''">Cancelar</v-btn>
            </v-col>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import draggable from 'vuedraggable'
export default {
  components: {
    draggable
  },
  data: () => ({
    itemSelected: "",
    tipoRuta: "",
    tipos: ["LINEAL", "LINEAL-VARIANTE","CIRCUITO", "SEMI-CIRCUITO"],

  }),
  computed: {
    ...mapGetters({
      rutas: 'carros/getAllArboles',
      paradas: 'sock/getAllParadas',

    }),
    paradasRutas:{
      get(){
        return this.$store.state.sock.rutaParada
      },
      set(value){
        console.log(value);
        this.$store.commit('sock/updateRutaParadaFromSet', value)
      }
    }
  },
  methods: {
    limpiar(){
      this.paradasRutas = []
      this.tipoRuta= ""
    },
    guardar(){
    },
    quitarParada(valor){
      this.$store.commit('sock/updateRutaParada', valor)
    },
    agregarParada(){

    }
  }
} 
</script>

<style>

</style>