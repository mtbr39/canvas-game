import { CanvasInitializer } from "./system/canvasInitializer";
import { Drawer } from "./system/drawer";
import { CollisionSystem } from "./system/collisionSystem";
import { UpdateSystem } from "./system/updateSystem";
import { RenderSystem } from "./system/renderSystem";
import { GameLoop } from "./system/gameLoop";
import { Animal } from "./animal";
import { AnimalFactory } from "./library/animalFactory";
import { InputSystem } from "./system/InputSystem";
import { PointerMark } from "./library/pointerMark";
import { CameraSystem } from "./system/cameraSystem";

const init = () => {
    console.log("init 0124");

    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);

    const canvasInitializer = new CanvasInitializer({ canvas: canvas });
    const ctx = canvasInitializer.ctx;
    const gameToCanvasScale = canvasInitializer.gameToCanvasScale;

    const drawer = new Drawer({ ctx: ctx, scale: gameToCanvasScale });

    const inputSystem = new InputSystem({drawer: drawer});
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

    const cameraSystem = new CameraSystem({system: systemList});

    const animalFactory = new AnimalFactory({ systemList: systemList });
    animalFactory.make({ number: 50, layers: ["animal"], speciesName: "boidA" });
    animalFactory.make({ number: 40, layers: ["animal"], speciesName: "boidA2" });
    animalFactory.make({ number: 20, layers: ["animal"], speciesName: "boidB", shapeColor: "#94E4A9", width: 15, height: 15, velocity: 0.3, });
    animalFactory.make({ number: 15, layers: ["animal"], speciesName: "boidB2", shapeColor: "#94E4A9", width: 15, height: 15, velocity: 0.3, });
    animalFactory.make({ number: 5, layers: ["animal"], speciesName: "boidC", shapeColor: "#FF8E87", width: 30, height: 30, velocity: 0.5, });

    const pointerMark = new PointerMark({systemList: systemList});

    const gameLoop = new GameLoop(() => {
        collisionSystem.update();
        updateSystem.update();
        renderSystem.draw();
    });
};
init();
