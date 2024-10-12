import * as THREE from 'three'
import {
  step,
  normalWorld,
  output,
  texture,
  vec3,
  vec4,
  normalize,
  positionWorld,
  bumpMap,
  cameraPosition,
  color,
  uniform,
  mix,
  uv,
  max,
  MeshStandardNodeMaterial,
  WebGPURenderer,
  MeshBasicNodeMaterial,
} from 'three/tsl'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

let camera: THREE.PerspectiveCamera | null = null
let scene: THREE.Scene | null = null
let renderer: WebGPURenderer | null = null
let controls: OrbitControls | null = null
let globe: THREE.Mesh | null = null
let clock: THREE.Clock | null = null
let satellite
let satelliteLabel

export function init() {
  clock = new THREE.Clock()

  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    100,
  )

  camera.position.set(2, 2, 2)

  const z = new THREE.Vector3(0, 0, camera?.position.z)
  const y = new THREE.Vector3(0, camera?.position.y, 0)
  const x = new THREE.Vector3(camera?.position.x, 0, 0)
  const res = z.add(y).add(x)
  console.log(res)

  scene = new THREE.Scene()

  new THREE.TextureLoader().load('orbit-background.jpg', texture => {
    if (scene) {
      scene.background = texture
      renderer.render(scene, camera)
    }
  })

  // sun
  const sun = new THREE.DirectionalLight('#ffffff', 161)
  sun.position.set(-2, -2, -2)
  scene.add(sun)

  // uniforms

  const atmosphereDayColor = uniform(color('#4db2ff'))
  const atmosphereTwilightColor = uniform(color('#ffffff'))
  const roughnessLow = uniform(0)
  const roughnessHigh = uniform(0)

  // textures

  const textureLoader = new THREE.TextureLoader()

  const dayTexture = textureLoader.load('earth-bg.jpg')
  dayTexture.colorSpace = THREE.SRGBColorSpace
  dayTexture.anisotropy = 8

  const nightTexture = textureLoader.load('earth-bg.jpg')
  nightTexture.colorSpace = THREE.SRGBColorSpace
  nightTexture.anisotropy = 8

  const bumpRoughnessCloudsTexture = textureLoader.load('earth-bg.jpg')
  bumpRoughnessCloudsTexture.anisotropy = 8

  // fresnel

  const viewDirection = positionWorld.sub(cameraPosition).normalize()
  const fresnel = viewDirection.dot(normalWorld).abs().oneMinus().toVar()

  // sun orientation

  const sunOrientation = normalWorld.dot(normalize(sun.position)).toVar()

  // atmosphere color

  const atmosphereColor = mix(
    atmosphereTwilightColor,
    atmosphereDayColor,
    sunOrientation.smoothstep(-0.25, 0.75),
  )

  // globe

  const globeMaterial = new MeshStandardNodeMaterial()

  const cloudsStrength = texture(bumpRoughnessCloudsTexture, uv()).b.smoothstep(
    0.2,
    1,
  )

  globeMaterial.colorNode = mix(
    texture(dayTexture),
    vec3(1),
    cloudsStrength.mul(2),
  )

  const roughness = max(
    texture(bumpRoughnessCloudsTexture).g,
    step(0.01, cloudsStrength),
  )
  globeMaterial.roughnessNode = roughness.remap(
    0,
    1,
    roughnessLow,
    roughnessHigh,
  )

  const night = texture(nightTexture)
  const dayStrength = sunOrientation.smoothstep(-0.25, 0.5)

  const atmosphereDayStrength = sunOrientation.smoothstep(-0.5, 1)
  const atmosphereMix = atmosphereDayStrength.mul(fresnel.pow(2)).clamp(0, 1)

  let finalOutput = mix(night.rgb, output.rgb, dayStrength)
  finalOutput = mix(finalOutput, atmosphereColor, atmosphereMix)

  globeMaterial.outputNode = vec4(finalOutput, output.a)

  const bumpElevation = max(
    texture(bumpRoughnessCloudsTexture).r,
    cloudsStrength,
  )
  globeMaterial.normalNode = bumpMap(bumpElevation)

  const sphereGeometry = new THREE.SphereGeometry(1, 64, 64)
  globe = new THREE.Mesh(sphereGeometry, globeMaterial)
  scene.add(globe)

  // atmosphere

  const atmosphereMaterial = new MeshBasicNodeMaterial({
    side: THREE.BackSide,
    transparent: true,
  })
  let alpha = fresnel.remap(0.73, 1, 1, 0).pow(3)
  alpha = alpha.mul(sunOrientation.smoothstep(-0.5, 1))
  atmosphereMaterial.outputNode = vec4(atmosphereColor, alpha)

  const atmosphere = new THREE.Mesh(sphereGeometry, atmosphereMaterial)
  atmosphere.scale.setScalar(1.04)
  scene.add(atmosphere)

  // debug

  const gui = new GUI()

  gui
    .addColor(
      { color: atmosphereDayColor.value.getHex(THREE.SRGBColorSpace) },
      'color',
    )
    .onChange(value => {
      atmosphereDayColor.value.set(value)
    })
    .name('atmosphereDayColor')

  gui
    .addColor(
      { color: atmosphereTwilightColor.value.getHex(THREE.SRGBColorSpace) },
      'color',
    )
    .onChange(value => {
      atmosphereTwilightColor.value.set(value)
    })
    .name('atmosphereTwilightColor')

  gui.add(roughnessLow, 'value', 0, 1, 0.001).name('roughnessLow')
  gui.add(roughnessHigh, 'value', 0, 1, 0.001).name('roughnessHigh')

  // renderer

  renderer = new WebGPURenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setAnimationLoop(animate)
  document.getElementById('main').appendChild(renderer.domElement)

  // controls

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.minDistance = 0.1
  controls.maxDistance = 50
  controls.addEventListener('change', e => {})

  // 添加虚线圆环到场景
  const dashedRing = createSatelliteTrack(1.5, 1000, 2, 0.1)
  scene.add(dashedRing)
  const dashedRing2 = createSatelliteTrack2(1.7, 1000, 2, 0.1)
  scene.add(dashedRing2)

  // 创建卫星
  new THREE.TextureLoader().load('satellite.jpg', texture => {
    if (scene) {
      const geometry33 = new THREE.PlaneGeometry(0.4, 0.42)
      const textureLoader33 = new THREE.TextureLoader()
      const texture33 = textureLoader33.load('satellite.jpg')

      const material33 = new THREE.MeshBasicMaterial({
        map: texture33,
        opacity: 1,
        transparent: true,
      })
      const cube = new THREE.Mesh(geometry33, material33)
      satellite = cube

      // const geometryLabel = new THREE.PlaneGeometry(127.5 / 300, 41 / 300)
      // const labelTexture = textureLoader33.load('label.png')
      // const materialLabel = new THREE.MeshBasicMaterial({
      //   map: labelTexture,
      //   opacity: 1,
      //   transparent: true,
      // })
      // const label = new THREE.Mesh(geometryLabel, materialLabel)
      // satelliteLabel = label
      scene.add(cube)
      // scene.add(label)
    }
  })
  // 绘制间断的圆环
  window.addEventListener('resize', onWindowResize)
}

