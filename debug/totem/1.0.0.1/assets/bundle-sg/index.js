System.register("chunks:///_virtual/ad-unlock-popup.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './ad-manager.ts', './ui-manager.ts', './ui-view.ts', './ui-config.ts', './game-data-manager.ts', './report-agent.ts', './audio-manager.ts', './game-constants.ts', './bridge-util.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Label, _decorator, director, AdManager, UIManager, UIView, UIID, GameDataManager, ReportAgent, CustomReportEvent, PageName, BtnName, PhotoChooseNumReportEvent, AudioManager, AudioUrl, BridgeUtil, VibrationEffect;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      _decorator = module._decorator;
      director = module.director;
    }, function (module) {
      AdManager = module.AdManager;
    }, function (module) {
      UIManager = module.UIManager;
    }, function (module) {
      UIView = module.UIView;
    }, function (module) {
      UIID = module.UIID;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }, function (module) {
      ReportAgent = module.ReportAgent;
      CustomReportEvent = module.CustomReportEvent;
      PageName = module.PageName;
      BtnName = module.BtnName;
      PhotoChooseNumReportEvent = module.PhotoChooseNumReportEvent;
    }, function (module) {
      AudioManager = module.AudioManager;
    }, function (module) {
      AudioUrl = module.AudioUrl;
    }, function (module) {
      BridgeUtil = module.BridgeUtil;
      VibrationEffect = module.VibrationEffect;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "e90f7Z9YkVB1bt5QUdxzZFY", "ad-unlock-popup", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let AdUnlockPopup = exports('AdUnlockPopup', (_dec = ccclass('AdUnlockPopup'), _dec2 = property(Label), _dec(_class = (_class2 = class AdUnlockPopup extends UIView {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "lblDesc", _descriptor, this);
          this.picInfo = null;
          this.albumId = null;
          this.isCloseDirectly = false;
        }
        onOpen(fromUI, ...args) {
          let accountLayout = director.getScene().getChildByPath('Canvas/midLayer/LayoutTokenAccount');
          if (accountLayout) {
            accountLayout.active = false;
          }
          let data = args[0];
          this.isCloseDirectly = data.isCloseDirectly;
          this.albumId = data.albumId;
          this.picInfo = data.picInfo;
          let price = GameDataManager.instance.mainConfig.sg.illustration_cost;
          this.lblDesc.string = `you need to pay ${price} coins to unlock sexy photos. but you can unlock it for free by watching videos`;
          ReportAgent.reportCustomEvent(CustomReportEvent.AD_EVENT_DISTRIBUTED, {
            reward_page_show: 'unlock_ad'
          });
          ReportAgent.reportCustomEvent(CustomReportEvent.PAGE_BUTTON_ACTION, {
            page: PageName.AdUnlockPopup,
            btn: BtnName.Close,
            action: 'show'
          });
          ReportAgent.reportCustomEvent(CustomReportEvent.PAGE_BUTTON_ACTION, {
            page: PageName.AdUnlockPopup,
            btn: BtnName.Unlock,
            action: 'show'
          });
        }
        onClose() {
          GameDataManager.instance.saveData();
        }
        async onCloseBtn() {
          this.onClickBtn();
          ReportAgent.reportCustomEvent(CustomReportEvent.PAGE_BUTTON_ACTION, {
            page: PageName.AdUnlockPopup,
            btn: BtnName.Close,
            action: 'click'
          });
          GameDataManager.instance.localData.isFirstSelectPicGuide = false;
          UIManager.instance.close(this);
          if (!this.isCloseDirectly) {
            UIManager.instance.openPictureSelectView();
          }
          let isOpenInter = false;
          let config = GameDataManager.instance.mainConfig;
          console.log(`config: ${config}`);
          console.log(`isOpenInter: ${isOpenInter}`);
        }
        onUnlockBtn() {
          this.onClickBtn();
          ReportAgent.reportCustomEvent(CustomReportEvent.PAGE_BUTTON_ACTION, {
            page: PageName.AdUnlockPopup,
            btn: BtnName.Unlock,
            action: 'click'
          });
          ReportAgent.reportCustomEvent(CustomReportEvent.AD_EVENT_DISTRIBUTED, {
            reward_page_click: 'unlock_ad'
          });
          ReportAgent.reportCustomEvent(CustomReportEvent.PHOTO_CHOOSE_NUM, {
            id: this.picInfo.tag,
            event: PhotoChooseNumReportEvent.UNLOCKED
          });
          AdManager.instance.openVideoAd('', (entry, success) => {
            if (success) {
              if (this.albumId) {
                console.log(`this.albumId: ${this.albumId}`);
                // GameDataManager.instance.AddAlbumData(this.albumId, this.picInfo.id);
              } else {
                let picData = GameDataManager.instance.getPictureData(this.picInfo.id, null);
                picData && (picData.isLocked = false);
              }
              UIManager.instance.close(this);
              UIManager.instance.open(UIID.SlidePictureView, {
                picInfo: this.picInfo,
                albumId: this.albumId,
                isCloseDirectly: this.isCloseDirectly,
                layerId: 0
              });
            }
          });
        }
        onClickBtn() {
          AudioManager.instance.playEffect(AudioUrl.BTN_CLICK);
          BridgeUtil.vibrate(30, VibrationEffect.TICK);
        }
      }, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "lblDesc", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/btn-toggle.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, SpriteFrame, _decorator, Component, Sprite;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      SpriteFrame = module.SpriteFrame;
      _decorator = module._decorator;
      Component = module.Component;
      Sprite = module.Sprite;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "ebac76+ObxAn5tKi3Xw95OO", "btn-toggle", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let BtnToggle = exports('BtnToggle', (_dec = ccclass('btn_toggle'), _dec2 = property([SpriteFrame]), _dec(_class = (_class2 = class BtnToggle extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "frames", _descriptor, this);
          this._selected = false;
        }
        set selected(value) {
          this._selected = value;
          let sprBtn = this.getComponent(Sprite);
          sprBtn.spriteFrame = this.frames[this._selected ? 1 : 0];
        }
        get selected() {
          return this._selected;
        }
      }, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "frames", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/bubble-tips.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './random-util.ts', './picture-bubble.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Prefab, Node, _decorator, Component, NodePool, instantiate, Vec3, UIOpacity, tween, RandomUtil, PictureBubble;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Prefab = module.Prefab;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
      NodePool = module.NodePool;
      instantiate = module.instantiate;
      Vec3 = module.Vec3;
      UIOpacity = module.UIOpacity;
      tween = module.tween;
    }, function (module) {
      RandomUtil = module.RandomUtil;
    }, function (module) {
      PictureBubble = module.PictureBubble;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2;
      cclegacy._RF.push({}, "cf2ce8/k61FSJApPEZoXvEx", "bubble-tips", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let BubbleTips = exports('BubbleTips', (_dec = ccclass('BubbleTips'), _dec2 = property(Prefab), _dec3 = property(Node), _dec(_class = (_class2 = class BubbleTips extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "prfbBubble", _descriptor, this);
          _initializerDefineProperty(this, "star", _descriptor2, this);
          this.bubblePool = new NodePool();
          this.starPool = new NodePool();
        }
        start() {
          this.schedule(this.createBubbleRandom, 1.2);
          this.schedule(this.createStarRandom, 0.7);
        }
        onDestroy() {
          this.unschedule(this.createBubbleRandom);
          this.unschedule(this.createStarRandom);
        }
        doCreateBubble() {
          let bubble = this.bubblePool.get();
          if (!bubble) {
            bubble = instantiate(this.prfbBubble);
          }
          let comp = bubble.getComponent(PictureBubble);
          comp && comp.init();
          bubble.scale = new Vec3(1, 1, 1);
          return bubble;
        }
        doCreateStar() {
          let star = this.starPool.get();
          if (!star) {
            star = instantiate(this.star);
          }
          star.scale = new Vec3(1, 1, 1);
          return star;
        }
        createBubbleRandom() {
          let bubble = this.doCreateBubble();
          let randPosX = RandomUtil.random(-20, 20);
          bubble.setPosition(randPosX, 0, 0);
          bubble.active = true;
          bubble.setParent(this.node);
          let uiOpacity = bubble.getComponent(UIOpacity);
          uiOpacity.opacity = 255;
          let dur = RandomUtil.random(2, 3);
          tween(bubble).stop();
          tween(bubble).parallel(tween().by(dur, {
            position: new Vec3(0, 400, 0),
            scale: new Vec3(-0.5, -0.5, -0.5)
          }), tween(uiOpacity).to(dur, {
            opacity: 0
          })).call(() => {
            this.bubblePool.put(bubble);
          }).start();
        }
        createStarRandom() {
          let star = this.doCreateStar();
          let randPosX = RandomUtil.random(-20, 20);
          star.setPosition(randPosX, 0, 0);
          star.active = true;
          star.setParent(this.node);
          let uiOpacity = star.getComponent(UIOpacity);
          uiOpacity.opacity = 255;
          let dur = RandomUtil.random(2, 3);
          tween(star).stop();
          tween(star).parallel(tween().by(dur, {
            position: new Vec3(0, 400, 0),
            scale: new Vec3(-0.5, -0.5, -0.5)
          }), tween(uiOpacity).to(dur, {
            opacity: 0
          })).call(() => {
            this.starPool.put(star);
          }).start();
        }
        removeBubble(bubble) {
          if (this.bubblePool.size() > 10) {
            bubble.destroy();
          } else {
            this.bubblePool.put(bubble);
          }
        }
        removeStar(star) {
          if (this.starPool.size() > 10) {
            star.destroy();
          } else {
            this.starPool.put(star);
          }
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "prfbBubble", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "star", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/bundle-sg", ['./sg-manager.ts', './sg-text-config.ts', './sg-type-define.ts', './ad-unlock-popup.ts', './btn-toggle.ts', './bubble-tips.ts', './description-view.ts', './enable-btn.ts', './illustraion-item.ts', './illustration-tab.ts', './illustration-view.ts', './loading-sg-view.ts', './picture-bubble.ts', './picture-item.ts', './picture-obtain-popup.ts', './picture-select-item.ts', './picture-select-view.ts', './slide-picture-view.ts', './start-view-sg.ts', './task-item.ts'], function () {
  return {
    setters: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    execute: function () {}
  };
});

System.register("chunks:///_virtual/description-view.ts", ['cc', './ui-manager.ts', './ui-view.ts', './ui-config.ts', './game-data-manager.ts', './sg-manager.ts', './report-agent.ts'], function (exports) {
  var cclegacy, director, _decorator, UIManager, UIView, UIID, GameDataManager, SgManager, ReportAgent, CustomReportEvent;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      director = module.director;
      _decorator = module._decorator;
    }, function (module) {
      UIManager = module.UIManager;
    }, function (module) {
      UIView = module.UIView;
    }, function (module) {
      UIID = module.UIID;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }, function (module) {
      SgManager = module.SgManager;
    }, function (module) {
      ReportAgent = module.ReportAgent;
      CustomReportEvent = module.CustomReportEvent;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "2ca5f/O2MpKeJ9WdPpNHXkS", "description-view", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let DescriptionView = exports('DescriptionView', (_dec = ccclass('DescriptionView'), _dec(_class = class DescriptionView extends UIView {
        onOpen(fromUI, ...args) {
          let accountLayout = director.getScene().getChildByPath('Canvas/midLayer/LayoutTokenAccount');
          if (accountLayout) {
            accountLayout.active = false;
          }
          GameDataManager.instance.gameData.sgData.isPlayPlots = true;
          GameDataManager.instance.saveData();
          ReportAgent.reportCustomEvent(CustomReportEvent.USER_LIFECYCLE_MILESTONE, {
            action: 'life_first'
          });
        }
        async onContinueBtn() {
          // 预加载没完成，继续加载
          let state = SgManager.instance.loadingTaskStates.get('welcome-pics');
          if (state !== 2) {
            console.log(`Loading-Test onPlayBtn loadingState:${state}`);
            let promise = new Promise(async (resolve, reject) => {
              let count = 3;
              while (count > 0) {
                await new Promise(resolve => setTimeout(resolve, 3000));
                state = SgManager.instance.loadingTaskStates.get('welcome-pics');
                if (state == 2) {
                  break;
                }
                count--;
              }
              // 预加载完成，打开界面
              console.log(`Loading-Test onPlayBtn isLoading done-count:${count}`);
              UIManager.instance.openPictureSelectView();
              resolve(true);
            });
            UIManager.instance.close(this);
            UIManager.instance.open(UIID.LoadingSg, {
              promise: promise,
              desc: 'Loading Image...'
            });
          } else {
            UIManager.instance.close(this);
            UIManager.instance.openPictureSelectView();
          }
        }
      }) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/enable-btn.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, SpriteFrame, _decorator, Component, Sprite;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      SpriteFrame = module.SpriteFrame;
      _decorator = module._decorator;
      Component = module.Component;
      Sprite = module.Sprite;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "5659fJW4atOA6talZXg5/PU", "enable-btn", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let EnableBtn = exports('EnableBtn', (_dec = ccclass('EnableBtn'), _dec2 = property([SpriteFrame]), _dec(_class = (_class2 = class EnableBtn extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "sprFrames", _descriptor, this);
          this._isEnable = true;
        }
        set isEnable(value) {
          this._isEnable = value;
          this.node.getComponent(Sprite).spriteFrame = this.sprFrames[this._isEnable ? 0 : 1];
        }
        get isEnable() {
          return this._isEnable;
        }
      }, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "sprFrames", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/illustraion-item.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './res-util.ts', './ui-manager.ts', './ui-config.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, Sprite, _decorator, Component, SpriteFrame, ResUtil, UIManager, UIID;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      Sprite = module.Sprite;
      _decorator = module._decorator;
      Component = module.Component;
      SpriteFrame = module.SpriteFrame;
    }, function (module) {
      ResUtil = module.ResUtil;
    }, function (module) {
      UIManager = module.UIManager;
    }, function (module) {
      UIID = module.UIID;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2;
      cclegacy._RF.push({}, "de095vw+EFI0a4wx7vQ4M4B", "illustraion-item", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let IllustraionItem = exports('IllustraionItem', (_dec = ccclass('IllustraionItem'), _dec2 = property(Node), _dec3 = property(Sprite), _dec(_class = (_class2 = class IllustraionItem extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "favorite", _descriptor, this);
          _initializerDefineProperty(this, "pic", _descriptor2, this);
          this.url = '';
        }
        init(url, data) {
          this.url = url;
          ResUtil.load(this.pic.node, url, SpriteFrame, (err, frame) => {
            if (err) {
              console.error(err);
            } else {
              this.pic.spriteFrame = frame;
            }
          });
          this.isFavorite = data.isFavorite;
        }
        set isFavorite(val) {
          this.favorite.active = val;
        }
        get isFavorite() {
          return this.favorite.active;
        }
        onClickItem() {
          UIManager.instance.open(UIID.PictureView, this.url);
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "favorite", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "pic", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/illustration-tab.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, SpriteFrame, _decorator, Component, Sprite, UITransform;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      SpriteFrame = module.SpriteFrame;
      _decorator = module._decorator;
      Component = module.Component;
      Sprite = module.Sprite;
      UITransform = module.UITransform;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "af38eak9QpOKYLmoUE879bW", "illustration-tab", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let IllustrationTab = exports('IllustrationTab', (_dec = ccclass('IllustrationTab'), _dec2 = property({
        type: [SpriteFrame]
      }), _dec(_class = (_class2 = class IllustrationTab extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "frames", _descriptor, this);
        }
        set selected(val) {
          this.getComponent(Sprite).spriteFrame = this.frames[val ? 1 : 0];
          let trs = this.getComponent(UITransform);
          if (trs) {
            trs.height = val ? 113 : 98;
          }
        }
      }, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "frames", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/illustration-view.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './ui-view.ts', './illustration-tab.ts', './ui-manager.ts', './picture-item.ts', './game-data-manager.ts', './type-define.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, Prefab, _decorator, instantiate, director, UIView, IllustrationTab, UIManager, PictureItem, GameDataManager, SgState;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      Prefab = module.Prefab;
      _decorator = module._decorator;
      instantiate = module.instantiate;
      director = module.director;
    }, function (module) {
      UIView = module.UIView;
    }, function (module) {
      IllustrationTab = module.IllustrationTab;
    }, function (module) {
      UIManager = module.UIManager;
    }, function (module) {
      PictureItem = module.PictureItem;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }, function (module) {
      SgState = module.SgState;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3;
      cclegacy._RF.push({}, "032eb1xXSJHrKm4S0gykI4+", "illustration-view", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      var IllustrationTabIdx = /*#__PURE__*/function (IllustrationTabIdx) {
        IllustrationTabIdx[IllustrationTabIdx["All"] = 0] = "All";
        IllustrationTabIdx[IllustrationTabIdx["Locked"] = 1] = "Locked";
        IllustrationTabIdx[IllustrationTabIdx["Specail"] = 2] = "Specail";
        IllustrationTabIdx[IllustrationTabIdx["Favorite"] = 3] = "Favorite";
        return IllustrationTabIdx;
      }(IllustrationTabIdx || {});
      let IllustrationView = exports('IllustrationView', (_dec = ccclass('IllustrationView'), _dec2 = property({
        type: IllustrationTab
      }), _dec3 = property(Node), _dec4 = property(Prefab), _dec(_class = (_class2 = class IllustrationView extends UIView {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "tabs", _descriptor, this);
          _initializerDefineProperty(this, "itemContainer", _descriptor2, this);
          _initializerDefineProperty(this, "prfbItem", _descriptor3, this);
          this.items = [];
          this.illustraionItems = [];
          this.tabIdx = IllustrationTabIdx.All;
        }
        onOpen(fromUI, ...args) {
          this.hideAccountLayout();
          let infoList = GameDataManager.instance.getSelectedPictureList(true);
          for (let info of infoList) {
            let node = instantiate(this.prfbItem);
            let item = node.getComponent(PictureItem);
            if (item) {
              item.initWithInfo(info);
              this.items.push(item);
              this.itemContainer.addChild(node);
            }
          }
        }
        onTop(preID, ...args) {
          this.hideAccountLayout();
          if (GameDataManager.instance.gameData.sgData.state === SgState.Started) {
            this.items.forEach(item => {
              item.updateUI();
            });
          }
          this.updateScoreView(this.tabIdx);
        }
        onClose() {
          let accountLayout = director.getScene().getChildByPath('Canvas/midLayer/LayoutTokenAccount');
          if (accountLayout) {
            accountLayout.active = true;
          }
          GameDataManager.instance.saveData(true);
        }
        hideAccountLayout() {
          let accountLayout = director.getScene().getChildByPath('Canvas/midLayer/LayoutTokenAccount');
          if (accountLayout) {
            accountLayout.active = false;
          }
        }
        setTabIdx(val) {
          this.tabIdx = val;
          this.tabs.forEach((tab, idx) => {
            tab.selected = idx == val;
          });
          this.updateScoreView(val);
        }
        updateScoreView(tabIdx) {
          let state = GameDataManager.instance.gameData.sgData.state;
          switch (tabIdx) {
            case IllustrationTabIdx.All:
              {
                if (state === SgState.Started) {
                  this.items.forEach(item => {
                    item.node.active = true;
                  });
                }
              }
              break;
            case IllustrationTabIdx.Locked:
              {
                this.items.forEach(item => {
                  item.node.active = item.isLocked;
                });
              }
              break;
            case IllustrationTabIdx.Specail:
              {
                if (state === SgState.Started) {
                  this.items.forEach(item => {
                    item.node.active = item.isSpecial;
                  });
                }
              }
              break;
            case IllustrationTabIdx.Favorite:
              {
                if (state === SgState.Started) {
                  this.items.forEach(item => {
                    item.node.active = item.isFavorite;
                  });
                }
              }
              break;
          }
        }
        onClickTab(event, data) {
          let idx = parseInt(data);
          this.setTabIdx(idx);
        }
        onCloseBtn() {
          UIManager.instance.close(this);
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "tabs", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "itemContainer", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "prfbItem", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/loading-sg-view.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './ui-manager.ts', './ui-view.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, ProgressBar, _decorator, Vec3, tween, UIOpacity, Label, UIManager, UIView;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      ProgressBar = module.ProgressBar;
      _decorator = module._decorator;
      Vec3 = module.Vec3;
      tween = module.tween;
      UIOpacity = module.UIOpacity;
      Label = module.Label;
    }, function (module) {
      UIManager = module.UIManager;
    }, function (module) {
      UIView = module.UIView;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3;
      cclegacy._RF.push({}, "61bfd1T1Z9FDY5pmnz/EaDi", "loading-sg-view", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let LoadingSgView = exports('LoadingSgView', (_dec = ccclass('LoadingSgView'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(ProgressBar), _dec(_class = (_class2 = class LoadingSgView extends UIView {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "colorNode", _descriptor, this);
          _initializerDefineProperty(this, "logo", _descriptor2, this);
          _initializerDefineProperty(this, "progressBar", _descriptor3, this);
          this.timeCount = 0;
          this.timeTotal = 0;
          this.customCloseCallback = null;
        }
        onOpen(fromUI, ...args) {
          this.progress = 0;
          this.logo.scale = Vec3.ONE;
          tween(this.logo).stop();
          tween(this.logo).call(() => {
            this.playColorAnim();
          }).to(0.1, {
            scale: new Vec3(0.8, 0.8, 0.8)
          }).to(0.2, {
            scale: new Vec3(1.1, 1.1, 1.1)
          }).to(0.1, {
            scale: new Vec3(1, 1, 1)
          }).delay(2).union().repeatForever().start();
          let data = args[0];
          if (typeof data.displayTime === 'number') {
            this.customCloseCallback = data.onClose;
            this.scheduleOnce(() => {
              this.closeUI();
            }, data.displayTime);
            this.timeTotal = data.displayTime;
          }
          if (data.promise instanceof Promise) {
            data.promise.then(() => {
              this.closeUI();
            }).catch(() => {
              UIManager.instance.showToast(`Network Error`);
              this.closeUI();
            });
          }
        }
        onClose() {
          tween(this.logo).stop();
          tween(this.colorNode).stop();
        }
        closeUI() {
          this.progress = 1;
          this.toProgress(1, () => {
            this.customCloseCallback && this.customCloseCallback();
            this.scheduleOnce(() => {
              UIManager.instance.close(this);
            }, 0.5);
          });
        }
        update(dt) {
          this.timeCount += dt;
          if (this.progress < 1) {
            // loading with time
            if (this.timeTotal > 0) {
              let progress = this.timeCount / this.timeTotal;
              this.toProgress(progress);
            } else {
              // loading with promise
              if (this.timeCount > 1 && this.progress < 0.9) {
                let progress = this.progress + 0.1;
                this.toProgress(progress);
                this.timeCount = 0;
              }
            }
          }
        }
        playColorAnim() {
          let uiOpacity = this.colorNode.getComponent(UIOpacity);
          let dur = 2;
          let scale = 1.5;
          tween(this.colorNode).stop();
          this.colorNode.scale = Vec3.ZERO;
          uiOpacity.opacity = 255;
          tween(this.colorNode).parallel(tween().by(dur, {
            scale: new Vec3(scale, scale, scale)
          }), tween(uiOpacity).to(dur, {
            opacity: 0
          })).call(() => {
            this.colorNode.scale = Vec3.ZERO;
            uiOpacity.opacity = 255;
          }).start();
        }
        set progress(val) {
          this.progressBar.progress = val;
          let lbl = this.progressBar.getComponentInChildren(Label);
          lbl && (lbl.string = `${(val * 100).toFixed(0)}%`);
        }
        get progress() {
          return this.progressBar.progress;
        }
        toProgress(val, onComplete = null) {
          tween(this.progressBar).stop();
          tween(this.progressBar).to(0.5, {
            progress: val
          }).call(() => {
            this.progress = val;
            onComplete && onComplete();
          }).start();
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "colorNode", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "logo", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "progressBar", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/picture-bubble.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './random-util.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, SpriteFrame, _decorator, Component, Sprite, RandomUtil;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      SpriteFrame = module.SpriteFrame;
      _decorator = module._decorator;
      Component = module.Component;
      Sprite = module.Sprite;
    }, function (module) {
      RandomUtil = module.RandomUtil;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "23a8aCAX3RE/JhDcML22A1b", "picture-bubble", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let PictureBubble = exports('PictureBubble', (_dec = ccclass('picture_bubble'), _dec2 = property([SpriteFrame]), _dec(_class = (_class2 = class PictureBubble extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "frames", _descriptor, this);
        }
        init() {
          let rand = RandomUtil.random(0, this.frames.length - 1);
          this.id = rand;
        }
        set id(value) {
          let spr = this.getComponent(Sprite);
          let frame = this.frames[value];
          if (frame) {
            spr.spriteFrame = frame;
          }
        }
      }, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "frames", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/picture-item.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './sg-type-define.ts', './ui-manager.ts', './ui-config.ts', './audio-manager.ts', './game-constants.ts', './bridge-util.ts', './log-util.ts', './sg-manager.ts', './game-data-manager.ts', './graph-manager.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, Sprite, _decorator, Component, PictureType, UIManager, UIID, AudioManager, AudioUrl, BridgeUtil, VibrationEffect, LogUtil, SgManager, GameDataManager, GraphManager;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      Sprite = module.Sprite;
      _decorator = module._decorator;
      Component = module.Component;
    }, function (module) {
      PictureType = module.PictureType;
    }, function (module) {
      UIManager = module.UIManager;
    }, function (module) {
      UIID = module.UIID;
    }, function (module) {
      AudioManager = module.AudioManager;
    }, function (module) {
      AudioUrl = module.AudioUrl;
    }, function (module) {
      BridgeUtil = module.BridgeUtil;
      VibrationEffect = module.VibrationEffect;
    }, function (module) {
      LogUtil = module.LogUtil;
    }, function (module) {
      SgManager = module.SgManager;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }, function (module) {
      GraphManager = module.GraphManager;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3;
      cclegacy._RF.push({}, "c7637+G/jlBvZ9wZlLeyw+c", "picture-item", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let PictureItem = exports('PictureItem', (_dec = ccclass('PictureItem'), _dec2 = property(Node), _dec3 = property(Sprite), _dec4 = property(Node), _dec(_class = (_class2 = class PictureItem extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "lock", _descriptor, this);
          _initializerDefineProperty(this, "pic", _descriptor2, this);
          _initializerDefineProperty(this, "favorite", _descriptor3, this);
          this.info = null;
          this.data = null;
          this.albumId = null;
        }
        async initWithInfo(info, albumId) {
          if (!info) {
            LogUtil.warn('PictureItem initWithInfo info is null');
            return;
          }
          this.info = info;
          this.albumId = albumId;
          this.updateUI();
          this.pic.spriteFrame = await GraphManager.instance.loadGraph(info.url_A_t);
        }
        updateUI() {
          this.data = GameDataManager.instance.getPictureData(this.info.id, this.albumId);
          this.lock.active = this.data ? this.data.isLocked : true;
          this.favorite.active = this.data ? this.data.isFavorite : false;
        }
        set isLocked(val) {
          this.lock.active = val;
        }
        get isLocked() {
          return this.lock.active;
        }
        set isFavorite(val) {
          this.favorite.active = val;
        }
        get isFavorite() {
          return this.favorite.active;
        }
        get isSpecial() {
          return this.info ? this.info.isAd : false;
        }
        async onClickItem() {
          AudioManager.instance.playEffect(AudioUrl.BTN_CLICK);
          BridgeUtil.vibrate(30, VibrationEffect.TICK);
          let isCached = GraphManager.instance.isCached(this.info.url_B_s);
          console.log(`onClickItem isCached: ${isCached}`);
          if (!isCached) {
            let promise = new Promise(async (resolve, reject) => {
              let success = await SgManager.instance.getShowPageFrame(this.info, PictureType.PageB_Show, null);
              if (success) {
                setTimeout(() => {
                  if (this.data.isLocked) {
                    UIManager.instance.open(UIID.PictureObtainView, {
                      albumId: this.albumId,
                      picInfo: this.info,
                      showCloseBtn: true,
                      isCloseDirectly: true
                    });
                  } else {
                    UIManager.instance.open(UIID.SlidePictureView, {
                      picInfo: this.info,
                      isCloseDirectly: true,
                      layerId: 1
                    });
                  }
                }, 1000);
                resolve(true);
              } else {
                UIManager.instance.showToast(`Network error`);
                resolve(false);
              }
            });
            UIManager.instance.open(UIID.LoadingSg, {
              promise: promise
            });
          } else {
            if (this.data.isLocked) {
              UIManager.instance.open(UIID.PictureObtainView, {
                albumId: this.albumId,
                picInfo: this.info,
                showCloseBtn: true,
                isCloseDirectly: true
              });
            } else {
              UIManager.instance.open(UIID.SlidePictureView, {
                picInfo: this.info,
                isCloseDirectly: true,
                layerId: 1
              });
            }
          }
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "lock", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "pic", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "favorite", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/picture-obtain-popup.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './bridge-util.ts', './audio-manager.ts', './ui-manager.ts', './ui-view.ts', './ui-config.ts', './game-constants.ts', './game-data-manager.ts', './sg-type-define.ts', './sg-manager.ts', './report-agent.ts', './log-util.ts', './bg-adapter.ts', './ad-manager.ts', './graph-manager.ts', './loading-manager.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, Label, Sprite, SpriteFrame, _decorator, director, UITransform, tween, Vec3, sys, ParticleSystem2D, BridgeUtil, VibrationEffect, AudioManager, UIManager, UIView, UIID, AudioUrl, GameDataManager, PictureType, SgManager, ReportAgent, CustomReportEvent, PageName, BtnName, PhotoChooseNumReportEvent, LoadingTaskReportInfo, LoadingTaskType, LoadingTaskState, LogUtil, BgAdapter, AdManager, GraphManager, LoadingManager;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      Label = module.Label;
      Sprite = module.Sprite;
      SpriteFrame = module.SpriteFrame;
      _decorator = module._decorator;
      director = module.director;
      UITransform = module.UITransform;
      tween = module.tween;
      Vec3 = module.Vec3;
      sys = module.sys;
      ParticleSystem2D = module.ParticleSystem2D;
    }, function (module) {
      BridgeUtil = module.BridgeUtil;
      VibrationEffect = module.VibrationEffect;
    }, function (module) {
      AudioManager = module.AudioManager;
    }, function (module) {
      UIManager = module.UIManager;
    }, function (module) {
      UIView = module.UIView;
    }, function (module) {
      UIID = module.UIID;
    }, function (module) {
      AudioUrl = module.AudioUrl;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }, function (module) {
      PictureType = module.PictureType;
    }, function (module) {
      SgManager = module.SgManager;
    }, function (module) {
      ReportAgent = module.ReportAgent;
      CustomReportEvent = module.CustomReportEvent;
      PageName = module.PageName;
      BtnName = module.BtnName;
      PhotoChooseNumReportEvent = module.PhotoChooseNumReportEvent;
      LoadingTaskReportInfo = module.LoadingTaskReportInfo;
      LoadingTaskType = module.LoadingTaskType;
      LoadingTaskState = module.LoadingTaskState;
    }, function (module) {
      LogUtil = module.LogUtil;
    }, function (module) {
      BgAdapter = module.BgAdapter;
    }, function (module) {
      AdManager = module.AdManager;
    }, function (module) {
      GraphManager = module.GraphManager;
    }, function (module) {
      LoadingManager = module.LoadingManager;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15;
      cclegacy._RF.push({}, "07b12y+V4dIwpEOaEcXR3zo", "picture-obtain-popup", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let PictureObtainPopup = exports('PictureObtainPopup', (_dec = ccclass('PictureObtainPopup'), _dec2 = property(Boolean), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property(Label), _dec6 = property(Sprite), _dec7 = property(Sprite), _dec8 = property(Node), _dec9 = property(Sprite), _dec10 = property(Node), _dec11 = property(Node), _dec12 = property(Sprite), _dec13 = property(Node), _dec14 = property({
        type: [SpriteFrame]
      }), _dec15 = property(Node), _dec16 = property(Node), _dec(_class = (_class2 = class PictureObtainPopup extends UIView {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "isPopup", _descriptor, this);
          _initializerDefineProperty(this, "btnReturn", _descriptor2, this);
          _initializerDefineProperty(this, "pictureArea", _descriptor3, this);
          _initializerDefineProperty(this, "lblDesc", _descriptor4, this);
          _initializerDefineProperty(this, "sprPicCover", _descriptor5, this);
          _initializerDefineProperty(this, "sprPicPrivate", _descriptor6, this);
          _initializerDefineProperty(this, "magnifier", _descriptor7, this);
          _initializerDefineProperty(this, "sprMagPrivate", _descriptor8, this);
          _initializerDefineProperty(this, "btnUnlock", _descriptor9, this);
          _initializerDefineProperty(this, "btnDownload", _descriptor10, this);
          _initializerDefineProperty(this, "sprLike", _descriptor11, this);
          _initializerDefineProperty(this, "btnContinue", _descriptor12, this);
          _initializerDefineProperty(this, "framesLike", _descriptor13, this);
          _initializerDefineProperty(this, "btnSwitch", _descriptor14, this);
          _initializerDefineProperty(this, "likeEffect", _descriptor15, this);
          this.wPosPic = null;
          this.picInfo = null;
          this.albumId = null;
          this.isCloseDirectly = false;
        }
        async onOpen(fromUI, ...args) {
          ReportAgent.reportCustomEvent(CustomReportEvent.AD_EVENT_DISTRIBUTED, {
            reward_page_show: 'download_pag'
          });
          let accountLayout = director.getScene().getChildByPath('Canvas/midLayer/LayoutTokenAccount');
          if (accountLayout) {
            accountLayout.active = true;
          }
          let data = args[0];
          this.albumId = data.albumId;
          this.isCloseDirectly = data.isCloseDirectly;
          if (this.isPopup) {
            if (GameDataManager.instance.localData.isPicObtainPopup) {
              GameDataManager.instance.localData.isPicObtainPopup = false;
              ReportAgent.reportCustomEvent(CustomReportEvent.USER_LIFECYCLE_MILESTONE, {
                action: 'level_win_first'
              });
            }
            AudioManager.instance.playEffect(AudioUrl.WIN_STREAK_ADD);
          } else {
            if (GameDataManager.instance.localData.isFirstSelectPicGuide) {
              ReportAgent.reportCustomEvent(CustomReportEvent.USER_LIFECYCLE_MILESTONE, {
                action: 'unlock_photo_guide'
              });
            }
          }

          // page action report
          if (this.btnContinue.active) {
            ReportAgent.reportCustomEvent(CustomReportEvent.PAGE_BUTTON_ACTION, {
              page: PageName.PictureObtainPopup,
              btn: BtnName.Continue,
              action: 'show'
            });
          }
          if (this.btnDownload) {
            ReportAgent.reportCustomEvent(CustomReportEvent.PAGE_BUTTON_ACTION, {
              page: PageName.DownLoadPage,
              btn: BtnName.Download,
              action: 'show'
            });
          }
          if (this.btnUnlock.active) {
            ReportAgent.reportCustomEvent(CustomReportEvent.PAGE_BUTTON_ACTION, {
              page: PageName.PictureObtainPopup,
              btn: BtnName.Unlock,
              action: 'show'
            });
          }

          // config
          this.picInfo = data.picInfo;
          let picData = GameDataManager.instance.getPictureData(this.picInfo.id, this.albumId);
          if (picData && !picData.isOwned) {
            picData.isOwned = true;
          }
          let cost = GameDataManager.instance.mainConfig.sg.illustration_cost;
          if (cost > 0) {
            this.lblDesc.string = `${cost} to unlock her private photos`;
          }
          if (GameDataManager.instance.localData.isFirstSelectPicGuide) {
            this.scheduleOnce(() => {
              let wPos = this.btnUnlock.parent.getComponent(UITransform).convertToWorldSpaceAR(this.btnUnlock.position);
              UIManager.instance.showGuide({
                wPos: wPos,
                callback: () => {
                  this.onUnlockBtn();
                },
                force: false
              });
            });
          }
          this.btnReturn && (this.btnReturn.active = data.showCloseBtn);
          this.updateUI();
          this.magnifier.active = false;
          this.wPosPic = this.sprMagPrivate.node.parent.getComponent(UITransform).convertToWorldSpaceAR(this.sprMagPrivate.node.position);
          if (GraphManager.instance.isCached(this.picInfo.url_A_s)) {
            this.sprPicCover.spriteFrame = await GraphManager.instance.loadGraph(this.picInfo.url_A_s);
          } else {
            this.sprPicCover.spriteFrame = await GraphManager.instance.loadGraph(this.picInfo.url_A_t);
            let callbackA = spr => {
              if (!spr) {
                return;
              }
              if (this.sprPicCover && this.sprPicCover.isValid) {
                this.sprPicCover.spriteFrame = spr;
                let adapter = this.sprPicCover.getComponent(BgAdapter);
                adapter && adapter.updateSize();
              }
            };
            SgManager.instance.getShowPageFrame(this.picInfo, PictureType.PageA_Show, callbackA.bind(this));
          }
          let sprB = await GraphManager.instance.loadGraph(this.picInfo.url_B_s);
          let showSuccessNum = 0;
          if (this.sprPicCover && this.sprPicCover.spriteFrame) {
            showSuccessNum += 1;
          }
          if (sprB) {
            showSuccessNum += 1;
          }
          if (sprB) {
            if (this.sprPicPrivate && this.sprPicPrivate.isValid) {
              this.sprPicPrivate.node.active = true;
              this.sprPicPrivate.spriteFrame = sprB;
              let adapter = this.sprPicPrivate.getComponent(BgAdapter);
              adapter && adapter.updateSize();
            }
            if (this.sprMagPrivate && this.sprMagPrivate.isValid) {
              this.sprMagPrivate.node.active = true;
              this.sprMagPrivate.spriteFrame = sprB;
              let adapter = this.sprPicPrivate.getComponent(BgAdapter);
              adapter && adapter.updateSize();
              if (this.sprPicPrivate) {
                let wPos = this.sprPicPrivate.node.parent.getComponent(UITransform).convertToWorldSpaceAR(this.sprPicPrivate.node.position);
                let lPos = this.sprMagPrivate.node.parent.getComponent(UITransform).convertToNodeSpaceAR(wPos);
                this.sprMagPrivate.node.setPosition(lPos);
                this.sprMagPrivate.getComponent(UITransform).contentSize = this.sprPicPrivate.getComponent(UITransform).contentSize;
              }
            }
            if (this.btnUnlock.active) {
              this.schedule(this.playMagnifierAnim, 3);
            }
            ReportAgent.reportPageMonitoring(PageName.PictureObtainPopup, false, `${showSuccessNum}/2`);
          } else {
            try {
              this.sprPicPrivate.node.active = false;
              this.sprMagPrivate.node.active = false;
            } catch (error) {
              console.log("PictureObtainPopup, setnodeactive", error);
            }
            ReportAgent.reportPageMonitoring(PageName.PictureObtainPopup, true, `${showSuccessNum}/2`);
          }
        }
        onSwitchBtn() {
          this.flipPicture();
        }
        flipPicture() {
          tween(this.pictureArea).stop();
          this.pictureArea.scale = Vec3.ONE;
          tween(this.pictureArea).to(0.15, {
            scale: new Vec3(0, 1, 1)
          }).call(() => {
            if (this.sprPicCover.node.active) {
              if (this.sprPicPrivate.spriteFrame) {
                this.sprPicCover.node.active = false;
                this.sprPicPrivate.node.active = true;
              }
            } else {
              this.sprPicCover.node.active = true;
              this.sprPicPrivate.node.active = false;
            }
          }).to(0.15, {
            scale: Vec3.ONE
          }).start();
        }
        onClose() {
          let accountLayout = director.getScene().getChildByPath('Canvas/midLayer/LayoutTokenAccount');
          if (accountLayout) {
            accountLayout.active = false;
          }
          GameDataManager.instance.saveData();
        }
        onTop(preID, ...args) {
          this.updateUI();
        }
        updateUI() {
          let picData = GameDataManager.instance.getPictureData(this.picInfo.id, this.albumId);
          if (picData) {
            this.isLocked = picData.isLocked;
            this.isLike = picData.isFavorite;
            this.sprPicCover.node.active = picData.isLocked;
            this.btnSwitch.active = !picData.isLocked;
            if (sys.platform == sys.Platform.ANDROID) {
              this.btnDownload.active = !picData.isLocked;
            } else {
              this.btnDownload.active = !picData.isLocked;
            }
            this.btnUnlock.active = picData.isLocked;
          } else {
            this.isLocked = true;
            this.isLike = false;
            this.sprPicCover.node.active = true;
            this.btnSwitch.active = false;
            this.btnDownload.active = false;
            this.btnUnlock.active = true;
          }
          this.btnContinue.active = !this.isCloseDirectly && !GameDataManager.instance.localData.isFirstSelectPicGuide;
        }
        playMagnifierAnim() {
          this.magnifier.setPosition(150, 500, 0);
          this.magnifier.active = true;
          let dur = 1;
          tween(this.magnifier).to(dur, {
            position: new Vec3(-250, 0, 0)
          }, {
            easing: 'sineOut'
          }).to(dur, {
            position: new Vec3(400, 0, 0)
          }, {
            easing: 'sineOut'
          }).to(dur, {
            position: new Vec3(-150, -500, 0)
          }, {
            easing: 'sineOut'
          }).call(() => {
            this.magnifier.active = false;
            this.magnifier.setPosition(150, 500, 0);
          }).start();
        }
        lateUpdate(dt) {
          if (!this.sprMagPrivate.node.active) {
            return;
          }
          if (!this.wPosPic) {
            return;
          }
          let parent = this.sprMagPrivate.node.parent;
          let trsf = parent.getComponent(UITransform);
          if (!trsf) {
            trsf = parent.addComponent(UITransform);
          }
          let lPos = trsf.convertToNodeSpaceAR(this.wPosPic);
          this.sprMagPrivate.node.setPosition(lPos);
        }
        set isLike(val) {
          this.sprLike.spriteFrame = this.framesLike[val ? 1 : 0];
          this.likeEffect.active = val;
          if (this.likeEffect.active) {
            this.likeEffect.getComponent(ParticleSystem2D).resetSystem();
          } else {
            this.likeEffect.getComponent(ParticleSystem2D).stopSystem();
          }
        }
        set isLocked(val) {
          this.btnUnlock.active = val;
          this.btnDownload.active = !val;
          this.lblDesc.node.parent.active = !GameDataManager.instance.localData.isFirstSelectPicGuide && val;
        }
        onLikeBtn() {
          this.onClickBtn();
          let gdMgr = GameDataManager.instance;
          let picData = gdMgr.getPictureData(this.picInfo.id, this.albumId);
          if (picData) {
            picData.isFavorite = !picData.isFavorite;
            this.isLike = picData.isFavorite;
          } else {
            LogUtil.log(`picData is null`);
          }
        }
        onContinueBtn() {
          this.onClickBtn();
          ReportAgent.reportCustomEvent(CustomReportEvent.PAGE_BUTTON_ACTION, {
            page: PageName.PictureObtainPopup,
            btn: BtnName.Continue,
            action: 'click'
          });
          let scene = director.getScene();
          UIManager.instance.close(this);
          if (this.isPopup) {
            let isOpenInter = false;
            let config = GameDataManager.instance.mainConfig.inter_ad;
            console.log(`config: ${config}`);
            console.log(`isOpenInter: ${isOpenInter}`);
          }
          if (scene.name === 'stage') {
            UIManager.instance.openPictureSelectView();
          }
        }
        onUnlockBtn() {
          this.onClickBtn();
          ReportAgent.reportCustomEvent(CustomReportEvent.PAGE_BUTTON_ACTION, {
            page: PageName.PictureObtainPopup,
            btn: BtnName.Unlock,
            action: 'click'
          });
          ReportAgent.reportCustomEvent(CustomReportEvent.PHOTO_CHOOSE_NUM, {
            id: this.picInfo.tag,
            event: PhotoChooseNumReportEvent.UNLOCKED
          });
          if (GameDataManager.instance.localData.isFirstSelectPicGuide) {
            this.doUnlock();
            return;
          }
          let cost = GameDataManager.instance.mainConfig.sg.illustration_cost;
          if (GameDataManager.instance.getMinorToken() < cost) {
            UIManager.instance.close(this);
            UIManager.instance.open(UIID.AdUnlockPopup, {
              picInfo: this.picInfo,
              albumId: this.albumId,
              isCloseDirectly: this.isCloseDirectly
            });
          } else {
            GameDataManager.instance.addMinorToken(-cost);
            this.doUnlock();
          }
        }
        async doUnlock() {
          if (this.albumId) ;else {
            let picData = GameDataManager.instance.getPictureData(this.picInfo.id, null);
            if (!picData) {
              LogUtil.warn('picture-data-not-found');
              return;
            }
            picData.isLocked = false;
          }
          UIManager.instance.close(this);
          UIManager.instance.open(UIID.SlidePictureView, {
            picInfo: this.picInfo,
            albumId: this.albumId,
            isFromPopup: this.isPopup,
            isCloseDirectly: this.isCloseDirectly,
            layerId: 0
          });
        }
        onDownloadBtn() {
          this.onClickBtn();
          ReportAgent.reportCustomEvent(CustomReportEvent.PAGE_BUTTON_ACTION, {
            page: PageName.DownLoadPage,
            btn: BtnName.Download,
            action: 'click'
          });
          ReportAgent.reportCustomEvent(CustomReportEvent.AD_EVENT_DISTRIBUTED, {
            reward_page_click: 'download_pag'
          });
          ReportAgent.reportCustomEvent(CustomReportEvent.PHOTO_CHOOSE_NUM, {
            id: this.picInfo.tag,
            event: PhotoChooseNumReportEvent.DOWNLOADED
          });
          if (this.sprPicCover.node.active) {
            GraphManager.instance.loadGraph(this.picInfo.url_A);
          }
          if (this.sprPicPrivate.node.active) {
            GraphManager.instance.loadGraph(this.picInfo.url_B);
          }
          let gdMgr = GameDataManager.instance;
          let downloadedPicInfoList = gdMgr.gameData.sgData.downloadedPicInfoList;
          let idx = downloadedPicInfoList.findIndex(item => item.id === this.picInfo.id);
          if (idx !== -1) {
            this.saveImage();
          } else {
            AdManager.instance.openVideoAd('slide-picture-download', (entry, success) => {
              if (success) {
                this.saveImage();
              }
            });
          }
        }
        saveImage() {
          if (this.sprPicCover.node.active) {
            LoadingManager.instance.pauseLoading();
            let taskInfo = new LoadingTaskReportInfo(this.picInfo.id, LoadingTaskType.DOWNLOAD, LoadingTaskState.START, Date.now(), 0, GameDataManager.instance.gameData.level);
            ReportAgent.reportCustomEvent(CustomReportEvent.LOADING_GRAPH_TASK, taskInfo);
            BridgeUtil.saveToAlbum(this.picInfo.url_A).then(success => {
              if (success) {
                taskInfo.state = LoadingTaskState.SUCCESS;
                UIManager.instance.showToast('Download To Album Success');
              } else {
                taskInfo.state = LoadingTaskState.FAIL;
                BridgeUtil.saveToAlbum(this.picInfo.url_A_s).then(success => {
                  UIManager.instance.showToast('Download To Album Success');
                });
              }
              let timeStamp = taskInfo.time_stamp;
              taskInfo.time_stamp = Date.now();
              let duration = Math.floor((taskInfo.time_stamp - timeStamp) / 1000);
              taskInfo.duration = duration;
              ReportAgent.reportCustomEvent(CustomReportEvent.LOADING_GRAPH_TASK, taskInfo);
              LoadingManager.instance.resumeLoading();
            });
          }
          if (this.sprPicPrivate.node.active) {
            LoadingManager.instance.pauseLoading();
            BridgeUtil.saveToAlbum(this.picInfo.url_B).then(success => {
              if (success) {
                UIManager.instance.showToast('Download To Album Success');
              } else {
                BridgeUtil.saveToAlbum(this.picInfo.url_B_s).then(success => {
                  UIManager.instance.showToast('Download To Album Success');
                });
              }
              LoadingManager.instance.resumeLoading();
            });
          }
          let gdMgr = GameDataManager.instance;
          let downloadedPicInfoList = gdMgr.gameData.sgData.downloadedPicInfoList;
          let idx = downloadedPicInfoList.findIndex(item => item.id === this.picInfo.id);
          if (idx == -1) {
            downloadedPicInfoList.push(this.picInfo);
          }
        }
        onReturnBtn() {
          this.onClickBtn();
          UIManager.instance.close(this);
        }
        onClickBtn() {
          AudioManager.instance.playEffect(AudioUrl.BTN_CLICK);
          BridgeUtil.vibrate(30, VibrationEffect.TICK);
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "isPopup", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "btnReturn", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "pictureArea", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "lblDesc", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "sprPicCover", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "sprPicPrivate", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "magnifier", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "sprMagPrivate", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "btnUnlock", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "btnDownload", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "sprLike", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "btnContinue", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "framesLike", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "btnSwitch", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "likeEffect", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/picture-select-item.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './log-util.ts', './graph-manager.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Sprite, Node, _decorator, Component, tween, Vec3, LogUtil, GraphManager;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Sprite = module.Sprite;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
      tween = module.tween;
      Vec3 = module.Vec3;
    }, function (module) {
      LogUtil = module.LogUtil;
    }, function (module) {
      GraphManager = module.GraphManager;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2;
      cclegacy._RF.push({}, "d4679LNK4RKCr8DcC5e8WGi", "picture-select-item", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let PictureSelectItem = exports('PictureSelectItem', (_dec = ccclass('PictureSelectItem'), _dec2 = property(Sprite), _dec3 = property(Node), _dec(_class = (_class2 = class PictureSelectItem extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "pic", _descriptor, this);
          _initializerDefineProperty(this, "iconAd", _descriptor2, this);
          this.info = null;
          this.originalPos = null;
        }
        async init(info) {
          this.originalPos = this.node.position;
          if (!info || !info.url_A_t) {
            LogUtil.log('PictureSelectItem init error: info is null');
            return;
          }
          this.info = info;
          this.iconAd.active = this.info.isAd;

          // 后面改成url_s
          let spf = await GraphManager.instance.loadGraph(this.info.url_A_t);
          if (!spf) {
            console.log(`PictureSelectItem url:${this.info.url_A_t} load error`);
          } else if (this.pic) {
            this.pic.spriteFrame = spf;
          }
          this.stopTipsAnim();
        }
        playTipsAnim() {
          if (!this.node.active) {
            return;
          }
          tween(this.node).stop();
          this.node.position = this.originalPos;
          let dur = 1 / 10;
          tween(this.node).by(dur, {
            position: new Vec3(10, 0, 0)
          }).by(dur, {
            position: new Vec3(-20, 0, 0)
          }).by(dur, {
            position: new Vec3(18, 0, 0)
          }).by(dur, {
            position: new Vec3(-16, 0, 0)
          }).by(dur, {
            position: new Vec3(13, 0, 0)
          }).by(dur, {
            position: new Vec3(-10, 0, 0)
          }).by(dur, {
            position: new Vec3(8, 0, 0)
          }).by(dur, {
            position: new Vec3(-6, 0, 0)
          }).by(dur, {
            position: new Vec3(3, 0, 0)
          }).start();
        }
        stopTipsAnim() {
          if (!this.node.active) {
            return;
          }
          tween(this.node).stop();
          this.node.position = this.originalPos;
        }
        showFreshBtn(show) {
          let freshBtn = this.node.getChildByName('FreshBtn');
          freshBtn.active = show;
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "pic", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "iconAd", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/picture-select-view.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './ui-view.ts', './picture-select-item.ts', './game-data-manager.ts', './log-util.ts', './sg-manager.ts', './ui-manager.ts', './sg-type-define.ts', './ad-manager.ts', './report-agent.ts', './ui-config.ts', './graph-manager.ts', './audio-manager.ts', './game-constants.ts', './bridge-util.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, _decorator, director, tween, UIView, PictureSelectItem, GameDataManager, LogUtil, SgManager, UIManager, PictureType, AdManager, ReportAgent, CustomReportEvent, PhotoChooseNumReportEvent, PageName, BtnName, UIID, GraphManager, AudioManager, AudioUrl, BridgeUtil, VibrationEffect;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      _decorator = module._decorator;
      director = module.director;
      tween = module.tween;
    }, function (module) {
      UIView = module.UIView;
    }, function (module) {
      PictureSelectItem = module.PictureSelectItem;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }, function (module) {
      LogUtil = module.LogUtil;
    }, function (module) {
      SgManager = module.SgManager;
    }, function (module) {
      UIManager = module.UIManager;
    }, function (module) {
      PictureType = module.PictureType;
    }, function (module) {
      AdManager = module.AdManager;
    }, function (module) {
      ReportAgent = module.ReportAgent;
      CustomReportEvent = module.CustomReportEvent;
      PhotoChooseNumReportEvent = module.PhotoChooseNumReportEvent;
      PageName = module.PageName;
      BtnName = module.BtnName;
    }, function (module) {
      UIID = module.UIID;
    }, function (module) {
      GraphManager = module.GraphManager;
    }, function (module) {
      AudioManager = module.AudioManager;
    }, function (module) {
      AudioUrl = module.AudioUrl;
    }, function (module) {
      BridgeUtil = module.BridgeUtil;
      VibrationEffect = module.VibrationEffect;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2;
      cclegacy._RF.push({}, "d3180tUCDRHdZ1ckWpv7JYg", "picture-select-view", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      const GUIDE_CD_TIME = 2;
      let PictureSelectView = exports('PictureSelectView', (_dec = ccclass('PictureSelectView'), _dec2 = property([PictureSelectItem]), _dec3 = property(Node), _dec(_class = (_class2 = class PictureSelectView extends UIView {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "items", _descriptor, this);
          _initializerDefineProperty(this, "btnClose", _descriptor2, this);
          this.guideWaitTime = 0;
          this.isGuide = false;
          this.freshCount = 0;
        }
        onOpen(fromUI, ...args) {
          BridgeUtil.vibrate(30, VibrationEffect.CLICK);
          let accountLayout = director.getScene().getChildByPath('Canvas/midLayer/LayoutTokenAccount');
          if (accountLayout) {
            accountLayout.active = false;
          }
          let data = args[0];
          let showItemCount = 4;
          let isAd = false;
          let isFreshShow = false;
          if (Array.isArray(data.infoList) && data.infoList.length > 0) {
            this.items.forEach((item, index) => {
              let info = data.infoList[index];
              if (info) {
                item.node.active = true;
                let picData = GameDataManager.instance.getPictureData(info.id);
                picData.isShowed = true;
                ReportAgent.reportCustomEvent(CustomReportEvent.PHOTO_CHOOSE_NUM, {
                  id: info.tag,
                  event: PhotoChooseNumReportEvent.SHOW
                });
                item.init(info);
                if (info.isAd) {
                  isAd = true;
                }
                let list = GameDataManager.instance.getAvailablePictureList(1, info.isAd);
                let showFreshBtn = list.length > 0 ? GameDataManager.instance.mainConfig.sg.select.refresh_time > 0 : false;
                if (showFreshBtn) {
                  isFreshShow = true;
                }
                item.showFreshBtn(showFreshBtn);
              } else {
                item.node.active = false;
                showItemCount--;
                console.log(`Loading-Test-data-not-found:${index}`);
              }
            });
          }
          if (isFreshShow) {
            ReportAgent.reportCustomEvent(CustomReportEvent.PAGE_BUTTON_ACTION, {
              page: PageName.PictureSelectView,
              btn: BtnName.Refresh,
              action: 'show'
            });
          }
          if (isAd) {
            ReportAgent.reportCustomEvent(CustomReportEvent.AD_EVENT_DISTRIBUTED, {
              reward_page_show: 'photo_pick'
            });
          }
          let isPageShowError = showItemCount < 4;
          ReportAgent.reportPageMonitoring(PageName.PictureSelectView, isPageShowError, `${showItemCount}/4`);
          if (showItemCount < 1) {
            // this.btnClose.active = true;
            UIManager.instance.close(this);
            UIManager.instance.showToast('Load Item Failed');
          } else {
            this.btnClose.active = false;
            ReportAgent.reportCustomEvent(CustomReportEvent.PAGE_BUTTON_ACTION, {
              page: PageName.PictureSelectView,
              btn: BtnName.Pick,
              action: 'show'
            });
          }
          AudioManager.instance.playEffect(AudioUrl.LAUGH);
        }
        onClose() {
          GameDataManager.instance.saveData();
        }
        update(dt) {
          if (this.isGuide) {
            return;
          }
          this.guideWaitTime += dt;
          if (this.guideWaitTime > GUIDE_CD_TIME) {
            this.guideWaitTime = 0;
            this.playTips();
          }
        }
        async onFreshBtn(event, data) {
          this.onClickBtn();
          ReportAgent.reportCustomEvent(CustomReportEvent.PAGE_BUTTON_ACTION, {
            page: PageName.PictureSelectView,
            btn: BtnName.Refresh,
            action: 'click'
          });
          this.stopTips();
          let id = parseInt(data);
          let item = this.items[id];
          if (item) {
            let info = GameDataManager.instance.getAvailablePictureList(1, item.info.isAd)[0];
            if (!info) {
              return;
            }
            if (info.id === item.info.id) {
              LogUtil.log(`same picture info: ${info.id}`);
            } else {
              let spf = await GraphManager.instance.loadGraph(info.url_A_t);
              if (spf) {
                // spf is cached
                item.init(info);
              } else {
                let promise = new Promise(async (resolve, reject) => {
                  let onComplete = () => {
                    setTimeout(() => {
                      item.init(info);
                      resolve(true);
                    }, 100);
                  };
                  SgManager.instance.loadIllustrationSpf([info], PictureType.SmallPageA, onComplete.bind(this));
                });
                UIManager.instance.open(UIID.Loading, {
                  promise: promise
                });
              }
            }
          }
          if (++this.freshCount >= GameDataManager.instance.mainConfig.sg.select.refresh_time) {
            this.hideFreshBtn();
          }
        }
        hideFreshBtn() {
          this.items.forEach(item => {
            item.showFreshBtn(false);
          });
        }
        onClickItem(event, data) {
          this.onClickBtn();
          ReportAgent.reportCustomEvent(CustomReportEvent.PAGE_BUTTON_ACTION, {
            page: PageName.PictureSelectView,
            btn: BtnName.Pick,
            action: 'click'
          });
          let id = parseInt(data);
          let item = this.items[id];
          this.stopTips();
          let gdMgr = GameDataManager.instance;
          if (gdMgr.localData.isFirstSelectPicGuide) {
            ReportAgent.reportCustomEvent(CustomReportEvent.USER_LIFECYCLE_MILESTONE, {
              action: 'pick_photo_guide'
            });
          } else if (gdMgr.localData.isFirstSelectPic) {
            gdMgr.localData.isFirstSelectPic = false;
            ReportAgent.reportCustomEvent(CustomReportEvent.USER_LIFECYCLE_MILESTONE, {
              action: 'pick_photo_first'
            });
          }
          if (item && item.info) {
            if (item.info.isAd) {
              ReportAgent.reportCustomEvent(CustomReportEvent.AD_EVENT_DISTRIBUTED, {
                reward_page_click: 'photo_pick'
              });
              AdManager.instance.openVideoAd('PictureSelect_Select', (entry, success) => {
                if (success) {
                  this.onSelectSuccess(item.info);
                }
              });
            } else {
              this.onSelectSuccess(item.info);
              let isOpenInter = false;
              let config = GameDataManager.instance.mainConfig;
              console.log(`config: ${config}`);
              console.log(`isOpenInter: ${isOpenInter}`);
            }
          } else {
            if (director.getScene().name === 'map') {
              UIManager.instance.closeAll();
              director.loadScene('stage');
            } else {
              UIManager.instance.close(this);
            }
          }
        }
        async onSelectSuccess(info) {
          ReportAgent.reportCustomEvent(CustomReportEvent.PHOTO_CHOOSE_NUM, {
            id: info.tag,
            event: PhotoChooseNumReportEvent.SELECTED
          });
          let gdMgr = GameDataManager.instance;
          let data = gdMgr.getPictureData(info.id);
          data.isSelected = true;
          gdMgr.localData.selectedSgPicture = info;
          if (info.isAd) {
            let unselectedSpecialPicInfoList = gdMgr.gameData.sgData.unselectedSpecialPicInfoList;
            let idx = unselectedSpecialPicInfoList.findIndex(item => item.id === info.id);
            if (idx !== -1) {
              unselectedSpecialPicInfoList.splice(idx, 1);
            }
          } else {
            let unselectedNormalPicInfoList = gdMgr.gameData.sgData.unselectedNormalPicInfoList;
            let idx = unselectedNormalPicInfoList.findIndex(item => item.id === info.id);
            if (idx !== -1) {
              unselectedNormalPicInfoList.splice(idx, 1);
            }
          }
          let selectedPicInfoList = gdMgr.gameData.sgData.selectedPicInfoList;
          let idx = selectedPicInfoList.findIndex(item => item.id === info.id);
          if (idx == -1) {
            selectedPicInfoList.push(info);
          }
          if (director.getScene().name === 'map') {
            if (gdMgr.localData.isFirstSelectPicGuide) {
              UIManager.instance.close(this);
              UIManager.instance.open(UIID.PictureObtainView, {
                picInfo: info,
                showCloseBtn: false,
                isCloseDirectly: false
              });
              // let isCached = GraphManager.instance.isCached(info.url_B_s);
              // if (!isCached) {
              //     let promise = new Promise(async (resolve, reject) => {
              //         let success = await SgManager.instance.getShowPageFrame(info, PictureType.PageB_Show, null);
              //         if (success) {
              //             setTimeout(() => {
              //                 UIManager.instance.open(UIID.PictureObtainView, {
              //                     picInfo: info,
              //                     showCloseBtn: false,
              //                     isCloseDirectly: false,
              //                 });
              //             }, 100);
              //             resolve(true);
              //         } else {
              //             UIManager.instance.showToast(`Network error`);
              //             resolve(false);
              //         }
              //     });
              //     UIManager.instance.close(this);
              //     UIManager.instance.open(UIID.LoadingSg, {
              //         promise: promise
              //     });
              // } else {
              //     UIManager.instance.close(this);
              //     UIManager.instance.open(UIID.PictureObtainView, {
              //         picInfo: info,
              //         showCloseBtn: false,
              //         isCloseDirectly: false,
              //     });
              // }
              // return;
            } else {
              UIManager.instance.closeAll();
              director.loadScene('stage');
            }
          } else {
            UIManager.instance.close(this);
          }
          let isCached = GraphManager.instance.isCached(info.url_B_s);
          if (!isCached) {
            SgManager.instance.loadIllustrationSpf([info], PictureType.PageB_Show);
          }
        }
        playTips() {
          this.isGuide = true;
          let dur = 1.1;
          tween(this.node).stop();
          tween(this.node).delay(dur).call(() => {
            this.items[0].playTipsAnim();
          }).delay(dur).call(() => {
            this.items[1].playTipsAnim();
          }).delay(dur).call(() => {
            this.items[2].playTipsAnim();
          }).delay(dur).call(() => {
            this.items[3].playTipsAnim();
          }).delay(dur).call(() => {
            this.isGuide = false;
          }).start();
        }
        stopTips() {
          tween(this.node).stop();
          this.items.forEach(item => {
            item.stopTipsAnim();
          });
          this.guideWaitTime = 0;
          this.isGuide = false;
        }
        onCloseBtn() {
          UIManager.instance.close(this);
        }
        onClickBtn() {
          AudioManager.instance.playEffect(AudioUrl.BTN_CLICK);
          BridgeUtil.vibrate(30, VibrationEffect.TICK);
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "items", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "btnClose", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/sg-manager.ts", ['cc', './mount-point.ts', './ui-config.ts', './mount-manager.ts', './log-util.ts', './request-manager2.ts', './storage-manager.ts', './sg-type-define.ts', './type-define.ts', './data-agent.ts', './object-util.ts', './graph-manager.ts', './game-data-manager.ts', './config.ts', './loading-manager.ts', './report-agent.ts'], function (exports) {
  var cclegacy, _decorator, sys, MountPoint, UIID, MountManager, LogUtil, ReqeustManager, StorageManager, SgPicInfo, SgLoadingState, PictureType, PictureInfo, DataAgent, DataType, ObjectUtil, GraphManager, GameDataManager, Config, LoadingManager, LoadingTaskType;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      sys = module.sys;
    }, function (module) {
      MountPoint = module.MountPoint;
    }, function (module) {
      UIID = module.UIID;
    }, function (module) {
      MountManager = module.MountManager;
    }, function (module) {
      LogUtil = module.LogUtil;
    }, function (module) {
      ReqeustManager = module.ReqeustManager;
    }, function (module) {
      StorageManager = module.StorageManager;
    }, function (module) {
      SgPicInfo = module.SgPicInfo;
      SgLoadingState = module.SgLoadingState;
      PictureType = module.PictureType;
    }, function (module) {
      PictureInfo = module.PictureInfo;
    }, function (module) {
      DataAgent = module.DataAgent;
      DataType = module.DataType;
    }, function (module) {
      ObjectUtil = module.ObjectUtil;
    }, function (module) {
      GraphManager = module.GraphManager;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }, function (module) {
      Config = module.Config;
    }, function (module) {
      LoadingManager = module.LoadingManager;
    }, function (module) {
      LoadingTaskType = module.LoadingTaskType;
    }],
    execute: function () {
      var _dec, _class, _class2;
      cclegacy._RF.push({}, "c5660i1ctZIEL3ofABH6xSK", "sg-manager", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let SgManager = exports('SgManager', (_dec = ccclass('SgManager'), _dec(_class = (_class2 = class SgManager {
        constructor() {
          this.sgPicInfo = new SgPicInfo();
          this.loadingTaskStates = new Map();
        }
        static get instance() {
          if (!this._instance) {
            this._instance = new SgManager();
            this._instance.initSgPicInfo();
          }
          return this._instance;
        }
        // private loadingQueue: SgLoadingTask[] = [];
        // private isLoading: boolean = false;
        initSgPicInfo() {
          let info = DataAgent.getData(DataType.SgPicInfo);
          if (info) {
            this.sgPicInfo = ObjectUtil.fromPlain(SgPicInfo, info);
          }
        }
        mount2point() {
          let mgr = MountManager.instance;
          mgr.mount(MountPoint.StageInitUIConf, this);
          mgr.mount(MountPoint.RemoteFetchIllustration, this);
          mgr.mount(MountPoint.NativeCheckLocalCache, this);
          mgr.mount(MountPoint.NativeNotifyGetIllustration, this);
          mgr.mount(MountPoint.NativeNotifyLoadPicture, this);
          mgr.mount(MountPoint.NativeNotifyGetPreloadTaskState, this);
          mgr.mount(MountPoint.NativeNotifyGetShowPageFrame, this);
        }
        onMountPoint(mountPoint, data) {
          switch (mountPoint) {
            case MountPoint.StageInitUIConf:
              {
                data[UIID.StartViewSg] = {
                  bundle: 'bundle-sg',
                  prefab: "prefab/StartView"
                };
                data[UIID.PictureObtainPopup] = {
                  bundle: 'bundle-sg',
                  prefab: "prefab/PictureObtainPopup",
                  preventTouch: true
                };
                data[UIID.AdUnlockPopup] = {
                  bundle: 'bundle-sg',
                  prefab: "prefab/AdUnlockPopup",
                  preventTouch: true
                };
                data[UIID.SlidePictureView] = {
                  bundle: 'bundle-sg',
                  prefab: "prefab/SlidePictureView",
                  preventTouch: true
                };
                data[UIID.IllustrationViewSg] = {
                  bundle: 'bundle-sg',
                  prefab: "prefab/IllustrationView",
                  preventTouch: true
                };
                data[UIID.PictureObtainView] = {
                  bundle: 'bundle-sg',
                  prefab: "prefab/PictureObtainView",
                  preventTouch: true
                };
                data[UIID.PictureSelectView] = {
                  bundle: 'bundle-sg',
                  prefab: "prefab/PictureSelectView",
                  preventTouch: true
                };
                data[UIID.LoadingSg] = {
                  bundle: 'bundle-sg',
                  prefab: "prefab/LoadingSgView",
                  preventTouch: true
                };
                break;
              }
            case MountPoint.RemoteFetchIllustration:
              {
                return this.fetchIllustration(data.total, data.adCount);
              }
            case MountPoint.NativeCheckLocalCache:
              {
                this.checkLocalCache();
                break;
              }
            case MountPoint.NativeNotifyGetIllustration:
              {
                return this.sgPicInfo.illustration;
              }
            case MountPoint.NativeNotifyLoadPicture:
              {
                return this.loadIllustrationSpf(data.infoList, data.type, data.onComplete, data.taskId);
              }
            case MountPoint.NativeNotifyGetPreloadTaskState:
              {
                return this.loadingTaskStates.get(data);
              }
            case MountPoint.NativeNotifyGetShowPageFrame:
              {
                return this.getShowPageFrame(data.info, data.type, data.onComplete);
              }
          }
        }

        /**
         * 请求illstration信息
         * @param total 
         * @param adCount 
         * @returns 
         */
        async fetchIllustration(total, adCount) {
          total = Math.max(total, 10);
          adCount = Math.min(adCount, total);
          return new Promise(async (resolve, reject) => {
            try {
              const data = await ReqeustManager.instance.get(`/graphs/list/normal/${StorageManager.instance.getUid()}/${total}/${adCount}`);
              if (data['ret'] == 0) {
                const list = data['data'];
                if (list) {
                  if (list.length > 0) {
                    this.updateIllustration(list);
                  } else {
                    LogUtil.warn(`fetchIllustration-list-empty`);
                  }
                }
              }
              resolve();
            } catch (error) {
              LogUtil.log('fetchIllustration error:', error);
              throw error; // 重新抛出错误，让调用者知道请求失败
            }
          });
        }

        /**
         * 更新本地illstration信息
         * @param list 
         */
        updateIllustration(list) {
          if (Array.isArray(list) && list.length > 0) {
            list.forEach(v => {
              let url_A = Config.SG_GRAPH_HOST + '/' + v.folder + '/' + v.name + `_A.` + v.suffix;
              let url_B = Config.SG_GRAPH_HOST + '/' + v.folder + '/' + v.name + `_B.` + v.suffix;
              let url_A_s = Config.SG_GRAPH_HOST + '/' + v.folder + '/' + v.name + `_A.s.` + v.suffix;
              let url_B_s = Config.SG_GRAPH_HOST + '/' + v.folder + '/' + v.name + `_B.s.` + v.suffix;
              let url_A_t = Config.SG_GRAPH_HOST + '/' + v.folder + '/' + v.name + `_A.t.` + v.suffix;
              let pictureInfo = new PictureInfo(v.tag, v.name, url_A, url_B, url_A_s, url_B_s, url_A_t, v.ad);
              this.sgPicInfo.illustration[pictureInfo.id] = pictureInfo;
            });
            DataAgent.saveData(DataType.SgPicInfo, this.sgPicInfo);
            GameDataManager.instance.saveData();
          }
        }
        async loadIllustrationSpf(infoList, type, onComplete, taskId) {
          return new Promise(async (resolve, reject) => {
            taskId && this.loadingTaskStates.set(taskId, SgLoadingState.Processing);
            for (let i = 0; i < infoList.length; i++) {
              let info = infoList[i];
              if (info) {
                switch (type) {
                  case PictureType.SmallPageA:
                    {
                      await LoadingManager.instance.loadGraph(info, type, true, LoadingTaskType.SELECT_A);
                    }
                    break;
                }
              }
            }
            taskId && this.loadingTaskStates.set(taskId, SgLoadingState.Done);
            onComplete && onComplete();
            resolve(true);
          });
        }
        async getShowPageFrame(info, type, onComplete) {
          let url = '';
          switch (type) {
            case PictureType.PageA_Show:
              url = info.url_A_s;
              break;
            case PictureType.PageB_Show:
              url = info.url_B_s;
              break;
          }
          if (url == '') {
            LogUtil.warn(`getOriginalSpf-url-empty:${info.id}`);
            return false;
          }
          let spr = await GraphManager.instance.loadGraph(url);
          if (sys.isBrowser || spr) {
            onComplete && onComplete(spr);
            LogUtil.log(`big pic complete:\n${url}`);
            return true;
          }
          return false;
        }
        async checkLocalCache() {
          // 保持单次加载图片不超过4张，满足选图需求即可
          let gdMgr = GameDataManager.instance;
          let cacheSize = 8;
          let needNum_n = cacheSize - gdMgr.gameData.sgData.unselectedNormalPicInfoList.length;
          needNum_n = Math.min(needNum_n, 4);
          if (needNum_n > 0) {
            let list = gdMgr.getUncachedPictureList(needNum_n, false);
            if (list.length < needNum_n) {
              await this.fetchIllustration(10, 0);
            }
            list = gdMgr.getUncachedPictureList(needNum_n, false);
            list.length;
            this.loadIllustrationSpf(list, PictureType.SmallPageA);
          }
          let needNum_s = cacheSize - gdMgr.gameData.sgData.unselectedSpecialPicInfoList.length - needNum_n;
          if (needNum_s > 0) {
            let list = gdMgr.getUncachedPictureList(needNum_s, true);
            if (list.length < needNum_s) {
              await this.fetchIllustration(10, 10);
            }
            list = gdMgr.getUncachedPictureList(needNum_s, true);
            list.length;
            this.loadIllustrationSpf(list, PictureType.SmallPageA);
          }
        }
      }, _class2._instance = null, _class2)) || _class));
      SgManager.instance.mount2point();
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/sg-text-config.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "68e9cr5z91DbKfBpc3f7qpA", "sg-text-config", undefined);
      const SG_TEXT_CONFIG = exports('SG_TEXT_CONFIG', {
        album: [{
          name: 'Yuya',
          occupation: 'Housewife',
          desc: 'Japanese-style girls embody gentle serenity, harmonizing quiet confidence with subtle elegance, radiating warmth through humility and innate grace.'
        }]
      });
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/sg-type-define.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './object-util.ts', './type-define.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, ArrayType, PictureInfo;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      ArrayType = module.ArrayType;
    }, function (module) {
      PictureInfo = module.PictureInfo;
    }],
    execute: function () {
      var _dec, _class2, _descriptor;
      cclegacy._RF.push({}, "b10a1dsCzJEdYd827E4R7u5", "sg-type-define", undefined);
      class IllustrationInfo {
        constructor() {
          this.tag = '';
          this.name = '';
          this.folder = '';
          this.suffix = '';
          this.group = '';
          this.ad = false;
        }
      }
      exports('IllustrationInfo', IllustrationInfo);
      let PictureType = exports('PictureType', /*#__PURE__*/function (PictureType) {
        PictureType[PictureType["PageA"] = 0] = "PageA";
        PictureType[PictureType["PageB"] = 1] = "PageB";
        PictureType[PictureType["SmallPageA"] = 2] = "SmallPageA";
        PictureType[PictureType["PageA_Show"] = 3] = "PageA_Show";
        PictureType[PictureType["PageB_Show"] = 4] = "PageB_Show";
        return PictureType;
      }({}));
      let AlbumInfo = exports('AlbumInfo', (_dec = ArrayType(PictureInfo), (_class2 = class AlbumInfo {
        constructor() {
          this.id = '';
          this.name = 'name';
          this.occupation = 'occupation';
          this.desc = 'desc';
          this.cost = 10;
          _initializerDefineProperty(this, "pictures", _descriptor, this);
        }
      }, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "pictures", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _class2)));
      class SpfCacheInfo {
        constructor() {
          this.url = '';
          this.spf = null;
        }
      }
      exports('SpfCacheInfo', SpfCacheInfo);
      class SgPicInfo {
        constructor() {
          this.illustration = {};
          this.album = [];
        }
      }
      exports('SgPicInfo', SgPicInfo);
      let SgLoadingState = exports('SgLoadingState', /*#__PURE__*/function (SgLoadingState) {
        SgLoadingState[SgLoadingState["None"] = 0] = "None";
        SgLoadingState[SgLoadingState["Processing"] = 1] = "Processing";
        SgLoadingState[SgLoadingState["Done"] = 2] = "Done";
        return SgLoadingState;
      }({}));
      class SgLoadingTask {
        constructor() {
          this.taskId = '';
          this.infoList = [];
          this.type = PictureType.SmallPageA;
          this.onComplete = void 0;
        }
      }
      exports('SgLoadingTask', SgLoadingTask);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/slide-picture-view.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './ui-manager.ts', './ui-view.ts', './sg-manager.ts', './game-data-manager.ts', './sg-type-define.ts', './ui-config.ts', './bridge-util.ts', './report-agent.ts', './audio-manager.ts', './game-constants.ts', './ui-util.ts', './bg-adapter.ts', './graph-manager.ts', './ad-manager.ts', './loading-manager.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, Sprite, ProgressBar, Mask, Label, SpriteFrame, _decorator, UITransform, Vec3, Rect, ParticleSystem2D, Graphics, Vec2, director, UIOpacity, tween, UIManager, UIView, SgManager, GameDataManager, PictureType, UIID, BridgeUtil, ReportAgent, CustomReportEvent, PageName, BtnName, PhotoChooseNumReportEvent, AudioManager, AudioUrl, UIUtil, BgAdapter, GraphManager, AdManager, LoadingManager;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      Sprite = module.Sprite;
      ProgressBar = module.ProgressBar;
      Mask = module.Mask;
      Label = module.Label;
      SpriteFrame = module.SpriteFrame;
      _decorator = module._decorator;
      UITransform = module.UITransform;
      Vec3 = module.Vec3;
      Rect = module.Rect;
      ParticleSystem2D = module.ParticleSystem2D;
      Graphics = module.Graphics;
      Vec2 = module.Vec2;
      director = module.director;
      UIOpacity = module.UIOpacity;
      tween = module.tween;
    }, function (module) {
      UIManager = module.UIManager;
    }, function (module) {
      UIView = module.UIView;
    }, function (module) {
      SgManager = module.SgManager;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }, function (module) {
      PictureType = module.PictureType;
    }, function (module) {
      UIID = module.UIID;
    }, function (module) {
      BridgeUtil = module.BridgeUtil;
    }, function (module) {
      ReportAgent = module.ReportAgent;
      CustomReportEvent = module.CustomReportEvent;
      PageName = module.PageName;
      BtnName = module.BtnName;
      PhotoChooseNumReportEvent = module.PhotoChooseNumReportEvent;
    }, function (module) {
      AudioManager = module.AudioManager;
    }, function (module) {
      AudioUrl = module.AudioUrl;
    }, function (module) {
      UIUtil = module.UIUtil;
    }, function (module) {
      BgAdapter = module.BgAdapter;
    }, function (module) {
      GraphManager = module.GraphManager;
    }, function (module) {
      AdManager = module.AdManager;
    }, function (module) {
      LoadingManager = module.LoadingManager;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25;
      cclegacy._RF.push({}, "ab4b8/fLRZCIoVGUAYW3mzW", "slide-picture-view", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      const SliceSize = 100;
      const GridCountH = 8;
      const GridCountV = 10;
      const AutoLoadingSpeed = 0.8;
      let SlidePictureView = exports('SlidePictureView', (_dec = ccclass('SlidePictureView'), _dec2 = property([Node]), _dec3 = property(Node), _dec4 = property(Sprite), _dec5 = property(Sprite), _dec6 = property(ProgressBar), _dec7 = property(Mask), _dec8 = property(Mask), _dec9 = property(Node), _dec10 = property(Node), _dec11 = property(Label), _dec12 = property(Node), _dec13 = property(Sprite), _dec14 = property(Sprite), _dec15 = property(Node), _dec16 = property(Node), _dec17 = property(Node), _dec18 = property(Node), _dec19 = property(Node), _dec20 = property(Sprite), _dec21 = property({
        type: [SpriteFrame]
      }), _dec22 = property(Node), _dec23 = property(Node), _dec24 = property(Node), _dec25 = property(Node), _dec26 = property(Node), _dec(_class = (_class2 = class SlidePictureView extends UIView {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "layers", _descriptor, this);
          // layer 0
          _initializerDefineProperty(this, "picArea", _descriptor2, this);
          _initializerDefineProperty(this, "sprPicCover", _descriptor3, this);
          _initializerDefineProperty(this, "sprPicPrivate", _descriptor4, this);
          _initializerDefineProperty(this, "progressBar", _descriptor5, this);
          _initializerDefineProperty(this, "mask", _descriptor6, this);
          _initializerDefineProperty(this, "maskCover", _descriptor7, this);
          _initializerDefineProperty(this, "blurCover", _descriptor8, this);
          _initializerDefineProperty(this, "slideLayer", _descriptor9, this);
          _initializerDefineProperty(this, "lblDesc", _descriptor10, this);
          _initializerDefineProperty(this, "particle", _descriptor11, this);
          // layer 1
          _initializerDefineProperty(this, "bgA", _descriptor12, this);
          _initializerDefineProperty(this, "bgB", _descriptor13, this);
          _initializerDefineProperty(this, "btnContinue", _descriptor14, this);
          _initializerDefineProperty(this, "btnDownload", _descriptor15, this);
          _initializerDefineProperty(this, "btnLike", _descriptor16, this);
          _initializerDefineProperty(this, "btnSwitch", _descriptor17, this);
          _initializerDefineProperty(this, "btnMore", _descriptor18, this);
          _initializerDefineProperty(this, "sprLike", _descriptor19, this);
          _initializerDefineProperty(this, "framesLike", _descriptor20, this);
          _initializerDefineProperty(this, "btnPre", _descriptor21, this);
          _initializerDefineProperty(this, "btnNext", _descriptor22, this);
          _initializerDefineProperty(this, "btnClose", _descriptor23, this);
          _initializerDefineProperty(this, "likeEffect", _descriptor24, this);
          _initializerDefineProperty(this, "adIcon", _descriptor25, this);
          this.isSliding = false;
          this.autoSlideSpeed = AutoLoadingSpeed;
          this.targetProgress = 0;
          this.picInfo = null;
          this.albumId = null;
          this.gridList = [];
          this.sliceTime = 0;
          this.sliceAudioCd = false;
          this.isCloseDirectly = false;
          this.fromUI = 0;
          this.isPlayingEffect = false;
        }
        async onOpen(fromUI, ...args) {
          this.fromUI = fromUI;
          let data = args[0];
          this.picInfo = data.picInfo;
          this.albumId = data.albumId;
          this.isCloseDirectly = data.isCloseDirectly;
          ReportAgent.reportCustomEvent(CustomReportEvent.AD_EVENT_DISTRIBUTED, {
            reward_page_show: 'download_pag'
          });
          this.updateAdIcon();
          for (let i = 0; i < this.layers.length; i++) {
            let layer = this.layers[i];
            layer.active = i == data.layerId;
          }
          this.btnMore.active = GameDataManager.instance.localData.isFirstSelectPicGuide && !this.isCloseDirectly;
          this.btnContinue.active = !GameDataManager.instance.localData.isFirstSelectPicGuide && !this.isCloseDirectly;
          this.btnClose.active = this.isCloseDirectly;
          this.btnNext.active = this.btnPre.active = false;
          this.btnDownload.active = true;
          // page action report
          if (this.layers[1].active && this.btnDownload.active) {
            ReportAgent.reportCustomEvent(CustomReportEvent.PAGE_BUTTON_ACTION, {
              page: PageName.DownLoadPage,
              btn: BtnName.Download,
              action: 'show'
            });
          }
          this.bgA.node.active = false;
          this.bgB.node.active = true;
          if (this.btnLike.active) {
            let picData = GameDataManager.instance.getPictureData(this.picInfo.id, this.albumId);
            this.isLike = picData.isFavorite;
          }
          this.particle.active = false;
          if (this.layers[0].active) {
            this.setProgress(0);
            if (GameDataManager.instance.localData.isFirstSelectPicGuide) {
              ReportAgent.reportCustomEvent(CustomReportEvent.USER_LIFECYCLE_MILESTONE, {
                action: 'more_grils_guide'
              });
              let wPos = this.picArea.getComponent(UITransform).convertToWorldSpaceAR(new Vec3(-400, 0, 0));
              UIManager.instance.showGuide({
                wPos: wPos,
                desc: {
                  text: null,
                  pos: Vec3.ZERO
                },
                callback: null,
                force: true,
                moveBy: new Vec3(800, 0, 0),
                moveTime: 1
              });
            }
            this.blurCover.active = true;
            this.initGrids();
          }
          this.addEventListeners();
          if (GraphManager.instance.isCached(this.picInfo.url_A_s)) {
            let frame = await GraphManager.instance.loadGraph(this.picInfo.url_A_s);
            if (frame) {
              this.bgA.spriteFrame = frame;
              let adapter1 = this.bgA.getComponent(BgAdapter);
              adapter1 && adapter1.updateSize();
              this.sprPicCover.spriteFrame = frame;
              let adapter2 = this.sprPicCover.getComponent(BgAdapter);
              adapter2 && adapter2.updateSize();
            }
          } else {
            let spf = await GraphManager.instance.loadGraph(this.picInfo.url_A_t);
            this.bgA.spriteFrame = spf;
            let adapter1 = this.bgA.getComponent(BgAdapter);
            adapter1 && adapter1.updateSize();
            this.sprPicCover.spriteFrame = spf;
            let adapter2 = this.sprPicCover.getComponent(BgAdapter);
            adapter2 && adapter2.updateSize();
            let callbackA = spr => {
              if (!spr) {
                return;
              }
              if (this.sprPicCover && this.sprPicCover.isValid) {
                this.bgA.spriteFrame = spr;
                let adapter1 = this.bgA.getComponent(BgAdapter);
                adapter1 && adapter1.updateSize();
                this.sprPicCover.spriteFrame = spr;
                let adapter2 = this.sprPicCover.getComponent(BgAdapter);
                adapter2 && adapter2.updateSize();
              }
            };
            SgManager.instance.getShowPageFrame(this.picInfo, PictureType.PageA_Show, callbackA.bind(this));
          }
          let isPageShowError = false;
          let sprB = await GraphManager.instance.loadGraph(this.picInfo.url_B_s);
          if (sprB) {
            if (this.sprPicPrivate && this.sprPicPrivate.isValid) {
              this.bgB.spriteFrame = sprB;
              let adapter1 = this.bgB.getComponent(BgAdapter);
              adapter1 && adapter1.updateSize();
              this.sprPicPrivate.spriteFrame = sprB;
              let adapter2 = this.sprPicPrivate.getComponent(BgAdapter);
              adapter2 && adapter2.updateSize();
            }
            isPageShowError = false;
          } else {
            this.sprPicPrivate.node.active = false;
            this.bgB.node.active = false;
            isPageShowError = true;
          }
          let showSuccessNum = 0;
          if (this.sprPicCover && this.sprPicCover.spriteFrame) {
            showSuccessNum += 1;
          }
          if (sprB) {
            showSuccessNum += 1;
          }
          if (this.layers[0].active) {
            ReportAgent.reportPageMonitoring(PageName.SlidePictureView, isPageShowError, `${showSuccessNum}/2`);
          } else {
            ReportAgent.reportPageMonitoring(PageName.DownLoadPage, isPageShowError, `${showSuccessNum}/2`);
          }
        }
        onClose() {
          this.removeEventListeners();
          GameDataManager.instance.saveData();
        }
        addEventListeners() {
          this.slideLayer.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
          this.slideLayer.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
          this.slideLayer.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
          this.slideLayer.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        }
        removeEventListeners() {
          this.slideLayer.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
          this.slideLayer.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
          this.slideLayer.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
          this.slideLayer.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        }
        update(dt) {
          if (this.autoSlideSpeed > 0 && this.progressBar.progress < this.targetProgress) {
            this.setProgress(this.progressBar.progress + this.autoSlideSpeed * dt);
            if (this.progressBar.progress >= this.targetProgress) {
              this.autoSlideSpeed = 0;
            }
            if (this.progressBar.progress >= 1) {
              this.onProgressComplete();
            }
          }
        }
        initGrids() {
          let trsf = this.slideLayer.getComponent(UITransform);
          let width = trsf.width;
          let heigh = trsf.height;
          let gridWidth = width / GridCountH;
          let gridHeight = heigh / GridCountV;
          for (let i = 0; i < GridCountV; i++) {
            for (let j = 0; j < GridCountH; j++) {
              let rect = new Rect(j * gridWidth, i * gridHeight, gridWidth, gridHeight);
              this.gridList.push(rect);
            }
          }
        }
        checkGrid(pos) {
          for (let i = 0; i < this.gridList.length; i++) {
            let rect = this.gridList[i];
            if (rect.contains(pos)) {
              this.gridList.splice(i, 1);
              break;
            }
          }
          return this.gridList.length / (GridCountH * GridCountV);
        }
        onTouchStart(event) {
          if (this.isPlayingEffect) {
            return;
          }
          this.isSliding = true;
          let ps = this.particle.getComponent(ParticleSystem2D);
          if (ps) {
            ps.resetSystem();
          }
          this.particle.active = true;
          let sPos = event.getLocation();
          let lPos = UIUtil.convertScreenPosToLocal(new Vec3(sPos.x, sPos.y, 0), this.particle.parent, this.node);
          this.particle.setPosition(lPos);
        }
        onTouchMove(event) {
          if (this.isPlayingEffect) {
            return;
          }
          let sPos = event.getLocation();
          let lPos1 = UIUtil.convertScreenPosToLocal(new Vec3(sPos.x, sPos.y, 0), this.particle.parent, this.node);
          this.particle.setPosition(lPos1);
          if (!this.isSliding) {
            return;
          }
          let lPos2 = this.convertPos(new Vec3(sPos.x, sPos.y, 0), this.mask.node.parent);
          let graphics = this.mask.getComponent(Graphics);
          graphics && graphics.fillRect(lPos2.x - SliceSize / 2, lPos2.y - SliceSize / 2, SliceSize, SliceSize);
          let lPos3 = this.convertPos(new Vec3(sPos.x, sPos.y, 0), this.slideLayer);
          let progress = 1 - this.checkGrid(new Vec2(lPos3.x, lPos3.y));
          progress *= 2;
          if (progress > 0.8) {
            //划开60%
            this.onCompleteSlide();
          } else {
            this.setProgress(progress);
          }
          this.playSliceAudio();
        }
        onCompleteSlide() {
          let graphics = this.mask.getComponent(Graphics);
          graphics.clear();
          this.mask.node.active = false;
          this.blurCover.active = false;
          this.targetProgress = 1;
          this.autoSlideSpeed = AutoLoadingSpeed;
          this.onTouchEnd(null);
        }
        onTouchEnd(event) {
          this.isSliding = false;
          this.particle.active = false;
        }
        convertPos(sPos, parent) {
          let uiCamera = director.root.batcher2D.getFirstRenderCamera(this.node);
          uiCamera.screenToWorld(sPos, sPos);
          let lPos = parent.getComponent(UITransform).convertToNodeSpaceAR(sPos);
          return lPos;
        }
        setProgress(progress) {
          progress = Math.min(progress, 1);
          this.progressBar.progress = progress;
          let lbl = this.progressBar.getComponentInChildren(Label);
          lbl && (lbl.string = `hot progress: ${(progress * 100).toFixed(0)}%`);
          let bar = this.progressBar.node.getChildByName('Bar');
          bar.active = progress > 0;
          let isFull = progress == 1;
          this.progressBar.node.active = this.lblDesc.node.active = !isFull;
          if (GameDataManager.instance.localData.isFirstSelectPicGuide && this.fromUI != UIID.IllustrationViewSg) {
            this.btnMore.active = true;
          } else {
            this.btnMore.active = false;
          }
          this.lblDesc.node.active = !isFull;
        }
        onProgressComplete() {
          if (this.isPlayingEffect) {
            return;
          }
          AudioManager.instance.playEffect(AudioUrl.SLIDE_COMPLETE);
          this.isPlayingEffect = true;
          let offsetScale = 1.4;
          let bgRoot = this.bgA.node.parent;
          let hMax = this.bgA.getComponent(UITransform).height;
          let hMin = this.sprPicPrivate.getComponent(UITransform).height;
          let scale = hMax * offsetScale / hMin;
          let frame = this.layers[0].getChildByName('Frame');
          let frameOpacity = frame.getComponent(UIOpacity);
          if (!frameOpacity) {
            frameOpacity = frame.addComponent(UIOpacity);
          }
          frameOpacity.opacity = 255;
          let btnLayer = this.layers[1].getChildByName('BtnLayer');
          let btnOpacity = btnLayer.getComponent(UIOpacity);
          if (!btnOpacity) {
            btnOpacity = btnLayer.addComponent(UIOpacity);
          }
          btnOpacity.opacity = 0;
          tween(this.node).sequence(tween(frameOpacity).to(0.2, {
            opacity: 0
          }), tween(this.picArea).to(0.5, {
            scale: new Vec3(scale, scale, scale),
            position: Vec3.ZERO
          }).call(() => {
            this.layers[0].active = false;
            this.layers[1].active = true;
            bgRoot.scale = new Vec3(offsetScale, offsetScale, offsetScale);
          }), tween(bgRoot).to(0.5, {
            scale: Vec3.ONE
          }), tween(btnOpacity).to(0.5, {
            opacity: 255
          }).call(() => {
            this.isPlayingEffect = false;
            if (this.bgB.spriteFrame) {
              this.bgA.node.active = false;
              this.bgB.node.active = true;
            } else {
              UIManager.instance.showToast('Network Error');
            }
          })).start();
        }
        onContinueBtn() {
          if (this.isPlayingEffect) {
            return;
          }
          UIManager.instance.close(this);
          UIManager.instance.openPictureSelectView();
        }
        onCloseBtn() {
          if (this.isPlayingEffect) {
            return;
          }
          UIManager.instance.close(this);
        }
        onDownloadBtn() {
          if (this.isPlayingEffect) {
            return;
          }
          ReportAgent.reportCustomEvent(CustomReportEvent.PAGE_BUTTON_ACTION, {
            page: PageName.DownLoadPage,
            btn: BtnName.Download,
            action: 'click'
          });
          ReportAgent.reportCustomEvent(CustomReportEvent.PHOTO_CHOOSE_NUM, {
            id: this.picInfo.tag,
            event: PhotoChooseNumReportEvent.DOWNLOADED
          });
          ReportAgent.reportCustomEvent(CustomReportEvent.AD_EVENT_DISTRIBUTED, {
            reward_page_click: 'download_pag'
          });
          if (this.bgA.node.active) {
            GraphManager.instance.loadGraph(this.picInfo.url_A);
          }
          if (this.bgB.node.active) {
            GraphManager.instance.loadGraph(this.picInfo.url_B);
          }
          let gdMgr = GameDataManager.instance;
          let downloadedPicInfoList = gdMgr.gameData.sgData.downloadedPicInfoList;
          let idx = downloadedPicInfoList.findIndex(item => item.id === this.picInfo.id);
          if (idx !== -1) {
            this.saveImage();
          } else {
            AdManager.instance.openVideoAd('slide-picture-download', (entry, success) => {
              if (success) {
                this.saveImage();
              }
            });
          }
        }
        saveImage() {
          if (this.bgA.node.active) {
            if (GraphManager.instance.isCached(this.picInfo.url_A)) {
              LoadingManager.instance.pauseLoading();
              BridgeUtil.saveToAlbum(this.picInfo.url_A).then(success => {
                this.onSaveToAlbumComplete(success);
                LoadingManager.instance.resumeLoading();
              });
            } else {
              BridgeUtil.saveToAlbum(this.picInfo.url_A_s).then(success => {
                this.onSaveToAlbumComplete(success);
              });
            }
          }
          if (this.bgB.node.active) {
            if (GraphManager.instance.isCached(this.picInfo.url_B)) {
              LoadingManager.instance.pauseLoading();
              BridgeUtil.saveToAlbum(this.picInfo.url_B).then(success => {
                this.onSaveToAlbumComplete(success);
                LoadingManager.instance.resumeLoading();
              });
            } else {
              BridgeUtil.saveToAlbum(this.picInfo.url_B_s).then(success => {
                this.onSaveToAlbumComplete(success);
              });
            }
          }
          let gdMgr = GameDataManager.instance;
          let downloadedPicInfoList = gdMgr.gameData.sgData.downloadedPicInfoList;
          let idx = downloadedPicInfoList.findIndex(item => item.id === this.picInfo.id);
          if (idx == -1) {
            downloadedPicInfoList.push(this.picInfo);
          }
          this.updateAdIcon();
        }
        updateAdIcon() {
          let gdMgr = GameDataManager.instance;
          let downloadedPicInfoList = gdMgr.gameData.sgData.downloadedPicInfoList;
          let idx = downloadedPicInfoList.findIndex(item => item.id === this.picInfo.id);
          if (idx !== -1) {
            this.adIcon.active = false;
          } else {
            this.adIcon.active = true;
          }
        }
        onSaveToAlbumComplete(success) {
          if (success) {
            UIManager.instance.showToast('Download To Album Success');
          } else {
            UIManager.instance.showToast('Download To Album Failed');
          }
        }
        async onMoreBtn() {
          if (this.isPlayingEffect) {
            return;
          }
          GameDataManager.instance.localData.isFirstSelectPicGuide = false;
          UIManager.instance.close(this);
          UIManager.instance.openPictureSelectView();
        }
        set isLike(val) {
          this.sprLike.spriteFrame = this.framesLike[val ? 1 : 0];
        }
        onLikeBtn() {
          if (this.isPlayingEffect) {
            return;
          }
          let picData = GameDataManager.instance.getPictureData(this.picInfo.id, this.albumId);
          if (picData) {
            picData.isFavorite = !picData.isFavorite;
            this.isLike = picData.isFavorite;
          }
          this.likeEffect.active = picData.isFavorite;
          if (this.likeEffect.active) {
            this.likeEffect.getComponent(ParticleSystem2D).resetSystem();
          } else {
            this.likeEffect.getComponent(ParticleSystem2D).stopSystem();
          }
        }
        onSwitchBtn() {
          if (this.isPlayingEffect) {
            return;
          }
          this.flipPicture();
        }
        flipPicture() {
          let rootNode = this.bgA.node.parent;
          tween(rootNode).stop();
          rootNode.scale = Vec3.ONE;
          tween(rootNode).to(0.15, {
            scale: new Vec3(0, 1, 1)
          }).call(() => {
            if (this.bgA.node.active) {
              if (this.bgB.spriteFrame) {
                this.bgA.node.active = false;
                this.bgB.node.active = true;
              }
            } else {
              this.bgA.node.active = true;
              this.bgB.node.active = false;
            }
          }).to(0.15, {
            scale: Vec3.ONE
          }).start();
        }
        playSliceAudio() {
          if (this.sliceAudioCd) {
            return;
          }
          this.sliceAudioCd = true;
          if (this.sliceTime == 0) {
            this.sliceTime = 1;
          } else {
            this.sliceTime = 0;
          }
          this.scheduleOnce(() => {
            this.sliceAudioCd = false;
          }, 1);
        }

        // onNextBtn() {
        //     if (this.isPlayingEffect) {
        //         return;
        //     }
        // }

        // onPreBtn() {
        //     if (this.isPlayingEffect) {
        //         return;
        //     }
        // }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "layers", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "picArea", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "sprPicCover", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "sprPicPrivate", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "progressBar", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "mask", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "maskCover", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "blurCover", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "slideLayer", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "lblDesc", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "particle", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "bgA", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "bgB", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "btnContinue", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "btnDownload", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "btnLike", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "btnSwitch", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "btnMore", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "sprLike", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "framesLike", [_dec21], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "btnPre", [_dec22], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, "btnNext", [_dec23], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor23 = _applyDecoratedDescriptor(_class2.prototype, "btnClose", [_dec24], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor24 = _applyDecoratedDescriptor(_class2.prototype, "likeEffect", [_dec25], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor25 = _applyDecoratedDescriptor(_class2.prototype, "adIcon", [_dec26], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/start-view-sg.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './bridge-util.ts', './audio-manager.ts', './ui-manager.ts', './ui-view.ts', './ui-config.ts', './game-constants.ts', './game-data-manager.ts', './mount-manager.ts', './mount-point.ts', './config.ts', './stage-build-agent.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Label, Sprite, SpriteFrame, _decorator, director, Color, BridgeUtil, VibrationEffect, AudioManager, UIManager, UIView, UIID, AudioUrl, StageType, GameDataManager, MountManager, MountPoint, Config, StageBuildAgent;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      Sprite = module.Sprite;
      SpriteFrame = module.SpriteFrame;
      _decorator = module._decorator;
      director = module.director;
      Color = module.Color;
    }, function (module) {
      BridgeUtil = module.BridgeUtil;
      VibrationEffect = module.VibrationEffect;
    }, function (module) {
      AudioManager = module.AudioManager;
    }, function (module) {
      UIManager = module.UIManager;
    }, function (module) {
      UIView = module.UIView;
    }, function (module) {
      UIID = module.UIID;
    }, function (module) {
      AudioUrl = module.AudioUrl;
      StageType = module.StageType;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }, function (module) {
      MountManager = module.MountManager;
    }, function (module) {
      MountPoint = module.MountPoint;
    }, function (module) {
      Config = module.Config;
    }, function (module) {
      StageBuildAgent = module.StageBuildAgent;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;
      cclegacy._RF.push({}, "4d856LvLX9LF73xPSdy99Qw", "start-view-sg", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let StartViewSg = exports('StartViewSg', (_dec = ccclass('StartViewSg'), _dec2 = property(Label), _dec3 = property(Sprite), _dec4 = property([SpriteFrame]), _dec5 = property(Label), _dec(_class = (_class2 = class StartViewSg extends UIView {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "lblLevel", _descriptor, this);
          _initializerDefineProperty(this, "spfStartBtn", _descriptor2, this);
          _initializerDefineProperty(this, "spfStartBtnFrames", _descriptor3, this);
          _initializerDefineProperty(this, "lblLvType", _descriptor4, this);
          this.clickTimes = 0;
        }
        onOpen(fromUI, ...args) {
          this.lblLevel.string = `level : ${GameDataManager.instance.gameData.level}`;
          this.updateDisplay();
        }
        updateDisplay() {
          this.updateUIWithLvType();
        }
        onClose() {
          GameDataManager.instance.saveData(true);
        }
        onIllustrationBtn() {
          this.onClickBtn();
          UIManager.instance.open(UIID.IllustrationViewSg);
        }
        async onPlayBtn() {
          let selectedPic = GameDataManager.instance.localData.selectedSgPicture;
          if (selectedPic) {
            let data = GameDataManager.instance.gameData.sgData.illustration[selectedPic.id];
            if (data && data.isOwned) {
              selectedPic = GameDataManager.instance.localData.selectedSgPicture = null;
            }
          }
          if (!selectedPic) {
            // 预加载没完成，继续加载
            let state = MountManager.instance.notify(MountPoint.NativeNotifyGetPreloadTaskState, 'welcome-pics')[0];
            let gdMgr = GameDataManager.instance;
            if (gdMgr.isSgResReady()) {
              // loading and wait
              console.log(`Loading-Test onPlayBtn loadingState:${state}`);
              let promise = new Promise(async (resolve, reject) => {
                let count = 3;
                while (count > 0) {
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  state = MountManager.instance.notify(MountPoint.NativeNotifyGetPreloadTaskState, 'welcome-pics')[0];
                  if (gdMgr.isSgResReady()) {
                    break;
                  }
                  count--;
                }

                // 预加载完成，打开界面
                console.log(`Loading-Test onPlayBtn isLoading done-count:${count}`);
                UIManager.instance.openPictureSelectView();
                resolve(true);
              });
              UIManager.instance.open(UIID.LoadingSg, {
                promise: promise,
                desc: 'Loading Image...'
              });
            } else {
              UIManager.instance.openPictureSelectView();
            }
          } else {
            UIManager.instance.closeAll();
            director.loadScene('stage');
          }
        }
        onSettingBtn() {
          this.onClickBtn();
          UIManager.instance.open(UIID.MenuPopup_1);
        }
        onClickBtn() {
          AudioManager.instance.playEffect(AudioUrl.BTN_CLICK);
          BridgeUtil.vibrate(30, VibrationEffect.TICK);
        }
        onGmBtn() {
          let config = GameDataManager.instance.mainConfig;
          if (!config) {
            console.log('onGmBtn-config is null');
            return;
          }
          if (config.gm_config.is_gm || Config.DEBUG) {
            this.clickTimes++;
            if (this.clickTimes >= 5) {
              this.clickTimes = 0;
              UIManager.instance.open(UIID.GmView);
            }
            this.unschedule(this.cleanClickTimes.bind(this));
            this.scheduleOnce(this.cleanClickTimes.bind(this), 1);
          }
        }
        cleanClickTimes() {
          this.clickTimes = 0;
        }
        async updateUIWithLvType() {
          const stageType = await StageBuildAgent.instance.getStageType(GameDataManager.instance.gameData.level);
          let frame = this.spfStartBtnFrames[stageType];
          if (frame) {
            this.spfStartBtn.spriteFrame = frame;
          }
          switch (stageType) {
            case StageType.NORMAL:
              this.lblLvType.node.parent.active = false;
              Color.fromHEX(this.lblLevel.outlineColor, '#7322C1');
              break;
            case StageType.SPECIAL:
              this.lblLvType.node.parent.active = true;
              this.lblLvType.string = 'Special Level';
              Color.fromHEX(this.lblLevel.outlineColor, '#940E2B');
              Color.fromHEX(this.lblLvType.color, '#41D4D3');
              Color.fromHEX(this.lblLvType.outlineColor, '#4034C3');
              break;
            case StageType.BOSS:
              this.lblLvType.node.parent.active = true;
              this.lblLvType.string = 'Difficult Level';
              Color.fromHEX(this.lblLevel.outlineColor, '#425CCE');
              Color.fromHEX(this.lblLvType.color, '#F14522');
              Color.fromHEX(this.lblLvType.outlineColor, '#80180D');
              break;
          }
          this.lblLevel.updateRenderData(true);
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "lblLevel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "spfStartBtn", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "spfStartBtnFrames", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "lblLvType", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/task-item.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Label, ProgressBar, Sprite, _decorator, Component;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      ProgressBar = module.ProgressBar;
      Sprite = module.Sprite;
      _decorator = module._decorator;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;
      cclegacy._RF.push({}, "5a1f19ZHHNG55MGT47bqps8", "task-item", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let TaskItem = exports('TaskItem', (_dec = ccclass('TaskItem'), _dec2 = property(Label), _dec3 = property(Label), _dec4 = property(ProgressBar), _dec5 = property(Sprite), _dec(_class = (_class2 = class TaskItem extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "lblRewardNum", _descriptor, this);
          _initializerDefineProperty(this, "lblDesc", _descriptor2, this);
          _initializerDefineProperty(this, "progressBar", _descriptor3, this);
          _initializerDefineProperty(this, "sprBtnClaim", _descriptor4, this);
        }
        initWithData() {}
        updateUI() {}
        onClaimBtn() {}
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "lblRewardNum", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "lblDesc", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "progressBar", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "sprBtnClaim", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/bundle-sg', 'chunks:///_virtual/bundle-sg'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});