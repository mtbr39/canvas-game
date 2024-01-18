import { CanvasInitializer } from "./system/canvasInitializer";
import { Drawer } from "./system/drawer";
import { CollisionSystem } from "./system/collisionSystem";
import { UpdateSystem } from "./system/updateSystem";
import { RenderSystem } from "./system/renderSystem";
import { GameLoop } from "./system/gameLoop";
import { Animal } from "./animal";
import { AnimalFactory } from "./library/animalFactory";

const init = () => {
    console.log("init 0118");

    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);

    const canvasInitializer = new CanvasInitializer({canvas: canvas});
    const ctx = canvasInitializer.ctx;
    const gameToCanvasScale = canvasInitializer.gameToCanvasScale;

    const drawer = new Drawer({ ctx: ctx, scale: gameToCanvasScale});

    const collisionSystem = new CollisionSystem({});
    const updateSystem = new UpdateSystem({});
    const renderSystem = new RenderSystem({ ctx: ctx });
    const systemList = {drawer: drawer, collision: collisionSystem, update: updateSystem, render: renderSystem};

    const animalFactory = new AnimalFactory({systemList: systemList});
    animalFactory.make({ number: 80, layers: ["animal"], speciesName: "boidA" });
    animalFactory.make({ number: 80, layers: ["animal"], speciesName: "boidB", shapeColor: "#94E4A9" });

    const gameLoop = new GameLoop(() => {
        collisionSystem.update();
        updateSystem.update();
        renderSystem.draw();
    });
    
};
init();
