class Angle {
    static calculateOppositeAngle(originalAngle, referenceAngle) {
        // 角度を0から2πの範囲に正規化
        const normalizedOriginalAngle = (originalAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const normalizedReferenceAngle = (referenceAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);

        // originalAngleに対して反対側の角度oppositeAngleを計算
        let oppositeAngle = (normalizedOriginalAngle + Math.PI) % (2 * Math.PI);

        // referenceAngleとoppositeAngleの差がπ未満ならばoppositeAngleをそのまま返し、それ以上ならばoppositeAngleを2π引く
        return Math.abs(oppositeAngle - normalizedReferenceAngle) < Math.PI ? oppositeAngle : (oppositeAngle + 2 * Math.PI) % (2 * Math.PI);
    }
}