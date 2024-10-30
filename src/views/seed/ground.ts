/**
 * 此JS模块为 基于柏林噪声简化版本的 随机地形生成器
 * 对应原理视频讲解：BV1V8411n7Up
 *
 * 使用方法：
 * 在其他js中引入此文件，调用
   let ground = new Ground2D(
     randint(0, 123456789123),
     0,
     [
       {diff: 3, loud: 5},
       {diff: 2, loud: 5},
     ]
   );
   展示了一个默认地形
 */

/**
 * 随机数生成器
 * @param seed
 * @return {function()}
 */
function createRandom(seed: number) {
  let value = seed

  return function () {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

/**
 *
 * 在这个 hashCode 函数中，使用了哈希算法中的常见技巧——乘法哈希法，
 * 即将当前哈希值乘上一个常数后加上新加入的字符，这个常数被称为“乘数”，
 * 一般取一个质数，乘数的选取影响哈希算法的性能。
 * 在这里，31 是一个较为常见的乘数，因为它是一个奇素数，
 * 而且 31 可以被优化为位运算 31 << 5 - 31，
 * 这样可以提高计算速度，同时生成的哈希值分布也比较均匀，避免哈希冲突。
 * @param str
 * @return {number}
 */
function hashCode(str: string) {
  let hash = 0
  const prime = 1000003 // 取一个大一点的质数作为模数
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) % prime
  }
  return hash
}

/**
 * 二维噪音类
 */
class Noise2D {
  diff = 0
  seed = 0
  loud = 0
  /**
   *
   * @param diff {Number} 网格间距 整数
   * @param seed {Number} 种子
   * @param loud {Number} 响度 可以是小数
   */
  constructor(diff: number, seed: number, loud: number) {
    this.diff = diff
    this.seed = seed
    this.loud = loud
  }

  /**
   * 返回四个噪音位置
   * @param x {Number} 二维数组中的x下标
   * @param y {Number} 二维数组中的y下标
   */
  getNoisePosition(x: number, y: number): number[][] {
    let xMin, xMax, yMin, yMax
    if (x % this.diff === 0) {
      xMin = x
      xMax = x + this.diff
    } else {
      xMin = x - (x % this.diff)
      xMax = xMin + this.diff
    }
    if (y % this.diff === 0) {
      yMin = y
      yMax = y + this.diff
    } else {
      yMin = y - (y % this.diff)
      yMax = yMin + this.diff
    }

    // 左上 右上 左下 右下
    return [
      [xMin, yMax],
      [xMax, yMax],
      [xMin, yMin],
      [xMax, yMin],
    ]
  }

  /**
   * 获取一个位置的噪音值，只有在“噪音源点”位置才有值
   * 其他位置为0值
   * @param x {Number}
   * @param y {Number}
   * @return {number}
   */
  getCoreNoise(x: number, y: number) {
    const [p1, p2, p3, p4] = this.getNoisePosition(x, y)
    for (const [px, py] of [p1, p2, p3, p4]) {
      if (px === x && py === y) {
        const randomFunc = createRandom(hashCode(`${x}-${y}-${this.seed}`))
        return (randomFunc() * 2 - 1) * this.loud
      }
    }
    return 0
  }

  /**
   * 获取噪音实际值
   * @param x {Number}
   * @param y {Number}
   */
  getBuff(x: number, y: number) {
    const s = (xi: number) => 3 * xi ** 2 - 2 * xi ** 3 // 平滑函数
    const [p1, p2, p3, p4] = this.getNoisePosition(x, y)
    const [xMin] = p1
    const [, yMin] = p4
    const qRight = s((x - xMin) / this.diff)
    const qLeft = 1 - qRight
    const qTop = s((y - yMin) / this.diff)
    const qDown = 1 - qTop
    const n1 = this.getCoreNoise(p1[0], p1[1])
    const n2 = this.getCoreNoise(p2[0], p2[1])
    const n3 = this.getCoreNoise(p3[0], p3[1])
    const n4 = this.getCoreNoise(p4[0], p4[1])
    return (
      n1 * (qLeft * qTop) +
      n2 * (qRight * qTop) +
      n3 * (qLeft * qDown) +
      n4 * (qRight * qDown)
    )
  }
}

export default class Ground2D {
  seed: number
  baseHeight: number
  noiseArr: Noise2D[]
  /**
   *
   * @param seed {Number} 整数
   * @param baseHeight {Number} 基础高度 可以整数可以小数
   * @param noiseConfigList {Array} 这个地形内部的噪音配置
   * 例如 [
   *    {diff: 3, loud: 5},
   *    {diff: 2, loud: 5},
   * ]
   * 一个噪音层自身的种子取决于seed
   */
  constructor(
    seed: number,
    baseHeight: number,
    noiseConfigList: Array<{ diff: number; loud: number }>,
  ) {
    this.seed = seed
    this.baseHeight = baseHeight

    this.noiseArr = []
    let i = 0
    for (const n of noiseConfigList) {
      this.noiseArr.push(new Noise2D(n.diff, this.seed + i, n.loud))
      i++
    }
  }

  getHeight(x: number, y: number) {
    let sum = 0
    for (const noise of this.noiseArr) {
      sum += noise.getBuff(x, y)
    }
    return this.baseHeight + sum
  }
}
