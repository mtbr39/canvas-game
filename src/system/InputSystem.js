import { GameObject } from "./gameObject";

export class InputSystem {
    constructor(option) {
        this.drawer = option.drawer;
        this.scaler = option.drawer.scaler();
        this.renderSystem = option.renderSystem;

        this.isPointerHold = false;
        this.isRightClick = false;
        this.prevClient = { x: 0, y: 0 };
        this.prevTouches = [];

        this.currentClient = { x: 0, y: 0 };

        this.handlers = { pointerdown: [], pointerdrag: [], pointerup: [], wheel: [], keydown: []};
        this.primeHandlersArray = { pointerdown: [], pointerdrag: [], pointerup: [], wheel: [], keydown: []};
        window.addEventListener("keydown", this.handleKeydown.bind(this));
        window.addEventListener("keyup", this.handleKeyup.bind(this));
        if (this.isMobileDevice()) {
            window.addEventListener("touchstart", this.handleTouchStart.bind(this), {
                passive: false,
            });
            window.addEventListener("touchmove", this.handleTouchMove.bind(this), {
                passive: false,
            });
            window.addEventListener("touchend", this.handleTouchEnd.bind(this), { passive: false });
        } else {
            window.addEventListener("pointerdown", this.handlePointerDown.bind(this));
            window.addEventListener("pointermove", this.handlePointerMove.bind(this));
            window.addEventListener("pointerup", this.handlePointerUp.bind(this));
        }
        window.addEventListener("contextmenu", function (ev) {
            ev.preventDefault();
        });
        window.addEventListener("wheel", this.handleWheel.bind(this), { passive: false });

        this.pinchDetector = new PinchDetector(
            this.handlePinchOut.bind(this),
            this.handlePinchIn.bind(this)
        );
    }

    submitHandler(option) {
        const eventName = option.eventName;
        const handler = option.handler;
        const primeNumber = option.primeNumber || null;
        if (primeNumber) {
            this.primeHandlersArray[eventName].push({ handler: handler, primeNumber: primeNumber });
            this.primeHandlersArray[eventName].sort((a, b) => a.primeNumber - b.primeNumber);
        } else {
            this.handlers[eventName].push(handler);
        }
    }

    dispatchHandler(eventName, ev) {
        let preventOtherHandlers = false;
        let activePrimeNumber = null;

        this.primeHandlersArray[eventName].forEach((array) => {
            if (preventOtherHandlers) {
                if (array.primeNumber < activePrimeNumber) {
                    array.handler(ev);
                }
            } else {
                preventOtherHandlers = array.handler(ev);
                activePrimeNumber = array.primeNumber;
            }
        });
        if (preventOtherHandlers) {
            return;
        }
        this.handlers[eventName].forEach((handler) => {
            handler(ev);
        });
    }

    handleKeydown(ev) {
        ev.client = this.getClientGamePoint(this.currentRawClient.x, this.currentRawClient.y);
        ev.screenPoint = this.getClientScreenPoint(this.currentRawClient.x, this.currentRawClient.y);

        this.dispatchHandler("keydown", ev);
    }

    handleKeyup(ev) {}

    handlePointerDown(ev) {
        this.isPointerHold = true;
        this.isRightClick = ev.button === 2;

        ev.client = this.getClientGamePoint(ev.clientX, ev.clientY);
        ev.screenPoint = this.getClientScreenPoint(ev.clientX, ev.clientY);

        this.dispatchHandler("pointerdown", ev);

        this.prevClient = ev.client;
    }

    handlePointerMove(ev) {
        this.isRightClick = ev.button === 2;

        this.currentRawClient = {x: ev.clientX, y: ev.clientY}; 

        ev.client = this.getClientGamePoint(ev.clientX, ev.clientY);

        const prevClient = this.prevClient;
        const currentClient = ev.client;
        const pointerDelta = {
            x: currentClient.x - prevClient.x,
            y: currentClient.y - prevClient.y,
        };
        ev.pointerDelta = pointerDelta;

        if (this.isPointerHold) {
            this.handlers["pointerdrag"].forEach((handler) => {
                handler(ev);
            });
        }
        // prevClientはマウス移動量(pointerDelta)を計算するため
        this.prevClient = currentClient;
    }

