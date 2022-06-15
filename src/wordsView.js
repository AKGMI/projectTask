var WordsView = cc.Node.extend({
    ctor: function(_words) {
        this._super();

        this.background = ccui.Scale9Sprite.createWithSpriteFrameName('board_bg.png');
        this.addChild(this.background);

        this.words = [];
        _words.forEach((word, index) => {
            this.words[index] = new WordView(word);
            let dx = (index % 2) * 400;
            let dy = (Math.floor(index/2)) * (-75);
            this.words[index].setPosition(-400 + dx, 75 + dy);
            this.addChild(this.words[index]);
        });
    },
});
