import { io } from "socket.io-client";
import { EntityCreater } from "./entityCreater";

// todo : Hostがいなくなった場合のHost変更処理
export class SocketSystem {
    constructor(option) {
        this.reson = option.reson;

        this.entityCreater = new EntityCreater();

        this.io = null;

        this.isHost = false;

        this.objects = [];                  // ホストオブジェクト : Hostが非Hostに送信する

        this.playerControlledObjects = [];  // 自プレイヤーオブジェクト : 他の人に位置を伝える

        this.otherControlledObjects = [];   // 他プレイヤーオブジェクト : 他の人から位置を受信する

        this.requestObjects = [];

        this.hostCallback = null;

        this.mySocketId = null;

        this.updateCount = 0;

        this.prevRequestObjects = [];      // 前フレームのホストオブジェクト情報 : ホストオブジェクトへの変更を検知するため

        this.holdRequestObjects = [];       // 保持リクエストオブジェクト : 検知したリクエストオブジェクトを送信するまでの間、保持しておくため

        // this.init();
    }

    init() {
        this.io = io();

        this.io.on('connect', () => {
            this.mySocketId = this.io.id;
        });

        // 接続時に受診する現在の汎用データ
        this.io.on('currentUserData', (serverUserData) => {

            // isHostがあるか
            let existHost = false;
            Object.keys(serverUserData).forEach(key => {
                const oneUserData = serverUserData[key];
                
                if (oneUserData.isHost === true) {
                    existHost = true;
                }
            });

            if (!existHost) {
                this.isHost = true;
                this.io.emit('updateUserData', { isHost: true });
                console.log("あなたはHostです。", this.io.id);

                if (this.hostCallback) {
                    this.hostCallback();
                }

            } else {
                console.log("あなたはHostではありません。", this.io.id);


            }

            // サーバー上のデータのうち、自分のデータのisHostがtrueになっていた場合、this.isHostもtrueに更新する
            const ownData = serverUserData[this.mySocketId];
            if (ownData?.isHost) {
                this.isHost = true;
                console.log("あなたはHostになりました。", this.mySocketId);
            }

        });
    
        // 汎用データ更新時
        // io.emit('userDataUpdated', { id: socket.id, data: userData[socket.id] });
        // userData[socket.id] とあるように、更新したクライアントだけを受信する
        this.io.on('userDataUpdated', (serverUserData) => {
            // console.log("serverUserData確認デバッグ", serverUserData);

            const socketId = serverUserData.socketId;

            if (socketId === this.mySocketId) {
                return;
            }

            const isHostSend = serverUserData.data?.isHost; // 送信者がホストかどうか
            
            // リクエストオブジェクト
            // Hostならば、リクエストオブジェクトを処理する
            if (this.isHost) {

                const requestObjects = serverUserData.data?.share?.requestObjects;

                if (Array.isArray(requestObjects) && requestObjects.length > 0) {
                    
                    assignObjects(this.objects, requestObjects, this.reson);

                }

            }

            // ホストオブジェクト
            if (!this.isHost && isHostSend) {
                
                // Hostでないならば、objectsの共有情報を更新する
                const syncObjects = serverUserData.data?.share?.syncObjects;

                if (Array.isArray(syncObjects)) {
                    
                    assignObjects(this.objects, syncObjects, this.reson);

                }

                this.prevRequestObjects = this.objects.map(obj => extractSyncData(obj, 'request'));

            }

            // プレイヤーオブジェクト
            // プレイヤーオブジェクトの共有情報を更新する
            // Host、非Hostどちらも行うので、Hostかどうかのチェックはない
            const playerObjects = serverUserData.data?.share?.playerObjects;

            if (Array.isArray(playerObjects)) {
                
                assignObjects(this.otherControlledObjects, playerObjects, this.reson);

            }

        });


        this.io.on('userDisconnected', (serverUserData) => {

            const playerObjects = serverUserData.data?.share?.playerObjects;

            if (Array.isArray(playerObjects)) {

                playerObjects.forEach((playerObject) => {
                    this.otherControlledObjects.forEach((otherControlledObject) => {

                        if (otherControlledObject.id === playerObject.id) {

                            this.reson.remove(otherControlledObject);

                        }

                    });
                });

            }

        });
    }

