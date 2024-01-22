import { GameObject } from "./gameObject";

export class InputSystem {
    constructor(option) {
        this.drawer = option.drawer;
        this.scaler = option.drawer.scaler();

        this.isPointerHold = false;
        this.isRightClick = false;
        this.prevClient = {x:0,y:0}

        this.handlers = { pointerdown: [], pointerdrag: [], pointerup: [], wheel: [] };
        window.addEventListener("keydown", this.handleKeydown.bind(this));
        window.addEventListener("keyup", this.handleKeyup.bind(this));
        window.addEventListener("pointerdown", this.handlePointerDown.bind(this));
        window.addEventListener("pointermove", this.handlePointerMove.bind(this));
        window.addEventListener("pointerup", this.handlePointerUp.bind(this));
        window.addEventListener("contextmenu", function (ev) {
            ev.preventDefault();
        });
        window.addEventListener("wheel", this.handleWheel.bind(this), { passive: false });
    }

    submitHandler(option) {
        const eventName = option.eventName;
        const handler = option.handler;
        this.handlers[eventName].push(handler);
    }

    handleKeydown(event) {
        switch (event.key) {
            case "w":
            case "s":
                // velocity.speedY = 0;
                break;
            case "a":
            case "d":
                // velocity.speedX = 0;
                break;
        }
    }

    handleKeyup(event) {}

    handlePointerDown(ev) {
        this.isPointerHold = true;
        this.isRightClick = ev.button === 2;

        ev.client = this.getClientGamePoint(ev);

        this.handlers["pointerdown"].forEach((handler) => {
            handler(ev);
        });

        this.prevClient = ev.client;
    }

    handlePointerMove(ev) {
        this.isRightClick = ev.button === 2;
        
        ev.client = this.getClientGamePoint(ev);

        const prevClient = this.prevClient;
        const currentClient = ev.client;
        const pointerDelta = {x: currentClient.x - prevClient.x, y: currentClient.y - prevClient.y};
        ev.pointerDelta = pointerDelta;

        if (this.isPointerHold) {
            this.handlers["pointerdrag"].forEach((handler) => {
                handler(ev);
            });
        }

        this.prevClient = currentClient;
    }

    handlePointerUp(ev) {
        this.isPointerHold = false;
        this.isRightClick = ev.button === 2;
        
        ev.client = this.getClientGamePoint(ev);

        this.handlers["pointerup"].forEach((handler) => {
            handler(ev);
        });
    }

    handleScroll(ev) {
        // ev.preventDefault();
        console.log("handle-debug");
        this.handlers["scroll"].forEach((handler) => {
            handler(ev);
        });
    }
    handleWheel(ev) {
        ev.preventDefault();
        const wheelValue = ev.deltaY || ev.wheelDelta;

        ev.wheelValue = wheelValue;

        this.handlers["wheel"].forEach((handler) => {
            handler(ev);
        });
    }

    getClientGamePoint(ev) {
        const clientX = ev.clientX * window.devicePixelRatio;
        const clientY = ev.clientY * window.devicePixelRatio;
        const [x, y] = this.scaler.inversePosition(clientX, clientY);
        const client = { x: x, y: y };
        return client;
    }
}

// // 使用例
// const pinchZoomDetector = new PinchZoomDetector(
//     document.getElementById("yourElementId"),
//     () => { console.log("Pinch Out"); },
//     () => { console.log("Pinch In"); }
// );
class PinchZoomDetector {
    constructor(element, onPinchOut, onPinchIn) {
        this.element = element;
        this.onPinchOut = onPinchOut;
        this.onPinchIn = onPinchIn;

        this.initialDistance = 0;

        this.element.addEventListener("touchstart", this.handleTouchStart.bind(this));
        this.element.addEventListener("touchmove", this.handleTouchMove.bind(this));
        this.element.addEventListener("touchend", this.handleTouchEnd.bind(this));
    }

    handleTouchStart(event) {
        const touches = event.touches;
        
        if (touches.length === 2) {
            const distanceX = touches[0].clientX - touches[1].clientX;
            const distanceY = touches[0].clientY - touches[1].clientY;
            this.initialDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        }
    }

    handleTouchMove(event) {
        const touches = event.touches;

        if (touches.length === 2) {
            const distanceX = touches[0].clientX - touches[1].clientX;
            const distanceY = touches[0].clientY - touches[1].clientY;
            const currentDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

            if (currentDistance > this.initialDistance) {
                // ピンチアウト
                this.onPinchOut && this.onPinchOut(event);
            } else {
                // ピンチイン
                this.onPinchIn && this.onPinchIn(event);
            }
        }
    }

    handleTouchEnd(event) {
        // ピンチジェスチャーが終了したときの処理
    }
}
