import { Map } from 'mapbox-gl'
import proj4 from 'proj4'

export function initMap() {
  const map = new Map({
    container: 'transform',
    style: 'mapbox://styles/mapbox/satellite-streets-v12',
    center: [105.53, 29.2323],
    zoom: 8,
    accessToken:
      'pk.eyJ1Ijoic2FuZm9yIiwiYSI6ImNsd2dnbWE2NzAzM3kyanFtOTl1czVsYW0ifQ.vqm7JFMDU1EadQZF-ijs4g',
  })
  map.setTerrain({})
  return map
}

// 定义CN2000和WGS84的投影定义
const cn2000 = '+proj=longlat +ellps=GRS80 +no_defs'
const wgs84 = '+proj=longlat +datum=WGS84 +no_defs'
// CN2000 to WGS84 conversion function
export function convertCN2000ToWGS84(x, y) {
  const transformer = proj4(cn2000, wgs84)
  const wgs84_coords = transformer.forward([Number(x), Number(y)])

  return { lat: Number(wgs84_coords[0]), lon: Number(wgs84_coords[1]) }
}
