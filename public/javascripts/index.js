var map;

function initMap() {
  var mapOpts = {
    // styles: [{"featureType":"road","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"administrative","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"weight":1}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"weight":0.8}]},{"featureType":"landscape","stylers":[{"color":"#ffffff"}]},{"featureType":"water","stylers":[{"visibility":"off"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"elementType":"labels","stylers":[{"visibility":"off"}]},{"elementType":"labels.text","stylers":[{"visibility":"on"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#000000"}]},{"elementType":"labels.icon","stylers":[{"visibility":"on"}]}],
    zoom: 2,
    center: new google.maps.LatLng(0,0),
    streetViewControl: false,
    mapTypeControl: false
  };

  var mapContainer = document.getElementById('map');
  map = new google.maps.Map(mapContainer, mapOpts);

  // Search box
  var input = document.getElementById('pac-input')
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    // markers.forEach(function(marker) {
    //   marker.setMap(null);
    // });
    // markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      // var icon = {
      //   url: place.icon,
      //   size: new google.maps.Size(71, 71),
      //   origin: new google.maps.Point(0, 0),
      //   anchor: new google.maps.Point(17, 34),
      //   scaledSize: new google.maps.Size(25, 25)
      // };

      // Create a marker for each place.
      // markers.push(new google.maps.Marker({
      //   map: map,
      //   icon: icon,
      //   title: place.name,
      //   position: place.geometry.location
      // }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });

}

var captureBtn = document.getElementById('capture');
captureBtn.addEventListener('click', function() {
  captureBtn.disabled = true;
  captureBtn.innerText = 'Capturing...';

  var reqUrl = '/capture?lat=' + map.getCenter().lat()
                + '&lng=' + map.getCenter().lng()
                + '&zoom=' + map.getZoom();
  window.open(reqUrl, '_blank');
  captureBtn.disabled = false;
  captureBtn.innerText = 'Convert';
  // var req = new XMLHttpRequest();
  // req.open('GET', reqUrl, true);

  // req.onload = function() {
  //   if (req.status < 200 || req.status >= 400) {
  //     console.error("Server returned an error");
  //     console.error(req.responseText);
  //     return;
  //   }

  //   debugger;
  // }

  // req.onerror = function() { console.error(req.responseText); }

  // req.send();
});
