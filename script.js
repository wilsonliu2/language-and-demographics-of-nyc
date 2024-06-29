//=========================================================== MAP SETUP =================================================================

// MAP BOUNDS - set bounds so the map has limits for visibility
var southWest = L.latLng(40.477399, -74.25909), // Southwest bound (farther south and west)
  northEast = L.latLng(40.917577, -73.700272), // Northeast bound (farther north and east)
  bounds = L.latLngBounds(southWest, northEast);

// MAP OBJECT
var mymap = L.map("mapid", {
  maxBounds: bounds, // Map automatically bounces back to center
  maxZoom: 18,
  minZoom: 11,
}).setView([40.65, -73.97], 11);

// BASEMAP
var baseLayer = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/light-v9",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1Ijoic2hlZW5hcCIsImEiOiJja25hdXE3aGcxbGI4MnVxbnFoenhwdGRrIn0.DhFwD-KlRigYLaVwL8ipGA",
  }
).addTo(mymap);

//=========================================================== VARIABLES =================================================================

var selectedLayer = "language";
var languageControl;

//=========================================================== LANGUAGE =================================================================

// Create a FeatureGroup for language layers
var languageGroup = new L.featureGroup().addTo(mymap);

// Predominant language legend
var languageLegend = L.control({
  position: "bottomleft",
});

languageLegend.onAdd = function () {
  var div = L.DomUtil.create("div", "legend");

  // Color boxes and labels for each language
  div.innerHTML += "<h4>Predominant Languages</h4>";
  div.innerHTML +=
    '<i style="background: #fa9993ff"></i><span>Arabic</span><br>';
  div.innerHTML +=
    '<i style="background: #963f92ff"></i><span>Chinese</span><br>';
  div.innerHTML +=
    '<i style="background: #6b5b95"></i><span>French, Haitian Creole, or Cajun</span><br>';
  div.innerHTML +=
    '<i style="background: #91c1fdff"></i><span>German or other West Germanic languages</span><br>';
  div.innerHTML += '<i style="background: #e7298a"></i><span>Korean</span><br>';
  div.innerHTML +=
    '<i style="background: #606060"></i><span>Other and unspecified languages</span><br>';
  div.innerHTML +=
    '<i style="background: #30bfc7ff"></i><span>Other Asian and Pacific Island languages</span><br>';
  div.innerHTML +=
    '<i style="background: #3288bd"></i><span>Other Indo-European languages</span><br>';
  div.innerHTML +=
    '<i style="background: #51eba6ff"></i><span>Russian, Polish, or other Slavic languages</span><br>';
  div.innerHTML +=
    '<i style="background: #41ab5d"></i><span>Spanish</span><br>';
  div.innerHTML +=
    '<i style="background: #eb554dff"></i><span>Tagalog (incl. Filipino)</span><br>';
  div.innerHTML +=
    '<i style="background: #ccb8cbff"></i><span>Vietnamese</span><br>';
  return div;
};

languageLegend.addTo(mymap);

// Function to get color based on predominant language
function getColorBasedOnLanguageLegend(language) {
  return language == "Arabic"
    ? "#fa9993ff"
    : language == "Chinese"
    ? "#963f92ff"
    : language == "French, Haitian Creole, or Cajun"
    ? "#6b5b95"
    : language == "German or other West Germanic languages"
    ? "#91c1fdff"
    : language == "Korean"
    ? "#e7298a"
    : language == "Other and unspecified languages"
    ? "#606060"
    : language == "Other Asian and Pacific Island languages"
    ? "#30bfc7ff"
    : language == "Other Indo-European languages"
    ? "#3288bd"
    : language == "Russian, Polish, or other Slavic languages"
    ? "#51eba6ff"
    : language == "Spanish"
    ? "#41ab5d"
    : language == "Tagalog (incl. Filipino)"
    ? "#eb554dff"
    : language == "Vietnamese"
    ? "#ccb8cbff"
    : "#606060";
}

// Function to get color based on the number of speakers of a selected language
function colorScaleNumbersForLanguage(value) {
  return value > 1000
    ? "#00441b"
    : value > 800
    ? "#006d2c"
    : value > 600
    ? "#238b45"
    : value > 400
    ? "#41ae76"
    : value > 200
    ? "#66c2a4"
    : value > 0
    ? "#99d8c9"
    : "#606060";
}

