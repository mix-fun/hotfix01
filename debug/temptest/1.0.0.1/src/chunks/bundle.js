System.register([], function(_export, _context) { return { execute: function () {
System.register("chunks:///_virtual/account2.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './GameDataMgr.ts', './DataEnums.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, Label, _decorator, Component, director, UIOpacity, tween, GameDataMgr, EventID;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      Label = module.Label;
      _decorator = module._decorator;
      Component = module.Component;
      director = module.director;
      UIOpacity = module.UIOpacity;
      tween = module.tween;
    }, function (module) {
      GameDataMgr = module.GameDataMgr;
    }, function (module) {
      EventID = module.EventID;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2;
      const {
        ccclass,
        property
      } = _decorator;
      let account = exports('account', (_dec = ccclass('account'), _dec2 = property(Label), _dec3 = property(Label), _dec(_class = (_class2 = class account extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "labelNum", _descriptor, this);
          _initializerDefineProperty(this, "labelDelta", _descriptor2, this);
          this.tweenAni = null;
        }
        start() {
          director.on(EventID.UPDATE_ACCOUNT, this.updateTokenNum, this);
        }
        onEnable() {
          this.updateTokenNum();
        }
        onDisable() {
          if (this.tweenAni) {
            this.tweenAni.stop();
          }
        }
        addToken(num) {
          let gdMgr = GameDataMgr.instance;
          this.labelDelta.string = "+" + num;
          this.labelDelta.node.active = true;
          let opacity = this.labelDelta.node.getComponent(UIOpacity);
          opacity.opacity = 0;
          tween(opacity).to(1, {
            opacity: 255
          }, {
            easing: 'sineIn'
          }).call(() => {
            this.labelDelta.node.active = false;
            this.rollToTarget();
          }).start();
          gdMgr.data.coin += num;
          // this.updateTokenNum();
          gdMgr.saveData();
        }
        updateTokenNum() {
          let gdMgr = GameDataMgr.instance;
          this.labelNum.string = gdMgr.data.coin.toString();
        }
        rollToTarget() {
          let gdMgr = GameDataMgr.instance;
          let targetVal = gdMgr.data.coin;
          let currentVal = this.labelNum.string;
          this.tweenAni = tween({
            value: currentVal
          }).to(1, {
            value: targetVal
          }, {
            onUpdate: tweenObj => {
              this.labelNum.string = tweenObj.value;
            }
          }).start();
        }
        update(deltaTime) {}
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "labelNum", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "labelDelta", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));
    }
  };
});

System.register("chunks:///_virtual/env", [], function (exports) {
  return {
    execute: function () {
      const DEV = exports('DEV', false);
    }
  };
});

System.register("chunks:///_virtual/rollupPluginModLoBabelHelpers.js", [], function (exports) {
  return {
    execute: function () {
      exports({
        applyDecoratedDescriptor: _applyDecoratedDescriptor,
        initializerDefineProperty: _initializerDefineProperty
      });
      function _initializerDefineProperty(target, property, descriptor, context) {
        if (!descriptor) return;
        Object.defineProperty(target, property, {
          enumerable: descriptor.enumerable,
          configurable: descriptor.configurable,
          writable: descriptor.writable,
          value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
        });
      }
      function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object.keys(descriptor).forEach(function (key) {
          desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;
        if ('value' in desc || desc.initializer) {
          desc.writable = true;
        }
        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
          return decorator(target, property, desc) || desc;
        }, desc);
        if (context && desc.initializer !== void 0) {
          desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
          desc.initializer = undefined;
        }
        if (desc.initializer === void 0) {
          Object.defineProperty(target, property, desc);
          desc = null;
        }
        return desc;
      }
    }
  };
});

} }; });