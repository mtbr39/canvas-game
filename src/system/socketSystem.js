import { io } from "socket.io-client";
import { EntityCreater } from "./entityCreater";

// todo : Hostがいなくなった場合のHost変更処理
export class SocketSystem {
    constructor(option) {
        this.reson = option.reson;

        this.entityCreater = new EntityCreater();

        this.io = io();

        this.isHost = false;

        this.objects = [];                  // ホストオブジェクト : Hostが非Hostに送信する

        this.playerControlledObjects = [];  // 自プレイヤーオブジェクト : 他の人に位置を伝える

        this.otherControlledObjects = [];   // 他プレイヤーオブジェクト : 他の人から位置を受信する

        this.hostCallback = null;

        this.mySocketId = null;

        this.updateCount = 0;

        this.previousHostObjects = [];      // 前フレームのホストオブジェクト情報 : ホストオブジェクトへの変更を検知するため

        this.holdRequestObjects = [];       // 保持リクエストオブジェクト : 検知したリクエストオブジェクトを送信するまでの間、保持しておくため

        this.init();
    }

    init() {

        // 接続時に受診する現在の汎用データ
        this.io.on('currentUserData', (serverUserData) => {

            this.mySocketId = this.io.id;

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

        });
    
        // 汎用データ更新時
        // io.emit('userDataUpdated', { id: socket.id, data: userData[socket.id] });
        // userData[socket.id] とあるように、更新したクライアントだけを受信する
        this.io.on('userDataUpdated', (serverUserData) => {
            // console.log("serverUserData確認デバッグ", serverUserData);

            const isHostSend = serverUserData.data?.isHost; // 送信者がホストかどうか

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





                // return existSameIdObject;
            }
            
            // リクエストオブジェクト
            // Hostならば、リクエストオブジェクトを処理する
            if (this.isHost) {

                // if (serverUserData?.data?.share?.requestObjects && Array.isArray(serverUserData.data.share.requestObjects)) {
                //     serverUserData.data.share.requestObjects.forEach((requestObject) => {

                //         assignObjects(this.objects, requestObject);

                //     });
                // }

            }

            // ホストオブジェクト
            if (!this.isHost && isHostSend) {
                
                // Hostでないならば、objectsの共有情報を更新する
                const syncObjects = serverUserData.data?.share?.syncObjects;

                if (Array.isArray(syncObjects)) {
                    
                    assignObjects(this.objects, syncObjects, this.reson) ;



                }

            }

            // プレイヤーオブジェクト
            // プレイヤーオブジェクトの共有情報を更新する
            // Host、非Hostどちらも行うので、Hostかどうかのチェックはない
            // if (serverUserData.data.share?.playerObjects && Array.isArray(serverUserData.data.share.playerObjects)) {
            //     serverUserData.data.share.playerObjects.forEach((receivedObject) => {

            //         // 自分である場合はスキップ
            //         function isOwnControlled(playerControlledObjects, receivedObject) {
            //             let isOwnControlled = false;
            //             playerControlledObjects.forEach((playerControlledObject) => {
            //                 if (receivedObject.id === playerControlledObject.id) {
            //                     isOwnControlled = true;
            //                 }
            //             });
    
            //             return isOwnControlled;
            //         }

            //         if (isOwnControlled(this.playerControlledObjects, receivedObject)) {
            //             return;
            //         }

            //         const existSameIdObject = assignObjects(this.otherControlledObjects, receivedObject);

            //         // IDが同じオブジェクトが無かった場合、作る。
            //         if (!existSameIdObject) {
            //             const entity = EntityCreater.create(receivedObject.className, {id: receivedObject.id, isOtherPlayer: true});

            //             this.reson.add(entity);
            //         }
                    
            //     });
            // }


        });


        this.io.on('userDisconnected', (received) => {
            const userData = received.data;

            // userData.share.playerObjects.forEach((playerObject) => {

            //     this.otherControlledObjects.forEach((otherControlledObject) => {

            //         if (otherControlledObject.id === playerObject.id) {

            //             this.reson.remove(otherControlledObject);

            //         }

            //     });

            // });
        });
    }

    update() {
        const intervalEmit = 5; // 非ホストがemitする、フレーム間隔

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
            
            // data.syncObjects = this.objects;
            // data.playerObjects = this.playerControlledObjects;

            this.io.emit('updateUserData', { share: data });
            if (this.updateCount % intervalEmit === 0) {
                // this.io.emit('updateUserData', { share: data });
            }

        } else {
            // クライアントはplayerObjects, requestObjectsをたまに送信する
            // requestObjects: クライアントによって変更したものを検知して送信する

            data.playerObjects = this.playerControlledObjects;

            {
                // const concatHostObjects = deepCopy(this.objects);

                // if (this.previousHostObjects && !arrayEquals(this.previousHostObjects, concatHostObjects)) {
                    
                //     // console.log("info: SocketSystem::update : not-equal", arrayEquals(this.previousHostObjects, concatHostObjects), this.previousHostObjects, concatHostObjects);

                //     this.holdRequestObjects = concatHostObjects;

                //     // data.requestObjects = concatHostObjects;
                // }
    
                // this.previousHostObjects = concatHostObjects;
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






