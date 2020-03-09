module.exports = {
    id: null,
    name: 'New Player',
    level: 0,
    exp: 0,
    gold: 0,
    diamond: 0,
    current_world: 0,
    current_stage: 0,
    campaign_chars: [],
    chars: [],

    // extra temporary variables
    autoNextCampaign: false,

    // FUNCTIONS
    loadData: function(data) {
        this.id = data.id;
        this.name = data.name;
        this.level = data.level;
        this.exp = data.exp;
        this.gold = data.gold;
        this.diamond = data.diamond;
        this.current_world = data.campaign.world;
        this.current_stage = data.campaign.stage;
        this.campaign_chars = data.campaign.data.last_used_chars;
        this.chars = Object.values(data.chars);
    },

    isLoaded: function() {
        return !(
            this.id == null ||
            this.level == 0 ||
            this.current_world == 0 ||
            this.current_stage == 0 ||
            this.campaign_chars == [] ||
            this.chars == []
        );
    }
}