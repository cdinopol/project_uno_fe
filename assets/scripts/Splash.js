var General = require('General');

cc.Class({
    extends: General,
    
    // LIFE-CYCLE CALLBACKS:

    onLoad: function() {
    },

    start: function() {
        this.node.runAction(cc.sequence(
            cc.delayTime(1.5),
            cc.callFunc(this._scener.loadLoadingScene, this)
        ));
    },

    update: function(dt) {
    },
});
