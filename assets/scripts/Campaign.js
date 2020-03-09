var General = require('General');

cc.Class({
    extends: General,

    properties: {
        battle_button: cc.Button,
        stage_text: cc.Node,
        char_prefab: cc.Prefab,
        progress: cc.Node,
        heroes: [],
        bg1: cc.Node,
        bg2: cc.Node,
        scroll_speed: 66,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        // validate player
        if (!this._player.isLoaded()) {
            this._scener.loadLoadingScene();
        }

        // battle data
        this.battle_data = require('battle.data');
        this.campaign_data = require('campaign.data');

        // init battle click event
        this.battle_button.node.on('click', function() {
            // remove battle button
            this.battle_button.node.destroy();

            // prepare campaign battle
            this.prepareBattle();
        }, this);

        // current stage
        this.showCurrentStage(this._player.current_world, this._player.current_stage);

        // load heroes
        for (let char of this._player.campaign_chars) {
            this.spawnHero(char.char, char.rank, char.pos);
        }

        // auto next campaign
        if (this._player.autoNextCampaign == true) {
            this._player.autoNextCampaign = false;

            this.prepareBattle();
        }
    },

    start: function () {
        this.bg1.y = 0;
        this.bg2.y = this.node.height;
        this.battle_start_triggered = false;

        // update progress
        this.progress.getComponent(cc.ProgressBar).progress = this.campaign_data.max_world_stage / this._player.current_stage;
    },

    update: function (dt) {
        this.scrollBg(dt);
    },

    // FUNCTIONS

    scrollBg: function(dt, scroll) {
        // scrolling
        if (!this.battle_start_triggered) {
            scroll = this.scroll_speed * dt;
            this.bg1.y -= scroll;
            this.bg2.y -= scroll;

            // flip
            if (this.bg1.y <= -this.node.height) {
                this.bg1.y = this.node.height + this.bg2.y;
            }
            if (this.bg2.y <= -this.node.height) {
                this.bg2.y = this.node.height + this.bg1.y;
            }
        }
    },

    showCurrentStage: function(current_world, current_stage) {
        this.stage_text.getComponent(cc.Label).string = (current_world) + ' - ' + (current_stage);
    },

    spawnHero: function(char_code, rank, slot) {
        // set it here to make it rearrangable to adjust on layout 
        // don't copy from battle, this function could be different
        let slots_pos = {
            1: [-50,-120],
            2: [50, -120],
            3: [-100, -250],
            4: [0, -250],
            5: [100, -250],
        };

        let char_node = cc.instantiate(this.char_prefab);
        this.node.addChild(char_node);

        char_node.getComponent('Char').init({
            side: this._const.CHAR.SIDE.HERO,
            pos: slot,
            char_list: this,
            char_code: char_code,
            rank: rank,
            facing: this._const.CHAR.FACING.BACK,
            default_anim: this._const.CHAR.ANIM.WALK,
        });
        char_node.setPosition(slots_pos[slot][0], slots_pos[slot][1]);

        this.heroes[slot] = char_node;
    },

    prepareBattle: function() {
        let self = this;

        this._rest_service.getCampaignData(
            this._player.current_world,
            this._player.current_stage,
        ).done(function(data) {
            self.battle_data.loadData({
                'battle_type': self._const.BATTLE.TYPE.CAMPAIGN,
                'heroes': self._player.campaign_chars,
                'enemies': data.enemies,
                'rewards': data.rewards
            });

            self._scener.loadBattleScene();
        });
    },
});
