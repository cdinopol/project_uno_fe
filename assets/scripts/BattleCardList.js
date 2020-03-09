var General = require('General');

cc.Class({
    extends: General,

    ctor: function() {
        this.cards = [];
    },

    properties: {
        cardPrefab: cc.Prefab,
    },

    init: function(data) {
        this.battle_master = data.battle_master;
        this.battle_data = data.battle_data;

        this.loadPlayerCards();
    },

    // FUNCTIONS

    loadPlayerCards: function() {
        let self = this;

        cc.loader.loadRes("atlas/cards/cards", cc.SpriteAtlas, function (err, atlas) {
            for (let card of self._player.chars) {

                let card_node = self.loadCard({
                    char: card.char,
                    face: atlas.getSpriteFrame(card.char), 
                    rank: card.rank
                });
            }

            // syncronize fields heroes to card selection on load
            self.syncFieldHeroes();
        });
    },

    loadCard: function(card) {
        let card_node = cc.instantiate(this.cardPrefab);
        this.node.addChild(card_node);

        card_node.getComponent('Card').init({
            char_code: card.char,
            face_sf: card.face,
            rank: card.rank
        });

        // click card event
        let self = this;
        card_node.on('click', function() {
            let card_component = card_node.getComponent('Card');

            if (card_component.selected == false) {
                self.selectCardByNode(card_node);

                // spawn char on field
                self.battle_master.char_list.spawnHero(card_component.char_code, card_component.rank);
            } else {
                self.deselectCardByNode(card_node);

                // despawn char on field
                self.battle_master.char_list.despawnHero(card_component.char_code, card_component.rank);
            }
        });

        // store to array categorized by char code
        if (typeof this.cards[card.char] === 'undefined') {
            this.cards[card.char] = [];
        } 
        this.cards[card.char].push(card_node);
    },

    selectCardByNode: function(card_node) {
        // check the card
        card_node.getComponent('Card').select();

        // disable same cards
        let char = card_node.getComponent('Card');
        for (let card of this.cards[char.char_code]) {
            if (!card.getComponent('Card').selected) {
                card.getComponent('Card').uninteractable();
            }
        }
    },

    deselectCardByNode: function(card_node) {
        // uncheck the card
        card_node.getComponent('Card').deselect();

        // enable same cards
        let char = card_node.getComponent('Card');
        for (let card of this.cards[char.char_code]) {
            card.getComponent('Card').interactable();
        }
    },

    selectCard: function(char_code, rank) {
        for (let card of this.cards[char_code]) {
            if (card.getComponent('Card').rank == rank && !card.getComponent('Card').selected) {
                this.selectCard(card);
                break;
            }
        }
    },

    deselectCard: function(char_code, rank) {
        for (let card of this.cards[char_code]) {
            if (card.getComponent('Card').rank == rank && card.getComponent('Card').selected) {
                this.deselectCardByNode(card);
                break;
            }
        }
    },

    syncFieldHeroes: function() {
        for(let hero of this.battle_data.heroes) {
            for (let card of this.cards[hero.char]) {
                if (card.getComponent('Card').rank == hero.rank) {
                    this.selectCardByNode(card);
                    break;
                }
            }
        }
    }
});