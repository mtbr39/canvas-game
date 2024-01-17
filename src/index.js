import { GameObject } from "./gameObject";
import { RenderSystem } from "./renderSystem";
import { Drawer } from "./drawer";
import { Animal } from "./animal";
import { CollisionSystem } from "./collisionSystem";
import { UpdateSystem } from "./updateSystem";

const init = () => {
  console.log("init 0118");
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);

  let cssCanvasSize = {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  };
  let pixelRatioCanvasSize = {
    width: cssCanvasSize.width * window.devicePixelRatio,
    height: cssCanvasSize.height * window.devicePixelRatio,
  };
  canvas.width = pixelRatioCanvasSize.width;
  canvas.height = pixelRatioCanvasSize.height;
  const canvasAreaRatio = 0.001 * 2.0;
  let gameToCanvasScale =
    Math.sqrt(canvas.width * canvas.height) * canvasAreaRatio; // canvasのピクセル面積に対して描写比率を決定

  function resizeCanvas() {
    canvas.style.width = `${cssCanvasSize.width}px`;
    canvas.style.height = `${cssCanvasSize.height}px`;
    canvas.width = pixelRatioCanvasSize.width;
    canvas.height = pixelRatioCanvasSize.height;
  }
  resizeCanvas();

  const ctx = canvas.getContext("2d");
  if (ctx === null) {
    console.log("init error : ctx is null.");
    return;
  }

  const drawer = new Drawer({ctx: ctx, scale: gameToCanvasScale});  

  let objects = [];
  for (let i = 0; i < 10; i++) {
    objects.push(new Animal({drawer: drawer}));

  }

  const collisionSystem = new CollisionSystem({objects: objects});
  const updateSystem = new UpdateSystem({objects: objects});
  const renderSystem = new RenderSystem({objects: objects, ctx: ctx});

  function gameLoop() {
    
    collisionSystem.update();
    updateSystem.update();
    renderSystem.draw();

    requestAnimationFrame(gameLoop);
  }
  gameLoop();
};
init();