    update() {
        if (!this.io) {
            return;
        }

        const intervalEmit = 30; // 非ホストがemitする、フレーム間隔

        this.updateCount++;
        if (this.updateCount > 1000) {
            this.updateCount = 0;
        }
        
        const data = {};
    
        data.playerObjects = this.playerControlledObjects;

        if (this.isHost) {
            // ホストはsyncObjects, playerObjectsを毎フレーム送信する

            const syncObjects = [];
            this.objects.forEach((obj) => {
                syncObjects.push( extractSyncData(obj, 'host') );
            });

            data.syncObjects = syncObjects;

            const playerObjects = [];
            this.playerControlledObjects.forEach((obj) => {
                playerObjects.push( extractSyncData(obj, 'client') );
            });

            data.playerObjects = playerObjects;

            // this.io.emit('updateUserData', { share: data });
            if (this.updateCount % intervalEmit === 0) {
                this.io.emit('updateUserData', { share: data });
            }

        } else {
            // クライアントはplayerObjects, requestObjectsをたまに送信する
            // requestObjects: クライアントによって変更したものを検知して送信する

            const playerObjects = [];
            this.playerControlledObjects.forEach((obj) => {
                playerObjects.push( extractSyncData(obj, 'client') );
            });

            data.playerObjects = playerObjects;

            const requestObjects = [];
            // this.requestObjects.forEach((obj) => {
            //     requestObjects.push( extractSyncData(obj, 'request') );
            // });

            const changedRequestObjects = [];


            this.requestObjects.forEach((obj, index) => {
                // 現在の状態を取得
                const currentData = extractSyncData(obj, 'request');
                const prevData = this.prevRequestObjects[index] || {};
            
                const changes = {};
            
                // 必ず含める項目
                changes['id'] = obj['id'];
                changes['className'] = obj['className'];
            
                // 前回と異なる項目のみを収集
                let hasOtherChanges = false;
                for (let key in currentData) {
                    if (currentData[key] !== prevData[key]) {
                        changes[key] = currentData[key];
                        hasOtherChanges = true;
                        // console.log("info: Change Key", key, currentData[key], prevData[key], prevData);
                    }
                }
            
                if (hasOtherChanges) {
                    changedRequestObjects.push(changes);
                }
            });

            this.prevRequestObjects = this.requestObjects.map(obj => extractSyncData(obj, 'request'));

            if (changedRequestObjects.length > 0) {
                this.holdRequestObjects = changedRequestObjects;
            }

            // this.io.emit('updateUserData', { share: data });
            if (this.updateCount % intervalEmit === 0) {
                
                data.requestObjects = this.holdRequestObjects;

                this.io.emit('updateUserData', { share: data });

                this.holdRequestObjects = [];
            }

        }
    
        
    }

    // オブジェクトを登録する
    submit(object) {
        
        this.objects.push(object);
    }

    // playerControlledObjects :
    // プレイヤー側(クライアント側)でコントロールするもの
    // ホストも、ホストでないものも位置を送信するもの
    submitPlayerControlledObject(object) {

        this.playerControlledObjects.push(object);
    }

    submitOtherControlledObject(object) {

        this.otherControlledObjects.push(object);
    }

    submitRequestObject(object) {

        this.requestObjects.push(object);
    }

    // オブジェクトを解除する
    unsubmit(object) {
        const index = this.objects.indexOf(object);
        if (index !== -1) {
            this.objects.splice(index, 1);
        }
    }

}

function extractSyncData(obj, syncType) {
    const syncData = {};
    obj.syncRules[syncType].forEach((property) => {
        const keys = property.split('.');
        let value = obj;
        for (let key of keys) {
            if (value[key] !== undefined) {
                value = value[key];
            } else {
                value = undefined;
                break;
            }
        }
        syncData[property] = value;
    });
    // 必ず含める項目
    syncData['id'] = obj['id'];
    syncData['className'] = obj['className'];

    return syncData;
}

function applySyncData(obj, syncData) {
    Object.keys(syncData).forEach((property) => {
        const keys = property.split('.');
        let target = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            if (target[keys[i]] === undefined) {
                target[keys[i]] = {}; // プロパティがない場合はオブジェクトを作成
            }
            target = target[keys[i]];
        }
        target[keys[keys.length - 1]] = syncData[property]; // 最後のキーに値を設定
    });
}

function assignObjects(thisObjects, receivedObjects, reson) {

    receivedObjects.forEach((receivedObject) => {

        let existSameIdObject = false;

        thisObjects.forEach((thisObject) => {
            // ここでのthisObjectやreceivedObjectの具体例は、Minion, Championクラスなど。子要素にidや、gameObjectを持つ。
            if (thisObject.id === receivedObject.id) {

                existSameIdObject = true;
                applySyncData(thisObject, receivedObject);

            }

        });

        if (!existSameIdObject) {

            const entity = EntityCreater.create(receivedObject.className, {id: receivedObject.id, isOtherPlayer: true});

            reson.add(entity);
            
        }

    });

}
