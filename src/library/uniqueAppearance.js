export class UniqueAppearance {
    constructor(option = {}) {
        this.renderSystem = option.renderSystem;
        this.renderSystem.submit(this);

        this.gameObject = option.gameObject;
        this.drawer = option.drawer;

        this.symmetryStyle = Math.floor( Math.random() * 3 );
        this.decorationValues = []; //shape, offset(x,y), size(width, height)
        const decorationLength = 1 * Math.floor(Math.random()*3)
        for(let i=0; i<decorationLength; i++) {
            this.decorationValues.push(this.generateDecoration());
        }

        this.eyeSize = 0.08;
        this.eyeDistance = 0.3;     //中心からの目の距離
        this.eyeGap = 0.2*Math.PI; //目同士の距離
    }

    draw() {
        const g = this.gameObject;
        this.drawer.rect(g.x, g.y, g.width, g.height, {color: "#A9DAFF"});
        // this.drawer.circle(g.x+g.width/2, g.y+g.width/2, g.width/2, {color: "#A9DAFF"});

        const center = {x: g.x + g.width*0.5, y: g.y + g.height*0.5}

        const rightEyePosition = this.rotatePointAroundCenter(center, g.width*this.eyeDistance, g.direction+this.eyeGap);
        const leftEyePosition = this.rotatePointAroundCenter(center, g.width*this.eyeDistance, g.direction-this.eyeGap);

        // 円を描写
        this.drawer.circle(rightEyePosition.x, rightEyePosition.y, g.width * this.eyeSize, { color: "#A9DAFF" });
        this.drawer.circle(leftEyePosition.x, leftEyePosition.y, g.width * this.eyeSize, { color: "#A9DAFF" });

        this.decorationValues.forEach((deco) => {
            
            const position = this.rotatePointAroundCenter(center, deco.offset*g.width*0.05, g.direction+Math.PI);
            // this.drawer.rect(position.x, position.y, deco.size.width*10, deco.size.height*10, {color: "#A9DAFF"});
            this.drawer.circle(position.x, position.y, deco.size.width*g.width*0.05, {color: "#A9DAFF"});
        });
        
    }

    rotatePointFromCurrent(current, center, angle) {
        // 現在の点と中心の相対座標を計算
        const relativeX = current.x - center.x;
        const relativeY = current.y - center.y;
    
        // 相対座標を指定された角度だけ回転
        const rotatedX = relativeX * Math.cos(angle) - relativeY * Math.sin(angle);
        const rotatedY = relativeX * Math.sin(angle) + relativeY * Math.cos(angle);
    
        // 回転後の座標に中心座標を加えて結果を返す
        const resultX = rotatedX + center.x;
        const resultY = rotatedY + center.y;
    
        return { x: resultX, y: resultY };
    }

    rotatePointAroundCenter(center, radius, angle) {
        // 相対座標を指定された角度だけ回転
        const rotatedX = radius * Math.cos(angle);
        const rotatedY = radius * Math.sin(angle);
    
        // 回転後の座標に中心座標を加えて結果を返す
        const resultX = rotatedX + center.x;
        const resultY = rotatedY + center.y;
    
        return { x: resultX, y: resultY };
    }

    generateDecoration() {
        const shapes = ['circle', 'rect'];
        const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    
        const randomOffset = 10 + Math.random()*20;
        const randomSize = {width: 1+6*Math.random(), height: 1+10*Math.random()};
    
        return { shape: randomShape, offset: randomOffset, size: randomSize };
    }
}