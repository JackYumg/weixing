import * as mapboxgl from 'mapbox-gl'
export function initMap() {
  const map = new mapboxgl.Map({
    container: 'waterMap',
    center: [105.53, 29.2323],
    zoom: 8,
    accessToken:
      'pk.eyJ1Ijoic2FuZm9yIiwiYSI6ImNsd2dnbWE2NzAzM3kyanFtOTl1czVsYW0ifQ.vqm7JFMDU1EadQZF-ijs4g',
    style: {
      version: 8,
      name: 'custom',
      // mapbox地图使用的标注字体，目前是在线的，需要本地化 clusters聚合的 text-field 需要用到
      sprite: `${window.mapboxUrl}/flSprite/sprite`,
      glyphs: `${window.mapboxUrl}/glyphs/fonts/{fontstack}/{range}.pbf`,
      transition: {
        duration: 300,
        delay: 0,
      },
      sources: {
        'remote-layer': {
          type: 'raster',
          tiles: [
            // 'https://t2.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=d083e4cf30bfc438ef93436c10c2c20a'
            // 'http://t0.tianditu.gov.cn/img_w/wmts?tk=d083e4cf30bfc438ef93436c10c2c20a&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles',
            'https://t4.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=e78bb0ee69609f3a3c7bba50e346bc58',
          ],
          tileSize: 256,
          maxzoom: 18,
        },
        'remote-biaozhu': {
          type: 'raster',
          tiles: [
            'https://t0.tianditu.gov.cn/cia_w/wmts?tk=d083e4cf30bfc438ef93436c10c2c20a&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles',
            // 'http://58.144.221.135:8119/tdt/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=f1c40836bd33fc482aa3675f530879eb'
          ],
          tileSize: 256,
          maxzoom: 18,
        },
      },
      layers: [],
    },
  })
  return {
    map,
  }
}
