import { CanvasInitializer } from "./canvasInitializer";
import { Drawer } from "./drawer";
import { CollisionSystem } from "./collisionSystem";
import { UpdateSystem } from "./updateSystem";
import { RenderSystem } from "./renderSystem";
import { GameLoop } from "./gameLoop";
import { AnimalFactory } from "../library/animalFactory";
import { InputSystem } from "./InputSystem";
import { PointerMark } from "../library/pointerMark";
import { CameraSystem } from "./cameraSystem";
import { BackgroundPattern } from "../backgroundPattern";

export class Reson {
    constructor(canvas) {
        const canvasInitializer = new CanvasInitializer({ canvas: canvas });
        const ctx = canvasInitializer.ctx;
        const gameToCanvasScale = canvasInitializer.gameToCanvasScale;

        const drawer = new Drawer({ ctx: ctx, scale: gameToCanvasScale });

        const inputSystem = new InputSystem({ drawer: drawer });
        const collisionSystem = new CollisionSystem({});
        const updateSystem = new UpdateSystem({});
        const renderSystem = new RenderSystem({ drawer: drawer });
        const systemList = {
            drawer: drawer,
            input: inputSystem,
            collision: collisionSystem,
            update: updateSystem,
            render: renderSystem,
        };
        this.systemList = systemList;

        const cameraSystem = new CameraSystem({ system: systemList });

        const backgroundPattern = new BackgroundPattern({ systemList: systemList });
        this.backgroundPattern = backgroundPattern;

        const animalFactory = new AnimalFactory({ systemList: systemList });
        this.animalFactory = animalFactory;

        const gameLoop = new GameLoop(() => {
            collisionSystem.update();
            updateSystem.update();
            renderSystem.draw();
        });
    }
}