// 创建卫星轨迹
function createSatelliteTrack(radius, numPoints) {
  const points = []
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2
    const x = Math.cos(angle)
    const y = Math.sin(angle)
    points.push(new THREE.Vector3(x * radius, y * radius, 0))
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const material = new THREE.LineDashedMaterial({
    color: '#ffffff', // 线条颜色
    linewidth: 2, // 线条宽度
    scale: 2, // 虚线比例
    dashSize: 4, // 虚线段长度
    gapSize: 1, // 虚线间隙长度
  })
  const line = new THREE.LineSegments(geometry, material)
  return line
}

// 创建卫星轨迹
function createSatelliteTrack2(radius, numPoints) {
  const points = []
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2
    const x = Math.cos(angle)
    const y = Math.sin(angle)
    points.push(new THREE.Vector3(x * radius, 0, y * radius))
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const material = new THREE.LineDashedMaterial({
    color: '#ffffff', // 线条颜色
    linewidth: 2, // 线条宽度
    scale: 2, // 虚线比例
    dashSize: 4, // 虚线段长度
    gapSize: 1, // 虚线间隙长度
  })
  const line = new THREE.LineSegments(geometry, material)
  return line
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}

async function animate() {
  const delta = clock.getDelta()
  globe.rotation.y += delta * 0.025
  satellite &&
    satellite.position.set(
      Math.cos(Date.now() * 0.0001) * 1.5,
      Math.sin(Date.now() * 0.0001) * 1.5,
      0,
    )
  satelliteLabel &&
    satelliteLabel.position.set(
      Math.cos(Date.now() * 0.0001) * 1.5,
      Math.sin(Date.now() * 0.0001) * 1.5,
      0,
    )
  Object.assign(satelliteLabel.rotation, {
    x: camera?.rotation.y,
    y: camera?.rotation.z,
    z: camera?.rotation.x,
  })
  Object.assign(satellite.rotation, {
    x: camera?.rotation.y,
    y: camera?.rotation.z,
    z: camera?.rotation.x,
  })
  controls.update()

  renderer.render(scene, camera)
}
