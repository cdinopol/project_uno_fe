var General = require('General');

cc.Class({
    extends: General,

    properties: {
       victory_frame: cc.Node,
       lose_frame: cc.Node
    },

    init: function(data) {
        this.battle_master = data.battle_master;
        this.battle_data = data.battle_data;
        this.win = data.win;

        // result
        if (this.win == true) {
            this.victory();
        } else {
            this.lose();
        }
    },

    // FUNCTIONS

    victory: function() {
        let self = this;

        if (this.battle_data.battle_type == this._const.BATTLE.TYPE.CAMPAIGN) {
            this._rest_service.campaignWin().done(function() {
                self.campaignVictory();
            });
        }
    },

    campaignVictory: function() {
        this.victory_frame.zIndex = 901;
        this.victory_frame.active = true;
        
        this._player.current_stage += 1;
    },

    lose: function() {
        if (this.battle_data.battle_type == this._const.BATTLE.TYPE.CAMPAIGN) {
            this.lose_frame.zIndex = 901;
            this.lose_frame.active = true;

            this.campaignLose();
        }
    },

    campaignLose: function() {
        return true;
    },

    nextCampaignStage: function() {
        this._player.autoNextCampaign = true;
        this._scener.loadCampaignScene();
    },

    reloadCampaignStage: function() {
        this._scener.loadBattleScene();
    },

    backToCampaign: function() {
        this._scener.loadCampaignScene();
    },
});
