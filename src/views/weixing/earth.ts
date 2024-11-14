import {
  AxesHelper,
  BoxGeometry,
  CameraHelper,
  Color,
  DirectionalLight,
  GridHelper,
  Group,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshStandardNodeMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  Texture,
  TextureLoader,
} from 'three/webgpu';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import Stats from 'three/addons/libs/stats.module.js';

const gltfLoader = new GLTFLoader();
const textureLoader = new TextureLoader();

type CallbackType = (...args: unknown[]) => void;

export type EathEventType = 'cailiao-loaded' | 'modal-loaded';

export class Earth {
  domId = '';
  stats = new Stats();
  /**
   * 全局场景
   */
  private scene: Scene = new Scene();
  controls!: OrbitControls;
  /** 相机 */
  private camera: PerspectiveCamera = new PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000,
  );
  /** 渲染器 */
  private renderer = new WebGLRenderer();

  constructor(elmentId: string, width: number, height: number) {
    this.domId = elmentId;
    this.camera.aspect = width / height;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.scene.background = new Color(0xe0e0e0);

    Promise.all([
      this.loadBackground(),
      this.loadModels(),
      this.loadTexture(),
    ]).then(() => {
      this.emits('cailiao-loaded');
    });
  }
  //#region 模型
  // 地球
  private earth!: Mesh; //卫星
  /** 卫星 */
  private satellites: Group[] = [];

  /** 地球半径 */
  private earthRadius = 1200;
  /** 订阅后的回调 */
  private onModalLoadCallbacks: CallbackType[] = [];
  /** 订阅后的回调 */
  private onCailiaoCallbacks: CallbackType[] = [];

  light = new DirectionalLight('#de090f');

  /** 背景图片 */
  private background!: Texture;
  private dayTexture!: Texture;

  private loadTexture() {
    return new Promise(resolve => {
      textureLoader.load('earth-bg.jpg', dayTexture => {
        dayTexture.colorSpace = SRGBColorSpace;
        dayTexture.anisotropy = 8;
        this.dayTexture = dayTexture;
        resolve(true);
      });
    });
  }

  private loadModels() {
    return new Promise(resolve => {
      gltfLoader.load('models/untitled.glb', gltf => {
        this.satellites.push(gltf.scene);
        this.emits('modal-loaded');
        resolve(true);
      });
    });
  }

  private createEarth() {
    const sphereGeometry = new SphereGeometry(2, 100, 100);
    const globeMaterial = new MeshStandardNodeMaterial({
      color: 0xffffff,
      envMap: this.dayTexture,
    });
    this.earth = new Mesh(sphereGeometry, globeMaterial);
    this.earth.position.set(0, 0, 0);
    this.scene.add(this.earth);
  }
  //#endregion

  private loadBackground() {
    return new Promise(resolve => {
      new TextureLoader().load('orbit-background.jpg', texture => {
        if (this.scene) {
          this.background = texture;
          // this.scene.background = texture;
          this.renderer.render(this.scene, this.camera);
          resolve(true);
        }
      });
    });
  }

  private emits(type: EathEventType, data?: unknown) {
    if (type === 'modal-loaded') {
      this.onModalLoadCallbacks.forEach((callback: CallbackType) => {
        callback(data);
      });
    } else if (type === 'cailiao-loaded') {
      this.onCailiaoCallbacks.forEach((callback: CallbackType) => {
        callback(data);
      });
    }
  }

  /**
   * @description 订阅事件
   * @param type
   * @param callback
   */
  subscribe(type: EathEventType, callback: CallbackType) {
    if (type === 'modal-loaded') {
      this.onModalLoadCallbacks.push(callback);
    } else if (type === 'cailiao-loaded') {
      this.onCailiaoCallbacks.push(callback);
    }
  }

  /**
   * @description 开始创建
   * @param elmentId Dom元素ID
   */
  create() {
    this.camera = new PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    this.renderer = new WebGLRenderer();
    this.renderer.setClearColor(0xeeeeee);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    const axisHelp = new AxesHelper(20);
    this.scene.add(axisHelp);

    const planeGeometry = new PlaneGeometry(60, 20, 1.1);
    const planeMaterial = new MeshBasicMaterial({
      color: 'red',
    });
    const plane = new Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;
    this.scene.add(plane);

    const cubeGeometry = new BoxGeometry(4, 4, 4);
    const cubeMaterial = new MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
    });
    const cube = new Mesh(cubeGeometry, cubeMaterial);
    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;
    this.scene.add(cube);
    this.renderer.render(this.scene, this.camera);
    this.addCameraHelp();
    document.getElementById(this.domId)?.append(this.renderer.domElement);
  }

  //#region help类
  addCameraHelp() {
    const helper = new CameraHelper(this.camera);

    const grid = new GridHelper(1000, 100, 'red', 'blue');
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    this.scene.add(helper);
    this.scene.add(grid);
  }
  //#endregion
}
