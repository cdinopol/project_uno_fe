var General = require('General');

cc.Class({
    extends: General,

    properties: {
        connection_lost: cc.Prefab,
        loading_bar: cc.Node,
        loading_text: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function() {
        this.loading_sequence = [
            [this.verifySerialToken, 'init data...'],
            [this.login, 'logging in...'],
            [this.loadPlayer, 'loading player...'],
            [this.loadGameScene, 'init game...'],
        ];
        this.total_loading_process = this.loading_sequence.length;
    },

    start: function() {
        this.progressLoading();
    },

    // FUNCTIONS

    progressLoading: function() {
        let loadingProcess = this.loading_sequence.shift();

        this.loading_text.getComponent(cc.Label).string = loadingProcess[1];
        this.loading_bar.getComponent(cc.ProgressBar).progress += 1/this.total_loading_process;
        
        loadingProcess[0].bind(this)();
    },

    verifySerialToken: function() {
        let self = this;

        // register if no ID detected
        if (!cc.sys.localStorage.getItem('serial_token')) {
           this._rest_service.register().done(function(data) {
                cc.sys.localStorage.setItem('serial_token', data.serial_token);
                self._player.id = data.serial_token;
                self.progressLoading();
           });

        // set
        } else {
            self._player.id = cc.sys.localStorage.getItem('serial_token');
            self.progressLoading();
        }
    },

    login: function() {
        let self = this;

        this._rest_service.login({
            'serial_token': this._player.id,
            'password': 'password'
        }).done(function(data) {
            self._rest_service.token = data.token;
            self._rest_service.server = data.server;

            self.progressLoading();
        }).fail(function() {
            cc.sys.localStorage.clear();
        });
    },

    loadPlayer: function() {
        let self = this;

        this._rest_service.getPlayerData().done(function(data) {
            self._player.loadData(data);
            self.progressLoading();
        });
    },

    loadGameScene: function() {
        this._scener.loadCampaignScene();
    },
});
