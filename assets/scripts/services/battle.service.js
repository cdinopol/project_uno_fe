module.exports = {

    getClosestTarget: function(src, targets) {
        let closest_dist = null,
            closest_target = null,
            src_pos = src.getPosition();

        for (let x in targets) {
            let target = targets[x],
                dist = target.position.sub(src_pos).mag();
                
            if (!closest_dist || dist <= closest_dist) {
                closest_dist = dist;
                closest_target = target;
            }
        }

        closest_target.dist = closest_dist;
        return closest_target;
    },

    targetInRange: function(src, target) {
        let dist = src.position.sub(target.getPosition()).mag();
        return dist <= src.char.range*10;
    },
    
    basicAttack: function(src, target) {
        if (!src.char.attacking) {
            src.char.attack();
            target.char.hurt(10);
        }
    },

    moveToTarget: function(src, target, dt) {
        src.char.moveTo(target.x, target.y, dt);
    },
};
