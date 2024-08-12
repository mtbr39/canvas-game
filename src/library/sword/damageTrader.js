import { Collider } from "../../system/collider";


export class DamageTrader {
    constructor(option = {}) {

        this.gameObject = option.gameObject;
        
        this.collider = new Collider({isKinetic: true});

        this.allyLayerName = option.layerName || "";

        this.health = option.health;

        this.disableHitBoxList = [];

    }

    onCollision(collisionData = {}) {
        const other = collisionData.otherObject;
        if (other?.collider?.layers) {
            const otherLayers = other.collider.layers;

            if (otherLayers.includes('skillLayer') && !otherLayers.includes(this.allyLayerName)) {
                const skillHitBox = other;

                if (!this.disableHitBoxList.includes(skillHitBox)) {
                    const damage = skillHitBox?.damage;
                    this.health.dealDamage(damage);
                    this.disableHitBoxList.push(skillHitBox);
                }
                
            }

        }
    }

    
}