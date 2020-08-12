<template>
  <v-container>
    <v-row>
      <v-col cols="2">
        <v-card>
          <v-card-text>
            <v-list>
              <v-subheader>Paradas</v-subheader>
              <v-list-item-group v-model="paradaActual">
                <v-list-item  v-for="par in paradas" :key="par.id" :value="par">{{par.name}}</v-list-item>
              </v-list-item-group>
            </v-list>
            <v-btn
              absolute
              dark
              fab
              bottom
              right
              color="pink"
              @click="addParada"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-card-text>  
        </v-card>
      </v-col>
      <v-col cols="10">
        <v-card v-if="paradaActual" class="listado">
          <v-card-text>
            <v-row>
              <v-col cols="3">
                <div class="container">
                  <v-text-field label="Nombre" v-model="paradaActual.name"></v-text-field>
                  <v-header>Coordenadas</v-header>
                  <div class="retener">
                    <v-col cols="12" v-for="poi in paradaActual.points" :key="poi">
                      <v-card >
                        <v-text-field label="Latitud" disabled v-model="poi.lat"></v-text-field>
                        <v-text-field label="Longitud" disabled v-model="poi.lon"></v-text-field>
                        <v-btn @click="delPoint({id: paradaActual.id, punto: poi})">Borrar</v-btn>
                      </v-card>
                    </v-col>
                  </div>
                </div>
                </v-col>
                  <v-col cols="9">
                  <l-map ref="mapa" :zoom="zoom" :center="center" @update:zoom="zoomUpdated" @update:center="centerUpdated" @ready="listo()" style="height: 600px;">
                      <l-tile-layer :url="url"  ></l-tile-layer>
                      <l-polygon :lat-lngs="perimetro" color="blue" ></l-polygon>
                      <div v-for="item in paradaActual.points" :key="item">
                          <l-marker ref="marker" :lat-lng="[item.lat,item.lon]" :icon="icon" draggable="true" @ready="preparado(item)">
                          </l-marker>
                      </div>
                  </l-map>
                </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn>Guardar</v-btn>
            <v-btn @click="delParada(paradaActual)">Eliminar</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPolygon } from 'vue2-leaflet'
import L from 'leaflet';
import { mapGetters, mapMutations } from 'vuex'

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

export default {
  data: () => ({
      paradaActual: null,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      zoom: 12,
      center: [20.7163, -105.231857],
      icon: L.icon({
          iconUrl: './img/punto-marker.png',
          iconSize: [15, 15],
          iconAnchor: [7.5, 7.5]
          })
  }),
  computed:{
    perimetro(){
      var sal =[]
      this.paradaActual.points.forEach(element => {
        sal.push([element.lat,element.lon])
      });
      return sal
    },
    ...mapGetters({
      paradas: 'sock/getAllParadas'
    })
  },
  methods: {
    ...mapMutations({
      addPoint: 'sock/agregarPunto',
      delPoint: 'sock/deletePoint',
      addParada: 'sock/agregarParada',
      delParada: 'scok/eliminarParada'
    }),
    zoomUpdated (zoom) {
        this.zoom = zoom;
    },
    centerUpdated (center) {
        this.center = center;
    },
    boundsUpdated (bounds) {
        this.bounds = bounds;
    },
    listo(){
      this.$refs.mapa.mapObject.on('click', this.addMarker)
    },
    addMarker(e){
      this.addPoint({id: this.paradaActual.id, punto: {lat: e.latlng.lat.toString(), lon: e.latlng.lng.toString()}})
    },
    preparado(punto){
      this.$refs.marker[this.paradaActual.points.indexOf(punto)].mapObject.on('drag', (e) => {
        punto.lat=e.latlng.lat.toString()
        punto.lon=e.latlng.lng.toString()
      })
    }
  },
  beforeDestroy(){
    console.log("Me wa morir we");
  },
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPolygon
  }
}
</script>

<style>
.listado {
  overflow-y: auto;
  height: 750px;
}
.retener {
  overflow-y: auto;
  height: 500px;
}
</style>