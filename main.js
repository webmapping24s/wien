/* Vienna Sightseeing Beispiel */

// Stephansdom Objekt
let stephansdom = {
  lat: 48.208493,
  lng: 16.373118,
  title: "Stephansdom",
};

// Karte initialisieren
let map = L.map("map").setView([stephansdom.lat, stephansdom.lng], 12);

// BasemapAT Layer mit Leaflet provider plugin als startLayer Variable
let startLayer = L.tileLayer.provider("BasemapAT.grau");
startLayer.addTo(map);

let themaLayer = {
  sights: L.featureGroup().addTo(map),
  lines: L.featureGroup().addTo(map),
  stops: L.featureGroup().addTo(map),
  zones: L.featureGroup().addTo(map),
  hotels: L.featureGroup().addTo(map),
}

// Hintergrundlayer
L.control
  .layers({
    "BasemapAT Grau": startLayer,
    "BasemapAT Standard": L.tileLayer.provider("BasemapAT.basemap"),
    "BasemapAT High-DPI": L.tileLayer.provider("BasemapAT.highdpi"),
    "BasemapAT Gelände": L.tileLayer.provider("BasemapAT.terrain"),
    "BasemapAT Oberfläche": L.tileLayer.provider("BasemapAT.surface"),
    "BasemapAT Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "BasemapAT Beschriftung": L.tileLayer.provider("BasemapAT.overlay"),
    // Stadia.StamenWatercolor
    "Stadia StamenWatercolor": L.tileLayer.provider("Stadia.StamenWatercolor"),
  }, {
    "Sehenswürdigkeiten": themaLayer.sights,
    "Vienna Sightseeing Linien": themaLayer.lines,
    "Vienna Sightseeing Stops": themaLayer.stops,
    "Fußgängerzonen": themaLayer.zones,
    "Hotels & Unterkünfte": themaLayer.hotels,
  })
  .addTo(map);

// Maßstab
L.control
  .scale({
    imperial: false,
  })
  .addTo(map);

L.control
  .fullscreen()
  .addTo(map);

async function loadSights(url) {
  // console.log("Loading", url);
  let response = await fetch(url);
  let geojson = await response.json();
  // console.log(geojson);
  L.geoJSON(geojson, {
    onEachFeature: function (feature, layer) {
      //console.log(feature);
      layer.bindPopup(`
        <img src="${feature.properties.THUMBNAIL}" alt="*">
        <h4><a href="${feature.properties.WEITERE_INF}" target="wien">${feature.properties.NAME}</a></h4>
        <address>${feature.properties.ADRESSE}</address>
      `);
    }
  }).addTo(themaLayer.sights);
}
loadSights("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json");

async function loadLines(url) {
  // console.log("Loading", url);
  let response = await fetch(url);
  let geojson = await response.json();
  // console.log(geojson);
  L.geoJSON(geojson, {
    onEachFeature: function (feature, layer) {
      //console.log(feature);
      layer.bindPopup(`
        <h4><i class="fa-solid fa-bus"></i> ${feature.properties.LINE_NAME}</h4>
        <p>
        <i class="fa-regular fa-circle-stop"></i> ${feature.properties.FROM_NAME}<br>
        <i class="fa-solid fa-down-long"></i>
        <br>
        <i class="fa-regular fa-circle-stop"></i> ${feature.properties.TO_NAME}
        <br>
        </p>
      `);
    }
  }).addTo(themaLayer.lines);
}
loadLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json");

async function loadStops(url) {
  // console.log("Loading", url);
  let response = await fetch(url);
  let geojson = await response.json();
  // console.log(geojson);
  L.geoJSON(geojson, {
    onEachFeature: function (feature, layer) {
      //console.log(feature);
      layer.bindPopup(`
        <h4><i class="fa-solid fa-bus"></i> ${feature.properties.LINE_NAME}</h4>
        <p> ${feature.properties.STAT_ID} ${feature.properties.STAT_NAME}</p>
      `);
    }
  }).addTo(themaLayer.stops);
}
loadStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json");

async function loadZones(url) {
  // console.log("Loading", url);
  let response = await fetch(url);
  let geojson = await response.json();
  // console.log(geojson);
  L.geoJSON(geojson, {
    onEachFeature: function (feature, layer) {
      //console.log(feature);
      layer.bindPopup(`
        <h4>Fußgängerzone ${feature.properties.ADRESSE}</h4>
        <p><i class="fa-regular fa-clock"></i>
          ${feature.properties.ZEITRAUM}
        </p>
        <p><i class="fa-solid fa-circle-info"></i>
          ${feature.properties.AUSN_TEXT}
        </p>
      `);
    }
  }).addTo(themaLayer.zones);
}
loadZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json");

async function loadHotels(url) {
  // console.log("Loading", url);
  let response = await fetch(url);
  let geojson = await response.json();
  // console.log(geojson);
  L.geoJSON(geojson, {
    onEachFeature: function (feature, layer) {
      //console.log(feature);
      layer.bindPopup(`
      `);
    }
  }).addTo(themaLayer.hotels);
}
loadHotels("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:UNTERKUNFTOGD&srsName=EPSG:4326&outputFormat=json");
