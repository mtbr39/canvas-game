import { RenderSystem } from "./renderSystem";
import { Drawer } from "./drawer";
import { Animal } from "./animal";
import { CollisionSystem } from "./collisionSystem";
import { UpdateSystem } from "./updateSystem";
import { CanvasInitializer } from "./canvasInitializer";
import { GameLoop } from "./gameLoop";

const init = () => {
    console.log("init 0118");

    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);

    const canvasInitializer = new CanvasInitializer({canvas: canvas});
    const ctx = canvasInitializer.ctx;
    const gameToCanvasScale = canvasInitializer.gameToCanvasScale;

    const drawer = new Drawer({ ctx: ctx, scale: gameToCanvasScale });

    let objects = [];
    for (let i = 0; i < 10; i++) {
        objects.push(new Animal({ drawer: drawer }));
    }

    const collisionSystem = new CollisionSystem({ objects: objects });
    const updateSystem = new UpdateSystem({ objects: objects });
    const renderSystem = new RenderSystem({ objects: objects, ctx: ctx });

    const gameLoop = new GameLoop(() => {
        collisionSystem.update();
        updateSystem.update();
        renderSystem.draw();
    });
    
};
init();
