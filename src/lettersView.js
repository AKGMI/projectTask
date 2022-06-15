var LettersView = cc.Node.extend({
    ctor: function(_letters) {
        this._super();

        this.state = 0;
        this.count = _letters.length;
        this.letters = [];
        this.views = [];

        this.lastChosenLetters = [];
        
        this.word = "";
        this.currentWord = null;

        for (let i = 0; i < this.count; ++i) {
            this.views[i] = new LetterView(_letters[i]);
            this.views[i].setScale(LetterView.DEFAULT_SCALE);
            this.addChild(this.views[i]);
        }

        this.setViewsPositions();
        this.addShuffleButton();

        this.addSubmitAndDeclineButton();

        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: function(event) {
                let target = event.getCurrentTarget();
                let locationInNode = target.convertToNodeSpace(event.getLocation());
                let rect = cc.rect(locationInNode.x - 50, locationInNode.y - 50, 75, 75);
                
                this._node.views.forEach((letter, index) => {
                    if (cc.rectContainsPoint(rect, letter.getPosition())) {
                        if (this._node.state == 0) {
                            this._node.changeState(1);
                        }

                        if (this._node.lastChosenLetters[this._node.lastChosenLetters.length - 1] === index ||
                            this._node.lastChosenLetters[this._node.lastChosenLetters.length - 2] === index) {
                            this._node.word = this._node.word.slice(0, -1);
                            this._node.views[this._node.lastChosenLetters[this._node.lastChosenLetters.length - 1]].onMouseDown();
                            if (this._node.word.length === 0 ) this._node.changeState(0);
                            this._node.lastChosenLetters.pop();
                        } else if (!this._node.lastChosenLetters.includes(index)) {
                            this._node.word += letter.letter.symbol;
                            letter.onMouseDown();
                            this._node.lastChosenLetters.push(index);
                        } else {
                            return;
                        }
                        cc.audioEngine.playEffect(resources.sounds.click[this._node.word.length]);
                        this._node.updateCurrentWord();
                        return;
                    }
                });
                
            }
        }, this);
    },

    onNewWord: function() {
    },

    addShuffleButton: function() {
        this.shuffleButton = new ccui.Button('#shuffle.png', '#shuffle_on.png', '', ccui.Widget.PLIST_TEXTURE);
        this.shuffleButton.setScale(0.7);
        this.addChild(this.shuffleButton);

        this.shuffleButton.addClickEventListener(function () {
            this.shuffle();
        }.bind(this));
    },

    addSubmitAndDeclineButton: function() {
        let buttonSize = cc.spriteFrameCache.getSpriteFrame('button_blue.png').getOriginalSize();
        this.submitButton = new ccui.Button('#button_blue.png', '#button_blue_on.png', '#button_off.png', ccui.Widget.PLIST_TEXTURE);
        this.submitButton.setScale9Enabled(true);
        this.submitButton.setContentSize(100, 75);
        this.submitButton.setCapInsets(cc.rect(buttonSize.width / 2 - 1, buttonSize.height / 2 - 1, 2, 2));
        this.submitButton.setPosition(200, -200);

        let submitIcon = ccui.Scale9Sprite.createWithSpriteFrameName('submit_icon.png');
        submitIcon.setAnchorPoint(-0.55, -0.15);
        submitIcon.setScale(0.7);
        this.submitButton.addChild(submitIcon);

        this.declineButton = new ccui.Button('#button_blue.png', '#button_blue_on.png', '#button_off.png', ccui.Widget.PLIST_TEXTURE);
        this.declineButton.setScale9Enabled(true);
        this.declineButton.setContentSize(100, 75);
        this.declineButton.setCapInsets(cc.rect(buttonSize.width / 2 - 1, buttonSize.height / 2 - 1, 2, 2));
        this.declineButton.setPosition(-200, -200);

        let declineIcon = ccui.Scale9Sprite.createWithSpriteFrameName('cancel_icon.png');
        declineIcon.setAnchorPoint(-0.5, -0.2);
        declineIcon.setScale(0.7);
        this.declineButton.addChild(declineIcon);

        this.submitButton.addClickEventListener(function () {
            this.onNewWord(this.word);
            this.changeState(0);
        }.bind(this));

        this.declineButton.addClickEventListener(function () {
            this.changeState(0);
        }.bind(this));

        // this.addChild(this.submitButton);
        // this.addChild(this.declineButton);
    },

    changeState: function(state) {
        switch (state) {
            case 0:
                this.shuffleButton.setVisible(true);
                this.submitButton.removeFromParent();
                this.declineButton.removeFromParent();
                this.views.forEach(letter => {
                    letter.deselect();
                })
                this.word = "";
                this.currentWord.removeFromParent();
                this.currentWord = null;
                this.lastChosenLetters = [];
                this.state = 0;
                break;
            case 1:
                this.shuffleButton.setVisible(false);
                this.addChild(this.submitButton);
                this.addChild(this.declineButton);
                this.state = 1;
                break;
            case 2:

                break;
        }
    },

    updateCurrentWord: function() {
        if (this.currentWord === null) {
            this.currentWord = new CurrentWordView(this.word);
            this.addChild(this.currentWord);
        } else {
            if (this.currentWord.LetterCount > this.word.length) {
                this.currentWord.remLetter();
            } else {
                this.currentWord.addLetter(this.word[this.word.length - 1]);
            }
        }
    },

    setViewsPositions: function() {
        let angleStep = 360 / this.count;
        this.views.forEach((view, index) => {
            let dx = Math.cos(angleStep * index * Math.PI/180);
            let dy = Math.sin(angleStep * index * Math.PI/180);
            view.cleanup();
            view.runAction(new cc.Sequence(
                new cc.MoveTo(0.3, new cc.Point(dx * LettersView.RADIUS, dy * LettersView.RADIUS))
            ));
            // view.setPosition(dx * LettersView.RADIUS, dy * LettersView.RADIUS);
        });
    },

    shuffle: function() {
        cc.audioEngine.playEffect(resources.sounds.letter);
        let isDifferent = false;

        while (!isDifferent) {
            let oldViews = Array.from(this.views);
            this.views.sort(() => Math.random() - 0.5);
            for (let i = 0; i < this.views.length; ++i) {
                if (this.views[i] != oldViews[i]) {
                    isDifferent = true;
                    break;
                }
            }
        }
        
        this.setViewsPositions();
    }
});

LettersView.RADIUS = 100;
