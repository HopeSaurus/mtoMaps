jQuery(document).ready(function($) {
  const mapCenterButton = document.getElementById('map-center-button');

  function centerMap(){
    if(clusterBounds)
    map.flyToBounds(clusterBounds, {
      animate: false
    });
  }

  mapCenterButton.addEventListener('click', centerMap);
});