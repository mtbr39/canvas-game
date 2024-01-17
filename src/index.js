import { GameObject } from "./gameObject";
import { RenderSystem } from "./renderSystem";
import { Drawer } from "./drawer";
import { Animal } from "./animal";

const init = () => {
  console.log("init 0116");
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

  const renderSystem = new RenderSystem({objects: objects});

  function gameLoop() {
    
    // let countTest = 0;
    // for (let i = 0; i < objects.length; i++) {
    //   for (let j = 0; j < objects.length; j++) {
    //     if (objects[i].name === objects[j].name) {
    //       objects[i].collidesWith(objects[j]);
    //     }
    //   }
    // }

    renderSystem.draw();


    requestAnimationFrame(gameLoop);
  }
  gameLoop();
};
init();
