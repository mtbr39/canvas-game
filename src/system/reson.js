import { CanvasInitializer } from "./canvasInitializer";
import { Drawer } from "./drawer";
import { CollisionSystem } from "./collisionSystem";
import { UpdateSystem } from "./updateSystem";
import { RenderSystem } from "./renderSystem";
import { FpsDisplay, GameLoop } from "./gameLoop";
import { AnimalFactory } from "../library/animalFactory";
import { InputSystem } from "./InputSystem";
import { PointerMark } from "../library/pointerMark";
import { CameraSystem } from "./cameraSystem";
import { BackgroundPattern } from "../backgroundPattern";

export class Reson {
    constructor(canvas) {
        this.canvas = canvas;
        const canvasInitializer = new CanvasInitializer({ canvas: canvas });
        const ctx = canvasInitializer.ctx;
        const gameToCanvasScale = canvasInitializer.gameToCanvasScale;

        const drawer = new Drawer({ ctx: ctx, scale: gameToCanvasScale });
        this.drawer = drawer;

        const inputSystem = new InputSystem({ drawer: drawer });
        const collisionSystem = new CollisionSystem({});
        const updateSystem = new UpdateSystem({});
        const renderSystem = new RenderSystem({ drawer: drawer, styleSetting: canvasInitializer.styleSetting});
        const systemList = {
            drawer: drawer,
            input: inputSystem,
            collision: collisionSystem,
            update: updateSystem,
            render: renderSystem,
        };
        this.systemList = systemList;

        this.cameraSystem = new CameraSystem({ system: systemList });
        this.backgroundPattern = new BackgroundPattern({ systemList: systemList });
        this.animalFactory = new AnimalFactory({ systemList: systemList });

        const gameLoop = new GameLoop(() => {
            collisionSystem.update();
            updateSystem.update();
            renderSystem.draw();
        });
        new FpsDisplay({ system: systemList, gameLoop: gameLoop });
    }
}
