cc.Class({
    extends: cc.Component,

    ctor: function() {
        this._const = require('global.constants');
        this._rest_service = require('rest.service');
        this._player = require('player.data');
        this._scener = require('scene.manager');
        this._util = require('general.util');
    },

    // FUNCTIONS
    reloadScene: function() {
        cc.director.loadScene(cc.director.getScene().name);
    },
});
