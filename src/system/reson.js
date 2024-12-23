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
import { EventSystem } from "./eventSystem";
import { SocketSystem } from './socketSystem';

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
        this.eventSystem = new EventSystem({});
        this.socketSystem = new SocketSystem({reson: this});
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

            this.socketSystem.update();
            
        });
        this.fpsDisplay = new FpsDisplay({ system: systemList, gameLoop: gameLoop });
        this.fpsDisplay.visible = false;

        this.components = [];
    }

    // 再帰処理あり : updateメソッドなどを持つcomponentなら追加し、子要素にcomponentを持つなら再帰的に処理する
    // 正確には再帰ではなく、循環参照があると動かないため深さ1まで
    add(entityHavingComponents) {

        if (entityHavingComponents === null) return; 
        
        // componentかどうかチェックして追加する
        this.addComponent(entityHavingComponents)

        // 対象のインスタンスのプロパティ一覧を全て再帰的にチェックする
        Object.values(entityHavingComponents).forEach(component => {
            this.addComponent(component);
            // if (component != null) {
            //     this.add(component);
            // }
        });
    }

    // componentかどうかチェックして追加する
    addComponent(component) {
        // console.log("addComponent-info", component);
        
        if (component === null) return;

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
        if (component.eventConfigs) {
            this.eventSystem.submit(component);
        }
        if (component.sendEvent) {
            component.sendEvent = this.eventSystem.send.bind(this.eventSystem);
        }
        if (component.addComponentCallback) {
            component.addComponentCallback = this.add.bind(this);
        }
        // if (component.positionSync) {
        //     // 位置共有するもののうち、クライアントプレイヤー側で操作するもの(isPlayerControlled)
        //     if (component.isPlayerControlled) {
        //         if (component.isOtherPlayer) {
        //             this.socketSystem.submitOtherControlledObject(component);
        //         } else {
        //             this.socketSystem.submitPlayerControlledObject(component);
        //         }
        //     } else {
        //         this.socketSystem.submit(component);
        //     }
            
        // }
        if (component.syncRules) {
            if (Array.isArray(component.syncRules.host) && component.syncRules.host.length > 0) {
                this.socketSystem.submit(component);
                // this.socketSystem.submitOtherControlledObject(component);
                // this.socketSystem.submitPlayerControlledObject(component);
            }
            if (Array.isArray(component.syncRules.client) && component.syncRules.client.length > 0) {
                if (component.isOtherPlayer) {
                    this.socketSystem.submitOtherControlledObject(component);
                } else {
                    this.socketSystem.submitPlayerControlledObject(component);
                }
            }
            if (Array.isArray(component.syncRules.request) && component.syncRules.request.length > 0) {
                this.socketSystem.submitRequestObject(component);
            }
            
            
        }
    }

    removeComponent(component) {
        if (component.drawShapes) {
            this.drawSystem.unsubmit(component);
        }


    }

    remove(entityHavingComponents) {
        // componentかどうかチェック
        this.removeComponent(entityHavingComponents)

        // 対象のインスタンスのプロパティ一覧を全て再帰的にチェックする
        Object.values(entityHavingComponents).forEach(component => {
            this.removeComponent(component);
        });
    }
}
