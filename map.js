//=========================================================== MAP SETUP =================================================================
var maps = {};

// MAP BOUNDS - set bounds so the map has limits for visibility
var southWest = L.latLng(40.477399, -74.25909), // Southwest bound (farther south and west)
  northEast = L.latLng(40.917577, -73.700272), // Northeast bound (farther north and east)
  bounds = L.latLngBounds(southWest, northEast);

// MAP OBJECT
maps["demographicLanguageMap"] = L.map("demographicLanguageMap", {
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
).addTo(maps["demographicLanguageMap"]);

//=========================================================== SETTINGS =================================================================

// Work In Progress
// Update the values to change the layer and legend names
const healthStatusLayerNames = {
  DEPRESSION: "Depression Prevalence",
  MENTAL_HEALTH_BAD: "Mental Health Distress Prevalence",
  PHYSICAL_HEALTH_BAD: "Physical Health Distress Prevalence",
  POOR_SELF_RATED_HEALTH: "Fair or Poor Health",
  DISABILITY: "Disability Prevalence",
  HEARING_DISABILITY: "Hearing Disability Prevalence",
  VISION_DISABILITY: "Vision Disability prevalence",
  COGNITIVE_DISABILITY: "Cognitive Disability prevalence",
  MOBILITY_DISABILITY: "Mobility Disability prevalence",
  SELF_CARE_DISABILITY: "Self-care Disability prevalence",
  INDEPENDENT_LIVING_DISABILITY: "Independent Living Disability Prevalence",
};

// Update the values to change the color scale
const healthStatusColors = [
  "#662506",
  "#993404",
  "#cc4c02",
  "#ec7014",
  "#fe9929",
  "#fec44f",
  "#fee391",
  "#fff7bc",
  "#606060",
];

var highlightedFeature;

// Feature will be applied to all maps.
function allFeatures(feature, layer) {
  // Highlight effect on mouseover
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

  // Outline feature when clicked
  layer.on("click", function (e) {
    var layer = e.target;

    // Reset style of previous feature
    if (highlightedFeature) {
      highlightedFeature.setStyle({
        color: "white",
        weight: 0.5,
      });
    }

    // Outline
    layer.setStyle({
      color: "cyan",
      weight: 5,
    });

    // Store current feature
    highlightedFeature = layer;
  });
}

//=========================================================== VARIABLES =================================================================

var selectedLayer = "language";
var languageControl;
var mymap = maps["demographicLanguageMap"];

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

function getColorForArabic(value) {
  return value > 965
    ? "#00441b"
    : value > 508
    ? "#006d2c"
    : value > 296
    ? "#238b45"
    : value > 157
    ? "#41ae76"
    : value > 73
    ? "#66c2a4"
    : value > 23
    ? "#99d8c9"
    : value > 0
    ? "#ccece6"
    : "#606060";
}

function getColorForChinese(value) {
  return value > 6482
    ? "#00441b"
    : value > 2498
    ? "#006d2c"
    : value > 1562
    ? "#238b45"
    : value > 914
    ? "#41ae76"
    : value > 450
    ? "#66c2a4"
    : value > 145
    ? "#99d8c9"
    : value > 0
    ? "#ccece6"
    : "#606060";
}

function getColorForFrench(value) {
  return value > 1467
    ? "#00441b"
    : value > 663
    ? "#006d2c"
    : value > 434
    ? "#238b45"
    : value > 266
    ? "#41ae76"
    : value > 136
    ? "#66c2a4"
    : value > 47
    ? "#99d8c9"
    : value > 0
    ? "#ccece6"
    : "#606060";
}

function getColorForGerman(value) {
  return value > 6170
    ? "#00441b"
    : value > 3445
    ? "#006d2c"
    : value > 2318
    ? "#238b45"
    : value > 1486
    ? "#41ae76"
    : value > 625
    ? "#66c2a4"
    : value > 124
    ? "#99d8c9"
    : value > 0
    ? "#ccece6"
    : "#606060";
}

function getColorForKorean(value) {
  return value > 1307
    ? "#00441b"
    : value > 747
    ? "#006d2c"
    : value > 476
    ? "#238b45"
    : value > 246
    ? "#41ae76"
    : value > 114
    ? "#66c2a4"
    : value > 32
    ? "#99d8c9"
    : value > 0
    ? "#ccece6"
    : "#606060";
}

function getColorForOther(value) {
  return value > 1514
    ? "#00441b"
    : value > 824
    ? "#006d2c"
    : value > 457
    ? "#238b45"
    : value > 264
    ? "#41ae76"
    : value > 129
    ? "#66c2a4"
    : value > 43
    ? "#99d8c9"
    : value > 0
    ? "#ccece6"
    : "#606060";
}

function getColorForOtherAsia(value) {
  return value > 785
    ? "#00441b"
    : value > 427
    ? "#006d2c"
    : value > 283
    ? "#238b45"
    : value > 166
    ? "#41ae76"
    : value > 84
    ? "#66c2a4"
    : value > 26
    ? "#99d8c9"
    : value > 0
    ? "#ccece6"
    : "#606060";
}

function getColorForOtherIndo(value) {
  return value > 2653
    ? "#00441b"
    : value > 1357
    ? "#006d2c"
    : value > 777
    ? "#238b45"
    : value > 449
    ? "#41ae76"
    : value > 238
    ? "#66c2a4"
    : value > 87
    ? "#99d8c9"
    : value > 0
    ? "#ccece6"
    : "#606060";
}

function getColorForRussian(value) {
  return value > 3818
    ? "#00441b"
    : value > 2369
    ? "#006d2c"
    : value > 1409
    ? "#238b45"
    : value > 818
    ? "#41ae76"
    : value > 416
    ? "#66c2a4"
    : value > 128
    ? "#99d8c9"
    : value > 0
    ? "#ccece6"
    : "#606060";
}

function getColorForSpanish(value) {
  return value > 9883
    ? "#00441b"
    : value > 5570
    ? "#006d2c"
    : value > 3588
    ? "#238b45"
    : value > 2273
    ? "#41ae76"
    : value > 1269
    ? "#66c2a4"
    : value > 519
    ? "#99d8c9"
    : value > 0
    ? "#ccece6"
    : "#606060";
}

function getColorForTagalog(value) {
  return value > 962
    ? "#00441b"
    : value > 524
    ? "#006d2c"
    : value > 268
    ? "#238b45"
    : value > 132
    ? "#41ae76"
    : value > 62
    ? "#66c2a4"
    : value > 19
    ? "#99d8c9"
    : value > 0
    ? "#ccece6"
    : "#606060";
}

function getColorForVietnamese(value) {
  return value > 256
    ? "#00441b"
    : value > 131
    ? "#006d2c"
    : value > 74
    ? "#238b45"
    : value > 41
    ? "#41ae76"
    : value > 20
    ? "#66c2a4"
    : value > 6
    ? "#99d8c9"
    : value > 0
    ? "#ccece6"
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
            style = {
              fillColor: getColorForArabic(numberOfSpeakers),
              weight: 0.5,
              opacity: 1,
              color: "white",
              fillOpacity: 0.8,
            };
            break;
          case "Chinese":
            numberOfSpeakers = feature.properties.Chinese;
            style = {
              fillColor: getColorForChinese(numberOfSpeakers),
              weight: 0.5,
              opacity: 1,
              color: "white",
              fillOpacity: 0.8,
            };
            break;
          case "French, Haitian Creole, or Cajun":
            numberOfSpeakers = feature.properties.French;
            style = {
              fillColor: getColorForFrench(numberOfSpeakers),
              weight: 0.5,
              opacity: 1,
              color: "white",
              fillOpacity: 0.8,
            };
            break;
          case "German or other West Germanic languages":
            numberOfSpeakers = feature.properties.German;
            style = {
              fillColor: getColorForGerman(numberOfSpeakers),
              weight: 0.5,
              opacity: 1,
              color: "white",
              fillOpacity: 0.8,
            };
            break;
          case "Korean":
            numberOfSpeakers = feature.properties.Korean;
            style = {
              fillColor: getColorForKorean(numberOfSpeakers),
              weight: 0.5,
              opacity: 1,
              color: "white",
              fillOpacity: 0.8,
            };
            break;
          case "Other and unspecified languages":
            numberOfSpeakers = feature.properties.Other;
            style = {
              fillColor: getColorForOther(numberOfSpeakers),
              weight: 0.5,
              opacity: 1,
              color: "white",
              fillOpacity: 0.8,
            };
            break;
          case "Other Asian and Pacific Island languages":
            numberOfSpeakers = feature.properties.Other_Asia;
            style = {
              fillColor: getColorForOtherAsia(numberOfSpeakers),
              weight: 0.5,
              opacity: 1,
              color: "white",
              fillOpacity: 0.8,
            };
            break;
          case "Other Indo-European languages":
            numberOfSpeakers = feature.properties.Other_Indo;
            style = {
              fillColor: getColorForOtherIndo(numberOfSpeakers),
              weight: 0.5,
              opacity: 1,
              color: "white",
              fillOpacity: 0.8,
            };
            break;
          case "Russian, Polish, or other Slavic languages":
            numberOfSpeakers = feature.properties.Russian;
            style = {
              fillColor: getColorForRussian(numberOfSpeakers),
              weight: 0.5,
              opacity: 1,
              color: "white",
              fillOpacity: 0.8,
            };
            break;
          case "Spanish":
            numberOfSpeakers = feature.properties.Spanish;
            style = {
              fillColor: getColorForSpanish(numberOfSpeakers),
              weight: 0.5,
              opacity: 1,
              color: "white",
              fillOpacity: 0.8,
            };
            break;
          case "Tagalog (incl. Filipino)":
            numberOfSpeakers = feature.properties.Tagalog;
            style = {
              fillColor: getColorForTagalog(numberOfSpeakers),
              weight: 0.5,
              opacity: 1,
              color: "white",
              fillOpacity: 0.8,
            };
            break;
          case "Vietnamese":
            numberOfSpeakers = feature.properties.Vietnamese;
            style = {
              fillColor: getColorForVietnamese(numberOfSpeakers),
              weight: 0.5,
              opacity: 1,
              color: "white",
              fillOpacity: 0.8,
            };
            break;
        }
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

      var popup = L.responsivePopup().setContent(popupContent);

      layer.bindPopup(popup);

      allFeatures(feature, layer);
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
      { value: "", text: "Predominant Languages" },
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

// Create a GeoJSON layer for demographic data
demographicGeoJson = L.geoJson(languageGeoJsonData, {
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
    allFeatures(feature, layer);

    // Unique identifier to ensure each pie chart is rendered in the correct popup
    var p = feature.properties;
    var id = p.FID;
    var cdtanameClean = formatNeighborhoodName(p.cdtaname);

    // Create popup content with demographic details
    var popUpContent =
      "<h3>" + p.Geographic + "</h3>" + "<h5>(" + cdtanameClean + ")</h5>";

    if (p.Estimate == "no data") {
      popUpContent += `No data available for this Census Tract`;
    } else {
      // Text section
      popUpContent += `
        <p>Approximately <b>${
          p.Total_pop
        }</b> people live in this census tract.</p>
        <p><b>${(p.Male_Pct * 100).toFixed(1)}%</b> (${
        p.Male
      }) of the population are male and <b>${(p.Female_Pct * 100).toFixed(
        1
      )}%</b> (${p.Female}) of the population are female</p>
        <p>The median age is <b>${p.Median_age}</b>.</p>`;

      // Pie chart section
      // Use JSON.stringify to turn the properties object into a string so it can be passed into updatePieChart function
      // Chart container must have a set size or responsive popup plugin will not work as intended
      popUpContent += `
      <button id="more-btn-${id}" onclick='showMoreButtons(${id})'>More</button>
        <button id="hide-btn-${id}" onclick='hideMoreButtons(${id})' style="display:none;">Hide</button>
        <div id="more-buttons-${id}" style="display:none;">
        
        <button onclick='updatePieChart(${id}, "gender", ${JSON.stringify(
        p
      )})'>Gender</button>

       <button onclick='updatePieChart(${id}, "age", ${JSON.stringify(
        p
      )})'>Age</button>
      
       <button onclick='updateBarPlotForRace(${id}, ${JSON.stringify(
        p
      )})'>Race</button>

        <div id="chart-container-${id}" style="width: 150px; height: 200px; height: 100%;"></div>
      `;
    }

    var popup = L.responsivePopup().setContent(popUpContent);
    layer.bindPopup(popup);

    // Event listener to create a pie chart when popup is opened
    layer.on("popupopen", function () {
      // Show gender pie chart by default
      updatePieChart(id, "gender", p);
    });
  },
});

// Function for demographic data to get color based on population
function getColorScaleForDemographics(population) {
  return population > 15945
    ? "#00441b"
    : population > 8460
    ? "#006d2c"
    : population > 6159
    ? "#238b45"
    : population > 4634
    ? "#41ae76"
    : population > 3380
    ? "#66c2a4"
    : population > 2181
    ? "#99d8c9"
    : population > 0
    ? "#ccece6"
    : "#606060";
}

// Function for demographic data to create a pie chart
function createPieChartForDemographic(id, data) {
  // Clear any existing element from the container
  d3.select(id).selectAll("*").remove();

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

// Create pie chart based on selected type (gender or age)
function updatePieChart(id, type, properties) {
  var pieData = [];

  if (type === "gender") {
    pieData = [
      { label: "Male", value: properties.Male },
      { label: "Female", value: properties.Female },
    ];
  } else if (type === "age") {
    pieData = [
      { label: "Under 5", value: properties.Under_5 },
      { label: "Under 18", value: properties.Under_18 },
      { label: "18 and over", value: properties["18_plus"] },
      { label: "65 and over", value: properties["65_plus"] },
    ];
  }

  createPieChartForDemographic(`#chart-container-${id}`, pieData);
}

// Create bar plot base on race data
function createBarPlotForDemographics(id, data) {
  // Remove any existing barplot from the container
  d3.select(id).selectAll("*").remove();

  // set the dimensions and margins of the graph
  var margin = { top: 20, right: 20, bottom: 50, left: 30 },
    width = 325 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select(id)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Calculate total sum
  var total = d3.sum(data, function (d) {
    return d.value;
  });

  // Convert each value to percentage
  data.forEach(function (d) {
    d.percentage = (d.value / total) * 100;
  });

  // sort data by percentage
  data.sort(function (b, a) {
    return a.percentage - b.percentage;
  });

  // X axis
  var x = d3
    .scaleBand()
    .range([0, width])
    .domain(
      data.map(function (d) {
        return d.label;
      })
    )
    .padding(0.2);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Find the maximum percentage value
  var maxPercentage = d3.max(data, function (d) {
    return d.percentage;
  });

  // Y axis percentage
  var y = d3.scaleLinear().domain([0, maxPercentage]).range([height, 0]);
  svg.append("g").call(
    d3.axisLeft(y).tickFormat(function (d) {
      return d + "%";
    })
  );

  // Bars
  svg
    .selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return x(d.label);
    })
    .attr("y", function (d) {
      return y(d.percentage);
    })
    .attr("width", x.bandwidth())
    .attr("height", function (d) {
      return height - y(d.percentage);
    })
    .attr("fill", "#69b3a2");
}

