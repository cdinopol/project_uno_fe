var General = require('General');

cc.Class({
    extends: General,

    ctor: function() {
        this.side = null;
        this.pos = 0;
        this.char_code = null;
        this.rank = null;
        this.facing = null;
        this.default_anim = this._const.CHAR.ANIM.STAND;
        this.max_hp = 0;
        this.hp = 0;

        this.mspd = 100;
        this.aspd = 190
        this.atk = 100;
        this.def = 50;
        this.range = 9;

        this.target = null;

        // status
        this.current_animation = null;
        this.attacking = false;
    },

    properties: {
        sprite_node: cc.Node,
        shadow: cc.Node,
        normal_dmg_txt: cc.Node,
        hp_bar: cc.Node,
        hp_bar_red: cc.Node
    },

    init: function(data) {
        // params
        this.side = data.side;
        this.pos = data.pos;
        this.char_list = data.char_list;
        this.char_code = data.char_code;
        this.rank = data.rank;
        this.facing = data.facing;
        this.default_anim = data.default_anim;
        this.max_hp = this.hp = 100;

        // initialize
        this.initRecyclables();
        this.initAnimations(this.char_code, this.facing);
    },

    // FUNCTIONS

    initRecyclables: function() {
        this.dmg_txt_pool = new cc.NodePool();
        for (let i = 0; i < 5; i++) {
            this.dmg_txt_pool.put(cc.instantiate(this.normal_dmg_txt));
        }
    },

    initAnimations: function(char_code, facing) {
        let self = this,
            animation = self.sprite_node.getComponent(cc.Animation),
            frame_count_data = require('char_atlas.config')[this.char_code].frame_count;

        cc.loader.loadRes("atlas/char_sprites/"+char_code, cc.SpriteAtlas, function (err, atlas) {
            // set default frame to adjust node height
            self.sprite_node.getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame('s'+facing+'_1');

            /*
            * List of all animations
            * 0 sprite frame prefix
            * 1 frame count
            * 2 clip name
            * 3 wrap mode
            */
            let anim_clips = [
                ['s', frame_count_data.s, self._const.CHAR.ANIM.STAND, cc.WrapMode.Loop],
                ['w', frame_count_data.w, self._const.CHAR.ANIM.WALK, cc.WrapMode.Loop],
                ['a', frame_count_data.a, self._const.CHAR.ANIM.ATTACK, cc.WrapMode.Normal],
                ['h', frame_count_data.h, self._const.CHAR.ANIM.HURT, cc.WrapMode.Normal],
                ['d', frame_count_data.d, self._const.CHAR.ANIM.DIE, cc.WrapMode.Normal],
            ];

            // add animation clips
            for (let anim_clip of anim_clips) {
                let frames = [];
                for (let i = 1; i <= anim_clip[1]; i++) {
                    frames.push(atlas.getSpriteFrame(anim_clip[0]+facing+'_'+i));
                }

                let clip = cc.AnimationClip.createWithSpriteFrames(frames, 10);
                clip.name = anim_clip[2];
                clip.wrapMode = anim_clip[3];
                animation.addClip(clip);
            }

            // default animation every after any wrap-mode-normal animation
            animation.on('finished', function(event) {
                self.animate(self.default_anim);
            });

            // play default animation
            self.animate(self.default_anim);

            console.log('Char animations initialized...');
        });
    },

    animate: function(animation, speed = 1) {
        let anim_state = this.sprite_node.getComponent(cc.Animation);

        if (this.current_animation != animation) {
            this.current_animation = animation;

            anim_state.speed = speed;
            return anim_state.play(animation);
        } else {
            return anim_state.getAnimationState(animation);
        }
    },

    getTargetDist: function(target) {
        let target_pos = this.target.getPosition();

        return this.node.position.sub(target_pos).mag();
    },

    moveTo: function(x, y, dt) {
        this.animate(this._const.CHAR.ANIM.WALK);

        if (this.node.x != x || this.node.y != y) {
            let tmp = Math.abs(x -  this.node.x) + Math.abs(y - this.node.y),
                sign_x = (x - this.node.x) < 0 ? -1 : 1,
                sign_y = (y - this.node.y) < 0 ? -1 : 1;
            
            let vx = (sign_x * (Math.abs(x - this.node.x)/tmp)) * this.mspd * dt;
            let vy = (sign_y * (Math.abs(y - this.node.y)/tmp)) * this.mspd * dt;

            // flip left-right
            this.sprite_node.scaleX = -Math.sign(vx) | 1;

            this.node.x += vx;
            this.node.y += vy;
        }
    },

    attack: function() {
        this.attacking = true;
        let anim_state = this.animate(this._const.CHAR.ANIM.ATTACK, this.aspd/100);
        
        this.schedule(function() {
            this.attacking = false;
        }, anim_state.duration);
    },

    hurt: function(dmg) {
        if (this.dead) {
            return false;
        }

        // update health and damage text
        this.registerDamage(dmg);

        // run proper animation
        if (this.hp <= 0) {
            this.die();   
        } else {
            this.animate(this._const.CHAR.ANIM.HURT);
        }
    },

    registerDamage: function(dmg) {
        // update health
        this.hp -= dmg;
        this.hp_bar.getComponent(cc.ProgressBar).progress = this.hp / this.max_hp;

        // damage text
        let dmg_txt = this.dmg_txt_pool.get();
        if (!dmg_txt) 
            return false;
        
        dmg_txt.parent = this.node;
        dmg_txt.getComponent(cc.Label).string = dmg;
        dmg_txt.runAction(cc.sequence(
            cc.spawn(
                cc.moveBy(0.5, cc.v2(0, 20)).easing(cc.easeCubicActionOut()),
                cc.fadeOut(0.5),
            ),
            cc.callFunc(this.dmg_txt_pool.put, this.dmg_txt_pool, dmg_txt)
        ));
    },

    die: function() {
        // flag dead
        this.dead = true;

        // start dying animation
        let anim_state = this.animate(this._const.CHAR.ANIM.DIE);
        
        // destroy character if already dead -- might change this if there's resu function
        this.scheduleOnce(function() {
            this.node.destroy();
            delete this.char_list[this.side][this.pos];
        }, anim_state.duration);
    }
});
