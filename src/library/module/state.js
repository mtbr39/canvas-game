export class State {
    handleInput(manager, actor, input) {
        throw new Error("This method must be overridden!");
    }

    update(actor) {
        throw new Error("This method must be overridden!");
    }
}

export class StateManager {
    constructor(option) {
        this.state = option.defaultState;
        this.actor = option.actor;

        this.stateCount = 0;
        this.doneOnce = false;
        this.doneOnceWait = false;
    }

    setState(state) {
        this.state = state;
        this.doneOnce = false;
    }

    handleInput(input) {
        this.state.handleInput(this, this.actor, input);
    }

    update() {
        this.state.update(this, this.actor);
    }

    // todo
    runOnce(runFunction) {
        if (!this.doneOnce) {
            runFunction();
            this.doneOnce = true;
        }
    }

    wait(waitTime, callback) {
        if (!this.doneOnceWait) {
            this.stateCount = waitTime;
            this.doneOnceWait = true;
        }
        this.stateCount--;
        if (this.stateCount < 0) {
            this.doneOnceWait = false;
            callback();
        }
    }
}