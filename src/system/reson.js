import { CanvasInitializer } from "./canvasInitializer";
import { Drawer } from "./drawer";
import { CollisionSystem } from "./collisionSystem";
import { UpdateSystem } from "./updateSystem";
import { RenderSystem } from "./renderSystem";
import { FpsDisplay, GameLoop } from "./gameLoop";
import { InputSystem } from "./InputSystem";
import { CameraSystem } from "./cameraSystem";

import { AnimalFactory } from "../library/boid/animalFactory";
import { BackgroundPattern } from "../library/boid/backgroundPattern";
import { DrawSystem } from "./drawSystem";

export class Reson {
    constructor(canvas) {
        this.canvas = canvas;
        const canvasInitializer = new CanvasInitializer({ canvas: canvas });
        const ctx = canvasInitializer.ctx;
        const gameToCanvasScale = canvasInitializer.gameToCanvasScale;

        const drawer = new Drawer({ ctx: ctx, scale: gameToCanvasScale });
        this.drawer = drawer;

        this.renderSystem = new RenderSystem({ drawer: drawer, styleSetting: canvasInitializer.styleSetting});
        this.drawSystem = new DrawSystem({ drawer: drawer });
        this.inputSystem = new InputSystem({ drawer: drawer, renderSystem: this.renderSystem});
        this.collisionSystem = new CollisionSystem({});
        this.updateSystem = new UpdateSystem({});
        const systemList = {
            drawer: this.drawer,
            input: this.inputSystem,
            collision: this.collisionSystem,
            update: this.updateSystem,
            render: this.renderSystem,
        };
        this.systemList = systemList;

        this.cameraSystem = new CameraSystem({ system: systemList });
        this.backgroundPattern = new BackgroundPattern({ systemList: systemList });
        this.animalFactory = new AnimalFactory({ systemList: systemList });

        const gameLoop = new GameLoop(() => {
            this.collisionSystem.update();
            this.updateSystem.update();
            this.renderSystem.draw();
            this.drawSystem.draw();
        });
        this.fpsDisplay = new FpsDisplay({ system: systemList, gameLoop: gameLoop });
        this.fpsDisplay.visible = false;

        this.components = [];
    }

    // 再帰処理あり : updateメソッドなどを持つcomponentなら追加し、子要素にcomponentを持つなら再帰的に処理する
    add(entityHavingComponents) {
        // componentかどうかチェックして追加する
        this.addComponent(entityHavingComponents)

        // 対象のインスタンスのプロパティ一覧を全て再帰的にチェックする
        Object.values(entityHavingComponents).forEach(component => {
            this.addComponent(component);
        });

        // // 子要素にcomponentsを持つなら再帰的に処理する
        // if (entityHavingComponents && Array.isArray(entityHavingComponents.components)) {

        //     const _components = entityHavingComponents.components;

        //     _components.forEach((component) => {
        //         this.add(component);
        //     });

        // }
    }

    // componentかどうかチェックして追加する
    addComponent(component) {
        if (typeof component.update === 'function') {
            this.updateSystem.submit(component);
        }
        if (typeof component.draw === 'function') {
            this.renderSystem.submit(component);
        }
        if (component.collider) {
            this.collisionSystem.submit(component);
        }
        if (component.drawShapes) {
            this.drawSystem.submit(component);
        }
        if (component.inputConfigs) {
            
            component.inputConfigs.forEach((inputConfig) => {
                this.inputSystem.submitHandler(inputConfig);
            });
            
        }
        if (component.addComponentCallback) {
            component.addComponentCallback = this.add.bind(this);
        }
    }
}