// Function to format neighborhood names
function formatNeighborhoodName(name) {
  const firstSpaceIndex = name.indexOf(" ");
  const lastParenIndex = name.lastIndexOf("(");

  return name.substring(firstSpaceIndex + 1, lastParenIndex).trim();
}

// Function to update map based on selected language from the dropdown
function updateMap() {
  // Get selected language from the dropdown
  var selectedLanguage = document.getElementById("languageSelect").value;

  // Clear existing layer
  languageGroup.clearLayers();

  // Add new layer based on the selected language
  var selectedLanguageGeojson = L.geoJson(languageGeoJsonData, {
    style: function (feature) {
      var style;
      if (selectedLanguage == "") {
        // Default style for predominant language (if no language is selected)
        style = {
          fillColor: getColorBasedOnLanguageLegend(
            feature.properties.Predominant
          ),
          weight: 0.5,
          opacity: 1,
          color: "white",
          fillOpacity: 0.8,
        };
      } else {
        var numberOfSpeakers = 0;
        switch (selectedLanguage) {
          case "Arabic":
            numberOfSpeakers = feature.properties.Arabic;
            break;
          case "Chinese":
            numberOfSpeakers = feature.properties.Chinese;
            break;
          case "French, Haitian Creole, or Cajun":
            numberOfSpeakers = feature.properties.French;
            break;
          case "German or other West Germanic languages":
            numberOfSpeakers = feature.properties.German;
            break;
          case "Korean":
            numberOfSpeakers = feature.properties.Korean;
            break;
          case "Other and unspecified languages":
            numberOfSpeakers = feature.properties.Other;
            break;
          case "Other Asian and Pacific Island languages":
            numberOfSpeakers = feature.properties.Other_Asia;
            break;
          case "Other Indo-European languages":
            numberOfSpeakers = feature.properties.Other_Indo;
            break;
          case "Russian, Polish, or other Slavic languages":
            numberOfSpeakers = feature.properties.Russian;
            break;
          case "Spanish":
            numberOfSpeakers = feature.properties.Spanish;
            break;
          case "Tagalog (incl. Filipino)":
            numberOfSpeakers = feature.properties.Tagalog;
            break;
          case "Vietnamese":
            numberOfSpeakers = feature.properties.Vietnamese;
            break;
        }
        style = {
          fillColor: colorScaleNumbersForLanguage(numberOfSpeakers),
          weight: 0.5,
          opacity: 1,
          color: "white",
          fillOpacity: 0.8,
        };
      }
      return style;
    },

    // Adding a popup for each features
    onEachFeature: function (feature, layer) {
      var p = feature.properties;
      var cdtanameClean = formatNeighborhoodName(p.cdtaname);

      var popupContent;
      if (selectedLanguage == "") {
        // Default popup content for predominant language
        popupContent =
          "<h3>" + p.Geographic + "</h3>" + "<h5>(" + cdtanameClean + ")</h5>";

        if (p.Estimate == "no data") {
          popupContent += `No data avavailable for this Census Tract`;
        } else {
          popupContent +=
            "Approximately " +
            p.population +
            " people live in " +
            p.Total_pop +
            ", and around " +
            (p.Speak_anot * 100).toFixed(1) +
            "% of these residents speak a language other than English." +
            "The predominant non-English spoken language is: <b>" +
            p.Predominant +
            "</b>";
        }
      } else {
        // Popup content for selected language
        popupContent =
          "<h3>" + p.Geographic + "</h3>" + "<h5>(" + cdtanameClean + ")</h5>";

        if (p.Estimate == "no data") {
          popupContent += `No data avavailable for this Census Tract`;
        } else {
          switch (selectedLanguage) {
            case "Arabic":
              popupContent += `<p>Number of Arabic speakers: <b>${
                p.Arabic
              }</b></p>
              <p>Percentage of population speaking Arabic who are not fluent English speakers: <b>${(
                p.Arabic_nf * 100
              ).toFixed(1)}%
              </b></p>`;
              break;

            case "Chinese":
              popupContent += `<p>Number of Chinese speakers: <b>${
                p.Chinese
              }</b></p>
                <p>Percentage of population speaking Chinese who are not fluent English speakers: <b>${(
                  p.Chinese_nf * 100
                ).toFixed(1)}%</b></p>`;
              break;

            case "French, Haitian Creole, or Cajun":
              popupContent += `<p>Number of French, Haitian Creole, or Cajun speakers: <b>${
                p.French
              }</b></p>
                <p>Percentage of population speaking French, Haitian Creole, or Cajun who are not fluent English speakers: <b>${(
                  p.French_nf * 100
                ).toFixed(1)}%</b></p>`;
              break;

            case "German or other West Germanic languages":
              popupContent += `<p>Number of German or other West Germanic languages speakers: <b>${
                p.German
              }</b></p>
                <p>Percentage of population speaking German or other West Germanic languages who are not fluent English speakers: <b>${(
                  p.German_nf * 100
                ).toFixed(1)}%</b></p>`;
              break;

            case "Korean":
              popupContent += `<p>Number of Korean speakers: <b>${
                p.Korean
              }</b></p>
                <p>Percentage of population speaking Korean who are not fluent English speakers: <b>${(
                  p.Korean_nf * 100
                ).toFixed(1)}%</b></p>`;
              break;

            case "Other and unspecified languages":
              popupContent += `<p>Number of Other and unspecified languages speakers: <b>${
                p.Other
              }</b></p>
                <p>Percentage of population speaking Other and unspecified languages who are not fluent English speakers: <b>${(
                  p.Other_nf * 100
                ).toFixed(1)}%</b></p>`;
              break;

            case "Other Asian and Pacific Island languages":
              popupContent += `<p>Number of speakers of Other Asian and Pacific Island languages: <b>${
                p.Other_Asia
              }</b></p>
                <p>Percentage of population speaking Other Asian and Pacific Island languages who are not fluent English speakers: <b>${(
                  p.Other_Asia_nf * 100
                ).toFixed(1)}%</b></p>`;
              break;

            case "Other Indo-European languages":
              popupContent += `<p>Number of speakers of Other Indo-European languages: <b>${
                p.Other_Indo
              }</b></p>
                <p>Percentage of population speaking Other Indo-European languages who are not fluent English speakers: <b>${(
                  p.Other_Indo_nf * 100
                ).toFixed(1)}%</b></p>`;
              break;

            case "Russian, Polish, or other Slavic languages":
              popupContent += `<p>Number of Russian, Polish, or other Slavic languages speakers: <b>${
                p.Russian
              }</b></p>
                <p>Percentage of population speaking Russian, Polish, or other Slavic languages who are not fluent English speakers: <b>${(
                  p.Russian_nf * 100
                ).toFixed(1)}%</b></p>`;
              break;

            case "Spanish":
              popupContent += `<p>Number of Spanish speakers: <b>${
                p.Spanish
              }</b></p>
                <p>Percentage of population speaking Spanish who are not fluent English speakers: <b>${(
                  p.Spanish_nf * 100
                ).toFixed(1)}%</b></p>`;
              break;

            case "Tagalog (incl. Filipino)":
              popupContent += `<p>Number of Tagalog speakers: <b>${
                p.Tagalog
              }</b></p>
                <p>Percentage of population speaking Tagalog who are not fluent English speakers: <b>${(
                  p.Tagalog_nf * 100
                ).toFixed(1)}%</b></p>`;
              break;

            case "Vietnamese":
              popupContent += `<p>Number of Vietnamese speakers: <b>${
                p.Vietnamese
              }</b></p>
                <p>Percentage of population speaking Vietnamese who are not fluent English speakers: <b>${(
                  p.Vietnamese_nf * 100
                ).toFixed(1)}%</b></p>`;
              break;
          }
        }
      }

      layer.bindPopup(popupContent);

      // Change style base on mouse events
      layer.on("mouseover", function () {
        layer.setStyle({
          fillOpacity: 0.3,
        });
      });

      layer.on("mouseout", function () {
        layer.setStyle({
          fillOpacity: 0.8,
        });
      });
    },
  }).addTo(languageGroup);

  // Update the legend based on the selected layer and language
  selectedLayer = "language";
  updateLegend(selectedLayer, selectedLanguage);
}

