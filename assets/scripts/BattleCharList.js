var General = require('General');

cc.Class({
    extends: General,

    ctor: function() {
        this.enemies = [];
        this.heroes = [];
        this.battle = null;

        this.enemy_slot_pos = {
            '1': [-50,0],
            '2': [50, 0],
            '3': [-100, 100],
            '4': [0, 100],
            '5': [100, 100],
        };
        this.hero_slot_pos = {
            '1': [-50,-150],
            '2': [50, -150],
            '3': [-100, -250],
            '4': [0, -250],
            '5': [100, -250],
        };
    },

    properties: {
        char_prefab: cc.Prefab,
        max_char_opacity: 255,
        min_char_opacity: 100
    },

    init: function(data) {
        this.battle_master = data.battle_master;
        this.battle_data = data.battle_data;

        this.loadEnemies();  
        this.loadHeroes(); 
    },

    // FUNCTIONS

    loadEnemies: function() {
        // sort desc order first
        let tmp_battle_chars = this.battle_data.enemies;
        tmp_battle_chars.sort(function(a, b){return b.pos-a.pos});

        // display
        for (let char of tmp_battle_chars) {
            this.spawnEnemy(char.char, char.rank, char.pos);
        }

        console.log('Enemies spawned...');
    },

    loadHeroes: function() {
        // sort asc order first
        let tmp_battle_chars = this._player.campaign_chars;
        tmp_battle_chars.sort(function(a, b){return a.pos-b.pos});

        // display
        for (let char of tmp_battle_chars) {
            this.spawnHero(char.char, char.rank, char.pos);
        }

        console.log('Heroes spawned...');
    },

    spawnEnemy: function(char_code, rank, slot) {
        let char_node = cc.instantiate(this.char_prefab);
        this.node.addChild(char_node);

        char_node.getComponent('Char').init({
            side: this._const.CHAR.SIDE.ENEMY,
            pos: slot,
            char_list: this,
            char_code: char_code,
            rank: rank,
            facing: this._const.CHAR.FACING.FRONT,
            default_anim: this._const.CHAR.ANIM.STAND
        });
        char_node.setPosition(this.enemy_slot_pos[slot][0], this.enemy_slot_pos[slot][1]);
        char_node.char = char_node.getComponent('Char');

        this.enemies[slot] = char_node;
    },

    spawnHero: function(char_code, rank, slot) {
        // select first slot of slot is not specified
        if (typeof slot === 'undefined') {
            for (let pos in this.hero_slot_pos) {
                if (typeof this.heroes[pos] === 'undefined') {
                    slot = pos;
                    break;
                }
            }
        }

        // char
        let char_node = cc.instantiate(this.char_prefab);
        this.node.addChild(char_node);

        char_node.getComponent('Char').init({
            side: this._const.CHAR.SIDE.HERO,
            pos: slot,
            char_list: this,
            char_code: char_code,
            rank: rank,
            facing: this._const.CHAR.FACING.BACK,
            default_anim: this._const.CHAR.ANIM.STAND
        });
        char_node.setPosition(this.hero_slot_pos[slot][0], this.hero_slot_pos[slot][1]);
        char_node.char = char_node.getComponent('Char');

        // click event on prebattle, despawn hero    
        let self = this;
        char_node.on('click', function() {
            if (self.battle_master.battle_started == false) {
                let char_component = char_node.getComponent('Char');
                
                // remove hero
                self.despawnHero(char_component.char_code, char_component.rank);

                // deselect from card
                self.battle_master.card_list.deselectCard(char_component.char_code, char_component.rank);
            }
        });

        // add to list
        this.heroes[slot] = char_node;
    },

    despawnHero: function(char_code, rank) {
        for(let x in this.heroes) {
            let hero = this.heroes[x];

            if (hero.getComponent('Char').char_code == char_code && 
                hero.getComponent('Char').rank == rank) {
                hero.destroy();
                delete this.heroes[x];
            }
        }
    },

    centralizeChars: function() {
        for (let x in this.heroes) {
            this.heroes[x].y -= 150; 
        }
        for (let x in this.enemies) {
            this.enemies[x].y -= 0; 
        }
    },

    showHpBars: function() {
        for (let x in this.heroes) {
            this.heroes[x].getComponent('Char').hp_bar.active = true; 
        }
        for (let x in this.enemies) {
            this.enemies[x].getComponent('Char').hp_bar = this.enemies[x].getComponent('Char').hp_bar_red;
            this.enemies[x].getComponent('Char').hp_bar.active = true; 
        }
    },

    focusInChars: function() {
        for (let x in this.heroes) {
            this.heroes[x].opacity = this.max_char_opacity;
        }
        for (let x in this.enemies) {
            this.enemies[x].opacity = this.max_char_opacity;
        }
    },

    focusOutChars: function(exclude) {
        for (let x in this.heroes) {
            if (!exclude.includes(this.heroes[x]))
                this.heroes[x].opacity = this.min_char_opacity;
        }
        for (let x in this.enemies) {
            if (!exclude.includes(this.enemies[x]))
                this.enemies[x].opacity = this.min_char_opacity;
        }
    },
});