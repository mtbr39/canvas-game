import { io } from "socket.io-client";
import { EntityCreater } from "./entityCreater";

export class SocketSystem {
    constructor(option) {
        this.reson = option.reson;

        this.entityCreater = new EntityCreater();

        this.io = io();

        this.isHost = false;

        this.objects = [];

        this.playerControlledObjects = [];

        this.hostCallback = null;

        this.init();
    }

    init() {

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

                // serverUserDataは現在のすべてのUserData。これをもとに現在の様子を再現する
                Object.keys(serverUserData).forEach(key => {
                    const oneUserData = serverUserData[key];

                    // Hostの持っている共有オブジェクト情報をもらう
                    if (oneUserData.isHost === true) {
                        if (Array.isArray(oneUserData.share.syncObjects)) {

                            oneUserData.share.syncObjects.forEach((syncObject) => {

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
        this.io.on('userDataUpdated', (serverUserData) => {

            if (!this.isHost) {

                if (Array.isArray(serverUserData.data.share.syncObjects)) {
                    serverUserData.data.share.syncObjects.forEach((receivedObject) => {
                        this.objects.forEach((thisObject) => {
        
                            if (thisObject.id === receivedObject.id) {
        
                                thisObject.gameObject.x = receivedObject.gameObject.x;
                                thisObject.gameObject.y = receivedObject.gameObject.y;
    
                            }
        
                        });
                        
                    });
                }

            }

            if (serverUserData.data.share?.playerObjects && Array.isArray(serverUserData.data.share.playerObjects)) {
                serverUserData.data.share.playerObjects.forEach((receivedObject) => {

                    // console.log("-debug IDはなんなのか receivedObject", receivedObject.id);

                    let existSameIdObject = false;

                    this.playerControlledObjects.forEach((thisObject) => {
    
                        if (thisObject.id === receivedObject.id) {
                            existSameIdObject = true;

                            // thisObject.gameObject.x = receivedObject.gameObject.x;
                            // thisObject.gameObject.y = receivedObject.gameObject.y;

                        }

                    });

                    // IDが同じオブジェクトが無かった場合、作る。
                    if (!existSameIdObject) {
                        // const entity = EntityCreater.create(receivedObject.className, {id: receivedObject.id, isOtherPlayer: true});

                        // console.log("-debug IDはなんなのか2 receivedObject", receivedObject.id, entity);
                            
                        // this.reson.add(entity);
                    }
                    
                });
            }


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

    // オブジェクトを解除する
    unsubmit(object) {
        const index = this.objects.indexOf(object);
        if (index !== -1) {
            this.objects.splice(index, 1);
        }
    }
}