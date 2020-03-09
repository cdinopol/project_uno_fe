cc.Class({
    extends: cc.Component,

    ctor: function() {
        this.char_code = null;
        this.rank = null;
        this.selected = false;
    },

    properties: {
        face: cc.Sprite,
        check_mark: cc.Node,
        rank_node: cc.Node
    },

    init: function(data) {
    	this.char_code = data.char_code;
        this.face.spriteFrame = data.face_sf;
        this.rank = data.rank;
        this.rank_node.getComponent(cc.Label).string = this.rank;
    },

    select: function() {
        this.selected = true;
    	this.check_mark.active = true;
    },

    deselect: function() {
        this.selected = false;
    	this.check_mark.active = false;
    },

    interactable: function() {
        this.node.getComponent(cc.Button).interactable = true;
        this.face.getComponent(cc.Sprite).setMaterial(0, cc.Material.getBuiltinMaterial('spine'));
    },

    uninteractable: function() {
        this.node.getComponent(cc.Button).interactable = false;
        this.face.getComponent(cc.Sprite).setMaterial(0, cc.Material.getBuiltinMaterial('gray-sprite'));
    },
});