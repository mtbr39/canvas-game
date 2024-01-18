import { CanvasInitializer } from "./system/canvasInitializer";
import { Drawer } from "./system/drawer";
import { CollisionSystem } from "./system/collisionSystem";
import { UpdateSystem } from "./system/updateSystem";
import { RenderSystem } from "./system/renderSystem";
import { GameLoop } from "./system/gameLoop";
import { Animal } from "./animal";

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

    let objects = [];
    for (let i = 0; i < 50; i++) {
        objects.push(new Animal({ systemList: systemList, speciesName: "boidA" }));
    }

    
    

    const gameLoop = new GameLoop(() => {
        collisionSystem.update();
        updateSystem.update();
        renderSystem.draw();
    });
    
};
init();
