var CostView = cc.Node.extend({
    ctor: function(_cost) {
        this._super();

        this.cost = _cost;
        this.costLabel = new ccui.Text(this.cost, resources.game_font.name, 60);
        this.costLabel.enableShadow(cc.color(0, 0, 0, 255), cc.size(1, 1), 2.0);
        this.addChild(this.costLabel);
        this.icon = ccui.Scale9Sprite.createWithSpriteFrameName('coin.png');
        this.icon.setPosition(this.costLabel.width * 1.1, 0);
        this.addChild(this.icon);
    }
});