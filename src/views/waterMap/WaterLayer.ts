/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  CustomLayerInterface,
  Map,
  MercatorCoordinate,
  ProjectionSpecification,
} from 'mapbox-gl'
interface WaterLayerOption {
  id: string
  points: number[][]
}

type currentLayerType = 'custom'
export class WaterLayer implements CustomLayerInterface {
  id: string = ''
  type: currentLayerType = 'custom'
  slot?: string | undefined
  renderingMode?: '2d' | '3d' | undefined = '3d'

  constructor(waterLayerOption: WaterLayerOption) {
    this.id = waterLayerOption.id
  }
  render = (
    gl: WebGL2RenderingContext,
    matrix: Array<number>,
    projection?: ProjectionSpecification,
    projectionToMercatorMatrix?: Array<number>,
    projectionToMercatorTransition?: number,
    centerInMercator?: Array<number>,
    pixelsPerMeterRatio?: number,
  ) => {}

  prerender?:
    | ((
        gl: WebGL2RenderingContext,
        matrix: Array<number>,
        projection?: ProjectionSpecification,
        projectionToMercatorMatrix?: Array<number>,
        projectionToMercatorTransition?: number,
        centerInMercator?: Array<number>,
        pixelsPerMeterRatio?: number,
      ) => void)
    | undefined

  renderToTile?:
    | ((gl: WebGL2RenderingContext, tileId: MercatorCoordinate) => void)
    | undefined

  shouldRerenderTiles?: (() => boolean) | undefined

  onAdd?: ((map: Map, gl: WebGL2RenderingContext) => void) | undefined

  onRemove?: ((map: Map, gl: WebGL2RenderingContext) => void) | undefined

  source?: undefined

  'source-layer'?: undefined

  minzoom?: undefined

  maxzoom?: undefined

  filter?: undefined

  layout?: undefined

  paint?: undefined
}
