// Function to show selected map and hide other maps
function showMap(mapId) {
  const mapsElements = document.querySelectorAll(".map");
  mapsElements.forEach((map) => {
    if (map.id === mapId) {
      map.classList.add("active"); // Set selected map as active
      maps[mapId].invalidateSize(); // Put the map in the correct position
    } else {
      map.classList.remove("active"); // Remove active class from other map
    }
  });
}

// Event listeners for when a map is selected
document
  .getElementById("btnDemographicLanguageMap")
  .addEventListener("click", () => {
    showMap("demographicLanguageMap");
  });
document
  .getElementById("btnHealthRiskBehaviorsMap")
  .addEventListener("click", () => {
    showMap("healthRiskBehaviorsMap");
  });
document
  .getElementById("btnHealthOutcomesMap")
  .addEventListener("click", () => {
    showMap("healthOutcomesMap");
  });
document
  .getElementById("btnScreeningRatesMap")
  .addEventListener("click", () => {
    showMap("screeningRatesMap");
  });
document.getElementById("btnHealthStatusMap").addEventListener("click", () => {
  showMap("healthStatusMap");
});

// Show the demographicLanguageMap by default
document.addEventListener("DOMContentLoaded", () => {
  showMap("demographicLanguageMap");
  maps["demographicLanguageMap"].invalidateSize();
});
