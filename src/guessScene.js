var GuessScene = cc.Scene.extend({
    ctor: function(words) {
        this._super();

        this.addBackground();

        words = words.sort((a, b) => b.length - a.length);
        this.wordsCount = words.length;
        
        this.words = new WordsView(words);
        this.words.background.setContentSize(this.width * 1.1, this.height * .5);
        this.words.setPosition(this.width / 2, this.height * .7);

        this.addChild(this.words);

        let letters = words[0].split('');

        this.letters = new LettersView(letters);
        
        this.letters.setPosition(this.width / 2, this.height * .25);
        this.letters.onNewWord = this.checkWord.bind(this);
        this.addChild(this.letters);

        this.addBalance();
        this.addHintButton();

        // cc.audioEngine.playMusic(resources.sounds.music, true);
        // cc.audioEngine.setMusicVolume(0.3);
    },

    addBackground: function() {
        this.background = new cc.Sprite(resources.background);
        this.background.setScale(Math.max(this.width / this.background.width, this.height / this.background.height));
        this.background.setPosition(this.width / 2, this.height / 2);
        this.background.setLocalZOrder(-1);
        this.addChild(this.background);
    },

    addBalance: function() {
        this.balance = new BalanceView(150);
        this.balance.setScale(0.5);
        this.balance.setPosition(this.balance.icon.width, this.height - this.balance.icon.height / 4);
        this.addChild(this.balance);
    },

    addHintButton: function() {
        let hintCost = 50;

        let buttonSize = cc.spriteFrameCache.getSpriteFrame('button_blue.png').getOriginalSize();
        this.hintButton = new ccui.Button('#button_blue.png', '#button_blue_on.png', '#button_off.png', ccui.Widget.PLIST_TEXTURE);
        this.hintButton.setScale9Enabled(true);
        this.hintButton.setContentSize(150, 75);
        this.hintButton.setCapInsets(cc.rect(buttonSize.width / 2 - 1, buttonSize.height / 2 - 1, 2, 2));
        this.hintButton.setPosition(this.width - this.width / 9, this.height * .4);
        let icon = ccui.Scale9Sprite.createWithSpriteFrameName('help_icon.png');
        icon.setScale(0.5);
        icon.setAnchorPoint(0, 0);
        icon.setPosition(this.hintButton.width * 0.1, this.hintButton.height / 4);
        this.hintButton.addChild(icon);
        let cost = new CostView(hintCost);
        cost.setScale(0.4);
        cost.setAnchorPoint(0, 0);
        cost.setPosition(this.hintButton.width * 0.5, this.hintButton.height / 2);
        this.hintButton.addChild(cost);
        this.addChild(this.hintButton);

        this.hintButton.addClickEventListener(function () {
            if (this.balance.balance >= hintCost) {
                this.balance.subBalance(hintCost);
                this.hintLetter();
            }
        }.bind(this));
    },

    hintLetter: function() {
        let isNew = false;
        let openLetter = null;
        let openWord = null;
        while (!isNew) {
            let index = Math.floor(Math.random() * this.words.words.length);
            let word = this.words.words[index]
            if (word.isGuessed) continue;
            else {
                index = Math.floor(Math.random() * word.LetterCount);
                let letter = word.letters[index];
                if (letter.isShowed) continue;
                else {
                    isNew = true;
                    openLetter = letter;
                    openWord = word;
                }
            }
        }
        let counter = 0;
        openWord.letters.forEach(letter => {
            if (letter.isShowed) counter++;
        });
        if (counter === openWord.LetterCount - 1) this.checkWord(openWord.word);
        else openLetter.show();
    },

    checkWord: function(word) {
        let isCorrect = false;
        let isAlreadyFound = false;
        this.words.words.forEach(wordView => {
            if (wordView.word === word) {
                if (!wordView.isGuessed) {
                    this.wordsCount--;
                    isCorrect = true;
                    wordView.show();
                } else {
                    isAlreadyFound = true;
                }
                return;
            }
        });
        if (!isAlreadyFound) this.showCheckWordResult(isCorrect);
        else cc.audioEngine.playEffect(resources.sounds.alreadyFound);
        if (this.wordsCount === 1) cc.audioEngine.playEffect(resources.sounds.lastWord);
        if (this.wordsCount === 0) {
            cc.audioEngine.playEffect(resources.sounds.win);
            let fireworkAnimation = sp.SkeletonAnimation.create(resources.firework_json, resources.game_atlas);
            fireworkAnimation.setAnimation(0, "animation1", true);
            fireworkAnimation.setPosition(this.width / 2, this.height / 2);
            this.addChild(fireworkAnimation);
            let victoryAnimation = sp.SkeletonAnimation.create(resources.victory_json, resources.game_atlas);
            victoryAnimation.setAnimation(0, "open", false);
            victoryAnimation.setPosition(this.width / 2, this.height / 2);
            this.addChild(victoryAnimation);
            victoryAnimation.setCompleteListener(function() {
                setTimeout(() => {
                    victoryAnimation.removeFromParent();
                    fireworkAnimation.removeFromParent();
                    cc.director.runScene(new GuessScene(GuessScene.LEVELS[Math.floor(Math.random() * GuessScene.LEVELS.length)]));
                }, 2500);
                victoryAnimation.setAnimation(0, "idle", true);
            });
        } 
    },

    showCheckWordResult: function(isCorrect) {
        let iconName = isCorrect ? 'word_right' : 'word_wrong';
        let soundName = isCorrect ? resources.sounds.correctWord : resources.sounds.wrongWord;
        let icon = ccui.Scale9Sprite.createWithSpriteFrameName(iconName + '.png');
        this.addChild(icon);
        cc.audioEngine.playEffect(soundName);
        icon.setPosition(this.width / 2, this.height / 2);
        icon.runAction(new cc.Sequence(
            new cc.ScaleTo(2, 10, 10),
            new cc.RemoveSelf()
        ));
        icon.runAction(new cc.Sequence(
            new cc.FadeTo(1, 0)
        ))
    }
});

GuessScene.LEVELS = [
    ['порт', 'пот', 'рот', 'тор', 'троп', 'топ'],
    ['место', 'мост', 'сет', 'сом'],
    ['письмо', 'опись', 'мисо', 'мопс', 'ось', 'сом']

]