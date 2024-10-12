import * as THREE from 'three'
import { WebGPURenderer } from 'three/webgpu'

export function test() {
  /**
   * @description 绘制有贴图的平面
   */
  function drawPlaneWithTexture() {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    )

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const textureLoader = new THREE.TextureLoader()
    const texture = textureLoader.load('satellite.jpg')
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      opacity: 1,
      transparent: true,
    })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.getElementById('main')!.appendChild(renderer.domElement)

    function animate() {
      renderer.render(scene, camera)
    }
    renderer.setAnimationLoop(animate)
  }
  drawPlaneWithTexture()
}