// Update bar plot value base on race data
function updateBarPlotForRace(id, properties) {
  var barData = [
    { label: "Arabic", value: parseInt(properties.Arabic) },
    { label: "Chinese", value: parseInt(properties.Chinese) },
    {
      label: "French, Haitian Creole, or Cajun",
      value: parseInt(properties.French),
    },
    {
      label: "German or other West Germanic languages",
      value: parseInt(properties.German),
    },
    { label: "Korean", value: parseInt(properties.Korean) },
    {
      label: "Other and unspecified languages",
      value: parseInt(properties.Other),
    },
    {
      label: "Other Asian and Pacific Island languages",
      value: parseInt(properties.Other_Asia),
    },
    {
      label: "Other Indo-European languages",
      value: parseInt(properties.Other_Indo),
    },
    {
      label: "Russian, Polish, or other Slavic languages",
      value: parseInt(properties.Russian),
    },
    { label: "Spanish", value: parseInt(properties.Spanish) },
    { label: "Tagalog (incl. Filipino)", value: parseInt(properties.Tagalog) },
    { label: "Vietnamese", value: parseInt(properties.Vietnamese) },
  ];

  createBarPlotForDemographics(`#chart-container-${id}`, barData);
}

function showMoreButtons(id) {
  document.getElementById(`more-buttons-${id}`).style.display = "block";
  document.getElementById(`more-btn-${id}`).style.display = "none";
  document.getElementById(`hide-btn-${id}`).style.display = "block";
}

function hideMoreButtons(id) {
  document.getElementById(`more-buttons-${id}`).style.display = "none";
  document.getElementById(`more-btn-${id}`).style.display = "block";
  document.getElementById(`hide-btn-${id}`).style.display = "none";
}

//=========================================================== LEGEND =================================================================

// Function to update the legend based on the selected layer and language
function updateLegend(selectedLayer, selectedLanguage) {
  var legendContent = "";

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
      legendContent += `<h4>${selectedLanguage} Speakers</h4>`;
      switch (selectedLanguage) {
        case "Arabic":
          legendContent +=
            '<i style="background: #00441b"></i><span>> 965</span><br>';
          legendContent +=
            '<i style="background: #006d2c"></i><span>508 - 965</span><br>';
          legendContent +=
            '<i style="background: #238b45"></i><span>296 - 508</span><br>';
          legendContent +=
            '<i style="background: #41ae76"></i><span>157 - 296</span><br>';
          legendContent +=
            '<i style="background: #66c2a4"></i><span>73 - 157</span><br>';
          legendContent +=
            '<i style="background: #99d8c9"></i><span>23 - 73</span><br>';
          legendContent +=
            '<i style="background: #ccece6"></i><span>0 - 23</span><br>';
          legendContent +=
            '<i style="background: #606060"></i><span>No Data</span><br>';
          break;
        case "Chinese":
          legendContent +=
            '<i style="background: #00441b"></i><span>> 6482</span><br>';
          legendContent +=
            '<i style="background: #006d2c"></i><span>2498 - 6482</span><br>';
          legendContent +=
            '<i style="background: #238b45"></i><span>1562 - 2498</span><br>';
          legendContent +=
            '<i style="background: #41ae76"></i><span>914 - 1562</span><br>';
          legendContent +=
            '<i style="background: #66c2a4"></i><span>450 - 914</span><br>';
          legendContent +=
            '<i style="background: #99d8c9"></i><span>145 - 450</span><br>';
          legendContent +=
            '<i style="background: #ccece6"></i><span>0 - 145</span><br>';
          legendContent +=
            '<i style="background: #606060"></i><span>No Data</span><br>';
          break;
        case "French, Haitian Creole, or Cajun":
          legendContent +=
            '<i style="background: #00441b"></i><span>> 1467</span><br>';
          legendContent +=
            '<i style="background: #006d2c"></i><span>663 - 1467</span><br>';
          legendContent +=
            '<i style="background: #238b45"></i><span>434 - 663</span><br>';
          legendContent +=
            '<i style="background: #41ae76"></i><span>266 - 434</span><br>';
          legendContent +=
            '<i style="background: #66c2a4"></i><span>136 - 266</span><br>';
          legendContent +=
            '<i style="background: #99d8c9"></i><span>47 - 136</span><br>';
          legendContent +=
            '<i style="background: #ccece6"></i><span>0 - 47</span><br>';
          legendContent +=
            '<i style="background: #606060"></i><span>No Data</span><br>';
          break;
        case "German or other West Germanic languages":
          legendContent +=
            '<i style="background: #00441b"></i><span>> 6170</span><br>';
          legendContent +=
            '<i style="background: #006d2c"></i><span>3445 - 6170</span><br>';
          legendContent +=
            '<i style="background: #238b45"></i><span>2318 - 3445</span><br>';
          legendContent +=
            '<i style="background: #41ae76"></i><span>1486 - 2318</span><br>';
          legendContent +=
            '<i style="background: #66c2a4"></i><span>625 - 1486</span><br>';
          legendContent +=
            '<i style="background: #99d8c9"></i><span>124 - 625</span><br>';
          legendContent +=
            '<i style="background: #ccece6"></i><span>0 - 124</span><br>';
          legendContent +=
            '<i style="background: #606060"></i><span>No Data</span><br>';
          break;
        case "Korean":
          legendContent +=
            '<i style="background: #00441b"></i><span>> 1307</span><br>';
          legendContent +=
            '<i style="background: #006d2c"></i><span>747 - 1307</span><br>';
          legendContent +=
            '<i style="background: #238b45"></i><span>476 - 747</span><br>';
          legendContent +=
            '<i style="background: #41ae76"></i><span>246 - 476</span><br>';
          legendContent +=
            '<i style="background: #66c2a4"></i><span>114 - 246</span><br>';
          legendContent +=
            '<i style="background: #99d8c9"></i><span>32 - 114</span><br>';
          legendContent +=
            '<i style="background: #ccece6"></i><span>0 - 32</span><br>';
          legendContent +=
            '<i style="background: #606060"></i><span>No Data</span><br>';
          break;
        case "Other and unspecified languages":
          legendContent +=
            '<i style="background: #00441b"></i><span>> 1514</span><br>';
          legendContent +=
            '<i style="background: #006d2c"></i><span>824 - 1514</span><br>';
          legendContent +=
            '<i style="background: #238b45"></i><span>457 - 824</span><br>';
          legendContent +=
            '<i style="background: #41ae76"></i><span>264 - 457</span><br>';
          legendContent +=
            '<i style="background: #66c2a4"></i><span>129 - 264</span><br>';
          legendContent +=
            '<i style="background: #99d8c9"></i><span>43 - 129</span><br>';
          legendContent +=
            '<i style="background: #ccece6"></i><span>0 - 43</span><br>';
          legendContent +=
            '<i style="background: #606060"></i><span>No Data</span><br>';
          break;
        case "Other Asian and Pacific Island languages":
          legendContent +=
            '<i style="background: #00441b"></i><span>> 785</span><br>';
          legendContent +=
            '<i style="background: #006d2c"></i><span>427 - 785</span><br>';
          legendContent +=
            '<i style="background: #238b45"></i><span>283 - 427</span><br>';
          legendContent +=
            '<i style="background: #41ae76"></i><span>166 - 283</span><br>';
          legendContent +=
            '<i style="background: #66c2a4"></i><span>84 - 166</span><br>';
          legendContent +=
            '<i style="background: #99d8c9"></i><span>26 - 84</span><br>';
          legendContent +=
            '<i style="background: #ccece6"></i><span>0 - 26</span><br>';
          legendContent +=
            '<i style="background: #606060"></i><span>No Data</span><br>';
          break;
        case "Other Indo-European languages":
          legendContent +=
            '<i style="background: #00441b"></i><span>> 2653</span><br>';
          legendContent +=
            '<i style="background: #006d2c"></i><span>1357 - 2653</span><br>';
          legendContent +=
            '<i style="background: #238b45"></i><span>777 - 1357</span><br>';
          legendContent +=
            '<i style="background: #41ae76"></i><span>449 - 777</span><br>';
          legendContent +=
            '<i style="background: #66c2a4"></i><span>238 - 449</span><br>';
          legendContent +=
            '<i style="background: #99d8c9"></i><span>87 - 238</span><br>';
          legendContent +=
            '<i style="background: #ccece6"></i><span>0 - 87</span><br>';
          legendContent +=
            '<i style="background: #606060"></i><span>No Data</span><br>';
          break;
        case "Russian, Polish, or other Slavic languages":
          legendContent +=
            '<i style="background: #00441b"></i><span>> 3818</span><br>';
          legendContent +=
            '<i style="background: #006d2c"></i><span>2369 - 3818</span><br>';
          legendContent +=
            '<i style="background: #238b45"></i><span>1409 - 2369</span><br>';
          legendContent +=
            '<i style="background: #41ae76"></i><span>818 - 1409</span><br>';
          legendContent +=
            '<i style="background: #66c2a4"></i><span>416 - 818</span><br>';
          legendContent +=
            '<i style="background: #99d8c9"></i><span>128 - 416</span><br>';
          legendContent +=
            '<i style="background: #ccece6"></i><span>0 - 128</span><br>';
          legendContent +=
            '<i style="background: #606060"></i><span>No Data</span><br>';
          break;
        case "Spanish":
          legendContent +=
            '<i style="background: #00441b"></i><span>> 9883</span><br>';
          legendContent +=
            '<i style="background: #006d2c"></i><span>5570 - 9883</span><br>';
          legendContent +=
            '<i style="background: #238b45"></i><span>3588 - 5570</span><br>';
          legendContent +=
            '<i style="background: #41ae76"></i><span>2273 - 3588</span><br>';
          legendContent +=
            '<i style="background: #66c2a4"></i><span>1269 - 2273</span><br>';
          legendContent +=
            '<i style="background: #99d8c9"></i><span>519 - 1269</span><br>';
          legendContent +=
            '<i style="background: #ccece6"></i><span>0 - 519</span><br>';
          legendContent +=
            '<i style="background: #606060"></i><span>No Data</span><br>';
          break;
        case "Tagalog (incl. Filipino)":
          legendContent +=
            '<i style="background: #00441b"></i><span>> 962</span><br>';
          legendContent +=
            '<i style="background: #006d2c"></i><span>524 - 962</span><br>';
          legendContent +=
            '<i style="background: #238b45"></i><span>268 - 524</span><br>';
          legendContent +=
            '<i style="background: #41ae76"></i><span>132 - 268</span><br>';
          legendContent +=
            '<i style="background: #66c2a4"></i><span>62 - 132</span><br>';
          legendContent +=
            '<i style="background: #99d8c9"></i><span>19 - 62</span><br>';
          legendContent +=
            '<i style="background: #ccece6"></i><span>0 - 19</span><br>';
          legendContent +=
            '<i style="background: #606060"></i><span>No Data</span><br>';
          break;
        case "Vietnamese":
          legendContent +=
            '<i style="background: #00441b"></i><span>> 256</span><br>';
          legendContent +=
            '<i style="background: #006d2c"></i><span>131 - 256</span><br>';
          legendContent +=
            '<i style="background: #238b45"></i><span>74 - 131</span><br>';
          legendContent +=
            '<i style="background: #41ae76"></i><span>41 - 74</span><br>';
          legendContent +=
            '<i style="background: #66c2a4"></i><span>20 - 41</span><br>';
          legendContent +=
            '<i style="background: #99d8c9"></i><span>6 - 20</span><br>';
          legendContent +=
            '<i style="background: #ccece6"></i><span>0 - 6</span><br>';
          legendContent +=
            '<i style="background: #606060"></i><span>No Data</span><br>';
          break;
      }
    }
  } else if ((selectedLayer = "demographics")) {
    legendContent += "<h4>Population Density</h4>";
    legendContent +=
      '<i style="background: #00441b"></i><span>15945+</span><br>';
    legendContent +=
      '<i style="background: #006d2c"></i><span>8460 - 15945</span><br>';
    legendContent +=
      '<i style="background: #238b45"></i><span>6159 - 8460</span><br>';
    legendContent +=
      '<i style="background: #41ae76"></i><span>4636 - 6159</span><br>';
    legendContent +=
      '<i style="background: #66c2a4"></i><span>3380 - 4636</span><br>';
    legendContent +=
      '<i style="background: #99d8c9"></i><span>2181 - 3380</span><br>';
    legendContent +=
      '<i style="background: #ccece6"></i><span>0 - 2181</span><br>';
    legendContent += '<i style="background: #606060"></i><span>0</span><br>';
  }

  document.querySelector(".legend").innerHTML = legendContent;
}

