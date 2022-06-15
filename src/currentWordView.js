var CurrentWordView = cc.Node.extend({
    ctor: function(_word) {
        this._super();

        this.word = _word;
        this.LetterCount = _word.length;

        this.letters = [];
        for (let i = 0; i < this.LetterCount; ++i) {            
            this.letters[i] = new LetterView(_word[i]);
            // this.letters[i].setPosition(0 + i * (this.letters[i].width + 10), 0);
            this.addChild(this.letters[i]);
        }
        this.setPosition(0, 150);
        this.setScale(LetterView.DEFAULT_SCALE - 0.15);
    },

    show: function() {
        this.letters.forEach((letter, i) => {
            setTimeout(() => {
                letter.show();
            }, 150 * i);
        });
    },

    addLetter: function(_letter) {
        this.word += _letter;
        this.LetterCount++;
        let index = this.LetterCount - 1;
        this.letters[index] = new LetterView(_letter);
        let width = this.letters[index].background.width;
        this.runAction(new cc.Sequence(
            cc.moveTo(0.3, cc.p(0 - index * width/4, this.getPositionY()))
        ));
        this.letters[index].setPosition(index * width, 0);
        this.addChild(this.letters[index]);
    },

    remLetter: function() {
        this.word = this.word.slice(0, -1);
        this.LetterCount--;
        this.letters[this.letters.length - 1].removeFromParent();
        this.letters.pop();
        let width = this.letters[0].background.width;
        this.runAction(new cc.Sequence(
            cc.moveTo(0.3, cc.p(0 - (this.letters.length - 1) * width/4, this.getPositionY()))
        ));
    },

    hide: function() {
        this.letters.forEach(letter => {
            letter.setVisible(false);
        });
    }
});