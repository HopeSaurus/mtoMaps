const mapCenterButton = document.getElementById('map-center-button');

function centerMap(){
  map.flyToBounds(clusterBounds, {
    duration: 1,
  });
}

mapCenterButton.addEventListener('click', centerMap);