//=========================================================== LANGUAGE DROPDOWN =================================================================

var LanguageControl = L.Control.extend({
  // Position
  options: {
    position: "topright",
  },

  onAdd: function (map) {
    var container = L.DomUtil.create("div");

    var select = L.DomUtil.create("select", "", container);
    // ID = languageSelect
    select.id = "languageSelect";
    select.onchange = updateMap;

    // Define languages for dropdown
    var languages = [
      { value: "", text: "Select Language" },
      { value: "Arabic", text: "Arabic" },
      { value: "Chinese", text: "Chinese" },
      {
        value: "French, Haitian Creole, or Cajun",
        text: "French, Haitian Creole, or Cajun",
      },
      {
        value: "German or other West Germanic languages",
        text: "German or other West Germanic languages",
      },
      { value: "Korean", text: "Korean" },
      {
        value: "Other and unspecified languages",
        text: "Other and unspecified languages",
      },
      {
        value: "Other Asian and Pacific Island languages",
        text: "Other Asian and Pacific Island languages",
      },
      {
        value: "Other Indo-European languages",
        text: "Other Indo-European languages",
      },
      {
        value: "Russian, Polish, or other Slavic languages",
        text: "Russian, Polish, or other Slavic languages",
      },
      { value: "Spanish", text: "Spanish" },
      { value: "Tagalog (incl. Filipino)", text: "Tagalog (incl. Filipino)" },
      { value: "Vietnamese", text: "Vietnamese" },
    ];

    // Populate dropdown
    for (var i = 0; i < languages.length; i++) {
      var option = L.DomUtil.create("option", "", select);
      option.value = languages[i].value;
      option.text = languages[i].text;
    }

    return container;
  },
});

