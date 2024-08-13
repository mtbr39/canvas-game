export class EventSystem {
    constructor(option) {
        this.objects = [];
        this.events = {}; // イベント名とリスナーを管理するためのオブジェクト
    }

    // イベントのリスナーを登録する
    on(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }

    // イベントのリスナーを解除する
    off(eventName, callback) {
        if (!this.events[eventName]) return;
        const index = this.events[eventName].indexOf(callback);
        if (index !== -1) {
            this.events[eventName].splice(index, 1);
        }
    }

    // イベントを送信する
    send(eventName, data) {
        if (!this.events[eventName]) return;
        this.events[eventName].forEach(callback => callback(data));
    }

    // オブジェクトを登録する
    submit(object) {

        object.eventConfigs.forEach((eventConfig) => {
            const {eventName, callback} = eventConfig;

            this.on(eventName, callback);

        });
        
        this.objects.push(object);
    }

    // オブジェクトを解除する
    unsubmit(object) {
        const index = this.objects.indexOf(object);
        if (index !== -1) {
            this.objects.splice(index, 1);
        }
    }
}