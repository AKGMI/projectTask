var BalanceView = cc.Node.extend({
    ctor: function(_startAmount) {
        this._super();

        this.balance = _startAmount;
        this.icon = ccui.Scale9Sprite.createWithSpriteFrameName('coin.png');
        this.addChild(this.icon);
        this.balanceLabel = new ccui.Text(this.balance, resources.game_font.name, 60);
        this.balanceLabel.enableShadow(cc.color(0, 0, 0, 255), cc.size(1, 1), 2.0);
        this.balanceLabel.setPosition(this.icon.width * 1.5, 0);
        this.addChild(this.balanceLabel);
    },

    updateLabel: function() {
        this.balanceLabel.string = this.balance;
    },

    addBalance: function(amount) {
        this.balance += amount;
        this.updateLabel();
    },

    subBalance: function(amount) {
        this.balance -= amount;
        this.updateLabel();
    }
});