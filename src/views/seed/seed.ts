import { randInt } from 'three/src/math/MathUtils.js'
import Ground2D from './ground'

/**
 * 定义种子类
 */
export class Seed {
  x: number = 0
  y: number = 0
  z: number = 0
  isFlood: boolean = false
  gridSize: number = 0
  id = ''
  isSource: boolean = false
  scanner: boolean = false
  speed = 0

  get level() {
    if (this.z <= 50) {
      return 1
    } else if (this.z <= 60 && this.z > 50) {
      return 2
    } else if (this.z > 70 && this.z <= 80) {
      return 3
    } else if (this.z > 80) {
      return 4
    } else {
      return 5
    }
  }
  constructor(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
    this.id = (Math.random() * Date.now()).toFixed(0)
  }
}

/**
 * 创建模拟dem数据
 */
export function createDemData(height: number, width: number, gridSize: number) {
  const res: Array<Seed>[] = []
  const xSize = width / gridSize
  const ySize = height / gridSize
  for (let i = 0; i < xSize; i++) {
    res[i] = []
    for (let j = 0; j < ySize; j++) {
      const ground = new Ground2D(randInt(0, 123456789), 50, [
        { diff: 50, loud: 1 },
      ])
      const items = ground.getHeight(1000, 800)
      const seed = new Seed(i, j, items)
      // const seed = new Seed(i, j, Number((50 + Math.random() * 40).toFixed(0)))
      seed.gridSize = gridSize
      res[i][j] = seed
    }
  }
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
        item.speed = (seed.z / item.z) * changeSpeed + p.speed
        return item
      })
      .sort((a, b) => a.speed - b.speed)
    arr.forEach(item => {
      item.scanner = true
      setTimeout(() => {
        flodd(item)
        item.isFlood = true
      }, item?.speed)
    })
  }
  flodd(seed)
}
