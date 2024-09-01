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

                // serverUserDataは現在のすべてのUserData。これをもとに現在の様子を再現する
                Object.keys(serverUserData).forEach(key => {
                    const oneUserData = serverUserData[key];

                    // Hostの持っている共有オブジェクト情報をもらう
                    if (oneUserData.isHost === true) {
                        if (Array.isArray(oneUserData.share.syncObjects)) {

                            oneUserData.share.syncObjects.forEach((syncObject) => {

                                // Host管理オブジェクト(syncObject)は、接続時に作成
                                // ちなみに、プレイヤーオブジェクト(playerObject)は更新イベントのときに
                                const entity = EntityCreater.create(syncObject.className, {id: syncObject.id});
                                
                                this.reson.add(entity);
    
                            });

                        }
                    }
                    
                    // 接続時の他のプレイヤーオブジェクトの生成
                    if (oneUserData.share.playerObjects && Array.isArray(oneUserData.share.playerObjects)) {

                        oneUserData.share.playerObjects.forEach((syncObject) => {

                            const entity = EntityCreater.create(syncObject.className, {id: syncObject.id, isOtherPlayer: true});
                            
                            this.reson.add(entity);

                        });

                    }
                    
                });

            }

        });
    
        // 汎用データ更新時
        // io.emit('userDataUpdated', { id: socket.id, data: userData[socket.id] });
        // userData[socket.id] とあるように、更新したクライアントだけを受信する
        this.io.on('userDataUpdated', (serverUserData) => {
            // console.log("serverUserData確認デバッグ", serverUserData);

            if (!this.isHost) {

                // Hostでないならば、objectsの共有情報を更新する
                if (Array.isArray(serverUserData.data.share.syncObjects)) {
                    serverUserData.data.share.syncObjects.forEach((receivedObject) => {
                        this.objects.forEach((thisObject) => {
        
                            if (thisObject.id === receivedObject.id) {
        
                                // thisObject.gameObject.x = receivedObject.gameObject.x;
                                // thisObject.gameObject.y = receivedObject.gameObject.y;

                                SocketSystem.deepAssign(thisObject, receivedObject);
    
                            }
        
                        });
                        
                    });
                }

            }

            // プレイヤーオブジェクトの共有情報を更新する
            // Host、非Hostどちらも行うので、Hostかどうかのチェックはない
            if (serverUserData.data.share?.playerObjects && Array.isArray(serverUserData.data.share.playerObjects)) {
                serverUserData.data.share.playerObjects.forEach((receivedObject) => {

                    // 自分である場合はスキップ
                    {
                        let isOwnControlled = false;
                        this.playerControlledObjects.forEach((playerControlledObject) => {
                            if (receivedObject.id === playerControlledObject.id) {
                                isOwnControlled = true;
                            }
                        });
    
                        if (isOwnControlled) {
                            return;
                        }
                    }

                    let existSameIdObject = false;

                    this.otherControlledObjects.forEach((thisObject) => {
    
                        // ここでのthisObjectやreceivedObjectの具体例は、Minion, Championクラスなど。子要素にidや、gameObjectを持つ。
                        if (thisObject.id === receivedObject.id) {
                            existSameIdObject = true;

                            // thisObject.gameObject.x = receivedObject.gameObject.x;
                            // thisObject.gameObject.y = receivedObject.gameObject.y;

                            SocketSystem.deepAssign(thisObject, receivedObject);

                        }

                    });

                    // IDが同じオブジェクトが無かった場合、作る。
                    if (!existSameIdObject) {
                        const entity = EntityCreater.create(receivedObject.className, {id: receivedObject.id, isOtherPlayer: true});

                        this.reson.add(entity);
                    }
                    
                });
            }


        });


        this.io.on('userDisconnected', (received) => {
            const userData = received.data;

            userData.share.playerObjects.forEach((playerObject) => {

                this.otherControlledObjects.forEach((otherControlledObject) => {

                    if (otherControlledObject.id === playerObject.id) {

                        this.reson.remove(otherControlledObject);

                    }

                });

            });
        });
    }

    update() {
        const data = {};
    
        if (this.isHost) {
            data.syncObjects = this.objects;
        }
    
        data.playerObjects = this.playerControlledObjects;
    
        this.io.emit('updateUserData', { share: data });
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

    static deepAssign(target, source) {
        // ソースがオブジェクトでない場合、またはターゲットがオブジェクトでない場合はコピーしない
        if (typeof target !== 'object' || target === null || typeof source !== 'object' || source === null) {
            return;
        }
    
        // source のプロパティをすべて繰り返し処理
        for (const key of Object.keys(source)) {
            // もしプロパティがオブジェクトであれば、再帰的にコピー
            if (typeof source[key] === 'object' && source[key] !== null) {
                // ターゲットに対応するプロパティがオブジェクトでない場合、空オブジェクトを初期化
                if (typeof target[key] !== 'object' || target[key] === null) {
                    target[key] = Array.isArray(source[key]) ? [] : {};
                }
                // 再帰的にプロパティをコピー
                SocketSystem.deepAssign(target[key], source[key]);
            } else {
                // そうでなければ、単純にプロパティをコピー
                target[key] = source[key];
            }
        }
    }
}