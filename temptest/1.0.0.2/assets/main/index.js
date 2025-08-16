System.register("chunks:///_virtual/account.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './GameDataMgr.ts', './DataEnums.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Label, _decorator, Component, director, UIOpacity, tween, GameDataMgr, EventID;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
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
      cclegacy._RF.push({}, "b49c38KumNGm6mgLHdB/Sxn", "account", undefined);
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
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/adAgent.ts", ['cc', './LogMgr.ts', './AudioMgr.ts', './PageMgr.ts', './connectMgr.ts'], function (exports) {
  var cclegacy, sys, LogMgr, AudioMgr, PageMgr, UIPage, UIPAGE_TYPE, connectMgr;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      sys = module.sys;
    }, function (module) {
      LogMgr = module.LogMgr;
    }, function (module) {
      AudioMgr = module.AudioMgr;
    }, function (module) {
      PageMgr = module.PageMgr;
      UIPage = module.UIPage;
      UIPAGE_TYPE = module.UIPAGE_TYPE;
    }, function (module) {
      connectMgr = module.connectMgr;
    }],
    execute: function () {
      var _class;
      cclegacy._RF.push({}, "257d7j9RHZMv6acUuABE+gn", "adAgent", undefined);
      class AdAgent {
        static resetVideoAdRequest() {
          this.videoAdRequest.entry = "";
          this.videoAdRequest.revenued = false;
          this.videoAdRequest.callback = null;
          this.videoAdRequest.retryCount = 0;
          this.videoAdRequest.isStarted = false;
        }
        static openVideoAd(entry, callback) {
          LogMgr.log("Open video ad", entry);
          this.resetVideoAdRequest();
          if (sys.isBrowser) {
            if (callback) {
              callback(entry, true);
            }
          } else {
            LogMgr.log("Open ad video ad", entry);
            this.videoAdRequest.entry = entry;
            this.videoAdRequest.callback = callback;
            connectMgr.openVideoAd(entry);
          }
        }
        static openInterstitialAd(entry, callback) {
          console.log("AdAgent Open interstitial ad", entry);
          this.resetInterstitialAdRequest();
          if (sys.isBrowser) {
            console.log("AdAgent Open interstitial ad in browser", entry);
            PageMgr.openPage(UIPage.Toast, UIPAGE_TYPE.ALERT, 'Open Inter Ad');
          } else {
            // Open interstitial ad
            console.log("AdAgent Open interstitial ad native", entry);
            this.currentInterstitialAdRequest.entry = entry;
            this.currentInterstitialAdRequest.callback = callback;
            connectMgr.openInterstitialAd(entry);
          }
        }
        static resetInterstitialAdRequest() {
          this.currentInterstitialAdRequest.entry = "";
          this.currentInterstitialAdRequest.callback = null;
        }
      }
      exports('AdAgent', AdAgent);
      _class = AdAgent;
      AdAgent.videoAdRequest = {
        entry: "",
        revenued: false,
        callback: null,
        isStarted: false,
        retryCount: 0
      };
      AdAgent.currentInterstitialAdRequest = {
        entry: "",
        callback: null
      };
      AdAgent.videoAd = {
        onVideoAdStart: param => {
          _class.videoAdRequest.isStarted = true;
          LogMgr.log("ad Video Start", param);
          AudioMgr.instance.pause();
        },
        onVideoClick: param => {
          LogMgr.log("ad Video Click", param);
        },
        onVideoNotReady: param => {
          LogMgr.log("onVideoNotReady", param);
          if (_class.videoAdRequest.retryCount == 0) {
            console.log("VideoNotReady retryCount == 0");
            _class.videoAdRequest.retryCount++;
            PageMgr.openPage(UIPage.LoadingView, UIPAGE_TYPE.PAGE, {
              displayTime: 5,
              onClose: () => {
                console.log("onVideoNotReady this.currentVideoAdRequest.isStarted: ", console.log("onVideoNotReady this.currentVideoAdRequest.isStarted"));
                if (_class.videoAdRequest.isStarted) {
                  return;
                }
                const entry = _class.videoAdRequest.entry;
                connectMgr.openVideoAd(entry);
              }
            });
          } else {
            const entry = _class.videoAdRequest.entry;
            const callback = _class.videoAdRequest.callback;
            if (callback) {
              callback(entry, false);
            }
            PageMgr.openPage(UIPage.Toast, UIPAGE_TYPE.ALERT, "Ad loading failed.");
            _class.resetVideoAdRequest();
          }
        },
        adVideoClosed: param => {
          LogMgr.log("onVideoClosed", param);
          AudioMgr.instance.resume();
          const entry = param.entry;
          const callback = _class.videoAdRequest.callback;
          _class.resetVideoAdRequest();
          if (callback) {
            callback(entry, false);
          }
        },
        adVideoComplete: param => {
          LogMgr.log("onVideoComplete", param);
          AudioMgr.instance.resume();
          const entry = param.entry;
          const callback = _class.videoAdRequest.callback;
          _class.resetVideoAdRequest();
          if (callback) {
            LogMgr.log("onVideoComplete callback", entry);
            callback(entry, true);
          }
        },
        adRevenue: param => {
          LogMgr.log("onAdRevenue", param);
        }
      };
      AdAgent.interstitialAd = {
        onInterstitialStart: param => {
          LogMgr.log("AdAgent onInterstitialStart", param);
          AudioMgr.instance.pause();
        },
        onInterstitialNotReady: param => {
          LogMgr.log("AdAgent onInterstitialNotReady", param);
          const entry = _class.currentInterstitialAdRequest.entry;
          const callback = _class.currentInterstitialAdRequest.callback;
          if (callback) {
            callback(entry, true);
          }
          PageMgr.openPage(UIPage.Toast, UIPAGE_TYPE.ALERT, "Ad loading failed.");
          _class.resetInterstitialAdRequest();
        },
        onInterstitialClick: param => {},
        onInterstitialClosed: param => {
          AudioMgr.instance.resume();
          LogMgr.log("AdAgent onInterstitialClosed", param);
          const entry = param.entry;
          const callback = _class.currentInterstitialAdRequest.callback;
          if (callback) {
            callback(entry, true);
          }
          _class.resetInterstitialAdRequest();
        }
      };
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/adMgr.ts", ['cc', './adAgent.ts'], function (exports) {
  var cclegacy, AdAgent;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      AdAgent = module.AdAgent;
    }],
    execute: function () {
      cclegacy._RF.push({}, "8a6130bC6pBoLKZ3vJ5jHVC", "adMgr", undefined);
      class adMgr {
        static get instance() {
          if (!this._instance) {
            this._instance = new adMgr();
          }
          return this._instance;
        }
        openVideoAd(entry, callback) {
          AdAgent.openVideoAd(entry, (entry, success) => {
            callback && callback(entry, success);
          });
        }
      }
      exports('adMgr', adMgr);
      adMgr._instance = null;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/AudioMgr.ts", ['cc', './GameDataMgr.ts'], function (exports) {
  var cclegacy, Node, director, AudioSource, AudioClip, resources, GameDataMgr;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      director = module.director;
      AudioSource = module.AudioSource;
      AudioClip = module.AudioClip;
      resources = module.resources;
    }, function (module) {
      GameDataMgr = module.GameDataMgr;
    }],
    execute: function () {
      cclegacy._RF.push({}, "98636NviWZNrKKRKCb+BhmZ", "AudioMgr", undefined);
      class AudioMgr {
        static get instance() {
          if (this._instance == null) {
            this._instance = new AudioMgr();
          }
          return this._instance;
        }
        constructor() {
          this._audioSource = void 0;
          this._musicValue = 1;
          this._effectValue = 1;
          let audioMgr = new Node();
          audioMgr.name = 'audioMgr';
          director.getScene().addChild(audioMgr);
          director.addPersistRootNode(audioMgr);
          this._audioSource = audioMgr.addComponent(AudioSource);
        }
        get audioSource() {
          return this._audioSource;
        }
        playEffect(sound, volume = 1.0) {
          let gdMgr = GameDataMgr.instance;
          if (!gdMgr.settingConfig.effect) {
            return;
          }
          if (sound instanceof AudioClip) {
            this._audioSource.playOneShot(sound, volume);
          } else {
            resources.load(sound, (err, clip) => {
              if (err) {
                console.log(err);
              } else {
                this._audioSource.playOneShot(clip, volume);
              }
            });
          }
        }
        playMusic(sound, volume = 0.1) {
          let gdMgr = GameDataMgr.instance;
          if (!gdMgr.settingConfig.music) {
            return;
          }
          if (sound instanceof AudioClip) {
            this._audioSource.stop();
            this._audioSource.clip = sound;
            this._audioSource.play();
            this.audioSource.volume = volume;
          } else {
            resources.load(sound, (err, clip) => {
              if (err) {
                console.log(err);
              } else {
                this._audioSource.stop();
                this._audioSource.clip = clip;
                this._audioSource.play();
                this.audioSource.volume = volume;
              }
            });
          }
        }
        stop() {
          this._audioSource.stop();
        }
        pause() {
          this._audioSource.pause();
        }
        resume() {
          this._audioSource.play();
        }
        setMusicValue(num) {
          this._musicValue = num;
        }
        setEffectValue(num) {
          this._effectValue = num;
        }
      }
      exports('AudioMgr', AudioMgr);
      AudioMgr._instance = void 0;
      let AUDIO_NAME = exports('AUDIO_NAME', /*#__PURE__*/function (AUDIO_NAME) {
        AUDIO_NAME["BG_MUSIC"] = "audios/bgm";
        AUDIO_NAME["waterflow0"] = "audios/waterflow0";
        AUDIO_NAME["waterflow1"] = "audios/waterflow1";
        AUDIO_NAME["waterflow2"] = "audios/waterflow2";
        AUDIO_NAME["waterflow3"] = "audios/waterflow3";
        AUDIO_NAME["waterflow4"] = "audios/waterflow4";
        AUDIO_NAME["waterflow5"] = "audios/waterflow5";
        AUDIO_NAME["waterflow6"] = "audios/waterflow6";
        AUDIO_NAME["btn_click"] = "audios/btn_click";
        AUDIO_NAME["collect_order"] = "audios/collect_order";
        AUDIO_NAME["complete_column"] = "audios/complete_column";
        AUDIO_NAME["level_lose"] = "audios/level_lose";
        AUDIO_NAME["level_win"] = "audios/level_win";
        AUDIO_NAME["piggy_reward"] = "audios/piggy_reward";
        AUDIO_NAME["show_page"] = "audios/show_page";
        return AUDIO_NAME;
      }({}));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/backgroundDetailView.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BasePage.ts', './PageMgr.ts', './ResMgr.ts', './GameDataMgr.ts', './DataEnums.ts', './AudioMgr.ts', './barSortBridge.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Sprite, Node, _decorator, SpriteFrame, director, BasePage, PageMgr, UIPage, UIPAGE_TYPE, ResMgr, GameDataMgr, EventID, AudioMgr, AUDIO_NAME, barSortBridge, Vibration;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Sprite = module.Sprite;
      Node = module.Node;
      _decorator = module._decorator;
      SpriteFrame = module.SpriteFrame;
      director = module.director;
    }, function (module) {
      BasePage = module.BasePage;
    }, function (module) {
      PageMgr = module.PageMgr;
      UIPage = module.UIPage;
      UIPAGE_TYPE = module.UIPAGE_TYPE;
    }, function (module) {
      ResMgr = module.ResMgr;
    }, function (module) {
      GameDataMgr = module.GameDataMgr;
    }, function (module) {
      EventID = module.EventID;
    }, function (module) {
      AudioMgr = module.AudioMgr;
      AUDIO_NAME = module.AUDIO_NAME;
    }, function (module) {
      barSortBridge = module.barSortBridge;
      Vibration = module.Vibration;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;
      cclegacy._RF.push({}, "550c6fqk+xL357fybVa7mHT", "backgroundDetailView", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let backgroundDetailView = exports('backgroundDetailView', (_dec = ccclass('backgroundDetailView'), _dec2 = property(Sprite), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property(Node), _dec(_class = (_class2 = class backgroundDetailView extends BasePage {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "itemBg", _descriptor, this);
          _initializerDefineProperty(this, "inUse", _descriptor2, this);
          _initializerDefineProperty(this, "unlock", _descriptor3, this);
          _initializerDefineProperty(this, "use", _descriptor4, this);
          this.imageId = void 0;
        }
        initData(data) {
          this.imageId = data.id;
          AudioMgr.instance.playEffect(AUDIO_NAME.show_page);
          barSortBridge.vibrate(30, Vibration.NORMAL);
          ResMgr.instance.loadAsset(`textures/background/BJ_${data.id}/spriteFrame`, SpriteFrame, spriteFrame => {
            this.itemBg.spriteFrame = spriteFrame;
          });
          this.refreshBtn();
        }
        onDisable() {
          director.emit(EventID.REFRESH_BACKGROUND_VIEW);
        }
        refreshBtn() {
          this.inUse.active = false;
          this.unlock.active = false;
          this.use.active = false;
          let gdMgr = GameDataMgr.instance;
          let unlock = gdMgr.data.unlockBg.indexOf(this.imageId) != -1;
          if (unlock) {
            let isSelect = gdMgr.data.curSelectedBg == this.imageId;
            this.use.active = true;
            if (isSelect) {
              this.inUse.active = true;
              this.use.active = false;
            } else {
              this.inUse.active = false;
            }
          } else {
            this.unlock.active = true;
          }
        }
        unlockBackground() {
          AudioMgr.instance.playEffect(AUDIO_NAME.btn_click);
          barSortBridge.vibrate(30, Vibration.LIGHT);
          let gdMgr = GameDataMgr.instance;
          if (gdMgr.data.coin < 1000) {
            PageMgr.openPage(UIPage.Toast, UIPAGE_TYPE.ALERT, "Insufficient gold coins, go and earn enough gold coins");
            return;
          }
          if (gdMgr.data.unlockBg.indexOf(this.imageId) == -1) {
            gdMgr.data.unlockBg.push(this.imageId);
            gdMgr.data.coin -= 1000;
            director.emit(EventID.UPDATE_ACCOUNT);
          }
          gdMgr.saveData();
          this.refreshBtn();
        }
        useBackground() {
          AudioMgr.instance.playEffect(AUDIO_NAME.btn_click);
          barSortBridge.vibrate(30, Vibration.LIGHT);
          let gdMgr = GameDataMgr.instance;
          gdMgr.data.curSelectedBg = this.imageId;
          PageMgr.openPage(UIPage.Toast, UIPAGE_TYPE.ALERT, "Successful use");
          this.refreshBtn();
          director.emit(EventID.UPDATE_BACKGROUND);
        }
        inUseHandle() {
          AudioMgr.instance.playEffect(AUDIO_NAME.btn_click);
          barSortBridge.vibrate(30, Vibration.LIGHT);
          PageMgr.openPage(UIPage.Toast, UIPAGE_TYPE.ALERT, "Already in use");
        }
        closeSelf() {
          AudioMgr.instance.playEffect(AUDIO_NAME.btn_click);
          barSortBridge.vibrate(30, Vibration.LIGHT);
          PageMgr.closePage(UIPage.BackGroundDetailView);
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "itemBg", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "inUse", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "unlock", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "use", [_dec5], {
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

System.register("chunks:///_virtual/backgroundItem.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './ResMgr.ts', './GameDataMgr.ts', './PageMgr.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Sprite, Node, _decorator, Component, SpriteFrame, ResMgr, GameDataMgr, PageMgr, UIPage, UIPAGE_TYPE;
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
      SpriteFrame = module.SpriteFrame;
    }, function (module) {
      ResMgr = module.ResMgr;
    }, function (module) {
      GameDataMgr = module.GameDataMgr;
    }, function (module) {
      PageMgr = module.PageMgr;
      UIPage = module.UIPage;
      UIPAGE_TYPE = module.UIPAGE_TYPE;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3;
      cclegacy._RF.push({}, "1d641Qkt61G1bjT5Dp6kFpH", "backgroundItem", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let backgroundItem = exports('backgroundItem', (_dec = ccclass('backgroundItem'), _dec2 = property(Sprite), _dec3 = property(Node), _dec4 = property(Node), _dec(_class = (_class2 = class backgroundItem extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "itemBg", _descriptor, this);
          _initializerDefineProperty(this, "shadow", _descriptor2, this);
          _initializerDefineProperty(this, "state", _descriptor3, this);
          this.bgId = 0;
        }
        start() {}
        initdata(data) {
          this.bgId = data.id;
          ResMgr.instance.loadAsset(`textures/background/BJ_${data.id}/spriteFrame`, SpriteFrame, spriteFrame => {
            this.itemBg.spriteFrame = spriteFrame;
          });
          this.refreshItem();
        }
        refreshItem() {
          let unlock = GameDataMgr.instance.data.unlockBg.indexOf(this.bgId) != -1;
          if (unlock) {
            this.shadow.active = false;
            let isSelect = GameDataMgr.instance.data.curSelectedBg == this.bgId;
            this.state.getChildByName("lock").active = false;
            if (isSelect) {
              this.state.getChildByName("select").active = true;
            } else {
              this.state.getChildByName("select").active = false;
            }
          } else {
            this.shadow.active = true;
            this.state.getChildByName("lock").active = true;
            this.state.getChildByName("select").active = false;
          }
        }
        openDetailView() {
          PageMgr.openPage(UIPage.BackGroundDetailView, UIPAGE_TYPE.PAGE, {
            id: this.bgId
          });
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "itemBg", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "shadow", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "state", [_dec4], {
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

System.register("chunks:///_virtual/backgroundView.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BasePage.ts', './PageMgr.ts', './GameDataMgr.ts', './backgroundItem.ts', './DataEnums.ts', './account.ts', './AudioMgr.ts', './barSortBridge.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, Prefab, Label, _decorator, director, instantiate, BasePage, PageMgr, UIPage, GameDataMgr, backgroundItem, EventID, account, AudioMgr, AUDIO_NAME, barSortBridge, Vibration;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      Prefab = module.Prefab;
      Label = module.Label;
      _decorator = module._decorator;
      director = module.director;
      instantiate = module.instantiate;
    }, function (module) {
      BasePage = module.BasePage;
    }, function (module) {
      PageMgr = module.PageMgr;
      UIPage = module.UIPage;
    }, function (module) {
      GameDataMgr = module.GameDataMgr;
    }, function (module) {
      backgroundItem = module.backgroundItem;
    }, function (module) {
      EventID = module.EventID;
    }, function (module) {
      account = module.account;
    }, function (module) {
      AudioMgr = module.AudioMgr;
      AUDIO_NAME = module.AUDIO_NAME;
    }, function (module) {
      barSortBridge = module.barSortBridge;
      Vibration = module.Vibration;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;
      cclegacy._RF.push({}, "8c279agJPpJcINLP++rfn0d", "backgroundView", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let backgroundView = exports('backgroundView', (_dec = ccclass('backgroundView'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Prefab), _dec5 = property(Label), _dec(_class = (_class2 = class backgroundView extends BasePage {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "content", _descriptor, this);
          _initializerDefineProperty(this, "coinArea", _descriptor2, this);
          _initializerDefineProperty(this, "bgItem", _descriptor3, this);
          _initializerDefineProperty(this, "collectionProgress", _descriptor4, this);
        }
        onLoad() {
          director.on(EventID.REFRESH_BACKGROUND_VIEW, this.refreshView, this);
        }
        onEnable() {
          AudioMgr.instance.playEffect(AUDIO_NAME.show_page);
          barSortBridge.vibrate(30, Vibration.NORMAL);
          this.createBgItem();
          let gdMgr = GameDataMgr.instance;
          this.collectionProgress.string = gdMgr.data.unlockBg.length + "/" + gdMgr.data.maxBgNum;
          this.coinArea.getComponent(account).updateTokenNum();
        }
        createBgItem() {
          let gdMgr = GameDataMgr.instance;
          for (let i = 1; i <= gdMgr.data.maxBgNum; i++) {
            let item = instantiate(this.bgItem);
            item.parent = this.content;
            item.getComponent(backgroundItem).initdata({
              id: i
            });
          }
        }
        refreshView() {
          for (let i = 0; i < this.content.children.length; i++) {
            let item = this.content.children[i];
            item.getComponent(backgroundItem).refreshItem();
          }
          let gdMgr = GameDataMgr.instance;
          this.collectionProgress.string = gdMgr.data.unlockBg.length + "/" + gdMgr.data.maxBgNum;
        }
        closeSelf() {
          AudioMgr.instance.playEffect(AUDIO_NAME.btn_click);
          barSortBridge.vibrate(30, Vibration.LIGHT);
          PageMgr.closePage(UIPage.BackGroundView);
        }
        update(deltaTime) {}
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "content", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "coinArea", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "bgItem", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "collectionProgress", [_dec5], {
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

System.register("chunks:///_virtual/barSortBridge.ts", ['cc', './GameDataMgr.ts', './DataEnums.ts', './LogMgr.ts', './connectMgr.ts', './config.ts'], function (exports) {
  var cclegacy, native, GameDataMgr, JsbBridgeEvent, LogMgr, connectMgr, Config;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      native = module.native;
    }, function (module) {
      GameDataMgr = module.GameDataMgr;
    }, function (module) {
      JsbBridgeEvent = module.JsbBridgeEvent;
    }, function (module) {
      LogMgr = module.LogMgr;
    }, function (module) {
      connectMgr = module.connectMgr;
    }, function (module) {
      Config = module.Config;
    }],
    execute: function () {
      cclegacy._RF.push({}, "df38ejhYGBI/KUD6/R3V8G5", "barSortBridge", undefined);
      let Vibration = exports('Vibration', /*#__PURE__*/function (Vibration) {
        Vibration[Vibration["DEFAULT"] = -1] = "DEFAULT";
        Vibration[Vibration["LIGHT"] = 2] = "LIGHT";
        Vibration[Vibration["NORMAL"] = 0] = "NORMAL";
        Vibration[Vibration["STRONG"] = 1] = "STRONG";
        Vibration[Vibration["HEAVY"] = 5] = "HEAVY";
        return Vibration;
      }({}));
      class barSortBridge {
        constructor() {}
        static get instance() {
          if (!this._instance) {
            this._instance = new barSortBridge();
          }
          return this._instance;
        }
        static vibrate(duration, effect) {
          if (!GameDataMgr.instance.settingConfig.vibration) return;
          if (native && native.bridge) {
            const param = {
              d: duration,
              e: effect
            };
            barSortBridge.dispatchEventToNative(JsbBridgeEvent.on_vibrate, JSON.stringify(param));
          }
        }
        static contactUs(to, subject, body) {
          if (native && native.bridge) {
            const param = {
              to: to,
              subject: subject,
              body: body
            };
            barSortBridge.dispatchEventToNative(JsbBridgeEvent.on_send_mail, JSON.stringify(param));
          }
        }
        static dispatchEventToNative(event, data) {
          if (native && native.jsbBridgeWrapper) {
            native.jsbBridgeWrapper.dispatchEventToNative(event, data || "");
          }
        }
        setupNativeEventListner(onNativeBindedCallback) {
          if (native && native.bridge) {
            native.bridge.onNative = function (arg0, arg1) {
              if (arg0 === JsbBridgeEvent.on_native_info) {
                // 
                LogMgr.log("on_native_info", arg1);
                const data = JSON.parse(arg1);
                Config.MEM = data.mem;
                Config.DEBUG = data.debug;
                Config.GAME_VERSION = data.version;
                Config.LANG_CODE = data.lang;
                Config.COUNTRY_CODE = data.country;
                Config.GAME_UUID = data.game_uuid;
                Config.PACKAGE = data.package;
                Config.API_URL = data.api_host;
                onNativeBindedCallback && onNativeBindedCallback();
              } else if (arg0 === JsbBridgeEvent.on_connect_event) {
                // 
                LogMgr.log("on_connect_event", arg1);
                connectMgr.onConnectEvent(arg1);
              }
            };
            native.bridge.sendToNative(JsbBridgeEvent.on_scene_ready);
          } else {
            console.error("native.bridge is null");
            onNativeBindedCallback && onNativeBindedCallback();
          }
        }
        onNativeConnectEvent(args) {
          LogMgr.log("onNativeConnectEvent", args);
          connectMgr.onConnectEvent(args);
        }
      }
      exports('barSortBridge', barSortBridge);
      barSortBridge._instance = void 0;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/BasePage.ts", ['cc'], function (exports) {
  var cclegacy, Component, _decorator;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      _decorator = module._decorator;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "8dd2a4lW5NP1bbNcicQUP3q", "BasePage", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let BasePage = exports('BasePage', (_dec = ccclass('BasePage'), _dec(_class = class BasePage extends Component {
        constructor(...args) {
          super(...args);
          this.data = void 0;
        }
        initData(data) {
          this.data = data;
        }
      }) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/collectDetailView.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BasePage.ts', './PageMgr.ts', './ResMgr.ts', './AudioMgr.ts', './barSortBridge.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Sprite, _decorator, SpriteFrame, BasePage, PageMgr, UIPage, ResMgr, cacheType, AudioMgr, AUDIO_NAME, barSortBridge, Vibration;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Sprite = module.Sprite;
      _decorator = module._decorator;
      SpriteFrame = module.SpriteFrame;
    }, function (module) {
      BasePage = module.BasePage;
    }, function (module) {
      PageMgr = module.PageMgr;
      UIPage = module.UIPage;
    }, function (module) {
      ResMgr = module.ResMgr;
      cacheType = module.cacheType;
    }, function (module) {
      AudioMgr = module.AudioMgr;
      AUDIO_NAME = module.AUDIO_NAME;
    }, function (module) {
      barSortBridge = module.barSortBridge;
      Vibration = module.Vibration;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "56bdfH1uV9JnpnNpn1SZt3L", "collectDetailView", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let collectDetailView = exports('collectDetailView', (_dec = ccclass('collectDetailView'), _dec2 = property(Sprite), _dec(_class = (_class2 = class collectDetailView extends BasePage {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "drinkImg", _descriptor, this);
        }
        async initData(data) {
          AudioMgr.instance.playEffect(AUDIO_NAME.show_page);
          barSortBridge.vibrate(30, Vibration.NORMAL);
          this.drinkImg.spriteFrame = await ResMgr.instance.loadAAndReturnAsset(`textures/collect/detail/${data}/spriteFrame`, SpriteFrame, cacheType.spriteCache);
        }
        closeSelf() {
          AudioMgr.instance.playEffect(AUDIO_NAME.btn_click);
          PageMgr.closePage(UIPage.CollectDetailView);
        }
      }, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "drinkImg", [_dec2], {
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

System.register("chunks:///_virtual/collectItem.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './ResMgr.ts', './GameDataMgr.ts', './PageMgr.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, ProgressBar, SpriteFrame, _decorator, Component, Sprite, Label, ResMgr, cacheType, GameDataMgr, PageMgr, UIPage, UIPAGE_TYPE;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      ProgressBar = module.ProgressBar;
      SpriteFrame = module.SpriteFrame;
      _decorator = module._decorator;
      Component = module.Component;
      Sprite = module.Sprite;
      Label = module.Label;
    }, function (module) {
      ResMgr = module.ResMgr;
      cacheType = module.cacheType;
    }, function (module) {
      GameDataMgr = module.GameDataMgr;
    }, function (module) {
      PageMgr = module.PageMgr;
      UIPage = module.UIPage;
      UIPAGE_TYPE = module.UIPAGE_TYPE;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;
      cclegacy._RF.push({}, "f729eNdUkRLQJazgraAz0xe", "collectItem", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let collectItem = exports('collectItem', (_dec = ccclass('collectItem'), _dec2 = property(Node), _dec3 = property(ProgressBar), _dec4 = property(Node), _dec5 = property({
        type: SpriteFrame
      }), _dec(_class = (_class2 = class collectItem extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "drinkImg", _descriptor, this);
          _initializerDefineProperty(this, "progressBar", _descriptor2, this);
          _initializerDefineProperty(this, "drinkName", _descriptor3, this);
          _initializerDefineProperty(this, "defaultCup", _descriptor4, this);
          this.drinkStr = "";
          this.itemId = 0;
        }
        start() {}
        async initItem(itemId, spriteName) {
          let gdMgrData = GameDataMgr.instance.data;
          this.drinkStr = spriteName;
          this.itemId = itemId;
          let islocked = gdMgrData.collectCup.indexOf(itemId) == -1;
          let collectId = gdMgrData.curCollect.collectId;
          if (islocked && itemId != collectId) {
            this.drinkImg.getComponent(Sprite).spriteFrame = this.defaultCup;
            this.drinkName.getComponent(Label).string = "???";
            this.progressBar.progress = 0;
          } else {
            let curCollect = GameDataMgr.instance.data.curCollect;
            let collectId = curCollect.collectId;
            let progress = collectId == itemId ? curCollect.collectProgress / curCollect.targetProgress : 1;
            this.drinkImg.getComponent(Sprite).spriteFrame = await ResMgr.instance.loadAAndReturnAsset(`textures/collect/view/${spriteName}/spriteFrame`, SpriteFrame, cacheType.spriteCache);
            this.drinkName.getComponent(Label).string = spriteName;
            this.progressBar.progress = progress;
          }
        }
        openCollectDetailView() {
          let islocked = GameDataMgr.instance.data.collectCup.indexOf(this.itemId) == -1;
          if (islocked) {
            PageMgr.openPage(UIPage.Toast, UIPAGE_TYPE.ALERT, "Not obtained, please try again after obtaining it");
          } else {
            PageMgr.openPage(UIPage.CollectDetailView, UIPAGE_TYPE.PAGE, this.drinkStr);
          }
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "drinkImg", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "progressBar", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "drinkName", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "defaultCup", [_dec5], {
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

System.register("chunks:///_virtual/collectView.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BasePage.ts', './PageMgr.ts', './collectItem.ts', './GameDataMgr.ts', './AudioMgr.ts', './barSortBridge.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Prefab, Node, Label, SpriteFrame, ProgressBar, _decorator, instantiate, UIOpacity, tween, Vec3, Tween, BasePage, PageMgr, UIPage, UIPAGE_TYPE, collectItem, GameDataMgr, AudioMgr, AUDIO_NAME, barSortBridge, Vibration;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Prefab = module.Prefab;
      Node = module.Node;
      Label = module.Label;
      SpriteFrame = module.SpriteFrame;
      ProgressBar = module.ProgressBar;
      _decorator = module._decorator;
      instantiate = module.instantiate;
      UIOpacity = module.UIOpacity;
      tween = module.tween;
      Vec3 = module.Vec3;
      Tween = module.Tween;
    }, function (module) {
      BasePage = module.BasePage;
    }, function (module) {
      PageMgr = module.PageMgr;
      UIPage = module.UIPage;
      UIPAGE_TYPE = module.UIPAGE_TYPE;
    }, function (module) {
      collectItem = module.collectItem;
    }, function (module) {
      GameDataMgr = module.GameDataMgr;
    }, function (module) {
      AudioMgr = module.AudioMgr;
      AUDIO_NAME = module.AUDIO_NAME;
    }, function (module) {
      barSortBridge = module.barSortBridge;
      Vibration = module.Vibration;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7;
      cclegacy._RF.push({}, "f89bethl5hPdYMdyUhyE4Wb", "collectView", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let collectView = exports('collectView', (_dec = ccclass('collectView'), _dec2 = property(Prefab), _dec3 = property(Node), _dec4 = property(Label), _dec5 = property(Node), _dec6 = property({
        type: [SpriteFrame]
      }), _dec7 = property({
        type: [SpriteFrame]
      }), _dec8 = property(ProgressBar), _dec(_class = (_class2 = class collectView extends BasePage {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "item", _descriptor, this);
          _initializerDefineProperty(this, "content", _descriptor2, this);
          _initializerDefineProperty(this, "lblCollect", _descriptor3, this);
          _initializerDefineProperty(this, "itemlayout", _descriptor4, this);
          _initializerDefineProperty(this, "sprPointList", _descriptor5, this);
          _initializerDefineProperty(this, "sprAwardList", _descriptor6, this);
          _initializerDefineProperty(this, "progress", _descriptor7, this);
          this.canAwardArr = [];
          this.coinReward = [200, 250, 300];
        }
        onEnable() {
          AudioMgr.instance.playEffect(AUDIO_NAME.show_page);
          barSortBridge.vibrate(30, Vibration.NORMAL);
          let len = Object.keys(GameDataMgr.drinkMap).length;
          for (let i = 0; i < len; i++) {
            let item = instantiate(this.item);
            item.parent = this.content;
            let spriteName = GameDataMgr.drinkMap[i];
            item.getComponent(collectItem).initItem(i, spriteName);
          }
          this.refreshItemLayout();
          this.lblCollect.string = GameDataMgr.instance.data.collectCup.length + "/" + 500;
        }
        refreshItemLayout() {
          let gdMgr = GameDataMgr.instance;
          for (let i = 0; i < this.itemlayout.children.length; i++) {
            let turn = Math.floor(gdMgr.data.collectCup.length / 10);
            let item = this.itemlayout.children[i];
            let collect_reward = gdMgr.mainConfig.collect_reward;
            let str = 1;
            if (i == 0) {
              str = collect_reward[2] * turn == 0 ? 1 : collect_reward[2] + (turn - 1) * 10;
            } else {
              str = collect_reward[i - 1] + turn * 10;
              let light = item.getChildByName("light");
              if (gdMgr.data.collectCup.length >= str) {
                if (gdMgr.data.collect_reward_flag[i - 1] == 0) {
                  this.playBreathAnimation(light);
                } else {
                  this.stopBreathAnimation(light);
                }
              } else {
                this.stopBreathAnimation(light);
              }
            }
            this.canAwardArr.push(str);
            item.getChildByName("label").getComponent(Label).string = str.toString();
          }
          let startNum = Math.min(...this.canAwardArr);
          let endNum = Math.max(...this.canAwardArr);
          let progress = (gdMgr.data.collectCup.length - startNum) / (endNum - startNum);
          this.progress.progress = progress;
        }
        playBreathAnimation(node) {
          let opacity = node.getComponent(UIOpacity);
          tween(node).repeatForever(tween().parallel(tween().to(1, {
            scale: new Vec3(1.1, 1.1, 1.1)
          }), tween(opacity).to(1, {
            opacity: 255
          })).delay(0.2).parallel(tween().to(1, {
            scale: new Vec3(0.9, 0.9, 0.9)
          }), tween(opacity).to(1, {
            opacity: 180
          }))).start();
        }
        stopBreathAnimation(node) {
          Tween.stopAllByTarget(node);
          node.active = false;
        }
        getReward(event, param) {
          let gdMgr = GameDataMgr.instance;
          let awardNum = this.canAwardArr[param];
          let hasNum = gdMgr.data.collectCup.length;
          if (hasNum < awardNum && gdMgr.data.collect_reward_flag[param - 1] != 0) {
            return;
          }
          if (param == 2) {
            let id = this.getRandomLockBgId();
            if (id > 0) {
              gdMgr.data.unlockBg.push(id);
              PageMgr.openPage(UIPage.BackGroundDetailView, UIPAGE_TYPE.PAGE, {
                id: id
              });
            } else {
              PageMgr.openPage(UIPage.GetAwardView, UIPAGE_TYPE.PAGE, {
                page: 1,
                getValue: this.coinReward[param - 1]
              });
            }
          } else {
            PageMgr.openPage(UIPage.GetAwardView, UIPAGE_TYPE.PAGE, {
              page: 1,
              getValue: this.coinReward[param - 1]
            });
          }
          this.refreshItemLayout();
        }
        getRandomLockBgId() {
          let gdMgr = GameDataMgr.instance;
          const arr1 = Array.from({
            length: gdMgr.data.maxBgNum
          }, (_, index) => index + 1);
          const arr2 = gdMgr.data.unlockBg;
          const diff = arr1.filter(item => !arr2.includes(item));
          if (diff.length == 0) {
            return -1;
          } else {
            let index = Math.floor(Math.random() * diff.length);
            return diff[index];
          }
        }
        closeSelf() {
          AudioMgr.instance.playEffect(AUDIO_NAME.btn_click);
          barSortBridge.vibrate(30, Vibration.LIGHT);
          PageMgr.closePage(UIPage.CollectView);
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "item", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "content", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "lblCollect", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "itemlayout", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "sprPointList", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "sprAwardList", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "progress", [_dec8], {
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

System.register("chunks:///_virtual/CommonTip.ts", ['cc', './BasePage.ts'], function (exports) {
  var cclegacy, Label, Vec3, tween, Tween, _decorator, BasePage;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      Vec3 = module.Vec3;
      tween = module.tween;
      Tween = module.Tween;
      _decorator = module._decorator;
    }, function (module) {
      BasePage = module.BasePage;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "a03e7IvsKpL+qulskGIs8CT", "CommonTip", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let CommonTip = exports('CommonTip', (_dec = ccclass('CommonTip'), _dec(_class = class CommonTip extends BasePage {
        initData(text) {
          let textNode = this.node.getChildByName("str");
          textNode.getComponent(Label).string = text;
          this.node.scale = new Vec3(2, 2, 2);
          this.node.position = new Vec3(0, 240, 0);
          tween(this.node).to(0.1, {
            scale: new Vec3(1, 1, 1)
          }).delay(1).to(0.3, {
            position: new Vec3(0, 480, 0)
          }).call(() => {
            Tween.stopAllByTarget(this.node);
            this.node.removeFromParent();
          }).start();
        }
      }) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/CommonUtility.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "073f7VpOHJFpIEru2lYB11O", "CommonUtility", undefined);
      class CommonUtility {
        static delayExecution(ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
        }
      }
      exports('CommonUtility', CommonUtility);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/config-agent.ts", ['cc', './config.ts', './LogMgr.ts', './request-manager.ts', './storage-manager.ts'], function (exports) {
  var cclegacy, Config, LogMgr, ReqeustManager, StorageManager;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      Config = module.Config;
    }, function (module) {
      LogMgr = module.LogMgr;
    }, function (module) {
      ReqeustManager = module.ReqeustManager;
    }, function (module) {
      StorageManager = module.StorageManager;
    }],
    execute: function () {
      cclegacy._RF.push({}, "f92af2CL2FGgbgG7mavlOm2", "config-agent", undefined);
      let ConfigType = exports('ConfigType', /*#__PURE__*/function (ConfigType) {
        ConfigType["Base"] = "base";
        ConfigType["Main"] = "main";
        ConfigType["Store"] = "store";
        ConfigType["Web"] = "web";
        return ConfigType;
      }({}));
      class ConfigAgent {
        static fetchConfig() {
          return new Promise((resolve, reject) => {
            //Config.GAME_UUID
            LogMgr.log('fetchConfig:', Config.GAME_UUID, Config.API_URL, Config.GAME_VERSION);
            ReqeustManager.instance.post(`/${Config.GAME_UUID}/fetch/preset`, {
              code: Config.GAME_CODE,
              version: Config.GAME_VERSION
            }).then(data => {
              LogMgr.log('fetchConfig data welcome:', data);
              const payload = data['data']['payload'];
              if (Array.isArray(payload) && payload.length > 0) {
                for (const item of payload) {
                  const category = item['category'];
                  const config = item;
                  ConfigAgent.saveRawConfig(category, config);
                }
              }
              resolve();
            }).catch(error => {
              console.error('error fetchConfig:', error);
              // reject(error);
              resolve();
            });
          });
        }
        static getConfig(category) {
          const key = `config_${category}`;
          const obj = StorageManager.instance.getJson(key);
          if (!obj) {
            return null;
          }
          try {
            return JSON.parse(obj.content);
          } catch (err) {
            console.error(err);
          }
          return null;
        }
        getHash(category) {
          const key = `config_${category}`;
          const obj = StorageManager.instance.getJson(key);
          if (!obj) {
            return null;
          }
          return obj.contentHash;
        }
        static saveRawConfig(category, value) {
          const key = `config_${category}`;
          LogMgr.log('config agent saveRawConfig:', key, JSON.stringify(value));
          StorageManager.instance.set(key, JSON.stringify(value));
        }
      }
      exports('ConfigAgent', ConfigAgent);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/config.ts", ['cc', './gm-manager.ts', './GameDataMgr.ts'], function (exports) {
  var cclegacy, sys, director, GmManager, GameDataMgr, SgState;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      sys = module.sys;
      director = module.director;
    }, function (module) {
      GmManager = module.GmManager;
    }, function (module) {
      GameDataMgr = module.GameDataMgr;
      SgState = module.SgState;
    }],
    execute: function () {
      cclegacy._RF.push({}, "de4f0o7q/pEe6n7zXCbiIfP", "config", undefined);
      let AppConfig = exports('AppConfig', /*#__PURE__*/function (AppConfig) {
        AppConfig["FLAG_CHANGED"] = "flag_changed";
        return AppConfig;
      }({}));
      class Config {
        static get GAME_CODE() {
          switch (sys.platform) {
            case sys.Platform.IOS:
              return "isgbarsort";
            default:
              return "isgbarsort";
          }
        }
        static get ENABLE_WEB() {
          const no_web_version = GameDataMgr.instance.mainConfig.no_web_version || [];
          return no_web_version.indexOf(this.GAME_VERSION) < 0;
        }
        static get ENABLE_SG() {
          const no_sg_version = GameDataMgr.instance.mainConfig.no_sg_version || [];
          if (no_sg_version.indexOf(this.GAME_VERSION) >= 0) {
            console.log(`ENABLE_SG: no_sg_version-false`);
            return false;
          }
          console.log(`ENABLE_SG: RFlag-${this.getRFlag()} && isStart:${GameDataMgr.instance.sg.state === SgState.Started}`);
          return this.getRFlag();
        }
        static setRFlag(val) {
          if (this.firstSetFlagTime > 0 && val) {
            this.flagChangeDuration = Math.floor((Date.now() - this.firstSetFlagTime) / 1000);
          }
          this.isFlagChanged = true;
          this.R_FLAG = val;
          GameDataMgr.instance.localData.lastRFlag = val;
          GameDataMgr.instance.saveData();
          director.emit(AppConfig.FLAG_CHANGED);
        }
        static getRFlag() {
          console.log(`getRFlag: gm-${GmManager.instance.RFlag} || R_FLAG-${this.R_FLAG} || last-${GameDataMgr.instance.localData.lastRFlag}`);
          return GmManager.instance.RFlag || this.R_FLAG || GameDataMgr.instance.localData.lastRFlag;
        }
      }
      exports('Config', Config);
      //注意：native 请在 game.config.json中配置，然后由native回传
      Config.API_URL = 'https://beta-boost.mix-fun.com';
      Config.GAME_UUID = "2CD5D4C8449445278E8E5379885BCFC3";
      Config.PACKAGE = "com.homepage.quickly.crystal";
      Config.SG_GRAPH_HOST = "https://joy.heybarss.com";
      Config.GAME_NAME = "Drinks Sort";
      Config.GAME_VERSION = "1.0.0";
      Config.MAIL = "TopBartender0813@outlook.com";
      Config.DEBUG = true;
      Config.MEM = 0;
      // GM
      Config.LANG_CODE = 'en';
      Config.COUNTRY_CODE = 'US';
      Config.R_FLAG = false;
      Config.INIT_FETCH_DATA = false;
      Config.firstSetFlagTime = 0;
      Config.isFlagChanged = false;
      Config.flagChangeDuration = 0;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/connectMgr.ts", ['cc', './DataEnums.ts', './LogMgr.ts', './adAgent.ts', './GameDataMgr.ts', './config.ts'], function (exports) {
  var cclegacy, sys, native, director, JsbBridgeEvent, EventID, LogMgr, AdAgent, GameDataMgr, Config;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      sys = module.sys;
      native = module.native;
      director = module.director;
    }, function (module) {
      JsbBridgeEvent = module.JsbBridgeEvent;
      EventID = module.EventID;
    }, function (module) {
      LogMgr = module.LogMgr;
    }, function (module) {
      AdAgent = module.AdAgent;
    }, function (module) {
      GameDataMgr = module.GameDataMgr;
    }, function (module) {
      Config = module.Config;
    }],
    execute: function () {
      cclegacy._RF.push({}, "a4afdidOkJOq7aiQ5T54zyH", "connectMgr", undefined);
      class connectMgr {
        static init() {
          if (!sys.isBrowser && sys.os === sys.OS.IOS) {
            console.log('ad sdk init iOS');
            native.bridge.sendToNative(JsbBridgeEvent.sdk_init);
          }
          console.log('ad sdk init end');
        }
        static openVideoAd(entry) {
          LogMgr.log('openVideoAd:', entry);
          switch (sys.os) {
            case sys.OS.IOS:
              native.bridge.sendToNative(JsbBridgeEvent.sdk_ad_reward);
          }
          return false;
        }
        static openInterstitialAd(entry) {
          LogMgr.error('addd openInterstitialAd entry:', entry);
          switch (sys.os) {
            case sys.OS.IOS:
              {
                native.bridge.sendToNative(JsbBridgeEvent.sdk_ad_inters);
              }
              break;
          }
        }
        static onConnectEvent(event) {
          LogMgr.log("onConnectEvent", event);
          const data = JSON.parse(event);
          if (data.type === "reward") {
            switch (data.param) {
              case "display":
                AdAgent.videoAd.onVideoAdStart({
                  entry: ""
                });
                director.emit(EventID.STOP_COUNTDOWN);
                break;
              case "not_ready":
                AdAgent.videoAd.onVideoNotReady({
                  entry: ""
                });
                break;
              case "close":
                AdAgent.videoAd.adVideoClosed({
                  entry: ""
                });
                director.emit(EventID.START_GAME);
                break;
              case "rewarded":
                AdAgent.videoAd.adVideoComplete({
                  entry: ""
                });
                break;
            }
          } else if (data.type === "invite_code") {
            const code = data.param;
            GameDataMgr.instance.setPlayerInviteCode(code);
          } else if (data.type === "theme") {
            const theme = data.param;
            Config.setRFlag(theme);
          } else if (data.type === "inters") {
            switch (data.param) {
              case "display":
                AdAgent.interstitialAd.onInterstitialStart({
                  entry: ""
                });
                break;
              case "not_ready":
                AdAgent.interstitialAd.onInterstitialNotReady({
                  entry: ""
                });
                break;
              case "close":
                AdAgent.interstitialAd.onInterstitialClosed({
                  entry: ""
                });
                break;
            }
          }
        }
      }
      exports('connectMgr', connectMgr);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Customer.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Sprite, Node, SpriteFrame, sp, _decorator, Component, tween, Vec3;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Sprite = module.Sprite;
      Node = module.Node;
      SpriteFrame = module.SpriteFrame;
      sp = module.sp;
      _decorator = module._decorator;
      Component = module.Component;
      tween = module.tween;
      Vec3 = module.Vec3;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6;
      cclegacy._RF.push({}, "d7158p6v+1IiaBJyNaY5LfD", "Customer", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let Customer = exports('Customer', (_dec = ccclass('Customer'), _dec2 = property(Sprite), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property({
        type: [SpriteFrame]
      }), _dec6 = property({
        type: [SpriteFrame]
      }), _dec7 = property({
        type: [sp.SkeletonData]
      }), _dec(_class = (_class2 = class Customer extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "customerNode", _descriptor, this);
          _initializerDefineProperty(this, "coinTip", _descriptor2, this);
          _initializerDefineProperty(this, "spine", _descriptor3, this);
          _initializerDefineProperty(this, "customerSprList", _descriptor4, this);
          _initializerDefineProperty(this, "customerSprBackList", _descriptor5, this);
          _initializerDefineProperty(this, "customerSpineList", _descriptor6, this);
          this.cusromerId = 0;
          this.positionId = 0;
        }
        onLoad() {
          this.hideCoinTip();
        }
        initCustomer(customerId, positionId) {
          this.cusromerId = customerId;
          this.positionId = positionId;
          this.customerNode.spriteFrame = this.customerSprList[customerId];
          this.customerNode.node.active = true;
          this.spine.active = false;
          this.spine.getComponent(sp.Skeleton).skeletonData = this.customerSpineList[customerId];
        }
        showCustomerIdle() {
          this.customerNode.node.active = false;
          this.spine.active = true;
          this.spine.getComponent(sp.Skeleton).setAnimation(0, "idle", true);
        }
        customerLeft() {
          return new Promise((resolve, reject) => {
            this.customerNode.node.active = true;
            this.spine.active = false;
            tween(this.customerNode.node).to(0.1, {
              scale: new Vec3(0, 1, 1)
            }).call(() => {
              this.customerNode.spriteFrame = this.customerSprBackList[this.cusromerId];
            }).to(0.1, {
              scale: new Vec3(1, 1, 1)
            }).to(1, {
              scale: new Vec3(0.5, 0.5, 0.5)
            }).call(() => {
              resolve();
            }).start();
          });
        }
        showCoinTip() {
          this.coinTip.active = true;
        }
        hideCoinTip() {
          this.coinTip.active = false;
        }
        moveTobar() {
          this.node.position;
        }
        update(deltaTime) {}
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "customerNode", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "coinTip", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "spine", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "customerSprList", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "customerSprBackList", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "customerSpineList", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/data-agent.ts", ['cc', './config.ts', './time-agent.ts', './LogMgr.ts', './request-manager.ts', './storage-manager.ts'], function (exports) {
  var cclegacy, Config, TimeAgent, LogMgr, ReqeustManager, StorageManager;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      Config = module.Config;
    }, function (module) {
      TimeAgent = module.TimeAgent;
    }, function (module) {
      LogMgr = module.LogMgr;
    }, function (module) {
      ReqeustManager = module.ReqeustManager;
    }, function (module) {
      StorageManager = module.StorageManager;
    }],
    execute: function () {
      cclegacy._RF.push({}, "587998yxZdFVaiCOvcDjZOA", "data-agent", undefined);
      let DataType = exports('DataType', /*#__PURE__*/function (DataType) {
        DataType["Game"] = "game";
        DataType["Gain"] = "gain";
        DataType["Player"] = "player";
        DataType["SgPicInfo"] = "sgPicInfo";
        DataType["Local"] = "local";
        DataType["Sg"] = "sg";
        return DataType;
      }({}));
      class DataAgent {
        static fetchData() {
          return new Promise((resolve, reject) => {
            LogMgr.log('fetchData uid is:', StorageManager.instance.getUid());
            ReqeustManager.instance.get(`/fetch/player/${StorageManager.instance.getUid()}`).then(data => {
              const payload = data['data']['payload'];
              if (!payload) {
                LogMgr.log('fetchData payload is null');
                resolve(null);
                return;
              }
              if (payload['now']) {
                const serverTime = payload['now'];
                if (!!serverTime && serverTime > 0) {
                  TimeAgent.instance.setServerTime(serverTime);
                }
              }

              // if (payload['game']) {
              //     const gameData = payload['game'];
              //     this.saveData(DataType.Game, gameData);
              // }

              // if (payload['gain']) {
              //     const gainData = payload['gain'];
              //     this.saveData(DataType.Gain, gainData);
              // }

              // const playerData = {
              //     sid: payload['sid'],
              //     major: payload['tokenMajor'],
              //     minor: payload['tokenMinor']
              // }

              // this.saveData(DataType.Player, playerData);

              resolve(payload);
            }).catch(error => {
              LogMgr.error('error fetchData:', error);
              // slient
              resolve(null);
            });
          });
        }
        static uploadData(type, payload) {
          return new Promise((resolve, reject) => {
            ReqeustManager.instance.post(`/update/player`, {
              code: Config.GAME_CODE,
              version: Config.GAME_VERSION,
              payload: payload
            }).then(data => {
              if (data['ret'] === 0) {
                resolve();
              } else {
                console.error('error welcome: ', data['message']);
              }
            }).catch(error => {
              console.error('error welcome:', error);
              reject(error);
            });
          });
        }
        static saveData(key, value) {
          if (!key || !value) {
            LogMgr.log('save data: key or value is null');
            return;
          }
          StorageManager.instance.set(`data.${key}`, value);
        }
        static getData(key) {
          if (!key) {
            LogMgr.log('get data: key is null');
            return null;
          }
          const obj = StorageManager.instance.getJson(`data.${key}`);
          if (!obj) {
            return null;
          }
          return obj;
        }
      }
      exports('DataAgent', DataAgent);
      DataAgent._saveKey = 'raw_data_from_server';
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/DataEnums.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "dd024k3KX9Bg5+qzgex2u5a", "DataEnums", undefined);
      class EventID {}
      exports('EventID', EventID);
      EventID.START_GAME = 'START_GAME';
      EventID.NEXT_LEVEL = 'NEXT_LEVEL';
      EventID.ORDER_TIME_OUT = 'ORDER_TIME_OUT';
      EventID.POURONEFINISHED = 'POURONEFINISHED';
      EventID.REFRESH_BACKGROUND_VIEW = 'REFRESHBACKGROUNDVIEW';
      EventID.UPDATE_ACCOUNT = 'UPDATE_ACCOUNT';
      EventID.UPDATE_BACKGROUND = 'UPDATE_BACKGROUND';
      EventID.UPDATE_TOOL = 'UPDATE_TOOL';
      EventID.STOP_COUNTDOWN = 'STOP_COUNTDOWN';
      let toolType = exports('toolType', /*#__PURE__*/function (toolType) {
        toolType[toolType["magic"] = 0] = "magic";
        toolType[toolType["back"] = 1] = "back";
        toolType[toolType["add"] = 2] = "add";
        return toolType;
      }({}));
      let JsbBridgeEvent = exports('JsbBridgeEvent', /*#__PURE__*/function (JsbBridgeEvent) {
        JsbBridgeEvent["on_vibrate"] = "on_vibrate";
        JsbBridgeEvent["on_page_rc"] = "on_page_rc";
        JsbBridgeEvent["on_native_info"] = "on_native_info";
        JsbBridgeEvent["on_scene_ready"] = "on_scene_ready";
        JsbBridgeEvent["on_send_mail"] = "on_send_mail";
        JsbBridgeEvent["on_connect_event"] = "on_connect_event";
        JsbBridgeEvent["sdk_ad_reward"] = "sdk_ad_reward";
        JsbBridgeEvent["sdk_ad_inters"] = "sdk_ad_inters";
        JsbBridgeEvent["sdk_report_data"] = "sdk_report_data";
        JsbBridgeEvent["sdk_init"] = "sdk_init";
        JsbBridgeEvent["sdk_ad_debug"] = "sdk_ad_debug";
        return JsbBridgeEvent;
      }({}));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/front-line.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Asset, _decorator, Component, native, game, sys;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Asset = module.Asset;
      _decorator = module._decorator;
      Component = module.Component;
      native = module.native;
      game = module.game;
      sys = module.sys;
    }],
    execute: function () {
      var _dec, _dec2, _class2, _class3, _descriptor;
      cclegacy._RF.push({}, "e070357W+9FC6tw6XKs3C+1", "front-line", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      class HotUpdateInfo {
        constructor() {
          this.version = '';
          this.timestamp = 0;
        }
      }
      exports('HotUpdateInfo', HotUpdateInfo);
      const FrontLineEvent = exports('FrontLineEvent', {
        UPDATE_PROGRESS: 'update_progress',
        UPDATE_ERROR: 'update_error',
        UPDATE_SUCCESS: 'update_success',
        UPDATE_FAILED: 'update_failed',
        ALREADY_UP_TO_DATE: 'already_up_to_date'
      });
      const HOT_UPDATE_TIMESTAMP = exports('HOT_UPDATE_TIMESTAMP', 'hot_update_timestamp');
      const HOT_UPDATE_TIME_COST = exports('HOT_UPDATE_TIME_COST', 'hot_update_time_cost');
      const HOT_UPDATE_VERSION = exports('HOT_UPDATE_VERSION', 'hot_update_version');
      let FrontLine = exports('FrontLine', (_dec = ccclass('FrontLine'), _dec2 = property(Asset), _dec(_class2 = (_class3 = class FrontLine extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "localManifest", _descriptor, this);
          this._assetsManager = void 0;
          this._storagePath = void 0;
          this._isStarted = false;
          this._callback = null;
          this._retryLimit = 3;
          this._retryCount = 0;
          this._localStorageFolderName = 'front_line';
          this._maxConcurrentTask = 8;
        }
        toStart(callback) {
          console.log(`OjaiTest-front line start: ${this._isStarted}`);
          if (this._isStarted) {
            return false;
          }
          this._callback = callback;
          this._isStarted = true;
          if (!this.localManifest) {
            if (this._callback) {
              this._callback(false, 'OjaiTest-local manifest is null');
            }
            return false;
          }
          this.init();
          if (!this._assetsManager) {
            if (this._callback) {
              this._callback(false, 'OjaiTest-assets manager is null');
            }
            return false;
          }
          this.actionUpdate();
          return true;
        }
        init() {
          if (!native || !native.fileUtils) {
            return;
          }
          this._storagePath = native.fileUtils.getWritablePath() + this._localStorageFolderName;
          console.log(`OjaiTest-front line init-url: ${this.localManifest.nativeUrl}`);
          this._assetsManager = new native.AssetsManager(this.localManifest.nativeUrl, this._storagePath, this.versionCompare);
          console.log(`OjaiTest-front line init: ${this._assetsManager}`);
          this._assetsManager.setMaxConcurrentTask(this._maxConcurrentTask);
          this._assetsManager.setVerifyCallback(this.fileVerify.bind(this));
        }
        versionCompare(versionA, versionB) {
          var vA = versionA.split('.');
          var vB = versionB.split('.');
          for (var i = 0; i < vA.length; ++i) {
            var a = parseInt(vA[i]);
            var b = parseInt(vB[i] || '0');
            if (a === b) {
              continue;
            } else {
              return a - b;
            }
          }
          if (vB.length > vA.length) {
            return -1;
          } else {
            return 0;
          }
        }
        fileVerify(path, asset) {
          console.log('OjaiTest-fileVerify', path, asset.nativeUrl);
          return true;
        }
        actionCheck() {
          this._assetsManager.setEventCallback(this.onCheckEvent.bind(this));
          this._assetsManager.checkUpdate();
        }

        /**
         * 根据EventAssetsManager枚举值获取对应的key名称
         */
        getEventCodeName(code) {
          for (const key in native.EventAssetsManager) {
            const value = native.EventAssetsManager[key];
            if (typeof value === 'number' && value === code) {
              return key;
            }
          }
          return `UNKNOWN_EVENT_CODE_${code}`;
        }
        getStateName(state) {
          for (const key in native.AssetsManager.State) {
            const value = native.AssetsManager.State[key];
            if (typeof value === 'number' && value === state) {
              return key;
            }
          }
          return `UNKNOWN_STATE_${state}`;
        }
        printEventEnumValue() {
          for (const key in native.EventAssetsManager) {
            const value = native.EventAssetsManager[key];
            if (typeof value === 'number') {
              console.log(`${key}: ${value}`);
            }
          }
          for (const key in native.AssetsManager.State) {
            const value = native.AssetsManager.State[key];
            if (typeof value === 'number') {
              console.log(`${key}: ${value}`);
            }
          }
          console.log('=== 所有枚举值列表结束 ===');
        }
        onCheckEvent(event) {
          const eventCode = event.getEventCode();
          switch (eventCode) {
            case native.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
            case native.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case native.EventAssetsManager.ERROR_PARSE_MANIFEST:
              this.onUpdateError(event);
              break;
            case native.EventAssetsManager.ALREADY_UP_TO_DATE:
              this.onAlreadyUpToDate();
              break;
            case native.EventAssetsManager.NEW_VERSION_FOUND:
              this.actionUpdate();
              break;
          }
        }
        actionUpdate() {
          console.log('OjaiTest-actionUpdate');
          this._assetsManager.setEventCallback(this.onUpdateEvent.bind(this));
          this._assetsManager.update();
        }
        onUpdateEvent(event) {
          const eventCode = event.getEventCode();
          switch (eventCode) {
            case native.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case native.EventAssetsManager.ERROR_PARSE_MANIFEST:
            case native.EventAssetsManager.ERROR_UPDATING:
            case native.EventAssetsManager.ERROR_DECOMPRESS:
            case native.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
              this.onUpdateError(event);
              break;
            case native.EventAssetsManager.UPDATE_PROGRESSION:
              this.onUpdateProgress(event);
              break;
            case native.EventAssetsManager.ALREADY_UP_TO_DATE:
              this.onAlreadyUpToDate();
              break;
            case native.EventAssetsManager.UPDATE_FAILED:
              this.onUpdateFailedAndRetry();
              break;
            case native.EventAssetsManager.UPDATE_FINISHED:
              this.onUpdateSuccess();
              break;
          }
        }
        onUpdateError(event) {
          console.log(`OjaiTest-onUpdateError:${event.getMessage()}`);
          this.cleanUp();

          // 触发错误事件
          this.node.emit(FrontLineEvent.UPDATE_ERROR);

          // 回调失败状态
          if (this._callback) {
            this._callback(false, '');
          }
        }
        onUpdateProgress(event) {
          let percent = event.getDownloadedBytes() / event.getTotalBytes();
          if (typeof percent === 'number' && percent > 0) {
            percent = Math.floor(percent * 100) / 100;
            console.log(`OjaiTest-onUpdateProgress: ${(percent * 100).toFixed(0)}%`);
            this.node.emit(FrontLineEvent.UPDATE_PROGRESS, percent);
          }
        }
        onAlreadyUpToDate() {
          console.log('onAlreadyUpToDate');
          this.cleanUp();

          // 触发已经是最新版本事件
          this.node.emit(FrontLineEvent.ALREADY_UP_TO_DATE);
          if (this._callback) {
            this._callback(true, '');
          }
        }
        onUpdateFailedAndRetry() {
          console.log('OjaiTest-onUpdateFailedAndRetry');
          if (this._retryCount < this._retryLimit) {
            this._retryCount++;
            this._assetsManager.downloadFailedAssets();
          } else {
            this.cleanUp();

            // 触发更新失败事件
            this.node.emit(FrontLineEvent.UPDATE_FAILED);
            if (this._callback) {
              this._callback(false, '');
            }
          }
        }
        onUpdateSuccess() {
          console.log('OjaiTest-onUpdateSuccess');
          this.cleanUp();
          const searchPaths = native.fileUtils.getSearchPaths();
          const newPaths = this._assetsManager.getLocalManifest().getSearchPaths();
          Array.prototype.push.apply(searchPaths, newPaths);
          localStorage.setItem('FlexSearchPaths', JSON.stringify(searchPaths));
          native.fileUtils.setSearchPaths(searchPaths);

          // 触发更新成功事件
          this.node.emit(FrontLineEvent.UPDATE_SUCCESS);
          if (this._callback) {
            this._callback(true, "");
          }
          setTimeout(() => {
            game.restart();
          }, 500);
        }
        cleanUp() {
          this._assetsManager.setEventCallback(null);
        }
        getVersion() {
          if (!sys.isNative) {
            return;
          }
          try {
            // 获取可写路径下的version.manifest文件路径
            const storagePath = native.fileUtils.getWritablePath() + this._localStorageFolderName;
            const versionManifestPath = storagePath + '/version.manifest';
            console.log(`OjaiTest-getVersion: 尝试读取文件 ${versionManifestPath}`);

            // 检查文件是否存在
            if (!native.fileUtils.isFileExist(versionManifestPath)) {
              console.log('OjaiTest-getVersion: version.manifest文件不存在，尝试读取本地版本');
              // 如果热更新版本不存在，尝试读取本地版本
              return this.getLocalVersion();
            }

            // 读取version.manifest文件内容
            const fileContent = native.fileUtils.getStringFromFile(versionManifestPath);
            if (!fileContent) {
              console.log('OjaiTest-getVersion: 无法读取version.manifest文件内容');
              return this.getLocalVersion();
            }

            // 解析JSON内容
            const manifestData = JSON.parse(fileContent);
            const version = manifestData.version;
            console.log(`OjaiTest-getVersion: 成功解析版本号 ${version}`);
            return version;
          } catch (error) {
            console.error('OjaiTest-getVersion: 解析version.manifest文件失败', error);
            return this.getLocalVersion();
          }
        }

        /**
         * 获取本地版本号
         */
        getLocalVersion() {
          if (!sys.isNative) {
            return;
          }
          try {
            // 尝试从本地manifest文件获取版本号
            if (this.localManifest && this.localManifest.nativeUrl) {
              const localManifestPath = this.localManifest.nativeUrl;
              console.log(`OjaiTest-getLocalVersion: 尝试读取本地manifest ${localManifestPath}`);
              const fileContent = native.fileUtils.getStringFromFile(localManifestPath);
              if (fileContent) {
                const manifestData = JSON.parse(fileContent);
                const version = manifestData.version;
                console.log(`OjaiTest-getLocalVersion: 本地版本号 ${version}`);
                return version;
              }
            }

            // 如果无法获取本地版本，返回默认版本
            console.log('OjaiTest-getLocalVersion: 无法获取版本号，返回默认版本');
            return '1.0.0';
          } catch (error) {
            console.error('OjaiTest-getLocalVersion: 获取本地版本号失败', error);
            return '1.0.0';
          }
        }

        /**
         * 示例：如何使用getVersion方法
         * 可以在需要获取当前版本号的地方调用这个方法
         */
        logCurrentVersion() {
          const currentVersion = this.getVersion();
          console.log(`OjaiTest-当前资源版本: ${currentVersion}`);
          if (currentVersion) {
            // 可以将版本号保存到本地存储中
            sys.localStorage.setItem(HOT_UPDATE_VERSION, currentVersion);
          }
        }
      }, _descriptor = _applyDecoratedDescriptor(_class3.prototype, "localManifest", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class3)) || _class2));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/game.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BasePage.ts', './GlassCupMgr.ts', './Order.ts', './DataEnums.ts', './PageMgr.ts', './Customer.ts', './account.ts', './AudioMgr.ts', './GameDataMgr.ts', './barSortBridge.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Prefab, Node, Label, _decorator, director, instantiate, Vec3, UITransform, tween, BasePage, GlassCupMgr, Order, EventID, PageMgr, UIPage, UIPAGE_TYPE, Customer, account, AudioMgr, AUDIO_NAME, GameDataMgr, barSortBridge, Vibration;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Prefab = module.Prefab;
      Node = module.Node;
      Label = module.Label;
      _decorator = module._decorator;
      director = module.director;
      instantiate = module.instantiate;
      Vec3 = module.Vec3;
      UITransform = module.UITransform;
      tween = module.tween;
    }, function (module) {
      BasePage = module.BasePage;
    }, function (module) {
      GlassCupMgr = module.GlassCupMgr;
    }, function (module) {
      Order = module.Order;
    }, function (module) {
      EventID = module.EventID;
    }, function (module) {
      PageMgr = module.PageMgr;
      UIPage = module.UIPage;
      UIPAGE_TYPE = module.UIPAGE_TYPE;
    }, function (module) {
      Customer = module.Customer;
    }, function (module) {
      account = module.account;
    }, function (module) {
      AudioMgr = module.AudioMgr;
      AUDIO_NAME = module.AUDIO_NAME;
    }, function (module) {
      GameDataMgr = module.GameDataMgr;
    }, function (module) {
      barSortBridge = module.barSortBridge;
      Vibration = module.Vibration;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11;
      cclegacy._RF.push({}, "82f207lpMtIrb3oMLq1pJTr", "game", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let game = exports('game', (_dec = ccclass('game'), _dec2 = property(Prefab), _dec3 = property(Prefab), _dec4 = property(GlassCupMgr), _dec5 = property(Node), _dec6 = property(Node), _dec7 = property(account), _dec8 = property(Node), _dec9 = property(Node), _dec10 = property(Node), _dec11 = property(Node), _dec12 = property(Label), _dec(_class = (_class2 = class game extends BasePage {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "costomer", _descriptor, this);
          _initializerDefineProperty(this, "order", _descriptor2, this);
          _initializerDefineProperty(this, "cupMgr", _descriptor3, this);
          _initializerDefineProperty(this, "customerList", _descriptor4, this);
          _initializerDefineProperty(this, "orderListNode", _descriptor5, this);
          _initializerDefineProperty(this, "accountNode", _descriptor6, this);
          _initializerDefineProperty(this, "layoutItem", _descriptor7, this);
          _initializerDefineProperty(this, "magicToolNum", _descriptor8, this);
          _initializerDefineProperty(this, "undoToolNum", _descriptor9, this);
          _initializerDefineProperty(this, "addToolNum", _descriptor10, this);
          _initializerDefineProperty(this, "level", _descriptor11, this);
          this.orderTimeArr = [90, 135, 180, 180];
          this.orderList = [];
          this.colorMap = {};
          this.customerListArr = [0, 1, 2, 3];
          this.tempArr = [];
          this.currentFinishDrink = [];
          this.SPLIT_COUNT = 4;
        }
        onLoad() {
          director.on(EventID.ORDER_TIME_OUT, this.showLoseResultView, this);
          director.on(EventID.POURONEFINISHED, this.givedrinkToCustomer, this);
          director.on(EventID.UPDATE_TOOL, this.refreshAllTool, this);
          director.on(EventID.START_GAME, this.startOrderCountdown, this);
          director.on(EventID.STOP_COUNTDOWN, this.stopOrderCountdown, this);
        }
        start() {
          let config = this.cupMgr.stageConfig;
          this.colorMap = this.getColorMap(config);

          // this.addOneCustomer();
          this.initCustomer();
          this.initOrder();
        }
        onEnable() {
          this.refreshAllTool();
          this.level.string = GameDataMgr.instance.data.level.toString();
        }
        initCustomer() {
          for (let i = 0; i < this.customerList.children.length; i++) {
            let item = this.customerList.children[i];
            if (item.children.length == 0) {
              let node = instantiate(this.costomer);
              node.parent = item;
              node.setPosition(new Vec3(0, 0, 0));
              let index = Math.floor(Math.random() * this.customerListArr.length);
              let customerId = this.customerListArr.splice(index, 1)[0];
              node.getComponent(Customer).initCustomer(customerId, i);
              node.getComponent(Customer).showCoinTip();
              node.getComponent(Customer).showCustomerIdle();
            }
          }
        }
        initOrder() {
          for (let i = 0; i < this.orderListNode.children.length; i++) {
            let item = this.orderListNode.children[i];
            let node = item.children[0];
            if (item.children.length == 0) {
              node = instantiate(this.order);
              node.setPosition(new Vec3(0, 0, 0));
              node.parent = item;
            }
            let order = node.getComponent(Order);
            let orderId = Number(this.getOrderId(true));
            order.setOrder(orderId, this.orderTimeArr[i], i);
            order.countdownState = false;
            this.orderList.push(order);
          }
        }
        removeOneOrder(index) {
          for (let i = 0; i < this.orderList.length; i++) {
            if (this.orderList[i].orderPosId == index) {
              let order = this.orderList.splice(i, 1);
              order[0].stopOrderCountdown();
              break;
            }
          }
          this.orderListNode.children[index].removeAllChildren();
        }
        addOneOrder(index) {
          let nextOrder = Number(this.getOrderId(true));
          if (nextOrder == undefined || nextOrder == 0) {
            return;
          }
          let item = this.orderListNode.children[index];
          if (item.children.length == 0) {
            let node = instantiate(this.order);
            node.setPosition(new Vec3(0, 0, 0));
            node.parent = item;
            let order = node.getComponent(Order);
            order.setOrder(nextOrder, this.orderTimeArr[3], index);
            order.countdownState = true;
            this.orderList.splice(index, 0, order);
          }
        }
        addOneCustomer() {
          return new Promise((resolve, reject) => {
            for (let i = 0; i < this.customerList.children.length; i++) {
              let item = this.customerList.children[i];
              let nextOrder = Number(this.getOrderId(false));
              if (nextOrder == undefined || nextOrder == 0) {
                break;
              }
              if (item.children.length == 0) {
                let node = instantiate(this.costomer);
                let pos = item.parent.getComponent(UITransform).convertToWorldSpaceAR(item.position);
                let targetpos = pos.x + node.getComponent(UITransform).width;
                node.setPosition(new Vec3(-targetpos, 0, 0));
                node.parent = item;
                let index = Math.floor(Math.random() * this.customerListArr.length);
                let customerId = this.customerListArr.splice(index, 1)[0];
                if (!customerId && customerId != 0) {
                  index = Math.floor(Math.random() * this.tempArr.length);
                  customerId = this.tempArr.splice(index, 1)[0];
                }
                node.getComponent(Customer).initCustomer(customerId, i);
                tween(node).delay(1).to(1, {
                  position: new Vec3(0, 0, 0)
                }).call(() => {
                  node.getComponent(Customer).showCustomerIdle();
                  this.scheduleOnce(() => {
                    this.givedrinkToCustomer(this.currentFinishDrink);
                  });
                  resolve();
                }).start();
                break;
              }
            }
          });
        }
        removeCustomer(index) {
          let item = this.customerList.children[index];
          if (item.children.length != 0) {
            let node = item.children[0];
            this.removeOneOrder(index);
            node.getComponent(Customer).hideCoinTip();
            this.accountNode.addToken(50);
            AudioMgr.instance.playEffect(AUDIO_NAME.collect_order);
            let removeId = node.getComponent(Customer).cusromerId;
            this.tempArr.push(removeId);
            node.getComponent(Customer).customerLeft().then(() => {
              item.removeAllChildren();
              this.addOneCustomer().then(() => {
                this.customerListArr.concat(this.tempArr);
                node.getComponent(Customer).showCoinTip();
                this.addOneOrder(index);
              });
            });
          }
        }
        givedrinkToCustomer(cups) {
          if (cups.length == 0) {
            return;
          }
          this.currentFinishDrink = cups.filter(item => item.finishedOrder == false && item.getTop().topColorId != 0 && item.getTop().topColorId != -1);
          let minTimeOrder = null;
          let finishCup = null;
          for (let i = 0; i < this.currentFinishDrink.length; i++) {
            let cup = this.currentFinishDrink[i];
            let topdata = cup.getTop();
            for (let j = 0; j < this.orderList.length; j++) {
              if (topdata.topColorId == this.orderList[j].orderId && this.orderList[j].isFinished == false) {
                if (!minTimeOrder) {
                  minTimeOrder = this.orderList[j];
                  finishCup = cup;
                }
                let order = this.orderList[j];
                if (order != minTimeOrder && order.orderTime < minTimeOrder.orderTime) {
                  minTimeOrder = order;
                  finishCup = cup;
                }
                // this.removeCustomer(minTimeOrder.orderPosId);
              }
            }
          }

          if (minTimeOrder && finishCup) {
            finishCup.finishedOrder = true;
            minTimeOrder.isFinished = true;
            let canvas = director.getScene().getChildByName("Canvas");
            let aniRoot = canvas.getChildByName("aniRoot");
            let currentWorldPos = finishCup.node.worldPosition;
            let targetLocalPos = aniRoot.getComponent(UITransform).convertToNodeSpaceAR(currentWorldPos);
            finishCup.node.setPosition(targetLocalPos);
            finishCup.node.parent = aniRoot;
            let targetPos = this.orderListNode.children[minTimeOrder.orderPosId].worldPosition;
            let pos = aniRoot.getComponent(UITransform).convertToNodeSpaceAR(targetPos);
            tween(finishCup.node).delay(0.5).to(1, {
              position: pos,
              scale: new Vec3(0.5, 0.5, 0.5)
            }).call(() => {
              finishCup.node.removeFromParent();
              this.removeCustomer(minTimeOrder.orderPosId);
            }).start();
          }
        }
        getOrderId(isDelData) {
          let colorArr = Object.keys(this.colorMap);
          if (colorArr.length == 0) {
            return 0;
          }
          const randomKey = Math.floor(Math.random() * colorArr.length);
          if (isDelData) {
            this.colorMap[colorArr[randomKey]] -= this.SPLIT_COUNT;
            if (this.colorMap[colorArr[randomKey]] == 0) {
              delete this.colorMap[colorArr[randomKey]];
            }
          }
          return colorArr[randomKey];
        }
        startOrderCountdown() {
          for (let i = 0; i < this.orderList.length; i++) {
            this.orderList[i].countdownState = true;
          }
        }
        stopOrderCountdown() {
          for (let i = 0; i < this.orderList.length; i++) {
            this.orderList[i].countdownState = false;
          }
        }
        showLoseResultView() {
          for (let i = 0; i < this.orderList.length; i++) {
            this.orderList[i].stopOrderCountdown();
          }
          PageMgr.openPage(UIPage.ResultView, UIPAGE_TYPE.PAGE, {
            iswin: false
          });
          this.unscheduleAllCallbacks();
        }
        getColorMap(config) {
          let colorIds = config.colorIds;
          let colorMap = {};
          for (let i = 0; i < colorIds.length; i++) {
            let colorArr = colorIds[i];
            for (let j = 0; j < colorArr.length; j++) {
              if (colorArr[j] == 0 || colorArr[j] == -1) {
                continue;
              } else if (colorMap[colorArr[j]]) {
                colorMap[colorArr[j]] += 1;
              } else {
                colorMap[colorArr[j]] = 1;
              }
            }
          }
          return colorMap;
        }
        backToHome() {
          AudioMgr.instance.playEffect(AUDIO_NAME.btn_click);
          barSortBridge.vibrate(30, Vibration.LIGHT);
          PageMgr.closePage(UIPage.Game);
          PageMgr.openPage(UIPage.HomeView);
        }
        restartGame() {
          AudioMgr.instance.playEffect(AUDIO_NAME.btn_click);
          barSortBridge.vibrate(30, Vibration.LIGHT);
          this.cupMgr.nextLevel();
          let config = this.cupMgr.stageConfig;
          this.colorMap = this.getColorMap(config);
          this.orderList = [];
          this.customerListArr = [0, 1, 2, 3];
          this.initCustomer();
          this.initOrder();
          this.cupMgr.isAddCupInGame = false;
        }
        onClickUndo() {
          PageMgr.openPage(UIPage.Toast, UIPAGE_TYPE.ALERT, "This item will be opened in the future");
          barSortBridge.vibrate(30, Vibration.LIGHT);
        }
        onClickMagic() {
          PageMgr.openPage(UIPage.Toast, UIPAGE_TYPE.ALERT, "This item will be opened in the future");
          barSortBridge.vibrate(30, Vibration.LIGHT);
        }
        onClickAddCup() {
          let gdMgrData = GameDataMgr.instance.data;
          if (gdMgrData.toolAddCup <= 0) {
            PageMgr.openPage(UIPage.GetAwardView, UIPAGE_TYPE.PAGE, {
              page: 2,
              getValue: 1,
              toolType: 2
            });
            return;
          }
          let isSuccess = this.cupMgr.addOneCup();
          barSortBridge.vibrate(30, Vibration.LIGHT);
          if (isSuccess) {
            this.refreshAddCupNum();
          }
        }
        refreshAllTool() {
          this.refreshAddCupNum();
          this.refreshMagicNum();
          this.refreshUndoNum();
        }
        refreshAddCupNum() {
          let gdMgrData = GameDataMgr.instance.data;
          let val = gdMgrData.toolAddCup;
          if (val == 0) {
            this.addToolNum.getChildByName("num").active = false;
            this.addToolNum.getChildByName("addIcon").active = true;
          } else {
            this.addToolNum.getChildByName("num").active = true;
            this.addToolNum.getChildByName("num").getComponent(Label).string = val.toString();
            this.addToolNum.getChildByName("addIcon").active = false;
          }
        }
        refreshMagicNum() {
          let gdMgrData = GameDataMgr.instance.data;
          let val = gdMgrData.toolMagicNum;
          if (val == 0) {
            this.magicToolNum.getChildByName("num").active = false;
            this.magicToolNum.getChildByName("addIcon").active = true;
          } else {
            this.magicToolNum.getChildByName("num").active = true;
            this.magicToolNum.getChildByName("num").getComponent(Label).string = val.toString();
            this.magicToolNum.getChildByName("addIcon").active = false;
          }
        }
        refreshUndoNum() {
          let gdMgrData = GameDataMgr.instance.data;
          let val = gdMgrData.toolUndoNum;
          if (val == 0) {
            this.undoToolNum.getChildByName("num").active = false;
            this.undoToolNum.getChildByName("addIcon").active = true;
          } else {
            this.undoToolNum.getChildByName("num").active = true;
            this.undoToolNum.getChildByName("num").getComponent(Label).string = val.toString();
            this.undoToolNum.getChildByName("addIcon").active = false;
          }
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "costomer", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "order", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "cupMgr", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "customerList", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "orderListNode", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "accountNode", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "layoutItem", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "magicToolNum", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "undoToolNum", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "addToolNum", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "level", [_dec12], {
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

System.register("chunks:///_virtual/GameDataMgr.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './StorageMgr.ts', './LogMgr.ts', './ObjectUtility.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, sys, StorageMgr, LogMgr, ObjectUtility, ClassType, MapType, ArrayType;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      sys = module.sys;
    }, function (module) {
      StorageMgr = module.StorageMgr;
    }, function (module) {
      LogMgr = module.LogMgr;
    }, function (module) {
      ObjectUtility = module.ObjectUtility;
      ClassType = module.ClassType;
      MapType = module.MapType;
      ArrayType = module.ArrayType;
    }],
    execute: function () {
      var _dec, _class6, _descriptor, _dec2, _class8, _descriptor2, _dec3, _class10, _descriptor3, _dec4, _dec5, _dec6, _dec7, _dec8, _class15, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8;
      cclegacy._RF.push({}, "3c9cbwlY6VNJpq8DeeD3xBY", "GameDataMgr", undefined);
      class GameData {
        constructor() {
          this.level = 1;
          this.version = 0;
          this.coin = 0;
          this.isPlayStory = false;
          this.maxBgNum = 10;
          this.curSelectedBg = 1;
          this.unlockBg = [1];
          this.canAwardBank = false;
          this.collectCup = [0];
          this.curCollect = new curCollect();
          this.collect_reward_flag = [0, 0, 0];
          this.toolMagicNum = 0;
          this.toolUndoNum = 0;
          this.toolAddCup = 3;
        }
      }
      class PlayerData {
        constructor() {
          this.sid = '';
          this.inviteCode = '';
          // abandon
          this.major = 0;
          this.minor = 0;
        }
      }
      class SettingConfig {
        constructor() {
          this.effect = true;
          this.music = true;
          this.vibration = true;
        }
      }
      class curCollect {
        constructor() {
          this.collectId = 0;
          this.collectProgress = 0;
          this.targetProgress = 3;
        }
      }
      class SelectFrequencyConfig {
        constructor() {
          this.frequency = 5;
          this.show_num = 4;
        }
      }
      exports('SelectFrequencyConfig', SelectFrequencyConfig);
      let SgSelectInfo = exports('SgSelectInfo', (_dec = ClassType(SelectFrequencyConfig), (_class6 = class SgSelectInfo {
        constructor() {
          this.refresh_time = 4;
          this.special_num = 1;
          _initializerDefineProperty(this, "special_frequency", _descriptor, this);
        }
      }, _descriptor = _applyDecoratedDescriptor(_class6.prototype, "special_frequency", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new SelectFrequencyConfig();
        }
      }), _class6)));
      let SgConfig = exports('SgConfig', (_dec2 = ClassType(SgSelectInfo), (_class8 = class SgConfig {
        constructor() {
          this.is_sg = false;
          this.illustration_cost = 5;
          this.album_cost = 10;
          this.preload_time = 20;
          this.unselected_size = 50;
          _initializerDefineProperty(this, "select", _descriptor2, this);
          this.unshow_limit = 10;
        }
      }, _descriptor2 = _applyDecoratedDescriptor(_class8.prototype, "select", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new SgSelectInfo();
        }
      }), _class8)));

      // main config
      let MainConfig = (_dec3 = ClassType(SgConfig), (_class10 = class MainConfig {
        constructor() {
          this.collect_level = [[0, 10, 3], [10, 20, 5], [20, -1, 10]];
          this.collect_reward = [3, 6, 10];
          this.no_sg_version = [];
          this.no_web_version = [];
          _initializerDefineProperty(this, "sg", _descriptor3, this);
        }
      }, _descriptor3 = _applyDecoratedDescriptor(_class10.prototype, "sg", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new SgConfig();
        }
      }), _class10)); // sg
      class PictureData {
        constructor() {
          this.isLocked = true;
          // 是否锁定
          this.isCached = false;
          // 是否缓存
          this.isShowed = false;
          // 被展示过
          this.isSelected = false;
          // 被选中
          this.isOwned = false;
          // 是否拥有
          this.isFavorite = false;
          this.isBg = false;
        }
        resetData() {
          this.isLocked = true;
          this.isShowed = false;
          this.isSelected = false;
          this.isFavorite = false;
          this.isBg = false;
        }
      }
      exports('PictureData', PictureData);
      class PictureInfo {
        constructor(tag, id, url_A, url_B, url_A_s, url_B_s, url_A_t, isAd) {
          this.tag = '';
          this.id = '';
          this.url_A = '';
          this.url_B = '';
          this.url_A_s = '';
          this.url_B_s = '';
          this.url_A_t = '';
          this.isAd = false;
          this.tag = tag;
          this.id = id;
          this.url_A = url_A;
          this.url_B = url_B;
          this.url_A_s = url_A_s;
          this.url_B_s = url_B_s;
          this.url_A_t = url_A_t;
          this.isAd = isAd;
        }
      }
      exports('PictureInfo', PictureInfo);
      let SgState = exports('SgState', /*#__PURE__*/function (SgState) {
        SgState[SgState["Unready"] = 0] = "Unready";
        SgState[SgState["Ready"] = 1] = "Ready";
        SgState[SgState["Started"] = 2] = "Started";
        return SgState;
      }({}));
      class AlbumData {
        constructor() {
          this.pictures = {};
        }
      }
      exports('AlbumData', AlbumData);
      let SgData = exports('SgData', (_dec4 = MapType(String, PictureData), _dec5 = ArrayType(PictureInfo), _dec6 = ArrayType(PictureInfo), _dec7 = ArrayType(PictureInfo), _dec8 = MapType(String, AlbumData), (_class15 = class SgData {
        constructor() {
          _initializerDefineProperty(this, "illustration", _descriptor4, this);
          _initializerDefineProperty(this, "unselectedSpecialPicInfoList", _descriptor5, this);
          _initializerDefineProperty(this, "unselectedNormalPicInfoList", _descriptor6, this);
          _initializerDefineProperty(this, "selectedPicInfoList", _descriptor7, this);
          _initializerDefineProperty(this, "album", _descriptor8, this);
          this.selectFreqCount = 0;
          this.isPlayPlots = false;
          this.state = SgState.Unready;
        }
      }, (_descriptor4 = _applyDecoratedDescriptor(_class15.prototype, "illustration", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return {};
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class15.prototype, "unselectedSpecialPicInfoList", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class15.prototype, "unselectedNormalPicInfoList", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class15.prototype, "selectedPicInfoList", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class15.prototype, "album", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return {};
        }
      })), _class15)));
      class LocalData {
        constructor() {
          this.lastRFlag = false;
          this.isFirstLaunch = true;
          this.isFirstLoading = true;
        }
      }
      class BaseData {
        constructor() {
          this.stable_versions = ["1.0.0"];
        }
      }
      class GameDataMgr {
        constructor() {
          this.data = new GameData();
          this.settingConfig = new SettingConfig();
          this.mainConfig = new MainConfig();
          this._localData = new LocalData();
          this._baseData = new BaseData();
          this.sg = new SgData();
          this._gameData = new GameData();
          this._playerData = new PlayerData();
        }
        static get instance() {
          if (this._instance == null) {
            this._instance = new GameDataMgr();
          }
          return this._instance;
        }
        get playerData() {
          return this._playerData;
        }
        get baseData() {
          return this._baseData;
        }
        get localData() {
          return this._localData;
        }
        setPlayerInviteCode(code) {
          this.playerData.inviteCode = code;
        }
        initDataFromServer(gameData, playerData) {
          LogMgr.log('GameDataManager initData', gameData);
          if (!gameData || !playerData) {
            LogMgr.log('GameDataManager initData gameData or playerData is null');
            return;
          }
          try {
            if (!gameData['version']) {
              gameData['version'] = 0;
            }
            if (gameData['version'] >= this._gameData.version) {
              this._gameData = ObjectUtility.fromPlainObject(GameData, gameData);
              this.playerData.sid = playerData['sid'] || '';
            }
          } catch (error) {
            LogMgr.error('GameDataManager initData error:', error);
          }
        }
        loadDataFromLocal() {
          const data = JSON.parse(sys.localStorage.getItem("game"));
          if (!!data) {
            this.data = StorageMgr.restoreObject(GameData, data);
          }
          const settingData = JSON.parse(sys.localStorage.getItem("game_settingCfg"));
          if (!!settingData) {
            this.settingConfig = StorageMgr.restoreObject(SettingConfig, settingData);
          }
        }
        saveData() {
          StorageMgr.instance.saveDataToLocal("game", this.data);
          StorageMgr.instance.saveDataToLocal("game_settingCfg", this.settingConfig);
          StorageMgr.instance.saveDataToLocal("localData", this._localData);
        }
      }
      exports('GameDataMgr', GameDataMgr);
      GameDataMgr._instance = void 0;
      GameDataMgr.drinkMap = {
        0: "Bellini",
        1: "Bee's_Knees",
        2: "Amber Glow",
        3: "Americano",
        4: "Blue_Hawaii",
        5: "Aperol_Spritz",
        6: "Espresso_Martini",
        7: "Boulevardier",
        8: "Blue_Lagoon",
        9: "Corpse_Reviver",
        10: "French",
        11: "Campari_Orange",
        12: "Gibson",
        13: "Green_Dragon",
        14: "Green_Apple Martini",
        15: "Golden_Dream",
        16: "Daiquiri",
        17: "Hanky_Panky",
        18: "Manhattan",
        19: "Jade_Green",
        20: "Long_Island Iced Tea",
        21: "Monkey_Gland",
        22: "Midnight_Blue",
        23: "Mojito",
        24: "Margarita",
        25: "Mimosa",
        26: "Moscow_Mule",
        27: "Negroni_Sbagliato",
        28: "Negroni",
        29: "Paper_Plane",
        30: "Pina_Colada",
        31: "Old_Fashioned",
        32: "Penicillin",
        33: "Pink_Gin",
        34: "Pink_Lady",
        35: "Red_Square",
        36: "Purple_Rain",
        37: "Prosecco_Punch",
        38: "Rossini",
        39: "Satan's_Whiskers",
        40: "Ruby_Red",
        41: "Screwdriver",
        42: "Sex_on the Beach",
        43: "Sidecar",
        44: "Silver_Fizz",
        45: "Purple_Haze",
        46: "Tequila_Sunrise",
        47: "Tintoretto",
        48: "Whiskey_Sour",
        49: "Spritz_Veneziano",
        50: "White_Lady",
        51: "Pink_Panther"
      };
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/gameScene.ts", ['cc', './PageMgr.ts', './GameDataMgr.ts', './config.ts'], function (exports) {
  var cclegacy, Component, profiler, game, Game, sys, _decorator, PageMgr, UIPage, UIPAGE_TYPE, GameDataMgr, Config;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      profiler = module.profiler;
      game = module.game;
      Game = module.Game;
      sys = module.sys;
      _decorator = module._decorator;
    }, function (module) {
      PageMgr = module.PageMgr;
      UIPage = module.UIPage;
      UIPAGE_TYPE = module.UIPAGE_TYPE;
    }, function (module) {
      GameDataMgr = module.GameDataMgr;
    }, function (module) {
      Config = module.Config;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "d8624jN2KJGyK6o6uAZtxxM", "gameScene", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let gameScene = exports('gameScene', (_dec = ccclass('gameScene'), _dec(_class = class gameScene extends Component {
        onLoad() {
          profiler.hideStats();
        }
        onEnable() {
          game.on(Game.EVENT_HIDE, this.gameHideHandle, this);
          game.on(Game.EVENT_SHOW, this.gameShowHandle, this);
          let gdMgr = GameDataMgr.instance;
          if (gdMgr.data.isPlayStory == true) {
            PageMgr.openPage(UIPage.HomeView, UIPAGE_TYPE.PAGE);
          } else {
            PageMgr.openPage(UIPage.StoryView, UIPAGE_TYPE.PAGE);
          }
          if (sys.isBrowser) {
            Config.setRFlag(true);
          }
        }
        gameHideHandle() {
          GameDataMgr.instance.saveData();
        }
        gameShowHandle() {
          console.log("game Show");
        }
        update(deltaTime) {}
      }) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/getAwardView.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BasePage.ts', './GameDataMgr.ts', './DataEnums.ts', './PageMgr.ts', './AudioMgr.ts', './barSortBridge.ts', './adMgr.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, Label, SpriteFrame, Sprite, _decorator, director, BasePage, GameDataMgr, EventID, toolType, PageMgr, UIPage, AudioMgr, AUDIO_NAME, barSortBridge, Vibration, adMgr;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      Label = module.Label;
      SpriteFrame = module.SpriteFrame;
      Sprite = module.Sprite;
      _decorator = module._decorator;
      director = module.director;
    }, function (module) {
      BasePage = module.BasePage;
    }, function (module) {
      GameDataMgr = module.GameDataMgr;
    }, function (module) {
      EventID = module.EventID;
      toolType = module.toolType;
    }, function (module) {
      PageMgr = module.PageMgr;
      UIPage = module.UIPage;
    }, function (module) {
      AudioMgr = module.AudioMgr;
      AUDIO_NAME = module.AUDIO_NAME;
    }, function (module) {
      barSortBridge = module.barSortBridge;
      Vibration = module.Vibration;
    }, function (module) {
      adMgr = module.adMgr;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8;
      cclegacy._RF.push({}, "ab918MF/61CtpiueAjPVVCC", "getAwardView", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let getAwardView = exports('getAwardView', (_dec = ccclass('getAwardView'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Label), _dec5 = property({
        type: [SpriteFrame]
      }), _dec6 = property(Label), _dec7 = property(Label), _dec8 = property(Label), _dec9 = property(Sprite), _dec(_class = (_class2 = class getAwardView extends BasePage {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "layout1", _descriptor, this);
          _initializerDefineProperty(this, "layout2", _descriptor2, this);
          _initializerDefineProperty(this, "coinNumNode", _descriptor3, this);
          _initializerDefineProperty(this, "toolSprList", _descriptor4, this);
          _initializerDefineProperty(this, "getNum", _descriptor5, this);
          _initializerDefineProperty(this, "lbltitle", _descriptor6, this);
          _initializerDefineProperty(this, "desc", _descriptor7, this);
          _initializerDefineProperty(this, "tool", _descriptor8, this);
          this.descArr = ["Mysterious power, penetrate the obstruction to see the obscured colors", "Reverse time and roll back your last operation", "Add a water cup to help you pass the level"];
          this.titleArr = ["Magic", "Back", "Add"];
          this.getValue = 0;
          this.toolType = -1;
        }
        initData(data) {
          if (data.page == 1) {
            this.layout1.active = true;
            this.layout2.active = false;
            AudioMgr.instance.playEffect(AUDIO_NAME.show_page);
            barSortBridge.vibrate(30, Vibration.NORMAL);
            this.getValue = data.getValue;
            this.coinNumNode.string = "x" + this.getValue;
          } else {
            this.layout1.active = false;
            this.layout2.active = true;
            this.toolType = data.toolType;
            this.getValue = data.getValue;
            this.getNum.string = "x" + data.getValue;
            this.tool.spriteFrame = this.toolSprList[data.toolType];
            this.lbltitle.string = this.titleArr[data.toolType];
          }
        }
        onEnable() {
          director.emit(EventID.STOP_COUNTDOWN);
        }
        onDisable() {
          director.emit(EventID.START_GAME);
        }
        clickToolBtn() {
          AudioMgr.instance.playEffect(AUDIO_NAME.btn_click);
          barSortBridge.vibrate(30, Vibration.LIGHT);
          adMgr.instance.openVideoAd("tool", (entry, success) => {
            if (success) {
              this.getToolReward();
            }
          });
        }
        getToolReward() {
          let gdMgrData = GameDataMgr.instance.data;
          switch (this.toolType) {
            case toolType.magic:
              {
                gdMgrData.toolMagicNum += this.getValue;
                director.emit(EventID.UPDATE_TOOL);
              }
              break;
            case toolType.back:
              {
                gdMgrData.toolUndoNum += this.getValue;
                director.emit(EventID.UPDATE_TOOL);
              }
              break;
            case toolType.add:
              {
                gdMgrData.toolAddCup += this.getValue;
                director.emit(EventID.UPDATE_TOOL);
              }
              break;
          }
          PageMgr.closePage(UIPage.GetAwardView);
        }
        clickBtnDouble() {
          AudioMgr.instance.playEffect(AUDIO_NAME.btn_click);
          barSortBridge.vibrate(30, Vibration.LIGHT);
          adMgr.instance.openVideoAd("getReward", (entry, success) => {
            if (success) {
              this.getAward(true);
              PageMgr.closePage(UIPage.GetAwardView);
            }
          });
        }
        clickBtnSingle() {
          AudioMgr.instance.playEffect(AUDIO_NAME.btn_click);
          barSortBridge.vibrate(30, Vibration.LIGHT);
          this.getAward(false);
          PageMgr.closePage(UIPage.GetAwardView);
        }
        getAward(isAd) {
          let multiple = isAd ? 2 : 1;
          let gdMgr = GameDataMgr.instance;
          gdMgr.data.coin += this.getValue * multiple;
          gdMgr.data.canAwardBank = false;
          gdMgr.saveData();
          director.emit(EventID.UPDATE_ACCOUNT);
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "layout1", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "layout2", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "coinNumNode", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "toolSprList", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "getNum", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "lbltitle", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "desc", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "tool", [_dec9], {
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

System.register("chunks:///_virtual/GlassCup.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './water.ts', './waterFlow.ts', './ResMgr.ts', './AudioMgr.ts', './barSortBridge.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, Sprite, _decorator, Component, v3, Layers, UITransform, Color, tween, v2, Widget, ParticleSystem2D, SpriteFrame, Vec3, Water, WaterFlow, ResMgr, AudioMgr, AUDIO_NAME, barSortBridge, Vibration;
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
      v3 = module.v3;
      Layers = module.Layers;
      UITransform = module.UITransform;
      Color = module.Color;
      tween = module.tween;
      v2 = module.v2;
      Widget = module.Widget;
      ParticleSystem2D = module.ParticleSystem2D;
      SpriteFrame = module.SpriteFrame;
      Vec3 = module.Vec3;
    }, function (module) {
      Water = module.default;
    }, function (module) {
      WaterFlow = module.WaterFlow;
    }, function (module) {
      ResMgr = module.ResMgr;
    }, function (module) {
      AudioMgr = module.AudioMgr;
      AUDIO_NAME = module.AUDIO_NAME;
    }, function (module) {
      barSortBridge = module.barSortBridge;
      Vibration = module.Vibration;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5;
      cclegacy._RF.push({}, "4b716BY9ZtDaY8iJvi36yVW", "GlassCup", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let WaterColors = exports('WaterColors', ["", "#FF6A00", "#008CFF", "#C12FEE", "#008524", "#E01F86", "#FF8585", "#5F188B", "#E00000", "#003DDA", "#18B79F", "#61D000", "#FFCC00"]);

      /**高度乘数因子，满杯水只显示80% */
      const HEIGHT_FACTOR = 0.8;

      /**一杯水，分成四组四个颜色，0表示没有水 */

      const SPLIT_COUNT = 4;
      let GlassCup = exports('default', (_dec = property(Water), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property(Sprite), ccclass(_class = (_class2 = class GlassCup extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "water", _descriptor, this);
          _initializerDefineProperty(this, "shadow", _descriptor2, this);
          _initializerDefineProperty(this, "completeEffect", _descriptor3, this);
          _initializerDefineProperty(this, "iconAd", _descriptor4, this);
          _initializerDefineProperty(this, "completeItem", _descriptor5, this);
          this._flow = null;
          this.cupId = 0;
          this.finishedOrder = false;
          this.orignPt = v3();
          this.state = 0;
          this.onClick = null;
          this.info = null;
          this.tween = null;
        }
        // 0: none 1: pouring in
        // isLock:boolean = false;
        get isLock() {
          return this.info.colorIds[this.cupId].includes(-1);
        }
        set isLock(isLock) {
          if (isLock == true) ;else {
            this.info.colorIds[this.cupId] = [0, 0, 0, 0];
            this.iconAd.active = false;
          }
        }
        getFlow() {
          if (this._flow) {
            return this._flow;
          }
          let _node = new Node("water_flow");
          _node.layer = Layers.Enum.UI_2D;
          _node.addComponent(UITransform);
          this._flow = _node.addComponent(WaterFlow);
          return this._flow;
        }
        onBtn_click() {
          if (this.isPouring()) {
            return;
          }
          if (this.onClick) {
            this.onClick(this);
          }
        }
        isPouring() {
          return Math.abs(this.node.angle) > 1.0;
        }
        initWater() {
          const info = this.info;
          let arr = [];
          let top = this.getTop();
          let index = this.info.colorIds[this.cupId].indexOf(top.topColorId);
          if (index != -1 && this.info.question[this.cupId][index] == 1) {
            this.info.question[this.cupId][index] = 0;
          }
          for (let i = SPLIT_COUNT - 1; i >= 0; i--) {
            let colorId = info.colorIds[this.cupId][i];
            let questId = 0;
            if (info.question[this.cupId]) {
              questId = info.question[this.cupId][i];
            }
            if (colorId == 0 || colorId == undefined || colorId == -1) {
              continue;
            }
            let lastObj = arr[arr.length - 1];
            if (!lastObj || lastObj != colorId || questId == 1) {
              let quest = questId == 1 ? true : false;
              arr.push({
                height: 1 / SPLIT_COUNT,
                colorId: colorId,
                isQuestion: quest
              });
            } else {
              lastObj.height += 1 / SPLIT_COUNT;
            }
          }
          arr.forEach(function (obj) {
            let hex = WaterColors[obj.colorId] || "#538849";
            if (obj.isQuestion) {
              hex = "#000000";
            }
            // log("obj.colorId",obj.colorId,"color",hex)
            obj.color = new Color().fromHEX(hex);
            obj.height *= HEIGHT_FACTOR;
          });
          this.water.initInfos(arr);
        }
        setCupInfo(cupId, info, onClick) {
          this.cupId = cupId;
          this.info = info;
          this.onClick = onClick;
          this.initWater();
          this.reset();
          if (this.isLock == true) {
            this.iconAd.active = true;
            this.state = -1;
          } else {
            this.iconAd.active = false;
            this.state = 0;
          }
        }
        update() {
          if (this.water.skewAngle == this.node.angle) {
            return;
          }
          this.water.skewAngle = this.node.angle;
        }
        setPourOutCallback(pourStart, pourEnd) {
          const _onStart = function () {
            if (pourStart) {
              pourStart(this);
            }
          };
          const _onFinish = function () {
            if (this.tween) {
              this.tween.stop();
              this.tween = null;
            }
            if (pourEnd) {
              pourEnd(this);
            }
          };
          this.water.setPourOutCallback(_onStart.bind(this), _onFinish.bind(this));
        }
        setPourInCallback(onFinish) {
          const _onFinish = function () {
            let isFinished = this.checkIsFinshed();
            // log("-----------isFinished",isFinished)
            if (onFinish) {
              onFinish(this, isFinished);
            }
          };
          this.water.setPourInCallback(_onFinish.bind(this));
        }

        /**是否完成了（同颜色填满整个杯子） */
        checkIsFinshed() {
          let isFinished = true;
          let colorIds = this.info.colorIds[this.cupId];
          let tmpId = null;
          let empTyNum = 0;
          for (let i = 0; i < SPLIT_COUNT; i++) {
            if (tmpId == null) {
              tmpId = colorIds[i];
            }
            if (tmpId != colorIds[i]) {
              isFinished = false;
              break;
            } else {
              empTyNum++;
            }
          }
          if (empTyNum == SPLIT_COUNT) {
            isFinished = true;
          }
          return isFinished;
        }
        /**
         * 移动到目标点、旋转瓶子并倒水
         * @param isRight 倾斜角度，向左为正，右为负
         * @param onPourStart 水开始从瓶口流出来
         * @param onPourEnd 本次水倒完了
         */
        moveToPour(dstPt, isRight, onPourStart, onPourEnd, pourNum) {
          this.setPourOutCallback(onPourStart, onPourEnd);
          let startAngle = this.water.getPourStartAngle();
          let endAngle = this.water.getPourEndAngle();
          this.water.onStartPour(pourNum);
          if (isRight) {
            startAngle *= -1;
            endAngle *= -1;
          }
          let moveDur = 0.25;
          let pourDur = 0.4;
          let dstX = dstPt.x;
          if (isRight) {
            dstX += -60;
          } else {
            dstX += 60;
          }
          this.tween = tween(this.node).set({
            angle: 0
          }).to(moveDur, {
            position: v3(dstX, dstPt.y),
            angle: startAngle
          }).to(pourDur, {
            angle: endAngle
          }).call(() => {
            this.tween = null;
          }).start();
          let top = this.getTop();
          let replaceNum = 0;
          let colorIds = this.info.colorIds[this.cupId];
          for (let i = 0; i < SPLIT_COUNT; i++) {
            let _id = colorIds[i];
            if (_id == 0) {
              continue;
            } else if (top.topColorId == _id) {
              //same color water has been removed
              colorIds[i] = 0;
              replaceNum++;
              if (replaceNum == pourNum) {
                break;
              }
            } else {
              break;
            }
          }
        }
        startAddWater(colorId, num, onComplete) {
          this.setPourInCallback(onComplete);
          let acc = 0;
          for (let i = SPLIT_COUNT - 1; i >= 0; i--) {
            if (this.info.colorIds[this.cupId][i] != 0) {
              continue;
            }
            this.info.colorIds[this.cupId][i] = colorId;
            if (++acc == num) {
              break;
            }
          }
          let hex = WaterColors[colorId] || "#538849";
          this.water.addInfo({
            colorId: colorId,
            height: num / SPLIT_COUNT * HEIGHT_FACTOR,
            color: new Color().fromHEX(hex),
            isQuestion: false
          });

          // AudioUtil.playPourWaterEffect(num/SPLIT_COUNT);
        }

        /**加水立刻 */
        addWaterImmediately(colorId, num) {
          let acc = 0;
          for (let i = SPLIT_COUNT - 1; i >= 0; i--) {
            if (this.info.colorIds[this.cupId][i] != 0) {
              continue;
            }
            this.info.colorIds[this.cupId][i] = colorId;
            if (++acc == num) {
              break;
            }
          }
          this.initWater();
        }

        /**将顶部的颜色删除num个 */
        removeTopWaterImmediately(num) {
          let acc = 0;
          let top = this.getTop();
          let colorIds = this.info.colorIds[this.cupId];
          for (let i = 0; i < SPLIT_COUNT; i++) {
            let _id = colorIds[i];
            if (_id == 0) {
              continue;
            } else if (top.topColorId == _id) {
              colorIds[i] = 0;
              if (++acc >= num) {
                break;
              }
            } else {
              break;
            }
          }
          this.initWater();
          return top;
        }
        getTop() {
          let colorIds = this.info.colorIds[this.cupId];
          let emptyNum = 0;
          let topColorId = 0;
          let topColorNum = 0;
          for (let i = 0; i < SPLIT_COUNT; i++) {
            if (colorIds[i] == 0) {
              emptyNum++;
              continue;
            }
            if (topColorId == 0 || topColorId == colorIds[i]) {
              topColorId = colorIds[i];
              topColorNum++;
            } else {
              break;
            }
          }
          return {
            emptyNum: emptyNum,
            topColorId: topColorId,
            topColorNum: topColorNum,
            colorHex: WaterColors[topColorId] || "#538849"
          };
        }
        reset() {
          this.node.angle = 0;
          this.water.skewAngle = 0;
        }
        setPourAnchor(isRight) {
          let pt = v2(3, 2);
          pt.x = isRight ? this.node.getComponent(UITransform).width - pt.x : pt.x;
          pt.y = this.node.getComponent(UITransform).height - pt.y;
          pt.x = pt.x / this.node.getComponent(UITransform).width;
          pt.y = pt.y / this.node.getComponent(UITransform).height;
          this.setAnchor(pt);
        }
        setNormalAnchor() {
          this.setAnchor(v2(0.5, 0.5));
        }
        setAnchor(anchor) {
          let trans = this.node.getComponent(UITransform);
          let oldAnchor = trans.anchorPoint.clone();
          let selfPt = this.node.getPosition();
          trans.setAnchorPoint(anchor);
          let offsetAnchor = v2(anchor.x - oldAnchor.x, anchor.y - oldAnchor.y);
          let offsetPt = v2(offsetAnchor.x * trans.width, offsetAnchor.y * trans.height);
          offsetPt = rotatePt(offsetPt, this.node.angle);
          selfPt.x += offsetPt.x;
          selfPt.y += offsetPt.y;
          this.node.setPosition(selfPt);
          this.water.getComponent(Widget).updateAlignment();
        }

        /**获取当前水面的global y坐标 */
        getWaterSurfacePosY(needAdjust = false) {
          let top = this.getTop();
          let y = (SPLIT_COUNT - top.emptyNum) / SPLIT_COUNT;
          if (y < 0.02) {
            y = 0.02;
          } else if (needAdjust) {
            y -= 1.0 / SPLIT_COUNT * HEIGHT_FACTOR;
          }
          y *= HEIGHT_FACTOR;
          y -= 0.5;
          let pt = v3(0, this.water.node.getComponent(UITransform).height * y);
          pt = this.water.node.getComponent(UITransform).convertToWorldSpaceAR(pt);
          return pt.y;
        }
        showCompleteItem() {
          let itemId = this.info.colorIds[this.cupId][0];
          this.completeEffect.active = true;
          let hex = WaterColors[itemId];
          this.completeEffect.getComponent(ParticleSystem2D).startColor = new Color().fromHEX(hex);
          ResMgr.instance.loadAsset(`textures/drinkComplete/${itemId}/spriteFrame`, SpriteFrame, spriteFrame => {
            barSortBridge.vibrate(30, Vibration.LIGHT);
            this.completeItem.node.active = true;
            let originPos = this.completeItem.node.position.clone();
            let tempPos = this.completeItem.node.position.clone();
            let pos = tempPos.add(new Vec3(0, 30, 0));
            this.completeItem.node.setPosition(pos);
            tween(this.completeItem.node).to(0.1, {
              position: originPos
            }).start();
            this.completeItem.spriteFrame = spriteFrame;
            AudioMgr.instance.playEffect(AUDIO_NAME.complete_column);
          });
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "water", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "shadow", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "completeEffect", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "iconAd", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "completeItem", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));
      function rotatePt(pt, angle) {
        let radian = angle2radian(angle);
        let ret = v2();
        ret.x = pt.x * Math.cos(radian) - pt.y * Math.sin(radian);
        ret.y = pt.x * Math.sin(radian) + pt.y * Math.cos(radian);
        return ret;
      }
      function angle2radian(angle) {
        while (angle > 360) {
          angle -= 360;
        }
        while (angle < -360) {
          angle += 360;
        }
        return angle % 360 * Math.PI / 180.0;
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GlassCupMgr.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './GlassCup.ts', './env', './PageMgr.ts', './DataEnums.ts', './GameDataMgr.ts', './barSortBridge.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, JsonAsset, Prefab, _decorator, Component, Vec3, director, sys, instantiate, Layout, UITransform, v3, view, tween, log, UIOpacity, Node, Color, WaterColors, GlassCup, DEV, PageMgr, UIPage, UIPAGE_TYPE, EventID, GameDataMgr, barSortBridge, Vibration;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      JsonAsset = module.JsonAsset;
      Prefab = module.Prefab;
      _decorator = module._decorator;
      Component = module.Component;
      Vec3 = module.Vec3;
      director = module.director;
      sys = module.sys;
      instantiate = module.instantiate;
      Layout = module.Layout;
      UITransform = module.UITransform;
      v3 = module.v3;
      view = module.view;
      tween = module.tween;
      log = module.log;
      UIOpacity = module.UIOpacity;
      Node = module.Node;
      Color = module.Color;
    }, function (module) {
      WaterColors = module.WaterColors;
      GlassCup = module.default;
    }, function (module) {
      DEV = module.DEV;
    }, function (module) {
      PageMgr = module.PageMgr;
      UIPage = module.UIPage;
      UIPAGE_TYPE = module.UIPAGE_TYPE;
    }, function (module) {
      EventID = module.EventID;
    }, function (module) {
      GameDataMgr = module.GameDataMgr;
    }, function (module) {
      barSortBridge = module.barSortBridge;
      Vibration = module.Vibration;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _descriptor3;
      cclegacy._RF.push({}, "7ab7aqCaphIOZwfTBJPMdj6", "GlassCupMgr", undefined);
      const {
        ccclass,
        property,
        executeInEditMode
      } = _decorator;
      const COOKIE_LAST_CFG = "last_cfg";
      const spacesArr = {
        [1]: [0, 1],
        [2]: [80, 1],
        [3]: [50, 1],
        [4]: [40, 1],
        [5]: [50, 1],
        [6]: [50, 1],
        [7]: [40, 0.8, 150],
        [8]: [40, 0.8, 150]
      };
      let GlassCupMgr = exports('GlassCupMgr', (_dec = property(JsonAsset), _dec2 = property(Prefab), _dec3 = property({
        tooltip: DEV
      }), ccclass(_class = (_class2 = class GlassCupMgr extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "levelCfg", _descriptor, this);
          _initializerDefineProperty(this, "pfb", _descriptor2, this);
          this.curCfg = void 0;
          this.isAddCupInGame = false;
          _initializerDefineProperty(this, "_debugLevel", _descriptor3, this);
          this._cups = [];
          this.layout_v = null;
          this.selected = null;
          this._actions = [];
          this.templatePos = {
            1: {
              postion: [new Vec3(-550, 420), new Vec3(-260, 420), new Vec3(0, 420), new Vec3(260, 420), new Vec3(550, 420), new Vec3(-390, 280), new Vec3(390, 280), new Vec3(-130, 220), new Vec3(130, 220), new Vec3(-250, 50), new Vec3(0, 50), new Vec3(250, 50), new Vec3(-420, -80), new Vec3(420, -80), new Vec3(-130, -130), new Vec3(130, -130), new Vec3(-280, -350), new Vec3(0, -350), new Vec3(280, -350), new Vec3(-500, -500), new Vec3(-130, -500), new Vec3(130, -500), new Vec3(500, -500)],
              scale: 0.8
            }
          };
        }
        get stageConfig() {
          return this.curCfg;
        }
        onLoad() {
          director.on(EventID.NEXT_LEVEL, this.nextLevel, this);
          // this._level = checkint(sys.localStorage.getItem(COOKIE_LEVEL)||1);

          let str = sys.localStorage.getItem(COOKIE_LAST_CFG);
          if (str) {
            try {
              this.curCfg = JSON.parse(str);
            } catch (e) {
              this.initCfg();
            }
          } else {
            this.initCfg();
          }
          // str = sys.localStorage.getItem(COOKIE_ACTION_HISTORY);
          if (str) {
            try {
              this._actions = JSON.parse(str);
            } catch (e) {}
          }
          this.createCups();
        }
        onEnable() {
          this.moveCupToBar();
        }
        initCfg() {
          let level = GameDataMgr.instance.data.level;
          let cfgArr = this.levelCfg.json[level - 1];
          if (cfgArr) {
            let str = JSON.stringify(cfgArr);
            this.curCfg = JSON.parse(str);
          } else {
            let len = this.levelCfg.json.length;
            let str = JSON.stringify(this.levelCfg.json[level - len - 1]);
            this.curCfg = this.randomColor(str);
          }
        }
        randomColor(str) {
          let data = JSON.parse(str);
          let colorIds = data.colorIds;
          let colorMap = {};
          let numArr = Array.from({
            length: WaterColors.length
          }, (_, index) => index);
          for (let i = 0; i < colorIds.length; i++) {
            let colorArr = colorIds[i];
            for (let j = 0; j < colorArr.length; j++) {
              if (colorMap[colorArr[j]] || colorArr[j] == 0) {
                continue;
              } else {
                let index = Math.floor(Math.random() * numArr.length);
                colorMap[colorArr[j]] = numArr.splice(index, 1)[0];
              }
            }
          }
          let newColorIds = this.replaceColorIds(colorIds, colorMap);
          data.colorIds = newColorIds;
          return data;
        }
        replaceColorIds(colorIds, colorMap) {
          for (let i = 0; i < colorIds.length; i++) {
            let colorArr = colorIds[i];
            for (let j = 0; j < colorArr.length; j++) {
              colorArr[j] = colorMap[colorArr[j]] || 0;
            }
          }
          return colorIds;
        }
        get debugLevel() {
          return this._debugLevel;
        }
        set debugLevel(value) {
          this._debugLevel = value;
          GameDataMgr.instance.data.level = value;
          this.nextLevel();
        }
        get cupsData() {
          return this._cups;
        }
        async createCups() {
          var _this$templatePos$thi;
          if (this.layout_v) {
            this.layout_v.node.destroyAllChildren();
          }
          this._cups = [];
          this.selected = null;
          this._actions = [];
          // await wait(1);

          let arr = this.curCfg;
          const len = this.curCfg.capacity.length;
          if (len == 0) {
            return;
          }
          for (let i = 0; i < len; i++) {
            let info = arr;
            let _node = instantiate(this.pfb);
            _node.parent = this.node;
            let _cup = _node.getComponent(GlassCup);
            _cup.setCupInfo(i, info, this.onClickCup.bind(this));
            this._cups.push(_cup);
          }
          function _createLayout(type, parent, name) {
            let node = new Node(name);
            node.parent = parent;
            node.addComponent(UITransform);
            let layout = node.addComponent(Layout);
            layout.type = type;
            layout.resizeMode = Layout.ResizeMode.CONTAINER;
            return layout;
          }
          if (this.layout_v == null) {
            this.layout_v = _createLayout(Layout.Type.VERTICAL, this.node, "layout_v");
            this.layout_v.node.setSiblingIndex(1);
          }
          let cupSize = this._cups[0].node.getComponent(UITransform).contentSize;
          let cupIdxGroups = [];
          if (len <= 4) {
            let idGroup = [];
            for (let i = 0; i < this._cups.length; i++) {
              idGroup.push(i);
            }
            cupIdxGroups.push(idGroup);
          } else if (len <= 15) {
            let idGroup = [];
            let i = 0;
            let middleId = len / 2;
            for (; i < middleId; i++) {
              idGroup.push(i);
            }
            cupIdxGroups.push(idGroup);
            idGroup = [];
            for (; i < len; i++) {
              idGroup.push(i);
            }
            cupIdxGroups.push(idGroup);
            idGroup = [];
          } else {
            let idGroup = [];
            let i = 0;
            let middleId = Math.round(len / 3);
            let temp = middleId;
            for (; i < middleId; i++) {
              idGroup.push(i);
            }
            temp += middleId;
            cupIdxGroups.push(idGroup);
            idGroup = [];
            for (; i < temp; i++) {
              idGroup.push(i);
            }
            cupIdxGroups.push(idGroup);
            idGroup = [];
            for (; i < len; i++) {
              idGroup.push(i);
            }
            cupIdxGroups.push(idGroup);
            idGroup = [];
          }
          let layoutArr = [];
          let maxNum = 1;
          for (let i = 0; i < cupIdxGroups.length; i++) {
            let node_layout_h = _createLayout(Layout.Type.HORIZONTAL, this.layout_v.node, `layout_h_${i}`);
            node_layout_h.node.getComponent(UITransform).height = cupSize.height;
            let idGroup = cupIdxGroups[i];
            for (let j = 0; j < idGroup.length; j++) {
              let id = idGroup[j];
              if (this.curCfg.template == 0) {
                this._cups[id].node.parent = node_layout_h.node;
              } else {
                this._cups[id].node.parent = this.layout_v.node;
              }
            }
            maxNum = Math.max(maxNum, node_layout_h.node.children.length);
            let spaceX = spacesArr[maxNum][0];
            if (spaceX != node_layout_h.spacingX) {
              node_layout_h.spacingX = spaceX;
            }
            layoutArr.push(node_layout_h);
          }
          this.layout_v.enabled = true;
          let _scale = ((_this$templatePos$thi = this.templatePos[this.curCfg.template]) == null ? void 0 : _this$templatePos$thi.scale) || spacesArr[maxNum][1];
          this.layout_v.node.scale = v3(_scale, _scale, _scale);
          this.layout_v.spacingY = spacesArr[maxNum][2] || 120;
          for (let layout of layoutArr) {
            layout.updateLayout();
            layout.enabled = false;
          }
          this.layout_v.updateLayout();
          this.layout_v.enabled = false;
          for (let cup of this._cups) {
            if (this.curCfg.template) {
              let posArr = this.templatePos[this.curCfg.template].postion;
              let pos = posArr[cup.cupId]; //cup.node.getComponent(UITransform).convertToNodeSpaceAR(posArr[cup.cupId]);
              cup.node.setPosition(pos);
            }
            cup.orignPt = cup.node.position.clone();
          }
          let lastCup = this._cups[this._cups.length - 1];
          lastCup.getComponent(GlassCup).isLock = true;
        }
        onClickCup(cup) {
          if (this.selected) {
            if (this.selected == cup) {
              this.doSelect(cup, false);
              this.selected = null;
              cup.shadow.active = true;
            } else if (this.checkPour(this.selected, cup)) {
              this.startPour(this.selected, cup);
            } else {
              this.doSelect(this.selected, false);
              this.selected = null;
              cup.shadow.active = true;
            }
          } else {
            if (cup.state == -1) {
              PageMgr.openPage(UIPage.GetAwardView, UIPAGE_TYPE.PAGE, {
                page: 2,
                getValue: 1,
                toolType: 2
              });
              return;
            } else if (cup.checkIsFinshed() || cup.state == 1) {
              return;
            }
            this.selected = cup;
            this.doSelect(cup, true);
            cup.shadow.active = false;
          }
          barSortBridge.vibrate(30, Vibration.LIGHT);
        }
        checkPour(src, dst) {
          let srcTop = src.getTop();
          let dstTop = dst.getTop();
          if (dstTop.emptyNum == 0 || dst.isLock == true) {
            return false;
          }
          if (dstTop.topColorId == 0 || srcTop.topColorId == dstTop.topColorId) {
            return true;
          }
          if (srcTop.topColorId == 0 || srcTop.topColorId != dstTop.topColorId) {
            return false;
          }
          return srcTop.topColorNum <= dstTop.emptyNum;
        }
        startPour(src, dst) {
          dst.state = 1;
          director.emit(EventID.START_GAME);
          dst.node.setSiblingIndex(0);
          dst.node.parent.setSiblingIndex(0);
          src.node.setSiblingIndex(100);
          src.node.parent.setSiblingIndex(100);
          let srcTop = src.getTop();
          let dstPt = v3(dst.node.position);
          let dstGlobal = dst.node.parent.getComponent(UITransform).convertToWorldSpaceAR(dstPt);
          let viewSize = view.getVisibleSize();
          let isRight = dstGlobal.x > viewSize.width * 0.5;
          if (Math.abs(dstGlobal.x - viewSize.width * 0.5) < 2) {
            let srcPt = src.node.parent.getComponent(UITransform).convertToWorldSpaceAR(v3(src.node.position));
            isRight = srcPt.x < viewSize.width * 0.5;
          }
          dstPt.y += 60 + dst.node.getComponent(UITransform).height * 0.5;
          let offsetX = 0; //dst.node.width*0.5-20;
          dstPt.x = dstPt.x + (isRight ? -offsetX : offsetX);
          dstPt = dst.node.parent.getComponent(UITransform).convertToWorldSpaceAR(dstPt);
          src.setPourAnchor(isRight);
          dstPt = src.node.parent.getComponent(UITransform).convertToNodeSpaceAR(dstPt);
          // log("---------src.x",src.node.x,dstPt.x)

          const flow = src.getFlow();
          flow.node.parent = this.node;
          flow.setLineScale(this.layout_v.node.scale.x);
          const onPourStart = () => {
            let startPt = src.node.getComponent(UITransform).convertToWorldSpaceAR(v3());
            startPt = flow.node.parent.getComponent(UITransform).convertToNodeSpaceAR(startPt);
            let endPt = v3(startPt.x, dst.getWaterSurfacePosY());
            endPt = flow.node.parent.getComponent(UITransform).convertToNodeSpaceAR(endPt);
            let distance = 0;
            if (isRight) {
              distance = 45;
            } else {
              distance = -45;
            }
            endPt.x = startPt.x + distance;
            startPt.x = startPt.x + distance;
            startPt.y = startPt.y + 30;
            flow.strokeColor = new Color().fromHEX(srcTop.colorHex);
            flow.playFlowAni(startPt, endPt, 0.2, false, () => {
              let num = srcTop.topColorNum - dst.getTop().emptyNum <= 0 ? srcTop.topColorNum : dst.getTop().emptyNum;
              console.log("dst add water:", num);
              dst.startAddWater(srcTop.topColorId, num, (cup, isFinished) => {
                this.onPourOneFinished(src, dst, srcTop.topColorId, srcTop.topColorNum);
                src.initWater();
                dst.initWater();
                if (dst.checkIsFinshed()) {
                  dst.showCompleteItem();
                }
              });
            });
          };
          function onPourFinish() {
            let startPt = src.node.getComponent(UITransform).convertToWorldSpaceAR(v3());
            startPt = flow.node.parent.getComponent(UITransform).convertToNodeSpaceAR(startPt);
            let endPt = v3(startPt.x, dst.getWaterSurfacePosY(true));
            endPt = flow.node.parent.getComponent(UITransform).convertToNodeSpaceAR(endPt);
            let distance = 0;
            if (isRight) {
              distance = 45;
            } else {
              distance = -45;
            }
            endPt.x = startPt.x + distance;
            startPt.x = startPt.x + distance;
            flow.playFlowAni(startPt, endPt, 0.2, true, () => {
              flow.clear();
            });
            src.setNormalAnchor();
            let pt = src.orignPt;
            let moveBack = tween(src.node).delay(0.2).to(0.5, {
              position: pt,
              angle: 0
            }, {
              easing: "sineOut"
            }).call(() => {
              src.node.setSiblingIndex(0);
              src.node.parent.setSiblingIndex(0);
              src.node.getChildByName("shadow").active = true;
            });
            moveBack.start();
          }
          this.selected = null;
          let dstTop = dst.getTop();
          console.log("pour num", dstTop.emptyNum);
          src.moveToPour(dstPt, isRight, onPourStart.bind(this), onPourFinish.bind(this), dstTop.emptyNum);
        }
        doSelect(cup, bool) {
          let pt = cup.orignPt;
          let y = pt.y + (bool ? cup.node.getComponent(UITransform).height * 0.2 : 0);
          tween(cup.node).stop();
          tween(cup.node).to(0.1, {
            position: v3(pt.x, y)
          }).start();
        }
        /**一次倒水完成（以加水那个杯子水面升到最高为界限） */
        onPourOneFinished(from, to, colorId, num) {
          to.state = 0;
          let fromCupIdx = this._cups.indexOf(from);
          let toCupIdx = this._cups.indexOf(to);
          if (this._actions.length == 5) {
            this._actions.shift();
          }
          this._actions.push({
            from: fromCupIdx,
            to: toCupIdx,
            colorId: colorId,
            num: num
          });
          let finish = this.getFinishedCups();
          director.emit(EventID.POURONEFINISHED, finish);
          let isAllFinished = this.checkIsAllFinished();
          if (isAllFinished) {
            log("---------finnished---------");
            this.scheduleOnce(() => {
              PageMgr.openPage(UIPage.ResultView, UIPAGE_TYPE.PAGE, {
                iswin: true
              });
            }, 1.5);
            GameDataMgr.instance.data.level += 1;
            let gdMgr = GameDataMgr.instance;
            let level = gdMgr.data.level;
            let index = (level - 1) % 3;
            if (index == 0) {
              gdMgr.data.canAwardBank = true;
            }
            gdMgr.data.curCollect.collectProgress += 1;
            this.node.emit("level_finish");
          } else {
            this.node.emit("do_pour");
          }
          // sys.localStorage.setItem(COOKIE_LAST_CFG,JSON.stringify(this.curCfg));
          // sys.localStorage.setItem(COOKIE_ACTION_HISTORY,JSON.stringify(this._actions));
        }

        getActionNum() {
          return this._actions.length;
        }

        /**恢复上一次的操作 */
        undoAction() {
          let action = this._actions.pop();
          if (action == null) {
            return false;
          }
          let {
            from,
            to,
            num,
            colorId
          } = action;
          let toCup = this._cups[to];
          let fromCup = this._cups[from];
          if (toCup.isPouring() || fromCup.isPouring()) {
            return false;
          }
          toCup.removeTopWaterImmediately(num);
          fromCup.addWaterImmediately(colorId, num);
          return true;
        }
        nextLevel() {
          this.initCfg();
          this.node.destroyAllChildren();
          this.layout_v = null;
          this.scheduleOnce(() => {
            this.createCups();
          }, 0.1);
        }
        getLevel() {
          return GameDataMgr.instance.data.level;
        }
        checkIsAllFinished() {
          for (let cup of this._cups) {
            if (!cup.checkIsFinshed()) {
              return false;
            }
          }
          return true;
        }
        getFinishedCups() {
          let finishedCups = [];
          for (let cup of this._cups) {
            if (cup.checkIsFinshed()) {
              finishedCups.push(cup);
            }
          }
          return finishedCups;
        }
        addOneCup() {
          if (this.isAddCupInGame) {
            PageMgr.openPage(UIPage.Toast, UIPAGE_TYPE.ALERT, "This item has already been used in this game");
            return false;
          }
          this.isAddCupInGame = true;
          let lastCup = this._cups[this._cups.length - 1];
          lastCup.node.getComponent(UIOpacity).opacity = 255;
          lastCup.getComponent(GlassCup).isLock = false;

          // let cupId = this.curCfg.capacity.length;
          // this.addCupData();
          // let info = this.curCfg;

          // let _node = instantiate(this.pfb);
          // _node.parent = this.layout_v.node.children[this.layout_v.node.children.length - 1];
          // let _cup = _node.getComponent(GlassCup)
          // _cup.setCupInfo(cupId, info, this.onClickCup.bind(this));
          // this._cups.push(_cup);

          // let layoutArr = this.layout_v.node.children;
          // for (let layout of layoutArr) {
          //     if(layout.getComponent(Layout)) {
          //         layout.getComponent(Layout).enabled = true;
          //         layout.getComponent(Layout).updateLayout();
          //         layout.getComponent(Layout).enabled = false;
          //     }
          // }

          GameDataMgr.instance.data.toolAddCup -= 1;
          GameDataMgr.instance.saveData();
          return true;
        }
        refreshcup() {
          const len = this.curCfg.capacity.length;
          let arr = this.curCfg;
          for (let i = 0; i < this._cups.length; i++) {
            let info = arr;
            let _node = this._cups[i].node;
            let _cup = _node.getComponent(GlassCup);
            _cup.setCupInfo(i, info, this.onClickCup.bind(this));
          }
        }
        addCupData() {
          let len = this.curCfg.colorIds[0].length;
          let arr = Array.from({
            length: len
          }, (_, index) => 0);
          this.curCfg.colorIds.push(arr);
          this.curCfg.capacity.push(len);
        }
        moveCupToBar() {
          let size = this.node.getComponent(UITransform).contentSize;
          let distance = this.getDistanceToScreenEdges(this.node.position);
          let originPos = this.node.getPosition().clone();
          this.node.setPosition(new Vec3(originPos.x, originPos.y - distance.bottom - size.height, originPos.z));
          tween(this.node).to(2, {
            position: new Vec3(originPos.x, originPos.y, originPos.z)
          }, {
            easing: "elasticInOut"
          }).start();
        }
        getDistanceToScreenEdges(point) {
          const winSize = view.getVisibleSize();
          const distanceToLeft = point.x + winSize.width / 2;
          const distanceToRight = winSize.width / 2 - point.x;
          const distanceToTop = winSize.height / 2 - point.y;
          const distanceToBottom = point.y + winSize.height / 2;
          return {
            left: distanceToLeft,
            right: distanceToRight,
            top: distanceToTop,
            bottom: distanceToBottom
          };
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "levelCfg", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "pfb", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_debugLevel", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _applyDecoratedDescriptor(_class2.prototype, "debugLevel", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "debugLevel"), _class2.prototype)), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/gm-manager.ts", ['cc', './storage-manager.ts', './config.ts'], function (exports) {
  var cclegacy, director, StorageManager, AppConfig;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      director = module.director;
    }, function (module) {
      StorageManager = module.StorageManager;
    }, function (module) {
      AppConfig = module.AppConfig;
    }],
    execute: function () {
      cclegacy._RF.push({}, "27eb02Xa8lKU6SUdNtlp4Nw", "gm-manager", undefined);
      class GmManager {
        constructor() {
          this._RFlag = false;
          this._isSkipAd = false;
          this._isSkipLv = false;
        }
        static get instance() {
          if (!this._instance) {
            this._instance = new GmManager();
            this._instance.init();
          }
          return this._instance;
        }
        init() {
          let data = StorageManager.instance.getJson('gm');
          console.log(`gm-manager-init-load-data:${JSON.stringify(data)}`);
          if (data) {
            this._RFlag = data.RFlag;
            this._isSkipAd = data.isSkipAd;
            this._isSkipLv = data.isSkipLv;
          } else {
            this._RFlag = false;
            this._isSkipAd = false;
            this._isSkipLv = false;
          }
        }
        set RFlag(val) {
          this._RFlag = val;
          director.emit(AppConfig.FLAG_CHANGED);
        }
        get RFlag() {
          return this._RFlag;
        }
        set isSkipAd(val) {
          this._isSkipAd = val;
        }
        get isSkipAd() {
          return this._isSkipAd;
        }
        set isSkipLv(val) {
          this._isSkipLv = val;
        }
        get isSkipLv() {
          return this._isSkipLv;
        }
        saveData() {
          let data = {
            RFlag: this._RFlag,
            isSkipAd: this._isSkipAd,
            isSkipLv: this._isSkipLv
          };
          console.log(`gm-manager-save-data:${JSON.stringify(data)}`);
          StorageManager.instance.set('gm', data);
        }
      }
      exports('GmManager', GmManager);
      GmManager._instance = null;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/homeView.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BasePage.ts', './PageMgr.ts', './GameDataMgr.ts', './ResMgr.ts', './DataEnums.ts', './AudioMgr.ts', './barSortBridge.ts', './config.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, Label, Sprite, _decorator, director, ParticleSystem2D, tween, Vec3, SpriteFrame, UITransform, view, instantiate, BasePage, PageMgr, UIPage, UIPAGE_TYPE, GameDataMgr, SgState, ResMgr, cacheType, EventID, AudioMgr, AUDIO_NAME, barSortBridge, Vibration, Config;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      Label = module.Label;
      Sprite = module.Sprite;
      _decorator = module._decorator;
      director = module.director;
      ParticleSystem2D = module.ParticleSystem2D;
      tween = module.tween;
      Vec3 = module.Vec3;
      SpriteFrame = module.SpriteFrame;
      UITransform = module.UITransform;
      view = module.view;
      instantiate = module.instantiate;
    }, function (module) {
      BasePage = module.BasePage;
    }, function (module) {
      PageMgr = module.PageMgr;
      UIPage = module.UIPage;
      UIPAGE_TYPE = module.UIPAGE_TYPE;
    }, function (module) {
      GameDataMgr = module.GameDataMgr;
      SgState = module.SgState;
    }, function (module) {
      ResMgr = module.ResMgr;
      cacheType = module.cacheType;
    }, function (module) {
      EventID = module.EventID;
    }, function (module) {
      AudioMgr = module.AudioMgr;
      AUDIO_NAME = module.AUDIO_NAME;
    }, function (module) {
      barSortBridge = module.barSortBridge;
      Vibration = module.Vibration;
    }, function (module) {
      Config = module.Config;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10;
      cclegacy._RF.push({}, "3fda3p+asJIlpD2UuGa9i4f", "homeView", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let homeView = exports('homeView', (_dec = ccclass('homeView'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Label), _dec5 = property(Label), _dec6 = property(Sprite), _dec7 = property(Node), _dec8 = property(Node), _dec9 = property(Node), _dec10 = property(Node), _dec11 = property(Node), _dec(_class = (_class2 = class homeView extends BasePage {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "beverage", _descriptor, this);
          _initializerDefineProperty(this, "beverageImg", _descriptor2, this);
          _initializerDefineProperty(this, "lblCollect", _descriptor3, this);
          _initializerDefineProperty(this, "lblPiggy", _descriptor4, this);
          _initializerDefineProperty(this, "bg", _descriptor5, this);
          _initializerDefineProperty(this, "setting", _descriptor6, this);
          _initializerDefineProperty(this, "piggy", _descriptor7, this);
          _initializerDefineProperty(this, "background", _descriptor8, this);
          _initializerDefineProperty(this, "collect", _descriptor9, this);
          _initializerDefineProperty(this, "cupEffect", _descriptor10, this);
          this.canChangeCup = false;
        }
        onEnable() {
          let gdMgr = GameDataMgr.instance;
          this.refreshCurCollect();
          this.refreshBeverage().then(() => {
            if (gdMgr.data.canAwardBank) {
              PageMgr.openPage(UIPage.PiggyBankAwardView, UIPAGE_TYPE.PAGE);
            }
          });
          this.lblPiggy.string = (gdMgr.data.level - 1) % 3 + "/" + 3;
          director.on(EventID.UPDATE_BACKGROUND, this.updateBackGround, this);
          this.schedule(() => {
            let particleSystem = this.cupEffect.getComponent(ParticleSystem2D);
            particleSystem.stopSystem();
            particleSystem.resetSystem();
          }, 13);
        }
        async refreshBeverage() {
          return new Promise(async (resolve, reject) => {
            if (this.canChangeCup) {
              tween(this.beverageImg).to(0.2, {
                scale: new Vec3(0, 0, 0)
              }).call(async () => {
                let gdMgrData = GameDataMgr.instance.data;
                let name = GameDataMgr.drinkMap[gdMgrData.curCollect.collectId];
                this.beverageImg.getComponent(Sprite).spriteFrame = await ResMgr.instance.loadAAndReturnAsset(`textures/collect/detail/${name}/spriteFrame`, SpriteFrame, cacheType.spriteCache);
                this.lblCollect.string = gdMgrData.curCollect.collectProgress + "/" + gdMgrData.curCollect.targetProgress;
                this.scheduleOnce(() => {
                  resolve();
                }, 0.5);
              }).to(0.5, {
                scale: new Vec3(1, 1, 1)
              }).start();
            } else {
              let gdMgrData = GameDataMgr.instance.data;
              let name = GameDataMgr.drinkMap[gdMgrData.curCollect.collectId];
              this.beverageImg.getComponent(Sprite).spriteFrame = await ResMgr.instance.loadAAndReturnAsset(`textures/collect/detail/${name}/spriteFrame`, SpriteFrame, cacheType.spriteCache);
              this.lblCollect.string = gdMgrData.curCollect.collectProgress + "/" + gdMgrData.curCollect.targetProgress;
              resolve();
            }
          });
        }
        refreshCurCollect() {
          let gdMgrData = GameDataMgr.instance.data;
          if (gdMgrData.curCollect.collectProgress >= gdMgrData.curCollect.targetProgress) {
            this.canChangeCup = true;
            if (gdMgrData.collectCup.indexOf(gdMgrData.curCollect.collectId) == -1) {
              gdMgrData.collectCup.push(gdMgrData.curCollect.collectId);
            }
            gdMgrData.curCollect.collectId += 1;
            gdMgrData.curCollect.collectProgress = 0;
            gdMgrData.curCollect.targetProgress = this.getTargetProgress();
          }
        }
        getTargetProgress() {
          let gdMgr = GameDataMgr.instance;
          let level = gdMgr.data.level;
          let collect_level = gdMgr.mainConfig.collect_level;
          for (let i = 0; i < collect_level.length; i++) {
            if (level > collect_level[i][0] && (level <= collect_level[i][1] || collect_level[i][1] == -1)) {
              return collect_level[i][2];
            }
          }
        }
        updateBackGround() {
          let gdMgr = GameDataMgr.instance;
          ResMgr.instance.loadAsset(`textures/background/BJ_${gdMgr.data.curSelectedBg}/spriteFrame`, SpriteFrame, spriteFrame => {
            this.bg.spriteFrame = spriteFrame;
          });
        }
        tweenAndHide(node, direction) {
          return new Promise((resolve, reject) => {
            let targetPos = new Vec3(node.position.x, node.position.y, node.position.z);
            let size = node.getComponent(UITransform).contentSize;
            let distance = this.getDistanceToScreenEdges(targetPos);
            if (direction == 0) {
              //top
              targetPos.add(new Vec3(0, distance.top + size.height / 2, 0));
            } else if (direction == 1) {
              //bottom
              targetPos.add(new Vec3(0, -distance.bottom - size.height / 2, 0));
            } else if (direction == 2) {
              //left
              targetPos.add(new Vec3(-distance.left - size.width / 2, 0, 0));
            } else if (direction == 3) {
              //right
              targetPos.add(new Vec3(distance.right + size.width / 2, 0, 0));
            }
            tween(node).to(0.5, {
              position: targetPos
            }, {
              easing: "fade"
            }).call(() => {
              resolve();
            }).start();
          });
        }
        getDistanceToScreenEdges(point) {
          const winSize = view.getVisibleSize();
          const distanceToLeft = point.x + winSize.width / 2;
          const distanceToRight = winSize.width / 2 - point.x;
          const distanceToTop = winSize.height / 2 - point.y;
          const distanceToBottom = point.y + winSize.height / 2;
          return {
            left: distanceToLeft,
            right: distanceToRight,
            top: distanceToTop,
            bottom: distanceToBottom
          };
        }
        onClickPlay() {
          if (Config.ENABLE_SG) {
            GameDataMgr.instance.sg.state = SgState.Started;
            director.loadScene("welcome_sg");
          } else {
            AudioMgr.instance.playEffect(AUDIO_NAME.btn_click);
            barSortBridge.vibrate(30, Vibration.LIGHT);
            this.cupEffect.active = false;
            let promise = this.tweenAndHide(this.setting, 3);
            let promise1 = this.tweenAndHide(this.piggy, 2);
            let promise2 = this.tweenAndHide(this.collect, 2);
            let promise3 = this.tweenAndHide(this.background, 3);
            Promise.all([promise, promise1, promise2, promise3]).then(() => {
              PageMgr.closePage(UIPage.HomeView);
              this.beverageAni();
              PageMgr.openPage(UIPage.Game, UIPAGE_TYPE.PAGE);
            });
          }
        }
        beverageAni() {
          let canvas = director.getScene().getChildByName("Canvas");
          let aniRoot = canvas.getChildByName("aniRoot");
          let node = instantiate(this.beverage);
          node.parent = aniRoot;
          let img = node.getChildByName("beverage_img");
          node.getChildByName("drink_btn").active = false;
          tween(node).to(0.3, {
            scale: new Vec3(0, 0, 0)
          }).call(() => {
            node.removeFromParent();
          }).start();
        }
        openSettingView() {
          AudioMgr.instance.playEffect(AUDIO_NAME.btn_click);
          barSortBridge.vibrate(30, Vibration.LIGHT);
          PageMgr.openPage(UIPage.SettingView, UIPAGE_TYPE.PAGE);
        }
        openBackgroundView() {
          AudioMgr.instance.playEffect(AUDIO_NAME.btn_click);
          barSortBridge.vibrate(30, Vibration.LIGHT);
          PageMgr.openPage(UIPage.BackGroundView, UIPAGE_TYPE.PAGE);
        }
        openPiggyBankView() {
          AudioMgr.instance.playEffect(AUDIO_NAME.btn_click);
          barSortBridge.vibrate(30, Vibration.LIGHT);
          PageMgr.openPage(UIPage.PiggyBankView, UIPAGE_TYPE.PAGE);
        }
        openCollectView() {
          AudioMgr.instance.playEffect(AUDIO_NAME.btn_click);
          barSortBridge.vibrate(30, Vibration.LIGHT);
          PageMgr.openPage(UIPage.CollectView, UIPAGE_TYPE.PAGE);
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "beverage", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "beverageImg", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "lblCollect", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "lblPiggy", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "bg", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "setting", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "piggy", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "background", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "collect", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "cupEffect", [_dec11], {
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

System.register("chunks:///_virtual/http-agent.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "2b95f1ankREBrtwhkVlNDS3", "http-agent", undefined);
      class HttpError extends Error {
        get status() {
          var _this$response;
          return ((_this$response = this.response) == null ? void 0 : _this$response.status) || 0;
        }
        get statusText() {
          var _this$response2;
          return ((_this$response2 = this.response) == null ? void 0 : _this$response2.statusText) || '';
        }
        get headers() {
          var _this$response3;
          return ((_this$response3 = this.response) == null ? void 0 : _this$response3.headers) || null;
        }
        constructor(...args) {
          if (args.length == 1) {
            super(args[0]);
            this.response = void 0;
          } else if (args.length == 2) {
            if (args[1] instanceof Response) {
              super(args[0]);
              this.response = void 0;
              this.response = args[1];
            } else {
              super(args[1]);
              this.response = void 0;
              this.name = args[0];
            }
          } else {
            super(args[1]);
            this.response = void 0;
            this.name = args[0];
            this.response = args[2];
          }
          console.error('HttpError:', this.name, this.message, this.response);
        }
      }
      exports('HttpError', HttpError);
      HttpError.TIMEOUT = 'TIMEOUT';
      HttpError.ABORT_TIMEOUT = 'ABORT_TIMEOUT';
      HttpError.NETWORK_ERROR = 'NETWORK_ERROR';
      HttpError.UNKNOWN = 'UNKNOWN';
      class HttpAgent {
        static async request(url, method, headers, timeout = 0, params) {
          const promises = [];
          let timeoutHandle = 0;
          if (timeout > 0) {
            const timeoutPromise = new Promise((_, reject) => {
              if (timeout > 0) {
                timeoutHandle = setTimeout(() => {
                  timeoutHandle = 0;
                  reject(new HttpError(HttpError.TIMEOUT, `Request timed out after ${timeout / 1000}s`));
                }, timeout);
              }
            });
            promises.push(timeoutPromise);
          }
          const fetchPromise = fetch(url, {
            // signal: signal,
            cache: 'no-store',
            // 或 'reload'
            method: method,
            headers: headers,
            body: params ? JSON.stringify(params) : undefined
          }).then(response => {
            if (timeoutHandle > 0) {
              clearTimeout(timeoutHandle);
              timeoutHandle = 0;
            }
            if (!response.ok) {
              throw new HttpError(HttpError.NETWORK_ERROR, response.statusText, response);
            }
            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.includes('application/json')) {
              return response.json();
            } else {
              return response.text();
            }
          }).catch(error => {
            if (timeoutHandle > 0) {
              clearTimeout(timeoutHandle);
              timeoutHandle = 0;
            }
            if (error instanceof HttpError) {
              return Promise.reject(error);
            }
            const message = error instanceof Error ? error.message : String(error);
            return Promise.reject(new HttpError(HttpError.NETWORK_ERROR, message));
          });
          promises.push(fetchPromise);
          return Promise.race(promises).catch(error => {
            return Promise.reject(error);
          });
        }
      }
      exports('HttpAgent', HttpAgent);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/loadingView.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BasePage.ts', './LogMgr.ts', './PageMgr.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, _decorator, tween, Vec3, instantiate, BasePage, LogMgr, PageMgr, UIPage, UIPAGE_TYPE;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      _decorator = module._decorator;
      tween = module.tween;
      Vec3 = module.Vec3;
      instantiate = module.instantiate;
    }, function (module) {
      BasePage = module.BasePage;
    }, function (module) {
      LogMgr = module.LogMgr;
    }, function (module) {
      PageMgr = module.PageMgr;
      UIPage = module.UIPage;
      UIPAGE_TYPE = module.UIPAGE_TYPE;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;
      cclegacy._RF.push({}, "2aa38HjMJVIk5uL49HLfSYX", "loadingView", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let loadingView = exports('loadingView', (_dec = ccclass('loadingView'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property(Node), _dec(_class = (_class2 = class loadingView extends BasePage {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "drinkNode", _descriptor, this);
          _initializerDefineProperty(this, "cloudNode", _descriptor2, this);
          _initializerDefineProperty(this, "layout", _descriptor3, this);
          _initializerDefineProperty(this, "item", _descriptor4, this);
        }
        start() {}
        initData(data) {
          if (!data) {
            LogMgr.log("loadingView data is null");
            return;
          }
          tween(this.cloudNode).by(5, {
            angle: 90 * 5
          }).union().repeatForever().start();
          tween(this.cloudNode.scale).to(2.5, new Vec3(0.8, 0.8, 0.8), {
            easing: 'sineInOut'
          }).to(2.5, new Vec3(1.1, 1.1, 1.1), {
            easing: 'sineInOut'
          }).union().repeatForever().start();
          this.schedule(this.showDot, 1);
          this.scheduleOnce(() => {
            if (data.onclose) {
              data.onclose();
            }
            PageMgr.closePage(UIPage.LoadingView, UIPAGE_TYPE.PAGE);
          }, data.displayTime);
        }
        onDisable() {
          this.unschedule(this.showDot);
        }
        showDot() {
          let node = instantiate(this.item);
          node.position = new Vec3(0, 0, 0);
          node.parent = this.layout;
          tween(node).to(1, {
            position: new Vec3(-185, -134, 0)
          }).to(1, {
            scale: new Vec3(0, 0, 0)
          }).call(() => {
            node.removeFromParent();
          }).union().start();
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "drinkNode", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "cloudNode", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "layout", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "item", [_dec5], {
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

System.register("chunks:///_virtual/LogMgr.ts", ['cc'], function (exports) {
  var cclegacy, error;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      error = module.error;
    }],
    execute: function () {
      cclegacy._RF.push({}, "8ca43xHH39MaKz4q2M2QNvl", "LogMgr", undefined);
      class LogMgr {
        static get instance() {
          if (!this._instance) {
            this._instance = new LogMgr();
          }
          return this._instance;
        }
        constructor() {}
        static log(...data) {
          console.log(...data);
        }
        static error(...data) {
          error(...data);
        }
      }
      exports('LogMgr', LogMgr);
      LogMgr._instance = null;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/main", ['./welcome-hf-start.ts', './BasePage.ts', './CommonTip.ts', './adAgent.ts', './adMgr.ts', './connectMgr.ts', './barSortBridge.ts', './Customer.ts', './GlassCup.ts', './GlassCupMgr.ts', './Order.ts', './water.ts', './waterFlow.ts', './config.ts', './config-agent.ts', './data-agent.ts', './storage-manager.ts', './union-fetch-agent.ts', './front-line.ts', './DataEnums.ts', './account.ts', './backgroundDetailView.ts', './backgroundItem.ts', './backgroundView.ts', './collectDetailView.ts', './collectItem.ts', './collectView.ts', './game.ts', './gameScene.ts', './getAwardView.ts', './homeView.ts', './loadingView.ts', './piggyBankAwardView.ts', './piggyBankView.ts', './privacyView.ts', './resultView.ts', './settingView.ts', './startView.ts', './storyView.ts', './welcomeView.ts', './gm-manager.ts', './time-agent.ts', './AudioMgr.ts', './GameDataMgr.ts', './LogMgr.ts', './PageMgr.ts', './ResMgr.ts', './StorageMgr.ts', './mount-dot.ts', './mount-manager.ts', './mount-pod.ts', './http-agent.ts', './request-manager.ts', './CommonUtility.ts', './ObjectUtility.ts', './RandomUtility.ts'], function () {
  return {
    setters: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    execute: function () {}
  };
});

System.register("chunks:///_virtual/mount-dot.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "daffeAi5ndOqar5+UBfEYUl", "mount-dot", undefined);
      let MountDot = exports('MountDot', /*#__PURE__*/function (MountDot) {
        MountDot["RemoteWebConfigUpdated"] = "RemoteWebConfigUpdated";
        MountDot["RemoteStoreConfigUpdated"] = "RemoteStoreConfigUpdated";
        MountDot["RemoteStoreDataUpdated"] = "RemoteStoreDataUpdated";
        MountDot["NativeNotifyPageRc"] = "NativeNotifyPageRc";
        MountDot["NotifyWebContReady"] = "NotifyWebContReady";
        MountDot["NativeNotifyCurrency"] = "NativeNotifyCurrency";
        MountDot["NativeNotifyIsRedeem"] = "NativeNotifyIsRedeem";
        MountDot["NativeNotifyRedeemAount"] = "NativeNotifyRedeemAount";
        MountDot["NativeNotifyProgressChange"] = "NativeNotifyProgressChange";
        MountDot["NativeNotifyResetData"] = "NativeNotifyResetData";
        MountDot["RemoteFetchIllustration"] = "RemoteFetchIllustration";
        MountDot["NativeNotifyGetIllustration"] = "NativeNotifyGetIllustration";
        MountDot["NativeNotifyIllstrationView"] = "NativeNotifyIllstrationView";
        MountDot["NativeNotifyGetSmallSpfCache"] = "NativeNotifyGetSmallSpfCache";
        MountDot["NativeNotifyGetOrgnSpfCache"] = "NativeNotifyGetOrgnSpfCache";
        MountDot["NativeNotifyPreloadPicture"] = "NativeNotifyPreloadPicture";
        MountDot["HasStore"] = "HasStore";
        MountDot["StageInitUIConf"] = "StageInitUIConf";
        MountDot["RFlagChanged"] = "RFlagChanged";
        MountDot["GetMoreGameUrl"] = "GetMoreGameUrl";
        return MountDot;
      }({}));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/mount-manager.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "1497eVz29BHkL9Fq8Ohyqvd", "mount-manager", undefined);
      class MountManager {
        constructor() {
          this._mountData = new Map();
        }
        static get instance() {
          if (!this._instance) {
            this._instance = new MountManager();
          }
          return this._instance;
        }
        has(mountPoint) {
          return this._mountData.has(mountPoint);
        }
        notify(mountPoint, data) {
          const result = [];
          const pods = this._mountData.get(mountPoint);
          if (pods) {
            pods.forEach(pod => {
              if (pod.onMountPoint) {
                const rt = pod.onMountPoint(mountPoint, data);
                if (rt) {
                  result.push(rt);
                }
              }
            });
          }
          return result;
        }
        mount(mountPoint, pod) {
          const pods = this._mountData.get(mountPoint);
          if (pods) {
            pods.push(pod);
          } else {
            this._mountData.set(mountPoint, [pod]);
          }
        }
        unMount(mountPoint, pod) {
          const podins = this._mountData.get(mountPoint);
          if (podins) {
            const index = podins.indexOf(pod);
            if (index >= 0) {
              podins.splice(index, 1);
            }
          }
        }
      }
      exports('MountManager', MountManager);
      MountManager._instance = void 0;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/mount-pod.ts", ['cc'], function () {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "d99ced2NddND705nklS+YQS", "mount-pod", undefined);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ObjectUtility.ts", ['cc', './LogMgr.ts'], function (exports) {
  var cclegacy, LogMgr;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      LogMgr = module.LogMgr;
    }],
    execute: function () {
      exports({
        ArrayType: ArrayType,
        ClassType: ClassType,
        MapType: MapType
      });
      cclegacy._RF.push({}, "76c0czr/ghPNaGz/ysL4McB", "ObjectUtility", undefined);

      // 类型元数据装饰器
      function ClassType(type) {
        return function (target, propertyKey) {
          if (!target.constructor.__typeInfo__) {
            target.constructor.__typeInfo__ = new Map();
          }
          target.constructor.__typeInfo__.set(propertyKey, type);
        };
      }

      // 数组类型元数据装饰器
      function ArrayType(type) {
        return function (target, propertyKey) {
          if (!target.constructor.__arrayTypeInfo__) {
            target.constructor.__arrayTypeInfo__ = new Map();
          }
          target.constructor.__arrayTypeInfo__.set(propertyKey, type);
        };
      }
      function MapType(keyType, valueType) {
        return function (target, propertyKey) {
          if (!target.constructor.__mapTypeInfo__) {
            target.constructor.__mapTypeInfo__ = new Map();
          }
          target.constructor.__mapTypeInfo__.set(propertyKey, {
            keyType,
            valueType
          });
        };
      }
      class ObjectUtility {
        static fromPlainObject(targetClass, plain) {
          return ObjectUtility.restoreObjectState(targetClass, plain);
        }
        static fromStringValue(targetClass, text) {
          try {
            const jsonObj = JSON.parse(text);
            return this.restoreObjectState(targetClass, jsonObj);
          } catch (error) {
            LogMgr.error('ObjectUtil fromString Failed to parse JSON:', error);
            return new targetClass();
          }
        }

        /**
         * 将 JSON 对象与类型化对象的默认值进行合并
         * 如果 JSON 对象没有某个字段，使用类型化对象的默认值
         * 如果 JSON 对象有类型化对象没有的字段，则忽略
         * @param targetClass 目标类型构造函数
         * @param jsonData JSON 对象数据
         * @returns 合并后的类型化对象
         */
        static mergeWithDefaultValues(targetClass, jsonData) {
          // 创建默认实例
          const defaultInstance = new targetClass();
          if (!jsonData || typeof jsonData !== 'object') {
            return defaultInstance;
          }

          // 获取类型元数据
          const typeInfo = targetClass.prototype.constructor.__typeInfo__ || new Map();
          const arrayTypeInfo = targetClass.prototype.constructor.__arrayTypeInfo__ || new Map();
          const mapTypeInfo = targetClass.prototype.constructor.__mapTypeInfo__ || new Map();

          // 遍历默认实例的所有属性
          for (const key in defaultInstance) {
            // 检查 JSON 数据中是否有对应字段
            if (jsonData.hasOwnProperty(key)) {
              const jsonValue = jsonData[key];
              if (jsonValue === null || jsonValue === undefined) {
                // JSON 中值为 null 或 undefined，使用默认值
                continue;
              }

              // 处理 Map 类型（使用 @MapType 装饰器的字段）
              const mapType = mapTypeInfo.get(key);
              if (mapType) {
                const {
                  keyType,
                  valueType
                } = mapType;
                const resultObj = {};

                // 处理对象格式 { key: value, key: value }
                if (typeof jsonValue === 'object' && !Array.isArray(jsonValue)) {
                  for (const [k, v] of Object.entries(jsonValue)) {
                    const restoredKey = this.restoreValueState(keyType, k);
                    const restoredValue = this.restoreValueState(valueType, v);
                    resultObj[restoredKey] = restoredValue;
                  }
                }
                defaultInstance[key] = resultObj;
                continue;
              }

              // 处理数组类型
              const arrayType = arrayTypeInfo.get(key);
              if (arrayType && Array.isArray(jsonValue)) {
                defaultInstance[key] = jsonValue.map(item => this.restoreObjectState(arrayType, item));
                continue;
              }

              // 处理对象类型
              const type = typeInfo.get(key);
              if (type && typeof jsonValue === 'object' && !Array.isArray(jsonValue)) {
                defaultInstance[key] = this.restoreObjectState(type, jsonValue);
                continue;
              }

              // 处理基本类型
              defaultInstance[key] = jsonValue;
            }
            // 如果 JSON 中没有对应字段，保持默认值不变
          }

          return defaultInstance;
        }
        static restoreObjectState(targetClass, data) {
          const instance = new targetClass();
          if (!data || typeof data !== 'object') {
            return instance;
          }

          // 获取类型元数据
          const typeInfo = targetClass.prototype.constructor.__typeInfo__ || new Map();
          const arrayTypeInfo = targetClass.prototype.constructor.__arrayTypeInfo__ || new Map();
          const mapTypeInfo = targetClass.prototype.constructor.__mapTypeInfo__ || new Map();
          for (const key in data) {
            const value = data[key];
            if (value === null || value === undefined) {
              continue;
            }

            // 检查是否是 Map 类型
            const mapType = mapTypeInfo.get(key);
            if (mapType) {
              const map = new Map();
              const {
                keyType,
                valueType
              } = mapType;

              // 处理 Map 数据
              if (Array.isArray(value)) {
                // 如果是数组格式 [[key, value], [key, value]]
                for (const [k, v] of value) {
                  const restoredKey = this.restoreValueState(keyType, k);
                  const restoredValue = this.restoreValueState(valueType, v);
                  map.set(restoredKey, restoredValue);
                }
              } else if (typeof value === 'object') {
                // 如果是对象格式 { key: value, key: value }
                for (const [k, v] of Object.entries(value)) {
                  const restoredKey = this.restoreValueState(keyType, k);
                  const restoredValue = this.restoreValueState(valueType, v);
                  map.set(restoredKey, restoredValue);
                }
              }
              instance[key] = map;
              continue;
            }

            // 处理其他类型
            if (typeof value === 'object') {
              if (Array.isArray(value)) {
                const arrayType = arrayTypeInfo.get(key);
                if (arrayType) {
                  instance[key] = value.map(item => this.restoreObjectState(arrayType, item));
                } else {
                  instance[key] = value;
                }
              } else {
                const type = typeInfo.get(key);
                if (type) {
                  instance[key] = this.restoreObjectState(type, value);
                } else {
                  instance[key] = value;
                }
              }
            } else {
              instance[key] = value;
            }
          }
          return instance;
        }
        static restoreValueState(type, value) {
          if (value === null || value === undefined) {
            return value;
          }
          if (type === String) {
            return String(value);
          } else if (type === Number) {
            return Number(value);
          } else if (type === Boolean) {
            return Boolean(value);
          } else if (typeof value === 'object') {
            // 对于复杂对象类型，使用 restoreObject 方法
            return this.restoreObjectState(type, value);
          }
          return value;
        }
      }
      exports('ObjectUtility', ObjectUtility);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Order.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './ResMgr.ts', './DataEnums.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, _decorator, Component, Label, SpriteFrame, Sprite, director, ResMgr, EventID;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
      Label = module.Label;
      SpriteFrame = module.SpriteFrame;
      Sprite = module.Sprite;
      director = module.director;
    }, function (module) {
      ResMgr = module.ResMgr;
    }, function (module) {
      EventID = module.EventID;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2;
      cclegacy._RF.push({}, "7611bKit7VGEqVPoNF5jP3S", "Order", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let Order = exports('Order', (_dec = ccclass('Order'), _dec2 = property(Node), _dec3 = property(Node), _dec(_class = (_class2 = class Order extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "item", _descriptor, this);
          _initializerDefineProperty(this, "time", _descriptor2, this);
          this.orderTime = 10;
          this.orderId = 0;
          this.orderPosId = 0;
          this.isStartCountdown = false;
          this.isFinished = false;
        }
        get countdownState() {
          return this.isStartCountdown;
        }
        set countdownState(isStart) {
          if (this.isStartCountdown == false && isStart == true) {
            this.schedule(this.countDown, 1);
          } else if (this.isStartCountdown == true && isStart == false) {
            this.stopOrderCountdown();
          }
          this.isStartCountdown = isStart;
        }
        onLoad() {
          let str = this.formatTime(this.orderTime);
          this.time.getComponent(Label).string = str;
        }
        setOrder(orderId, orderTime, orderPosId) {
          this.orderTime = orderTime;
          this.orderId = orderId;
          this.orderPosId = orderPosId;
          this.isFinished = false;
          ResMgr.instance.loadAsset(`textures/order/order${orderId}/spriteFrame`, SpriteFrame, spriteFrame => {
            this.item.getComponent(Sprite).spriteFrame = spriteFrame;
          });
          let str = this.formatTime(this.orderTime);
          this.time.getComponent(Label).string = str;

          // this.schedule(this.countDown, 1);
        }

        countDown() {
          let str = this.formatTime(this.orderTime);
          this.time.getComponent(Label).string = str;
          this.orderTime--;
          if (this.orderTime < 0) {
            this.unschedule(this.countDown);
            director.emit(EventID.ORDER_TIME_OUT, this);
          }
        }
        stopOrderCountdown() {
          this.unschedule(this.countDown);
        }
        formatTime(seconds) {
          const minutes = Math.floor(seconds / 60);
          const remainingSeconds = Math.floor(seconds % 60);
          return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        }
        onDisable() {
          this.stopOrderCountdown();
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "item", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "time", [_dec3], {
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

System.register("chunks:///_virtual/PageMgr.ts", ['cc', './ResMgr.ts', './LogMgr.ts', './BasePage.ts'], function (exports) {
  var cclegacy, director, Prefab, instantiate, ResMgr, LogMgr, BasePage;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      director = module.director;
      Prefab = module.Prefab;
      instantiate = module.instantiate;
    }, function (module) {
      ResMgr = module.ResMgr;
    }, function (module) {
      LogMgr = module.LogMgr;
    }, function (module) {
      BasePage = module.BasePage;
    }],
    execute: function () {
      cclegacy._RF.push({}, "7bc98knO49PoLBvcgrLNSQb", "PageMgr", undefined);
      class PageMgr {
        constructor() {
          /** ui层级 */
          this.uiRoot = null;
          this.toastRoot = null;
          this.aniRoot = null;
          /**游戏中菜单 */
          this.memuPage = void 0;
        }
        static get instance() {
          if (!this._instance) {
            this._instance = new PageMgr();
            this._instance.init();
          }
          return this._instance;
        }
        init() {
          let canvas = director.getScene().getChildByName("Canvas");
          this.uiRoot = canvas.getChildByName("uiRoot");
          this.toastRoot = canvas.getChildByName("toastRoot");
          this.aniRoot = canvas.getChildByName("aniRoot");
        }

        /*
        * @PageType 界面区分 弹窗界面加个背景压黑;
        * @url ResPath.ResPaths.xx 
        */

        static openPage(obj, PageType = UIPAGE_TYPE.PAGE, data, cb) {
          if (obj instanceof Prefab) {
            let Page = instantiate(obj);
            if (Page) {
              this.addPagebyPrefab(Page, Page.name, PageType);
            } else {
              LogMgr.log("OPEN PAGE failed");
            }
          } else if (typeof obj === "string") {
            let name = obj;
            if (name) {
              let PagePrefab = ResMgr.instance.getPrefab(name);
              if (PagePrefab) {
                this.addPagebyPrefab(PagePrefab, name, PageType, data);
              } else {
                ResMgr.instance.loadPage(name, () => {
                  let PagePrefab = ResMgr.instance.getPrefab(name);
                  this.addPagebyPrefab(PagePrefab, name, PageType, data);
                });
              }
            } else {
              LogMgr.log("page name is null");
            }
          }
        }
        static getPage(name) {
          if (this._pages[name]) {
            return this._pages[name];
          }
          return null;
        }
        static closePage(name, PageType = UIPAGE_TYPE.PAGE) {
          let page = this._pages[name];
          if (page) {
            page.removeFromParent();
            page.destroy();
            delete this._pages[name];
            LogMgr.log("close page", name);
          }
        }
        static addPagebyPrefab(pre, url, PageType, data = null) {
          if (pre) {
            let Page = instantiate(pre);
            if (this._pages[url] && Page.name != "toast") {
              return;
            }
            this._pages[url] = Page;
            switch (PageType) {
              case UIPAGE_TYPE.PAGE:
                PageMgr.instance.uiRoot.addChild(Page);
                break;
              case UIPAGE_TYPE.ALERT:
                PageMgr.instance.toastRoot.addChild(Page);
                break;
            }
            if (data) {
              Page.getComponent(BasePage).initData(data);
            }
          }
        }
      }
      exports('PageMgr', PageMgr);
      PageMgr._instance = null;
      PageMgr._pages = {};
      let UIPAGE_TYPE = exports('UIPAGE_TYPE', /*#__PURE__*/function (UIPAGE_TYPE) {
        UIPAGE_TYPE[UIPAGE_TYPE["PAGE"] = 1] = "PAGE";
        UIPAGE_TYPE[UIPAGE_TYPE["ALERT"] = 2] = "ALERT";
        return UIPAGE_TYPE;
      }({}));
      let UIPage = exports('UIPage', /*#__PURE__*/function (UIPage) {
        UIPage["WelcomeView"] = "prefabs/game/WelcomeView";
        UIPage["StoryView"] = "prefabs/game/StoryView";
        UIPage["StartView"] = "prefabs/game/StartView";
        UIPage["HomeView"] = "prefabs/game/HomeView";
        UIPage["Game"] = "prefabs/game/Game";
        UIPage["ResultView"] = "prefabs/game/ResultView";
        UIPage["SettingView"] = "prefabs/game/SettingView";
        UIPage["BackGroundView"] = "prefabs/game/BackGroundView";
        UIPage["BackGroundDetailView"] = "prefabs/game/BackGroundDetailView";
        UIPage["PiggyBankView"] = "prefabs/game/PiggyBankView";
        UIPage["PiggyBankAwardView"] = "prefabs/game/PiggyBankAwardView";
        UIPage["CollectView"] = "prefabs/game/CollectView";
        UIPage["CollectDetailView"] = "prefabs/game/CollectDetailView";
        UIPage["GetAwardView"] = "prefabs/game/GetAwardView";
        UIPage["PrivacyView"] = "prefabs/game/PrivacyView";
        UIPage["LoadingView"] = "prefabs/game/LoadingView";
        UIPage["Toast"] = "prefabs/toast";
        return UIPage;
      }({}));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/piggyBankAwardView.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BasePage.ts', './PageMgr.ts', './GameDataMgr.ts', './DataEnums.ts', './AudioMgr.ts', './barSortBridge.ts', './adMgr.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, Label, SpriteFrame, _decorator, Vec3, tween, Sprite, director, BasePage, PageMgr, UIPage, GameDataMgr, EventID, AudioMgr, AUDIO_NAME, barSortBridge, Vibration, adMgr;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      Label = module.Label;
      SpriteFrame = module.SpriteFrame;
      _decorator = module._decorator;
      Vec3 = module.Vec3;
      tween = module.tween;
      Sprite = module.Sprite;
      director = module.director;
    }, function (module) {
      BasePage = module.BasePage;
    }, function (module) {
      PageMgr = module.PageMgr;
      UIPage = module.UIPage;
    }, function (module) {
      GameDataMgr = module.GameDataMgr;
    }, function (module) {
      EventID = module.EventID;
    }, function (module) {
      AudioMgr = module.AudioMgr;
      AUDIO_NAME = module.AUDIO_NAME;
    }, function (module) {
      barSortBridge = module.barSortBridge;
      Vibration = module.Vibration;
    }, function (module) {
      adMgr = module.adMgr;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7;
      cclegacy._RF.push({}, "32351Dk2QNJO5jr+RZppJGp", "piggyBankAwardView", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let piggyBankAwardView = exports('piggyBankAwardView', (_dec = ccclass('piggyBankAwardView'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property(Node), _dec6 = property(Label), _dec7 = property(Node), _dec8 = property({
        type: [SpriteFrame]
      }), _dec(_class = (_class2 = class piggyBankAwardView extends BasePage {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "layout1", _descriptor, this);
          _initializerDefineProperty(this, "layout2", _descriptor2, this);
          _initializerDefineProperty(this, "piggyImg", _descriptor3, this);
          _initializerDefineProperty(this, "light", _descriptor4, this);
          _initializerDefineProperty(this, "awardNum", _descriptor5, this);
          _initializerDefineProperty(this, "lblGet", _descriptor6, this);
          _initializerDefineProperty(this, "sprPiggyFrame", _descriptor7, this);
        }
        onEnable() {
          barSortBridge.vibrate(30, Vibration.NORMAL);
          this.scheduleOnce(() => {
            AudioMgr.instance.playEffect(AUDIO_NAME.piggy_reward);
          }, 0.2);
          this.layout1.active = true;
          this.layout2.active = false;
          this.light.active = false;
          this.playShakeAnimation();
          this.awardNum.getComponent(Label).string = "x" + 1000;
        }
        playShakeAnimation() {
          if (!this.piggyImg) return;
          const originalRotation = new Vec3(0, 0, 0);
          tween(this.piggyImg).to(0.1, {
            eulerAngles: new Vec3(0, 0, -10)
          }).to(0.2, {
            eulerAngles: new Vec3(0, 0, 10)
          }).to(0.1, {
            eulerAngles: originalRotation
          }).call(() => {
            this.piggyImg.getComponent(Sprite).spriteFrame = this.sprPiggyFrame[1];
          }).delay(0.1).call(() => {
            this.light.active = true;
            this.light.scale = new Vec3(0, 0, 0);
            tween(this.light).to(0.1, {
              scale: new Vec3(1, 1, 1)
            }).call(() => {
              this.layout1.active = false;
              this.layout2.active = true;
            }).start();
          }).start();
        }
        clickGetBtnHandle() {
          AudioMgr.instance.playEffect(AUDIO_NAME.btn_click);
          barSortBridge.vibrate(30, Vibration.LIGHT);
          adMgr.instance.openVideoAd("piggyBank", (entry, success) => {
            this.getAward(true);
            PageMgr.closePage(UIPage.PiggyBankAwardView);
          });
        }
        clickBtnHandle() {
          AudioMgr.instance.playEffect(AUDIO_NAME.btn_click);
          barSortBridge.vibrate(30, Vibration.LIGHT);
          this.getAward(false);
          PageMgr.closePage(UIPage.PiggyBankAwardView);
        }
        getAward(isAd) {
          let multiple = isAd ? 2 : 1;
          let gdMgr = GameDataMgr.instance;
          gdMgr.data.coin += 1000 * multiple;
          gdMgr.data.canAwardBank = false;
          gdMgr.saveData();
          director.emit(EventID.UPDATE_ACCOUNT);
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "layout1", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "layout2", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "piggyImg", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "light", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "awardNum", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "lblGet", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "sprPiggyFrame", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/piggyBankView.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BasePage.ts', './GameDataMgr.ts', './PageMgr.ts', './AudioMgr.ts', './barSortBridge.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, ProgressBar, Node, _decorator, BasePage, GameDataMgr, PageMgr, UIPage, AudioMgr, AUDIO_NAME, barSortBridge, Vibration;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      ProgressBar = module.ProgressBar;
      Node = module.Node;
      _decorator = module._decorator;
    }, function (module) {
      BasePage = module.BasePage;
    }, function (module) {
      GameDataMgr = module.GameDataMgr;
    }, function (module) {
      PageMgr = module.PageMgr;
      UIPage = module.UIPage;
    }, function (module) {
      AudioMgr = module.AudioMgr;
      AUDIO_NAME = module.AUDIO_NAME;
    }, function (module) {
      barSortBridge = module.barSortBridge;
      Vibration = module.Vibration;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2;
      cclegacy._RF.push({}, "8c8d6hkAK5BsrNdY0WN5wFf", "piggyBankView", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let piggyBankView = exports('piggyBankView', (_dec = ccclass('piggyBankView'), _dec2 = property(ProgressBar), _dec3 = property(Node), _dec(_class = (_class2 = class piggyBankView extends BasePage {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "progressBar", _descriptor, this);
          _initializerDefineProperty(this, "coinLayout", _descriptor2, this);
          this.progress = [0, 0, 0.5, 1];
        }
        onEnable() {
          AudioMgr.instance.playEffect(AUDIO_NAME.show_page);
          barSortBridge.vibrate(30, Vibration.NORMAL);
          let gdMgr = GameDataMgr.instance;
          let level = gdMgr.data.level;
          let index = (level - 1) % 3;
          let value = this.progress[index];
          this.progressBar.progress = value;
          for (let i = 1; i <= this.coinLayout.children.length; i++) {
            if (i <= index) {
              this.coinLayout.children[i - 1].active = true;
            } else {
              this.coinLayout.children[i - 1].active = false;
            }
          }
        }
        closeSelf() {
          AudioMgr.instance.playEffect(AUDIO_NAME.btn_click);
          barSortBridge.vibrate(30, Vibration.LIGHT);
          PageMgr.closePage(UIPage.PiggyBankView);
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "progressBar", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "coinLayout", [_dec3], {
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

System.register("chunks:///_virtual/privacyView.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BasePage.ts', './PageMgr.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, WebView, _decorator, sys, BasePage, PageMgr, UIPage, UIPAGE_TYPE;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      WebView = module.WebView;
      _decorator = module._decorator;
      sys = module.sys;
    }, function (module) {
      BasePage = module.BasePage;
    }, function (module) {
      PageMgr = module.PageMgr;
      UIPage = module.UIPage;
      UIPAGE_TYPE = module.UIPAGE_TYPE;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "dff6dU5tyxGn4XIThdoAUXe", "privacyView", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let privacyView = exports('privacyView', (_dec = ccclass('privacyView'), _dec2 = property(WebView), _dec(_class = (_class2 = class privacyView extends BasePage {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "webView", _descriptor, this);
        }
        onEnable() {
          switch (sys.platform) {
            case sys.Platform.IOS:
              this.webView.url = 'https://less7dim.today/privacy.html';
              // this.webView.evaluateJS("mx:pop");
              break;
          }
        }
        onCloseHandle() {
          PageMgr.closePage(UIPage.PrivacyView, UIPAGE_TYPE.PAGE);
        }
      }, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "webView", [_dec2], {
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

System.register("chunks:///_virtual/RandomUtility.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "35ccegevL9CB4sWnkgbh/fb", "RandomUtility", undefined);
      class RandomUtility {
        static generateRandomValue(arg1, arg2) {
          if (typeof arg1 === 'number' && typeof arg2 === 'number') {
            return this.generateRandomNumber(arg1, arg2);
          } else if (Array.isArray(arg1)) {
            if (Array.isArray(arg2)) {
              return this.selectRandomByWeightArray(arg1, arg2);
            } else if (typeof arg2 === 'string') {
              return this.selectRandomByWeightKey(arg1, arg2);
            } else if (typeof arg2 === 'number') {
              return this.selectRandomElementsInArray(arg1, arg2);
            } else {
              return this.selectRandomElementInArray(arg1);
            }
          } else {
            return this.generateRandomString(arg1);
          }
        }
        static generateRandomString(length) {
          const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          let result = '';
          for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
          }
          return result;
        }
        static generateRandomNumber(start, end) {
          return Math.floor(Math.random() * (end - start + 1) + start);
        }
        static selectRandomByWeightArray(values, weights) {
          if (weights.length !== values.length) {
            return this.selectRandomElementInArray(values);
          }
          const index = this.selectRandomIndexByWeight(weights);
          return values[index];
        }
        static selectRandomByWeightKey(values, weightKey) {
          const weights = values.map(value => value[weightKey] || 0);
          return this.selectRandomByWeightArray(values, weights);
        }
        static selectRandomIndexByWeight(weights) {
          const sum = weights.reduce((acc, cur) => acc + cur, 0);
          let randomNew = Math.random() * sum;
          for (let i = 0; i < weights.length; i++) {
            randomNew -= weights[i];
            if (randomNew < 0) {
              return i;
            }
          }
          return this.generateRandomNumber(0, weights.length - 1);
        }
        static selectRandomElementInArray(values) {
          return values[this.generateRandomNumber(0, values.length - 1)];
        }
        static selectRandomElementsInArray(arr, count) {
          if (count == 1) {
            return [this.selectRandomElementInArray(arr)];
          }
          if (count >= arr.length) {
            return this.shuffleArray(this.shuffleArray(arr));
          }
          const shuffled = arr.slice(); // 创建副本以避免修改原数组
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // 生成 [0, i] 范围内的随机索引
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // 交换元素
          }

          return shuffled.slice(0, count);
        }
        static shuffleArray(arr) {
          const shuffled = arr.slice(); // 创建副本以避免修改原数组
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // 生成 [0, i] 范围内的随机索引
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // 交换元素
          }

          return shuffled;
        }
      }
      exports('RandomUtility', RandomUtility);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/request-manager.ts", ['cc', './config.ts', './CommonUtility.ts', './http-agent.ts'], function (exports) {
  var cclegacy, Config, CommonUtility, HttpAgent;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      Config = module.Config;
    }, function (module) {
      CommonUtility = module.CommonUtility;
    }, function (module) {
      HttpAgent = module.HttpAgent;
    }],
    execute: function () {
      cclegacy._RF.push({}, "dc366IyApNEkIKWblcR5g+h", "request-manager", undefined);
      class ReqeustManager {
        constructor() {
          this.timeout = 6000;
          // 请求超时时间（毫秒）
          this.maxRetries = 2;
          // 最大重试次数
          this.retryDelay = 300;
          // 每次重试的间隔时间（毫秒）
          this.header = {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          };
        }
        static get instance() {
          if (!this._instance) {
            this._instance = new ReqeustManager();
          }
          return this._instance;
        }
        async get(url, params) {
          return this.requestWithRetry(url, 'GET', this.timeout, params);
        }
        async post(url, params) {
          return this.requestWithRetry(url, 'POST', this.timeout, params);
        }
        async requestWithRetry(url, method, timeout, params, retries = this.maxRetries) {
          try {
            // 尝试发送请求
            return await this.request(url, method, timeout, params);
          } catch (error) {
            if (retries > 0) {
              console.warn(`Request failed. Retrying... (${this.maxRetries - retries + 1}/${this.maxRetries})`);
              await CommonUtility.delayExecution(this.retryDelay);
              return this.requestWithRetry(url, method, timeout, params, retries - 1);
            } else {
              console.error('Request failed after maximum retries:', error);
              throw error;
            }
          }
        }
        async request(url, method, timeout, params) {
          url = Config.API_URL + url;
          const headers = this.buildHeader();
          console.log(`${method} - Request URL:${url} , params:${params}`);
          return HttpAgent.request(url, method, headers, timeout, params);
        }
        buildHeader(headers) {
          if (!!headers) {
            return new Headers({
              ...this.header,
              ...headers
            });
          }
          return new Headers(this.header);
        }
      }
      exports('ReqeustManager', ReqeustManager);
      ReqeustManager._instance = void 0;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ResMgr.ts", ['cc', './LogMgr.ts'], function (exports) {
  var cclegacy, resources, Prefab, LogMgr;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      resources = module.resources;
      Prefab = module.Prefab;
    }, function (module) {
      LogMgr = module.LogMgr;
    }],
    execute: function () {
      cclegacy._RF.push({}, "9b767AgzhNF36TMj8GxCoA8", "ResMgr", undefined);
      class ResMgr {
        static get instance() {
          if (!this._instance) {
            this._instance = new ResMgr();
          }
          return this._instance;
        }
        constructor() {
          this.UICache = {};
          this.spriteCache = {};
          this.stageCache = {};
        }
        /*
        * 加载预制体;
        */
        loadPage(name, cb) {
          let load = this.UICache[name];
          if (load) {
            cb && cb();
          } else {
            resources.load(name, Prefab, (error, asset) => {
              if (error) {
                LogMgr.log("loadPage_error:", error);
                return;
              }
              this.UICache[name] = asset;
              cb && cb(asset);
            });
          }
        }
        getPrefab(name) {
          return this.UICache[name];
        }
        loadAsset(path, typeClass, cb, cacheName = null) {
          resources.load(path, typeClass, (error, asset) => {
            if (error) {
              LogMgr.log("loadPage_error:", error);
              return;
            }
            cb && cb(asset);
          });
        }
        loadAAndReturnAsset(path, typeClass, cacheName = null) {
          return new Promise((resolve, reject) => {
            resources.load(path, typeClass, (error, asset) => {
              if (error) {
                LogMgr.log("loadPage_error:", error);
                reject(error);
                return;
              }
              if (cacheName) {
                this[cacheName][path] = asset;
              }
              resolve(asset);
            });
          });
        }
        perloadSprites(path, typeClass, cacheName = null) {
          return new Promise((resolve, reject) => {
            resources.loadDir(path, typeClass, (error, asset) => {
              if (error) {
                LogMgr.log("loadPage_error:", error);
                reject(error);
                return;
              }
              for (let i = 0; i < asset.length; i++) {
                this.spriteCache[asset[i].name] = asset[i];
              }
              resolve(asset);
            });
          });
        }
      }
      exports('ResMgr', ResMgr);
      ResMgr._instance = null;
      ResMgr.PackgeName = {
        Res: "Res"
      };
      ResMgr.ResPaths = {
        CommonTip: "prefabs/common/CommonTip",
        LoginPage: "prefabs/Page/LoginPage",
        HUDPage: "prefabs/Page/HUDPage",
        LoadingPage: "prefabs/Page/LoadingPage",
        Language: "Jsons/Language",
        CommonAlert: "",
        SetAlert: "prefabs/Alert/SetAlert",
        TalkPage: "prefabs/Page/TalkPage",
        OtherPlayer: "prefabs/common/OtherPlayer",
        MainPage: "prefabs/scene/MainPage",
        PackagePage: "prefabs/Page/PackagePage"
      };
      let cacheType = exports('cacheType', /*#__PURE__*/function (cacheType) {
        cacheType["UICache"] = "UICache";
        cacheType["spriteCache"] = "spriteCache";
        return cacheType;
      }({}));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/resultView.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BasePage.ts', './PageMgr.ts', './DataEnums.ts', './AudioMgr.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, _decorator, director, BasePage, PageMgr, UIPage, EventID, AudioMgr, AUDIO_NAME;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      _decorator = module._decorator;
      director = module.director;
    }, function (module) {
      BasePage = module.BasePage;
    }, function (module) {
      PageMgr = module.PageMgr;
      UIPage = module.UIPage;
    }, function (module) {
      EventID = module.EventID;
    }, function (module) {
      AudioMgr = module.AudioMgr;
      AUDIO_NAME = module.AUDIO_NAME;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3;
      cclegacy._RF.push({}, "57463lC6YtG65TnfWF0nGnf", "resultView", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let resultView = exports('resultView', (_dec = ccclass('resultView'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec(_class = (_class2 = class resultView extends BasePage {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "winNode", _descriptor, this);
          _initializerDefineProperty(this, "loseNode", _descriptor2, this);
          _initializerDefineProperty(this, "closeNode", _descriptor3, this);
        }
        initData(data) {
          if (data.iswin == true) {
            AudioMgr.instance.playEffect(AUDIO_NAME.level_win);
            this.winNode.active = true;
            this.loseNode.active = false;
          } else {
            AudioMgr.instance.playEffect(AUDIO_NAME.level_lose);
            this.loseNode.active = true;
            this.winNode.active = false;
          }
          this.scheduleOnce(() => {
            PageMgr.closePage(UIPage.Game);
            PageMgr.closePage(UIPage.ResultView);
            PageMgr.openPage(UIPage.HomeView);
          }, 1.5);
        }
        closeHandle() {
          PageMgr.closePage(UIPage.Game);
          PageMgr.closePage(UIPage.ResultView);
          director.emit(EventID.NEXT_LEVEL);
        }
        update(deltaTime) {}
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "winNode", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "loseNode", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "closeNode", [_dec4], {
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

System.register("chunks:///_virtual/settingView.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BasePage.ts', './GameDataMgr.ts', './AudioMgr.ts', './PageMgr.ts', './barSortBridge.ts', './adMgr.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, _decorator, BasePage, GameDataMgr, AudioMgr, AUDIO_NAME, PageMgr, UIPage, UIPAGE_TYPE, barSortBridge, Vibration, adMgr;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      _decorator = module._decorator;
    }, function (module) {
      BasePage = module.BasePage;
    }, function (module) {
      GameDataMgr = module.GameDataMgr;
    }, function (module) {
      AudioMgr = module.AudioMgr;
      AUDIO_NAME = module.AUDIO_NAME;
    }, function (module) {
      PageMgr = module.PageMgr;
      UIPage = module.UIPage;
      UIPAGE_TYPE = module.UIPAGE_TYPE;
    }, function (module) {
      barSortBridge = module.barSortBridge;
      Vibration = module.Vibration;
    }, function (module) {
      adMgr = module.adMgr;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6;
      cclegacy._RF.push({}, "61238r0MUFFmo21e1AbFgbW", "settingView", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let settingView = exports('settingView', (_dec = ccclass('settingView'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property(Node), _dec6 = property(Node), _dec7 = property(Node), _dec(_class = (_class2 = class settingView extends BasePage {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "musicToggle", _descriptor, this);
          _initializerDefineProperty(this, "effectToggle", _descriptor2, this);
          _initializerDefineProperty(this, "vibrationToggle", _descriptor3, this);
          _initializerDefineProperty(this, "contactUsNode", _descriptor4, this);
          _initializerDefineProperty(this, "moreGameNode", _descriptor5, this);
          _initializerDefineProperty(this, "privacyNode", _descriptor6, this);
        }
        onEnable() {
          AudioMgr.instance.playEffect(AUDIO_NAME.show_page);
          barSortBridge.vibrate(30, Vibration.NORMAL);
          let gdMgr = GameDataMgr.instance;
          this.musicToggle.active = gdMgr.settingConfig.music;
          this.effectToggle.active = gdMgr.settingConfig.effect;
          this.vibrationToggle.active = gdMgr.settingConfig.vibration;
        }
        MusicClickHandle() {
          AudioMgr.instance.playEffect(AUDIO_NAME.btn_click);
          let gdMgr = GameDataMgr.instance;
          gdMgr.settingConfig.music = !gdMgr.settingConfig.music;
          this.musicToggle.active = gdMgr.settingConfig.music;
          if (gdMgr.settingConfig.music) {
            AudioMgr.instance.playMusic(AUDIO_NAME.BG_MUSIC);
          } else {
            AudioMgr.instance.pause();
          }
          gdMgr.saveData();
        }
        EffectClickHandle() {
          AudioMgr.instance.playEffect(AUDIO_NAME.btn_click);
          let gdMgr = GameDataMgr.instance;
          gdMgr.settingConfig.effect = !gdMgr.settingConfig.effect;
          this.effectToggle.active = gdMgr.settingConfig.effect;
          gdMgr.saveData();
        }
        VibrationClickHandle() {
          AudioMgr.instance.playEffect(AUDIO_NAME.btn_click);
          let gdMgr = GameDataMgr.instance;
          gdMgr.settingConfig.vibration = !gdMgr.settingConfig.vibration;
          this.vibrationToggle.active = gdMgr.settingConfig.vibration;
          gdMgr.saveData();
        }
        contactUsClickHandle() {
          AudioMgr.instance.playEffect(AUDIO_NAME.btn_click);
          let title = `【Drinks Sort】Feedback and Suggestions`;
          let content = `Please enter your feedback or problems!\nWe will respond and handle them quickly!`;
          barSortBridge.contactUs("tyrique@sacmuseum.us", title, content);
        }
        privacyClickHandle() {
          AudioMgr.instance.playEffect(AUDIO_NAME.btn_click);
          PageMgr.openPage(UIPage.PrivacyView, UIPAGE_TYPE.PAGE);
        }
        moreGameClickHandle() {
          AudioMgr.instance.playEffect(AUDIO_NAME.btn_click);
          adMgr.instance.openVideoAd("test", (entry, success) => {});
        }
        closeSelf() {
          AudioMgr.instance.playEffect(AUDIO_NAME.btn_click);
          barSortBridge.vibrate(30, Vibration.LIGHT);
          PageMgr.closePage(UIPage.SettingView);
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "musicToggle", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "effectToggle", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "vibrationToggle", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "contactUsNode", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "moreGameNode", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "privacyNode", [_dec7], {
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

System.register("chunks:///_virtual/startView.ts", ['cc', './BasePage.ts', './PageMgr.ts', './barSortBridge.ts'], function (exports) {
  var cclegacy, _decorator, BasePage, PageMgr, UIPage, UIPAGE_TYPE, barSortBridge, Vibration;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }, function (module) {
      BasePage = module.BasePage;
    }, function (module) {
      PageMgr = module.PageMgr;
      UIPage = module.UIPage;
      UIPAGE_TYPE = module.UIPAGE_TYPE;
    }, function (module) {
      barSortBridge = module.barSortBridge;
      Vibration = module.Vibration;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "c709cwhQeJFobt51sQx9jLg", "startView", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let startView = exports('startView', (_dec = ccclass('startView'), _dec(_class = class startView extends BasePage {
        closeSelf() {
          PageMgr.closePage(UIPage.StartView);
          PageMgr.openPage(UIPage.HomeView, UIPAGE_TYPE.PAGE);
          barSortBridge.vibrate(30, Vibration.LIGHT);
        }
      }) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/storage-manager.ts", ['cc', './RandomUtility.ts', './LogMgr.ts'], function (exports) {
  var cclegacy, sys, RandomUtility, LogMgr;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      sys = module.sys;
    }, function (module) {
      RandomUtility = module.RandomUtility;
    }, function (module) {
      LogMgr = module.LogMgr;
    }],
    execute: function () {
      cclegacy._RF.push({}, "cf0dbh4vhlGoblSd8hSlFwo", "storage-manager", undefined);
      class StorageManager {
        constructor() {}
        static get instance() {
          if (!this._instance) {
            this._instance = new StorageManager();
          }
          return this._instance;
        }
        getUid() {
          var uid = sys.localStorage.getItem("uid");
          if (!uid) {
            uid = this.generateUid();
            sys.localStorage.setItem("uid", uid);
          }
          return uid;
        }
        generateUid() {
          return RandomUtility.generateRandomValue(32);
        }
        getJson(key, defaultValue) {
          try {
            const r = this.get(key);
            LogMgr.log("getJson", key, r);
            return r && JSON.parse(r) || defaultValue;
          } catch (error) {
            LogMgr.error("getJson error", key, error);
            return null;
          }
        }
        get(key, defaultValue = "") {
          if (null == key) {
            console.error("存储的key不能为空");
            return null;
          }
          let str = sys.localStorage.getItem(key);
          if (null === str) {
            return defaultValue;
          }
          return str;
        }
        set(key, value) {
          if (null == key) {
            console.error("存储的key不能为空");
            return;
          }
          if (null == value) {
            console.warn("存储的值为空，则直接移除该存储");
            this.remove(key);
            return;
          }
          if (typeof value === 'function') {
            console.error("储存的值不能为方法");
            return;
          }
          if (typeof value === 'object') {
            try {
              value = JSON.stringify(value);
            } catch (e) {
              console.error(`解析失败，str = ${value}`);
              return;
            }
          } else if (typeof value === 'number') {
            value = value + "";
          } else if (typeof value === 'boolean') {
            value = String(value);
          }
          sys.localStorage.setItem(key, value);
        }

        /** 获取指定关键字的布尔值 */
        getBoolean(key) {
          const r = this.get(key);
          return r.toLowerCase() === 'true';
        }
        remove(key) {
          if (null == key) {
            console.error("存储的key不能为空");
            return;
          }
          sys.localStorage.removeItem(key);
        }
        clear() {
          sys.localStorage.clear();
        }
      }
      exports('StorageManager', StorageManager);
      StorageManager._instance = void 0;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/StorageMgr.ts", ['cc'], function (exports) {
  var cclegacy, sys;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      sys = module.sys;
    }],
    execute: function () {
      cclegacy._RF.push({}, "432ceI3LSFJL5b75NrTfJFj", "StorageMgr", undefined);
      class StorageMgr {
        static get instance() {
          if (this._instance == null) {
            this._instance = new StorageMgr();
          }
          return this._instance;
        }
        saveDataToLocal(key, value) {
          if (null == key) {
            console.error("存储的key不能为空");
            return;
          }
          if (null == value) {
            console.warn("存储的值为空，则直接移除该存储");
            this.removeData(key);
            return;
          }
          if (typeof value === 'function') {
            console.error("储存的值不能为方法");
            return;
          }
          if (typeof value === 'object') {
            try {
              value = JSON.stringify(value);
            } catch (e) {
              console.error(`解析失败，str = ${value}`);
              return;
            }
          } else if (typeof value === 'number') {
            value = value + "";
          } else if (typeof value === 'boolean') {
            value = String(value);
          }
          sys.localStorage.setItem(key, value);
        }
        removeData(key) {
          if (null == key) {
            console.error("存储的key不能为空");
            return;
          }
          sys.localStorage.removeItem(key);
        }
        static mergeWithDefaults(targetClass, jsonData) {
          // 创建默认实例
          const defaultInstance = new targetClass();
          if (!jsonData || typeof jsonData !== 'object') {
            return defaultInstance;
          }

          // 获取类型元数据
          const typeInfo = targetClass.prototype.constructor.__typeInfo__ || new Map();
          const arrayTypeInfo = targetClass.prototype.constructor.__arrayTypeInfo__ || new Map();
          const mapTypeInfo = targetClass.prototype.constructor.__mapTypeInfo__ || new Map();

          // 遍历默认实例的所有属性
          for (const key in defaultInstance) {
            // 检查 JSON 数据中是否有对应字段
            if (jsonData.hasOwnProperty(key)) {
              const jsonValue = jsonData[key];
              if (jsonValue === null || jsonValue === undefined) {
                // JSON 中值为 null 或 undefined，使用默认值
                continue;
              }

              // 处理 Map 类型（使用 @MapType 装饰器的字段）
              const mapType = mapTypeInfo.get(key);
              if (mapType) {
                const {
                  keyType,
                  valueType
                } = mapType;
                const resultObj = {};

                // 处理对象格式 { key: value, key: value }
                if (typeof jsonValue === 'object' && !Array.isArray(jsonValue)) {
                  for (const [k, v] of Object.entries(jsonValue)) {
                    const restoredKey = this.restoreValue(keyType, k);
                    const restoredValue = this.restoreValue(valueType, v);
                    resultObj[restoredKey] = restoredValue;
                  }
                }
                defaultInstance[key] = resultObj;
                continue;
              }

              // 处理数组类型
              const arrayType = arrayTypeInfo.get(key);
              if (arrayType && Array.isArray(jsonValue)) {
                defaultInstance[key] = jsonValue.map(item => this.restoreObject(arrayType, item));
                continue;
              }

              // 处理对象类型
              const type = typeInfo.get(key);
              if (type && typeof jsonValue === 'object' && !Array.isArray(jsonValue)) {
                defaultInstance[key] = this.restoreObject(type, jsonValue);
                continue;
              }

              // 处理基本类型
              defaultInstance[key] = jsonValue;
            }
            // 如果 JSON 中没有对应字段，保持默认值不变
          }

          return defaultInstance;
        }
        static restoreValue(type, value) {
          if (value === null || value === undefined) {
            return value;
          }
          if (type === String) {
            return String(value);
          } else if (type === Number) {
            return Number(value);
          } else if (type === Boolean) {
            return Boolean(value);
          } else if (typeof value === 'object') {
            // 对于复杂对象类型，使用 restoreObject 方法
            return this.restoreObject(type, value);
          }
          return value;
        }
        static restoreObject(targetClass, data) {
          const instance = new targetClass();
          if (!data || typeof data !== 'object') {
            return instance;
          }

          // 获取类型元数据
          const typeInfo = targetClass.prototype.constructor.__typeInfo__ || new Map();
          const arrayTypeInfo = targetClass.prototype.constructor.__arrayTypeInfo__ || new Map();
          const mapTypeInfo = targetClass.prototype.constructor.__mapTypeInfo__ || new Map();
          for (const key in data) {
            const value = data[key];
            if (value === null || value === undefined) {
              continue;
            }

            // 检查是否是 Map 类型
            const mapType = mapTypeInfo.get(key);
            if (mapType) {
              const map = new Map();
              const {
                keyType,
                valueType
              } = mapType;

              // 处理 Map 数据
              if (Array.isArray(value)) {
                // 如果是数组格式 [[key, value], [key, value]]
                for (const [k, v] of value) {
                  const restoredKey = this.restoreValue(keyType, k);
                  const restoredValue = this.restoreValue(valueType, v);
                  map.set(restoredKey, restoredValue);
                }
              } else if (typeof value === 'object') {
                // 如果是对象格式 { key: value, key: value }
                for (const [k, v] of Object.entries(value)) {
                  const restoredKey = this.restoreValue(keyType, k);
                  const restoredValue = this.restoreValue(valueType, v);
                  map.set(restoredKey, restoredValue);
                }
              }
              instance[key] = map;
              continue;
            }

            // 处理其他类型
            if (typeof value === 'object') {
              if (Array.isArray(value)) {
                const arrayType = arrayTypeInfo.get(key);
                if (arrayType) {
                  instance[key] = value.map(item => this.restoreObject(arrayType, item));
                } else {
                  instance[key] = value;
                }
              } else {
                const type = typeInfo.get(key);
                if (type) {
                  instance[key] = this.restoreObject(type, value);
                } else {
                  instance[key] = value;
                }
              }
            } else {
              instance[key] = value;
            }
          }
          return instance;
        }
        static mergeFrom(to, from) {
          if (to == null || from == null || from == undefined) {
            return;
          }
          for (var key in from) {
            let value = from[key];
            if (value == null) continue;
            if (typeof value == 'undefined') continue;
            if (value && to[key] && value instanceof Object && key in to && !(value instanceof Array)) {
              //是对象，且非空，非数组
              this.mergeFrom(to[key], value);
            } else {
              //其他直接复制
              to[key] = value;
            }
          }
        }
      }
      exports('StorageMgr', StorageMgr);
      StorageMgr._instance = void 0;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/storyView.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BasePage.ts', './PageMgr.ts', './GameDataMgr.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, _decorator, UIOpacity, tween, BasePage, PageMgr, UIPage, UIPAGE_TYPE, GameDataMgr;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      _decorator = module._decorator;
      UIOpacity = module.UIOpacity;
      tween = module.tween;
    }, function (module) {
      BasePage = module.BasePage;
    }, function (module) {
      PageMgr = module.PageMgr;
      UIPage = module.UIPage;
      UIPAGE_TYPE = module.UIPAGE_TYPE;
    }, function (module) {
      GameDataMgr = module.GameDataMgr;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3;
      cclegacy._RF.push({}, "c589fSdjrxOFoMzTQT8mbi6", "storyView", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let storyView = exports('storyView', (_dec = ccclass('storyView'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec(_class = (_class2 = class storyView extends BasePage {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "page1", _descriptor, this);
          _initializerDefineProperty(this, "page2", _descriptor2, this);
          _initializerDefineProperty(this, "nextBtn", _descriptor3, this);
          this.plots = [];
          this.curPlotId = -1;
          this.plotShowTime = 0;
          this.delayTime = 3;
        }
        onLoad() {
          this.page1.active = true;
          this.page2.active = false;
          for (let i = 0; i < this.page1.children.length; i++) {
            const plot = this.page1.getChildByName(`${i}`);
            this.plots.push(plot);
            plot.active = false;
          }
          for (let i = 0; i < this.page2.children.length; i++) {
            const plot = this.page2.getChildByName(`${i + 5}`);
            this.plots.push(plot);
            plot.active = false;
          }
          this.showStoryPage(0);
        }
        update(dt) {
          if (this.page1.active && this.curPlotId < 4 || this.page2.active && this.curPlotId < 10) {
            this.plotShowTime += dt;
            if (this.plotShowTime > 1.5) {
              this.showStoryPage(++this.curPlotId);
              this.plotShowTime = 0;
            }
          }
        }
        onDisable() {
          let gdMgr = GameDataMgr.instance;
          gdMgr.data.isPlayStory = true;
          // PageMgr.openPage(UIPage.StartView, UIPAGE_TYPE.PAGE);
          gdMgr.saveData();
        }
        handleBtnNext() {
          if (this.page1.active) {
            this.page1.active = false;
            this.page2.active = true;
            this.showStoryPage(5);
          } else if (this.page2.active) {
            PageMgr.closePage(UIPage.StoryView);
            PageMgr.openPage(UIPage.StartView, UIPAGE_TYPE.PAGE);
          }
        }
        onClickPage() {
          if (this.page1.active && this.curPlotId < 4 || this.page2.active && this.curPlotId < 10) {
            this.nextStoryPage();
          }
        }
        nextStoryPage() {
          let plot = this.plots[this.curPlotId];
          if (plot) {
            let comp = plot.getComponent(UIOpacity);
            tween(comp).stop();
            comp.opacity = 255;
            if (this.curPlotId == 4 || this.curPlotId == 10) {
              this.nextBtn.active = true;
            }
          }
          this.showStoryPage(++this.curPlotId);
          this.plotShowTime = 0;
        }
        showStoryPage(id) {
          let plot = this.plots[id];
          if (!plot) {
            console.error(`page with id ${id} not found.`);
            return;
          }
          this.curPlotId = id;
          let uiOpacity = plot.getComponent(UIOpacity);
          uiOpacity.opacity = 0;
          plot.active = true;
          tween(uiOpacity).to(1, {
            opacity: 255
          }).call(() => {
            if (id == 4 || id == 10) {
              this.nextBtn.active = true;
            }
          }).start();
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "page1", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "page2", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "nextBtn", [_dec4], {
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

System.register("chunks:///_virtual/time-agent.ts", ['cc', './storage-manager.ts', './LogMgr.ts'], function (exports) {
  var cclegacy, _decorator, StorageManager, LogMgr;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }, function (module) {
      StorageManager = module.StorageManager;
    }, function (module) {
      LogMgr = module.LogMgr;
    }],
    execute: function () {
      var _dec, _class, _class2;
      cclegacy._RF.push({}, "2daf3++TXJF9oys9DChFRW+", "time-agent", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let TimeAgent = exports('TimeAgent', (_dec = ccclass('time_agent'), _dec(_class = (_class2 = class TimeAgent {
        constructor() {
          this._gmOffset = 0;
          this._serverOffet = 0;
        }
        static get instance() {
          if (this._instance === null) {
            this._instance = new TimeAgent();
            this._instance.init();
          }
          return this._instance;
        }
        init() {
          this._gmOffset = parseFloat(StorageManager.instance.get(`time_offset`, 0));
        }
        setServerTime(serverTime) {
          const clientTime = Date.now();
          LogMgr.log('TimeAgent serverTime:', serverTime, "Local time is: ", new Date(serverTime).toLocaleString(), "UTC time is: ", new Date(serverTime).toUTCString());
          LogMgr.log('TimeAgent clientTime:', clientTime, "Local time is: ", new Date(clientTime).toLocaleString(), "UTC time is: ", new Date(clientTime).toUTCString());
          this._serverOffet = serverTime - clientTime;
        }
        getTime() {
          const currentTime = Date.now() + this._serverOffet + this._gmOffset;
          // LogUtil.log('TimeAgent currentTime:', currentTime, "Local time is: ", new Date(currentTime).toLocaleString(), "UTC time is: ", new Date(currentTime).toUTCString());
          return currentTime;
        }
        addOffset(val) {
          this.setOffset(this._gmOffset + val);
        }
        setOffset(offset) {
          this._gmOffset = offset;
          StorageManager.instance.set(`time_offset`, this._gmOffset);
        }
      }, _class2._instance = null, _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/union-fetch-agent.ts", ['cc', './config.ts', './time-agent.ts', './GameDataMgr.ts', './LogMgr.ts', './request-manager.ts', './config-agent.ts', './data-agent.ts', './storage-manager.ts'], function (exports) {
  var cclegacy, Config, TimeAgent, GameDataMgr, LogMgr, ReqeustManager, ConfigAgent, ConfigType, DataType, DataAgent, StorageManager;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      Config = module.Config;
    }, function (module) {
      TimeAgent = module.TimeAgent;
    }, function (module) {
      GameDataMgr = module.GameDataMgr;
    }, function (module) {
      LogMgr = module.LogMgr;
    }, function (module) {
      ReqeustManager = module.ReqeustManager;
    }, function (module) {
      ConfigAgent = module.ConfigAgent;
      ConfigType = module.ConfigType;
    }, function (module) {
      DataType = module.DataType;
      DataAgent = module.DataAgent;
    }, function (module) {
      StorageManager = module.StorageManager;
    }],
    execute: function () {
      cclegacy._RF.push({}, "27bf4Vxv+tKk6senOBu/pQV", "union-fetch-agent", undefined);
      class UnionFetchAgent {
        /*
        需要notify的数据（一般是bundle），再保存到数据后，再notify
        主包里面使用的数据，直接init即可
        */
        static fetchUnionData() {
          const uid = StorageManager.instance.getUid();
          return new Promise((resolve, reject) => {
            ReqeustManager.instance.post(`/union/fetch/${uid}?debug=${Config.DEBUG}`, {
              code: Config.GAME_CODE,
              version: Config.GAME_VERSION
            }).then(data => {
              if (data['ret'] == 0) {
                // parse preset data
                const presetData = data['preset'];
                if (presetData) {
                  const presetPayload = presetData['payload'];
                  if (Array.isArray(presetPayload) && presetPayload.length > 0) {
                    for (const item of presetPayload) {
                      const category = item['category'];
                      const config = item;
                      ConfigAgent.saveRawConfig(category, config);
                      if (category == ConfigType.Main) {
                        GameDataMgr.instance.mainConfig = ConfigAgent.getConfig(ConfigType.Main);
                      }
                    }
                  }
                }

                // parse game data
                const playerData = data['player'];
                if (playerData) {
                  if (playerData['now']) {
                    const serverTime = playerData['now'];
                    if (!!serverTime && serverTime > 0) {
                      TimeAgent.instance.setServerTime(serverTime);
                    }
                    const savePlayerData = {
                      sid: playerData['sid'] || '',
                      major: playerData['tokenMajor'] || 0,
                      minor: playerData['tokenMinor'] || 0
                    };
                    if (playerData[DataType.Game]) {
                      const gameData = JSON.parse(playerData[DataType.Game]);
                      GameDataMgr.instance.initDataFromServer(gameData, savePlayerData);
                      DataAgent.saveData(DataType.Game, gameData);
                    }
                    if (playerData[DataType.Gain]) {
                      const gainData = JSON.parse(playerData[DataType.Gain]);
                      DataAgent.saveData(DataType.Gain, gainData);
                    }
                    DataAgent.saveData(DataType.Player, savePlayerData);
                  }
                }
              }
              resolve();
            }).catch(error => {
              LogMgr.error('error fetchUnionData:', error);
              // slient
              resolve();
            });
          });
        }
      }
      exports('UnionFetchAgent', UnionFetchAgent);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/water.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './env', './GlassCup.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Sprite, EffectAsset, _decorator, Component, Material, UITransform, Color, v2, Node, Label, v3, DEV, WaterColors;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Sprite = module.Sprite;
      EffectAsset = module.EffectAsset;
      _decorator = module._decorator;
      Component = module.Component;
      Material = module.Material;
      UITransform = module.UITransform;
      Color = module.Color;
      v2 = module.v2;
      Node = module.Node;
      Label = module.Label;
      v3 = module.v3;
    }, function (module) {
      DEV = module.DEV;
    }, function (module) {
      WaterColors = module.WaterColors;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2;
      cclegacy._RF.push({}, "1d866q6GeROiKW3fl629ZGB", "water", undefined);
      const {
        ccclass,
        property,
        requireComponent,
        executeInEditMode,
        disallowMultiple,
        executionOrder
      } = _decorator;
      var PourAction = /*#__PURE__*/function (PourAction) {
        PourAction[PourAction["none"] = 0] = "none";
        PourAction[PourAction["in"] = 1] = "in";
        PourAction[PourAction["out"] = 2] = "out";
        return PourAction;
      }(PourAction || {});
      let Water = exports('default', (_dec = requireComponent(Sprite), _dec2 = executionOrder(-100), _dec3 = property(EffectAsset), _dec4 = property({
        tooltip: DEV
      }), ccclass(_class = _dec(_class = executeInEditMode(_class = disallowMultiple(_class = _dec2(_class = (_class2 = class Water extends Component {
        constructor(...args) {
          super(...args);
          this._action = PourAction.none;
          this.infos = [];
          /**到这里停止倒水 */
          this.stopIdx = -1;
          /**当前是有几层水 */
          this.curIdx = 0;
          /**节点高宽比 */
          this._ratio = 1;
          _initializerDefineProperty(this, "effect", _descriptor, this);
          _initializerDefineProperty(this, "_skewAngle", _descriptor2, this);
          this._material = null;
          this.addHeight = 0;
          this.onOutStart = null;
          this.onOutFinish = null;
          this.onInFInish = null;
          this.dot = null;
        }
        get skewAngle() {
          return this._skewAngle;
        }
        set skewAngle(value) {
          value = Math.round(value * 100) / 100;
          // log("angle",value)
          this._skewAngle = value;
          this.updateAngleHeight();
        }
        get material() {
          if (this._material == null) {
            let sp = this.node.getComponent(Sprite);
            if (sp) {
              if (sp.spriteFrame) sp.spriteFrame.packable = false;
              // 生成并应用材质
              if (this.effect) {
                this._material = new Material();
                this._material.initialize({
                  effectAsset: this.effect
                });
                sp.setMaterial(this._material, 0);
              }
              this._material = sp.getSharedMaterial(0);
              this._material.setProperty("mainTexture", sp.spriteFrame.texture);
            }
          }
          return this._material;
        }
        onLoad() {
          this._ratio = this.node.getComponent(UITransform).height / this.node.getComponent(UITransform).width;
        }
        initInfos(infos) {
          this.infos = infos;
          this.curIdx = this.infos.length - 1;
          this.initSizeColor();
          this.updateAngleHeight();
        }
        addInfo(info) {
          this.addHeight = info.height;
          info.height = 0;
          this.infos.push(info);
          this._action = PourAction.in;
          this.curIdx = this.infos.length - 1;
          this.initSizeColor();
        }
        setPourOutCallback(onOutStart, onOutFinish) {
          this.onOutStart = onOutStart;
          this.onOutFinish = onOutFinish;
        }
        setPourInCallback(onInFInish) {
          this.onInFInish = onInFInish;
        }

        /**
         * 倾斜到哪个角度开始往外边倒水
         */
        getPourStartAngle() {
          let _height = 0;
          for (let i = 0; i <= this.curIdx; i++) {
            _height += this.infos[i].height;
          }
          return this.getCriticalAngleWithHeight(_height);
        }

        /**
         * 倾斜到哪个角度开始停止倒水（当前颜色的水倒完了）
         */
        getPourEndAngle() {
          this.stopIdx = this.curIdx - this.getTopSameColorNum();
          let _height = 0;
          for (let i = 0; i <= this.stopIdx; i++) {
            _height += this.infos[i].height;
          }
          return this.getCriticalAngleWithHeight(_height);
        }

        /**获取某一高度的水刚好碰到瓶口的临界倾斜角度 */
        getCriticalAngleWithHeight(_height) {
          let ret = 0;
          if (_height == 0) {
            ret = 90;
            return ret;
          }
          if (_height < 0.5) {
            //水的体积小于杯子的一半,先碰到下瓶底
            let tanVal = this._ratio / (_height * 2.0);
            ret = Math.atan(tanVal);
          } else {
            let tanVal = 2.0 * this._ratio * (1.0 - _height);
            ret = Math.atan(tanVal);
          }
          ret = radian2angle(ret);
          return ret;
        }
        getTopSameColorNum() {
          let sameColorNum = 0;
          let colorId = null;
          for (let i = this.curIdx; i >= 0; i--) {
            if (colorId == null) {
              sameColorNum++;
              colorId = this.infos[i].colorId;
            } else if (this.infos[i].colorId == colorId) {
              sameColorNum++;
            } else {
              break;
            }
          }
          console.log("sameColorNum:", sameColorNum);
          return sameColorNum;
        }

        /**
         * 开始倒水
         * 一直倒水直到不同颜色的水到达瓶口，为当前最大能倾斜的角度
         * @returns 返回值为倾斜角度的绝对值
         */
        onStartPour(emptyNum) {
          this._action = PourAction.out;
          let num = Math.min(emptyNum, this.getTopSameColorNum());
          this.stopIdx = this.curIdx - num; //this.getTopSameColorNum();
        }

        update() {
          if (this._action == PourAction.out) {
            this.pourStep();
          } else if (this._action == PourAction.in) {
            this.addStep();
          }
        }

        /**
         * 每帧调用，升高水面高度
         */
        addStep() {
          if (this.curIdx < 0) {
            return;
          }
          let info = this.infos[this.curIdx];
          info.height = Math.round((info.height + 0.005) * 1000) / 1000;
          // log("--------info.height",info.height)
          if (info.height >= this.addHeight) {
            info.height = this.addHeight;
            this._action = PourAction.none;
            if (this.onInFInish) {
              this.onInFInish();
              this.onInFInish = null;
            }
          }
          this.updateAngleHeight();
        }

        /**
         * * 每帧调用
         * * 降低水面高度 
         */
        pourStep() {
          if (this.curIdx < 0) {
            this._action = PourAction.none;
            return;
          }
          let _height = 0;
          for (let i = 0; i <= this.curIdx; i++) {
            _height += this.infos[i].height;
          }
          let is_top = false;
          let angle = this.skewAngle % 360 * Math.PI / 180.0;
          let _t = Math.abs(Math.tan(angle));
          if (_height < 0.5) {
            //水的体积小于杯子的一半,先碰到下瓶底
            is_top = _t > this._ratio / (_height * 2.0);
          } else {
            is_top = _t > 2.0 * this._ratio * (1.0 - _height);
          }
          let info = this.infos[this.curIdx];
          if (!is_top) {
            //没到瓶口，不往下倒
            if (info.height < 0.05) ;else {
              return;
            }
          }
          if (this.onOutStart) {
            this.onOutStart();
            this.onOutStart = null;
          }
          info.height = Math.round((info.height - 0.005) * 1000) / 1000;
          if (info.height < 0.01) {
            info.height = 0;
            this.infos.pop();
            this.curIdx--;
            let info1 = this.infos[this.curIdx];
            if (info1) {
              info1.isQuestion = false;
              let hex = WaterColors[info1.colorId];
              info1.color = new Color().fromHEX(hex);
              this.initInfos(this.infos);
            }
            // log("------this.curIdx",this.curIdx,this.stopIdx)
            if (this.curIdx == this.stopIdx) {
              if (this.onOutFinish) {
                this.onOutFinish();
                this.onOutFinish = null;
              }
              this._action = PourAction.none;
            }
          }
          // log("this.curIdx",this.curIdx,"info.height",info.height.toFixed(2),"angle",this.skewAngle.toFixed(2))
          this.updateAngleHeight();
        }
        initSizeColor() {
          for (let i = 0; i < this.infos.length; i++) {
            const c = this.infos[i].color;
            this.material.setProperty('color' + i, c);
          }
          let size = v2(this.node.getComponent(UITransform).width, this.node.getComponent(UITransform).height);
          this.material.setProperty('sizeRatio', size.y / size.x);
          this.material.setProperty('waveType', 0);
          this.material.setProperty("layerNum", this.infos.length);
        }
        updateAngleHeight() {
          for (let i = 0; i < 6; i++) {
            if (i < this.infos.length) {
              let h = this.infos[i].height;
              this.material.setProperty('height' + i, h);
            } else {
              this.material.setProperty('height' + i, 0);
            }
          }
          let radian = angle2radian(this._skewAngle);
          this.material.setProperty('skewAngle', radian * 1.0);
          let waveType = 0.0;
          if (this._action == PourAction.in) {
            waveType = 1.0;
          } else if (this._action == PourAction.out) {
            waveType = 2.0;
          }
          this.material.setProperty('waveType', waveType);
          this.material.setProperty("layerNum", this.infos.length);

          // this.showDebugCenter();
        }

        showDebugCenter() {
          if (this.dot == null) {
            this.dot = new Node();
            this.dot.parent = this.node;
            this.dot.addComponent(UITransform);
            let label = this.dot.addComponent(Label);
            label.string = "·";
            label.fontSize = 60;
            label.color = Color.RED;
          }
          let ratio = this.node.getComponent(UITransform).height / this.node.getComponent(UITransform).width;
          let angle = angle2radian(this.skewAngle);
          let _height = 0;
          if (this.curIdx >= this.infos.length) {
            return;
          }
          for (let i = 0; i <= this.curIdx; i++) {
            _height += this.infos[i].height;
          }
          let toLeft = Math.sin(angle) >= 0.0;
          let center = v2(0.5, 1.0 - _height); //水面倾斜时，以哪个店为中心店

          let _t = Math.abs(Math.tan(angle));
          if (_height <= 0.5) {
            //水的体积小于杯子的一半,先碰到下瓶底
            let is_bottom = _t > ratio * 2.0 * _height; //倾斜角度达到瓶底
            if (is_bottom) {
              center.x = Math.sqrt(2.0 * _height / _t * ratio) / 2.0;
              center.y = 1.0 - Math.sqrt(2.0 * _height * _t / ratio) / 2.0;
              let is_top = _t > ratio / (_height * 2.0); //倾斜角度达到瓶口
              if (is_top) {
                center.y = 0.5;
                center.x = _height;
              }
            }
            if (!toLeft) {
              center.x = 1.0 - center.x;
            }
            if (Math.abs(center.x - 0.25) < 0.01) ;
            // log("aa-------center",center.x.toFixed(2),center.y.toFixed(2));
          } else {
            //水比较多，先碰到上瓶底
            let is_top = _t > 2.0 * ratio * (1.0 - _height);
            if (is_top) {
              center.x = Math.sqrt(2.0 * ratio * (1.0 - _height) / _t) / 2.0;
              center.y = Math.sqrt(2.0 * ratio * (1.0 - _height) * _t) / 2.0 / ratio;
              let is_bottom = _t > ratio / (2.0 * (1.0 - _height));
              if (is_bottom) {
                center.y = 0.5;
                center.x = 1.0 - _height;
              }
            }
            if (toLeft) {
              center.x = 1.0 - center.x;
            }
            // log("bb-------center",center.x.toFixed(2),center.y.toFixed(2));
          }

          center.x = center.x - 0.5;
          center.y = -center.y + 0.5;
          let pt = v3(center.x * this.node.getComponent(UITransform).width, center.y * this.node.getComponent(UITransform).height);
          this.dot.position = pt;
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "effect", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_skewAngle", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _applyDecoratedDescriptor(_class2.prototype, "skewAngle", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "skewAngle"), _class2.prototype)), _class2)) || _class) || _class) || _class) || _class) || _class));
      function angle2radian(angle) {
        while (angle > 360) {
          angle -= 360;
        }
        while (angle < -360) {
          angle += 360;
        }
        return angle % 360 * Math.PI / 180.0;
      }
      function radian2angle(radian) {
        return radian / Math.PI * 180;
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/waterFlow.ts", ['cc', './AudioMgr.ts'], function (exports) {
  var cclegacy, Graphics, v3, Vec3, tween, AudioMgr;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Graphics = module.Graphics;
      v3 = module.v3;
      Vec3 = module.Vec3;
      tween = module.tween;
    }, function (module) {
      AudioMgr = module.AudioMgr;
    }],
    execute: function () {
      cclegacy._RF.push({}, "d1fd9hzUXNLu53dppXYhElO", "waterFlow", undefined);
      const dft_lingWidth = 6;
      class WaterFlow extends Graphics {
        constructor(...args) {
          super(...args);
          this._toPt = v3();
          this.from = v3();
        }
        onLoad() {
          super.onLoad();
          this.lineWidth = dft_lingWidth;
          this.lineCap = Graphics.LineCap.ROUND;
        }
        get toPt() {
          return this._toPt;
        }
        set toPt(val) {
          Vec3.copy(this._toPt, val);
          this.clear();
          this.moveTo(this.from.x, this.from.y);
          this.lineTo(this._toPt.x, this._toPt.y);
          this.stroke();
        }
        /**
         * 
         * @param from 
         * @param to 
         * @param dur 
         * @param isTail start water: false，last water: true
         */
        playFlowAni(from, to, dur, isTail, onComplete) {
          this.clear();
          let flow = this;
          if (isTail) {
            Vec3.copy(this.from, to);
          } else {
            let random = Math.floor(Math.random() * 7);
            let name = "audios/waterflow" + random;
            AudioMgr.instance.playEffect(name);
            Vec3.copy(this.from, from);
          }
          this.moveTo(this.from.x, this.from.y);
          let tw = tween(flow).set({
            toPt: from
          }).to(dur, {
            toPt: to
          }).call(onComplete()).start();
        }
        setLineScale(scale) {
          this.lineWidth = dft_lingWidth * scale;
        }
      }
      exports('WaterFlow', WaterFlow);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/welcome-hf-start.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './front-line.ts', './config.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, ProgressBar, Label, _decorator, Component, sys, director, FrontLineEvent, FrontLine, Config;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      ProgressBar = module.ProgressBar;
      Label = module.Label;
      _decorator = module._decorator;
      Component = module.Component;
      sys = module.sys;
      director = module.director;
    }, function (module) {
      FrontLineEvent = module.FrontLineEvent;
      FrontLine = module.FrontLine;
    }, function (module) {
      Config = module.Config;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;
      cclegacy._RF.push({}, "47ecangTVxCa7EltStD+FU7", "welcome-hf-start", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      const HOT_UPDATE_TIME_COST = exports('HOT_UPDATE_TIME_COST', 'hot_update_time_cost');
      let WelcomeHfStart = exports('WelcomeHfStart', (_dec = ccclass('WelcomeHfStart'), _dec2 = property(ProgressBar), _dec3 = property(Label), _dec4 = property(Label), _dec5 = property(Label), _dec(_class = (_class2 = class WelcomeHfStart extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "progressBar", _descriptor, this);
          _initializerDefineProperty(this, "lblProgress", _descriptor2, this);
          _initializerDefineProperty(this, "lblLoading", _descriptor3, this);
          _initializerDefineProperty(this, "lblVersion", _descriptor4, this);
          this.HOT_UPDATE_TIMESTAMP = 'hot_update_timestamp';
          this.HOT_UPDATE_THRESHOLD = 5 * 60 * 1000;
        }
        // 5分钟内的更新认为是刚更新过

        onLoad() {
          this.progressBar.progress = 0;
          this.lblProgress.string = '0%';
          console.log('OjaiTest-welcome-hf-start');
          // 检查是否刚进行过热更新
          if (this.isRecentlyUpdated()) {
            console.log('OjaiTest-检测到最近刚进行过热更新，直接进入游戏');
            this.enterGame();
            return;
          }
          this.updateVersion();

          // 发起热更新检查
          this.startHotUpdate();
        }
        start() {
          this.updateLoadingLabel();
        }
        onEnable() {
          this.node.on(FrontLineEvent.UPDATE_PROGRESS, this.updateProgress, this);
          this.node.on(FrontLineEvent.UPDATE_SUCCESS, this.onUpdateSuccess, this);
          this.node.on(FrontLineEvent.UPDATE_FAILED, this.onUpdateFailed, this);
          this.node.on(FrontLineEvent.ALREADY_UP_TO_DATE, this.onAlreadyUpToDate, this);
          this.node.on(FrontLineEvent.UPDATE_ERROR, this.onUpdateError, this);
        }
        onDisable() {
          this.node.off(FrontLineEvent.UPDATE_PROGRESS, this.updateProgress, this);
          this.node.off(FrontLineEvent.UPDATE_SUCCESS, this.onUpdateSuccess, this);
          this.node.off(FrontLineEvent.UPDATE_FAILED, this.onUpdateFailed, this);
          this.node.off(FrontLineEvent.ALREADY_UP_TO_DATE, this.onAlreadyUpToDate, this);
          this.node.off(FrontLineEvent.UPDATE_ERROR, this.onUpdateError, this);
        }

        /**
         * 检查是否最近刚进行过热更新
         */
        isRecentlyUpdated() {
          const lastUpdateTime = sys.localStorage.getItem(this.HOT_UPDATE_TIMESTAMP);
          if (!lastUpdateTime) {
            return false;
          }
          const timestamp = parseInt(lastUpdateTime);
          const currentTime = Date.now();
          const timeDiff = currentTime - timestamp;
          console.log(`OjaiTest-距离上次更新时间: ${timeDiff}ms`);
          return timeDiff < this.HOT_UPDATE_THRESHOLD;
        }

        /**
         * 记录热更新时间
         */
        recordUpdateTime() {
          sys.localStorage.setItem(this.HOT_UPDATE_TIMESTAMP, Date.now().toString());
          console.log('OjaiTest-记录热更新时间');
        }

        /**
         * 开始热更新流程
         */
        startHotUpdate() {
          let startTime = Date.now();
          console.log('OjaiTest-开始热更新检查');
          const frontLine = this.node.getComponent(FrontLine);
          if (!frontLine) {
            console.error('OjaiTest-FrontLine组件未找到');
            this.enterGame();
            return;
          }
          frontLine.toStart((success, message) => {
            if (success) {
              console.log('OjaiTest-热更新成功');
              let endTime = Date.now();
              console.log(`OjaiTest-热更新成功，耗时：${endTime - startTime}ms`);
              sys.localStorage.setItem(HOT_UPDATE_TIME_COST, ((endTime - startTime) / 1000).toFixed(2));
              this.updateVersion();
            } else {
              console.log('OjaiTest-热更新失败', message);
              this.enterGame();
            }
          });
        }

        /**
         * 更新进度回调
         */
        updateProgress(progress) {
          this.progressBar.progress = progress;
          this.lblProgress.string = `${Math.floor(progress * 100)}%`;
        }

        /**
         * 热更新成功回调
         */
        onUpdateSuccess() {
          console.log('OjaiTest-热更新成功，准备重启游戏');
          this.recordUpdateTime();
          // 重启游戏，会重新回到这个场景
          // 注意：game.restart() 会在 front-line.ts 的 onUpdateSuccess 中被调用
        }

        /**
         * 热更新失败回调
         */
        onUpdateFailed() {
          console.log('OjaiTest-热更新失败，继续进入游戏');
          this.enterGame();
        }

        /**
         * 已经是最新版本回调
         */
        onAlreadyUpToDate() {
          console.log('OjaiTest-已经是最新版本，直接进入游戏');
          this.enterGame();
        }

        /**
         * 热更新错误回调
         */
        onUpdateError() {
          console.log('OjaiTest-热更新出错，继续进入游戏');
          this.enterGame();
        }

        /**
         * 进入游戏主场景
         */
        enterGame() {
          console.log('OjaiTest-进入游戏主场景');
          // 根据配置决定进入哪个场景
          if (Config.ENABLE_SG) {
            director.loadScene('gameScene-sg');
          } else {
            director.loadScene('welcome');
          }
        }

        /**
         * 开始显示hello world动画，每隔1秒增加一个点，最多3个点，然后循环
         */
        updateLoadingLabel() {
          //每隔1s 变化一个点 需要循环
          let dotCount = 0;
          this.schedule(() => {
            // 生成对应数量的点
            let suffix = '.'.repeat(dotCount);
            const text = 'Loading' + suffix;
            this.lblLoading.string = text;

            // 增加点数，最多3个，然后循环重置
            dotCount = (dotCount + 1) % 4;
          }, 1);
        }
        updateVersion() {
          let frontLine = this.node.getComponent(FrontLine);
          if (frontLine) {
            this.lblVersion.string = frontLine.getVersion();
          }
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "progressBar", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "lblProgress", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "lblLoading", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "lblVersion", [_dec5], {
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

System.register("chunks:///_virtual/welcomeView.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './AudioMgr.ts', './GameDataMgr.ts', './ResMgr.ts', './BasePage.ts', './PageMgr.ts', './connectMgr.ts', './barSortBridge.ts', './union-fetch-agent.ts', './config.ts', './mount-manager.ts', './mount-dot.ts', './config-agent.ts', './LogMgr.ts', './front-line.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, ProgressBar, Label, _decorator, SpriteFrame, director, sys, AudioMgr, AUDIO_NAME, GameDataMgr, SgState, ResMgr, BasePage, UIPage, connectMgr, barSortBridge, UnionFetchAgent, Config, MountManager, MountDot, ConfigAgent, ConfigType, LogMgr, FrontLineEvent, FrontLine, HOT_UPDATE_TIMESTAMP, HOT_UPDATE_TIME_COST;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      ProgressBar = module.ProgressBar;
      Label = module.Label;
      _decorator = module._decorator;
      SpriteFrame = module.SpriteFrame;
      director = module.director;
      sys = module.sys;
    }, function (module) {
      AudioMgr = module.AudioMgr;
      AUDIO_NAME = module.AUDIO_NAME;
    }, function (module) {
      GameDataMgr = module.GameDataMgr;
      SgState = module.SgState;
    }, function (module) {
      ResMgr = module.ResMgr;
    }, function (module) {
      BasePage = module.BasePage;
    }, function (module) {
      UIPage = module.UIPage;
    }, function (module) {
      connectMgr = module.connectMgr;
    }, function (module) {
      barSortBridge = module.barSortBridge;
    }, function (module) {
      UnionFetchAgent = module.UnionFetchAgent;
    }, function (module) {
      Config = module.Config;
    }, function (module) {
      MountManager = module.MountManager;
    }, function (module) {
      MountDot = module.MountDot;
    }, function (module) {
      ConfigAgent = module.ConfigAgent;
      ConfigType = module.ConfigType;
    }, function (module) {
      LogMgr = module.LogMgr;
    }, function (module) {
      FrontLineEvent = module.FrontLineEvent;
      FrontLine = module.FrontLine;
      HOT_UPDATE_TIMESTAMP = module.HOT_UPDATE_TIMESTAMP;
      HOT_UPDATE_TIME_COST = module.HOT_UPDATE_TIME_COST;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2;
      cclegacy._RF.push({}, "6bd0381SgVNaIIEB7Oxo5CR", "welcomeView", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let welcomeView = exports('welcomeView', (_dec = ccclass('welcomeView'), _dec2 = property(ProgressBar), _dec3 = property(Label), _dec(_class = (_class2 = class welcomeView extends BasePage {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "progressBar", _descriptor, this);
          _initializerDefineProperty(this, "lblLoading", _descriptor2, this);
          this.lockProgress = 100;
          this.currentProgress = 0;
          this.targetProgress = 100;
          this.step = 0.7;
          this.pointNum = 0;
          this.timeCount = 0;
          this.isChangeScene = false;
          this.HOT_UPDATE_THRESHOLD = 5 * 60 * 1000;
        }
        // 5分钟内的更新认为是刚更新过

        onLoad() {
          GameDataMgr.instance.loadDataFromLocal();
          ResMgr.instance.loadPage(UIPage.Game, null);
          AudioMgr.instance.playMusic(AUDIO_NAME.BG_MUSIC);
          this.progressBar.progress = this.currentProgress / this.targetProgress;
        }
        async start() {
          barSortBridge.instance.setupNativeEventListner(async () => {
            connectMgr.init();
            this.lockProgress = 30;
            await UnionFetchAgent.fetchUnionData();
            Config.INIT_FETCH_DATA = true;
            this.notifyAfterDataFetch();
            this.lockProgress = 50;
            await this.preloadRes();
          });
        }
        onEnable() {
          this.schedule(this.updateForFlagChange, 1);
          this.schedule(this.updateLoadingLabel, 0.5);
          this.node.on(FrontLineEvent.UPDATE_PROGRESS, this.updateProgress, this);
          this.node.on(FrontLineEvent.UPDATE_SUCCESS, this.onUpdateSuccess, this);
          this.node.on(FrontLineEvent.UPDATE_FAILED, this.onUpdateFailed, this);
          this.node.on(FrontLineEvent.ALREADY_UP_TO_DATE, this.onAlreadyUpToDate, this);
          this.node.on(FrontLineEvent.UPDATE_ERROR, this.onUpdateError, this);
        }
        onDisable() {
          this.unschedule(this.updateForFlagChange);
          this.unschedule(this.updateLoadingLabel);
          this.node.off(FrontLineEvent.UPDATE_PROGRESS, this.updateProgress, this);
          this.node.off(FrontLineEvent.UPDATE_SUCCESS, this.onUpdateSuccess, this);
          this.node.off(FrontLineEvent.UPDATE_FAILED, this.onUpdateFailed, this);
          this.node.off(FrontLineEvent.ALREADY_UP_TO_DATE, this.onAlreadyUpToDate, this);
          this.node.off(FrontLineEvent.UPDATE_ERROR, this.onUpdateError, this);
        }
        async preloadRes() {
          await ResMgr.instance.perloadSprites("textures/collect", SpriteFrame);
          await ResMgr.instance.perloadSprites("textures/background", SpriteFrame);
        }
        notifyAfterDataFetch() {
          MountManager.instance.notify(MountDot.RemoteWebConfigUpdated, ConfigAgent.getConfig(ConfigType.Web));
        }
        update(dt) {
          this.currentProgress += this.step;
          if (this.currentProgress > this.targetProgress) {
            this.currentProgress = this.targetProgress;
          }
          if (this.currentProgress >= this.lockProgress) {
            this.currentProgress = this.lockProgress;
          }
          let progress = this.currentProgress / this.targetProgress;
          this.setProgress(progress);
        }
        setProgress(progress) {
          if (progress < 0) {
            progress = 0;
          } else if (progress > 1) {
            progress = 1;
          }
          this.progressBar.progress = progress;
          if (this.currentProgress == this.targetProgress && !this.isChangeScene) {
            this.isChangeScene = true;
            if (Config.ENABLE_SG) {
              GameDataMgr.instance.sg.state = SgState.Started;
              director.loadScene("welcome_sg");
            } else {
              director.loadScene("gameScene");
            }
          }
        }
        async updateForFlagChange() {
          let time = 5;
          let preloadTime = GameDataMgr.instance.mainConfig.sg.preload_time;
          ++this.timeCount;
          LogMgr.log('updateForFlagChanged: timeCount:' + this.timeCount);
          if (this.timeCount >= time + preloadTime) {
            this.enterNext();
            return;
          }
          if (Config.ENABLE_SG) {
            this.startHotUpdate();
          } else if (Config.isFlagChanged) {
            if (Config.getRFlag()) {
              this.startHotUpdate();
            } else {
              if (this.timeCount >= time) {
                this.enterNext();
              }
            }
          }
        }
        toStartUpdate() {
          console.log('OjaiTest-welcome-hf-pre');
          // 检查是否刚进行过热更新
          if (this.isRecentlyUpdated()) {
            console.log('OjaiTest-检测到最近刚进行过热更新，直接进入游戏');
            this.enterNext();
            return;
          }

          // 获取并记录当前版本号
          const frontLine = this.node.getComponent(FrontLine);
          if (frontLine) {
            frontLine.logCurrentVersion();
          }
          this.startHotUpdate();
        }
        updateLoadingLabel() {
          let suffix = '.'.repeat(this.pointNum);
          const text = 'Loading' + suffix;
          this.lblLoading.string = text;

          // 增加点数，最多3个，然后循环重置
          this.pointNum = (this.pointNum + 1) % 4;
        }

        /**
        * 检查是否最近刚进行过热更新
        */
        isRecentlyUpdated() {
          const lastUpdateTime = sys.localStorage.getItem(HOT_UPDATE_TIMESTAMP);
          if (!lastUpdateTime) {
            return false;
          }
          const timestamp = parseInt(lastUpdateTime);
          const currentTime = Date.now();
          const timeDiff = currentTime - timestamp;
          console.log(`OjaiTest-距离上次更新时间: ${timeDiff}ms`);
          return timeDiff < this.HOT_UPDATE_THRESHOLD;
        }

        /**
         * 记录热更新时间
         */
        recordUpdateTime() {
          sys.localStorage.setItem(HOT_UPDATE_TIMESTAMP, Date.now().toString());
          console.log('OjaiTest-记录热更新时间');
        }

        /**
         * 开始热更新流程
         */
        startHotUpdate() {
          const frontLine = this.node.getComponent(FrontLine);
          if (!frontLine) {
            console.error('OjaiTest-FrontLine组件未找到');
            this.enterNext();
            return;
          }

          // 获取版本号并拆分
          const version = frontLine.getVersion();
          const versionParts = version.split('.');
          const lastPart = parseInt(versionParts[versionParts.length - 1]);

          // 判断最后一位是否为0
          if (lastPart !== 0) {
            console.log(`OjaiTest-版本号最后一位不为0，跳过热更新，版本号: ${version}`);
            this.enterNext();
            return;
          }
          let startTime = Date.now();
          console.log('OjaiTest-开始热更新检查');
          frontLine.toStart((success, message) => {
            if (success) {
              console.log('OjaiTest-热更新成功');
              let endTime = Date.now();
              console.log(`OjaiTest-热更新成功，耗时：${endTime - startTime}ms`);
              sys.localStorage.setItem(HOT_UPDATE_TIME_COST, ((endTime - startTime) / 1000).toFixed(2));
            } else {
              console.log('OjaiTest-热更新失败', message);
              this.enterNext();
            }
          });
        }

        /**
         * 更新进度回调
         */
        updateProgress(progress) {
          this.lockProgress = 50 + progress / 2;
          // this.lblLoading.string = `${Math.floor(progress * 100)}%`;
        }

        /**
         * 热更新成功回调
         */
        onUpdateSuccess() {
          console.log('OjaiTest-热更新成功，准备重启游戏');
          this.recordUpdateTime();
          // 重启游戏，会重新回到这个场景
          // 注意：game.restart() 会在 front-line.ts 的 onUpdateSuccess 中被调用
        }

        /**
         * 热更新失败回调
         */
        onUpdateFailed() {
          console.log('OjaiTest-热更新失败，继续进入游戏');
          this.enterNext();
        }

        /**
         * 已经是最新版本回调
         */
        onAlreadyUpToDate() {
          console.log('OjaiTest-已经是最新版本，直接进入游戏');
          this.enterNext();
        }

        /**
         * 热更新错误回调
         */
        onUpdateError() {
          console.log('OjaiTest-热更新出错，继续进入游戏');
          this.enterNext();
        }

        /**
         * 进入游戏主场景
         */
        enterNext() {
          this.lockProgress = 100;
          console.log('OjaiTest-进入下一个场景');
          // 根据配置决定进入哪个场景
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "progressBar", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "lblLoading", [_dec3], {
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
  r('virtual:///prerequisite-imports/main', 'chunks:///_virtual/main'); 
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