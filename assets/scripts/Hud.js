var General = require('General');

cc.Class({
    extends: General,

    properties: {
       player_name_node: cc.Node,
       player_level_node: cc.Node,
       player_exp_node: cc.Node,
       player_gold_node: cc.Node,
       player_diamond_node: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function() {
        this.player_name_node.getComponent(cc.Label).string = this._player.name;
        this.player_level_node.getComponent(cc.Label).string = 'Lv. ' + (this._player.level);
        this.player_gold_node.getComponent(cc.Label).string = this._util.numberHighFormat(this._player.gold);
        this.player_diamond_node.getComponent(cc.Label).string = this._util.numberHighFormat(this._player.diamond);
    }
});
