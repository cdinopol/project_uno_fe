module.exports = {
    loadLoadingScene: function() {
        loadScene('loading');
    },

    loadCampaignScene: function() {
        loadScene('campaign');
    },

    loadBattleScene: function() {
        loadScene('battle');
    },
}

function loadScene(scene) {
    cc.director.preloadScene(scene, function() {
        cc.director.loadScene(scene);
    });
}