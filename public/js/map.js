const coords = listings.geometry ? listings.geometry.coordinates : [72.8777, 19.0760];

const map = new maplibregl.Map({
  container: 'map',
  style: `https://api.maptiler.com/maps/streets/style.json?key=${mapToken}`,
  center: coords,
  zoom: 9
});

map.addControl(new maplibregl.NavigationControl(), "top-right");

if (listings.geometry) {
  new maplibregl.Marker({ color: "#fe424d" })
    .setLngLat(coords)
    .setPopup(
      new maplibregl.Popup({ offset: 25 })
        .setHTML(`
          <h3>${listings.title}</h3>
          <p>${listings.location}</p>
          <p>Exact location provided after booking</p>
        `)
    )
    .addTo(map);
}
