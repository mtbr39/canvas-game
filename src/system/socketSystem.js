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
        this.isCheckedClientRequest = false;

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

                                console.log("hostobjもらった-debug");
                                // Host管理オブジェクト(syncObject)は、接続時に作成
                                // ちなみに、プレイヤーオブジェクト(playerObject)は更新イベントのときに
                                const entity = EntityCreater.create(syncObject.className, {id: syncObject.id, isSelfDriven: false});
                                
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

            function assignObjects(thisObjects, receivedObject) {

                let existSameIdObject = false;

                thisObjects.forEach((thisObject) => {
                    // ここでのthisObjectやreceivedObjectの具体例は、Minion, Championクラスなど。子要素にidや、gameObjectを持つ。
                    if (thisObject.id === receivedObject.id) {

                        existSameIdObject = true;
                        SocketSystem.deepAssign(thisObject, receivedObject);

                    }

                });

                return existSameIdObject;
            }

            // リクエストオブジェクト
            // Hostならば、リクエストオブジェクトを処理する
            if (this.isHost) {

                if (serverUserData?.data?.share?.requestObjects && Array.isArray(serverUserData.data.share.requestObjects)) {
                    serverUserData.data.share.requestObjects.forEach((requestObject) => {

                        console.log("req-debug", requestObject);
                        assignObjects(this.objects, requestObject);

                    });
                }

            }

            // ホストオブジェクト
            if (!this.isHost) {

                // Hostでないならば、objectsの共有情報を更新する
                if (Array.isArray(serverUserData.data.share.syncObjects)) {
                    serverUserData.data.share.syncObjects.forEach((receivedObject) => {

                        assignObjects(this.objects, receivedObject);

                        this.previousHostObjects = deepCopy(this.objects);
                        // this.isCheckedClientRequest = false

                    });
                }

            }

            // プレイヤーオブジェクト
            // プレイヤーオブジェクトの共有情報を更新する
            // Host、非Hostどちらも行うので、Hostかどうかのチェックはない
            if (serverUserData.data.share?.playerObjects && Array.isArray(serverUserData.data.share.playerObjects)) {
                serverUserData.data.share.playerObjects.forEach((receivedObject) => {

                    // 自分である場合はスキップ
                    function isOwnControlled(playerControlledObjects, receivedObject) {
                        let isOwnControlled = false;
                        playerControlledObjects.forEach((playerControlledObject) => {
                            if (receivedObject.id === playerControlledObject.id) {
                                isOwnControlled = true;
                            }
                        });
    
                        return isOwnControlled;
                    }

                    if (isOwnControlled(this.playerControlledObjects, receivedObject)) {
                        return;
                    }

                    const existSameIdObject = assignObjects(this.otherControlledObjects, receivedObject);

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
        const intervalEmit = 5; // 非ホストがemitする、フレーム間隔

        this.updateCount++;
        if (this.updateCount > 1000) {
            this.updateCount = 0;
        }
        
        const data = {};
    
        data.playerObjects = this.playerControlledObjects;

        if (this.isHost) {

            data.syncObjects = this.objects;
            data.playerObjects = this.playerControlledObjects;

            this.io.emit('updateUserData', { share: data });

        } else {

            data.playerObjects = this.playerControlledObjects;

            {

                // if (!this.isCheckedClientRequest) {
                    this.isCheckedClientRequest = true;
                    
                    const concatHostObjects = deepCopy(this.objects);

                    if (this.previousHostObjects && !arrayEquals(this.previousHostObjects, concatHostObjects)) {
                        
                        console.log("not-eq-debug", arrayEquals(this.previousHostObjects, concatHostObjects), this.previousHostObjects, concatHostObjects);

                        data.requestObjects = concatHostObjects;
    
                    }
        
                    this.previousHostObjects = concatHostObjects;
                // }

            }

            this.io.emit('updateUserData', { share: data });
            // if (this.updateCount % intervalEmit === 0) {
            //     this.io.emit('updateUserData', { share: data });
            // }

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

    static deepAssign = function (targetObject, sourceObject) {
        // syncRulesが定義されていれば、そのルールに従ってコピーを制御する
        if (sourceObject.syncRules && sourceObject.syncRules.disableObjectNames) {
            const disableList = sourceObject.syncRules.disableObjectNames;
    
            for (let key in sourceObject) {
                // disableListに含まれているオブジェクト名は無視
                if (disableList.includes(key)) continue;
    
                if (sourceObject.hasOwnProperty(key)) {
                    // ネストされたオブジェクトの場合、再帰的にdeepAssign
                    if (typeof sourceObject[key] === 'object' && sourceObject[key] !== null) {
                        if (!targetObject[key]) {
                            targetObject[key] = Array.isArray(sourceObject[key]) ? [] : {};
                        }
                        SocketSystem.deepAssign(targetObject[key], sourceObject[key]);
                    } else {
                        targetObject[key] = sourceObject[key];
                    }
                }
            }
        } else {
            // syncRulesがない場合、通常のdeepAssign
            for (let key in sourceObject) {
                if (sourceObject.hasOwnProperty(key)) {
                    if (typeof sourceObject[key] === 'object' && sourceObject[key] !== null) {
                        if (!targetObject[key]) {
                            targetObject[key] = Array.isArray(sourceObject[key]) ? [] : {};
                        }
                        SocketSystem.deepAssign(targetObject[key], sourceObject[key]);
                    } else {
                        targetObject[key] = sourceObject[key];
                    }
                }
            }
        }
    };
    
}

function arrayEquals2(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

// 配列同士を比較する関数（オブジェクトの再帰的な比較を含む）
function arrayEquals(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (!deepEqual(arr1[i], arr2[i])) {
            // console.log("not-deep-eq-debug", arr1[i], arr2[i]);
            return false;
        }
    }
    return true;
}

// オブジェクトや配列を再帰的に比較する関数
function deepEqual(obj1, obj2) {
    if (obj1 === obj2) {
        return true;
    }

    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
        return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
        
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
            console.log("SocketSystem::deepEqual # not-equal-property", key, obj1.constructor.name, obj1[key], obj2[key], );
            return false;
        }
    }

    return true;
}

function deepCopy(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(deepCopy);
    }

    const copy = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            copy[key] = deepCopy(obj[key]);
        }
    }

    return copy;
}