import * as THREE from "three";

export class Dimension {
    constructor(option) {
        const canvas = option.canvas;
        // const ctx = option.ctx;
        const system = option.system;
        system.render.submit(this);

        // Three.jsの初期設定
        const existingCanvas = canvas;

        // WebGLコンテキストを取得
        const existingContext =
            existingCanvas.getContext("webgl") || existingCanvas.getContext("experimental-webgl");

        if (existingContext) {
            // 既存のWebGLコンテキストがある場合はそれを使用
            this.renderer = new THREE.WebGLRenderer({ context: existingContext });

            // Three.jsの初期設定
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(
                75,
                existingCanvas.width / existingCanvas.height,
                0.1,
                1000
            );

            // 3Dオブジェクトの追加
            const geometry = new THREE.BoxGeometry();
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            this.cube = new THREE.Mesh(geometry, material);
            scene.add(this.cube);

            camera.position.z = 5;
        } else {
            console.error("canvasがない", existingContext, existingCanvas);
        }
    }

    draw() {
        // 3Dシーンの更新
        // this.cube.rotation.x += 0.01;
        // this.cube.rotation.y += 0.01;

        // レンダリング
        this.renderer.render(scene, camera);
    }
}