// Event listener for baselayer change to update the legend
mymap.on("baselayerchange", function (e) {
  if (e.name === "Language Data") {
    selectedLayer = "language";
    selectedLanguage = "";
    addLanguageControl();
    updateLegend(
      selectedLayer,
      document.getElementById("languageSelect").value
    );
    updateMap();
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

//=========================================================== Health Risk Behaviors Map =================================================================

maps["healthRiskBehaviorsMap"] = L.map("healthRiskBehaviorsMap", {
  maxBounds: bounds,
  maxZoom: 18,
  minZoom: 11,
}).setView([40.65, -73.97], 11);

var baseLayer2 = L.tileLayer(
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
).addTo(maps["healthRiskBehaviorsMap"]);

var healthRiskLayers = {
  uninsured: L.geoJson(null, {
    style: healthRiskStyle(
      "Lack of health insurance crude prevalence (%)",
      getColorForUninsured
    ),
  }),
  frequentDrinkers: L.geoJson(null, {
    style: healthRiskStyle(
      "Binge drinking crude prevalence (%)",
      getColorForFrequentDrinkers
    ),
  }),
  currentSmokers: L.geoJson(null, {
    style: healthRiskStyle(
      "Current smoking crude prevalence (%)",
      getColorForCurrentSmokers
    ),
  }),
  sedentaryLifestyle: L.geoJson(null, {
    style: healthRiskStyle(
      "Physical inactivity crude prevalence (%)",
      getColorForSedentaryLifestyle
    ),
  }),
  sleepLessThan7Hours: L.geoJson(null, {
    style: healthRiskStyle(
      "Sleep <7 hours crude prevalence (%)",
      getColorForSleepLessThan7Hours
    ),
  }),
};

function healthRiskStyle(propertyName, colorFunction) {
  return function (feature) {
    return {
      fillColor: colorFunction(feature.properties[propertyName]),
      weight: 0.5,
      opacity: 1,
      color: "white",
      fillOpacity: 0.8,
    };
  };
}

// TEMPORARY WILL CHANGE LATER
function getColorForUninsured(percent) {
  return percent > 31.1
    ? "#034e7b"
    : percent > 21.3
    ? "#0570b0"
    : percent > 16.1
    ? "#3690c0"
    : percent > 12
    ? "#74a9cf"
    : percent > 8.6
    ? "#a6bddb"
    : percent > 5.6
    ? "#d0d1e6"
    : percent > 2
    ? "#f1eef6"
    : percent > 0
    ? "#f1eef6"
    : "#606060";
}

// TEMPORARY WILL CHANGE LATER
function getColorForFrequentDrinkers(percent) {
  return percent > 29.4
    ? "#034e7b"
    : percent > 23.1
    ? "#0570b0"
    : percent > 20.1
    ? "#3690c0"
    : percent > 17.3
    ? "#74a9cf"
    : percent > 15
    ? "#a6bddb"
    : percent > 12.8
    ? "#d0d1e6"
    : percent > 4.9
    ? "#f1eef6"
    : percent > 0
    ? "#f1eef6"
    : "#606060";
}

// TEMPORARY WILL CHANGE LATER
function getColorForCurrentSmokers(percent) {
  return percent > 45.4
    ? "#034e7b"
    : percent > 23.1
    ? "#0570b0"
    : percent > 18.7
    ? "#3690c0"
    : percent > 15.4
    ? "#74a9cf"
    : percent > 12.6
    ? "#a6bddb"
    : percent > 9.5
    ? "#d0d1e6"
    : percent > 5.1
    ? "#f1eef6"
    : percent > 0
    ? "#f1eef6"
    : "#606060";
}

// TEMPORARY WILL CHANGE LATER
function getColorForSedentaryLifestyle(percent) {
  return percent > 63.9
    ? "#034e7b"
    : percent > 40.5
    ? "#0570b0"
    : percent > 34.2
    ? "#3690c0"
    : percent > 28.9
    ? "#74a9cf"
    : percent > 23.7
    ? "#a6bddb"
    : percent > 17.4
    ? "#d0d1e6"
    : percent > 9.4
    ? "#f1eef6"
    : percent > 0
    ? "#f1eef6"
    : "#606060";
}

// TEMPORARY WILL CHANGE LATER
function getColorForSleepLessThan7Hours(percent) {
  return percent > 49.1
    ? "#034e7b"
    : percent > 41.5
    ? "#0570b0"
    : percent > 38.5
    ? "#3690c0"
    : percent > 35.7
    ? "#74a9cf"
    : percent > 32.9
    ? "#a6bddb"
    : percent > 29.9
    ? "#d0d1e6"
    : percent > 23.2
    ? "#f1eef6"
    : percent > 0
    ? "#f1eef6"
    : "#606060";
}

function addHealthRiskData(data) {
  data.features.forEach(function (feature) {
    var p = feature.properties;

    var uninsuredPopup = `
      <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
      Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated lack of health insurance crude prevalence is 
      <b>${p["Lack of health insurance crude prevalence (%)"]}%</b>
      ${p["Lack of health insurance crude prevalence 95% CI"]}.
    `;

    var frequentDrinkersPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated binge drinking crude prevalence is 
    <b>${p["Binge drinking crude prevalence (%)"]}%</b> 
    ${p["Binge drinking crude prevalence 95% CI"]}.
  `;

    var currentSmokersPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated current smoking crude prevalence is 
    <b>${p["Current smoking crude prevalence (%)"]}%</b> 
    ${p["Current smoking crude prevalence 95% CI"]}.
  `;

    var sedentaryLifestylePopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated physical inactivity crude prevalence is 
    <b>${p["Physical inactivity crude prevalence (%)"]}%</b> 
    ${p["Physical inactivity crude prevalence 95% CI"]}.
  `;

    var sleepLessThan7HoursPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated prevalence of sleep less than 7 hours is 
    <b>${p["Sleep <7 hours crude prevalence (%)"]}%</b> 
    ${p["Sleep <7 hours crude prevalence 95% CI"]}.
  `;

    var uninsuredLayer = L.geoJson(feature, {
      style: healthRiskStyle(
        "Lack of health insurance crude prevalence (%)",
        getColorForUninsured
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(uninsuredPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthRiskLayers.uninsured.addLayer(uninsuredLayer);

    var frequentDrinkersLayer = L.geoJson(feature, {
      style: healthRiskStyle(
        "Binge drinking crude prevalence (%)",
        getColorForFrequentDrinkers
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(frequentDrinkersPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthRiskLayers.frequentDrinkers.addLayer(frequentDrinkersLayer);

    var currentSmokersLayer = L.geoJson(feature, {
      style: healthRiskStyle(
        "Current smoking crude prevalence (%)",
        getColorForCurrentSmokers
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(currentSmokersPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthRiskLayers.currentSmokers.addLayer(currentSmokersLayer);

    var sedentaryLifestyleLayer = L.geoJson(feature, {
      style: healthRiskStyle(
        "Physical inactivity crude prevalence (%)",
        getColorForSedentaryLifestyle
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(sedentaryLifestylePopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthRiskLayers.sedentaryLifestyle.addLayer(sedentaryLifestyleLayer);

    var sleepLessThan7HoursLayer = L.geoJson(feature, {
      style: healthRiskStyle(
        "Sleep <7 hours crude prevalence (%)",
        getColorForSleepLessThan7Hours
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(sleepLessThan7HoursPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthRiskLayers.sleepLessThan7Hours.addLayer(sleepLessThan7HoursLayer);
  });
}

addHealthRiskData(healthDataGeojson);

var baseLayers = {
  Uninsured: healthRiskLayers.uninsured,
  "Frequent Drinkers": healthRiskLayers.frequentDrinkers,
  "Current Smokers": healthRiskLayers.currentSmokers,
  "Sedentary Lifestyle": healthRiskLayers.sedentaryLifestyle,
  "<7 Hours Sleep": healthRiskLayers.sleepLessThan7Hours,
};

L.control
  .layers(baseLayers, null, { collapsed: false })
  .addTo(maps["healthRiskBehaviorsMap"]);

// HEALTH RISK LEGEND CONTROL
var healthRisklegend = L.control({ position: "bottomleft" });

healthRisklegend.onAdd = function () {
  var div = L.DomUtil.create("div", "healthRiskLegend");
  div.innerHTML = `
    <h4>Percent Uninsured</h4>
    <i style="background: #034e7b"></i><span> > 31.1%</span><br>
    <i style="background: #0570b0"></i><span>21.3% - 31.1%</span><br>
    <i style="background: #3690c0"></i><span>16.1% - 21.3%</span><br>
    <i style="background: #74a9cf"></i><span>12% - 16.1%</span><br>
    <i style="background: #a6bddb"></i><span>8.6% - 12%</span><br>
    <i style="background: #d0d1e6"></i><span>5.6% - 8.6%</span><br>
    <i style="background: #f1eef6"></i><span>2% - 5.6%</span><br>
    <i style="background: #f1eef6"></i><span>0% - 2%</span><br>
    <i style="background: #606060"></i><span>No Data</span><br>
  `;
  return div;
};

healthRisklegend.addTo(maps["healthRiskBehaviorsMap"]);

function updateLegendForHealthRisk(layerName) {
  var legendContent = "";
  switch (layerName) {
    case "Uninsured":
      legendContent = `
        <h4>Percent Uninsured</h4>
        <i style="background: #034e7b"></i><span> > 31.1%</span><br>
        <i style="background: #0570b0"></i><span>21.3% - 31.1%</span><br>
        <i style="background: #3690c0"></i><span>16.1% - 21.3%</span><br>
        <i style="background: #74a9cf"></i><span>12% - 16.1%</span><br>
        <i style="background: #a6bddb"></i><span>8.6% - 12%</span><br>
        <i style="background: #d0d1e6"></i><span>5.6% - 8.6%</span><br>
        <i style="background: #f1eef6"></i><span>2% - 5.6%</span><br>
        <i style="background: #f1eef6"></i><span>0% - 2%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
    case "Frequent Drinkers":
      legendContent = `
        <h4>Frequent Drinkers</h4>
        <i style="background: #034e7b"></i><span> > 29.4%</span><br>
        <i style="background: #0570b0"></i><span>23.1% - 29.4%</span><br>
        <i style="background: #3690c0"></i><span>20.1% - 23.1%</span><br>
        <i style="background: #74a9cf"></i><span>17.3% - 20.1%</span><br>
        <i style="background: #a6bddb"></i><span>15% - 17.3%</span><br>
        <i style="background: #d0d1e6"></i><span>12.8% - 15%</span><br>
        <i style="background: #f1eef6"></i><span>4.9% - 12.8%</span><br>
        <i style="background: #f1eef6"></i><span>0% - 4.9%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
    case "Current Smokers":
      legendContent = `
        <h4>Adult Smokers</h4>
        <i style="background: #034e7b"></i><span> > 45.4%</span><br>
        <i style="background: #0570b0"></i><span>23.1% - 45.4%</span><br>
        <i style="background: #3690c0"></i><span>18.7% - 23.1%</span><br>
        <i style="background: #74a9cf"></i><span>15.4% - 18.7%</span><br>
        <i style="background: #a6bddb"></i><span>12.6% - 15.4%</span><br>
        <i style="background: #d0d1e6"></i><span>9.5% - 12.6%</span><br>
        <i style="background: #f1eef6"></i><span>5.1% - 9.5%</span><br>
        <i style="background: #f1eef6"></i><span>0% - 5.1%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
    case "Sedentary Lifestyle":
      legendContent = `
        <h4>Phyiscally Inactive</h4>
        <i style="background: #034e7b"></i><span> > 63.9%</span><br>
        <i style="background: #0570b0"></i><span>40.5% - 63.9%</span><br>
        <i style="background: #3690c0"></i><span>34.2% - 40.5%</span><br>
        <i style="background: #74a9cf"></i><span>28.9% - 34.2%</span><br>
        <i style="background: #a6bddb"></i><span>23.7% - 28.9%</span><br>
        <i style="background: #d0d1e6"></i><span>17.4% - 23.7%</span><br>
        <i style="background: #f1eef6"></i><span>9.4% - 17.4%</span><br>
        <i style="background: #f1eef6"></i><span>0% - 9.4%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
    case "<7 Hours Sleep":
      legendContent = `
        <h4>Sleep <7 Hours</h4>
        <i style="background: #034e7b"></i><span> > 49.1%</span><br>
        <i style="background: #0570b0"></i><span>41.5% - 49.1%</span><br>
        <i style="background: #3690c0"></i><span>38.5% - 41.5%</span><br>
        <i style="background: #74a9cf"></i><span>35.7% - 38.5%</span><br>
        <i style="background: #a6bddb"></i><span>32.9% - 35.7%</span><br>
        <i style="background: #d0d1e6"></i><span>29.9% - 32.9%</span><br>
        <i style="background: #f1eef6"></i><span>23.2% - 29.9%</span><br>
        <i style="background: #f1eef6"></i><span>0% - 23.2%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
  }
  document.querySelector(".healthRiskLegend").innerHTML = legendContent;
}

maps["healthRiskBehaviorsMap"].on("baselayerchange", function (e) {
  updateLegendForHealthRisk(e.name);
});

// Set uninsured layer as the default
updateLegendForHealthRisk("Uninsured");
healthRiskLayers.uninsured.addTo(maps["healthRiskBehaviorsMap"]);

//=========================================================== Health Outcomes Map =================================================================

// Define layer names
var asthmaPrevalence = "Asthma Prevalence";
var highBloodPressure = "High Blood Pressure";
var cancerPrevalence = "Cancer Prevalence (except skin)";
var highCholesterol = "High Cholesterol";
var chronicKidneyDisease = "Chronic Kidney Disease";
var pulmonaryDisease = "Pulmonary Disease";
var heartDisease = "Heart Disease";
var diabetesPrevalence = "Diabetes Prevalence";
var obesityPrevalence = "Obesity Prevalence";
var strokePrevalence = "Stroke Prevalence";

maps["healthOutcomesMap"] = L.map("healthOutcomesMap", {
  maxBounds: bounds,
  maxZoom: 18,
  minZoom: 11,
}).setView([40.65, -73.97], 11);

var baseLayer3 = L.tileLayer(
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
).addTo(maps["healthOutcomesMap"]);

var healthOutcomesLayers = {
  currentAsthma: L.geoJson(null, {
    style: healthOutcomesStyle(
      "Current asthma crude prevalence (%)",
      getColorForCurrentAsthma
    ),
  }),
  highBlood: L.geoJson(null, {
    style: healthOutcomesStyle(
      "High blood pressure crude prevalence (%)",
      getColorForHighBlood
    ),
  }),
  cancerAdults: L.geoJson(null, {
    style: healthOutcomesStyle(
      "Cancer (except skin) crude prevalence (%)",
      getColorForCurrentSmokers
    ),
  }),
  highCholesterol: L.geoJson(null, {
    style: healthOutcomesStyle(
      "Cholesterol screening crude prevalence (%)",
      getColorForCancerAdults
    ),
  }),
  kidneyDisease: L.geoJson(null, {
    style: healthOutcomesStyle(
      "Chronic kidney disease crude prevalence (%)",
      getColorForHighCholesterol
    ),
  }),
  pulmonaryDisease: L.geoJson(null, {
    style: healthOutcomesStyle(
      "Arthritis crude prevalence (%)",
      getColorForPulmonaryDisease
    ),
  }),
  heartDisease: L.geoJson(null, {
    style: healthOutcomesStyle(
      "Coronary heart disease crude prevalence (%)",
      getColorForHeartDisease
    ),
  }),
  diabetes: L.geoJson(null, {
    style: healthOutcomesStyle(
      "Diabetes crude prevalence (%)",
      getColorForDiabetes
    ),
  }),
  obesity: L.geoJson(null, {
    style: healthOutcomesStyle(
      "Obesity crude prevalence (%)",
      getColorForObesity
    ),
  }),
  stroke: L.geoJson(null, {
    style: healthOutcomesStyle(
      "Stroke crude prevalence (%)",
      getColorForStroke
    ),
  }),
};

function healthOutcomesStyle(propertyName, colorFunction) {
  return function (feature) {
    return {
      fillColor: colorFunction(feature.properties[propertyName]),
      weight: 0.5,
      opacity: 1,
      color: "white",
      fillOpacity: 0.8,
    };
  };
}

function getColorForCurrentAsthma(percent) {
  return percent > 16.5
    ? "#91003f"
    : percent > 13.5
    ? "#ce1256"
    : percent > 12.2
    ? "#e7298a"
    : percent > 11
    ? "#df65b0"
    : percent > 9.9
    ? "#c994c7"
    : percent > 8.9
    ? "#d4b9da"
    : percent > 7.4
    ? "#e7e1ef"
    : percent > 0
    ? "#e7e1ef"
    : "#606060";
}

function getColorForHighBlood(percent) {
  return percent > 73.3
    ? "#91003f"
    : percent > 37.6
    ? "#ce1256"
    : percent > 32.7
    ? "#e7298a"
    : percent > 28.5
    ? "#df65b0"
    : percent > 24.4
    ? "#c994c7"
    : percent > 19.3
    ? "#d4b9da"
    : percent > 9
    ? "#e7e1ef"
    : percent > 0
    ? "#e7e1ef"
    : "#606060";
}

function getColorForCancerAdults(percent) {
  return percent > 19.4
    ? "#91003f"
    : percent > 9.4
    ? "#ce1256"
    : percent > 7.2
    ? "#e7298a"
    : percent > 5.9
    ? "#df65b0"
    : percent > 4.9
    ? "#c994c7"
    : percent > 3.9
    ? "#d4b9da"
    : percent > 1.5
    ? "#e7e1ef"
    : percent > 0
    ? "#e7e1ef"
    : "#606060";
}

function getColorForHighCholesterol(percent) {
  return percent > 97.3
    ? "#91003f"
    : percent > 89.7
    ? "#ce1256"
    : percent > 87.2
    ? "#e7298a"
    : percent > 84.5
    ? "#df65b0"
    : percent > 81.4
    ? "#c994c7"
    : percent > 75.9
    ? "#d4b9da"
    : percent > 62.5
    ? "#e7e1ef"
    : percent > 0
    ? "#e7e1ef"
    : "#606060";
}

function getColorForKidneyDisease(percent) {
  return percent > 11.9
    ? "#91003f"
    : percent > 5.1
    ? "#ce1256"
    : percent > 3.8
    ? "#e7298a"
    : percent > 3.2
    ? "#df65b0"
    : percent > 2.7
    ? "#c994c7"
    : percent > 2.1
    ? "#d4b9da"
    : percent > 0.8
    ? "#e7e1ef"
    : percent > 0
    ? "#e7e1ef"
    : "#606060";
}

function getColorForPulmonaryDisease(percent) {
  return percent > 49.4
    ? "#91003f"
    : percent > 27.9
    ? "#ce1256"
    : percent > 22.8
    ? "#e7298a"
    : percent > 20
    ? "#df65b0"
    : percent > 17.3
    ? "#c994c7"
    : percent > 14
    ? "#d4b9da"
    : percent > 6.1
    ? "#e7e1ef"
    : percent > 0
    ? "#e7e1ef"
    : "#606060";
}

function getColorForHeartDisease(percent) {
  return percent > 34
    ? "#91003f"
    : percent > 11.5
    ? "#ce1256"
    : percent > 7.5
    ? "#e7298a"
    : percent > 5.8
    ? "#df65b0"
    : percent > 4.7
    ? "#c994c7"
    : percent > 3.5
    ? "#d4b9da"
    : percent > 1
    ? "#e7e1ef"
    : percent > 0
    ? "#e7e1ef"
    : "#606060";
}

function getColorForDiabetes(percent) {
  return percent > 46.1
    ? "#91003f"
    : percent > 17.7
    ? "#ce1256"
    : percent > 14.4
    ? "#e7298a"
    : percent > 12.1
    ? "#df65b0"
    : percent > 9.8
    ? "#c994c7"
    : percent > 6.9
    ? "#d4b9da"
    : percent > 2
    ? "#e7e1ef"
    : percent > 0
    ? "#e7e1ef"
    : "#606060";
}

function getColorForObesity(percent) {
  return percent > 48.8
    ? "#91003f"
    : percent > 36.6
    ? "#ce1256"
    : percent > 32.2
    ? "#e7298a"
    : percent > 27.9
    ? "#df65b0"
    : percent > 23.6
    ? "#c994c7"
    : percent > 18.9
    ? "#d4b9da"
    : percent > 12.6
    ? "#e7e1ef"
    : percent > 0
    ? "#e7e1ef"
    : "#606060";
}

function getColorForStroke(percent) {
  return percent > 17.4
    ? "#91003f"
    : percent > 6.3
    ? "#ce1256"
    : percent > 4.3
    ? "#e7298a"
    : percent > 3.4
    ? "#df65b0"
    : percent > 2.7
    ? "#c994c7"
    : percent > 1.9
    ? "#d4b9da"
    : percent > 0.6
    ? "#e7e1ef"
    : percent > 0
    ? "#e7e1ef"
    : "#606060";
}

function addHealthOutcomesData(data) {
  data.features.forEach(function (feature) {
    var p = feature.properties;

    var currentAsthmaPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated current asthma crude prevalence is 
    <b>${p["Current asthma crude prevalence (%)"]}%</b> 
    ${p["Current asthma crude prevalence 95% CI"]}.
  `;

    var highBloodPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated high blood pressure crude prevalence is 
    <b>${p["High blood pressure crude prevalence (%)"]}%</b> 
    ${p["High blood pressure crude prevalence 95% CI"]}.
  `;

    var cancerAdultsPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated cancer (except skin) crude prevalence is 
    <b>${p["Cancer (except skin) crude prevalence (%)"]}%</b> 
    ${p["Cancer (except skin) crude prevalence 95% CI"]}.
  `;

    var highCholesterolPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated high cholesterol crude prevalence is 
    <b>${p["High cholesterol crude prevalence (%)"]}%</b> 
    ${p["High cholesterol crude prevalence 95% CI"]}.
  `;

    var kidneyDiseasePopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated chronic kidney disease crude prevalence is 
    <b>${p["Chronic kidney disease crude prevalence (%)"]}%</b> 
    ${p["Chronic kidney disease crude prevalence 95% CI"]}.
  `;

    var pulmonaryDiseasePopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated pulmonary disease crude prevalence is 
    <b>${p["Arthritis crude prevalence (%)"]}%</b> 
    ${p["Arthritis crude prevalence 95% CI"]}.
  `;

    var heartDiseasePopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated heart disease crude prevalence is 
    <b>${p["Coronary heart disease crude prevalence (%)"]}%</b> 
    ${p["Coronary heart disease crude prevalence 95% CI"]}.
  `;

    var diabetesPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated diabetes crude prevalence is 
    <b>${p["Diabetes crude prevalence (%)"]}%</b> 
    ${p["Diabetes crude prevalence 95% CI"]}.
  `;

    var obesityPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated obesity crude prevalence is 
    <b>${p["Obesity crude prevalence (%)"]}%</b> 
    ${p["Obesity crude prevalence 95% CI"]}.
  `;

    var strokePopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated stroke crude prevalence is 
    <b>${p["Stroke crude prevalence (%)"]}%</b> 
    ${p["Stroke crude prevalence 95% CI"]}.
  `;

    var currentAsthmaLayer = L.geoJson(feature, {
      style: healthOutcomesStyle(
        "Current asthma crude prevalence (%)",
        getColorForCurrentAsthma
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(currentAsthmaPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthOutcomesLayers.currentAsthma.addLayer(currentAsthmaLayer);

    var highBloodLayer = L.geoJson(feature, {
      style: healthOutcomesStyle(
        "High blood pressure crude prevalence (%)",
        getColorForHighBlood
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(highBloodPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthOutcomesLayers.highBlood.addLayer(highBloodLayer);

    var cancerAdultsLayer = L.geoJson(feature, {
      style: healthOutcomesStyle(
        "Cancer (except skin) crude prevalence (%)",
        getColorForCancerAdults
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(cancerAdultsPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthOutcomesLayers.cancerAdults.addLayer(cancerAdultsLayer);

    var highCholesterolLayer = L.geoJson(feature, {
      style: healthOutcomesStyle(
        "Cholesterol screening crude prevalence (%)",
        getColorForHighCholesterol
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(highCholesterolPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthOutcomesLayers.highCholesterol.addLayer(highCholesterolLayer);

    var kidneyDiseaseLayer = L.geoJson(feature, {
      style: healthOutcomesStyle(
        "Chronic kidney disease crude prevalence (%)",
        getColorForKidneyDisease
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(kidneyDiseasePopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthOutcomesLayers.kidneyDisease.addLayer(kidneyDiseaseLayer);

    var pulmonaryDiseaseLayer = L.geoJson(feature, {
      style: healthOutcomesStyle(
        "Arthritis crude prevalence (%)",
        getColorForPulmonaryDisease
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(pulmonaryDiseasePopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthOutcomesLayers.pulmonaryDisease.addLayer(pulmonaryDiseaseLayer);

    var heartDiseaseLayer = L.geoJson(feature, {
      style: healthOutcomesStyle(
        "Coronary heart disease crude prevalence (%)",
        getColorForHeartDisease
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(heartDiseasePopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthOutcomesLayers.heartDisease.addLayer(heartDiseaseLayer);

    var diabetesLayer = L.geoJson(feature, {
      style: healthOutcomesStyle(
        "Diabetes crude prevalence (%)",
        getColorForDiabetes
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(diabetesPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthOutcomesLayers.diabetes.addLayer(diabetesLayer);

    var obesityLayer = L.geoJson(feature, {
      style: healthOutcomesStyle(
        "Obesity crude prevalence (%)",
        getColorForObesity
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(obesityPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthOutcomesLayers.obesity.addLayer(obesityLayer);

    var strokeLayer = L.geoJson(feature, {
      style: healthOutcomesStyle(
        "Stroke crude prevalence (%)",
        getColorForStroke
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(strokePopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthOutcomesLayers.stroke.addLayer(strokeLayer);
  });
}

addHealthOutcomesData(healthDataGeojson);

var outcomeBaseLayers = {};
outcomeBaseLayers[asthmaPrevalence] = healthOutcomesLayers.currentAsthma;
outcomeBaseLayers[highBloodPressure] = healthOutcomesLayers.highBlood;
outcomeBaseLayers[cancerPrevalence] = healthOutcomesLayers.cancerAdults;
outcomeBaseLayers[highCholesterol] = healthOutcomesLayers.highCholesterol;
outcomeBaseLayers[chronicKidneyDisease] = healthOutcomesLayers.kidneyDisease;
outcomeBaseLayers[pulmonaryDisease] = healthOutcomesLayers.pulmonaryDisease;
outcomeBaseLayers[heartDisease] = healthOutcomesLayers.heartDisease;
outcomeBaseLayers[diabetesPrevalence] = healthOutcomesLayers.diabetes;
outcomeBaseLayers[obesityPrevalence] = healthOutcomesLayers.obesity;
outcomeBaseLayers[strokePrevalence] = healthOutcomesLayers.stroke;

L.control
  .layers(outcomeBaseLayers, null, { collapsed: false })
  .addTo(maps["healthOutcomesMap"]);

// HEALTH RISK LEGEND CONTROL
// HEALTH RISK LEGEND CONTROL
var healthOutcomesLegend = L.control({ position: "bottomleft" });

healthOutcomesLegend.onAdd = function () {
  var div = L.DomUtil.create("div", "healthOutcomesLegend");
  div.innerHTML = `
    <h4>Asthma Prevalence</h4>
    <i style="background: #91003f"></i><span>> 16.5%</span><br>
    <i style="background: #ce1256"></i><span>13.5% - 16.5%</span><br>
    <i style="background: #e7298a"></i><span>12.2% - 13.5%</span><br>
    <i style="background: #df65b0"></i><span>11% - 12.2%</span><br>
    <i style="background: #c994c7"></i><span>9.9% - 11%</span><br>
    <i style="background: #d4b9da"></i><span>8.9% - 9.9%</span><br>
    <i style="background: #e7e1ef"></i><span>7.4% - 8.9%</span><br>
    <i style="background: #e7e1ef"></i><span>0% - 7.4%</span><br>
    <i style="background: #606060"></i><span>No Data</span><br>
  `;
  return div;
};

healthOutcomesLegend.addTo(maps["healthOutcomesMap"]);

function updateLegendForHealthOutcomes(layerName) {
  var legendContent = "";
  switch (layerName) {
    case asthmaPrevalence:
      legendContent = `
        <h4>Asthma Prevalence</h4>
        <i style="background: #91003f"></i><span>> 16.5%</span><br>
        <i style="background: #ce1256"></i><span>13.5% - 16.5%</span><br>
        <i style="background: #e7298a"></i><span>12.2% - 13.5%</span><br>
        <i style="background: #df65b0"></i><span>11% - 12.2%</span><br>
        <i style="background: #c994c7"></i><span>9.9% - 11%</span><br>
        <i style="background: #d4b9da"></i><span>8.9% - 9.9%</span><br>
        <i style="background: #e7e1ef"></i><span>7.4% - 8.9%</span><br>
        <i style="background: #e7e1ef"></i><span>0% - 7.4%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
    case highBloodPressure:
      legendContent = `
        <h4>High Blood Pressure</h4>
        <i style="background: #91003f"></i><span>> 73.3%</span><br>
        <i style="background: #ce1256"></i><span>37.6% - 73.3%</span><br>
        <i style="background: #e7298a"></i><span>32.7% - 37.6%</span><br>
        <i style="background: #df65b0"></i><span>28.5% - 32.7%</span><br>
        <i style="background: #c994c7"></i><span>24.4% - 28.5%</span><br>
        <i style="background: #d4b9da"></i><span>19.3% - 24.4%</span><br>
        <i style="background: #e7e1ef"></i><span>9% - 19.3%</span><br>
        <i style="background: #e7e1ef"></i><span>0% - 9%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
    case cancerPrevalence:
      legendContent = `
        <h4>Cancer Prevalence (except skin)</h4>
        <i style="background: #91003f"></i><span>> 19.4%</span><br>
        <i style="background: #ce1256"></i><span>9.4% - 19.4%</span><br>
        <i style="background: #e7298a"></i><span>7.2% - 9.4%</span><br>
        <i style="background: #df65b0"></i><span>5.9% - 7.2%</span><br>
        <i style="background: #c994c7"></i><span>4.9% - 5.9%</span><br>
        <i style="background: #d4b9da"></i><span>3.9% - 4.9%</span><br>
        <i style="background: #e7e1ef"></i><span>1.5% - 3.9%</span><br>
        <i style="background: #e7e1ef"></i><span>0% - 1.5%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
    case highCholesterol:
      legendContent = `
        <h4>High Cholesterol</h4>
        <i style="background: #91003f"></i><span>> 97.3%</span><br>
        <i style="background: #ce1256"></i><span>89.7% - 97.3%</span><br>
        <i style="background: #e7298a"></i><span>87.2% - 89.7%</span><br>
        <i style="background: #df65b0"></i><span>84.5% - 87.2%</span><br>
        <i style="background: #c994c7"></i><span>81.4% - 84.5%</span><br>
        <i style="background: #d4b9da"></i><span>75.9% - 81.4%</span><br>
        <i style="background: #e7e1ef"></i><span>62.5% - 75.9%</span><br>
        <i style="background: #e7e1ef"></i><span>0% - 62.5%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
    case chronicKidneyDisease:
      legendContent = `
        <h4>Chronic Kidney Disease</h4>
        <i style="background: #91003f"></i><span>> 11.9%</span><br>
        <i style="background: #ce1256"></i><span>5.1% - 11.9%</span><br>
        <i style="background: #e7298a"></i><span>3.8% - 5.1%</span><br>
        <i style="background: #df65b0"></i><span>3.2% - 3.8%</span><br>
        <i style="background: #c994c7"></i><span>2.7% - 3.2%</span><br>
        <i style="background: #d4b9da"></i><span>2.1% - 2.7%</span><br>
        <i style="background: #e7e1ef"></i><span>0.8% - 2.1%</span><br>
        <i style="background: #e7e1ef"></i><span>0% - 0.8%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
    case pulmonaryDisease:
      legendContent = `
        <h4>Pulmonary Disease</h4>
        <i style="background: #91003f"></i><span>> 49.4%</span><br>
        <i style="background: #ce1256"></i><span>27.9% - 49.4%</span><br>
        <i style="background: #e7298a"></i><span>22.8% - 27.9%</span><br>
        <i style="background: #df65b0"></i><span>20% - 22.8%</span><br>
        <i style="background: #c994c7"></i><span>17.3% - 20%</span><br>
        <i style="background: #d4b9da"></i><span>14% - 17.3%</span><br>
        <i style="background: #e7e1ef"></i><span>6.1% - 14%</span><br>
        <i style="background: #e7e1ef"></i><span>0% - 6.1%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
    case heartDisease:
      legendContent = `
        <h4>Heart Disease</h4>
        <i style="background: #91003f"></i><span>> 34%</span><br>
        <i style="background: #ce1256"></i><span>11.5% - 34%</span><br>
        <i style="background: #e7298a"></i><span>7.5% - 11.5%</span><br>
        <i style="background: #df65b0"></i><span>5.8% - 7.5%</span><br>
        <i style="background: #c994c7"></i><span>4.7% - 5.8%</span><br>
        <i style="background: #d4b9da"></i><span>3.5% - 4.7%</span><br>
        <i style="background: #e7e1ef"></i><span>1% - 3.5%</span><br>
        <i style="background: #e7e1ef"></i><span>0% - 1%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
    case diabetesPrevalence:
      legendContent = `
        <h4>Diabetes Prevalence</h4>
        <i style="background: #91003f"></i><span>> 46.1%</span><br>
        <i style="background: #ce1256"></i><span>17.7% - 46.1%</span><br>
        <i style="background: #e7298a"></i><span>14.4% - 17.7%</span><br>
        <i style="background: #df65b0"></i><span>12.1% - 14.4%</span><br>
        <i style="background: #c994c7"></i><span>9.8% - 12.1%</span><br>
        <i style="background: #d4b9da"></i><span>6.9% - 9.8%</span><br>
        <i style="background: #e7e1ef"></i><span>2% - 6.9%</span><br>
        <i style="background: #e7e1ef"></i><span>0% - 2%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
    case obesityPrevalence:
      legendContent = `
        <h4>Obesity Prevalence</h4>
        <i style="background: #91003f"></i><span>> 48.8%</span><br>
        <i style="background: #ce1256"></i><span>36.6% - 48.8%</span><br>
        <i style="background: #e7298a"></i><span>32.2% - 36.6%</span><br>
        <i style="background: #df65b0"></i><span>27.9% - 32.2%</span><br>
        <i style="background: #c994c7"></i><span>23.6% - 27.9%</span><br>
        <i style="background: #d4b9da"></i><span>18.9% - 23.6%</span><br>
        <i style="background: #e7e1ef"></i><span>12.6% - 18.9%</span><br>
        <i style="background: #e7e1ef"></i><span>0% - 12.6%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
    case strokePrevalence:
      legendContent = `
        <h4>Stroke Prevalence</h4>
        <i style="background: #91003f"></i><span>> 17.4%</span><br>
        <i style="background: #ce1256"></i><span>6.3% - 17.4%</span><br>
        <i style="background: #e7298a"></i><span>4.3% - 6.3%</span><br>
        <i style="background: #df65b0"></i><span>3.4% - 4.3%</span><br>
        <i style="background: #c994c7"></i><span>2.7% - 3.4%</span><br>
        <i style="background: #d4b9da"></i><span>1.9% - 2.7%</span><br>
        <i style="background: #e7e1ef"></i><span>0.6% - 1.9%</span><br>
        <i style="background: #e7e1ef"></i><span>0% - 0.6%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
  }
  document.querySelector(".healthOutcomesLegend").innerHTML = legendContent;
}

maps["healthOutcomesMap"].on("baselayerchange", function (e) {
  updateLegendForHealthOutcomes(e.name);
});

// Set currentAsthma layer as the default
updateLegendForHealthOutcomes(asthmaPrevalence);
healthOutcomesLayers.currentAsthma.addTo(maps["healthOutcomesMap"]);

//=========================================================== Screening Rates Map =================================================================

maps["screeningRatesMap"] = L.map("screeningRatesMap", {
  maxBounds: bounds,
  maxZoom: 18,
  minZoom: 11,
}).setView([40.65, -73.97], 11);

var baseLayer4 = L.tileLayer(
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
).addTo(maps["screeningRatesMap"]);

var screeningRatesLayers = {
  annualCheckUp: L.geoJson(null, {
    style: screeningRatesStyle(
      "Annual checkup crude prevalence (%)",
      getColorForAnnualCheckUp
    ),
  }),
  dentalVisit: L.geoJson(null, {
    style: screeningRatesStyle(
      "Dental visit crude prevalence (%)",
      getColorForDentalVisit
    ),
  }),
  cholesterolScreening: L.geoJson(null, {
    style: screeningRatesStyle(
      "Cholesterol screening crude prevalence (%)",
      getColorForCholesterolScreening
    ),
  }),
  mammographyScreening: L.geoJson(null, {
    style: screeningRatesStyle(
      "Mammography use crude prevalence (%)",
      getColorForMammographyScreening
    ),
  }),
  cervicalScreening: L.geoJson(null, {
    style: screeningRatesStyle(
      "Cervical cancer screening crude prevalence (%)",
      getColorForCervicalScreening
    ),
  }),
  colorectalScreening: L.geoJson(null, {
    style: screeningRatesStyle(
      "Colorectal cancer screening crude prevalence (%)",
      getColorForColorectalScreening
    ),
  }),
};

function screeningRatesStyle(propertyName, colorFunction) {
  return function (feature) {
    return {
      fillColor: colorFunction(feature.properties[propertyName]),
      weight: 0.5,
      opacity: 1,
      color: "white",
      fillOpacity: 0.8,
    };
  };
}

function getColorForAnnualCheckUp(percent) {
  return percent > 91.3
    ? "#6e016b"
    : percent > 81.5
    ? "#88419d"
    : percent > 78.7
    ? "#8c6bb1"
    : percent > 76.5
    ? "#8c96c6"
    : percent > 74.4
    ? "#9ebcda"
    : percent > 71.7
    ? "#bfd3e6"
    : percent > 66.1
    ? "#edf8fb"
    : percent > 0
    ? "#edf8fb"
    : "#606060";
}

function getColorForDentalVisit(percent) {
  return percent > 82.9
    ? "#6e016b"
    : percent > 72.1
    ? "#88419d"
    : percent > 64.8
    ? "#8c6bb1"
    : percent > 58.5
    ? "#8c96c6"
    : percent > 52.2
    ? "#9ebcda"
    : percent > 45
    ? "#bfd3e6"
    : percent > 23.3
    ? "#edf8fb"
    : percent > 0
    ? "#edf8fb"
    : "#606060";
}

function getColorForCholesterolScreening(percent) {
  return percent > 97.3
    ? "#6e016b"
    : percent > 89.7
    ? "#88419d"
    : percent > 87.2
    ? "#8c6bb1"
    : percent > 84.5
    ? "#8c96c6"
    : percent > 81.4
    ? "#9ebcda"
    : percent > 75.9
    ? "#bfd3e6"
    : percent > 62.5
    ? "#edf8fb"
    : percent > 0
    ? "#edf8fb"
    : "#606060";
}

function getColorForMammographyScreening(percent) {
  return percent > 86.3
    ? "#6e016b"
    : percent > 83.1
    ? "#88419d"
    : percent > 81.1
    ? "#8c6bb1"
    : percent > 79.4
    ? "#8c96c6"
    : percent > 77.8
    ? "#9ebcda"
    : percent > 75.2
    ? "#bfd3e6"
    : percent > 69.5
    ? "#edf8fb"
    : percent > 0
    ? "#edf8fb"
    : "#606060";
}

function getColorForCervicalScreening(percent) {
  return percent > 91.4
    ? "#6e016b"
    : percent > 86.2
    ? "#88419d"
    : percent > 83
    ? "#8c6bb1"
    : percent > 79.7
    ? "#8c96c6"
    : percent > 75.8
    ? "#9ebcda"
    : percent > 69.4
    ? "#bfd3e6"
    : percent > 51.6
    ? "#edf8fb"
    : percent > 0
    ? "#edf8fb"
    : "#606060";
}

function getColorForColorectalScreening(percent) {
  return percent > 85.1
    ? "#6e016b"
    : percent > 79.4
    ? "#88419d"
    : percent > 76
    ? "#8c6bb1"
    : percent > 72.7
    ? "#8c96c6"
    : percent > 69.2
    ? "#9ebcda"
    : percent > 64.8
    ? "#bfd3e6"
    : percent > 53.9
    ? "#edf8fb"
    : percent > 0
    ? "#edf8fb"
    : "#606060";
}

function addScreeningRatesData(data) {
  data.features.forEach(function (feature) {
    var p = feature.properties;

    var annualCheckUpPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated annual checkup crude prevalence is 
    <b>${p["Annual checkup crude prevalence (%)"]}%</b> 
    ${p["Annual checkup crude prevalence 95% CI"]}.
  `;

    var dentalVisitPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated dental visit crude prevalence is 
    <b>${p["Dental visit crude prevalence (%)"]}%</b> 
    ${p["Dental visit crude prevalence 95% CI"]}.
  `;

    var cholesterolScreeningPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated cholesterol screening crude prevalence is 
    <b>${p["Cholesterol screening crude prevalence (%)"]}%</b> 
    ${p["Cholesterol screening crude prevalence 95% CI"]}.
  `;

    var mammographyScreeningPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated mammography screening crude prevalence is 
    <b>${p["Mammography use crude prevalence (%)"]}%</b> 
    ${p["Mammography use crude prevalence 95% CI"]}.
  `;

    var cervicalScreeningPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated cervical screening crude prevalence is 
    <b>${p["Cervical cancer screening crude prevalence (%)"]}%</b> 
    ${p["Cervical cancer screening crude prevalence 95% CI"]}.
  `;

    var colorectalScreeningPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated colorectal screening crude prevalence is 
    <b>${p["Colorectal cancer screening crude prevalence (%)"]}%</b> 
    ${p["Colorectal cancer screening crude prevalence 95% CI"]}.
  `;

    var annualCheckUpLayer = L.geoJson(feature, {
      style: screeningRatesStyle(
        "Annual checkup crude prevalence (%)",
        getColorForAnnualCheckUp
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(annualCheckUpPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    screeningRatesLayers.annualCheckUp.addLayer(annualCheckUpLayer);

    var dentalVisitLayer = L.geoJson(feature, {
      style: screeningRatesStyle(
        "Dental visit crude prevalence (%)",
        getColorForDentalVisit
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(dentalVisitPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    screeningRatesLayers.dentalVisit.addLayer(dentalVisitLayer);

    var cholesterolScreeningLayer = L.geoJson(feature, {
      style: screeningRatesStyle(
        "Cholesterol screening crude prevalence (%)",
        getColorForCholesterolScreening
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(cholesterolScreeningPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    screeningRatesLayers.cholesterolScreening.addLayer(
      cholesterolScreeningLayer
    );

    var mammographyScreeningLayer = L.geoJson(feature, {
      style: screeningRatesStyle(
        "Mammography use crude prevalence (%)",
        getColorForMammographyScreening
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(mammographyScreeningPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    screeningRatesLayers.mammographyScreening.addLayer(
      mammographyScreeningLayer
    );

    var cervicalScreeningLayer = L.geoJson(feature, {
      style: screeningRatesStyle(
        "Cervical cancer screening crude prevalence (%)",
        getColorForCervicalScreening
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(cervicalScreeningPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    screeningRatesLayers.cervicalScreening.addLayer(cervicalScreeningLayer);

    var colorectalScreeningLayer = L.geoJson(feature, {
      style: screeningRatesStyle(
        "Colorectal cancer screening crude prevalence (%)",
        getColorForColorectalScreening
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(colorectalScreeningPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    screeningRatesLayers.colorectalScreening.addLayer(colorectalScreeningLayer);
  });
}

addScreeningRatesData(healthDataGeojson);

var screeningBaseLayers = {
  "Annual Checkup": screeningRatesLayers.annualCheckUp,
  "Dental Visit": screeningRatesLayers.dentalVisit,
  "Cholesterol Screening": screeningRatesLayers.cholesterolScreening,
  "Mammography Screening": screeningRatesLayers.mammographyScreening,
  "Cervical Screening": screeningRatesLayers.cervicalScreening,
  "Colorectal Screening": screeningRatesLayers.colorectalScreening,
};

L.control
  .layers(screeningBaseLayers, null, { collapsed: false })
  .addTo(maps["screeningRatesMap"]);

// SCREENING RATES LEGEND CONTROL
var screeningRatesLegend = L.control({ position: "bottomleft" });

screeningRatesLegend.onAdd = function () {
  var div = L.DomUtil.create("div", "screeningRatesLegend");
  div.innerHTML = `
    <h4>Percent Annual Checkup</h4>
    <i style="background: #6e016b"></i><span>> 91.3%</span><br>
    <i style="background: #88419d"></i><span>81.5% - 91.3%</span><br>
    <i style="background: #8c6bb1"></i><span>78.7% - 81.5%</span><br>
    <i style="background: #8c96c6"></i><span>76.5% - 78.7%</span><br>
    <i style="background: #9ebcda"></i><span>74.4% - 76.5%</span><br>
    <i style="background: #bfd3e6"></i><span>71.7% - 74.4%</span><br>
    <i style="background: #edf8fb"></i><span>66.1% - 71.7%</span><br>
    <i style="background: #edf8fb"></i><span>0% - 66.1%</span><br>
    <i style="background: #606060"></i><span>No Data</span><br>
  `;
  return div;
};

screeningRatesLegend.addTo(maps["screeningRatesMap"]);

function updateLegendForScreeningRates(layerName) {
  var legendContent = "";
  switch (layerName) {
    case "Annual Checkup":
      legendContent = `
        <h4>Percent Annual Checkup</h4>
        <i style="background: #6e016b"></i><span>> 91.3%</span><br>
        <i style="background: #88419d"></i><span>81.5% - 91.3%</span><br>
        <i style="background: #8c6bb1"></i><span>78.7% - 81.5%</span><br>
        <i style="background: #8c96c6"></i><span>76.5% - 78.7%</span><br>
        <i style="background: #9ebcda"></i><span>74.4% - 76.5%</span><br>
        <i style="background: #bfd3e6"></i><span>71.7% - 74.4%</span><br>
        <i style="background: #edf8fb"></i><span>66.1% - 71.7%</span><br>
        <i style="background: #edf8fb"></i><span>0% - 66.1%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
    case "Dental Visit":
      legendContent = `
        <h4>Percent Dental Visit</h4>
        <i style="background: #6e016b"></i><span>> 82.9%</span><br>
        <i style="background: #88419d"></i><span>72.1% - 82.9%</span><br>
        <i style="background: #8c6bb1"></i><span>64.8% - 72.1%</span><br>
        <i style="background: #8c96c6"></i><span>58.5% - 64.8%</span><br>
        <i style="background: #9ebcda"></i><span>52.2% - 58.5%</span><br>
        <i style="background: #bfd3e6"></i><span>45% - 52.2%</span><br>
        <i style="background: #edf8fb"></i><span>23.3% - 45%</span><br>
        <i style="background: #edf8fb"></i><span>0% - 23.3%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
    case "Cholesterol Screening":
      legendContent = `
        <h4>Percent Cholesterol Screening</h4>
        <i style="background: #6e016b"></i><span>> 97.3%</span><br>
        <i style="background: #88419d"></i><span>89.7% - 97.3%</span><br>
        <i style="background: #8c6bb1"></i><span>87.2% - 89.7%</span><br>
        <i style="background: #8c96c6"></i><span>84.5% - 87.2%</span><br>
        <i style="background: #9ebcda"></i><span>81.4% - 84.5%</span><br>
        <i style="background: #bfd3e6"></i><span>75.9% - 81.4%</span><br>
        <i style="background: #edf8fb"></i><span>62.5% - 75.9%</span><br>
        <i style="background: #edf8fb"></i><span>0% - 62.5%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
    case "Mammography Screening":
      legendContent = `
        <h4>Percent Mammography Screening</h4>
        <i style="background: #6e016b"></i><span>> 86.3%</span><br>
        <i style="background: #88419d"></i><span>83.1% - 86.3%</span><br>
        <i style="background: #8c6bb1"></i><span>81.1% - 83.1%</span><br>
        <i style="background: #8c96c6"></i><span>79.4% - 81.1%</span><br>
        <i style="background: #9ebcda"></i><span>77.8% - 79.4%</span><br>
        <i style="background: #bfd3e6"></i><span>75.2% - 77.8%</span><br>
        <i style="background: #edf8fb"></i><span>69.5% - 75.2%</span><br>
        <i style="background: #edf8fb"></i><span>0% - 69.5%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
    case "Cervical Screening":
      legendContent = `
        <h4>Percent Cervical Screening</h4>
        <i style="background: #6e016b"></i><span>> 91.4%</span><br>
        <i style="background: #88419d"></i><span>86.2% - 91.4%</span><br>
        <i style="background: #8c6bb1"></i><span>83% - 86.2%</span><br>
        <i style="background: #8c96c6"></i><span>79.7% - 83%</span><br>
        <i style="background: #9ebcda"></i><span>75.8% - 79.7%</span><br>
        <i style="background: #bfd3e6"></i><span>69.4% - 75.8%</span><br>
        <i style="background: #edf8fb"></i><span>51.6% - 69.4%</span><br>
        <i style="background: #edf8fb"></i><span>0% - 51.6%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
    case "Colorectal Screening":
      legendContent = `
        <h4>Percent Colorectal Screening</h4>
        <i style="background: #6e016b"></i><span>> 85.1%</span><br>
        <i style="background: #88419d"></i><span>79.4% - 85.1%</span><br>
        <i style="background: #8c6bb1"></i><span>76% - 79.4%</span><br>
        <i style="background: #8c96c6"></i><span>72.7% - 76%</span><br>
        <i style="background: #9ebcda"></i><span>69.2% - 72.7%</span><br>
        <i style="background: #bfd3e6"></i><span>64.8% - 69.2%</span><br>
        <i style="background: #edf8fb"></i><span>53.9% - 64.8%</span><br>
        <i style="background: #edf8fb"></i><span>0% - 53.9%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
  }
  document.querySelector(".screeningRatesLegend").innerHTML = legendContent;
}

maps["screeningRatesMap"].on("baselayerchange", function (e) {
  updateLegendForScreeningRates(e.name);
});

// Set annualCheckUp layer as the default
updateLegendForScreeningRates("Annual Checkup");
screeningRatesLayers.annualCheckUp.addTo(maps["screeningRatesMap"]);

//=========================================================== Health Status Map =================================================================

// Map setup
maps["healthStatusMap"] = L.map("healthStatusMap", {
  maxBounds: bounds,
  maxZoom: 18,
  minZoom: 11,
}).setView([40.65, -73.97], 11);

var baseLayer5 = L.tileLayer(
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
).addTo(maps["healthStatusMap"]);

// Define health status layers
var healthStatusLayers = {};
Object.values(healthStatusLayerNames).forEach((layerName) => {
  healthStatusLayers[layerName] = L.geoJson(null, {
    style: healthStatusStyle(layerName, getColorHealthStatus(layerName)),
  });
});

function healthStatusStyle(propertyName, colorFunction) {
  return function (feature) {
    return {
      fillColor: colorFunction(feature.properties[propertyName]),
      weight: 0.5,
      opacity: 1,
      color: "white",
      fillOpacity: 0.8,
    };
  };
}

// Color functions
function getColorHealthStatus(layerName) {
  switch (layerName) {
    case healthStatusLayerNames.DEPRESSION:
      return getColorForDepression;
    case healthStatusLayerNames.MENTAL_HEALTH_BAD:
      return getColorForMentalHealthBad;
    case healthStatusLayerNames.PHYSICAL_HEALTH_BAD:
      return getColorForPhysicalHealthBad;
    case healthStatusLayerNames.POOR_SELF_RATED_HEALTH:
      return getColorForPoorSelfRatedHealth;
    case healthStatusLayerNames.DISABILITY:
      return getColorForDisability;
    case healthStatusLayerNames.HEARING_DISABILITY:
      return getColorForHearingDisability;
    case healthStatusLayerNames.VISION_DISABILITY:
      return getColorForVisionDisability;
    case healthStatusLayerNames.COGNITIVE_DISABILITY:
      return getColorForCognitiveDisability;
    case healthStatusLayerNames.MOBILITY_DISABILITY:
      return getColorForMobilityDisability;
    case healthStatusLayerNames.SELF_CARE_DISABILITY:
      return getColorForSelfCareDisability;
    case healthStatusLayerNames.INDEPENDENT_LIVING_DISABILITY:
      return getColorForIndependentLivingDisability;
    default:
      return () => "#606060"; // Default color if no match found
  }
}

// Color functions implementations
function getColorForDepression(percent) {
  return percent > 32.4
    ? healthStatusColors[0]
    : percent > 23.2
    ? healthStatusColors[1]
    : percent > 20.6
    ? healthStatusColors[2]
    : percent > 18.8
    ? healthStatusColors[3]
    : percent > 17.1
    ? healthStatusColors[4]
    : percent > 15.2
    ? healthStatusColors[5]
    : percent > 11.8
    ? healthStatusColors[6]
    : percent > 0
    ? healthStatusColors[7]
    : healthStatusColors[8];
}

function getColorForMentalHealthBad(percent) {
  return percent > 31
    ? healthStatusColors[0]
    : percent > 22.1
    ? healthStatusColors[1]
    : percent > 18.8
    ? healthStatusColors[2]
    : percent > 16.5
    ? healthStatusColors[3]
    : percent > 14.6
    ? healthStatusColors[4]
    : percent > 12.7
    ? healthStatusColors[5]
    : percent > 7.2
    ? healthStatusColors[6]
    : percent > 0
    ? healthStatusColors[7]
    : healthStatusColors[8];
}

function getColorForPhysicalHealthBad(percent) {
  return percent > 31.3
    ? healthStatusColors[0]
    : percent > 17
    ? healthStatusColors[1]
    : percent > 13.9
    ? healthStatusColors[2]
    : percent > 11.6
    ? healthStatusColors[3]
    : percent > 9.7
    ? healthStatusColors[4]
    : percent > 7.5
    ? healthStatusColors[5]
    : percent > 3.8
    ? healthStatusColors[6]
    : percent > 0
    ? healthStatusColors[7]
    : healthStatusColors[8];
}

function getColorForPoorSelfRatedHealth(percent) {
  return percent > 57.1
    ? healthStatusColors[0]
    : percent > 29.7
    ? healthStatusColors[1]
    : percent > 23.1
    ? healthStatusColors[2]
    : percent > 18.3
    ? healthStatusColors[3]
    : percent > 14.3
    ? healthStatusColors[4]
    : percent > 10.1
    ? healthStatusColors[5]
    : percent > 4.3
    ? healthStatusColors[6]
    : percent > 0
    ? healthStatusColors[7]
    : healthStatusColors[8];
}

function getColorForDisability(percent) {
  return percent > 70.5
    ? healthStatusColors[0]
    : percent > 40.8
    ? healthStatusColors[1]
    : percent > 33.9
    ? healthStatusColors[2]
    : percent > 28.8
    ? healthStatusColors[3]
    : percent > 24.5
    ? healthStatusColors[4]
    : percent > 19.5
    ? healthStatusColors[5]
    : percent > 11.3
    ? healthStatusColors[6]
    : percent > 0
    ? healthStatusColors[7]
    : healthStatusColors[8];
}

function getColorForHearingDisability(percent) {
  return percent > 29.7
    ? healthStatusColors[0]
    : percent > 11.6
    ? healthStatusColors[1]
    : percent > 7.9
    ? healthStatusColors[2]
    : percent > 6.2
    ? healthStatusColors[3]
    : percent > 5.1
    ? healthStatusColors[4]
    : percent > 4
    ? healthStatusColors[5]
    : percent > 1.7
    ? healthStatusColors[6]
    : percent > 0
    ? healthStatusColors[7]
    : healthStatusColors[8];
}

function getColorForVisionDisability(percent) {
  return percent > 33.9
    ? healthStatusColors[0]
    : percent > 14.2
    ? healthStatusColors[1]
    : percent > 10.4
    ? healthStatusColors[2]
    : percent > 7.8
    ? healthStatusColors[3]
    : percent > 5.7
    ? healthStatusColors[4]
    : percent > 3.8
    ? healthStatusColors[5]
    : percent > 1.4
    ? healthStatusColors[6]
    : percent > 0
    ? healthStatusColors[7]
    : healthStatusColors[8];
}

function getColorForCognitiveDisability(percent) {
  return percent > 30.7
    ? healthStatusColors[0]
    : percent > 21.5
    ? healthStatusColors[1]
    : percent > 17.5
    ? healthStatusColors[2]
    : percent > 14.2
    ? healthStatusColors[3]
    : percent > 11.6
    ? healthStatusColors[4]
    : percent > 9
    ? healthStatusColors[5]
    : percent > 5.5
    ? healthStatusColors[6]
    : percent > 0
    ? healthStatusColors[7]
    : healthStatusColors[8];
}

function getColorForMobilityDisability(percent) {
  return percent > 56.9
    ? healthStatusColors[0]
    : percent > 24
    ? healthStatusColors[1]
    : percent > 18.6
    ? healthStatusColors[2]
    : percent > 15.1
    ? healthStatusColors[3]
    : percent > 12.1
    ? healthStatusColors[4]
    : percent > 8.5
    ? healthStatusColors[5]
    : percent > 2.5
    ? healthStatusColors[6]
    : percent > 0
    ? healthStatusColors[7]
    : healthStatusColors[8];
}

function getColorForSelfCareDisability(percent) {
  return percent > 28.2
    ? healthStatusColors[0]
    : percent > 9.9
    ? healthStatusColors[1]
    : percent > 7.1
    ? healthStatusColors[2]
    : percent > 5.2
    ? healthStatusColors[3]
    : percent > 3.8
    ? healthStatusColors[4]
    : percent > 2.5
    ? healthStatusColors[5]
    : percent > 0.8
    ? healthStatusColors[6]
    : percent > 0
    ? healthStatusColors[7]
    : healthStatusColors[8];
}

function getColorForIndependentLivingDisability(percent) {
  return percent > 31.8
    ? healthStatusColors[0]
    : percent > 16.6
    ? healthStatusColors[1]
    : percent > 12.6
    ? healthStatusColors[2]
    : percent > 9.8
    ? healthStatusColors[3]
    : percent > 7.6
    ? healthStatusColors[4]
    : percent > 5.5
    ? healthStatusColors[5]
    : percent > 2.8
    ? healthStatusColors[6]
    : percent > 0
    ? healthStatusColors[7]
    : healthStatusColors[8];
}

function addHealthStatusData(data) {
  data.features.forEach(function (feature) {
    var p = feature.properties;

    var depressionPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated depression crude prevalence is 
    <b>${p["Depression crude prevalence (%)"]}%</b> 
    ${p["Depression crude prevalence 95% CI"]}.
  `;

    var mentalHealthBadPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated frequent mental health distress crude prevalence is 
    <b>${p["Frequent mental health distress crude prevalence (%)"]}%</b> 
    ${p["Frequent mental health distress crude prevalence 95% CI"]}.
  `;

    var physicalHealthBadPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated frequent physical health distress crude prevalence is 
    <b>${p["Frequent physical health distress crude prevalence (%)"]}%</b> 
    ${p["Frequent physical health distress crude prevalence 95% CI"]}.
  `;

    var poorSelfRatedHealthPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated fair or poor health crude prevalence is 
    <b>${p["Fair or poor health crude prevalence (%)"]}%</b> 
    ${p["Fair or poor health crude prevalence 95% CI"]}.
  `;

    var disabilityPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated any disability crude prevalence is 
    <b>${p["Any disability crude prevalence (%)"]}%</b> 
    ${p["Any disability crude prevalence 95% CI"]}.
  `;

    var depressionLayer = L.geoJson(feature, {
      style: healthStatusStyle(
        "Depression crude prevalence (%)",
        getColorForDepression
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(depressionPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthStatusLayers[healthStatusLayerNames.DEPRESSION].addLayer(
      depressionLayer
    );

    var mentalHealthBadLayer = L.geoJson(feature, {
      style: healthStatusStyle(
        "Frequent mental health distress crude prevalence (%)",
        getColorForMentalHealthBad
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(mentalHealthBadPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthStatusLayers[healthStatusLayerNames.MENTAL_HEALTH_BAD].addLayer(
      mentalHealthBadLayer
    );

    var physicalHealthBadLayer = L.geoJson(feature, {
      style: healthStatusStyle(
        "Frequent physical health distress crude prevalence (%)",
        getColorForPhysicalHealthBad
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(physicalHealthBadPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthStatusLayers[healthStatusLayerNames.PHYSICAL_HEALTH_BAD].addLayer(
      physicalHealthBadLayer
    );

    var poorSelfRatedHealthLayer = L.geoJson(feature, {
      style: healthStatusStyle(
        "Fair or poor health crude prevalence (%)",
        getColorForPoorSelfRatedHealth
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(poorSelfRatedHealthPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthStatusLayers[healthStatusLayerNames.POOR_SELF_RATED_HEALTH].addLayer(
      poorSelfRatedHealthLayer
    );

    var disabilityLayer = L.geoJson(feature, {
      style: healthStatusStyle(
        "Any disability crude prevalence (%)",
        getColorForDisability
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(disabilityPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthStatusLayers[healthStatusLayerNames.DISABILITY].addLayer(
      disabilityLayer
    );
  });
}

addHealthStatusData(healthDataGeojson);

var healthStatusBaseLayers = {
  [healthStatusLayerNames.DEPRESSION]:
    healthStatusLayers[healthStatusLayerNames.DEPRESSION],
  [healthStatusLayerNames.MENTAL_HEALTH_BAD]:
    healthStatusLayers[healthStatusLayerNames.MENTAL_HEALTH_BAD],
  [healthStatusLayerNames.PHYSICAL_HEALTH_BAD]:
    healthStatusLayers[healthStatusLayerNames.PHYSICAL_HEALTH_BAD],
  [healthStatusLayerNames.POOR_SELF_RATED_HEALTH]:
    healthStatusLayers[healthStatusLayerNames.POOR_SELF_RATED_HEALTH],
  [healthStatusLayerNames.DISABILITY]:
    healthStatusLayers[healthStatusLayerNames.DISABILITY],
};

L.control
  .layers(healthStatusBaseLayers, null, { collapsed: false })
  .addTo(maps["healthStatusMap"]);

// HEALTH STATUS LEGEND CONTROL
var healthStatusLegend = L.control({ position: "bottomleft" });

healthStatusLegend.onAdd = function () {
  var div = L.DomUtil.create("div", "healthStatusLegend");
  div.innerHTML = `
    <h4>${healthStatusLayerNames.DEPRESSION}</h4>
    <i style="background: ${healthStatusColors[0]}"></i><span>> 32.4%</span><br>
    <i style="background: ${healthStatusColors[1]}"></i><span>23.2% - 32.4%</span><br>
    <i style="background: ${healthStatusColors[2]}"></i><span>20.6% - 23.2%</span><br>
    <i style="background: ${healthStatusColors[3]}"></i><span>18.8% - 20.6%</span><br>
    <i style="background: ${healthStatusColors[4]}"></i><span>17.1% - 18.8%</span><br>
    <i style="background: ${healthStatusColors[5]}"></i><span>15.2% - 17.1%</span><br>
    <i style="background: ${healthStatusColors[6]}"></i><span>11.8% - 15.2%</span><br>
    <i style="background: ${healthStatusColors[7]}"></i><span>0% - 11.8%</span><br>
    <i style="background: ${healthStatusColors[8]}"></i><span>No Data</span><br>
  `;
  return div;
};

healthStatusLegend.addTo(maps["healthStatusMap"]);

function updateLegendForHealthStatus(layerName) {
  var legendContent = "";
  switch (layerName) {
    case healthStatusLayerNames.DEPRESSION:
      legendContent = `
        <h4>${healthStatusLayerNames.DEPRESSION}</h4>
        <i style="background: ${healthStatusColors[0]}"></i><span>> 32.4%</span><br>
        <i style="background: ${healthStatusColors[1]}"></i><span>23.2% - 32.4%</span><br>
        <i style="background: ${healthStatusColors[2]}"></i><span>20.6% - 23.2%</span><br>
        <i style="background: ${healthStatusColors[3]}"></i><span>18.8% - 20.6%</span><br>
        <i style="background: ${healthStatusColors[4]}"></i><span>17.1% - 18.8%</span><br>
        <i style="background: ${healthStatusColors[5]}"></i><span>15.2% - 17.1%</span><br>
        <i style="background: ${healthStatusColors[6]}"></i><span>11.8% - 15.2%</span><br>
        <i style="background: ${healthStatusColors[7]}"></i><span>0% - 11.8%</span><br>
        <i style="background: ${healthStatusColors[8]}"></i><span>No Data</span><br>
      `;
      break;
    case healthStatusLayerNames.MENTAL_HEALTH_BAD:
      legendContent = `
        <h4>${healthStatusLayerNames.MENTAL_HEALTH_BAD}</h4>
        <i style="background: ${healthStatusColors[0]}"></i><span>> 31%</span><br>
        <i style="background: ${healthStatusColors[1]}"></i><span>22.1% - 31%</span><br>
        <i style="background: ${healthStatusColors[2]}"></i><span>18.8% - 22.1%</span><br>
        <i style="background: ${healthStatusColors[3]}"></i><span>16.5% - 18.8%</span><br>
        <i style="background: ${healthStatusColors[4]}"></i><span>14.6% - 16.5%</span><br>
        <i style="background: ${healthStatusColors[5]}"></i><span>12.7% - 14.6%</span><br>
        <i style="background: ${healthStatusColors[6]}"></i><span>7.2% - 12.7%</span><br>
        <i style="background: ${healthStatusColors[7]}"></i><span>0% - 7.2%</span><br>
        <i style="background: ${healthStatusColors[8]}"></i><span>No Data</span><br>
      `;
      break;
    case healthStatusLayerNames.PHYSICAL_HEALTH_BAD:
      legendContent = `
        <h4>${healthStatusLayerNames.PHYSICAL_HEALTH_BAD}</h4>
        <i style="background: ${healthStatusColors[0]}"></i><span>> 31.3%</span><br>
        <i style="background: ${healthStatusColors[1]}"></i><span>17% - 31.3%</span><br>
        <i style="background: ${healthStatusColors[2]}"></i><span>13.9% - 17%</span><br>
        <i style="background: ${healthStatusColors[3]}"></i><span>11.6% - 13.9%</span><br>
        <i style="background: ${healthStatusColors[4]}"></i><span>9.7% - 11.6%</span><br>
        <i style="background: ${healthStatusColors[5]}"></i><span>7.5% - 9.7%</span><br>
        <i style="background: ${healthStatusColors[6]}"></i><span>3.8% - 7.5%</span><br>
        <i style="background: ${healthStatusColors[7]}"></i><span>0% - 3.8%</span><br>
        <i style="background: ${healthStatusColors[8]}"></i><span>No Data</span><br>
      `;
      break;
    case healthStatusLayerNames.POOR_SELF_RATED_HEALTH:
      legendContent = `
        <h4>${healthStatusLayerNames.POOR_SELF_RATED_HEALTH}</h4>
        <i style="background: ${healthStatusColors[0]}"></i><span>> 57.1%</span><br>
        <i style="background: ${healthStatusColors[1]}"></i><span>29.7% - 57.1%</span><br>
        <i style="background: ${healthStatusColors[2]}"></i><span>23.1% - 29.7%</span><br>
        <i style="background: ${healthStatusColors[3]}"></i><span>18.3% - 23.1%</span><br>
        <i style="background: ${healthStatusColors[4]}"></i><span>14.3% - 18.3%</span><br>
        <i style="background: ${healthStatusColors[5]}"></i><span>10.1% - 14.3%</span><br>
        <i style="background: ${healthStatusColors[6]}"></i><span>4.3% - 10.1%</span><br>
        <i style="background: ${healthStatusColors[7]}"></i><span>0% - 4.3%</span><br>
        <i style="background: ${healthStatusColors[8]}"></i><span>No Data</span><br>
      `;
      break;
    case healthStatusLayerNames.DISABILITY:
      legendContent = `
        <h4>${healthStatusLayerNames.DISABILITY}</h4>
        <i style="background: ${healthStatusColors[0]}"></i><span>> 70.5%</span><br>
        <i style="background: ${healthStatusColors[1]}"></i><span>40.8% - 70.5%</span><br>
        <i style="background: ${healthStatusColors[2]}"></i><span>33.9% - 40.8%</span><br>
        <i style="background: ${healthStatusColors[3]}"></i><span>28.8% - 33.9%</span><br>
        <i style="background: ${healthStatusColors[4]}"></i><span>24.5% - 28.8%</span><br>
        <i style="background: ${healthStatusColors[5]}"></i><span>19.5% - 24.5%</span><br>
        <i style="background: ${healthStatusColors[6]}"></i><span>11.3% - 19.5%</span><br>
        <i style="background: ${healthStatusColors[7]}"></i><span>0% - 11.3%</span><br>
        <i style="background: ${healthStatusColors[8]}"></i><span>No Data</span><br>
      `;
      break;
    case healthStatusLayerNames.HEARING_DISABILITY:
      legendContent = `
          <h4>${healthStatusLayerNames.HEARING_DISABILITY}</h4>
          <i style="background: ${healthStatusColors[0]}"></i><span>> 29.7%</span><br>
          <i style="background: ${healthStatusColors[1]}"></i><span>11.6% - 29.7%</span><br>
          <i style="background: ${healthStatusColors[2]}"></i><span>7.9% - 11.6%</span><br>
          <i style="background: ${healthStatusColors[3]}"></i><span>6.2% - 7.9%</span><br>
          <i style="background: ${healthStatusColors[4]}"></i><span>5.1% - 6.2%</span><br>
          <i style="background: ${healthStatusColors[5]}"></i><span>4% - 5.1%</span><br>
          <i style="background: ${healthStatusColors[6]}"></i><span>1.7% - 4%</span><br>
          <i style="background: ${healthStatusColors[7]}"></i><span>0% - 1.7%</span><br>
          <i style="background: ${healthStatusColors[8]}"></i><span>No Data</span><br>
        `;
      break;
    case healthStatusLayerNames.VISION_DISABILITY:
      legendContent = `
          <h4>${healthStatusLayerNames.VISION_DISABILITY}</h4>
          <i style="background: ${healthStatusColors[0]}"></i><span>> 33.9%</span><br>
          <i style="background: ${healthStatusColors[1]}"></i><span>14.2% - 33.9%</span><br>
          <i style="background: ${healthStatusColors[2]}"></i><span>10.4% - 14.2%</span><br>
          <i style="background: ${healthStatusColors[3]}"></i><span>7.8% - 10.4%</span><br>
          <i style="background: ${healthStatusColors[4]}"></i><span>5.7% - 7.8%</span><br>
          <i style="background: ${healthStatusColors[5]}"></i><span>3.8% - 5.7%</span><br>
          <i style="background: ${healthStatusColors[6]}"></i><span>1.4% - 3.8%</span><br>
          <i style="background: ${healthStatusColors[7]}"></i><span>0% - 1.4%</span><br>
          <i style="background: ${healthStatusColors[8]}"></i><span>No Data</span><br>
        `;
      break;
    case healthStatusLayerNames.COGNITIVE_DISABILITY:
      legendContent = `
          <h4>${healthStatusLayerNames.COGNITIVE_DISABILITY}</h4>
          <i style="background: ${healthStatusColors[0]}"></i><span>> 30.7%</span><br>
          <i style="background: ${healthStatusColors[1]}"></i><span>21.5% - 30.7%</span><br>
          <i style="background: ${healthStatusColors[2]}"></i><span>17.5% - 21.5%</span><br>
          <i style="background: ${healthStatusColors[3]}"></i><span>14.2% - 17.5%</span><br>
          <i style="background: ${healthStatusColors[4]}"></i><span>11.6% - 14.2%</span><br>
          <i style="background: ${healthStatusColors[5]}"></i><span>9% - 11.6%</span><br>
          <i style="background: ${healthStatusColors[6]}"></i><span>5.5% - 9%</span><br>
          <i style="background: ${healthStatusColors[7]}"></i><span>0% - 5.5%</span><br>
          <i style="background: ${healthStatusColors[8]}"></i><span>No Data</span><br>
        `;
      break;
    case healthStatusLayerNames.MOBILITY_DISABILITY:
      legendContent = `
          <h4>${healthStatusLayerNames.MOBILITY_DISABILITY}</h4>
          <i style="background: ${healthStatusColors[0]}"></i><span>> 56.9%</span><br>
          <i style="background: ${healthStatusColors[1]}"></i><span>24% - 56.9%</span><br>
          <i style="background: ${healthStatusColors[2]}"></i><span>18.6% - 24%</span><br>
          <i style="background: ${healthStatusColors[3]}"></i><span>15.1% - 18.6%</span><br>
          <i style="background: ${healthStatusColors[4]}"></i><span>12.1% - 15.1%</span><br>
          <i style="background: ${healthStatusColors[5]}"></i><span>8.5% - 12.1%</span><br>
          <i style="background: ${healthStatusColors[6]}"></i><span>2.5% - 8.5%</span><br>
          <i style="background: ${healthStatusColors[7]}"></i><span>0% - 2.5%</span><br>
          <i style="background: ${healthStatusColors[8]}"></i><span>No Data</span><br>
        `;
      break;
    case healthStatusLayerNames.SELF_CARE_DISABILITY:
      legendContent = `
          <h4>${healthStatusLayerNames.SELF_CARE_DISABILITY}</h4>
          <i style="background: ${healthStatusColors[0]}"></i><span>> 28.2%</span><br>
          <i style="background: ${healthStatusColors[1]}"></i><span>9.9% - 28.2%</span><br>
          <i style="background: ${healthStatusColors[2]}"></i><span>7.1% - 9.9%</span><br>
          <i style="background: ${healthStatusColors[3]}"></i><span>5.2% - 7.1%</span><br>
          <i style="background: ${healthStatusColors[4]}"></i><span>3.8% - 5.2%</span><br>
          <i style="background: ${healthStatusColors[5]}"></i><span>2.5% - 3.8%</span><br>
          <i style="background: ${healthStatusColors[6]}"></i><span>0.8% - 2.5%</span><br>
          <i style="background: ${healthStatusColors[7]}"></i><span>0% - 0.8%</span><br>
          <i style="background: ${healthStatusColors[8]}"></i><span>No Data</span><br>
        `;
      break;
    case healthStatusLayerNames.INDEPENDENT_LIVING_DISABILITY:
      legendContent = `
          <h4>${healthStatusLayerNames.INDEPENDENT_LIVING_DISABILITY}</h4>
          <i style="background: ${healthStatusColors[0]}"></i><span>> 31.8%</span><br>
          <i style="background: ${healthStatusColors[1]}"></i><span>16.6% - 31.8%</span><br>
          <i style="background: ${healthStatusColors[2]}"></i><span>12.6% - 16.6%</span><br>
          <i style="background: ${healthStatusColors[3]}"></i><span>9.8% - 12.6%</span><br>
          <i style="background: ${healthStatusColors[4]}"></i><span>7.6% - 9.8%</span><br>
          <i style="background: ${healthStatusColors[5]}"></i><span>5.5% - 7.6%</span><br>
          <i style="background: ${healthStatusColors[6]}"></i><span>2.8% - 5.5%</span><br>
          <i style="background: ${healthStatusColors[7]}"></i><span>0% - 2.8%</span><br>
          <i style="background: ${healthStatusColors[8]}"></i><span>No Data</span><br>
        `;
      break;
  }
  document.querySelector(".healthStatusLegend").innerHTML = legendContent;
}

maps["healthStatusMap"].on("baselayerchange", function (e) {
  updateLegendForHealthStatus(e.name);
});

// Set depression layer as the default
updateLegendForHealthStatus(healthStatusLayerNames.DEPRESSION);
healthStatusLayers[healthStatusLayerNames.DEPRESSION].addTo(
  maps["healthStatusMap"]
);

//=========================================================== Health Status DROPDOWN =================================================================

var disabilityControl;

var DisabilityControl = L.Control.extend({
  // Position
  options: {
    position: "topright",
  },

  onAdd: function (map) {
    var container = L.DomUtil.create("div", "disability-control");

    var select = L.DomUtil.create("select", "", container);
    select.id = "disabilitySelect";
    select.onchange = updateHealthStatusMap;

    var disabilities = [
      {
        value: healthStatusLayerNames.DISABILITY,
        text: healthStatusLayerNames.DISABILITY,
      },
      {
        value: healthStatusLayerNames.HEARING_DISABILITY,
        text: healthStatusLayerNames.HEARING_DISABILITY,
      },
      {
        value: healthStatusLayerNames.VISION_DISABILITY,
        text: healthStatusLayerNames.VISION_DISABILITY,
      },
      {
        value: healthStatusLayerNames.COGNITIVE_DISABILITY,
        text: healthStatusLayerNames.COGNITIVE_DISABILITY,
      },
      {
        value: healthStatusLayerNames.MOBILITY_DISABILITY,
        text: healthStatusLayerNames.MOBILITY_DISABILITY,
      },
      {
        value: healthStatusLayerNames.SELF_CARE_DISABILITY,
        text: healthStatusLayerNames.SELF_CARE_DISABILITY,
      },
      {
        value: healthStatusLayerNames.INDEPENDENT_LIVING_DISABILITY,
        text: healthStatusLayerNames.INDEPENDENT_LIVING_DISABILITY,
      },
    ];

    // Populate dropdown
    for (var i = 0; i < disabilities.length; i++) {
      var option = L.DomUtil.create("option", "", select);
      option.value = disabilities[i].value;
      option.text = disabilities[i].text;
    }

    return container;
  },
});

function addDisabilityControl() {
  if (!disabilityControl) {
    disabilityControl = new DisabilityControl();
    maps["healthStatusMap"].addControl(disabilityControl);
  }
}

function removeDisabilityControl() {
  if (disabilityControl) {
    maps["healthStatusMap"].removeControl(disabilityControl);
    disabilityControl = null;
  }
}

function updateHealthStatusMap() {
  // Get selected disability from the dropdown
  var selectedDisability = document.getElementById("disabilitySelect").value;

  // Clear existing layer
  healthStatusLayers[healthStatusLayerNames.DISABILITY].clearLayers();

  // Add new layer based on the selected disability
  var selectedDisabilityGeojson = L.geoJson(healthDataGeojson, {
    style: function (feature) {
      var style;
      if (selectedDisability == healthStatusLayerNames.HEARING_DISABILITY) {
        style = {
          fillColor: getColorForHearingDisability(
            feature.properties["Hearing disability crude prevalence (%)"]
          ),
          weight: 0.5,
          opacity: 1,
          color: "white",
          fillOpacity: 0.8,
        };
      } else if (
        selectedDisability == healthStatusLayerNames.VISION_DISABILITY
      ) {
        style = {
          fillColor: getColorForVisionDisability(
            feature.properties["Vision disability crude prevalence (%)"]
          ),
          weight: 0.5,
          opacity: 1,
          color: "white",
          fillOpacity: 0.8,
        };
      } else if (
        selectedDisability == healthStatusLayerNames.COGNITIVE_DISABILITY
      ) {
        style = {
          fillColor: getColorForCognitiveDisability(
            feature.properties["Cognitive disability crude prevalence (%)"]
          ),
          weight: 0.5,
          opacity: 1,
          color: "white",
          fillOpacity: 0.8,
        };
      } else if (
        selectedDisability == healthStatusLayerNames.MOBILITY_DISABILITY
      ) {
        style = {
          fillColor: getColorForMobilityDisability(
            feature.properties["Mobility disability crude prevalence (%)"]
          ),
          weight: 0.5,
          opacity: 1,
          color: "white",
          fillOpacity: 0.8,
        };
      } else if (
        selectedDisability == healthStatusLayerNames.SELF_CARE_DISABILITY
      ) {
        style = {
          fillColor: getColorForSelfCareDisability(
            feature.properties["Self-care disability crude prevalence (%)"]
          ),
          weight: 0.5,
          opacity: 1,
          color: "white",
          fillOpacity: 0.8,
        };
      } else if (
        selectedDisability ==
        healthStatusLayerNames.INDEPENDENT_LIVING_DISABILITY
      ) {
        style = {
          fillColor: getColorForIndependentLivingDisability(
            feature.properties[
              "Independent living disability crude prevalence (%)"
            ]
          ),
          weight: 0.5,
          opacity: 1,
          color: "white",
          fillOpacity: 0.8,
        };
      } else {
        // Default style for any disability (if no specific disability is selected)
        style = {
          fillColor: getColorForDisability(
            feature.properties["Any disability crude prevalence (%)"]
          ),
          weight: 0.5,
          opacity: 1,
          color: "white",
          fillOpacity: 0.8,
        };
      }
      return style;
    },

    // Adding a popup for each feature
    onEachFeature: function (feature, layer) {
      var p = feature.properties;

      var popupContent;
      if (selectedDisability == healthStatusLayerNames.DISABILITY) {
        popupContent = `
          <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
          Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated any disability crude prevalence is 
          <b>${p["Any disability crude prevalence (%)"]}%</b> 
          ${p["Any disability crude prevalence 95% CI"]}.
        `;
      } else if (
        selectedDisability == healthStatusLayerNames.HEARING_DISABILITY
      ) {
        popupContent = `
          <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
          Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated hearing disability crude prevalence is 
          <b>${p["Hearing disability crude prevalence (%)"]}%</b> 
          ${p["Hearing disability crude prevalence 95% CI"]}.
        `;
      } else if (
        selectedDisability == healthStatusLayerNames.VISION_DISABILITY
      ) {
        popupContent = `
          <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
          Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated vision disability crude prevalence is 
          <b>${p["Vision disability crude prevalence (%)"]}%</b> 
          ${p["Vision disability crude prevalence 95% CI"]}.
        `;
      } else if (
        selectedDisability == healthStatusLayerNames.COGNITIVE_DISABILITY
      ) {
        popupContent = `
          <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
          Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated cognitive disability crude prevalence is 
          <b>${p["Cognitive disability crude prevalence (%)"]}%</b> 
          ${p["Cognitive disability crude prevalence 95% CI"]}.
        `;
      } else if (
        selectedDisability == healthStatusLayerNames.MOBILITY_DISABILITY
      ) {
        popupContent = `
          <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
          Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated mobility disability crude prevalence is 
          <b>${p["Mobility disability crude prevalence (%)"]}%</b> 
          ${p["Mobility disability crude prevalence 95% CI"]}.
        `;
      } else if (
        selectedDisability == healthStatusLayerNames.SELF_CARE_DISABILITY
      ) {
        popupContent = `
          <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
          Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated self-care disability crude prevalence is 
          <b>${p["Self-care disability crude prevalence (%)"]}%</b> 
          ${p["Self-care disability crude prevalence 95% CI"]}.
        `;
      } else if (
        selectedDisability ==
        healthStatusLayerNames.INDEPENDENT_LIVING_DISABILITY
      ) {
        popupContent = `
          <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
          Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated independent living disability crude prevalence is 
          <b>${p["Independent living disability crude prevalence (%)"]}%</b> 
          ${p["Independent living disability crude prevalence 95% CI"]}.
        `;
      }

      var popup = L.responsivePopup().setContent(popupContent);
      layer.bindPopup(popup);

      allFeatures(feature, layer);
    },
  }).addTo(healthStatusLayers[healthStatusLayerNames.DISABILITY]);

  // Update the legend based on selected layer and disability
  selectedLayer = healthStatusLayerNames.DISABILITY;
  updateLegendForHealthStatus(selectedDisability);
}

// Eventlistener for baselayer change to toggle disability dropdown
maps["healthStatusMap"].on("baselayerchange", function (e) {
  if (e.name === healthStatusLayerNames.DISABILITY) {
    addDisabilityControl();
    // Default back to "Any Disability"
    document.getElementById("disabilitySelect").value =
      healthStatusLayerNames.DISABILITY;
    updateHealthStatusMap();
  } else {
    removeDisabilityControl();
  }
});

// Set depression layer as the default
updateLegendForHealthStatus(healthStatusLayerNames.DEPRESSION);
healthStatusLayers[healthStatusLayerNames.DEPRESSION].addTo(
  maps["healthStatusMap"]
);
