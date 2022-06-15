var LetterView = cc.Node.extend({
    ctor: function(_letter) {
        this._super();

        this.letter = new Letter(_letter);
        this.isSelected = false;
        this.isShowed = false;

        this.background = ccui.Scale9Sprite.createWithSpriteFrameName('letter_bg.png');
        this.icon = ccui.Scale9Sprite.createWithSpriteFrameName(Letter.ICONS[this.letter.symbol]);
        this.glow = ccui.Scale9Sprite.createWithSpriteFrameName('letter_bg_glow.png');
        this.glow.setVisible(false);
        this.addChild(this.background);
        this.addChild(this.icon);
        this.addChild(this.glow);
    },

    show: function() {
        cc.audioEngine.playEffect(resources.sounds.letter);
        this.isShowed = true;
        this.setVisible(true);
        this.runAction(new cc.Sequence(
            new cc.ScaleTo(0, 1.2, 1.2),
            new cc.ScaleTo(1.5, 1, 1)
        ));
    },

    select: function() {
        this.isSelected = true;
        this.glow.setVisible(true);
        this.setScale(LetterView.SELECT_SCALE);
    },

    deselect: function() {
        this.isSelected = false;
        this.glow.setVisible(false);
        this.setScale(LetterView.DEFAULT_SCALE);
    },

    onMouseDown: function() {
        if (this.isSelected) this.deselect();
        else this.select();
    }
})

LetterView.DEFAULT_SCALE = 0.6;
LetterView.SELECT_SCALE = 0.7;