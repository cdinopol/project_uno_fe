module.exports = {
    battle_type: '',
    heroes: [],
    enemies: [],
    rewards: [],

    // FUNCTIONS
    loadData: function(data) {
    	this.battle_type = data.battle_type;
    	this.heroes = data.heroes;
    	this.enemies = data.enemies;
    	this.rewards = data.rewards;
    }
}