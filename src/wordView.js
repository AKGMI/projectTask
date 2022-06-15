var WordView = cc.Node.extend({
    ctor: function(_word) {
        this._super();

        this.word = _word;
        this.LetterCount = _word.length;
        this.isGuessed = false;

        this.cells = [];
        this.letters = [];
        for (let i = 0; i < this.LetterCount; ++i) {
            this.cells[i] = ccui.Scale9Sprite.createWithSpriteFrameName('cell.png');
            this.cells[i].setPosition(0 + i * (this.cells[i].width + 10), 0);
            this.letters[i] = new LetterView(_word[i]);
            this.letters[i].setPosition(this.cells[i].getPosition());
            this.addChild(this.cells[i]);
            this.addChild(this.letters[i]);
        }
        this.hide();
        this.setScale(LetterView.DEFAULT_SCALE);
    },

    show: function() {
        this.isGuessed = true;
        this.letters.forEach((letter, i) => {
            setTimeout(() => {
                letter.show();
            }, 150 * i);
        });
    },

    hide: function() {
        this.letters.forEach(letter => {
            letter.setVisible(false);
        });
    }
});