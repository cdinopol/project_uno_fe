var General = require('General');

cc.Class({
    extends: General,

    properties: {
        char_list_node: cc.Node,
        card_list_node: cc.Node,
        battle_timer: cc.Node,
        result: cc.Node,
        prebattle_nodes: {
            default: [],
            type: cc.Node
        },
        battle_duration: 90
    },

    // LIFE-CYCLE CALLBACKS

    onLoad: function() {
        // sub classes
        this.battle_data = require('battle.data');
        this.battle_service = require('battle.service')
        
        this.char_list = this.char_list_node.getComponent('BattleCharList');
        this.char_list.init({
            battle_master: this,
            battle_data: this.battle_data
        });
        
        this.card_list = this.card_list_node.getComponent('BattleCardList');
        this.card_list.init({
            battle_master: this,
            battle_data: this.battle_data
        });
    },

    start: function() {
        this.battle_started = false;
        this.battle_done = false;
        this.freeze_time = false;
    },

    update: function(dt) {
        if (this.battle_started && !this.battle_done) {
            if (this.winCheck() == false) {
                this.updateBattleTimer(dt);
                this.updateBattleField(dt);
            }
        }
    },

    // FUNCTIONS

    removePrebattleNodes: function() {
        for (let node of this.prebattle_nodes) {
            node.destroy();
        }
    },

    startBattle: function() {
        if (!this.battle_started) {

            let tmp_player_chars = [];
            for(let x in this.char_list.heroes) {
                let hero = this.char_list.heroes[x];

                tmp_player_chars.push({
                    'char': hero.char.char_code,
                    'rank': hero.char.rank,
                    'pos': hero.char.pos
                });
            }

            // verify and save selected chars
            let self = this;
            this._rest_service.savePlayerCampaignChars({
                'chars': tmp_player_chars
            }).done(function(data) {
                self._player.campaign_chars = data.data;

                // removing prebattle nodes
                self.removePrebattleNodes();

                // UI adjustments
                self.char_list.centralizeChars();
                self.char_list.showHpBars();

                // start battle
                self.battle_started = true;
            });
        }
    },

    updateBattleTimer: function(dt) {
        if (!this.freeze_time) {
            this.battle_duration -= 1 * dt;
        }

        let min = Math.floor(this.battle_duration/60),
            sec = Math.floor(this.battle_duration%60);
            sec = "0" + (sec);
            sec = sec.substr(sec.length - 2);
        this.battle_timer.getComponent(cc.Label).string = '0' + (min) + ':' + (sec);
    },

    updateBattleField: function(dt) {
        // heroes
        for (let x in this.char_list.heroes) {
            let src = this.char_list.heroes[x];

            // set closest target
            let target = this.battle_service.getClosestTarget(src, this.char_list.enemies);

            // if in attackRange
            if (this.battle_service.targetInRange(src, target)) {
                this.battle_service.basicAttack(src, target);
            }

            // else move close to target
            else {
                this.battle_service.moveToTarget(src, target, dt);
            }
        }

        // enemies
        for (let x in this.char_list.enemies) {
            let src = this.char_list.enemies[x];

            // set closest target
            let target = this.battle_service.getClosestTarget(src, this.char_list.heroes);

            // if in attackRange
            if (this.battle_service.targetInRange(src, target)) {
                this.battle_service.basicAttack(src, target);
            }

            // else move close to target
            else {
                this.battle_service.moveToTarget(src, target, dt);
            }
        }
    },

    winCheck: function() {
        let win = null;
        if (Object.keys(this.char_list.heroes) <= 0) {
            win = false;
        } else if (Object.keys(this.char_list.enemies) <= 0) {
            win = true;
        }

        if (win != null) {
            this.battle_done = true;
            this.afterBattle(win);

            return true;
        }

        return false;
    },

    afterBattle: function(win) {
        this.result.getComponent('BattleResult').init({
            battle_master: this,
            battle_data: this.battle_data,
            win: win
        });
    },
});