function addLanguageControl() {
  if (!languageControl) {
    languageControl = new LanguageControl();
    mymap.addControl(languageControl);
  }
}

function removeLanguageControl() {
  if (languageControl) {
    mymap.removeControl(languageControl);
    languageControl = null;
  }
}

//=========================================================== DEMOGRAPHICS =================================================================

// Function for demographic data to get color based on population
function getColorScaleForDemographics(population) {
  return population > 10000
    ? "#00441b"
    : population > 7500
    ? "#006d2c"
    : population > 5000
    ? "#238b45"
    : population > 2500
    ? "#41ae76"
    : population > 1000
    ? "#66c2a4"
    : population > 500
    ? "#99d8c9"
    : population > 0
    ? "#ccece6"
    : "#606060";
}

// Function for demographic data to create a pie chart
function createPieChartForDemographic(id, data) {
  var width = 150,
    height = 150,
    radius = Math.min(width, height) / 2;

  var color = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.label))
    .range(d3.schemeCategory10);

  var pie = d3.pie().value((d) => d.value);

  var arc = d3
    .arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

  var svg = d3
    .select(id)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var g = svg
    .selectAll(".arc")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "arc");

  g.append("path")
    .attr("d", arc)
    .style("fill", (d) => color(d.data.label));

  g.append("text")
    .attr("transform", (d) => "translate(" + arc.centroid(d) + ")")
    .attr("dy", "0.35em")
    .style("text-anchor", "middle")
    .text((d) => d.data.label);

  g.append("text")
    .attr("transform", (d) => "translate(" + arc.centroid(d) + ")")
    .attr("dy", "1.35em")
    .style("text-anchor", "middle")
    .text(
      (d) =>
        Math.round((d.data.value / d3.sum(data, (d) => d.value)) * 100) + "%"
    );
}

// Create a GeoJSON layer for demographic data
var demographicGeoJson = L.geoJson(languageGeoJsonData, {
  style: function (feature) {
    var style;
    style = {
      fillColor: getColorScaleForDemographics(feature.properties.Total_pop),
      weight: 0.5,
      opacity: 1,
      color: "white",
      fillOpacity: 0.8,
    };
    return style;
  },

  onEachFeature: function (feature, layer) {
    // Unique identifier to ensure each pie chart is rendered in the correct popup
    var p = feature.properties;
    var id = p.FID;
    var cdtanameClean = formatNeighborhoodName(p.cdtaname);

    // Crate popup content with demographic details
    var popUpContent =
      "<h3>" + p.Geographic + "</h3>" + "<h5>(" + cdtanameClean + ")</h5>";

    if (p.Estimate == "no data") {
      popUpContent += `No data avavailable for this Census Tract`;
    } else {
      popUpContent += `
        <p>Approximately <b>${
          p.Total_pop
        }</b> people live in this census tract.</p>
              <p><b>${(p.Male_Pct * 100).toFixed(1)}%</b> (${
        p.Male
      }) of the population are male and <b>${(p.Female_Pct * 100).toFixed(
        1
      )}%</b> (${p.Female}) of the population are female</p>
        <p>The median age is <b>${p.Median_age}</b>.</p>
        <div id="pie-chart-${id}"></div>
      `;
    }

    layer.bindPopup(popUpContent);

    // Event listener to create a pie chart when popup is opened
    layer.on("popupopen", function () {
      var pieData = [
        { label: "Male", value: p.Male },
        { label: "Female", value: p.Female },
      ];
      // Create a pie chart only for places with valid data
      if (p.Estimate != "no data") {
        createPieChartForDemographic(`#pie-chart-${id}`, pieData);
      }
    });
  },
});

