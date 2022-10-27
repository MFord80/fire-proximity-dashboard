// OSM tile layer
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Toner lite tile layer
var Stamen_TonerLite = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
});

// Topographic tile layer
var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Icon variables
var clientLowIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
  iconAnchor: [24,81]
});
var clientMedIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
  iconAnchor: [24,81]
});
var clientHighIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  iconAnchor: [24,81]
});
var schoolIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  iconAnchor: [12,40]
});
var hospitalIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png",
  iconAnchor: [12,40]
});
var agedCareIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  iconAnchor: [12,40]
});

// Client information function
function clientInfo(e) {
  var index = e.target.index
  d3.json("/clients").then(function(data) {
      d3.select("#name").text(`Name : ${data[index].first_name} ${data[index].last_name}`);
      d3.select("#address").text(`Address : ${data[index].full_address}`);
      d3.select("#adults").text(`Number of Adults : ${data[index].adults}`);
      d3.select("#children").text(`Number of Children : ${data[index].children}`);
      d3.select("#phone").text(`Phone : ${data[index].phone}`);
      d3.select("#risk").text(`Risk : ${data[index].risk}`);
  });
};

// Nested Overlay layers
// School layer
$.getJSON("/schools", (function(response) {
  features = response.features;
  const schoolMarkers =[]
  for (let i = 0; i < features.length; i++) {
    let location = features[i].geometry;
    if(location){
      schoolMarkers.push(L.marker([location.coordinates[1], location.coordinates[0]], {icon: schoolIcon}).bindPopup("<strong>" + features[i].properties.schoolname + "</strong>" + "<p>Students: " + features[i].properties.totalschoo + "</p>"));
    }
  }
  // Hospital layer
  $.getJSON("/hospitals", (function(response) {
    features = response.features;
    const hospitalMarkers =[]
    for (let i = 0; i < features.length; i++) {
      let location = features[i].geometry;
      if(location){
        hospitalMarkers.push(L.marker([location.coordinates[1], location.coordinates[0]], {icon: hospitalIcon}).bindPopup("<strong>" + features[i].properties.establishment_name + "</strong>"));
      }
    }
    // Aged Care Facility layer
    d3.csv("/agedcare").then(function(response) {
      features = response
      const agedCareMarkers =[]
      for (let i = 0; i < features.length; i++) {
        let location = features[i];
        if(location){
          agedCareMarkers.push(L.marker([location.Latitude, location.Longitude], {icon: agedCareIcon}).bindPopup("<strong>" + features[i]["Service Name"] + "</strong>" + "<p>Residents: " + features[i]["Residential Places"] + "</p>"));
        }
      }
      // Fire hotspots layer
      $.getJSON("/hotspots", (function(response) {
        features = response
        hotspotCircles = []
          for (let i = 0; i < Object.keys(features).length; i++) {
            if (features[String(i)].temperature < 330) {
              heat = "#ffcc00"
            } else if (features[String(i)].temperature < 360) {
              heat = "#e65c00"
            } else {
              heat = "#cc0000"
            };
            let location = features[String(i)].coordinates;
            if(location){
              hotspotCircles.push(L.circle([location[0], location[1]], {
                color: heat,
                opacity: 0,
                fillColor: heat,
                fillOpacity: 0.5,
                radius: 200 
            }))
          }
        }
        // Clients layer
        $.getJSON("/clients", (function(response) {
          features = response;
          const clientMarkers =[]
          for (let i = 0; i < features.length; i++) {
            let location = features[i];
            if (features[i].risk == "LOW") {
              riskLevel = clientLowIcon
              riskText = "Low"
            } else if (features[i].risk == "MED") {
              riskLevel = clientMedIcon
              riskText = "Medium"
            } else {
              riskLevel = clientHighIcon
              riskText = "High"
            };
            if(location){
              let clientMarker = L.marker([location.lat, location.long], {icon: riskLevel});
              // .bindPopup("<strong>" + features[i].first_name + " " + features[i].last_name + " - " + riskText + " risk</strong>" + "<p>Address: " + features[i].full_address + "</p>"+ "<span>Number of Adults: " + features[i].adults + "</span><br><span>Number of Children: " + features[i].children + "</span>");
              clientMarker.index = i;
              clientMarker.on("click", clientInfo);
              clientMarkers.push(clientMarker)
            }
          }
          // Layer group variables
          let hotspots = L.layerGroup(hotspotCircles)
          let schools = L.layerGroup(schoolMarkers)
          let hospitals = L.layerGroup(hospitalMarkers)
          let agedCare = L.layerGroup(agedCareMarkers)
          let clients = L.layerGroup(clientMarkers)


          // Layer variables
          var baseMap = {
            "Streetmap": osm,
            "Toner": Stamen_TonerLite,
            "Topographic": OpenTopoMap
          };
            
          var overlayMaps = {
            "Hotspots": hotspots,
            "Clients": clients,
            "Schools": schools,
            "Hospitals": hospitals,
            "Aged Care Facilities": agedCare
          };
          
          // Map variable
          var Map = L.map("map", {
            center: [-24.76, 121.14],
            zoom: 5.5,
            zoomSnap: 0.5,
            layers: [osm, hotspots]
          });

          // Functions for view selection radio buttons
          let stateSelect = d3.select("#btnradio1");
          let metroSelect = d3.select("#btnradio2");
          let incidentSelect = d3.select("#btnradio3");

          stateSelect.on("click", function() {
            Map.setView([-24.76, 121.14], 5.5);
          });
          metroSelect.on("click", function() {
            Map.setView([-32.12, 116.13], 10);
          });
          incidentSelect.on("click", function() {
            Map.setView([-32.01, 116.06], 15);  
          });
          
          // Layer control
          L.control.layers(baseMap, overlayMaps, {
            collapsed: false
          }).addTo(Map);
        }));
      }));
    }); 
  }));
}));





          // // Hardcoded On click clients
          // L.marker([-32.02275483, 116.0517287],{icon: clientIcon}).addTo(Map).on("click", clientInfo(222));
          // L.marker([-32.00856594, 116.0753284],{icon: clientIcon}).addTo(Map).on("click", clientInfo(279));
          // L.marker([-32.00512003, 116.0558382],{icon: clientIcon}).addTo(Map).on("click", clientInfo(491));



