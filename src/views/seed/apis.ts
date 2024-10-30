import LandformWorker from './landformWorker?worker'
import type { Seed } from './seed'

const worker = new LandformWorker()
export function getDemDataApi(height: number, width: number, gridSize: number) {
  return new Promise(resolve => {
    worker.onmessage = event => {
      resolve(event.data.data)
    }
    worker.postMessage({
      type: 'start',
      height,
      width,
      gridSize,
    })
  })
}

export function startFlood(sourcePoint: Seed) {
  const callBacks: any[] = []
  function subscribe(callback) {
    callBacks.push(callback)
  }

  const subscriber = {
    subscribe,
  }
  worker.onmessage = event => {
    const { type } = event.data
    if (type === 'flooded') {
      callBacks.forEach(callback => callback(JSON.parse(event.data.data)))
    }
  }
  worker.postMessage({
    type: 'flood',
    sourcePoint: JSON.stringify(sourcePoint),
  })
  return subscriber
}