//=========================================================== LEGEND =================================================================

// Function to update the legend based on the selected layer and language
function updateLegend(selectedLayer, selectedLanguage) {
  var legendContent = "<h4>Legend</h4>";

  if (selectedLayer == "language") {
    if (selectedLanguage == "") {
      legendContent += "<h4>Predominant Languages</h4>";
      legendContent +=
        '<i style="background: #fa9993ff"></i><span>Arabic</span><br>';
      legendContent +=
        '<i style="background: #963f92ff"></i><span>Chinese</span><br>';
      legendContent +=
        '<i style="background: #6b5b95"></i><span>French, Haitian Creole, or Cajun</span><br>';
      legendContent +=
        '<i style="background: #91c1fdff"></i><span>German or other West Germanic languages</span><br>';
      legendContent +=
        '<i style="background: #e7298a"></i><span>Korean</span><br>';
      legendContent +=
        '<i style="background: #606060"></i><span>Other and unspecified languages</span><br>';
      legendContent +=
        '<i style="background: #30bfc7ff"></i><span>Other Asian and Pacific Island languages</span><br>';
      legendContent +=
        '<i style="background: #3288bd"></i><span>Other Indo-European languages</span><br>';
      legendContent +=
        '<i style="background: #51eba6ff"></i><span>Russian, Polish, or other Slavic languages</span><br>';
      legendContent +=
        '<i style="background: #41ab5d"></i><span>Spanish</span><br>';
      legendContent +=
        '<i style="background: #eb554dff"></i><span>Tagalog (incl. Filipino)</span><br>';
      legendContent +=
        '<i style="background: #ccb8cbff"></i><span>Vietnamese</span><br>';
    } else {
      legendContent += "<h4>Language</h4>";
      legendContent +=
        '<i style="background: #00441b"></i><span>> 1000</span><br>';
      legendContent +=
        '<i style="background: #006d2c"></i><span>800 - 1000</span><br>';
      legendContent +=
        '<i style="background: #238b45"></i><span>600 - 800</span><br>';
      legendContent +=
        '<i style="background: #41ae76"></i><span>400 - 600</span><br>';
      legendContent +=
        '<i style="background: #66c2a4"></i><span>200 - 400</span><br>';
      legendContent +=
        '<i style="background: #99d8c9"></i><span>1 - 200</span><br>';
      legendContent += '<i style="background: #ccece6"></i><span>0</span><br>';
    }
  } else if ((selectedLayer = "demographics")) {
    legendContent += "<h4>Population Density</h4>";
    legendContent +=
      '<i style="background: #00441b"></i><span>> 10000</span><br>';
    legendContent +=
      '<i style="background: #006d2c"></i><span>7500 - 10000</span><br>';
    legendContent +=
      '<i style="background: #238b45"></i><span>5000 - 7500</span><br>';
    legendContent +=
      '<i style="background: #41ae76"></i><span>2500 - 5000</span><br>';
    legendContent +=
      '<i style="background: #66c2a4"></i><span>1000 - 2500</span><br>';
    legendContent +=
      '<i style="background: #99d8c9"></i><span>500 - 1000</span><br>';
    legendContent +=
      '<i style="background: #ccece6"></i><span>1 - 500</span><br>';
    legendContent += '<i style="background: #606060"></i><span>0</span><br>';
  }

  document.querySelector(".legend").innerHTML = legendContent;
}

// Event listener for baselayer change to update the legend
mymap.on("baselayerchange", function (e) {
  if (e.name === "Language Data") {
    selectedLayer = "language";
    addLanguageControl();
    updateLegend(
      selectedLayer,
      document.getElementById("languageSelect").value
    );
  } else if (e.name === "Demographic Data") {
    selectedLayer = "demographics";
    removeLanguageControl();
    updateLegend(selectedLayer, "");
  }
});

updateLegend(selectedLayer, "");

//=========================================================== LAYERS CONTROL =================================================================

var baseLayers = {
  "Language Data": languageGroup,
  "Demographic Data": demographicGeoJson,
};

L.control.layers(baseLayers, null, { collapsed: false }).addTo(mymap);

addLanguageControl();

updateMap();
