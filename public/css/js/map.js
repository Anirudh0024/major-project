let map;
let marker;

function initMap() {
  const delhi = { lat: 28.6139, lng: 77.2090 };

  map = new google.maps.Map(document.getElementById("map"), {
    center: delhi,
    zoom: 12,
  });

  marker = new google.maps.Marker({
    position: delhi,
    map: map,
    title: "Delhi",
  });
}

// Expose initMap globally so Google Maps can call it
window.initMap = initMap;