    handlePointerUp(ev) {
        this.isPointerHold = false;
        this.isRightClick = ev.button === 2;

        ev.client = this.getClientGamePoint(ev.clientX, ev.clientY);

        this.handlers["pointerup"].forEach((handler) => {
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

    handlePinchOut(ev) {
        ev.wheelValue = -1 * ev.pinchDelta * 4;
        this.handlers["wheel"].forEach((handler) => {
            handler(ev);
        });
    }

    handlePinchIn(ev) {
        ev.wheelValue = -1 * ev.pinchDelta * 4;
        this.handlers["wheel"].forEach((handler) => {
            handler(ev);
        });
    }

    handleTouchStart(ev) {
        ev.preventDefault();
        const touches = ev.touches;

        if (touches.length === 1) {
            this.isPointerHold = true;

            const touch = touches[0];
            this.prevTouches = [
                {
                    id: touch.identifier,
                    client: this.getClientGamePoint(touch.clientX, touch.clientY),
                    screenPoint: this.getClientScreenPoint(touch.clientX, touch.clientY),
                },
            ];
            ev.client = this.prevTouches[0].client;

            ev.screenPoint = this.prevTouches[0].screenPoint;

            ev.isMobile = this.isMobileDevice();

            this.dispatchHandler("pointerdown", ev);
        }
    }

    handleTouchMove(ev) {
        ev.preventDefault();
        const touches = ev.touches;

        if (touches.length === 1 && this.isPointerHold) {
            const touch = touches[0];
            if (touch.identifier == this.prevTouches[0].id) {
                const currentClient = this.getClientGamePoint(touch.clientX, touch.clientY);
                const pointerDelta = {
                    x: currentClient.x - this.prevTouches[0].client.x,
                    y: currentClient.y - this.prevTouches[0].client.y,
                };
                ev.pointerDelta = pointerDelta;

                ev.client = currentClient;

                ev.isMobile = this.isMobileDevice();

                this.handlers["pointerdrag"].forEach((handler) => {
                    handler(ev);
                });
                this.prevTouches = [{ id: touch.identifier, client: currentClient }];
            }
        }
    }

    handleTouchEnd(ev) {
        ev.preventDefault();
        this.isPointerHold = false;
        const touches = ev.touches;

        if (touches.length === 1) {
            const touchClient = { x: touches[0].clientX, y: touches[0].clientY };
            ev.client = this.getClientGamePoint(touchClient.x, touchClient.y);

            ev.isMobile = this.isMobileDevice();

            this.handlers["pointerup"].forEach((handler) => {
                handler(ev);
            });
        }
    }

    getClientGamePoint(_clientX, _clientY) {
        const clientX = _clientX * window.devicePixelRatio;
        const clientY = _clientY * window.devicePixelRatio;
        const [x, y] = this.scaler.inversePosition(clientX, clientY);
        const client = { x: x, y: y };
        return client;
    }

    getClientScreenPoint(_clientX, _clientY) {
        const clientX = _clientX * window.devicePixelRatio;
        const clientY = _clientY * window.devicePixelRatio;
        const [x, y] = this.scaler.inverseArray([clientX, clientY]);
        const client = { x: x, y: y };
        return client;
    }

    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );
    }
}

class PinchDetector {
    constructor(onPinchOut, onPinchIn) {
        this.onPinchOut = onPinchOut;
        this.onPinchIn = onPinchIn;

        this.initialDistance = 0;
        this.prevDistance = 0;

        window.addEventListener("touchstart", this.handleTouchStart.bind(this), { passive: false });
        window.addEventListener("touchmove", this.handleTouchMove.bind(this), { passive: false });
        window.addEventListener("touchend", this.handleTouchEnd.bind(this), { passive: false });
    }

    handleTouchStart(ev) {
        ev.preventDefault();
        const touches = ev.touches;

        if (touches.length === 2) {
            const distanceX = touches[0].clientX - touches[1].clientX;
            const distanceY = touches[0].clientY - touches[1].clientY;
            this.prevDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        }
    }

    handleTouchMove(ev) {
        ev.preventDefault();
        const touches = ev.touches;

        if (touches.length === 2) {
            const distanceX = touches[0].clientX - touches[1].clientX;
            const distanceY = touches[0].clientY - touches[1].clientY;
            const currentDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            const pinchDelta = currentDistance - this.prevDistance;

            ev.pinchDelta = pinchDelta;

            if (pinchDelta > 0) {
                // ピンチアウト
                this.onPinchOut && this.onPinchOut(ev);
            } else {
                // ピンチイン
                this.onPinchIn && this.onPinchIn(ev);
            }

            this.prevDistance = currentDistance;
        }
    }

    handleTouchEnd(ev) {
        ev.preventDefault();
        // ピンチジェスチャーが終了したときの処理
    }
}
