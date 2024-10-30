import { randInt } from 'three/src/math/MathUtils.js'
import Ground2D from './ground'
import { Seed } from './seed'
import { ref } from 'vue'
const grids = ref()
self.onmessage = e => {
  if (e.data.type === 'start') {
    createDemData(e.data.height, e.data.width, e.data.gridSize)
  } else if (e.data.type === 'flood') {
    seedFlood(JSON.parse(e.data.sourcePoint), grids.value)
  }
}

function createDemData(height: number, width: number, gridSize: number) {
  const res: Array<Seed>[] = []
  const xSize = width / gridSize
  const ySize = height / gridSize
  for (let i = 0; i < xSize; i++) {
    res[i] = []
    for (let j = 0; j < ySize; j++) {
      const ground = new Ground2D(randInt(0, 123456789), 50, [
        { diff: 1, loud: 1 },
      ])
      const items = ground.getHeight(1000, 800)
      const seed = new Seed(i, j, items)
      seed.gridSize = gridSize
      res[i][j] = seed
    }
  }
  self.postMessage({
    type: 'demData',
    data: res,
  })
  grids.value = res
  return res
}

/**
 * 种子搜索淹没
 */
export function seedFlood(seed: Seed, seeds: Seed[][]) {
  const changeSpeed = 1
  const flodd = (p: Seed) => {
    // 获取该点位相邻的8个点
    const temp = [
      seeds[p.x][p.y + 1] ? seeds[p.x][p.y + 1] : null,
      seeds[p.x][p.y - 1] ? seeds[p.x][p.y - 1] : null,
      seeds[p.x + 1] ? seeds[p.x + 1][p.y] : null,
      seeds[p.x + 1] ? seeds[p.x + 1][p.y + 1] : null,
      seeds[p.x + 1] && seeds[p.x + 1][p.y - 1]
        ? seeds[p.x + 1][p.y - 1]
        : null,
      seeds[p.x - 1] ? seeds[p.x - 1][p.y] : null,
      seeds[p.x - 1] && seeds[p.x - 1][p.y - 1]
        ? seeds[p.x - 1][p.y - 1]
        : null,
      seeds[p.x - 1] && seeds[p.x - 1][p.y + 1]
        ? seeds[p.x - 1][p.y + 1]
        : null,
    ]
    const arr = temp
      .filter(item => {
        if (!item) {
          return false
        }
        if (item.isFlood || item.scanner) {
          return false
        }
        return item.z < seed.z
      })
      .map(item => {
        item!.speed = (seed.z / item!.z) * changeSpeed
        return item
      })
      .sort((a, b) => a!.speed - b!.speed)
    arr.forEach(item => {
      item!.scanner = true
      flodd(item)
      setTimeout(() => {
        if (item) {
          item!.isFlood = true
          self.postMessage({
            type: 'flooded',
            data: JSON.stringify(item),
          })
        }
      }, 0)
    })
  }
  flodd(seed)
}
