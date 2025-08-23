System.register("chunks:///_virtual/action-chain.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "d5c2aE5Nh9EQ61+rIT/9ijj", "action-chain", undefined);
      class ActionChain {
        constructor() {
          // 所有动作的键集合，用于检查唯一性
          this._actionKeys = new Set();
          // 队列动作列表
          this._queueActions = new Map();
          // 正在执行的队列
          this._executingQueues = new Set();
        }
        static get instance() {
          if (!this._instance) {
            this._instance = new ActionChain();
          }
          return this._instance;
        }
        addAction(queueKey, key, action) {
          // 如果动作已存在，返回false
          const actionKey = `${queueKey}_${key}`;
          if (this._actionKeys.has(actionKey)) {
            console.log('phiz:addAction:ActionChain', queueKey, key, 'action already exists');
            return false;
          }

          // 获取或创建队列的动作列表
          let queueActions = this._queueActions.get(queueKey);
          if (!queueActions) {
            queueActions = [];
            this._queueActions.set(queueKey, queueActions);
          }

          // 添加动作
          this._actionKeys.add(actionKey);
          queueActions.push({
            actionKey,
            action
          });

          // 如果队列未在执行，开始执行
          if (!this._executingQueues.has(queueKey)) {
            this._executeQueue(queueKey);
          }
          return true;
        }
        _executeQueue(queueKey) {
          // 标记队列开始执行
          this._executingQueues.add(queueKey);
          const queueActions = this._queueActions.get(queueKey);
          if (!queueActions) {
            this._executingQueues.delete(queueKey);
            return;
          }
          const actionObj = queueActions.shift();
          if (!actionObj) {
            this._queueActions.delete(queueKey);
            this._executingQueues.delete(queueKey);
            return;
          }
          const {
            actionKey,
            action
          } = actionObj;
          action().then(() => {
            this._actionKeys.delete(actionKey);
            // 继续执行队列中的下一个动作
            this._executeQueue(queueKey);
          }).catch(error => {
            this._actionKeys.delete(actionKey);
            // 继续执行队列中的下一个动作
            this._executeQueue(queueKey);
          });
        }

        // 取消队列中的所有动作
        cancelQueue(queueKey) {
          const queueActions = this._queueActions.get(queueKey);
          if (queueActions) {
            // 清理队列中所有动作的key
            queueActions.forEach(({
              actionKey
            }) => this._actionKeys.delete(actionKey));
            this._queueActions.delete(queueKey);
            this._executingQueues.delete(queueKey);
          }
        }
        cancelAllQueue() {
          this._queueActions.forEach((queueActions, queueKey) => {
            queueActions.forEach(({
              actionKey
            }) => this._actionKeys.delete(actionKey));
            this._queueActions.delete(queueKey);
          });
        }

        //待优化
        removeAction(queueKey, key) {
          const actionKey = `${queueKey}_${key}`;
          this._actionKeys.delete(actionKey);
          this._executingQueues.delete(queueKey);
        }
      }
      exports('ActionChain', ActionChain);
      ActionChain._instance = void 0;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ad-agent.ts", ['cc', './ui-manager.ts', './log-util.ts', './ui-config.ts', './connect-agent.ts', './audio-manager.ts'], function (exports) {
  var cclegacy, sys, UIManager, LogUtil, UIID, ConnectAgent, AudioManager;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      sys = module.sys;
    }, function (module) {
      UIManager = module.UIManager;
    }, function (module) {
      LogUtil = module.LogUtil;
    }, function (module) {
      UIID = module.UIID;
    }, function (module) {
      ConnectAgent = module.ConnectAgent;
    }, function (module) {
      AudioManager = module.AudioManager;
    }],
    execute: function () {
      var _class;
      cclegacy._RF.push({}, "a2f71GncFhIs5/UeFAftUps", "ad-agent", undefined);
      class AdAgent {
        static resetVideoAdRequest() {
          this.currentVideoAdRequest.entry = "";
          this.currentVideoAdRequest.revenued = false;
          this.currentVideoAdRequest.callback = null;
          this.currentVideoAdRequest.retryCount = 0;
          this.currentVideoAdRequest.isStarted = false;
        }
        static resetInterstitialAdRequest() {
          this.currentInterstitialAdRequest.entry = "";
          this.currentInterstitialAdRequest.callback = null;
        }
        static openVideoAd(entry, callback) {
          LogUtil.log("AdAgent Open video ad", entry);
          this.resetVideoAdRequest();
          if (sys.isBrowser) {
            LogUtil.log("AdAgent Open video ad in browser", entry);
            UIManager.instance.open(UIID.Loading, {
              desc: "Loading...",
              displayTime: 3,
              onClose: () => {
                if (callback) {
                  callback(entry, true);
                }
              }
            });
          } else {
            // Open video ad
            LogUtil.log("AdAgent Open video ad native", entry);
            this.currentVideoAdRequest.entry = entry;
            this.currentVideoAdRequest.callback = callback;
            ConnectAgent.openVideoAd(entry);
          }
        }
        static openInterstitialAd(entry, callback) {
          console.log("AdAgent Open interstitial ad", entry);
          this.resetInterstitialAdRequest();
          if (sys.isBrowser) {
            console.log("AdAgent Open interstitial ad in browser", entry);
            UIManager.instance.showToast('Open Inter Ad');
          } else {
            // Open interstitial ad
            console.log("AdAgent Open interstitial ad native", entry);
            this.currentInterstitialAdRequest.entry = entry;
            this.currentInterstitialAdRequest.callback = callback;
            ConnectAgent.openInterstitialAd(entry);
          }
        }
      }
      exports('AdAgent', AdAgent);
      _class = AdAgent;
      AdAgent.currentVideoAdRequest = {
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
          LogUtil.log("AdAgent onVideoAdStart", param);
          _class.currentVideoAdRequest.isStarted = true;
          AudioManager.instance.pauseAll();
        },
        onVideoClick: param => {
          LogUtil.log("AdAgent onVideoClick", param);
        },
        onVideoNotReady: param => {
          LogUtil.log("AdAgent onVideoNotReady", param);
          if (_class.currentVideoAdRequest.retryCount == 0) {
            console.log("onVideoNotReady this.currentVideoAdRequest.retryCount == 0");
            _class.currentVideoAdRequest.retryCount++;
            UIManager.instance.open(UIID.Loading, {
              desc: "Loading...",
              displayTime: 5,
              onClose: () => {
                // Handle ad close
                console.log("onVideoNotReady this.currentVideoAdRequest.isStarted: ", console.log("onVideoNotReady this.currentVideoAdRequest.isStarted"));
                if (_class.currentVideoAdRequest.isStarted) {
                  return;
                }
                const entry = _class.currentVideoAdRequest.entry;
                ConnectAgent.openVideoAd(entry);
              }
            });
          } else {
            const entry = _class.currentVideoAdRequest.entry;
            const callback = _class.currentVideoAdRequest.callback;
            if (callback) {
              callback(entry, false);
            }
            UIManager.instance.showToast("Ad loading failed.");
            _class.resetVideoAdRequest();
          }
        },
        onVideoClosed: param => {
          LogUtil.log("AdAgent onVideoClosed", param);
          AudioManager.instance.resumeAll();
          const entry = param.entry;
          const callback = _class.currentVideoAdRequest.callback;
          _class.resetVideoAdRequest();
          if (callback) {
            callback(entry, false);
          }
        },
        onVideoComplete: param => {
          LogUtil.log("AdAgent onVideoComplete", param);
          AudioManager.instance.resumeAll();
          const entry = param.entry;
          const callback = _class.currentVideoAdRequest.callback;
          _class.resetVideoAdRequest();
          if (callback) {
            LogUtil.log("AdAgent onVideoComplete callback", entry);
            callback(entry, true);
          }
        },
        onAdRevenue: param => {
          LogUtil.log("AdAgent onAdRevenue", param);
        }
      };
      AdAgent.interstitialAd = {
        onInterstitialStart: param => {
          LogUtil.log("AdAgent onInterstitialStart", param);
          AudioManager.instance.pauseAll();
        },
        onInterstitialNotReady: param => {
          LogUtil.log("AdAgent onInterstitialNotReady", param);
          const entry = _class.currentInterstitialAdRequest.entry;
          const callback = _class.currentInterstitialAdRequest.callback;
          if (callback) {
            callback(entry, true);
          }
          UIManager.instance.showToast("Ad loading failed.");
          _class.resetInterstitialAdRequest();
        },
        onInterstitialClick: param => {},
        onInterstitialClosed: param => {
          AudioManager.instance.resumeAll();
          LogUtil.log("AdAgent onInterstitialClosed", param);
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

System.register("chunks:///_virtual/ad-manager.ts", ['cc', './gm-manager.ts', './game-data-manager.ts', './ad-agent.ts', './log-util.ts', './game-constants.ts', './report-agent.ts'], function (exports) {
  var cclegacy, sys, director, GmManager, GameDataManager, AdAgent, LogUtil, GameEvent, ReportAgent, CustomReportEvent;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      sys = module.sys;
      director = module.director;
    }, function (module) {
      GmManager = module.GmManager;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }, function (module) {
      AdAgent = module.AdAgent;
    }, function (module) {
      LogUtil = module.LogUtil;
    }, function (module) {
      GameEvent = module.GameEvent;
    }, function (module) {
      ReportAgent = module.ReportAgent;
      CustomReportEvent = module.CustomReportEvent;
    }],
    execute: function () {
      cclegacy._RF.push({}, "f468ab2mhJBbI8OTLWimk1Q", "ad-manager", undefined);
      class AdManager {
        constructor() {
          this.isCdPlay = false;
        }
        static get instance() {
          if (!this._instance) {
            this._instance = new AdManager();
          }
          return this._instance;
        }
        openVideoAd(entry, callback) {
          if (GmManager.instance.isSkipAd || sys.platform != sys.Platform.IOS) {
            director.emit(GameEvent.PLAY_VIDEO_AD, 1);
            callback && callback(entry, true);
            return;
          }
          AdAgent.openVideoAd(entry, (entry, success) => {
            let gdMgr = GameDataManager.instance;
            if (gdMgr.localData.showVideoAdTimes++ == 0) {
              ReportAgent.reportCustomEvent(CustomReportEvent.WWY_GAME_LIFE_KEY_NODE, {
                step: 'first_ad'
              });
            }
            console.log(`AdAgent.openVideoAd-success: ${success}`);
            success && director.emit(GameEvent.PLAY_VIDEO_AD, 1);
            callback && callback(entry, success);
          });
        }
        openInterstitialAd(entry, callback) {
          while (true) {
            console.log(`AdManager openInterstitialAd-isSkipAd: ${GmManager.instance.isSkipAd}, isCdPlay: ${this.isCdPlay}`);
            if (GmManager.instance.isSkipAd || this.isCdPlay || sys.platform == sys.Platform.ANDROID) break;
            let gdMgr = GameDataManager.instance;
            let config = gdMgr.mainConfig.inter_ad;
            if (!config) {
              LogUtil.error("AdManager openInterstitialAd interAdConfig is null");
              break;
            }
            let weight = gdMgr.localData.interAdWeight;
            let weightLimit = gdMgr.getAdWeightMax();
            if (weight >= weightLimit) {
              gdMgr.localData.interAdWeight = 0;
              let freeTimeTotal = gdMgr.getAdFreeTimesByConfig();
              if (gdMgr.gameData.adFreeTimes < freeTimeTotal) {
                gdMgr.gameData.adFreeTimes++;
                return;
              }
              console.log(`Do open inter`);
              AdAgent.openInterstitialAd(entry, (entry, success) => {
                console.log(`AdManager openInterstitialAd-cdTime: ${config.interval}`);
                this.isCdPlay = true;
                setTimeout(() => {
                  console.log(`AdManager openInterstitialAd cd ended.`);
                  this.isCdPlay = false;
                }, config.interval * 1000);
                if (success) {
                  console.log(`AdManager openInterstitialAd play success.`);
                  ReportAgent.reportCustomEvent(CustomReportEvent.INTER_VIDEO_SCENE, {
                    insertlocation: `inter_${entry}`,
                    insertaction: 'succ'
                  });
                } else {
                  console.log(`AdManager openInterstitialAd play fail.`);
                  ReportAgent.reportCustomEvent(CustomReportEvent.INTER_VIDEO_SCENE, {
                    insertlocation: `inter_${entry}`,
                    insertaction: 'fail'
                  });
                }
              });
            }
            break;
          }
          callback && callback(entry, true);
        }
      }
      exports('AdManager', AdManager);
      AdManager._instance = null;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/animate-canvas.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './box-pool.ts', './box-control.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, _decorator, Component, Tween, UITransform, v3, BoxPool, BoxControl;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
      Tween = module.Tween;
      UITransform = module.UITransform;
      v3 = module.v3;
    }, function (module) {
      BoxPool = module.BoxPool;
    }, function (module) {
      BoxControl = module.BoxControl;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "0704dTqtRpKYZOZJabjfqNU", "animate-canvas", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let AnimateCanvas = exports('AnimateCanvas', (_dec = ccclass('animate_canvas'), _dec2 = property(Node), _dec(_class = (_class2 = class AnimateCanvas extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "boxCanvas", _descriptor, this);
        }
        getAnimateBoxNode(boxData, originNode) {
          const aniNodeName = this.aniNodeName(boxData.id);
          const aniBoxNode = this.boxCanvas.getChildByName(aniNodeName);
          if (aniBoxNode && aniBoxNode.isValid) {
            Tween.stopAllByTarget(aniBoxNode);
            console.log('phiz:getAnimateBoxNode:AnimateCanvas', aniNodeName, 'aniBoxNode already exists');
            aniBoxNode.active = true;
            aniBoxNode.getComponent(UITransform).priority = 1;
            return aniBoxNode;
          }
          const newAniBoxNode = BoxPool.instance.getNode();
          newAniBoxNode.name = aniNodeName;
          newAniBoxNode.parent = this.boxCanvas;
          newAniBoxNode.active = true;
          newAniBoxNode.position = this.convertToCanvasPosition(originNode.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0)));
          newAniBoxNode.getComponent(BoxControl).setBoxData(boxData);
          return newAniBoxNode;
        }
        aniNodeName(boxId) {
          return "box_" + boxId;
        }
        clearAllAniBoxNode() {
          const aniBoxNodes = this.boxCanvas.children;
          for (const aniBoxNode of aniBoxNodes) {
            Tween.stopAllByTarget(aniBoxNode);
            aniBoxNode.active = false;
            BoxPool.instance.putNode(aniBoxNode);
          }
        }
        convertToCanvasPosition(worldPosition) {
          return this.boxCanvas.getComponent(UITransform).convertToNodeSpaceAR(worldPosition);
        }
      }, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "boxCanvas", [_dec2], {
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

System.register("chunks:///_virtual/animation-util.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "4d514XFCRZHmJdNoo9PSuWB", "animation-util", undefined);
      class AnimtionUtil {}
      exports('AnimtionUtil', AnimtionUtil);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/array-util.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "13254Da/PlPx5WLh8gAhMYc", "array-util", undefined);
      class ArrayUtil {
        static mergeFrom(to, from) {
          if (to == null || from == null) {
            return;
          }
          for (var key in from) {
            let value = from[key];
            if (value == null) continue;
            if (typeof value == 'undefined') continue;
            if (value && to[key] && value instanceof Object && key in to) {
              this.mergeFrom(to[key], value);
            } else {
              to[key] = value;
            }
          }
        }
      }
      exports('ArrayUtil', ArrayUtil);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/audio-effect-pool.ts", ['cc', './res-loader.ts', './audio-effect.ts', './audio-manager.ts'], function (exports) {
  var cclegacy, NodePool, AudioClip, Node, resLoader, AudioEffect, AudioManager;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      NodePool = module.NodePool;
      AudioClip = module.AudioClip;
      Node = module.Node;
    }, function (module) {
      resLoader = module.resLoader;
    }, function (module) {
      AudioEffect = module.AudioEffect;
    }, function (module) {
      AudioManager = module.AudioManager;
    }],
    execute: function () {
      cclegacy._RF.push({}, "fa128D8ijlKX7t5BOCHJFV4", "audio-effect-pool", undefined);
      const AE_ID_MAX = 30000;

      /** 音效池 */
      class AudioEffectPool {
        constructor() {
          this._switch = true;
          this._volume = 1;
          /** 音效播放器对象池 */
          this.pool = new NodePool();
          this.maxPoolSize = 10;
          /** 对象池集合 */
          this.effects = new Map();
          /** 用过的音效资源记录 */
          this.res = new Map();
          this._aeId = 0;
        }
        /** 音效开关 */
        get switch() {
          return this._switch;
        }
        set switch(value) {
          this._switch = value;
          if (value) this.stop();
        }
        /** 所有音效音量 */
        get volume() {
          return this._volume;
        }
        set volume(value) {
          this._volume = value;
          this.effects.forEach(ae => {
            ae.volume = value;
          });
        }
        /** 获取请求唯一编号 */
        getAeId() {
          if (this._aeId == AE_ID_MAX) this._aeId = 1;
          this._aeId++;
          return this._aeId;
        }

        /**
         * 加载与播放音效
         * @param url                  音效资源地址与音效资源
         * @param bundleName           资源包名
         * @param onPlayComplete       播放完成回调
         * @returns 
         */
        async load(url, bundleName = resLoader.defaultBundleName, onPlayComplete) {
          return new Promise(async (resolve, reject) => {
            if (!this.switch) return resolve(-1);

            // 创建音效资源
            let clip;
            if (url instanceof AudioClip) {
              clip = url;
            } else {
              clip = resLoader.get(url, AudioClip, bundleName);
              if (!clip) {
                this.res.set(bundleName, url);
                clip = await resLoader.loadAsync(bundleName, url, AudioClip);
              }
            }

            // 资源已被释放
            if (!clip || !clip.isValid) {
              resolve(-1);
              return;
            }
            let aeid = this.getAeId();
            let key;
            if (url instanceof AudioClip) {
              key = url.uuid;
            } else {
              key = `${bundleName}_${url}`;
            }
            key += "_" + aeid;

            // 获取音效果播放器播放音乐
            let ae;
            let node = null;
            if (this.pool.size() == 0) {
              node = new Node();
              node.name = "AudioEffect";
              node.parent = AudioManager.instance.persist;
              ae = node.addComponent(AudioEffect);
            } else {
              node = this.pool.get();
              ae = node.getComponent(AudioEffect);
            }
            ae.onComplete = () => {
              this.put(aeid, url, bundleName); // 播放完回收对象
              onPlayComplete && onPlayComplete();
              // LogUtil.log(`【音效】回收，池中剩余音效播放器【${this.pool.size()}】`);
            };

            // 记录正在播放的音效播放器
            this.effects.set(key, ae);
            ae.volume = this.volume;
            ae.clip = clip;
            ae.play();
            resolve(aeid);
          });
        }

        /**
         * 回收音效播放器
         * @param aeid          播放器编号
         * @param url           音效路径
         * @param bundleName    资源包名
         */
        put(aeid, url, bundleName = resLoader.defaultBundleName) {
          let key;
          if (url instanceof AudioClip) {
            key = url.uuid;
          } else {
            key = `${bundleName}_${url}`;
          }
          key += "_" + aeid;
          let ae = this.effects.get(key);
          if (ae && ae.clip) {
            this.effects.delete(key);
            ae.stop();
            if (this.maxPoolSize < this.pool.size()) {
              ae.node.destroy();
            } else {
              this.pool.put(ae.node);
            }
          }
        }

        /** 释放所有音效资源与对象池中播放器 */
        release() {
          // 释放正在播放的音效
          this.effects.forEach(ae => {
            ae.node.destroy();
          });
          this.effects.clear();

          // 释放音效资源
          this.res.forEach((url, bundleName) => {
            resLoader.release(bundleName, url);
          });

          // 释放池中播放器
          this.pool.clear();
        }

        /** 停止播放所有音效 */
        stop() {
          this.effects.forEach(ae => {
            ae.stop();
          });
        }

        /** 恢复所有音效 */
        play() {
          if (!this.switch) return;
          this.effects.forEach(ae => {
            ae.play();
          });
        }

        /** 暂停所有音效 */
        pause() {
          if (!this.switch) return;
          this.effects.forEach(ae => {
            ae.pause();
          });
        }
      }
      exports('AudioEffectPool', AudioEffectPool);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/audio-effect.ts", ['cc'], function (exports) {
  var cclegacy, AudioSource, _decorator;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      AudioSource = module.AudioSource;
      _decorator = module._decorator;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "123ecDmta5FfqmLtpkj2FwD", "audio-effect", undefined);
      const {
        ccclass
      } = _decorator;

      /** 游戏音效 */
      let AudioEffect = exports('AudioEffect', (_dec = ccclass('AudioEffect'), _dec(_class = class AudioEffect extends AudioSource {
        constructor(...args) {
          super(...args);
          /** 背景音乐播放完成回调 */
          this.onComplete = null;
        }
        start() {
          this.node.on(AudioSource.EventType.ENDED, this.onAudioEnded, this);
        }
        onAudioEnded() {
          this.onComplete && this.onComplete();
        }
      }) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/audio-manager.ts", ['cc', './audio-music.ts', './audio-effect-pool.ts', './storage-manager.ts', './game-constants.ts', './bridge-util.ts'], function (exports) {
  var cclegacy, Node, director, AudioMusic, AudioEffectPool, StorageManager, AudioUrl, BridgeUtil, VibrationEffect;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      director = module.director;
    }, function (module) {
      AudioMusic = module.AudioMusic;
    }, function (module) {
      AudioEffectPool = module.AudioEffectPool;
    }, function (module) {
      StorageManager = module.StorageManager;
    }, function (module) {
      AudioUrl = module.AudioUrl;
    }, function (module) {
      BridgeUtil = module.BridgeUtil;
      VibrationEffect = module.VibrationEffect;
    }],
    execute: function () {
      cclegacy._RF.push({}, "5588bgHO91DrJ4w6aJ5dRBL", "audio-manager", undefined);
      const LOCAL_STORE_KEY = "game_audio";

      /*
      *   音频管理器
      *   
      *   2018-9-20
      */
      class AudioManager {
        constructor() {
          this.persist = null;
          this.music = null;
          this.effect = new AudioEffectPool();
          /** 音乐管理状态数据 */
          this.local_data = {};
          this._switchVibration = false;
        }
        static get instance() {
          if (!this._instance) {
            this._instance = new AudioManager();
            this._instance.init();
          }
          return this._instance;
        }
        init() {
          this.persist = new Node("AudioPersistNode");
          director.addPersistRootNode(this.persist);
          this.load();
        }

        /**
         * 设置背景音乐播放完成回调
         * @param callback 背景音乐播放完成回调
         */
        setMusicComplete(callback = null) {
          this.music.onComplete = callback;
        }

        /**
         * 播放背景音乐
         * @param url        资源地址
         * @param callback   音乐播放完成事件
         * @param bundleName 资源包名
         */
        playMusic(url, callback, bundleName) {
          if (this.music.switch) {
            this.music.loop = false;
            this.music.load(url, callback, bundleName).then();
          }
        }

        /** 循环播放背景音乐 */
        playMusicLoop(url, bundleName) {
          if (this.music.switch) {
            this.music.loop = true;
            this.music.load(url, null, bundleName).then();
          }
        }

        /** 停止背景音乐播放 */
        stopMusic() {
          this.music.stop();
        }

        /**
         * 获取背景音乐播放进度
         */
        get progressMusic() {
          return this.music.progress;
        }

        /**
         * 设置背景乐播放进度
         * @param value     播放进度值
         */
        set progressMusic(value) {
          this.music.progress = value;
        }

        /**
         * 获取背景音乐音量
         */
        get volumeMusic() {
          return this.music.volume;
        }

        /**
         * 设置背景音乐音量
         * @param value     音乐音量值
         */
        set volumeMusic(value) {
          this.music.volume = value;
          this.save();
        }

        /**
         * 获取背景音乐开关值
         */
        get switchMusic() {
          return this.music.switch;
        }

        /**
         * 设置背景音乐开关值
         * @param value     开关值
         */
        set switchMusic(value) {
          this.music.switch = value;
          !value && this.music.stop();
          this.save();
        }

        /**
         * 播放音效
         * @param url        资源地址
         * @param callback   加载完成回调
         * @param bundleName 资源包名
         */
        playEffect(url, bundleName, onPlayComplete) {
          return this.effect.load(url, bundleName, onPlayComplete);
        }

        /** 回收音效播放器 */
        putEffect(aeid, url, bundleName) {
          this.effect.put(aeid, url, bundleName);
        }

        /** 获取音效音量 */
        get volumeEffect() {
          return this.effect.volume;
        }

        /**
         * 设置获取音效音量
         * @param value     音效音量值
         */
        set volumeEffect(value) {
          this.effect.volume = value;
          this.save();
        }

        /** 获取音效开关值 */
        get switchEffect() {
          return this.effect.switch;
        }

        /**
         * 设置音效开关值
         * @param value     音效开关值
         */
        set switchEffect(value) {
          this.effect.switch = value;
          if (!value) this.effect.stop();
          this.save();
        }
        set switchVibration(value) {
          this._switchVibration = value;
          this.save();
        }
        get switchVibration() {
          return this._switchVibration;
        }

        /** 恢复当前暂停的音乐与音效播放 */
        resumeAll() {
          if (this.music.switch) {
            if (!this.music.playing) this.music.play();
          }
          if (this.effect.switch) {
            this.effect.play();
          }
        }

        /** 暂停当前音乐与音效的播放 */
        pauseAll() {
          if (this.music.playing) this.music.pause();
          this.effect.pause();
        }

        /** 停止当前音乐与音效的播放 */
        stopAll() {
          this.music.stop();
          this.effect.stop();
        }

        /** 保存音乐音效的音量、开关配置数据到本地 */
        save() {
          this.local_data.volume_music = this.music.volume;
          this.local_data.volume_effect = this.effect.volume;
          this.local_data.switch_music = this.music.switch;
          this.local_data.switch_effect = this.effect.switch;
          this.local_data.switch_vibration = this._switchVibration;
          StorageManager.instance.set(LOCAL_STORE_KEY, this.local_data);
        }

        /** 本地加载音乐音效的音量、开关配置数据并设置到游戏中 */
        load() {
          var _this$persist, _this$persist2;
          this.music = ((_this$persist = this.persist) == null ? void 0 : _this$persist.getComponent(AudioMusic)) || ((_this$persist2 = this.persist) == null ? void 0 : _this$persist2.addComponent(AudioMusic));
          this.local_data = StorageManager.instance.getJson(LOCAL_STORE_KEY);
          if (this.local_data) {
            try {
              this.setState();
            } catch {
              this.setStateDefault();
            }
          } else {
            this.setStateDefault();
          }
        }
        setState() {
          this.music.volume = this.local_data.volume_music;
          this.effect.volume = this.local_data.volume_effect;
          this.music.switch = this.local_data.switch_music;
          this.effect.switch = this.local_data.switch_effect;
          this.switchVibration = this.local_data.switch_vibration;
        }
        setStateDefault() {
          this.local_data = {};
          this.music.volume = 1;
          this.effect.volume = 1;
          this.music.switch = true;
          this.effect.switch = true;
          this.switchVibration = true;
        }
        onBtnClicked() {
          this.playEffect(AudioUrl.BTN_CLICK);
          BridgeUtil.vibrate(30, VibrationEffect.TICK);
        }
      }
      exports('AudioManager', AudioManager);
      AudioManager._instance = void 0;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/audio-music.ts", ['cc', './res-loader.ts'], function (exports) {
  var cclegacy, AudioSource, AudioClip, _decorator, resLoader;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      AudioSource = module.AudioSource;
      AudioClip = module.AudioClip;
      _decorator = module._decorator;
    }, function (module) {
      resLoader = module.resLoader;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "9e83d5mi6lL/4JLcrqWl5B8", "audio-music", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let AudioMusic = exports('AudioMusic', (_dec = ccclass('AudioMusic'), _dec(_class = class AudioMusic extends AudioSource {
        constructor(...args) {
          super(...args);
          /** 背景音乐开关 */
          this.switch = true;
          /** 背景音乐播放完成回调 */
          this.onComplete = null;
          this._progress = 0;
          this._isLoading = false;
          this._nextBundleName = null;
          // 下一个音乐资源包
          this._nextUrl = null;
        }
        // 下一个播放音乐

        start() {
          // this.node.on(AudioSource.EventType.STARTED, this.onAudioStarted, this);
          this.node.on(AudioSource.EventType.ENDED, this.onAudioEnded, this);
        }

        // private onAudioStarted() { }

        onAudioEnded() {
          this.onComplete && this.onComplete();
        }

        /** 获取音乐播放进度 */
        get progress() {
          if (this.duration > 0) this._progress = this.currentTime / this.duration;
          return this._progress;
        }
        /**
         * 设置音乐当前播放进度
         * @param value     进度百分比0到1之间
         */
        set progress(value) {
          this._progress = value;
          this.currentTime = value * this.duration;
        }

        /**
         * 加载音乐并播放
         * @param url          音乐资源地址
         * @param callback     加载完成回调
         * @param bundleName   资源包名
         */
        async load(url, callback, bundleName = resLoader.defaultBundleName) {
          // 下一个加载的背景音乐资源
          if (this._isLoading) {
            this._nextBundleName = bundleName;
            this._nextUrl = url;
            return;
          }
          this._isLoading = true;
          var clip = await resLoader.loadAsync(bundleName, url, AudioClip);
          if (clip) {
            this._isLoading = false;

            // 处理等待加载的背景音乐
            if (this._nextUrl != null) {
              // 加载等待播放的背景音乐
              this.load(this._nextUrl, callback, this._nextBundleName);
              this._nextBundleName = this._nextUrl = null;
            } else {
              callback && callback();

              // 正在播放的时候先关闭
              if (this.playing) {
                this.stop();
              }

              // 删除当前正在播放的音乐
              this.release();

              // 播放背景音乐
              this.clip = clip;
              this.play();
            }
          }
        }

        /** 释放当前背景音乐资源 */
        release() {
          if (this.clip) {
            this.stop();
            this.clip.decRef();
            this.clip = null;
          }
        }
      }) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/base-config.ts", ['cc', './storage-data.ts'], function (exports) {
  var cclegacy, _decorator, StorageData;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }, function (module) {
      StorageData = module.StorageData;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "356c6n1ZjVL1Jj3dVf2QkCE", "base-config", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let BaseConfig = exports('BaseConfig', (_dec = ccclass('base_config'), _dec(_class = class BaseConfig extends StorageData {
        constructor(...args) {
          super(...args);
          this.stable_versions = [];
        }
      }) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/bezier-util.ts", ['cc', './stage-constants.ts'], function (exports) {
  var cclegacy, Vec3, Component, StageConstants;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Vec3 = module.Vec3;
      Component = module.Component;
    }, function (module) {
      StageConstants = module.StageConstants;
    }],
    execute: function () {
      cclegacy._RF.push({}, "521e12RgINL66ZrAYpWq2m1", "bezier-util", undefined);
      class BezierUtil {
        static calculateCubicBezierMoveDuration(p0, p1, p2, p3, speed = StageConstants.MOVE_SPEED) {
          let distance = this.calculateCubicBezierLength(p0, p1, p2, p3);
          let baseTime = distance / speed;
          let speedMultiplier = 1 + distance / 600; // 调整分母为调整距离与速度变化的关系（分母越小，影响越大）
          let optimizedTime = baseTime / speedMultiplier;
          let minTime = 0.1; // 最小0.1秒
          return Math.max(optimizedTime, minTime);
        }
        static calculateCubicBezierLength(p0, p1, p2, p3) {
          const segments = 300; // 分段数，越大越精确
          let length = 0;
          let previousPoint = p0;
          for (let i = 1; i <= segments; i++) {
            const t = i / segments;
            const currentPoint = this.calculateCubicBezierPoint(p0, p1, p2, p3, t);
            length += Vec3.distance(previousPoint, currentPoint);
            previousPoint = currentPoint;
          }
          return length;
        }
        static calculateCubicBezierPoint(p0, p1, p2, p3, t) {
          const mt = 1 - t;
          const mt2 = mt * mt;
          const mt3 = mt2 * mt;
          const t2 = t * t;
          const t3 = t2 * t;

          // 三阶贝塞尔曲线公式
          const x = mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x;
          const y = mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y;
          const z = mt3 * p0.z + 3 * mt2 * t * p1.z + 3 * mt * t2 * p2.z + t3 * p3.z;
          return new Vec3(x, y, z);
        }
        static moveNodeAlongCubicBezier(node, startPoint, controlPoint1, controlPoint2, endPoint, duration) {
          return new Promise(resolve => {
            let elapsedTime = 0;
            const updateInterval = 1 / 120; // 120fps

            // 创建一个临时组件来处理动画
            const animComponent = node.addComponent(Component);
            const scheduleId = animComponent.schedule(dt => {
              elapsedTime += dt;
              const t = Math.min(elapsedTime / duration, 1);
              // 使用三阶贝塞尔曲线
              const mt = 1 - t;
              const mt2 = mt * mt;
              const mt3 = mt2 * mt;
              const t2 = t * t;
              const t3 = t2 * t;
              const x = mt3 * startPoint.x + 3 * mt2 * t * controlPoint1.x + 3 * mt * t2 * controlPoint2.x + t3 * endPoint.x;
              const y = mt3 * startPoint.y + 3 * mt2 * t * controlPoint1.y + 3 * mt * t2 * controlPoint2.y + t3 * endPoint.y;
              node.position = new Vec3(x, y, 0);
              if (t >= 1) {
                animComponent.unschedule(scheduleId);
                animComponent.destroy();
                resolve();
              }
            }, updateInterval);
          });
        }
      }
      exports('BezierUtil', BezierUtil);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/bg-adapter.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, _decorator, Component, Sprite, UITransform, view;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
      Sprite = module.Sprite;
      UITransform = module.UITransform;
      view = module.view;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "fe01ez5TCZBibTI73mqm/YF", "bg-adapter", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let BgAdapter = exports('BgAdapter', (_dec = ccclass('BgAdapter'), _dec2 = property(Node), _dec(_class = (_class2 = class BgAdapter extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "target", _descriptor, this);
        }
        updateSize() {
          let frame = this.node.getComponent(Sprite).spriteFrame;
          if (!frame) return;
          let texture = frame.texture;
          if (!texture) return;
          let w_t = texture.width;
          let h_t = texture.height;
          let height = this.target ? this.target.getComponent(UITransform).height + 20 : view.getVisibleSize().height;
          let w_n = Math.floor(height * w_t / h_t);
          this.node.getComponent(UITransform).setContentSize(w_n, height);
        }
      }, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "target", [_dec2], {
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

System.register("chunks:///_virtual/box-control.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './res-manager.ts', './common-util.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, _decorator, Component, Vec3, Sprite, tween, UIOpacity, ResManager, CommonUtil;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
      Vec3 = module.Vec3;
      Sprite = module.Sprite;
      tween = module.tween;
      UIOpacity = module.UIOpacity;
    }, function (module) {
      ResManager = module.ResManager;
    }, function (module) {
      CommonUtil = module.CommonUtil;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2;
      cclegacy._RF.push({}, "649f7JQjwRIVZwd8owMNIuu", "box-control", undefined);
      const {
        ccclass,
        property
      } = _decorator;

      /*
      动画说明：
      merge1: 合并动画，block自己的动画
      merge2: 合并动画，block周边的烟花动画
      */

      let BoxControl = exports('BoxControl', (_dec = ccclass('box_control'), _dec2 = property(Node), _dec3 = property(Node), _dec(_class = (_class2 = class BoxControl extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "imageNormal", _descriptor, this);
          _initializerDefineProperty(this, "icon", _descriptor2, this);
          this._boxIndex = 0;
          this._boxKey = 0;
        }
        start() {}
        update(deltaTime) {}
        reset() {
          this.icon.active = true;
          this._boxIndex = 0;
          this._boxKey = 0;
          this.node.position = Vec3.ZERO;
          this.node.scale = Vec3.ONE;
        }
        setBoxData(boxData, isQuest = false) {
          this._boxKey = boxData.key;
          if (isQuest) {
            this.showQuest();
          } else {
            this.showAniIdle();
          }
        }
        setBoxReach() {
          let index = this.node.parent.getSiblingIndex();
          if (index % 2 != 0) {
            this.imageNormal.getComponent(Sprite).spriteFrame = ResManager.instance.getBlockSprite(`block_${this._boxKey}`);
            this.icon.active = false;
          } else {
            this.icon.active = true;
            this.icon.getComponent(Sprite).spriteFrame = ResManager.instance.getBlockSprite(`constellation_${this._boxKey}`);
            this.imageNormal.getComponent(Sprite).spriteFrame = ResManager.instance.getBlockSprite(`block_${this._boxKey}_normal`);
          }

          // this.imageNormal.active = false;
        }

        get boxIndex() {
          return this._boxIndex;
        }
        set boxIndex(boxIndex) {
          this._boxIndex = boxIndex;
        }
        showQuest() {
          this.imageNormal.active = true;
          this.imageNormal.getComponent(Sprite).spriteFrame = ResManager.instance.getBlockSprite("block_special");
        }
        showAniIdle() {
          const key = this._boxKey;
          this.imageNormal.getComponent(Sprite).spriteFrame = ResManager.instance.getBlockSprite(`block_${key}_normal`);
          this.icon.getComponent(Sprite).spriteFrame = ResManager.instance.getBlockSprite(`icon_${key}`);
          this.imageNormal.active = true;

          // let name = this.getBlockSkinName(key);
          // const aniIdleNode = this.aniIdleWrapNode.getChildByName("ani_idle");
          // aniIdleNode.getComponent(sp.Skeleton).setSkin("default");
          // if (!!name) {
          //     aniIdleNode.getComponent(sp.Skeleton).setAnimation(0, name, true);
          // } else {
          //     console.error("box skin name not found");
          // }
        }

        doAniJumping() {
          // 只在copy的boxNode上播放
          const key = this._boxKey;
          this.icon.active = true;
        }
        doAniLanding() {
          // 只在copy的boxNode上播放
          // this.aniJumpNode.getComponent(sp.Skeleton).setAnimation(0, "down",false);
        }
        doAniPickUp() {
          // 只在copy的boxNode上播放
          // this.aniJumpNode.getComponent(sp.Skeleton).setAnimation(0, "pick up_idle",true);

          const originalPosition = this.node.position.clone();
          tween(this.node).to(0.25, {
            position: new Vec3(originalPosition.x, originalPosition.y + 10, originalPosition.z)
          }).to(0.5, {
            position: new Vec3(originalPosition.x, originalPosition.y - 10, originalPosition.z)
          }).to(0.25, {
            position: originalPosition
          }).union().repeatForever().start();
        }
        doAniReach(index) {
          this.scheduleOnce(() => {
            if (index % 2 != 0) {
              this.imageNormal.getComponent(Sprite).spriteFrame = ResManager.instance.getBlockSprite(`block_${this._boxKey}`);
              this.icon.active = false;
            } else {
              this.icon.active = true;
              this.icon.getComponent(Sprite).spriteFrame = ResManager.instance.getBlockSprite(`constellation_${this._boxKey}`);
              this.imageNormal.getComponent(Sprite).spriteFrame = ResManager.instance.getBlockSprite(`block_${this._boxKey}_normal`);
              let opacityCom = this.icon.getComponent(UIOpacity);
              tween(opacityCom).delay(0.1).to(0.2, {
                opacity: 128
              }).call(() => {
                this.icon.getComponent(Sprite).spriteFrame = ResManager.instance.getBlockSprite(`constellation_${this._boxKey}_light`);
              }).delay(0.1).call(() => {
                this.icon.getComponent(Sprite).spriteFrame = ResManager.instance.getBlockSprite(`constellation_${this._boxKey}`);
              }).to(0.2, {
                opacity: 255
              }).start();
            }
          }, 0.6);
          return CommonUtil.delay(1500);
        }
        doAniPublishQuest() {
          return new Promise(resolve => {
            this.showAniIdle();

            // this.aniUnQuestWrapNode.active = true;
            // const aniUnQuestNode = this.aniUnQuestWrapNode.getChildByName("ani_un_quest");
            // aniUnQuestNode.getComponent(sp.Skeleton).setAnimation(0, "remove", false);

            this.scheduleOnce(() => {
              // this.aniUnQuestWrapNode.active = false; 
              resolve();
            }, 0.7);
          });
        }
        getBlockSkinName(key) {
          const blockSkin = new Map([[1, "green"], [2, "orange"], [3, "purple"], [4, "red"], [5, "yellow"], [6, "white"], [7, "light green"], [8, "light blue"], [9, "pink"], [10, "blue"], [11, "brownness"], [12, "light purple"]]);
          return blockSkin.get(key);
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "imageNormal", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "icon", [_dec3], {
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

System.register("chunks:///_virtual/box-data.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "659fcdyJmpA5ohZhQQ98MXt", "box-data", undefined);
      class BoxData {
        constructor(key) {
          this._id = void 0;
          this._key = void 0;
          this._key = key;
          this._id = `${key}_${BoxData._uniqueId++}`;
        }
        get id() {
          return this._id;
        }
        get key() {
          return this._key;
        }
        clone() {
          const boxData = new BoxData(this._key);
          return boxData;
        }
      }
      exports('BoxData', BoxData);
      BoxData._uniqueId = 0;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/box-pool.ts", ['cc', './res-manager.ts', './box-control.ts'], function (exports) {
  var cclegacy, NodePool, instantiate, ResManager, ResPrefabName, BoxControl;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      NodePool = module.NodePool;
      instantiate = module.instantiate;
    }, function (module) {
      ResManager = module.ResManager;
      ResPrefabName = module.ResPrefabName;
    }, function (module) {
      BoxControl = module.BoxControl;
    }],
    execute: function () {
      cclegacy._RF.push({}, "c2a0fpJFwpP96l+M0s1C2B4", "box-pool", undefined);
      class PendingNode {
        constructor(node) {
          this.node = null;
          this.count = 0;
          this.node = node;
          this.count = 0;
        }
      }
      class BoxPool {
        constructor() {
          this._nodePool = new NodePool();
          this._initSize = 80;
          this._pendingReturnCaches = [];
        }
        static get instance() {
          if (!this._instance) {
            this._instance = new BoxPool();
          }
          return this._instance;
        }
        getNode() {
          let node = this._nodePool.get();
          if (!node) {
            const prefab = ResManager.instance.getPrefab(ResPrefabName.PREFAB_BOX);
            node = instantiate(prefab);
          }
          node.getComponent(BoxControl).reset();
          node.active = true;
          return node;
        }
        putNode(node) {
          const sizeInPool = this._nodePool.size();
          console.log("putNode _nodePool size :", sizeInPool);
          if (sizeInPool < this._initSize) {
            node.getComponent(BoxControl).reset();
            this.return2PendingCaches(node);
          } else {
            node.removeFromParent();
            node.destroy();
          }
        }
        async preload() {
          const prefab = ResManager.instance.getPrefab(ResPrefabName.PREFAB_BOX);
          if (!prefab) {
            console.error(`preload-error-${ResPrefabName.PREFAB_BOX}`);
            return;
          }
          for (let i = 0; i < this._initSize; i++) {
            const node = instantiate(prefab);
            this._nodePool.put(node);
          }
        }
        prepareIfNeedAddMore(needSize) {
          const currentSize = this._nodePool.size();
          if (currentSize >= needSize) {
            return;
          }
          const needAddSize = needSize - currentSize;
          const prefab = ResManager.instance.getPrefab(ResPrefabName.PREFAB_BOX);
          if (prefab) {
            for (let i = 0; i < needAddSize; i++) {
              const node = instantiate(prefab);
              this._nodePool.put(node);
            }
          }
          this._initSize = Math.max(this._initSize, needSize);
        }
        return2PendingCaches(node) {
          node.removeFromParent();
          node.active = false;
          this._pendingReturnCaches.push(new PendingNode(node));
        }
        update() {
          for (let i = this._pendingReturnCaches.length - 1; i >= 0; i--) {
            const pendingNode = this._pendingReturnCaches[i];
            pendingNode.count++;
            if (pendingNode.count > 1) {
              this._nodePool.put(pendingNode.node);
              this._pendingReturnCaches.splice(i, 1);
            }
          }
        }
      }
      exports('BoxPool', BoxPool);
      BoxPool._instance = null;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/bridge-event.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "d60dbJoo8tDdom5emT251lj", "bridge-event", undefined);
      let BridgeEvent = exports('BridgeEvent', /*#__PURE__*/function (BridgeEvent) {
        BridgeEvent["on_vibrate"] = "on_vibrate";
        BridgeEvent["on_page_rc"] = "on_page_rc";
        BridgeEvent["on_native_info"] = "on_native_info";
        BridgeEvent["on_scene_ready"] = "on_scene_ready";
        BridgeEvent["on_send_mail"] = "on_send_mail";
        BridgeEvent["on_save_album"] = "on_save_album";
        BridgeEvent["on_save_album_result"] = "on_save_album_result";
        BridgeEvent["on_connect_event"] = "on_connect_event";
        BridgeEvent["sdk_ad_reward"] = "sdk_ad_reward";
        BridgeEvent["sdk_ad_inters"] = "sdk_ad_inters";
        BridgeEvent["sdk_report_data"] = "sdk_report_data";
        BridgeEvent["sdk_init"] = "sdk_init";
        BridgeEvent["sdk_ad_debug"] = "sdk_ad_debug";
        BridgeEvent["adjust_event"] = "adjust_event";
        BridgeEvent["on_open_rating"] = "on_rating";
        return BridgeEvent;
      }({}));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/bridge-manager.ts", ['cc', './bridge-event.ts', './config.ts', './log-util.ts', './connect-agent.ts'], function (exports) {
  var cclegacy, native, BridgeEvent, Config, LogUtil, ConnectAgent;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      native = module.native;
    }, function (module) {
      BridgeEvent = module.BridgeEvent;
    }, function (module) {
      Config = module.Config;
    }, function (module) {
      LogUtil = module.LogUtil;
    }, function (module) {
      ConnectAgent = module.ConnectAgent;
    }],
    execute: function () {
      cclegacy._RF.push({}, "4ef0fxQINBHOokY1IY/jh0U", "bridge-manager", undefined);
      class BridgeManager {
        constructor() {
          this.saveToAlbumCallback = void 0;
        }
        static get instance() {
          if (!this._instance) {
            this._instance = new BridgeManager();
          }
          return this._instance;
        }
        setSaveToAlbumCallback(callback) {
          this.saveToAlbumCallback = callback;
        }
        setupNativeEventListner(onNativeBindedCallback) {
          console.log(`setupNativeEventListner-${native.jsbBridgeWrapper}`);
          if (native && native.jsbBridgeWrapper) {
            native.jsbBridgeWrapper.addNativeEventListener("on_native_info", args => {
              this.onNativeInfo(args);
              console.log(`setupNativeEventListner-success: ${args}`);
              onNativeBindedCallback && onNativeBindedCallback();
            });
            native.jsbBridgeWrapper.addNativeEventListener("on_connect_event", args => this.onNativeConnectEvent(args));
            native.jsbBridgeWrapper.dispatchEventToNative(BridgeEvent.on_scene_ready);
          } else {
            console.error("native.jsbBridgeWrapper is null");
            onNativeBindedCallback && onNativeBindedCallback();
          }
        }
        onNativeInfo(args) {
          LogUtil.log("beyond2 onNativeInfo", args);
          const data = JSON.parse(args);
          Config.MEM = data.mem;
          Config.DEBUG = data.debug;
          Config.GAME_VERSION = data.version;
          Config.LANG_CODE = data.lang;
          Config.COUNTRY_CODE = data.country;
          Config.GAME_UUID = data.game_uuid;
          Config.PACKAGE = data.package;
          Config.API_URL = data.api_host;
          // Config.SG_GRAPH_HOST = .sg_graph_host;
          if (data.model) {
            this.updateDeviceModel(data.model);
          }
        }
        onNativeConnectEvent(args) {
          LogUtil.log("onNativeConnectEvent", args);
          ConnectAgent.onConnectEvent(args);
        }
        onNativeSaveAlbumResult(args) {
          LogUtil.log("onNativeSaveAlbumResult", args);
          this.saveToAlbumCallback && this.saveToAlbumCallback(args === "true");
        }
        updateDeviceModel(rawModel) {
          const modelConfig = {
            "i386": 10,
            "x86_64": 14,
            "arm64": 18,
            "iPhone1,1": 1,
            "iPhone1,2": 1,
            "iPhone2,1": 1,
            "iPhone3,1": 2,
            "iPhone3,2": 2,
            "iPhone3,3": 2,
            "iPhone4,1": 3,
            "iPhone5,1": 4,
            "iPhone5,2": 4,
            "iPhone5,3": 4,
            "iPhone5,4": 4,
            "iPhone6,1": 5,
            "iPhone6,2": 5,
            "iPhone7,1": 6,
            "iPhone7,2": 6,
            "iPhone8,1": 7,
            "iPhone8,2": 7,
            "iPhone8,4": 8,
            "iPhone9,1": 8,
            "iPhone9,2": 8,
            "iPhone9,3": 8,
            "iPhone9,4": 8,
            "iPhone10,1": 9,
            "iPhone10,2": 9,
            "iPhone10,3": 9,
            "iPhone10,4": 9,
            "iPhone10,5": 9,
            "iPhone10,6": 9,
            "iPhone11,2": 10,
            "iPhone11,4": 10,
            "iPhone11,6": 10,
            "iPhone11,8": 10,
            "iPhone12,1": 11,
            "iPhone12,3": 12,
            "iPhone12,5": 12,
            "iPhone12,8": 12,
            "iPhone13,1": 12,
            "iPhone13,2": 12,
            "iPhone13,3": 13,
            "iPhone13,4": 13,
            "iPhone14,2": 14,
            "iPhone14,3": 14,
            "iPhone14,4": 14,
            "iPhone14,5": 14,
            "iPhone14,6": 14,
            "iPhone14,7": 14,
            "iPhone14,8": 14,
            "iPhone15,2": 15,
            "iPhone15,3": 15,
            "iPhone15,4": 15,
            "iPhone15,5": 15,
            "iPhone16,1": 16,
            "iPhone16,2": 16,
            "iPhone17,1": 17,
            "iPhone17,2": 17,
            "iPhone17,3": 17,
            "iPhone17,4": 17,
            "iPhone17,5": 17
          };
          Config.DEVICE_MODEL.RAW = rawModel;
          Config.DEVICE_MODEL.MODEL = modelConfig[rawModel] || 0;
          const s1 = JSON.stringify(Config.DEVICE_MODEL);
          console.log(`updateDeviceModel: ${rawModel} -> ${s1}`);
        }
      }
      exports('BridgeManager', BridgeManager);
      BridgeManager._instance = void 0;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/bridge-util.ts", ['cc', './audio-manager.ts', './bridge-event.ts', './bridge-manager.ts', './game-data-manager.ts', './native-agent.ts', './graph-manager.ts', './type-define.ts'], function (exports) {
  var cclegacy, native, sys, AudioManager, BridgeEvent, BridgeManager, GameDataManager, NativeAgent, GraphManager, SgState;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      native = module.native;
      sys = module.sys;
    }, function (module) {
      AudioManager = module.AudioManager;
    }, function (module) {
      BridgeEvent = module.BridgeEvent;
    }, function (module) {
      BridgeManager = module.BridgeManager;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }, function (module) {
      NativeAgent = module.NativeAgent;
    }, function (module) {
      GraphManager = module.GraphManager;
    }, function (module) {
      SgState = module.SgState;
    }],
    execute: function () {
      cclegacy._RF.push({}, "fa7efx5gDpLmqMTl5Pe9mwm", "bridge-util", undefined);
      let VibrationEffect = exports('VibrationEffect', /*#__PURE__*/function (VibrationEffect) {
        VibrationEffect[VibrationEffect["DEFAULT"] = -1] = "DEFAULT";
        VibrationEffect[VibrationEffect["TICK"] = 2] = "TICK";
        VibrationEffect[VibrationEffect["CLICK"] = 0] = "CLICK";
        VibrationEffect[VibrationEffect["DOUBLE_CLICK"] = 1] = "DOUBLE_CLICK";
        VibrationEffect[VibrationEffect["HEAVY_CLICK"] = 5] = "HEAVY_CLICK";
        return VibrationEffect;
      }({}));
      class BridgeUtil {
        static vibrate(duration, effect) {
          if (!AudioManager.instance.switchVibration) return;
          if (native && native.bridge) {
            const param = {
              d: duration,
              e: effect
            };
            NativeAgent.dispatchEventToNative(BridgeEvent.on_vibrate, JSON.stringify(param));
          }
        }
        static sendMail(to, subject, body) {
          if (native && native.bridge) {
            const param = {
              to: to,
              subject: subject,
              body: body
            };
            NativeAgent.dispatchEventToNative(BridgeEvent.on_send_mail, JSON.stringify(param));
          }
        }
        static openRating() {
          if (native && native.bridge) {
            NativeAgent.dispatchEventToNative(BridgeEvent.on_open_rating);
          }
        }
        static saveToAlbum(url) {
          if (!sys.isNative) {
            return Promise.resolve(false);
          }
          if (GameDataManager.instance.gameData.sgData.state === SgState.Started) {
            return new Promise(resolve => {
              // start download graph
              GraphManager.instance.loadGraphToBase64(url).then(base64 => {
                if (!base64) {
                  console.log('saveToAlbum base64 is null');
                  resolve(false);
                  return;
                }
                BridgeManager.instance.setSaveToAlbumCallback(success => {
                  resolve(success);
                });
                NativeAgent.dispatchEventToNative(BridgeEvent.on_save_album, base64);
              });
            });
          }
        }
      }
      exports('BridgeUtil', BridgeUtil);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/btn-tips-control.ts", ['cc'], function (exports) {
  var cclegacy, Component, Vec3, tween, _decorator;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      Vec3 = module.Vec3;
      tween = module.tween;
      _decorator = module._decorator;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "11d33JLis9NKKiNZHF3mxmM", "btn-tips-control", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let BtnTipsControl = exports('BtnTipsControl', (_dec = ccclass('BtnTipsControl'), _dec(_class = class BtnTipsControl extends Component {
        constructor(...args) {
          super(...args);
          this._tween = null;
        }
        start() {
          // 按钮z轴左右旋转颤抖动画
          this.node.eulerAngles = new Vec3(0, 0, 0);
          let extent = 2.5;
          this._tween = tween(this.node).to(0.08, {
            eulerAngles: new Vec3(0, 0, extent * 3)
          }).to(0.08, {
            eulerAngles: new Vec3(0, 0, extent * -3)
          }).to(0.08, {
            eulerAngles: new Vec3(0, 0, extent * 2)
          }).to(0.08, {
            eulerAngles: new Vec3(0, 0, extent * -2)
          }).to(0.08, {
            eulerAngles: new Vec3(0, 0, extent)
          }).to(0.08, {
            eulerAngles: new Vec3(0, 0, extent * -1)
          }).to(0.08, {
            eulerAngles: new Vec3(0, 0, 0)
          }).delay(0.6).union().repeatForever().start();
        }
        onDestroy() {
          if (this._tween) {
            this._tween.stop();
            this._tween = null;
          }
        }
      }) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/column-control.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './game-constants.ts', './res-manager.ts', './stage-build-agent.ts', './game-data-manager.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, Sprite, SpriteFrame, _decorator, Component, UITransform, Widget, Layout, director, v3, instantiate, Vec3, tween, GameEvent, ResManager, StageBuildAgent, GameDataManager;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      Sprite = module.Sprite;
      SpriteFrame = module.SpriteFrame;
      _decorator = module._decorator;
      Component = module.Component;
      UITransform = module.UITransform;
      Widget = module.Widget;
      Layout = module.Layout;
      director = module.director;
      v3 = module.v3;
      instantiate = module.instantiate;
      Vec3 = module.Vec3;
      tween = module.tween;
    }, function (module) {
      GameEvent = module.GameEvent;
    }, function (module) {
      ResManager = module.ResManager;
    }, function (module) {
      StageBuildAgent = module.StageBuildAgent;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17;
      cclegacy._RF.push({}, "f6717rQaf9F/KJWglB3Ms9r", "column-control", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let ColumnControl = exports('ColumnControl', (_dec = ccclass('column_control'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property(Node), _dec6 = property(Node), _dec7 = property(Node), _dec8 = property(Node), _dec9 = property(Node), _dec10 = property(Node), _dec11 = property(Node), _dec12 = property(Node), _dec13 = property([Sprite]), _dec14 = property([SpriteFrame]), _dec15 = property([SpriteFrame]), _dec16 = property([Sprite]), _dec17 = property([SpriteFrame]), _dec18 = property([Sprite]), _dec(_class = (_class2 = class ColumnControl extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "boxContainer", _descriptor, this);
          _initializerDefineProperty(this, "reachedShadowNode", _descriptor2, this);
          _initializerDefineProperty(this, "bgNode", _descriptor3, this);
          _initializerDefineProperty(this, "linesContainerNode", _descriptor4, this);
          _initializerDefineProperty(this, "preHoldLineWrapNode", _descriptor5, this);
          _initializerDefineProperty(this, "preHoldLockNode", _descriptor6, this);
          _initializerDefineProperty(this, "lockContainerNode", _descriptor7, this);
          _initializerDefineProperty(this, "guideLightNode", _descriptor8, this);
          _initializerDefineProperty(this, "clickAreaNode", _descriptor9, this);
          _initializerDefineProperty(this, "reachedBottom", _descriptor10, this);
          _initializerDefineProperty(this, "particle", _descriptor11, this);
          _initializerDefineProperty(this, "bgSprites", _descriptor12, this);
          _initializerDefineProperty(this, "lockFrames", _descriptor13, this);
          _initializerDefineProperty(this, "doneBgFrames", _descriptor14, this);
          _initializerDefineProperty(this, "doneBgSprites", _descriptor15, this);
          _initializerDefineProperty(this, "shadowFrames", _descriptor16, this);
          _initializerDefineProperty(this, "shadowSprites", _descriptor17, this);
          this._columnIndex = 0;
          this._orgLockCount = 0;
          this.curThemeId = 0;
        }
        onLoad() {
          this.preHoldLineWrapNode.active = false;
          this.preHoldLockNode.active = false;
          this.showNormal();
        }
        start() {}
        update(deltaTime) {}
        async updateColumnData(columnData) {
          const maxBoxCount = columnData.maxBoxCount;
          const lockCount = columnData.lockCount;
          this._orgLockCount = lockCount;
          this.setupBoxWrapNodes(maxBoxCount);
          await this.initWithStageType();
          this.updateColumnHeight(maxBoxCount);
          this.setupLines(maxBoxCount);
          this.setupLockNodes(lockCount);
        }
        updateColumnHeight(maxBoxCount) {
          const maskCount = maxBoxCount;
          const maskSpriteFrame = ResManager.instance.getMaskSpriteFrame(maskCount);
          const maskSpriteHeight = maskSpriteFrame.originalSize.height;
          console.log(`maskSpriteHeight: ${maskSpriteHeight}, maskCount: ${maskCount}`);
          const maskNode = this.node.getChildByName('mask');
          const maskSprite = maskNode.getComponent(Sprite);
          maskSprite.spriteFrame = maskSpriteFrame;
          this.node.getComponent(UITransform).height = maskSpriteHeight;
          this.bgNode.getComponent(UITransform).height = maskSpriteHeight;
          this.bgNode.getChildByName('normal').getComponent(Widget).updateAlignment();
          this.bgNode.getChildByName('reached').getComponent(Widget).updateAlignment();
          this.reachedShadowNode.getComponent(Widget).updateAlignment();
          this.boxContainer.getComponent(Widget).updateAlignment();
          this.linesContainerNode.getComponent(UITransform).height = maskSpriteHeight;
          this.linesContainerNode.getComponent(Widget).top = 17.5;
          this.linesContainerNode.getComponent(Widget).updateAlignment();
          this.linesContainerNode.getComponent(Layout).updateLayout();
          this.lockContainerNode.getComponent(UITransform).height = maskSpriteHeight;
          this.lockContainerNode.getComponent(Widget).updateAlignment();
          // this.lockContainerNode.getComponent(Layout).updateLayout();
        }

        set columnIndex(columnIndex) {
          this._columnIndex = columnIndex;
        }
        get columnIndex() {
          return this._columnIndex;
        }
        addBoxWrapNode(boxWrapNode) {
          this.boxContainer.addChild(boxWrapNode);
        }
        addBoxNode(boxIndex, boxNode) {
          this.boxContainer.getChildByName('wrap_' + boxIndex).addChild(boxNode);
        }
        onColumnClick() {
          if (this.lockContainerNode.active && this._orgLockCount == this.lockContainerNode.children.length) {
            director.emit(GameEvent.CLICK_UNLOCK);
          } else {
            director.emit(GameEvent.COLUMN_CLICK, this._columnIndex);
          }
        }
        getBoxNode(boxIndex) {
          let boxWrapNode = this.boxContainer.getChildByName('wrap_' + boxIndex);
          return this.boxContainer.getChildByName('wrap_' + boxIndex).getChildByName('box');
        }
        getBoxWrapNode(boxIndex) {
          return this.boxContainer.getChildByName('wrap_' + boxIndex);
        }
        getTopBoxWrapNodeWorldPosition() {
          const lastBoxWrapNode = this.boxContainer.getChildByName('wrap_' + (this.boxContainer.children.length - 1));
          return lastBoxWrapNode.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0));
        }
        getDistanceAbovePointWorldPosition(distance) {
          const topWrapBoxPosY = this.getTopBoxWrapNodeWorldPosition().y + distance;
          const pos = this.node.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0));
          pos.y = topWrapBoxPosY;
          return pos;
        }
        doAniReach(reachColor) {
          this.setReached(reachColor);
        }
        showNormal() {
          this.bgNode.getChildByName('normal').active = true;
          this.bgNode.getChildByName('reached').active = false;
          this.reachedShadowNode.active = false;
        }
        setReached(reachColor) {
          return new Promise(resolve => {
            // this.bgNode.getChildByName('normal').active = false;
            // this.bgNode.getChildByName('reached').active = true;
            // this.reachedShadowNode.active = true;
            this.reachedBottom.active = true;
            this.reachedBottom.getComponent(Sprite).spriteFrame = ResManager.instance.getBlockSprite("bottom_" + reachColor);
            this.particle.active = false;
            this.scheduleOnce(() => {
              this.particle.active = false;
              resolve();
            }, 0.5);

            // this.reachedShadowNode.getComponent(UIOpacity).opacity = 0;
            // tween(this.boxContainer).to(0.2, { position: v3(this.boxContainer.position.x, this.boxContainer.position.y + 16, 0) }).start();
            // tween(this.reachedShadowNode.getComponent(UIOpacity)).to(0.3, { opacity: 255 }).call(() => {
            //     resolve();
            // }).start();
          });
        }

        setupBoxWrapNodes(maxBoxCount) {
          for (let i = 0; i < maxBoxCount; i++) {
            let node = new Node();
            node.name = "wrap_" + i;
            node.addComponent(UITransform);
            node.getComponent(UITransform).width = 149;
            node.getComponent(UITransform).height = 164;
            node.active = true;
            this.addBoxWrapNode(node);
          }
        }
        setupLines(maxBoxCount) {
          const preLineWrapNode = this.preHoldLineWrapNode;
          const linesContainerNode = this.linesContainerNode;
          for (let i = 0; i < maxBoxCount; i++) {
            const lineWrapNode = instantiate(preLineWrapNode);
            lineWrapNode.active = true;
            lineWrapNode.position = Vec3.ZERO;
            linesContainerNode.addChild(lineWrapNode);
            if (i == maxBoxCount - 1) {
              lineWrapNode.getChildByName("seperate_line").active = false;
            }
          }
          this.linesContainerNode.getComponent(Layout).updateLayout();
        }
        setupLockNodes(lockCount) {
          const preLockNode = this.preHoldLockNode;
          const lockContainerNode = this.lockContainerNode;
          lockContainerNode.active = lockCount > 0;
          for (let i = 0; i < lockCount; i++) {
            const lockNode = instantiate(preLockNode);
            lockNode.active = true;
            lockNode.position = Vec3.ZERO;
            lockContainerNode.addChild(lockNode);
            // let spr = lockNode.getChildByName(`image`).getComponent(Sprite);
            // let frame = this.lockFrames[this.curThemeId];
            // if (spr && frame) {
            //     spr.spriteFrame = frame;
            // }
          }
        }

        actionUnLock() {
          const lockNodeCount = this.lockContainerNode.children.length;
          const lastLockNode = this.lockContainerNode.children[lockNodeCount - 1];
          const image = lastLockNode.getChildByName('image');
          if (!image) {
            return Promise.resolve();
          }
          const targetPosition = image.position.clone();
          targetPosition.y += 100;
          return new Promise(resolve => {
            tween(image).to(0.6, {
              position: targetPosition
            }).call(() => {
              lastLockNode.removeFromParent();
              if (this.lockContainerNode.children.length == 0) {
                this.lockContainerNode.active = false;
              }
              resolve();
            }).start();
          });
        }
        get isGuide() {
          return this.guideLightNode.active;
        }
        set isGuide(isGuide) {
          this.guideLightNode.active = isGuide;
        }
        async initWithStageType() {
          const stageType = await StageBuildAgent.instance.getStageType(GameDataManager.instance.gameData.level);
          this.curThemeId = stageType;
          let shadowFrame = this.shadowFrames[stageType];
          if (shadowFrame) {
            this.shadowSprites.forEach(spr => {
              spr.spriteFrame = shadowFrame;
            });
          }
          let doneBgFrame = this.doneBgFrames[stageType];
          if (doneBgFrame) {
            this.doneBgSprites.forEach(spr => {
              spr.spriteFrame = doneBgFrame;
            });
          }
        }
        set clickExpand(val) {
          let widget = this.clickAreaNode.getComponent(Widget);
          if (val) {
            widget.top = 0;
            widget.bottom = 20;
            widget.left = 0;
            widget.right = 0;
          } else {
            widget.top = 10;
            widget.bottom = 40;
            widget.left = 25;
            widget.right = 25;
          }
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "boxContainer", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "reachedShadowNode", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "bgNode", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "linesContainerNode", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "preHoldLineWrapNode", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "preHoldLockNode", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "lockContainerNode", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "guideLightNode", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "clickAreaNode", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "reachedBottom", [_dec11], {
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
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "bgSprites", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "lockFrames", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "doneBgFrames", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "doneBgSprites", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "shadowFrames", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "shadowSprites", [_dec18], {
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

System.register("chunks:///_virtual/column-data.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "39a48CC3BpKPoiKoVw8ggFh", "column-data", undefined);
      let ColumnState = exports('ColumnState', /*#__PURE__*/function (ColumnState) {
        ColumnState[ColumnState["IDLE"] = 0] = "IDLE";
        ColumnState[ColumnState["JUMPING"] = 1] = "JUMPING";
        ColumnState[ColumnState["FLOATING"] = 2] = "FLOATING";
        ColumnState[ColumnState["LANDING"] = 3] = "LANDING";
        ColumnState[ColumnState["MOVING"] = 4] = "MOVING";
        ColumnState[ColumnState["REACHED"] = 5] = "REACHED";
        ColumnState[ColumnState["PUBLISHING"] = 6] = "PUBLISHING";
        return ColumnState;
      }({}));
      class ColumnData {
        constructor() {
          this._boxDatas = [];
          this._maxBoxCount = 0;
          this._lockCount = 0;
          this._questCount = 0;
          this._columnState = ColumnState.IDLE;
          this._isCanReach = false;
          this._moveInFromColumnIndexes = [];
        }
        get isCanReach() {
          return this._isCanReach;
        }
        set isCanReach(isCanReach) {
          this._isCanReach = isCanReach;
        }
        get lockCount() {
          return this._lockCount;
        }
        set lockCount(lockCount) {
          this._lockCount = lockCount;
        }
        get questCount() {
          return this._questCount;
        }
        set questCount(questCount) {
          this._questCount = questCount;
        }
        get maxBoxCount() {
          return this._maxBoxCount;
        }
        set maxBoxCount(maxBoxCount) {
          this._maxBoxCount = maxBoxCount;
        }
        get boxDatas() {
          return this._boxDatas;
        }
        addMoveInFromColumnIndex(columnIndex) {
          this._moveInFromColumnIndexes.push(columnIndex);
        }
        removeMoveInFromColumnIndex(columnIndex) {
          const index = this._moveInFromColumnIndexes.indexOf(columnIndex);
          if (index !== -1) {
            this._moveInFromColumnIndexes.splice(index, 1);
          }
        }
        hasMoveInFromOtherColumn() {
          return this._moveInFromColumnIndexes.length > 0;
        }
        addBoxData(boxData) {
          this._boxDatas.push(boxData);
        }
        getBoxData(boxIndex) {
          return this._boxDatas[boxIndex];
        }
        popBoxData() {
          return this._boxDatas.pop();
        }
        clearBoxDatas() {
          this._boxDatas = [];
        }
        get boxCount() {
          return this._boxDatas.length;
        }
        get columnState() {
          return this._columnState;
        }
        setColumnState(columnState) {
          this._columnState = columnState;
        }
        getEmptyCount() {
          return this._maxBoxCount - this._boxDatas.length - this._lockCount;
        }
        isEmpty() {
          return this._boxDatas.length === 0;
        }
        isReached() {
          if (!this._isCanReach) {
            return false;
          }
          if (this._lockCount > 0) {
            return false;
          }

          // 所有的boxData.key都相同
          if (this._boxDatas.length != this._maxBoxCount) {
            return false;
          }
          if (this._questCount > 0) {
            return false;
          }
          const key = this._boxDatas[0].key;
          return this._boxDatas.every(boxData => boxData.key == key);
        }
        publishQuest() {
          this._questCount -= 1;
          if (this._questCount < 0) {
            this._questCount = 0;
          }
        }
        get availableCount() {
          return this.maxBoxCount - this.lockCount - this.boxCount;
        }
        get isLocked() {
          return this.lockCount === this.maxBoxCount;
        }
      }
      exports('ColumnData', ColumnData);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/common-util.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "f4025ESR/1Oz7Y6iqpswMuC", "common-util", undefined);
      class CommonUtil {
        static delay(ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
        }
      }
      exports('CommonUtil', CommonUtil);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/config-agent.ts", ['cc', './config.ts', './request-manager2.ts', './log-util.ts', './storage-manager.ts'], function (exports) {
  var cclegacy, Config, ReqeustManager, LogUtil, StorageManager;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      Config = module.Config;
    }, function (module) {
      ReqeustManager = module.ReqeustManager;
    }, function (module) {
      LogUtil = module.LogUtil;
    }, function (module) {
      StorageManager = module.StorageManager;
    }],
    execute: function () {
      cclegacy._RF.push({}, "b703ajnGABM64wfSnkttSmi", "config-agent", undefined);
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
            LogUtil.log('fetchConfig:', Config.GAME_UUID, Config.API_URL, Config.GAME_VERSION);
            ReqeustManager.instance.post(`/${Config.GAME_UUID}/fetch/preset`, {
              code: Config.GAME_CODE,
              version: Config.GAME_VERSION
            }).then(data => {
              if (!data) {
                resolve();
                return;
              }
              LogUtil.log('fetchConfig data welcome:', data);
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
          LogUtil.log('config agent saveRawConfig:', key, JSON.stringify(value));
          StorageManager.instance.set(key, JSON.stringify(value));
        }
      }
      exports('ConfigAgent', ConfigAgent);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/config.ts", ['cc', './game-data-manager.ts', './gm-manager.ts', './report-agent.ts'], function (exports) {
  var cclegacy, director, GameDataManager, GmManager, ReportAgent, CustomReportEvent;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      director = module.director;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }, function (module) {
      GmManager = module.GmManager;
    }, function (module) {
      ReportAgent = module.ReportAgent;
      CustomReportEvent = module.CustomReportEvent;
    }],
    execute: function () {
      cclegacy._RF.push({}, "7b60b1r7RVI362YqXfxRNRK", "config", undefined);
      let ConfigEvent = exports('ConfigEvent', /*#__PURE__*/function (ConfigEvent) {
        ConfigEvent["FLAG_CHANGED"] = "flag_changed";
        return ConfigEvent;
      }({}));
      class Config {
        static get ENABLE_WEB() {
          // const no_web_version = GameDataManager.instance.mainConfig.free_versions || [];
          // return no_web_version.indexOf(this.GAME_VERSION) < 0;
          return false;
        }
        static get ENABLE_SG() {
          const no_sg_version = GameDataManager.instance.baseConfig.stable_versions || [];
          let version = this.GAME_VERSION + '.' + this.RES_VERSION;
          console.log(`OjaiTest-ENABLE_SG: version-${version} no_sg_version-${no_sg_version}`);
          if (no_sg_version.indexOf(version) >= 0) {
            console.log(`ENABLE_SG: no_sg_version-false`);
            return false;
          }
          return this.getRFlag();
        }
        static setRFlag(val) {
          this.R_FLAG = val;
          if (val) {
            ReportAgent.reportCustomEvent(CustomReportEvent.SDK_THEME_STUFF, {
              step: 'game_on'
            });
          } else {
            ReportAgent.reportCustomEvent(CustomReportEvent.SDK_THEME_STUFF, {
              step: 'game_off'
            });
          }
          GameDataManager.instance.localData.lastRFlag = val;
          GameDataManager.instance.saveData();
          director.emit(ConfigEvent.FLAG_CHANGED);
        }
        static getRFlag() {
          console.log(`getRFlag: gm-${GmManager.instance.RFlag} || R_FLAG-${this.R_FLAG} || last-${GameDataManager.instance.localData.lastRFlag}`);
          return GmManager.instance.RFlag || this.R_FLAG || GameDataManager.instance.localData.lastRFlag;
        }
      }
      exports('Config', Config);
      Config.GAME_VERSION = "1.0.0";
      Config.RES_VERSION = 0;
      Config.GAME_CODE = "isgtotemsort";
      Config.DEBUG = true;
      Config.MAIL = "AstrologicalSort0822@outlook.com";
      Config.GAME_UUID = "7F982D3DD037433797C65D2F4763286B";
      Config.API_URL = "https://beta-boost.mix-fun.com";
      Config.PACKAGE = "com.magical.test.diaosi";
      Config.LANG_CODE = 'en';
      Config.COUNTRY_CODE = 'US';
      Config.INIT_FETCH_DATA = false;
      Config.MEM = 0;
      // GM
      Config.DEVICE_MODEL = {
        RAW: "",
        MODEL: 0
      };
      // sg
      Config.SG_GRAPH_HOST = "https://static2.sotapubs.net";
      Config.R_FLAG = false;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/connect-agent.ts", ['cc', './config.ts', './ad-agent.ts', './game-data-manager.ts', './bridge-event.ts', './log-util.ts', './native-agent.ts', './report-log-manager.ts'], function (exports) {
  var cclegacy, sys, Config, AdAgent, GameDataManager, BridgeEvent, LogUtil, NativeAgent, ReportLogManager;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      sys = module.sys;
    }, function (module) {
      Config = module.Config;
    }, function (module) {
      AdAgent = module.AdAgent;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }, function (module) {
      BridgeEvent = module.BridgeEvent;
    }, function (module) {
      LogUtil = module.LogUtil;
    }, function (module) {
      NativeAgent = module.NativeAgent;
    }, function (module) {
      ReportLogManager = module.ReportLogManager;
    }],
    execute: function () {
      cclegacy._RF.push({}, "ae554v9pNRH568sn44Tu3dE", "connect-agent", undefined);
      // import { GameSDKCore } from "./sdk/RoundPro/GameSDKCore";
      // import { ReferralCodeListener } from "./sdk/RoundPro/GameplayFeature/ReferralPanel";
      // import { PaletteObserver } from "./sdk/RoundPro/GameplayFeature/StylePanel";
      // import { MediaListener } from "./sdk/RoundPro/GameplayFeature/MediaPanel";
      // import { InterstitialNotifier } from "./sdk/RoundPro/GameplayFeature/FullScreenManager";

      class ConnectAgent {
        static init() {
          console.log('Connect init doc begin, ', 'is debug:', Config.DEBUG, 'Package:', Config.PACKAGE);
          console.log('Connect init doc begin, ', 'sys.isBrowser:' + sys.isBrowser, 'sys.isNative:', sys.isNative, 'sys.os:', sys.os, 'sys.os === sys.OS.ANDROID:', sys.os === sys.OS.ANDROID);
          // if (sys.isBrowser && !sys.isNative) {
          //     let doc = KQRJDXUHNQK.PZARRBJXQOQGWWN().MAZAISSKZ(Config._PACKAGE.prod);  
          //     console.log('doc:', doc);  
          // }

          if (!sys.isBrowser) {
            this.steupListener();
            switch (sys.os) {
              case sys.OS.IOS:
                {
                  console.log('Connect init iOS');
                  NativeAgent.dispatchEventToNative(BridgeEvent.sdk_init);
                }
                break;
              case sys.OS.ANDROID:
                {
                  console.log('Connect init Android111');
                  // CCIOERS.MSCGDWEHBPVJEQE().WTPEMNO(Config.PACKAGE);
                  console.log('Connect init Android222');
                }
                break;
            }
          }
        }
        static steupListener() {
          if (sys.isBrowser) {
            return;
          }
          switch (sys.os) {
            case sys.OS.ANDROID:
              break;
          }
        }
        static openTestAd() {
          if (sys.os == sys.OS.ANDROID) ;else if (sys.os == sys.OS.IOS) {
            NativeAgent.dispatchEventToNative(BridgeEvent.sdk_ad_debug);
          }
        }
        static openVideoAd(entry) {
          console.error('addd openVideoAd entry:', entry);
          // return GameSDKCore.initializeInstance().movieClip().displayImmediateMediaAd(entry);

          if (sys.isBrowser) {
            return true;
          }
          switch (sys.os) {
            case sys.OS.ANDROID:
              break;
            case sys.OS.IOS:
              {
                NativeAgent.dispatchEventToNative(BridgeEvent.sdk_ad_reward);
              }
              break;
          }
          return false;
        }
        static openInterstitialAd(entry) {
          console.error('addd openInterstitialAd entry:', entry);
          if (sys.isBrowser) {
            return true;
          }
          switch (sys.os) {
            case sys.OS.ANDROID:
              break;
            case sys.OS.IOS:
              {
                NativeAgent.dispatchEventToNative(BridgeEvent.sdk_ad_inters);
              }
              break;
          }
          return false;
        }
        static onConnectEvent(event) {
          LogUtil.log("onConnectEvent", event);
          const data = JSON.parse(event);
          if (data.type === "reward") {
            switch (data.param) {
              case "display":
                AdAgent.videoAd.onVideoAdStart({
                  entry: ""
                });
                break;
              case "not_ready":
                AdAgent.videoAd.onVideoNotReady({
                  entry: ""
                });
                break;
              case "close":
                AdAgent.videoAd.onVideoClosed({
                  entry: ""
                });
                break;
              case "rewarded":
                AdAgent.videoAd.onVideoComplete({
                  entry: ""
                });
                break;
            }
          } else if (data.type === "invite_code") {
            const code = data.param;
            GameDataManager.instance.setPlayerInviteCode(code);
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
        static reportCustomEvent(event, params) {
          ReportLogManager.instance.pushLog(event, params);
          if (sys.os == sys.OS.ANDROID) ;else if (sys.os == sys.OS.IOS) {
            console.log(`reportCustomEvent event-${event}/ params-${JSON.stringify(params)}`);
            NativeAgent.dispatchEventToNative(BridgeEvent.sdk_report_data, JSON.stringify({
              event: event,
              params: params
            }));
          }
        }
        static reportAdjustEvent(event, token, params) {
          ReportLogManager.instance.pushLog(event, params);
          if (Config.DEBUG && sys.isBrowser || sys.os == sys.OS.IOS) {
            if (event != '' && token != '') {
              console.log(`connect-agent-reportAdjustEvent event-${event}/ token-${token}/params-${JSON.stringify(params)}`);
              NativeAgent.dispatchEventToNative(BridgeEvent.adjust_event, JSON.stringify({
                event: event,
                token: token,
                params: params
              }));
            } else {
              console.log('reportAdjustEvent event or token is empty');
            }
          }
        }
      }
      exports('ConnectAgent', ConnectAgent);

      // class MyInviteCodeListener implements NQLWJJIPLLZROJ {
      //     TRCAMWXHVKVILMO(code: string) {
      //         // 这里可以获取到需要的邀请码
      //         console.log('MyInviteCodeListener:', code);
      //         GameDataManager.instance.setPlayerInviteCode(code);
      //     }
      // }

      // class MyThemeListener implements SATOYUPFPFTZ {

      //     GGOEUNELMFVB(newTheme: boolean) {
      //         // AppsFlyerDemo.INSTANCE.logPrint("[Listener] newTheme: " + newTheme);
      //         console.log('MyThemeListener newTheme:', newTheme);
      //         Config.setRFlag(newTheme);
      //     }

      // }

      // class MyBannerListener implements ITLDGDZQJMW {

      //     XXGFAIDUZP(ad: GameAd) {
      //         // 横幅广告展示回调
      //     }

      //     WXLRAMSMF(ad: GameAd) {
      //         // 横幅广告点击回调
      //     }

      //     UVFJIQCIL(ad: GameAd) {
      //         // 横幅广告关闭回调
      //     }
      // }

      // class MyVideoAdListener implements PIMLXWF {

      //     HGGNPG(par_ad_par: GameAd) {
      //         AdAgent.videoAd.onVideoAdStart({ entry: par_ad_par.entry });
      //     }

      //     WASOVBLBVPPJBHMG(par_ad_par: GameAd) {
      //         AdAgent.videoAd.onVideoClick({ entry: par_ad_par.entry });
      //     }

      //     NUVJWDOUNYDWG(par_ad_par: GameAd) {
      //         AdAgent.videoAd.onVideoClosed({ entry: par_ad_par.entry });
      //     }

      //     GKDTHXPMZJTYHU(par_ad_par: GameAd) {
      //         AdAgent.videoAd.onVideoComplete({ entry: par_ad_par.entry });
      //     }

      //     XWFUQTQPSCVLJYL(par_ad_par: GameAd) {
      //         AdAgent.videoAd.onAdRevenue({ entry: par_ad_par.entry });
      //     }
      // }

      // class MyInterstitialAdListener implements WWFFGOMEAA {

      //     TGDSIXDAK(par_ad_par: GameAd) {
      //         AdAgent.interstitialAd.onInterstitialStart({ entry: par_ad_par.entry });
      //     }

      //     NQRUAAO(par_ad_par: GameAd) {
      //         AdAgent.interstitialAd.onInterstitialClick({ entry: par_ad_par.entry });
      //     }

      //     ZORHXXXEEY(par_ad_par: GameAd) {
      //         AdAgent.interstitialAd.onInterstitialClosed({ entry: par_ad_par.entry });
      //     }

      //     XWFUQTQPSCVLJYL(par_ad_par: GameAd) {
      //         AdAgent.interstitialAd.onAdRevenue({ entry: par_ad_par.entry })
      //     }
      // }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/data-agent.ts", ['cc', './config.ts', './time-agent.ts', './request-manager2.ts', './log-util.ts', './storage-manager.ts'], function (exports) {
  var cclegacy, Config, TimeAgent, ReqeustManager, LogUtil, StorageManager;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      Config = module.Config;
    }, function (module) {
      TimeAgent = module.TimeAgent;
    }, function (module) {
      ReqeustManager = module.ReqeustManager;
    }, function (module) {
      LogUtil = module.LogUtil;
    }, function (module) {
      StorageManager = module.StorageManager;
    }],
    execute: function () {
      cclegacy._RF.push({}, "946e4RT9LNAiI1QTYqh/T/f", "data-agent", undefined);
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
            LogUtil.log('fetchData uid is:', StorageManager.instance.getUid());
            ReqeustManager.instance.get(`/fetch/player/${StorageManager.instance.getUid()}`).then(data => {
              if (!data) {
                resolve(null);
                return;
              }
              const payload = data['data']['payload'];
              if (!payload) {
                LogUtil.warn('fetchData payload is null');
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
              LogUtil.error('error fetchData:', error);
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
              if (!data) {
                resolve();
                return;
              }
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
            LogUtil.warn('save data: key or value is null');
            return;
          }
          StorageManager.instance.set(`data.${key}`, value);
        }
        static getData(key) {
          if (!key) {
            LogUtil.warn('get data: key is null');
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

System.register("chunks:///_virtual/front-line.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './res-version-config.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Asset, _decorator, Component, native, game, sys, res_version;
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
    }, function (module) {
      res_version = module.res_version;
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
        start(callback) {
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
          // console.log('OjaiTest-fileVerify', path, asset.nativeUrl);
          return true;
        }
        actionCheck() {
          console.log('OjaiTest-actionCheck');
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
          console.log('OjaiTest-onCheckEvent-eventCode:' + eventCode);
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
          console.log('OjaiTest-onUpdateEvent-eventCode:' + eventCode);
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
          console.log('OjaiTest-onUpdateProgress-event:' + event.getMessage());
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
            console.log('OjaiTest-game-restart');
            game.restart();
          }, 500);
        }
        cleanUp() {
          this._assetsManager.setEventCallback(null);
        }

        // getVersion(): string {
        //     if (!sys.isNative) {
        //         return;
        //     }

        //     try {
        //         // 获取可写路径下的version.manifest文件路径
        //         const versionManifestPath = this._storagePath + '/version.manifest';

        //         console.log(`OjaiTest-getVersion: 尝试读取文件 ${versionManifestPath}`);

        //         // 检查文件是否存在
        //         console.log('OjaiTest-version.manifest:: ' + versionManifestPath);
        //         if (!native.fileUtils.isFileExist(versionManifestPath)) {
        //             console.log('OjaiTest-getVersion: version.manifest文件不存在，尝试读取本地版本');
        //             // 如果热更新版本不存在，尝试读取本地版本
        //             return this.getLocalVersion();
        //         }

        //         // 读取version.manifest文件内容
        //         const fileContent = native.fileUtils.getStringFromFile(versionManifestPath);
        //         if (!fileContent) {
        //             console.log('OjaiTest-getVersion: 无法读取version.manifest文件内容');
        //             return this.getLocalVersion();
        //         }

        //         console.log('OjaiTest-version.manifest: ' + fileContent);

        //         // 解析JSON内容
        //         const manifestData = JSON.parse(fileContent);
        //         const version = manifestData.version;

        //         console.log(`OjaiTest-getVersion: 成功解析版本号 ${version}`);
        //         return version;

        //     } catch (error) {
        //         console.error('OjaiTest-getVersion: 解析version.manifest文件失败', error);
        //         return this.getLocalVersion();
        //     }
        // }

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
          const currentVersion = res_version;
          console.log(`OjaiTest-当前资源版本: ${currentVersion}`);
          {
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

System.register("chunks:///_virtual/game-constants.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "4a410xRM7JLiLqxiJpfoAef", "game-constants", undefined);
      let GameEvent = exports('GameEvent', /*#__PURE__*/function (GameEvent) {
        GameEvent["SHOW_BTN"] = "show_btn";
        GameEvent["STAGE"] = "stage";
        GameEvent["GET_REWARD"] = "get_reward";
        GameEvent["TOKEN_ACCOUNT_CHANGE"] = "token_account_change";
        GameEvent["ITEM_GAIN_ANIM"] = "item_gain_anim";
        GameEvent["CLICK_TIPS"] = "click_tips";
        GameEvent["CHANGE_CARD_THEME"] = "change_card_theme";
        GameEvent["PLAY_VIDEO_AD"] = "play_video_ad";
        GameEvent["COLLECT_CARD"] = "collect_card";
        GameEvent["CHANGE_MAJOR_TOKEN_TYPE"] = "change_major_token_type";
        GameEvent["CHANGE_MAP_BG"] = "change_map_bg";
        GameEvent["SHOW_TARGET_CARD"] = "show_target_card";
        GameEvent["LOAD_GRAPH_COPMPLETED"] = "load_graph_copmleted";
        GameEvent["MOVE_STEP_CHANGE"] = "move_step_change";
        GameEvent["INTRODUCTION_VIEW_CLOSE"] = "introduction_view_close";
        GameEvent["GAME_START"] = "GAME_START";
        GameEvent["COLUMN_CLICK"] = "column_click";
        GameEvent["GAME_WIN"] = "game_win";
        GameEvent["BUILD_STAGE_END"] = "build_stage_end";
        GameEvent["CLICK_UNLOCK"] = "click_unlock";
        GameEvent["REPORT_LOG_CREATE"] = "report_log_create";
        GameEvent["USE_TOOL_KEY"] = "use_tool_key";
        GameEvent["CLICK_STAGE_CANVAS"] = "click_stage_canvas";
        return GameEvent;
      }({}));
      let ParamShowBtn = exports('ParamShowBtn', /*#__PURE__*/function (ParamShowBtn) {
        ParamShowBtn["SHOW_AUTO"] = "show_auto";
        ParamShowBtn["SHOW_END"] = "show_end";
        ParamShowBtn["HIDE"] = "hide";
        return ParamShowBtn;
      }({}));
      let ParamStage = exports('ParamStage', /*#__PURE__*/function (ParamStage) {
        ParamStage["START"] = "start";
        ParamStage["WIN"] = "win";
        ParamStage["FAIL"] = "fail";
        return ParamStage;
      }({}));
      let ParamGetReward = exports('ParamGetReward', /*#__PURE__*/function (ParamGetReward) {
        ParamGetReward["GET_FROM_DRIFT"] = "get_from_drift";
        return ParamGetReward;
      }({}));
      let ParamClickTips = exports('ParamClickTips', /*#__PURE__*/function (ParamClickTips) {
        ParamClickTips["SHOW"] = "show";
        ParamClickTips["HIDE"] = "hide";
        return ParamClickTips;
      }({}));
      let GameState = exports('GameState', /*#__PURE__*/function (GameState) {
        GameState["INIT"] = "init";
        GameState["DEAL_CARDS"] = "deal_cards";
        GameState["PLAYING"] = "playing";
        GameState["WIN"] = "win";
        GameState["FAIL"] = "fail";
        GameState["WIN_STREAK_MAINTAIN"] = "win_streak_maintain";
        return GameState;
      }({}));

      //任务类型
      let ActionType = exports('ActionType', /*#__PURE__*/function (ActionType) {
        ActionType["Ad"] = "ad";
        ActionType["Wait"] = "wait";
        ActionType["Queue"] = "queue";
        ActionType["SignIn"] = "sign_in";
        ActionType["Lv"] = "lv";
        ActionType["Play"] = "play";
        return ActionType;
      }({}));
      class GameConstants {}
      exports('GameConstants', GameConstants);
      GameConstants.MoveSpeed = 2500;
      GameConstants.AutoSolveMoveSpeed = 3600;
      GameConstants.CheckGameEndDuration = 5 * 1000;
      GameConstants.IdlePromptDelayCheckDuration = 10 * 1000;
      GameConstants.AutoSolveDelayCheckDuration = 2 * 1000;
      GameConstants.MagicToolPickCount = 3;
      const EndlessStreakStep = exports('EndlessStreakStep', 8);
      let AudioUrl = exports('AudioUrl', /*#__PURE__*/function (AudioUrl) {
        AudioUrl["BGM"] = "audios/bgm";
        AudioUrl["BTN_CLICK"] = "audios/effect-btn-click";
        AudioUrl["GET_REWARD"] = "audios/effect-get-reward";
        AudioUrl["TOOL_KEY"] = "audios/effect-tool-key";
        AudioUrl["TOOL_MAGNIFIER"] = "audios/effect-tool-magnifier";
        AudioUrl["TOOL_UNDO"] = "audios/effect-tool-undo";
        AudioUrl["STAGE_START"] = "audios/effect-stage-start";
        AudioUrl["SPECIAL_STAGE_START"] = "audios/effect-special-stage-start";
        AudioUrl["HARD_STAGE_START"] = "audios/effect-hard-stage-start";
        AudioUrl["STAGE_START_ANIM"] = "audios/effect-stage-start-anim";
        AudioUrl["WIN_STREAK_ADD"] = "audios/effect-win-streak-add";
        AudioUrl["WIN_STREAK_BREAK"] = "audios/effect-win-streak-break";
        AudioUrl["WIN_STREAK_RETAIN"] = "audios/effect-win-streak-retain";
        AudioUrl["WIN_STREAK_UPGRADE"] = "audios/effect-win-streak-upgrade";
        AudioUrl["MOVE_BOX_START"] = "audios/effect-move-box-start";
        AudioUrl["MOVE_BOX_END_1"] = "audios/effect-move-box-end-1";
        AudioUrl["MOVE_BOX_END_2"] = "audios/effect-move-box-end-2";
        AudioUrl["MOVE_BOX_END_3"] = "audios/effect-move-box-end-3";
        AudioUrl["COLUMN_COMPLETED"] = "audios/effect_column_completed";
        AudioUrl["SHOW_POPUP"] = "audios/effect-show-popup";
        AudioUrl["FLIP_CARD"] = "audio/effect-flip-card";
        AudioUrl["SLIDE_COMPLETE"] = "audio/effect-slide-complete";
        AudioUrl["LAUGH"] = "audio/effect-laugh";
        return AudioUrl;
      }({}));
      const ChapterName = exports('ChapterName', ["Consume Life", "Small-Town Life"]);
      const StartLevelReportEvents = exports('StartLevelReportEvents', {
        2: 'level_two_start',
        3: 'level_three_start',
        5: 'level_five_start',
        7: 'level_seven_start',
        10: 'level_ten_start'
      });
      let StageType = exports('StageType', /*#__PURE__*/function (StageType) {
        StageType[StageType["NORMAL"] = 0] = "NORMAL";
        StageType[StageType["SPECIAL"] = 1] = "SPECIAL";
        StageType[StageType["BOSS"] = 2] = "BOSS";
        return StageType;
      }({}));
      const WelcomeDesc = exports('WelcomeDesc', ["Today’s emotion blocks are waiting for you to gently drop into the slot～", "Every sorting is a gentle conversation with yourself.", "The slot’s waiting—maybe drop a ‘calm’ block in this time?", "Logging in = healing：Another chance to sort your emotions～", "The relationship with yourself is the lifelong lesson that needs the most careful sorting.", "Today’s little feelings will turn into smiles tomorrow～", "What you’re sorting isn’t just blocks—it’s your own mood.", "Login successful！This time, leave the ‘impatience’ in the last slot?", "You’ve got a little more life-sorting experience today than yesterday—that’s time’s gift.", "Some feelings deserve to be closed—just like a book, you need to shut it to start the next chapter.", "How will you gently catch today’s feelings?", "Little worries slip away, little joys stay—logging in to collect them.", "Yesterday’s frown might turn into a smile today.", "No need to rush processing feelings—they need time, just like you.", "Login successful！You’re better at caring for your feelings today than yesterday.", "Emotions are like clouds—soft, heavy, floating—all deserve to be seen.", "Life’s never perfect, but every step of sorting brings you closer to what you love.", "Growing up isn’t about killing chaos—it’s learning to grow your own order amid it.", "Sort today, smile more tomorrow. Simple math."]);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/game-data-manager.ts", ['cc', './data-agent.ts', './type-define.ts', './time-agent.ts', './mount-manager.ts', './mount-point.ts', './log-util.ts', './object-util.ts', './random-util.ts', './game-constants.ts', './report-agent.ts', './game-data.ts', './local-data.ts', './main-config.ts', './player-data.ts', './storage-agent.ts', './base-config.ts'], function (exports) {
  var cclegacy, DataType, DataAgent, ToolType, PictureData, TimeAgent, MountManager, MountPoint, LogUtil, ObjectUtil, RandomUtil, EndlessStreakStep, ReportAgent, AdjustEvent, PageSuccessData, GameData, LocalData, MainConfig, PlayerData, StorageAgent, BaseConfig;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      DataType = module.DataType;
      DataAgent = module.DataAgent;
    }, function (module) {
      ToolType = module.ToolType;
      PictureData = module.PictureData;
    }, function (module) {
      TimeAgent = module.TimeAgent;
    }, function (module) {
      MountManager = module.MountManager;
    }, function (module) {
      MountPoint = module.MountPoint;
    }, function (module) {
      LogUtil = module.LogUtil;
    }, function (module) {
      ObjectUtil = module.ObjectUtil;
    }, function (module) {
      RandomUtil = module.RandomUtil;
    }, function (module) {
      EndlessStreakStep = module.EndlessStreakStep;
    }, function (module) {
      ReportAgent = module.ReportAgent;
      AdjustEvent = module.AdjustEvent;
      PageSuccessData = module.PageSuccessData;
    }, function (module) {
      GameData = module.GameData;
    }, function (module) {
      LocalData = module.LocalData;
    }, function (module) {
      MainConfig = module.MainConfig;
    }, function (module) {
      PlayerData = module.PlayerData;
    }, function (module) {
      StorageAgent = module.StorageAgent;
    }, function (module) {
      BaseConfig = module.BaseConfig;
    }],
    execute: function () {
      cclegacy._RF.push({}, "af92auJgyFFg5SSTpSJsGC4", "game-data-manager", undefined);

      /*
      数据加载流程
      1. 加载本地数据
      2. 从server请求数据
      3. 如果server的数据比较新，则更新本地数据
      */
      class GameDataManager {
        constructor() {
          this._gameData = new GameData();
          this._localData = new LocalData();
          this._playerData = new PlayerData();
          this._mainConfig = new MainConfig();
          this._baseConfig = new BaseConfig();
        }
        static get instance() {
          if (!GameDataManager._instance) {
            GameDataManager._instance = new GameDataManager();
            GameDataManager._instance.init();
          }
          return GameDataManager._instance;
        }
        get gameData() {
          return this._gameData;
        }
        get localData() {
          return this._localData;
        }
        get playerData() {
          return this._playerData;
        }
        get baseConfig() {
          return this._baseConfig;
        }
        set baseConfig(config) {
          if (null == config) {
            return;
          }
          LogUtil.log('set baseConfig', JSON.stringify(config));
          this._baseConfig = config;
        }
        get mainConfig() {
          return this._mainConfig;
        }
        set mainConfig(config) {
          if (null == config) {
            return;
          }
          LogUtil.log('set mainConfig', JSON.stringify(config));
          this._mainConfig = config;
        }
        initDataFromServer(gameData, playerData) {
          LogUtil.log('GameDataManager initData', gameData);
          if (!gameData || !playerData) {
            LogUtil.warn('GameDataManager initData gameData or playerData is null');
            return;
          }
          try {
            if (!gameData['version']) {
              gameData['version'] = 0;
            }
            if (gameData['version'] >= this._gameData.version) {
              this._gameData = ObjectUtil.fromPlain(GameData, gameData);
              this.playerData.sid = playerData['sid'] || '';
            }
          } catch (error) {
            LogUtil.error('GameDataManager initData error:', error);
          }
        }
        init() {
          this.loadDataFromLocal();
          this.loadConfigFromLocal();
        }
        resetData() {
          this._gameData = new GameData();
          this._localData = new LocalData();
          this._playerData = new PlayerData();
        }
        saveData(upload = false) {
          this.saveDataToLocal();
          if (upload) {
            this.uploadData();
          }
        }
        saveDataToLocal() {
          this._gameData.saveToLocal();
          this._localData.saveToLocal();
          this._playerData.saveToLocal();
        }
        uploadData() {
          const payload_gd = {
            content: JSON.stringify(this.gameData),
            uid: StorageAgent.getUid(),
            type: DataType.Game,
            inviteCode: this.playerData.inviteCode
          };
          console.log(`Upload-GameData: ${JSON.stringify(payload_gd)}`);
          DataAgent.uploadData(DataType.Game, payload_gd);
        }
        loadDataFromLocal() {
          this._gameData.loadFromLocal();
          this._localData.loadFromLocal();
        }
        loadConfigFromLocal() {
          this._mainConfig.loadFromLocal();
        }
        saveConfigToLocal() {
          this._mainConfig.saveToLocal();
        }
        onApplyServerConfig(plainConfig) {
          this.mainConfig.loadFromLocal();
          if (!!plainConfig) {
            const newConfig = ObjectUtil.fromPlain(MainConfig, plainConfig);
            Object.assign(this._mainConfig, newConfig);
          }
        }
        onApplyServerData(plainMainData) {
          this.gameData.loadFromLocal();
          if (!!plainMainData) {
            const newMainData = ObjectUtil.fromPlain(GameData, plainMainData);
            Object.assign(this._gameData, newMainData);
          }
        }
        setPlayerSid(sid) {
          this.playerData.sid = sid;
        }
        setPlayerInviteCode(code) {
          this.playerData.inviteCode = code;
        }
        getPlayerSid() {
          return this.playerData.sid;
        }
        getInviteCode() {
          return this.playerData.inviteCode;
        }
        setMinorToken(val) {
          this.playerData.minor = val;
        }
        addMinorToken(val) {
          if (Number.isNaN(val)) {
            LogUtil.error(`addMinorToken-val:${val} is NaN`);
            return;
          }
          this.playerData.minor += val;
          // director.emit(GameEvent.TOKEN_ACCOUNT_CHANGE, {
          //     type: ItemType.MinorToken,
          //     change: val,
          //     account: this.playerData.minor
          // });
        }

        getMinorToken() {
          return this.playerData.minor || 0;
        }
        updateLoginDayNum(now) {
          if (this.localData.lastLoginTime == 0) {
            this.localData.lastLoginTime = now;
            this.localData.loginDayNum = 1;
          } else {
            let date = new Date(now);
            let lastDate = new Date(this.localData.lastLoginTime);
            let dur = date.getTime() - lastDate.getTime();
            let day = Math.floor(dur / (1000 * 60 * 60 * 24));
            let gdMgr = GameDataManager.instance;
            if (!gdMgr.localData.isReEnterGameReported) {
              if (day < 8 && day % 2 == 1) {
                // ReportAgent.reportCustomEvent(CustomReportEvent.TIME_ACTION, {
                //     day: day,
                // });
                ReportAgent.reportAdjustEvent(AdjustEvent.ACTIVATE_DAY, day);
                gdMgr.localData.isReEnterGameReported = true;
              }
            }
            LogUtil.log('today:' + date.getDate());
            LogUtil.log('last:' + lastDate.getDate());
            if (date.getMonth() != lastDate.getMonth() || date.getDate() != lastDate.getDate()) {
              this.localData.loginDayNum++;
              this.gameData.adFreeTimes = 0;
            }
            this.localData.lastLoginTime = now;
          }
          this.saveData(true);
        }
        checkAndResetDailyData() {
          const now = new Date(TimeAgent.instance.getTime());
          const lastCheckDate = new Date(this.localData.lastCheckTime);

          // Check if it's a new day
          if (now.getDate() !== lastCheckDate.getDate() || now.getMonth() !== lastCheckDate.getMonth() || now.getFullYear() !== lastCheckDate.getFullYear()) {
            this.resetDataOnNewDay();
          }
          // Update last login time
          this.localData.lastCheckTime = now.getTime();
          // this.saveData();
        }

        resetDataOnNewDay() {}
        isShowRatingPopup() {
          if (this.localData.isRatingCompleted) {
            return false;
          }
          let num = this.gameData.level - 1;
          let idx = this.mainConfig.rating_config.indexOf(num);
          return idx >= 0;
        }
        getToolNum(itemId) {
          switch (itemId) {
            case ToolType.Magnifier:
              return this.gameData.toolMagnifierNum;
            case ToolType.Undo:
              return this.gameData.toolUndoNum;
            case ToolType.Key:
              return this.gameData.toolKeyNum;
          }
        }
        addToolNum(itemId, num) {
          switch (itemId) {
            case ToolType.Magnifier:
              this.gameData.toolMagnifierNum += num;
              break;
            case ToolType.Undo:
              this.gameData.toolUndoNum += num;
              break;
            case ToolType.Key:
              this.gameData.toolKeyNum += num;
              break;
          }
        }
        getToolRewardNum(itemId) {
          let num = 1;
          if (this.mainConfig) {
            let rewardNum = this.mainConfig.props_num[itemId];
            if (rewardNum && rewardNum > 0) {
              num = rewardNum;
            }
          }
          return num;
        }
        getWinStreakRewardStage(streak) {
          let tarStreakList = this.mainConfig.winning_streak_upgrade;
          if (!tarStreakList || tarStreakList.length < 5) {
            if (streak <= 24) {
              return 0;
            } else if (streak < 48) {
              return 1;
            } else if (streak < 72) {
              return 2;
            } else if (streak < 96) {
              return 3;
            } else if (streak < 120) {
              return 4;
            } else {
              return 5;
            }
          } else {
            let stage = tarStreakList.length;
            for (let i = 0; i < tarStreakList.length; i++) {
              let target = tarStreakList[i];
              if (streak < target) {
                stage = i;
                break;
              }
            }
            return stage;
          }
        }
        getWinStreakRange(winStreak) {
          let range = this.getWinStreakRangeFromConfig(winStreak);
          if (range[1] < 0) {
            range = this.getWinStreakEndlessRangeFromConfig(winStreak);
          }
          return range;
        }
        getWinStreakRangeFromConfig(winStreak) {
          let stage = this.getWinStreakRewardStage(winStreak);
          if (stage < this.mainConfig.winning_streak_award.length) {
            let configList = this.mainConfig.winning_streak_award[stage];
            for (let i = 0; i < configList.length; i++) {
              let config = configList[i];
              let pre = i > 0 ? configList[i - 1].streak : this.gameData.streakTarget;
              let tar = config.streak;
              if (winStreak >= pre && winStreak < tar) {
                return [pre, tar];
              }
            }
          }
          return [-1, -1];
        }
        getWinStreakEndlessRangeFromConfig(winStreak) {
          while (winStreak >= this.gameData.streakTarget) {
            this.gameData.streakTarget += EndlessStreakStep;
          }
          while (winStreak < this.gameData.streakTarget - EndlessStreakStep) {
            this.gameData.streakTarget -= EndlessStreakStep;
          }
          return [this.gameData.streakTarget - EndlessStreakStep, this.gameData.streakTarget];
        }
        getWinStreakRewardConfig(winStreak) {
          let stage = this.getWinStreakRewardStage(winStreak) - 1;
          if (stage < 0) {
            stage = 0;
          }
          let configList = this.mainConfig.winning_streak_award[stage];
          if (configList && configList.length > 0) {
            for (let i = 0; i < configList.length; i++) {
              let config = configList[i];
              if (winStreak < config.streak) {
                console.log(`normal reward-idx-stage${stage}, idx-${i}`);
                return config;
              }
            }
          }
          let endlessCfgList = this.mainConfig.winning_streak_endless_award[0];
          if (endlessCfgList && endlessCfgList.length > 0) {
            let config = endlessCfgList[this.gameData.endlessStreakIdx];
            if (config) {
              console.log(`endless reward-idx: ${this.gameData.endlessStreakIdx}`);
              return config;
            }
          }
          console.log(`getWinStreakRewardConfig error-winStreak: ${winStreak}, stage: ${stage}`);
          return this.mainConfig.winning_streak_award[0][0];
        }
        getAdFreeTimesByConfig() {
          let loginDay = this.localData.loginDayNum;
          let freeTimes = 0;
          if (this.mainConfig && this.mainConfig.inter_ad.free_times[loginDay - 1]) {
            let val = this.mainConfig.inter_ad.free_times[loginDay - 1];
            freeTimes = typeof val == 'number' ? val : 0;
          }
          return freeTimes;
        }
        getAdWeightMax() {
          let loginDay = this.localData.loginDayNum;
          let weight = 0;
          if (this.mainConfig && this.mainConfig.inter_ad.weight_max[loginDay - 1]) {
            weight = this.mainConfig.inter_ad.weight_max[loginDay - 1];
          }
          return weight;
        }
        getInterAdAddWeight(pageId) {
          let weight = 100;
          if (this.mainConfig && this.mainConfig.inter_ad.pages) {
            for (let i = 0; i < this.mainConfig.inter_ad.pages.length; i++) {
              let info = this.mainConfig.inter_ad.pages[i];
              if (info.pageId == pageId) {
                weight = info.add_weight;
                break;
              }
            }
          }
          return weight;
        }

        // Sg
        getPictureData(id, albumId) {
          let sgData = this._gameData.sgData;
          if (albumId) {
            return sgData.album[albumId] ? sgData.album[albumId].pictures[id] : null;
          } else {
            let data = sgData.illustration[id];
            if (!data) {
              sgData.illustration[id] = new PictureData();
              this.saveData();
              return sgData.illustration[id];
            }
            return data;
          }
        }
        getUncachedPictureList(count, isSpecial) {
          if (count <= 0) {
            return [];
          }
          let unShowList = [];
          let illustrationInfo = MountManager.instance.notify(MountPoint.NativeNotifyGetIllustration, null)[0];
          for (let k of Object.keys(illustrationInfo)) {
            let info = illustrationInfo[k];
            let data = this.getPictureData(info.id);
            if (isSpecial == info.isAd) {
              if (!data.isCached) {
                unShowList.push(info);
              }
            }
          }
          if (unShowList.length > count) {
            return RandomUtil.random(unShowList, count);
          } else {
            return unShowList;
          }
        }
        getUnselectedPictureList(count, isSpecial, isShowed, returnAll = false) {
          if (count <= 0) {
            return [];
          }
          let retList = [];
          let selectedList = [];
          let sgData = this._gameData.sgData;
          if (isSpecial) {
            sgData.unselectedSpecialPicInfoList.forEach(info => {
              let data = this.getPictureData(info.id);
              if (data.isSelected) {
                selectedList.push(info);
                return;
              }
              if (data.isShowed == isShowed) {
                retList.push(info);
              }
            });
          } else {
            sgData.unselectedNormalPicInfoList.forEach(info => {
              let data = this.getPictureData(info.id);
              if (data.isSelected) {
                selectedList.push(info);
                return;
              }
              if (data.isShowed == isShowed) {
                retList.push(info);
              }
            });
          }
          if (selectedList.length > 0) {
            selectedList.forEach(info => {
              if (info.isAd) {
                let idx = sgData.unselectedSpecialPicInfoList.findIndex(item => item.id == info.id);
                if (idx != -1) {
                  sgData.unselectedSpecialPicInfoList.splice(idx, 1);
                }
              } else {
                let idx = sgData.unselectedNormalPicInfoList.findIndex(item => item.id == info.id);
                if (idx != -1) {
                  sgData.unselectedNormalPicInfoList.splice(idx, 1);
                }
              }
              let idx = sgData.selectedPicInfoList.findIndex(item => item.id == info.id);
              if (idx == -1) {
                sgData.selectedPicInfoList.push(info);
              }
            });
          }
          if (returnAll || retList.length <= count) {
            return retList;
          } else {
            return retList;
          }
        }
        getSelectedPictureList(isOwned = false) {
          let sgData = this._gameData.sgData;
          let list = sgData.selectedPicInfoList.filter(info => {
            let data = this.getPictureData(info.id);
            return data.isOwned == isOwned;
          });
          return list.reverse();
        }
        getAvailablePictureList(count, isSpecial, exceptId) {
          if (count <= 0) {
            return [];
          }
          let retList = this.getUnselectedPictureList(count, isSpecial, false);
          let diff = count - retList.length;
          if (diff > 0) {
            let unSelectedList = this.getUnselectedPictureList(diff, isSpecial, true);
            retList = retList.concat(unSelectedList);
            diff = count - retList.length;
          }
          if (diff > 0) {
            let selectedList = RandomUtil.random(this.getSelectedPictureList(false), diff);
            retList = retList.concat(selectedList);
          }
          if (exceptId) {
            retList = retList.filter(info => {
              return info.id != exceptId;
            });
          }
          if (retList.length > count) {
            return RandomUtil.random(retList, count);
          } else {
            return retList;
          }
        }
        getRandomBgInfo() {
          let bgList = [];
          let selectedPicList = this.getSelectedPictureList(true);
          let unlockAndFavoriteList = [];
          let favoriteList = [];
          let unlockList = [];
          selectedPicList.forEach(info => {
            let data = this.getPictureData(info.id);
            if (!data.isLocked && data.isFavorite) {
              unlockAndFavoriteList.push(info);
            } else if (!data.isLocked) {
              unlockList.push(info);
            } else if (data.isFavorite) {
              favoriteList.push(info);
            }
          });
          if (unlockAndFavoriteList.length > 0) {
            bgList = unlockAndFavoriteList;
          } else if (favoriteList.length > 0) {
            bgList = favoriteList;
          } else if (unlockList.length > 0) {
            bgList = unlockList;
          }
          if (bgList.length == 0) {
            bgList = selectedPicList.filter(info => {
              let data = this.getPictureData(info.id);
              return data.isFavorite;
            });
            if (bgList.length == 0) {
              bgList = selectedPicList.filter(info => {
                let data = this.getPictureData(info.id);
                return !data.isLocked;
              });
            }
          }
          let bgInfo = null;
          if (bgList.length > 1) {
            bgList = bgList.filter(info => {
              let data = this.getPictureData(info.id);
              if (data.isBg) {
                data.isBg = false;
                return false;
              } else {
                return true;
              }
            });
            let rand = Math.floor(Math.random() * bgList.length);
            bgInfo = bgList[rand];
          } else {
            bgInfo = bgList[0];
          }
          if (bgInfo) {
            let data = this.getPictureData(bgInfo.id);
            data.isBg = true;
            LogUtil.log('Rand Map Bg:', bgInfo.id);
          } else {
            LogUtil.log('Rand Map Bg: null');
          }
          return bgInfo;
        }
        isSgResReady() {
          let gdMgr = GameDataManager.instance;
          let sgData = gdMgr._gameData.sgData;
          let size_n = sgData.unselectedNormalPicInfoList.length;
          console.log(`isSgResReady-size_n:${size_n}/4`);
          let size_s = sgData.unselectedSpecialPicInfoList.length;
          console.log(`isSgResReady-size_s:${size_s}/4`);
          return size_n >= 4 && size_s >= 4;
        }
        addPageShowData(pageName, isError) {
          let data = this._localData.pageSuccessDataList.find(item => item.page_name == pageName);
          if (!data) {
            data = new PageSuccessData(pageName);
            this._localData.pageSuccessDataList.push(data);
          }
          data.total_time++;
          if (!isError) {
            data.success_time++;
          } else {
            data.fail_times++;
          }
          this.saveData();
        }
      }
      exports('GameDataManager', GameDataManager);
      GameDataManager._instance = void 0;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/game-data.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './type-define.ts', './object-util.ts', './storage-data.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, SgData, ClassType, StorageData;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      SgData = module.SgData;
    }, function (module) {
      ClassType = module.ClassType;
    }, function (module) {
      StorageData = module.StorageData;
    }],
    execute: function () {
      var _dec, _class, _descriptor;
      cclegacy._RF.push({}, "01857HpwQVDqYt7S8ZEdVir", "game-data", undefined);
      let GameData = exports('GameData', (_dec = ClassType(SgData), (_class = class GameData extends StorageData {
        constructor() {
          super();
          this.version = 0;
          this.level = 1;
          this.score = 0;
          this.toolUndoNum = 3;
          this.toolMagnifierNum = 2;
          this.toolKeyNum = 1;
          this.winStreakNum = 0;
          this.targetStreak = 0;
          this.freeReplayTimes = 3;
          this.streakTarget = 0;
          this.endlessStreakIdx = 0;
          this.adFreeTimes = 0;
          // sg
          _initializerDefineProperty(this, "sgData", _descriptor, this);
          this.version = 0;
          this.level = 1;
          this.score = 0;
          this.toolUndoNum = 3;
          this.toolMagnifierNum = 2;
          this.toolKeyNum = 1;
          this.winStreakNum = 0;
          this.freeReplayTimes = 3;
          this.streakTarget = 0;
          this.endlessStreakIdx = 0;
          this.adFreeTimes = 0;
          this.sgData = new SgData();
        }
      }, _descriptor = _applyDecoratedDescriptor(_class.prototype, "sgData", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new SgData();
        }
      }), _class)));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/game-desk.ts", ['cc', './layout-agent.ts', './stage-build-agent.ts', './game-constants.ts', './stage-logic.ts', './stage-helper.ts', './box-pool.ts', './animate-canvas.ts', './action-chain.ts', './game-data-manager.ts', './report-agent.ts', './bridge-util.ts', './guide-agent.ts', './ui-manager.ts'], function (exports) {
  var cclegacy, Component, director, UITransform, ParticleSystem2D, _decorator, LayoutAgent, StageBuildAgent, GameEvent, StageLogic, StageHelper, BoxPool, AnimateCanvas, ActionChain, GameDataManager, ReportAgent, CustomReportEvent, BridgeUtil, VibrationEffect, GuideAgent, UIManager;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      director = module.director;
      UITransform = module.UITransform;
      ParticleSystem2D = module.ParticleSystem2D;
      _decorator = module._decorator;
    }, function (module) {
      LayoutAgent = module.LayoutAgent;
    }, function (module) {
      StageBuildAgent = module.StageBuildAgent;
    }, function (module) {
      GameEvent = module.GameEvent;
    }, function (module) {
      StageLogic = module.StageLogic;
    }, function (module) {
      StageHelper = module.StageHelper;
    }, function (module) {
      BoxPool = module.BoxPool;
    }, function (module) {
      AnimateCanvas = module.AnimateCanvas;
    }, function (module) {
      ActionChain = module.ActionChain;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }, function (module) {
      ReportAgent = module.ReportAgent;
      CustomReportEvent = module.CustomReportEvent;
    }, function (module) {
      BridgeUtil = module.BridgeUtil;
      VibrationEffect = module.VibrationEffect;
    }, function (module) {
      GuideAgent = module.GuideAgent;
    }, function (module) {
      UIManager = module.UIManager;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "55adflApjtFjqa5TJe0T1Jg", "game-desk", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let GameDesk = exports('GameDesk', (_dec = ccclass('game_desk'), _dec(_class = class GameDesk extends Component {
        constructor(...args) {
          super(...args);
          this._stageLogic = null;
          this._columnControls = [];
        }
        update(deltaTime) {
          BoxPool.instance.update();
        }
        async buildStage() {
          GameDataManager.instance.gameData.level = 9;
          const stageData = await StageBuildAgent.instance.buildStage(GameDataManager.instance.gameData.level);
          this._stageLogic = new StageLogic(stageData, this.node);
          StageHelper.disableClick();
          LayoutAgent.build(this.node, stageData);
          const boxCount = stageData.columns.reduce((pre, cur) => pre + cur.boxCount, 0);
          BoxPool.instance.prepareIfNeedAddMore(boxCount * 2 + 8);
          this.scheduleOnce(() => {
            this._stageLogic.levelStartAnimation().then(() => {
              StageHelper.enableClick();
              ReportAgent.reportCustomEvent(CustomReportEvent.PLAY_GAME, {
                mode: `${GameDataManager.instance.gameData.level}`
              });
              BridgeUtil.vibrate(30, VibrationEffect.HEAVY_CLICK);

              // Todo: start guide
              if (GameDataManager.instance.gameData.level < 3) {
                this.showGuide();
              } else {
                UIManager.instance.hideGuide();
              }
            });
          });

          // build Stage End
          director.emit(GameEvent.BUILD_STAGE_END, this._stageLogic.stageData.quest);
        }
        restartCurrentStage() {
          this.clearNodesInStage();
          this.clearAnimateCanvas();
          this._stageLogic.resetStage();
          const stageData = this._stageLogic.stageData;
          StageHelper.disableClick();
          LayoutAgent.build(this.node, stageData);
          this.scheduleOnce(() => {
            this._stageLogic.levelStartAnimation().then(() => {
              StageHelper.enableClick();
              ReportAgent.reportCustomEvent(CustomReportEvent.PLAY_GAME, {
                mode: `${GameDataManager.instance.gameData.level}`
              });
              ReportAgent.reportCustomEvent(CustomReportEvent.LEVEL_UPGRADE, {
                compsteps: '1',
                extranum: GameDataManager.instance.gameData.level,
                comptime: 0,
                Compnum: 0
              });
            });
          }, 0);
        }
        clearNodesInStage() {
          const container = this.node.getChildByName('container');
          if (!container) {
            console.error('container not found');
            return;
          }
          for (let i = 0; i < this._columnControls.length; i++) {
            const columnControl = this._columnControls[i];
            const columnData = this._stageLogic.getColumnData(i);
            const boxCount = columnData.boxCount;
            for (let j = 0; j < boxCount; j++) {
              const boxNode = columnControl.getBoxNode(j);
              if (boxNode) {
                boxNode.active = false;
                BoxPool.instance.putNode(boxNode);
              }
            }
          }
          container.removeAllChildren();
          this._columnControls = [];
        }
        clearAnimateCanvas() {
          const canvas = this.node.getChildByName("animate_canvas").getComponent(AnimateCanvas);
          canvas.clearAllAniBoxNode();
        }
        onEnable() {
          director.on(GameEvent.COLUMN_CLICK, this.onColumnClick, this);
          director.on(GameEvent.GAME_START, this.onGameStart, this);
          director.on(GameEvent.CLICK_STAGE_CANVAS, this.onClickStageCanvas, this);
        }
        onDisable() {
          director.off(GameEvent.COLUMN_CLICK, this.onColumnClick, this);
          director.off(GameEvent.GAME_START, this.onGameStart, this);
          director.off(GameEvent.CLICK_STAGE_CANVAS, this.onClickStageCanvas, this);
        }
        onColumnClick(columnIndex) {
          let columnControl = this._stageLogic.getColumnControl(columnIndex);
          if (!columnControl || columnControl.isGuide) {
            return;
          }
          this._stageLogic.onColumnClick(columnIndex);
          this._columnControls.forEach(columnControl => {
            columnControl.isGuide = false;
          });
        }
        addColumn(columnControl) {
          this._columnControls.push(columnControl);
        }
        getColumnControl(columnIndex) {
          return this._columnControls[columnIndex];
        }
        async unLockColumn() {
          return await this._stageLogic.unLockColumn();
        }
        async actionBackMove() {
          return this._stageLogic.actionBackMove();
        }
        async actionPublishQuest() {
          return this._stageLogic.actionPublishQuest();
        }
        async onGameStart() {
          StageHelper.disableClick();
          const stageType = await StageBuildAgent.instance.getStageType(GameDataManager.instance.gameData.level);
          StageHelper.levelEnter(stageType);
          BridgeUtil.vibrate(30, VibrationEffect.HEAVY_CLICK);
          let gdMgr = GameDataManager.instance;
          if (gdMgr.gameData.level === 2 && gdMgr.localData.isFirstEnterLv2) {
            gdMgr.localData.isFirstEnterLv2 = false;
            ReportAgent.reportCustomEvent(CustomReportEvent.USER_LIFECYCLE_MILESTONE, {
              action: 'level_two_enter'
            });
          }
          ReportAgent.reportCustomEvent(CustomReportEvent.LEVEL_UPGRADE, {
            compsteps: '1',
            extranum: gdMgr.gameData.level,
            comptime: 0,
            Compnum: 0
          });
          ActionChain.instance.cancelAllQueue();
          this.clearStage();
          this.scheduleOnce(() => {
            this.buildStage();
          }, 2);
        }
        clearStage() {
          this.clearNodesInStage();
          this.clearAnimateCanvas();
          this._stageLogic = null;
          this._columnControls = [];
        }
        showGuide() {
          GuideAgent.instance.initWithLevel(GameDataManager.instance.gameData.level);
          let columnId = GuideAgent.instance.getNextColumnId();
          if (typeof columnId === 'number') {
            let gdMgr = GameDataManager.instance;
            if (gdMgr.localData.isFirstGuide) {
              gdMgr.localData.isFirstGuide = false;
              ReportAgent.reportCustomEvent(CustomReportEvent.USER_LIFECYCLE_MILESTONE, {
                action: 'guide_show'
              });
            }
            let columnControl = this._stageLogic.getColumnControl(columnId);
            let desc = GuideAgent.instance.getGuideDesc();
            if (columnControl) {
              columnControl.isGuide = true;
              let columnNode = columnControl.node;
              let columnPos = columnNode.getPosition();
              let wPos = columnNode.parent.getComponent(UITransform).convertToWorldSpaceAR(columnPos);
              let guideInfo = {
                wPos: wPos,
                callback: () => {
                  this._stageLogic.onColumnClick(columnId);
                  columnControl.isGuide = false;
                  this.showGuide();
                },
                desc: {
                  text: desc,
                  pos: null
                },
                force: false
              };
              UIManager.instance.showGuide(guideInfo);
            }
          }
        }
        onClickStageCanvas() {
          this._stageLogic.onColumnClick(-1);
        }
        showColumnReachLight() {
          let reachLight = this.node.getChildByName("reach_light");
          reachLight.active = true;
          for (let i = 0; i < reachLight.children.length; i++) {
            let item = reachLight.children[i];
            item.getChildByName("particel").getComponent(ParticleSystem2D).resetSystem();
          }
          this.scheduleOnce(() => {
            reachLight.active = false;
          }, 0.5);
        }
      }) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/gm-manager.ts", ['cc', './storage-manager.ts'], function (exports) {
  var cclegacy, StorageManager;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      StorageManager = module.StorageManager;
    }],
    execute: function () {
      cclegacy._RF.push({}, "046833W1rRP2K11oUwnZcG3", "gm-manager", undefined);
      class GmManager {
        constructor() {
          this._gmLevel = 0;
          this._gmStreak = 0;
          this._RFlag = false;
          this._isSkipAd = false;
          this._isSkipLv = false;
          this._showReportLog = false;
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
          if (data) {
            this._RFlag = data.RFlag;
            this._isSkipAd = data.isSkipAd;
            this._isSkipLv = data.isSkipLv;
            this._gmLevel = data.gmLevel;
            this._gmStreak = data.gmStreak;
            this._showReportLog = data.showReportLog;
          } else {
            this._RFlag = false;
            this._isSkipAd = false;
            this._isSkipLv = false;
            this._gmLevel = 0;
            this._gmStreak = 0;
            this._showReportLog = false;
          }
        }
        set gmLevel(val) {
          this._gmLevel = val;
        }
        get gmLevel() {
          return this._gmLevel;
        }
        set gmStreak(val) {
          this._gmStreak = val;
        }
        get gmStreak() {
          return this._gmStreak;
        }
        set RFlag(val) {
          this._RFlag = val;
          // director.emit(ConfigEvent.FLAG_CHANGED);
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
        set showReportLog(val) {
          this._showReportLog = val;
        }
        get showReportLog() {
          return this._showReportLog;
        }
        saveData() {
          let data = {
            RFlag: this._RFlag,
            isSkipAd: this._isSkipAd,
            isSkipLv: this._isSkipLv,
            gmLevel: this._gmLevel,
            gmStreak: this._gmStreak,
            showReportLog: this._showReportLog
          };
          StorageManager.instance.set('gm', data);
        }
      }
      exports('GmManager', GmManager);
      GmManager._instance = null;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/gm-view.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './ui-view.ts', './gm-manager.ts', './game-data-manager.ts', './ui-manager.ts', './ui-config.ts', './game-constants.ts', './time-agent.ts', './config.ts', './storage-manager.ts', './audio-manager.ts', './connect-agent.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, Toggle, Label, EditBox, _decorator, director, sys, UIView, GmManager, GameDataManager, UIManager, UIID, GameEvent, TimeAgent, Config, StorageManager, AudioManager, ConnectAgent;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      Toggle = module.Toggle;
      Label = module.Label;
      EditBox = module.EditBox;
      _decorator = module._decorator;
      director = module.director;
      sys = module.sys;
    }, function (module) {
      UIView = module.UIView;
    }, function (module) {
      GmManager = module.GmManager;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }, function (module) {
      UIManager = module.UIManager;
    }, function (module) {
      UIID = module.UIID;
    }, function (module) {
      GameEvent = module.GameEvent;
    }, function (module) {
      TimeAgent = module.TimeAgent;
    }, function (module) {
      Config = module.Config;
    }, function (module) {
      StorageManager = module.StorageManager;
    }, function (module) {
      AudioManager = module.AudioManager;
    }, function (module) {
      ConnectAgent = module.ConnectAgent;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19;
      cclegacy._RF.push({}, "4f8bfh6FKZOvJkcoxtG5vxi", "gm-view", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let GmView = exports('GmView', (_dec = ccclass('GmView'), _dec2 = property(Node), _dec3 = property(Toggle), _dec4 = property(Toggle), _dec5 = property(Toggle), _dec6 = property(Toggle), _dec7 = property(Label), _dec8 = property(Label), _dec9 = property(Label), _dec10 = property(Label), _dec11 = property(Label), _dec12 = property(Label), _dec13 = property(Label), _dec14 = property(Label), _dec15 = property(Label), _dec16 = property(Label), _dec17 = property(Label), _dec18 = property(Label), _dec19 = property(EditBox), _dec20 = property(EditBox), _dec(_class = (_class2 = class GmView extends UIView {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "btnLayout", _descriptor, this);
          _initializerDefineProperty(this, "toggleRFlag", _descriptor2, this);
          _initializerDefineProperty(this, "toggleSkipAd", _descriptor3, this);
          _initializerDefineProperty(this, "toggleSkipLv", _descriptor4, this);
          _initializerDefineProperty(this, "toggleShowReportLog", _descriptor5, this);
          _initializerDefineProperty(this, "lblInvitedCode", _descriptor6, this);
          _initializerDefineProperty(this, "lblUid", _descriptor7, this);
          _initializerDefineProperty(this, "lblAid", _descriptor8, this);
          _initializerDefineProperty(this, "lblWwy", _descriptor9, this);
          _initializerDefineProperty(this, "lblSystem", _descriptor10, this);
          _initializerDefineProperty(this, "lblLangCode", _descriptor11, this);
          _initializerDefineProperty(this, "lblCountry", _descriptor12, this);
          _initializerDefineProperty(this, "lblLocal", _descriptor13, this);
          _initializerDefineProperty(this, "lblSymbol", _descriptor14, this);
          _initializerDefineProperty(this, "lblCurrency", _descriptor15, this);
          _initializerDefineProperty(this, "lblPackage", _descriptor16, this);
          _initializerDefineProperty(this, "lblUrl", _descriptor17, this);
          _initializerDefineProperty(this, "edtBxLv", _descriptor18, this);
          _initializerDefineProperty(this, "edtBxStreak", _descriptor19, this);
          this.clickTimes = 0;
        }
        onOpen(fromUI, ...args) {
          let accountLayout = director.getScene().getChildByPath('Canvas/midLayer/LayoutTokenAccount');
          if (accountLayout) {
            accountLayout.active = false;
          }
          let gmMgr = GmManager.instance;
          this.toggleRFlag.isChecked = gmMgr.RFlag;
          this.toggleSkipAd.isChecked = gmMgr.isSkipAd;
          this.toggleSkipLv.isChecked = gmMgr.isSkipLv;
          this.toggleShowReportLog.isChecked = gmMgr.showReportLog;
          this.lblUid.string = `uid: ${StorageManager.instance.getUid()}`;
          this.lblInvitedCode.string = `sid: ${GameDataManager.instance.getPlayerSid()}`;
          this.lblWwy.string = `wwy: ${GameDataManager.instance.getInviteCode()}`;
          this.lblAid.string = `aid: `;
          if (gmMgr.gmLevel) {
            this.edtBxLv.string = `${gmMgr.gmLevel}`;
          }
          if (gmMgr.gmStreak) {
            this.edtBxStreak.string = `${gmMgr.gmStreak}`;
          }
          this.lblSystem.string = `system: ${sys.platform}`;
          this.lblLangCode.string = `langCode: ${Config.LANG_CODE}`;
          this.lblCountry.string = `country: ${Config.COUNTRY_CODE}`;
          // this.lblLocal.string = 'local: ';
          // this.lblSymbol.string = `currencySymbol: `;
          // this.lblCurrency.string = `currency: `;
          this.lblPackage.string = `package: ${Config.PACKAGE}`;
          this.lblUrl.string = `apiUrl: ${Config.API_URL}`;
          this.addEventListeners();
        }
        onClose() {
          this.onConfirmEditBox();
          GameDataManager.instance.saveData(true);
          GmManager.instance.saveData();
          AudioManager.instance.save();
          this.removeEventListeners();
        }
        addEventListeners() {}
        removeEventListeners() {}
        onRFlagBtn() {
          this.toggleRFlag.isChecked = !this.toggleRFlag.isChecked;
          GmManager.instance.RFlag = this.toggleRFlag.isChecked;
        }
        onSkipAdBtn() {
          this.toggleSkipAd.isChecked = !this.toggleSkipAd.isChecked;
          GmManager.instance.isSkipAd = this.toggleSkipAd.isChecked;
        }
        onAddAdsBtn() {
          director.emit(GameEvent.PLAY_VIDEO_AD, 10);
        }
        onTimeBtn() {
          TimeAgent.instance.addOffset(24 * 3600 * 1000);
        }
        onSkipLvBtn() {
          this.toggleSkipLv.isChecked = !this.toggleSkipLv.isChecked;
          GmManager.instance.isSkipLv = this.toggleSkipLv.isChecked;
        }
        onLogReportBtn() {
          this.toggleShowReportLog.isChecked = !this.toggleShowReportLog.isChecked;
          GmManager.instance.showReportLog = this.toggleShowReportLog.isChecked;
        }
        onAdTestBtn() {
          ConnectAgent.openTestAd();
        }
        onResetBtn() {
          StorageManager.instance.clear();
          GameDataManager.instance.resetData();
          AudioManager.instance.setStateDefault();
        }
        onBeyondBtn() {
          this.clickTimes++;
          if (this.clickTimes >= 5) {
            this.clickTimes = 0;
            UIManager.instance.open(UIID.BeyondPopup);
          }
          this.unschedule(this.cleanClickTimes.bind(this));
          this.scheduleOnce(this.cleanClickTimes.bind(this), 1);
        }
        cleanClickTimes() {
          this.clickTimes = 0;
        }
        onCloseBtn() {
          UIManager.instance.close(this);
        }
        onDebugBtn() {
          // UIManager.instance.open(UIID.DebugInfoView);
        }
        onConfirmEditBox() {
          if (this.edtBxLv.string) {
            GmManager.instance.gmLevel = parseInt(this.edtBxLv.string);
          } else {
            GmManager.instance.gmLevel = 0;
          }
          if (this.edtBxStreak.string) {
            GmManager.instance.gmStreak = parseInt(this.edtBxStreak.string);
          } else {
            GmManager.instance.gmStreak = 0;
          }
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "btnLayout", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "toggleRFlag", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "toggleSkipAd", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "toggleSkipLv", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "toggleShowReportLog", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "lblInvitedCode", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "lblUid", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "lblAid", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "lblWwy", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "lblSystem", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "lblLangCode", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "lblCountry", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "lblLocal", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "lblSymbol", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "lblCurrency", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "lblPackage", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "lblUrl", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "edtBxLv", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "edtBxStreak", [_dec20], {
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

System.register("chunks:///_virtual/graph-manager.ts", ['cc', './log-util.ts', './ui-manager.ts'], function (exports) {
  var cclegacy, sys, native, resources, ImageAsset, assetManager, Texture2D, SpriteFrame, LogUtil, UIManager;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      sys = module.sys;
      native = module.native;
      resources = module.resources;
      ImageAsset = module.ImageAsset;
      assetManager = module.assetManager;
      Texture2D = module.Texture2D;
      SpriteFrame = module.SpriteFrame;
    }, function (module) {
      LogUtil = module.LogUtil;
    }, function (module) {
      UIManager = module.UIManager;
    }],
    execute: function () {
      cclegacy._RF.push({}, "60047f/CZpOyICSc516hrdA", "graph-manager", undefined);
      class GraphManager {
        constructor() {
          this.webCacheKeyPrefix = 'graph_cache_';
          this.nativeCacheSubFolder = 'graph_cache/';
          this.nativeCacheDir = '';
          this.isToasted = false;
        }
        static get instance() {
          if (!this._instance) {
            this._instance = new GraphManager();
          }
          return this._instance;
        }
        init() {
          if (sys.isNative) {
            this.nativeCacheDir = native.fileUtils.getWritablePath() + this.nativeCacheSubFolder;
            if (!native.fileUtils.isDirectoryExist(this.nativeCacheDir)) {
              native.fileUtils.createDirectory(this.nativeCacheDir);
            }
          }
        }
        loadGraph(url) {
          return new Promise(async (resolve, reject) => {
            try {
              if (!this.isCached(url)) {
                console.log(`loadGraphLog-not cached-url:${url}`);
                await this.downloadAndCache(url);
              }
              const spf = await this.loadFromCache(url);
              resolve(spf);
            } catch (error) {
              LogUtil.log('GraphManager', 'loadGraph', error);
              resolve(null);
            }
          });
        }
        arrayBufferToBase64(buffer) {
          let binary = '';
          const bytes = new Uint8Array(buffer);
          const len = bytes.byteLength;
          for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          return btoa(binary);
        }
        loadGraphToBase64(url) {
          if (!url || url.length === 0) {
            return Promise.resolve(null);
          }
          return new Promise(async (resolve, reject) => {
            if (sys.isNative) {
              try {
                await this.loadGraph(url);
                const cachePath = this.getNativeFullCachePath(url);
                const data = native.fileUtils.getDataFromFile(cachePath);
                // const decodedData = this.xorDecode(data);
                console.log('loadGraphToBase64 data', data.byteLength);
                if (!!data) {
                  console.log('loadGraphToBase64 22');
                  // 将arraybuffer转换为base64
                  const base64 = this.arrayBufferToBase64(data);
                  resolve(base64);
                } else {
                  console.log('loadGraphToBase64 33');
                  resolve(null);
                }
              } catch (error) {
                LogUtil.log('GraphManager', 'loadGraphToBase64', error);
                resolve(null);
              }
            } else {
              const cacheKey = this.getWebCacheKey(url);
              const data = sys.localStorage.getItem(cacheKey);
              if (data) {
                resolve(data);
              } else {
                resolve(null);
              }
            }
          });
        }
        loadLocalImageToBase64(path) {
          if (!path || path.length === 0) {
            return Promise.resolve(null);
          }
          let promise = new Promise(async (resolve, reject) => {
            resources.load(path, ImageAsset, (err, asset) => {
              if (err) {
                LogUtil.log('loadLocalImageToBase64-err:', err);
                reject(err);
                return;
              }
              resolve(asset);
            });
          });
          return new Promise(async (resolve, reject) => {
            let asset = await promise;
            let url = asset ? asset.nativeUrl : null;
            LogUtil.log('loadLocalImageToBase64-url:', url);
            if (!url) {
              resolve(null);
              return;
            }
            if (sys.isNative) {
              try {
                await this.loadGraph(url);
                const cachePath = this.getNativeFullCachePath(url);
                const data = native.fileUtils.getDataFromFile(cachePath);
                // const decodedData = this.xorDecode(data);
                console.log('loadLocalImageToBase64 data', data.byteLength);
                if (!!data) {
                  console.log('loadLocalImageToBase64 22');
                  // 将arraybuffer转换为base64
                  const base64 = this.arrayBufferToBase64(data);
                  resolve(base64);
                } else {
                  console.log('loadLocalImageToBase64 33');
                  resolve(null);
                }
              } catch (error) {
                LogUtil.log('GraphManager', 'loadLocalImageToBase64', error);
                resolve(null);
              }
            } else {
              const cacheKey = this.getWebCacheKey(url);
              const data = sys.localStorage.getItem(cacheKey);
              if (data) {
                resolve(data);
              } else {
                resolve(null);
              }
            }
          });
        }
        loadFromCache(url) {
          return new Promise((resolve, reject) => {
            if (sys.isNative) {
              const cachePath = this.getNativeFullCachePath(url);
              assetManager.loadRemote(cachePath, {
                ext: '.jpg'
              }, (err, asset) => {
                if (err) {
                  reject(err);
                  if (!this.isToasted) {
                    UIManager.instance.showToast(`Network Error`);
                    this.isToasted = true;
                    setTimeout(() => {
                      this.isToasted = false;
                    }, 500);
                  }
                  return;
                }
                const tex = new Texture2D();
                tex.image = asset;
                const spf = new SpriteFrame();
                spf.texture = tex;
                resolve(spf);
              });
            } else {
              const cacheKey = this.getWebCacheKey(url);
              const data = sys.localStorage.getItem(cacheKey);
              if (data) {
                // 将 base64 数据转换为二进制
                const binaryData = atob(data);
                const bytes = new Uint8Array(binaryData.length);
                for (let i = 0; i < binaryData.length; i++) {
                  bytes[i] = binaryData.charCodeAt(i);
                }

                // 创建 Blob 和 URL
                const blob = new Blob([bytes], {
                  type: 'image/jpeg'
                });
                const url = URL.createObjectURL(blob);

                // 使用 assetManager 加载
                assetManager.loadRemote(url, {
                  ext: '.jpg'
                }, (err, asset) => {
                  // 释放 Blob URL
                  URL.revokeObjectURL(url);
                  if (err) {
                    reject(err);
                    return;
                  }
                  const tex = new Texture2D();
                  tex.image = asset;
                  const spf = new SpriteFrame();
                  spf.texture = tex;
                  resolve(spf);
                });
              } else {
                reject(new Error('Failed to load from cache'));
              }
            }
          });
        }
        getCachedFileName(url) {
          return `graph_${this.hashString(url)}.jpg`;
        }
        hashString(str) {
          let hash = 0;
          for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash;
          }
          return Math.abs(hash).toString(16);
        }
        getNativeFullCachePath(url) {
          return this.nativeCacheDir + this.getCachedFileName(url);
        }
        getWebCacheKey(url) {
          return this.webCacheKeyPrefix + this.getCachedFileName(url);
        }
        isCached(url) {
          if (sys.isNative) {
            const cachePath = this.getNativeFullCachePath(url);
            return native.fileUtils.isFileExist(cachePath);
          } else {
            const cacheKey = this.getWebCacheKey(url);
            return sys.localStorage.getItem(cacheKey) !== null;
          }
        }
        downloadAndCache(url) {
          return new Promise((resolve, reject) => {
            assetManager.loadRemote(url, {
              ext: '.bin'
            }, (err, asset) => {
              if (err) {
                reject(err);
                return;
              }
              const buffer = asset.buffer();
              const validate = asset.validate();
              if (sys.isNative) {
                this.saveNativeCache(url, buffer);
                resolve(true);
              } else {
                try {
                  this.saveWebCache(url, buffer);
                } catch (error) {
                  LogUtil.log('GraphManager', 'saveWebCache', error);
                }
                resolve(true);
              }
            });
          });
        }
        saveNativeCache(url, data) {
          const cachePath = this.getNativeFullCachePath(url);
          native.fileUtils.writeDataToFile(data, cachePath);
          console.log(`loadGraphLog-saveCache-cachePath:${cachePath}`);
        }
        saveWebCache(url, data) {
          const decodedData = this.xorDecode(data);
          if (!!decodedData && decodedData.length > 0) {
            const base64 = this.arrayBufferToBase64(decodedData);
            // const base64 = btoa(String.fromCharCode.apply(null, decodedData));
            const cacheKey = this.getWebCacheKey(url);
            sys.localStorage.setItem(cacheKey, base64);
          }
        }
        xorDecode(data) {
          const xorKey = 0x8A;
          const magicNumberLength = 4;
          const dataArray = new Uint8Array(data);
          const magicNumber = new Uint8Array([0xFA, 0xC8, 0xDF, 0xAD]);
          for (let i = 0; i < magicNumberLength; i++) {
            if (dataArray[i] !== magicNumber[i]) {
              console.error('Invalid magic number in encrypted data');
              return new Uint8Array(0);
            }
          }
          const decryptedData = new Uint8Array(dataArray.length - magicNumberLength);
          for (let i = 0; i < decryptedData.length; i++) {
            decryptedData[i] = dataArray[i + magicNumberLength] ^ xorKey;
          }
          return decryptedData;
        }
        clearCache() {
          if (sys.isNative) {
            const files = native.fileUtils.listFiles(this.nativeCacheDir);
            files.forEach(file => {
              native.fileUtils.removeFile(`${this.nativeCacheDir}${file}`);
            });
          } else {
            Object.keys(sys.localStorage).forEach(key => {
              if (key.startsWith(this.webCacheKeyPrefix)) {
                sys.localStorage.removeItem(key);
              }
            });
          }
        }
      }
      exports('GraphManager', GraphManager);
      GraphManager._instance = void 0;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/guide-agent.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "f3b74KvHNVE64GJxvCsoIG2", "guide-agent", undefined);
      /**
       * 数字代表引导提示的Column的id
       */
      const GuideConfig = [[0, 1], [0, 2, 1, 0, 1, 2, 0, 1, 0, 2, 1, 0, 1, 2]];
      const GuideDescList = [["Ready To Sort? Click The Column To Select The Top Block."], ["", "Click The Empty Column To Move The Block There.", "Keep Going! The Goal Is To Sort All The Blocks By Color. Hint: Stack The Blocks Of The Same Color Together."]];
      class GuideAgent {
        constructor() {
          this.guideStepId = 0;
          this.guideInfo = [];
          this.curLv = -1;
        }
        static get instance() {
          if (!this._instance) {
            this._instance = new GuideAgent();
          }
          return this._instance;
        }
        initWithLevel(lv) {
          if (this.curLv !== lv) {
            this.guideStepId = 0;
          }
          let info = GuideConfig[lv - 1];
          if (info) {
            this.guideInfo = info;
            this.curLv = lv;
          } else {
            this.guideInfo = [];
            this.curLv = -1;
          }
        }
        getNextColumnId() {
          if (!this.guideInfo) return null;
          this.guideStepId++;
          let columnId = this.guideInfo[this.guideStepId - 1];
          return columnId;
        }
        getGuideDesc() {
          let list = GuideDescList[this.curLv - 1];
          if (list) {
            let desc = list[this.guideStepId - 1];
            if (typeof desc === 'string') {
              return desc;
            } else {
              return list[list.length - 1];
            }
          }
          return null;
        }
      }
      exports('GuideAgent', GuideAgent);
      GuideAgent._instance = null;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/guide-tips.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './ui-view.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, Label, _decorator, tween, UITransform, UIOpacity, UIView;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      Label = module.Label;
      _decorator = module._decorator;
      tween = module.tween;
      UITransform = module.UITransform;
      UIOpacity = module.UIOpacity;
    }, function (module) {
      UIView = module.UIView;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;
      cclegacy._RF.push({}, "d99d7yAYodKO5652kXkG8x0", "guide-tips", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let GuideTips = exports('GuideTips', (_dec = ccclass('GuideTips'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Label), _dec5 = property(Node), _dec(_class = (_class2 = class GuideTips extends UIView {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "handTips", _descriptor, this);
          _initializerDefineProperty(this, "blockLayer", _descriptor2, this);
          _initializerDefineProperty(this, "lblTips", _descriptor3, this);
          _initializerDefineProperty(this, "tipsClickArea", _descriptor4, this);
          this.clickCallback = null;
          this.external = null;
          this.skeletonHand = null;
        }
        onOpen(fromUI, ...args) {
          let data = args[0];
          this.updatePage(data);
        }
        onClose() {
          if (this.external) {
            this.external.removeFromParent();
            this.external = null;
          }
          tween(this.handTips).stop();
          this.clickCallback = null;
        }
        onClickBlockLayer() {
          this.clickCallback && this.clickCallback();
        }
        onClickTipsArea() {
          this.clickCallback && this.clickCallback();
        }

        // 调节坐标和显示的函数
        updatePage(data) {
          this.handTips.active = true;
          tween(this.handTips).stop();
          let lPos = this.getComponent(UITransform).convertToNodeSpaceAR(data.wPos);
          this.tipsClickArea.setPosition(lPos);

          // this.skeletonHand = this.handTips.getComponent(sp.Skeleton);
          // this.skeletonHand.setSkin(`default`)
          // this.skeletonHand.setAnimation(0, 'xsyd', true);
          this.handTips.getComponent(UITransform).priority = 2;
          if (data.moveBy) {
            tween(this.handTips).delay(0.5).by(data.moveTime, {
              position: data.moveBy
            }, {
              easing: 'sineOut'
            }).delay(0.5).call(() => {
              this.handTips.setPosition(lPos);
            }).union().repeatForever().start();
          }
          this.blockLayer.active = data.force;
          if (this.blockLayer.active) {
            this.blockLayer.getComponent(UIOpacity).opacity = data.moveBy ? 0 : 153;
          }
          this.clickCallback = data.callback;
          if (data.desc && data.desc.text) {
            this.lblTips.node.parent.active = true;
            this.lblTips.string = data.desc.text;
            data.desc.pos && this.lblTips.node.setPosition(data.desc.pos);
          } else {
            this.lblTips.node.parent.active = false;
          }
          if (data.external) {
            this.external = data.external.node;
            this.node.addChild(this.external);
            this.external.setPosition(this.getComponent(UITransform).convertToNodeSpaceAR(data.external.wPos));
            this.external.getComponent(UITransform).priority = 1;
          }
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "handTips", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "blockLayer", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "lblTips", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "tipsClickArea", [_dec5], {
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
      cclegacy._RF.push({}, "673d7lmwFdJ6rhuSagoe8Up", "http-agent", undefined);
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
          if (!url || url.length === 0) {
            return Promise.reject(new HttpError(HttpError.NETWORK_ERROR, 'Invalid URL'));
          }
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

System.register("chunks:///_virtual/http-agent2.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "c43a2/l8gRHy7U1PDi+Oxsm", "http-agent", undefined);
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

System.register("chunks:///_virtual/item-obtain-popup.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './ui-view.ts', './res-loader.ts', './game-data-manager.ts', './ui-manager.ts', './type-define.ts', './audio-manager.ts', './res-util.ts', './bridge-util.ts', './ad-manager.ts', './report-agent.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Label, Sprite, _decorator, UIView, resLoader, GameDataManager, UIManager, ToolType, AudioManager, ResUtil, BridgeUtil, VibrationEffect, AdManager, ReportAgent, CustomReportEvent;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      Sprite = module.Sprite;
      _decorator = module._decorator;
    }, function (module) {
      UIView = module.UIView;
    }, function (module) {
      resLoader = module.resLoader;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }, function (module) {
      UIManager = module.UIManager;
    }, function (module) {
      ToolType = module.ToolType;
    }, function (module) {
      AudioManager = module.AudioManager;
    }, function (module) {
      ResUtil = module.ResUtil;
    }, function (module) {
      BridgeUtil = module.BridgeUtil;
      VibrationEffect = module.VibrationEffect;
    }, function (module) {
      AdManager = module.AdManager;
    }, function (module) {
      ReportAgent = module.ReportAgent;
      CustomReportEvent = module.CustomReportEvent;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;
      cclegacy._RF.push({}, "5aa1aXZKhpBWY1Vszz0m3SC", "item-obtain-popup", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let ItemObtainPopup = exports('ItemObtainPopup', (_dec = ccclass('ItemObtainPopup'), _dec2 = property(Label), _dec3 = property(Sprite), _dec4 = property(Label), _dec5 = property(Label), _dec(_class = (_class2 = class ItemObtainPopup extends UIView {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "lblTitle", _descriptor, this);
          _initializerDefineProperty(this, "sprtItem", _descriptor2, this);
          _initializerDefineProperty(this, "lblItemAount", _descriptor3, this);
          _initializerDefineProperty(this, "lblDesc", _descriptor4, this);
          this.itemId = ToolType.Magnifier;
          this.amount = 1;
        }
        onOpen(fromUI, ...args) {
          // AudioManager.instance.playEffect(AudioUrl.SHOW_ITEM_OBTAIN);
          BridgeUtil.vibrate(30, VibrationEffect.CLICK);
          let data = args[0];
          this.itemId = data.itemType;
          let str = "";
          switch (this.itemId) {
            case ToolType.Magnifier:
              str = 'propsadd 1';
              break;
            case ToolType.Undo:
              str = 'propsadd 2';
              break;
            case ToolType.Key:
              str = 'propsadd 3';
              break;
          }
          if (str != "") {
            ReportAgent.reportCustomEvent(CustomReportEvent.PAGE_SHOW, {
              info: str
            });
          }
          this.amount = GameDataManager.instance.getToolRewardNum(this.itemId);
          resLoader.load(`textures/tool/tool_${this.itemId}/spriteFrame`, (err, frame) => {
            this.sprtItem.spriteFrame = frame;
            ResUtil.assignWith(frame, this.node, true);
          });
          this.reportAdBtnEvent(false);
          this.initLayout();
        }
        onClose() {
          GameDataManager.instance.saveData(true);
        }
        initLayout() {
          // let config = GameDataManager.instance.mainConfig.tool;
          this.lblItemAount.string = `x${this.amount}`;
          switch (this.itemId) {
            case ToolType.Magnifier:
              {
                this.lblTitle.string = 'Arcane Reveal';
                this.lblDesc.string = 'Peek behind the veil! Spend a Magic Wand to uncover hidden cards.';
              }
              break;
            case ToolType.Undo:
              {
                this.lblTitle.string = 'Rewind';
                this.lblDesc.string = 'Turn back time! Use a Rewind to undo your last move.';
              }
              break;
            case ToolType.Key:
              {
                this.lblTitle.string = 'Keys';
                this.lblDesc.string = 'Spend a Key to unlock a temporary card slot.';
              }
              break;
          }
        }
        onBtnWatchAd() {
          AudioManager.instance.onBtnClicked();
          this.reportAdBtnEvent(true);
          ReportAgent.reportCustomEvent(CustomReportEvent.AD_BTN_CLICKED, {
            page: "props"
          });
          AdManager.instance.openVideoAd('ItemObtainPopup', (entry, success) => {
            success && this.onObtainToolSuccess();
          });
        }
        onObtainToolSuccess() {
          this.doGetReward(1);
          UIManager.instance.close(this);
        }
        doGetReward(times) {
          let gdMgr = GameDataManager.instance;
          switch (this.itemId) {
            case ToolType.Magnifier:
              {
                gdMgr.gameData.toolMagnifierNum += this.amount * times;
              }
              break;
            case ToolType.Undo:
              {
                gdMgr.gameData.toolUndoNum += this.amount * times;
              }
              break;
            case ToolType.Key:
              {
                gdMgr.gameData.toolKeyNum += this.amount * times;
              }
              break;
          }
        }
        onCloseBtn() {
          AudioManager.instance.onBtnClicked();
          UIManager.instance.close(this);
        }
        reportAdBtnEvent(isClick) {
          let page = '';
          switch (this.itemId) {
            case ToolType.Magnifier:
              page = 'prop_magnifying';
              break;
            case ToolType.Undo:
              page = 'prop_rewind';
              break;
            case ToolType.Key:
              page = 'prop_key';
              break;
          }
          if (page !== '') {
            if (isClick) {
              ReportAgent.reportCustomEvent(CustomReportEvent.AD_EVENT_DISTRIBUTED, {
                reward_page_click: page
              });
            } else {
              ReportAgent.reportCustomEvent(CustomReportEvent.AD_EVENT_DISTRIBUTED, {
                reward_page_show: page
              });
            }
          }
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "lblTitle", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "sprtItem", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "lblItemAount", [_dec4], {
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
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/layout-agent.ts", ['cc', './res-manager.ts', './box-control.ts', './column-control.ts', './game-desk.ts', './box-pool.ts'], function (exports) {
  var cclegacy, Node, Layout, Vec3, UITransform, instantiate, v3, ResManager, ResPrefabName, BoxControl, ColumnControl, GameDesk, BoxPool;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      Layout = module.Layout;
      Vec3 = module.Vec3;
      UITransform = module.UITransform;
      instantiate = module.instantiate;
      v3 = module.v3;
    }, function (module) {
      ResManager = module.ResManager;
      ResPrefabName = module.ResPrefabName;
    }, function (module) {
      BoxControl = module.BoxControl;
    }, function (module) {
      ColumnControl = module.ColumnControl;
    }, function (module) {
      GameDesk = module.GameDesk;
    }, function (module) {
      BoxPool = module.BoxPool;
    }],
    execute: function () {
      cclegacy._RF.push({}, "38269VdauhCCqmRIY+nOFBQ", "layout-agent", undefined);
      class LayoutAgent {
        static build(deskNode, stageData) {
          if (!deskNode) {
            console.error('deskNode not found');
            return;
          }
          if (stageData.templateId == 0) {
            this.buildNormalLayout(deskNode, stageData);
          } else {
            this.buildTemplateLayout(deskNode, stageData);
          }
        }
        static buildNormalLayout(deskNode, stageData) {
          const num = stageData.columnCount;
          if (num <= 0) {
            console.error('num is less than 0');
            return;
          }
          let rowCount1 = Math.floor(num / 2);
          if (num <= 4) {
            rowCount1 = num;
          }
          const rowCount2 = num - rowCount1;
          const container = deskNode.getChildByName('container');
          if (!container) {
            console.error('container not found');
            return;
          }
          let lineBox = new Node();
          lineBox.addComponent(Layout);
          lineBox.getComponent(Layout).type = Layout.Type.VERTICAL;
          lineBox.getComponent(Layout).verticalDirection = Layout.VerticalDirection.TOP_TO_BOTTOM;
          lineBox.getComponent(Layout).resizeMode = Layout.ResizeMode.CONTAINER;
          lineBox.getComponent(Layout).spacingY = 200;
          lineBox.parent = container;
          lineBox.position = Vec3.ZERO;
          lineBox.setScale(1.0, 1.0, 1.0);
          let line1SpacingX = 50;
          if (rowCount1 > 4 && rowCount1 <= 5) {
            line1SpacingX = 40;
          } else if (rowCount2 > 5) {
            line1SpacingX = 30;
          }
          let line2SpacingX = 50;
          if (rowCount2 > 4 && rowCount2 <= 5) {
            line2SpacingX = 40;
          } else if (rowCount2 > 5) {
            line2SpacingX = 30;
          }
          let line1 = new Node();
          line1.addComponent(Layout);
          line1.getComponent(Layout).type = Layout.Type.HORIZONTAL;
          line1.getComponent(Layout).horizontalDirection = Layout.HorizontalDirection.LEFT_TO_RIGHT;
          line1.getComponent(Layout).resizeMode = Layout.ResizeMode.CONTAINER;
          line1.getComponent(Layout).spacingX = line1SpacingX;
          lineBox.addChild(line1);
          let line2 = new Node();
          line2.addComponent(Layout);
          line2.getComponent(Layout).type = Layout.Type.HORIZONTAL;
          line2.getComponent(Layout).horizontalDirection = Layout.HorizontalDirection.LEFT_TO_RIGHT;
          line2.getComponent(Layout).resizeMode = Layout.ResizeMode.CONTAINER;
          line2.getComponent(Layout).spacingX = line2SpacingX;
          lineBox.addChild(line2);
          for (let i = 0; i < rowCount1; i++) {
            const columnData = stageData.columns[i];
            const column = this.createColumn(columnData);
            deskNode.getComponent(GameDesk).addColumn(column.getComponent(ColumnControl));
            column.getComponent(ColumnControl).columnIndex = i;
            column.parent = line1;
            line1.getComponent(UITransform).height = Math.max(line1.getComponent(UITransform).height, column.getComponent(UITransform).height);
            this.createBoxForColumn(columnData, column);
          }
          let columns_1 = line1.getComponentsInChildren(ColumnControl);
          columns_1.forEach(column => {
            column.clickExpand = rowCount1 <= 6;
          });
          for (let i = rowCount1; i < num; i++) {
            const columnData = stageData.columns[i];
            const column = this.createColumn(columnData);
            deskNode.getComponent(GameDesk).addColumn(column.getComponent(ColumnControl));
            column.getComponent(ColumnControl).columnIndex = i;
            column.parent = line2;
            line2.getComponent(UITransform).height = Math.max(line2.getComponent(UITransform).height, column.getComponent(UITransform).height);
            this.createBoxForColumn(columnData, column);
          }
          let columns_2 = line2.getComponentsInChildren(ColumnControl);
          columns_2.forEach(column => {
            column.clickExpand = rowCount2 <= 6;
          });
          line1.getComponent(Layout).updateLayout();
          line2.getComponent(Layout).updateLayout();
          lineBox.getComponent(Layout).updateLayout();
          let scale = 1.0;
          if (rowCount1 > 6) {
            scale = 0.8;
          }
          container.setScale(scale, scale, scale);
          deskNode.getChildByName('animate_canvas').setScale(scale, scale, scale);
        }
        static buildTemplateLayout(deskNode, stageData) {
          const templateId = stageData.templateId;
          if (templateId <= 0) {
            console.error('templateId is less than 0');
            return;
          }
          const template = this._templates[templateId];
          if (!template) {
            console.error('template not found');
            return;
          }
          const container = deskNode.getChildByName('container');
          if (!container) {
            console.error('container not found');
            return;
          }
          const positions = template.positions;
          const columnCount = stageData.columns.length;
          if (positions.length != columnCount) {
            console.error('positions length is not equal to columnCount');
            return;
          }
          for (let i = 0; i < columnCount; i++) {
            const columnData = stageData.columns[i];
            const column = this.createColumn(columnData);
            deskNode.getComponent(GameDesk).addColumn(column.getComponent(ColumnControl));
            column.getComponent(ColumnControl).columnIndex = i;
            column.parent = container;
            column.setPosition(positions[i]);
            this.createBoxForColumn(columnData, column);
          }
          container.setScale(template.scale, template.scale, template.scale);
          deskNode.getChildByName('animate_canvas').setScale(template.scale, template.scale, template.scale);
        }
        static createColumn(columnData) {
          const prefab = ResManager.instance.getPrefab(ResPrefabName.PREFAB_COLUMN);
          if (!prefab) {
            console.error('prefab not found');
            return;
          }
          const column = instantiate(prefab);
          column.setScale(1.0, 1.0, 1.0);
          column.position = Vec3.ZERO;
          column.getComponent(ColumnControl).updateColumnData(columnData);
          return column;
        }
        static createBoxForColumn(columnData, columnNode) {
          const boxDatas = columnData.boxDatas;
          if (boxDatas.length <= 0) {
            return;
          }
          for (let j = 0; j < boxDatas.length; j++) {
            const boxData = boxDatas[j];
            const box = BoxPool.instance.getNode();
            if (!box) {
              console.error('box not found');
              return;
            }
            box.name = "box";
            const isQuest = j < columnData.questCount;

            // 需要先add到parent，否则skeleton的加载会有问题
            columnNode.getComponent(ColumnControl).addBoxNode(j, box);
            box.getComponent(BoxControl).setBoxData(boxData, isQuest);
            box.getComponent(BoxControl).boxIndex = j;
          }
        }
      }
      exports('LayoutAgent', LayoutAgent);
      LayoutAgent._templates = {
        1: {
          scale: 1,
          positions: [v3(-260, 120), v3(-130, 300), v3(0, 120), v3(130, 300), v3(260, 120), v3(-130, -120), v3(0, -220), v3(130, -120)]
        },
        2: {
          scale: 1,
          positions: [v3(-260, 120), v3(-130, 300), v3(130, 300), v3(260, 120), v3(-130, -120), v3(0, -220), v3(130, -120)]
        },
        3: {
          scale: 1,
          positions: [v3(-260, 0), v3(-130, 0), v3(0, 0), v3(130, 170), v3(260, 170), v3(130, -170), v3(260, -170)]
        },
        4: {
          scale: 1,
          positions: [v3(-260, 260), v3(0, 260), v3(260, 260), v3(-130, 0), v3(130, 0), v3(-260, -260), v3(0, -260), v3(260, -260)]
        },
        5: {
          scale: 0.8,
          positions: [v3(-200, 260), v3(-60, 260), v3(60, 260), v3(200, 260), v3(-200, -260), v3(-60, -260), v3(60, -260), v3(200, -260)]
        },
        6: {
          scale: 1,
          positions: [v3(-260, 300), v3(0, 300), v3(260, 300), v3(-130, 120), v3(130, 120), v3(-260, -120), v3(0, -120), v3(260, -120), v3(-130, -320), v3(130, -320)]
        },
        7: {
          scale: 1,
          positions: [v3(-260, 240), v3(-130, 280), v3(0, 320), v3(130, 280), v3(260, 240), v3(-65, 0), v3(65, 0), v3(-260, -240), v3(-130, -280), v3(0, -320), v3(130, -280), v3(260, -240)]
        },
        8: {
          scale: 0.8,
          positions: [v3(-385, 0), v3(-275, 0), v3(-165, 0), v3(-55, 0), v3(55, 0), v3(165, 0), v3(275, 0), v3(385, 0)]
        },
        9: {
          scale: 0.8,
          positions: [v3(-385, 0), v3(-275, 0), v3(-165, 0), v3(-55, 0), v3(55, 0), v3(165, 0), v3(275, 0), v3(385, 0)]
        },
        10: {
          scale: 1,
          positions: [v3(-260, 120), v3(-130, 300), v3(0, 120), v3(130, 300), v3(260, 120), v3(-130, -180), v3(0, -320), v3(130, -180)]
        },
        11: {
          scale: 0.8,
          positions: [v3(-385, 0), v3(-275, 0), v3(-165, 0), v3(-55, 0), v3(55, 0), v3(165, 0), v3(275, 0), v3(385, 0)]
        },
        12: {
          scale: 1,
          positions: [v3(-130, 0), v3(0, 0), v3(130, 0), v3(-260, 170), v3(-260, -170), v3(260, 170), v3(260, -170)]
        },
        13: {
          scale: 1,
          positions: [v3(-260, 320), v3(-130, 320), v3(0, 320), v3(130, 320), v3(260, 320), v3(-260, 0), v3(-130, 0), v3(0, 0), v3(130, 0), v3(260, 0), v3(-260, -320), v3(-130, -320), v3(0, -320), v3(130, -320), v3(260, -320)]
        },
        14: {
          scale: 1,
          positions: [v3(-260, 200), v3(-130, 260), v3(0, 320), v3(130, 260), v3(260, 200), v3(-260, -140), v3(-130, -80), v3(0, -20), v3(130, -80), v3(260, -140), v3(-65, -400), v3(65, -400)]
        },
        15: {
          scale: 1,
          positions: [v3(-260, 180), v3(-130, 240), v3(0, 300), v3(130, 240), v3(260, 180), v3(-260, -180), v3(-130, -240), v3(0, -300), v3(130, -240), v3(260, -180)]
        },
        16: {
          scale: 1,
          positions: [v3(-260, 0), v3(0, 0), v3(260, 0), v3(-130, 170), v3(-130, -170), v3(130, 170), v3(130, -170)]
        },
        17: {
          scale: 1,
          positions: [v3(-260, 320), v3(-130, 320), v3(130, 320), v3(260, 320), v3(-65, 0), v3(65, 0), v3(-260, -320), v3(-130, -320), v3(130, -320), v3(260, -320)]
        },
        18: {
          scale: 1,
          positions: [v3(-195, 260), v3(-65, 260), v3(65, 260), v3(195, 260), v3(-130, -260), v3(0, -260), v3(130, -260)]
        },
        20: {
          scale: 1,
          positions: [v3(-260, 240), v3(-130, 240), v3(0, 240), v3(130, 240), v3(260, 240), v3(-260, -240), v3(-130, -240), v3(0, -240), v3(130, -240), v3(260, -240)]
        },
        21: {
          scale: 1,
          positions: [v3(-195, 320), v3(-65, 320), v3(65, 320), v3(195, 320), v3(-195, 0), v3(-65, 0), v3(65, 0), v3(195, 0), v3(-195, -320), v3(-65, -320), v3(65, -320), v3(195, -320)]
        }
      };
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/level-win-popup.ts", ['cc', './ui-view.ts', './game-data-manager.ts'], function (exports) {
  var cclegacy, _decorator, UIView, GameDataManager;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }, function (module) {
      UIView = module.UIView;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "823cc8nmwlJWK4mObAv0qmm", "level-win-popup", undefined);
      const {
        ccclass,
        property
      } = _decorator;

      // TODO: anim skin and label color config

      let LevelWinPopup = exports('LevelWinPopup', (_dec = ccclass('LevelWinPopup'), _dec(_class = class LevelWinPopup extends UIView {
        onOpen(fromUI, ...args) {
          // TODO: anim
        }
        onClose() {
          GameDataManager.instance.saveData(true);
        }
      }) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/loading-flow.ts", ['cc', './graph-manager.ts', './game-constants.ts', './game-data-manager.ts', './report-agent.ts'], function (exports) {
  var cclegacy, director, GraphManager, GameEvent, GameDataManager, LoadingTaskType, LoadingTaskReportInfo, LoadingTaskState, ReportAgent, CustomReportEvent;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      director = module.director;
    }, function (module) {
      GraphManager = module.GraphManager;
    }, function (module) {
      GameEvent = module.GameEvent;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }, function (module) {
      LoadingTaskType = module.LoadingTaskType;
      LoadingTaskReportInfo = module.LoadingTaskReportInfo;
      LoadingTaskState = module.LoadingTaskState;
      ReportAgent = module.ReportAgent;
      CustomReportEvent = module.CustomReportEvent;
    }],
    execute: function () {
      cclegacy._RF.push({}, "1a129ti3opJuq0yoDRuROlY", "loading-flow", undefined);
      let FlowState = exports('FlowState', /*#__PURE__*/function (FlowState) {
        FlowState[FlowState["Loading"] = 0] = "Loading";
        FlowState[FlowState["Pause"] = 1] = "Pause";
        return FlowState;
      }({}));
      class LoadingTask {
        constructor(info, graphType, taskType) {
          this.taskType = LoadingTaskType.SELECT_A;
          this.info = null;
          this.graphType = 0;
          this.info = info;
          this.graphType = graphType;
          this.taskType = taskType;
        }
      }
      exports('LoadingTask', LoadingTask);
      class LoadingFlow {
        constructor() {
          this._state = FlowState.Pause;
          this._currentTask = null;
          this.taskQueue = [];
        }
        set state(value) {
          this._state = value;
        }
        get state() {
          return this._state;
        }
        updateForLoading() {
          if (this._currentTask == null && this.taskQueue.length > 0) {
            this.doLoading();
          }
        }
        async load(task) {
          let idx = this.taskQueue.indexOf(task);
          if (idx >= 0) return;
          this.taskQueue.push(task);
          if (this._state === FlowState.Loading && this._currentTask == null) {
            this.doLoading(task);
          }
        }
        async doLoading(task) {
          this._currentTask = this.taskQueue.shift();
          let taskInfo = new LoadingTaskReportInfo(this._currentTask.info.id, this._currentTask.taskType, LoadingTaskState.START, Date.now(), 0, GameDataManager.instance.gameData.level);
          ReportAgent.reportCustomEvent(CustomReportEvent.LOADING_GRAPH_TASK, taskInfo);
          let url = "";
          switch (this._currentTask.graphType) {
            case 2:
              url = this._currentTask.info.url_A_t;
              break;
            case 3:
              url = this._currentTask.info.url_A_s;
              break;
            case 4:
              url = this._currentTask.info.url_B_s;
              break;
          }
          console.log(`LoadingGraph-Start:${url}`);
          let spf = await GraphManager.instance.loadGraph(url);
          if (spf && spf.isValid) {
            taskInfo.state = LoadingTaskState.SUCCESS;
          } else {
            taskInfo.state = LoadingTaskState.FAIL;
          }
          let timeStamp = taskInfo.time_stamp;
          taskInfo.time_stamp = Date.now();
          taskInfo.duration = Math.floor((taskInfo.time_stamp - timeStamp) / 1000);
          setTimeout(() => {
            ReportAgent.reportCustomEvent(CustomReportEvent.LOADING_GRAPH_TASK, taskInfo);
          }, 100);
          director.emit(GameEvent.LOAD_GRAPH_COPMPLETED, this._currentTask);
          console.log(`LoadingGraph-End:${url}`);
          this._currentTask = null;
        }
      }
      exports('LoadingFlow', LoadingFlow);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/loading-manager.ts", ['cc', './game-constants.ts', './loading-flow.ts', './game-data-manager.ts'], function (exports) {
  var cclegacy, director, GameEvent, LoadingFlow, LoadingTask, FlowState, GameDataManager;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      director = module.director;
    }, function (module) {
      GameEvent = module.GameEvent;
    }, function (module) {
      LoadingFlow = module.LoadingFlow;
      LoadingTask = module.LoadingTask;
      FlowState = module.FlowState;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }],
    execute: function () {
      cclegacy._RF.push({}, "f0302ON6r9P/o54vnNhNyZo", "loading-manager", undefined);
      class LoadingManager {
        constructor() {
          // 小图加载流
          this.flow_t = null;
          // 大图加载流
          this.flow_s = null;
        }
        static get instance() {
          if (!this._instance) {
            this._instance = new LoadingManager();
            this._instance.init();
          }
          return this._instance;
        }
        init() {
          this.flow_t = new LoadingFlow();
          this.flow_s = new LoadingFlow();
          director.on(GameEvent.LOAD_GRAPH_COPMPLETED, this.onLoadGraphCompleted, this);
          setInterval(this.update.bind(this), 100);
        }
        loadGraph(info, type, isCover, taskType) {
          let task = null;
          switch (type) {
            case 2:
              {
                // 小图
                task = new LoadingTask(info, type, taskType);
                if (this.flow_s.state != FlowState.Loading) {
                  this.flow_t.state = FlowState.Loading;
                }
                this.flow_t.load(task);
              }
              break;
            case 3:
            case 4:
              {
                // 展示大图
                task = new LoadingTask(info, type, taskType);
                this.flow_s.state = FlowState.Loading;
                this.flow_t.state = FlowState.Pause;
                this.flow_s.load(task);
              }
              break;
          }
        }
        update() {
          if (this.flow_s.state === FlowState.Loading) {
            this.flow_s.updateForLoading();
          } else if (this.flow_t.state === FlowState.Loading) {
            this.flow_t.updateForLoading();
          }
        }
        onLoadGraphCompleted(task) {
          switch (task.graphType) {
            case 2:
              {
                let info = task.info;
                let gdMgr = GameDataManager.instance;
                if (info.isAd) {
                  let unselectedSpecialPicInfoList = gdMgr.gameData.sgData.unselectedSpecialPicInfoList;
                  let idx = unselectedSpecialPicInfoList.findIndex(item => item.id == info.id);
                  if (idx == -1) {
                    unselectedSpecialPicInfoList.push(info);
                  }
                } else {
                  let unselectedNormalPicInfoList = gdMgr.gameData.sgData.unselectedNormalPicInfoList;
                  let idx = unselectedNormalPicInfoList.findIndex(item => item.id == info.id);
                  if (idx == -1) {
                    unselectedNormalPicInfoList.push(info);
                  }
                }
                let data = gdMgr.getPictureData(info.id);
                data.isCached = true;
                console.log(`LoadingGraph-:${info.id} is cached`);
                if (this.flow_t.taskQueue.length == 0) {
                  this.flow_t.state = FlowState.Pause;
                }
              }
              break;
            case 3:
            case 4:
              {
                if (this.flow_s.taskQueue.length == 0) {
                  this.flow_s.state = FlowState.Pause;
                  if (this.flow_t.taskQueue.length > 0) {
                    this.flow_t.state = FlowState.Loading;
                  }
                }
              }
              break;
          }
        }
        pauseLoading() {
          this.flow_s.state = FlowState.Pause;
          this.flow_t.state = FlowState.Pause;
        }
        resumeLoading() {
          if (this.flow_s.taskQueue.length > 0) {
            this.flow_s.state = FlowState.Loading;
          } else if (this.flow_t.taskQueue.length > 0) {
            this.flow_t.state = FlowState.Loading;
          }
        }
      }
      exports('LoadingManager', LoadingManager);
      LoadingManager._instance = null;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/loading-view.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './ui-view.ts', './ui-manager.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Label, Node, _decorator, sp, tween, UITransform, UIView, UIManager;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      Node = module.Node;
      _decorator = module._decorator;
      sp = module.sp;
      tween = module.tween;
      UITransform = module.UITransform;
    }, function (module) {
      UIView = module.UIView;
    }, function (module) {
      UIManager = module.UIManager;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;
      cclegacy._RF.push({}, "9890f7xHuNP+ITftqBI4LcL", "loading-view", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      const TIME_OUT = 10;
      let LoadingView = exports('LoadingView', (_dec = ccclass('loading'), _dec2 = property({
        type: Label
      }), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property(Node), _dec(_class = (_class2 = class LoadingView extends UIView {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "lblDesc", _descriptor, this);
          _initializerDefineProperty(this, "animNode", _descriptor2, this);
          _initializerDefineProperty(this, "layoutDot", _descriptor3, this);
          _initializerDefineProperty(this, "loadingMask", _descriptor4, this);
          this.customCloseCallback = null;
        }
        onOpen(fromUI, ...args) {
          let data = args[0];
          if (!data) {
            return;
          }
          let comp = this.animNode.getComponent(sp.Skeleton);
          comp.setSkin("default");
          comp.setAnimation(0, "loading", true);
          this.lblDesc.string = data ? data.desc : '';
          if (typeof data.displayTime === 'number') {
            this.customCloseCallback = data.onClose;
            this.scheduleOnce(() => {
              this.closeUI();
            }, data.displayTime);
          } else {
            this.scheduleOnce(() => {
              UIManager.instance.showToast(`Network Error`);
              this.closeUI();
            }, TIME_OUT);
          }
          if (data.promise instanceof Promise) {
            data.promise.then(() => {
              this.closeUI();
            }).catch(() => {
              UIManager.instance.showToast(`Network Error`);
              this.closeUI();
            });
          }
          tween(this.layoutDot).by(1.5, {
            angle: -360
          }).repeatForever().start();
          let contentSize = this.loadingMask.getComponent(UITransform);
          tween(contentSize).to(1.5, {
            height: 200
          }, {
            onUpdate: target => {
              if (target.height >= 200) {
                contentSize.height = 0;
              }
            }
          }).repeatForever().start();
        }
        onOpenAniOver() {
          // anim play
        }
        onClose() {
          // anim stop
        }
        closeUI() {
          UIManager.instance.close(this);
        }
        onEndCompleted() {
          UIManager.instance.close(this);
          this.customCloseCallback && this.customCloseCallback();
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "lblDesc", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "animNode", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "layoutDot", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "loadingMask", [_dec5], {
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

System.register("chunks:///_virtual/local-data.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './type-define.ts', './object-util.ts', './storage-data.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, WinStreakRewardData, ClassType, StorageData;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      WinStreakRewardData = module.WinStreakRewardData;
    }, function (module) {
      ClassType = module.ClassType;
    }, function (module) {
      StorageData = module.StorageData;
    }],
    execute: function () {
      var _dec, _class, _descriptor;
      cclegacy._RF.push({}, "d82305TQrBDkbusChTJXAzv", "local-data", undefined);
      let LocalData = exports('LocalData', (_dec = ClassType(WinStreakRewardData), (_class = class LocalData extends StorageData {
        constructor(...args) {
          super(...args);
          this.lastRFlag = false;
          this.lastLoginTime = 0;
          this.loginDayNum = 0;
          this.lastCheckTime = 0;
          this.isRatingCompleted = false;
          _initializerDefineProperty(this, "winStreakRewards", _descriptor, this);
          // first action record
          this.firstLogin = true;
          //Ad
          this.showVideoAdTimes = 0;
          this.interAdWeight = 0;
          //report
          this.isReEnterGameReported = false;
          //first action record
          this.isFirstLaunch = true;
          this.isFirstLoading = true;
          this.isFirstLoadingCompleted = true;
          this.isFirstPlayIntroAnim = true;
          this.isFirstClickContinueAfterIntroAnim = true;
          this.isFirstEnterGame = true;
          this.isFirstGuide = true;
          this.isFirstMoveBox = true;
          this.isFirstCompleteColumn = true;
          this.isFirstWinLevel1 = true;
          this.isFirstEnterLv2 = true;
          this.isFirstWinLevel2 = true;
          this.isFirstMoveBoxInLv2 = true;
          this.isFirstCompleteColumnInLv2 = true;
          // rating
          this.levelShowRating = 0;
          // sg
          this.pageSuccessDataList = [];
          this.selectedSgPicture = null;
          // sg-first action record
          this.isFirstSelectPicGuide = true;
          this.isPicObtainPopup = true;
          this.isFirstSelectPic = true;
          this.isFirstpecialRewardPopupOpen = true;
          this.isFirstEnterAlbumView = true;
        }
        resetWinStreakRewards() {
          this.winStreakRewards = [];
        }
      }, _descriptor = _applyDecoratedDescriptor(_class.prototype, "winStreakRewards", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _class)));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/log-util.ts", ['cc', './config.ts'], function (exports) {
  var cclegacy, Config;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      Config = module.Config;
    }],
    execute: function () {
      cclegacy._RF.push({}, "7b551HkUVNFYZJPSPwVy++f", "log-util", undefined);
      class LogUtil {
        static log(...args) {
          if (Config.DEBUG) {
            console.log('[LOG]', ...args);
          }
        }
        static warn(...args) {
          if (Config.DEBUG) {
            console.warn('[WARN]', ...args);
          }
        }
        static error(...args) {
          console.error('[ERROR]', ...args); // 错误日志始终打印
        }
      }

      exports('LogUtil', LogUtil);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/main", ['./front-line.ts', './progress-bar-ctrl.ts', './res-version-config.ts', './round-rect-mask.ts', './welcome-hf-start.ts', './ad-agent.ts', './ad-manager.ts', './bridge-event.ts', './bridge-manager.ts', './bridge-util.ts', './audio-effect-pool.ts', './audio-effect.ts', './audio-manager.ts', './audio-music.ts', './config-agent.ts', './data-agent.ts', './storage-manager.ts', './type-define.ts', './gm-manager.ts', './report-log-manager.ts', './time-agent.ts', './graph-manager.ts', './loading-flow.ts', './loading-manager.ts', './mount-manager.ts', './mount-pod.ts', './mount-point.ts', './http-agent.ts', './request-manager2.ts', './res-keeper.ts', './res-leak-checker.ts', './res-loader.ts', './res-util.ts', './bg-adapter.ts', './token-account.ts', './ui-manager.ts', './ui-screen-adapter.ts', './ui-view.ts', './action-chain.ts', './animation-util.ts', './array-util.ts', './bezier-util.ts', './common-util.ts', './log-util.ts', './object-util.ts', './random-util.ts', './string-util.ts', './svg-util.ts', './ui-util.ts', './config.ts', './ui-config.ts', './connect-agent.ts', './native-agent.ts', './sdk-agent.ts', './base-config.ts', './game-data-manager.ts', './game-data.ts', './local-data.ts', './main-config.ts', './player-data.ts', './storage-agent.ts', './storage-data.ts', './union-fetch-agent.ts', './animate-canvas.ts', './box-control.ts', './box-data.ts', './box-pool.ts', './column-control.ts', './column-data.ts', './game-constants.ts', './game-desk.ts', './guide-agent.ts', './layout-agent.ts', './move-agent.ts', './move-step.ts', './res-manager.ts', './skin-manager.ts', './stage-build-agent.ts', './stage-config-convertor.ts', './stage-constants.ts', './stage-data.ts', './stage-logic.ts', './http-agent2.ts', './request-manager.ts', './report-agent.ts', './map.ts', './stage-helper.ts', './stage.ts', './welcome.ts', './btn-tips-control.ts', './loading-view.ts', './prevent-touch-control.ts', './report-log-view.ts', './toast.ts', './report-log-item.ts', './streak-anim-star.ts', './streak-star.ts', './toggle-btn.ts', './tool-btn.ts', './win-streak-bar.ts', './win-streak-reward-item.ts', './gm-view.ts', './guide-tips.ts', './item-obtain-popup.ts', './level-win-popup.ts', './main-view.ts', './menu-popup.ts', './move-end-popup.ts', './policy-popup.ts', './rating-popup.ts', './win-streak-gift-popup.ts', './win-streak-reward-view.ts'], function () {
  return {
    setters: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    execute: function () {}
  };
});

System.register("chunks:///_virtual/main-config.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './type-define.ts', './object-util.ts', './storage-data.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, InterAdPageInfo, InterAdPageId, WinStreakRewardInfo, ToolType, SgConfig, ArrayType, ClassType, StorageData;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      InterAdPageInfo = module.InterAdPageInfo;
      InterAdPageId = module.InterAdPageId;
      WinStreakRewardInfo = module.WinStreakRewardInfo;
      ToolType = module.ToolType;
      SgConfig = module.SgConfig;
    }, function (module) {
      ArrayType = module.ArrayType;
      ClassType = module.ClassType;
    }, function (module) {
      StorageData = module.StorageData;
    }],
    execute: function () {
      var _dec, _class, _descriptor, _dec2, _dec3, _dec4, _dec5, _dec6, _class4, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6;
      cclegacy._RF.push({}, "c9056HwgIROQITOflTC+dAO", "main-config", undefined);
      let InterAdConfig = exports('InterAdConfig', (_dec = ArrayType(InterAdPageInfo), (_class = class InterAdConfig {
        constructor() {
          this.weight_max = [500, 500, 400, 300, 200];
          this.free_times = [5, 3, 2, 1];
          this.interval = 60;
          _initializerDefineProperty(this, "pages", _descriptor, this);
        }
      }, _descriptor = _applyDecoratedDescriptor(_class.prototype, "pages", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [new InterAdPageInfo(InterAdPageId.LevelWin, true, 100), new InterAdPageInfo(InterAdPageId.LevelStart, true, 100)];
        }
      }), _class)));
      class GmConfig {
        constructor() {
          this.is_gm = false;
          this.signal = 549527;
        }
      }
      exports('GmConfig', GmConfig);
      let MainConfig = exports('MainConfig', (_dec2 = ClassType(GmConfig), _dec3 = ArrayType(Array), _dec4 = ArrayType(Array), _dec5 = ClassType(InterAdConfig), _dec6 = ClassType(SgConfig), (_class4 = class MainConfig extends StorageData {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "gm_config", _descriptor2, this);
          this.rating_config = [10, 25, 35];
          this.free_versions = ["1.0.0"];
          this.props_num = [3, 1, 2];
          // mag，undo，key
          this.guide_streak_num = [999];
          this.winning_streak_upgrade = [24, 48, 72, 96, 120];
          this.level_achieved_targets = [3, 5, 8, 10, 13, 15, 18, 20, 25, 30, 35, 40, 45, 50];
          _initializerDefineProperty(this, "winning_streak_award", _descriptor3, this);
          _initializerDefineProperty(this, "winning_streak_endless_award", _descriptor4, this);
          _initializerDefineProperty(this, "inter_ad", _descriptor5, this);
          this.game_over_reaction_time = 8;
          // sg
          _initializerDefineProperty(this, "sg", _descriptor6, this);
        }
      }, (_descriptor2 = _applyDecoratedDescriptor(_class4.prototype, "gm_config", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new GmConfig();
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class4.prototype, "winning_streak_award", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [[new WinStreakRewardInfo(8, ToolType.Magnifier, 1), new WinStreakRewardInfo(16, ToolType.Undo, 1), new WinStreakRewardInfo(24, ToolType.Key, 1)], [new WinStreakRewardInfo(32, ToolType.Magnifier, 2), new WinStreakRewardInfo(40, ToolType.Undo, 2), new WinStreakRewardInfo(48, ToolType.Key, 2)], [new WinStreakRewardInfo(56, ToolType.Magnifier, 3), new WinStreakRewardInfo(64, ToolType.Undo, 3), new WinStreakRewardInfo(72, ToolType.Key, 3)], [new WinStreakRewardInfo(80, ToolType.Magnifier, 4), new WinStreakRewardInfo(88, ToolType.Undo, 4), new WinStreakRewardInfo(96, ToolType.Key, 4)], [new WinStreakRewardInfo(104, ToolType.Magnifier, 5), new WinStreakRewardInfo(112, ToolType.Undo, 5), new WinStreakRewardInfo(120, ToolType.Key, 5)]];
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class4.prototype, "winning_streak_endless_award", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [[new WinStreakRewardInfo(999, ToolType.Magnifier, 6), new WinStreakRewardInfo(999, ToolType.Undo, 6), new WinStreakRewardInfo(999, ToolType.Key, 6)]];
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class4.prototype, "inter_ad", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new InterAdConfig();
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class4.prototype, "sg", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new SgConfig();
        }
      })), _class4)));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/main-view.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './ui-view.ts', './game-desk.ts', './ui-manager.ts', './ui-config.ts', './game-constants.ts', './game-data-manager.ts', './tool-btn.ts', './type-define.ts', './gm-manager.ts', './audio-manager.ts', './report-agent.ts', './config.ts', './bridge-util.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, Label, _decorator, director, Animation, UIView, GameDesk, UIManager, UIID, GameEvent, AudioUrl, GameState, GameDataManager, ToolBtn, ToolType, GmManager, AudioManager, ReportAgent, CustomReportEvent, Config, BridgeUtil, VibrationEffect;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      Label = module.Label;
      _decorator = module._decorator;
      director = module.director;
      Animation = module.Animation;
    }, function (module) {
      UIView = module.UIView;
    }, function (module) {
      GameDesk = module.GameDesk;
    }, function (module) {
      UIManager = module.UIManager;
    }, function (module) {
      UIID = module.UIID;
    }, function (module) {
      GameEvent = module.GameEvent;
      AudioUrl = module.AudioUrl;
      GameState = module.GameState;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }, function (module) {
      ToolBtn = module.ToolBtn;
    }, function (module) {
      ToolType = module.ToolType;
    }, function (module) {
      GmManager = module.GmManager;
    }, function (module) {
      AudioManager = module.AudioManager;
    }, function (module) {
      ReportAgent = module.ReportAgent;
      CustomReportEvent = module.CustomReportEvent;
    }, function (module) {
      Config = module.Config;
    }, function (module) {
      BridgeUtil = module.BridgeUtil;
      VibrationEffect = module.VibrationEffect;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6;
      cclegacy._RF.push({}, "8a723ZfCdVB95ZL8//1ZZaH", "main-view", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let MainView = exports('MainView', (_dec = ccclass('MainView'), _dec2 = property(ToolBtn), _dec3 = property(ToolBtn), _dec4 = property(ToolBtn), _dec5 = property(Node), _dec6 = property(Node), _dec7 = property(Label), _dec(_class = (_class2 = class MainView extends UIView {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "btnUndo", _descriptor, this);
          _initializerDefineProperty(this, "btnMagnifier", _descriptor2, this);
          _initializerDefineProperty(this, "btnKey", _descriptor3, this);
          _initializerDefineProperty(this, "skipBtn", _descriptor4, this);
          _initializerDefineProperty(this, "reportLogBtn", _descriptor5, this);
          _initializerDefineProperty(this, "lblLv", _descriptor6, this);
          this.gameDesk = null;
          this.isUsingKey = false;
        }
        onOpen(fromUI, ...args) {
          let node = director.getScene().getChildByPath(`Canvas/game_desk`);
          node && (this.gameDesk = node.getComponent(GameDesk));
          this.addEventListeners();
          this.updateDisplay();
          this.btnKey.node.active = false;
          this.btnUndo.node.active = false;
          this.btnMagnifier.node.active = false;
          director.emit(GameEvent.GAME_START);
        }
        onTop(preID, ...args) {
          this.updateDisplay();
          switch (preID) {
            case UIID.LevelWinPopup:
              {
                let selectedPic = GameDataManager.instance.localData.selectedSgPicture;
                UIManager.instance.open(UIID.PictureObtainPopup, {
                  albumId: null,
                  picInfo: selectedPic,
                  showCloseBtn: true,
                  isCloseDirectly: false
                });
              }
              break;
            case UIID.SlidePictureView:
              {
                GameDataManager.instance.gameData.level += 1;
                director.emit(GameEvent.GAME_START);
              }
              break;
          }
        }
        onClose() {
          this.removeEventListeners();
        }
        addEventListeners() {
          director.on(GameEvent.GAME_WIN, this.onGameWin, this);
          director.on(GameEvent.BUILD_STAGE_END, this.onBuildStageEnd, this);
          director.on(GameEvent.CLICK_UNLOCK, this.operateUnlock, this);
          director.on(GameEvent.USE_TOOL_KEY, this.operateUnlock, this);
        }
        removeEventListeners() {
          director.off(GameEvent.GAME_WIN, this.onGameWin, this);
          director.off(GameEvent.BUILD_STAGE_END, this.onBuildStageEnd, this);
          director.off(GameEvent.CLICK_UNLOCK, this.operateUnlock, this);
          director.off(GameEvent.USE_TOOL_KEY, this.operateUnlock, this);
        }
        updateDisplay() {
          if (Config.DEBUG) {
            if (GmManager.instance.gmLevel > 0) {
              GameDataManager.instance.gameData.level = GmManager.instance.gmLevel;
              GmManager.instance.gmLevel = 0;
              director.emit(GameEvent.GAME_START);
            }
            if (GmManager.instance.gmStreak > 0) {
              GameDataManager.instance.gameData.winStreakNum = GmManager.instance.gmStreak;
              GmManager.instance.gmStreak = 0;
            }
            GmManager.instance.saveData();
          }
          let gdMgr = GameDataManager.instance;
          let undoNum = gdMgr.getToolNum(ToolType.Undo);
          this.btnUndo.setNum(undoNum);
          let magnifierNum = gdMgr.getToolNum(ToolType.Magnifier);
          this.btnMagnifier.setNum(magnifierNum);
          let keyNum = GameDataManager.instance.getToolNum(ToolType.Key);
          this.btnKey.setNum(keyNum);

          // win streak bar
          let curStreak = gdMgr.gameData.winStreakNum;
          this.skipBtn.active = GmManager.instance.isSkipLv;
          this.reportLogBtn.active = GmManager.instance.showReportLog;
          this.lblLv.string = `${gdMgr.gameData.level}`;

          // stage type
        }

        // callback abandon
        onBtnReplayClicked() {
          AudioManager.instance.onBtnClicked();
          let gdMgr = GameDataManager.instance;
          ReportAgent.reportCustomEvent(CustomReportEvent.KEY_ACTION, {
            info: "restart"
          });
          ReportAgent.reportCustomEvent(CustomReportEvent.GAME_END, {
            mode: `${GameDataManager.instance.gameData.level}`
          });
          if (gdMgr.gameData.freeReplayTimes > 0 || gdMgr.gameData.winStreakNum === 0) {
            if (gdMgr.gameData.freeReplayTimes > 0) {
              gdMgr.gameData.freeReplayTimes--;
            }
            ReportAgent.reportCustomEvent(CustomReportEvent.LEVEL_UPGRADE, {
              compsteps: '3',
              extranum: GameDataManager.instance.gameData.level,
              comptime: 0,
              Compnum: 0
            });
            this.gameDesk.restartCurrentStage();
          }
        }
        onBtnSettingClicked() {
          AudioManager.instance.onBtnClicked();
          UIManager.instance.open(UIID.MenuPopup_2);
        }
        onToolUndoClicked(event) {
          AudioManager.instance.onBtnClicked();
          ReportAgent.reportCustomEvent(CustomReportEvent.KEY_ACTION, {
            info: "prop 2"
          });
          if (!this.btnUndo.enable) return;
          const target = event.target;
          const animation = target.getComponent(Animation);
          animation.play();
          let gdMgr = GameDataManager.instance;
          let toolNum = gdMgr.getToolNum(ToolType.Undo);
          if (toolNum > 0) {
            AudioManager.instance.playEffect(AudioUrl.TOOL_UNDO);
            BridgeUtil.vibrate(30, VibrationEffect.CLICK);
            this.gameDesk.actionBackMove().then(isSuccess => {
              if (isSuccess) {
                gdMgr.addToolNum(ToolType.Undo, -1);
                this.btnUndo.setNum(toolNum - 1);
                console.log('onToolBackClicked success');
              } else {
                UIManager.instance.showToast("No steps to go back.");
              }
            });
          } else {
            UIManager.instance.open(UIID.ItemObtainPopup, {
              itemType: ToolType.Undo
            });
          }
        }
        onToolMagClicked(event) {
          AudioManager.instance.onBtnClicked();
          ReportAgent.reportCustomEvent(CustomReportEvent.KEY_ACTION, {
            info: "prop 1"
          });
          if (!this.btnMagnifier.enable) return;
          const target = event.target;
          const animation = target.getComponent(Animation);
          animation.play();
          let gdMgr = GameDataManager.instance;
          let toolNum = GameDataManager.instance.getToolNum(ToolType.Magnifier);
          if (toolNum > 0) {
            AudioManager.instance.playEffect(AudioUrl.TOOL_MAGNIFIER);
            BridgeUtil.vibrate(30, VibrationEffect.CLICK);
            gdMgr.addToolNum(ToolType.Magnifier, -1);
            this.btnMagnifier.setNum(toolNum - 1);
            this.gameDesk.actionPublishQuest();
          } else {
            UIManager.instance.open(UIID.ItemObtainPopup, {
              itemType: ToolType.Magnifier
            });
          }
        }
        onToolKeyClicked(event) {
          AudioManager.instance.onBtnClicked();
          ReportAgent.reportCustomEvent(CustomReportEvent.KEY_ACTION, {
            info: "prop 3"
          });
          if (!this.btnKey.enable || this.isUsingKey) return;
          console.log('onToolKeyClicked');
          const target = event.target;
          const animation = target.getComponent(Animation);
          animation.play();
          this.operateUnlock();
        }
        operateUnlock() {
          let gdMgr = GameDataManager.instance;
          let toolNum = gdMgr.getToolNum(ToolType.Key);
          if (toolNum > 0) {
            AudioManager.instance.playEffect(AudioUrl.TOOL_KEY);
            BridgeUtil.vibrate(30, VibrationEffect.CLICK);
            this.isUsingKey = true;
            this.gameDesk.unLockColumn().then(isSuccess => {
              if (isSuccess) {
                gdMgr.addToolNum(ToolType.Key, -1);
                this.btnKey.setNum(toolNum - 1);
              } else {
                UIManager.instance.showToast('No slots to unlock.');
                console.log('onToolKeyClicked failed');
              }
              this.isUsingKey = false;
            });
          } else {
            UIManager.instance.open(UIID.ItemObtainPopup, {
              itemType: ToolType.Key
            });
          }
        }
        onScoreBarClicked() {
          AudioManager.instance.onBtnClicked();
          ReportAgent.reportCustomEvent(CustomReportEvent.KEY_ACTION, {
            info: "winning streak"
          });
          UIManager.instance.open(UIID.WinStreakRewardView);
        }
        onGameWin() {
          let gdMgr = GameDataManager.instance;
          if (gdMgr.localData.isFirstWinLevel1) {
            gdMgr.localData.isFirstWinLevel1 = false;
            ReportAgent.reportCustomEvent(CustomReportEvent.USER_LIFECYCLE_MILESTONE, {
              action: 'game_level_win'
            });
          } else if (gdMgr.localData.isFirstWinLevel2) {
            gdMgr.localData.isFirstWinLevel2 = false;
            ReportAgent.reportCustomEvent(CustomReportEvent.USER_LIFECYCLE_MILESTONE, {
              action: 'level_two_win'
            });
          }
          ReportAgent.reportCustomEvent(CustomReportEvent.LEVEL_UPGRADE, {
            compsteps: '2',
            extranum: gdMgr.gameData.level,
            comptime: 0,
            Compnum: 0
          });
          UIManager.instance.hideGuide();
          UIManager.instance.open(UIID.LevelWinPopup, {
            state: GameState.WIN
          });
          ReportAgent.reportCustomEvent(CustomReportEvent.GAME_END, {
            mode: `${GameDataManager.instance.gameData.level}`
          });
        }
        onBuildStageEnd(quest) {
          let lv = GameDataManager.instance.gameData.level;
          if (lv < 3) {
            this.btnKey.node.active = false;
            this.btnUndo.node.active = false;
            this.btnMagnifier.node.active = false;
          } else {
            this.btnKey.node.active = true;
            this.btnUndo.node.active = true;
            this.btnMagnifier.node.active = quest > 0 && lv > 2;
          }
        }
        onSkipBtnClicked() {
          this.onGameWin();
        }
        onReportLogBtnClicked() {
          UIManager.instance.open(UIID.ReportLogView);
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "btnUndo", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "btnMagnifier", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "btnKey", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "skipBtn", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "reportLogBtn", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "lblLv", [_dec7], {
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

System.register("chunks:///_virtual/map.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './ui-manager.ts', './ui-config.ts', './game-data-manager.ts', './game-constants.ts', './audio-manager.ts', './mount-manager.ts', './mount-point.ts', './graph-manager.ts', './config.ts', './bg-adapter.ts', './type-define.ts', './ui-util.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Sprite, ParticleSystem2D, _decorator, Component, director, Node, sys, Vec3, UIManager, UICF, UIID, GameDataManager, AudioUrl, AudioManager, MountManager, MountPoint, GraphManager, ConfigEvent, Config, BgAdapter, SgState, UIUtil;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Sprite = module.Sprite;
      ParticleSystem2D = module.ParticleSystem2D;
      _decorator = module._decorator;
      Component = module.Component;
      director = module.director;
      Node = module.Node;
      sys = module.sys;
      Vec3 = module.Vec3;
    }, function (module) {
      UIManager = module.UIManager;
    }, function (module) {
      UICF = module.UICF;
      UIID = module.UIID;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }, function (module) {
      AudioUrl = module.AudioUrl;
    }, function (module) {
      AudioManager = module.AudioManager;
    }, function (module) {
      MountManager = module.MountManager;
    }, function (module) {
      MountPoint = module.MountPoint;
    }, function (module) {
      GraphManager = module.GraphManager;
    }, function (module) {
      ConfigEvent = module.ConfigEvent;
      Config = module.Config;
    }, function (module) {
      BgAdapter = module.BgAdapter;
    }, function (module) {
      SgState = module.SgState;
    }, function (module) {
      UIUtil = module.UIUtil;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2;
      cclegacy._RF.push({}, "bad8cruugNKaZRRCxLapQHa", "map", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let Map = exports('Map', (_dec = ccclass('Map'), _dec2 = property(Sprite), _dec3 = property(ParticleSystem2D), _dec(_class = (_class2 = class Map extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "sprBg", _descriptor, this);
          _initializerDefineProperty(this, "ptclClick", _descriptor2, this);
        }
        onEnable() {
          // director.on(GameEvent.CHANGE_MAP_BG, this.updateBg, this);
          director.on(ConfigEvent.FLAG_CHANGED, this.onFlagChanged, this);
          this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this, true);
        }
        onDisable() {
          // director.off(GameEvent.CHANGE_MAP_BG, this.updateBg, this);
          director.off(ConfigEvent.FLAG_CHANGED, this.onFlagChanged, this);
          this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this, true);
        }
        onLoad() {
          MountManager.instance.notify(MountPoint.StageInitUIConf, UICF);
          UIManager.instance.initUIConf(UICF);
          UIManager.instance.updateLayers();
          let constNode = director.getScene().getChildByName('Const');
          if (!constNode) {
            constNode = new Node();
            constNode.name = 'Const';
            director.getScene().addChild(constNode);
          }
          director.addPersistRootNode(constNode);
          MountManager.instance.notify(MountPoint.NotifyWebContReady, {
            node: constNode
          });
          this.updateBg();
        }
        start() {
          if (!AudioManager.instance.switchMusic) {
            this.scheduleOnce(() => {
              AudioManager.instance.stopMusic();
            }, 0.5);
          } else {
            AudioManager.instance.playMusicLoop(AudioUrl.BGM);
          }
          MountManager.instance.notify(MountPoint.StageInitUIConf, UICF);
          UIManager.instance.initUIConf(UICF);
          // this.schedule(() => {
          //     UIManager.instance.showDebugInfoToast();
          // }, 5)

          if (sys.isBrowser) {
            Config.setRFlag(true);
          }
          // let sgData = gdMgr.gameData.sgData;
          // let sgState = sgData.state;
          // if (sgState === SgState.Started) {
          //     if (sgData.isPlayPlots || sgData.isPlayPlots) {
          //         UIManager.instance.open(UIID.StartViewSg);
          //     } else {
          //         UIManager.instance.open(UIID.PlotView);
          //     }
          // }

          // this.onFlagChanged();
          UIManager.instance.open(UIID.StartViewSg);
        }
        onDestroy() {
          this.unscheduleAllCallbacks();
        }
        onTouchEnd(event) {
          if (!this.ptclClick) return;
          let sPos = event.getLocation();
          let lPos = UIUtil.convertScreenPosToLocal(new Vec3(sPos.x, sPos.y, 0), this.ptclClick.node.parent, this.node);
          this.ptclClick.resetSystem();
          this.ptclClick.node.setPosition(lPos);
          this.ptclClick.node.active = true;
        }
        async updateBg() {
          if (GameDataManager.instance.gameData.sgData.state === SgState.Started) {
            // 根据逻辑选择bg
            let bgInfo = GameDataManager.instance.getRandomBgInfo();
            if (!bgInfo) {
              let adapter = this.sprBg.getComponent(BgAdapter);
              adapter && adapter.updateSize();
              return;
            }
            let data = GameDataManager.instance.getPictureData(bgInfo.id);
            let url = data.isLocked ? bgInfo.url_A_s : bgInfo.url_B_s;
            let bgSpf = await GraphManager.instance.loadGraph(url);
            if (bgSpf && bgSpf.isValid) {
              this.sprBg.spriteFrame = bgSpf;
              let adapter = this.sprBg.getComponent(BgAdapter);
              adapter && adapter.updateSize();
            }
          }
        }
        async onFlagChanged() {
          if (GameDataManager.instance.gameData.sgData.state === SgState.Unready) {
            MountManager.instance.notify(MountPoint.NativeCheckLocalCache, null);
            console.log('Map-loadSg--start');
            let gdMgr = GameDataManager.instance;
            let cacheSize = 8;
            let needNum_n = cacheSize - gdMgr.gameData.sgData.unselectedNormalPicInfoList.length;
            needNum_n = Math.min(needNum_n, 4);
            let count_n = 0;
            let list = [];
            if (needNum_n > 0) {
              let list_n = gdMgr.getUncachedPictureList(needNum_n, false);
              if (list_n.length < needNum_n) {
                let promiseFetch = MountManager.instance.notify(MountPoint.RemoteFetchIllustration, {
                  total: 10,
                  adCount: 0
                })[0];
                if (promiseFetch instanceof Promise) {
                  await promiseFetch;
                }
                list_n = gdMgr.getUncachedPictureList(needNum_n, false);
              }
              list = list.concat(list_n);
              if (Config.DEBUG) {
                count_n = list.length;
                UIManager.instance.showToast(`Map-LoadSg:n-${count_n}`);
              }
            }
            let needNum_s = cacheSize - gdMgr.gameData.sgData.unselectedSpecialPicInfoList.length - needNum_n;
            needNum_s = Math.min(needNum_s, 4);
            let count_s = 0;
            if (needNum_s > 0) {
              let list_s = gdMgr.getUncachedPictureList(needNum_s, true);
              if (list_s.length < needNum_s) {
                let promiseFetch = MountManager.instance.notify(MountPoint.RemoteFetchIllustration, {
                  total: 10,
                  adCount: 0
                })[0];
                if (promiseFetch instanceof Promise) {
                  await promiseFetch;
                }
                list_s = gdMgr.getUncachedPictureList(needNum_s, true);
              }
              list = list.concat(list_s);
              if (Config.DEBUG) {
                count_s = list.length;
                UIManager.instance.showToast(`Map-LoadSg:s-${count_s}`);
              }
            }
            let promisePreload = MountManager.instance.notify(MountPoint.NativeNotifyLoadPicture, {
              infoList: list,
              type: 2,
              taskId: `welcome-pics`
            })[0];
            await promisePreload;
          }
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "sprBg", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "ptclClick", [_dec3], {
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

System.register("chunks:///_virtual/menu-popup.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './ui-view.ts', './game-data-manager.ts', './audio-manager.ts', './ui-manager.ts', './ui-config.ts', './game-constants.ts', './bridge-util.ts', './config.ts', './time-agent.ts', './toggle-btn.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Label, _decorator, director, UIView, GameDataManager, AudioManager, UIManager, UIID, AudioUrl, GameEvent, ParamStage, BridgeUtil, VibrationEffect, Config, TimeAgent, ToggleBtn;
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
      UIView = module.UIView;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }, function (module) {
      AudioManager = module.AudioManager;
    }, function (module) {
      UIManager = module.UIManager;
    }, function (module) {
      UIID = module.UIID;
    }, function (module) {
      AudioUrl = module.AudioUrl;
      GameEvent = module.GameEvent;
      ParamStage = module.ParamStage;
    }, function (module) {
      BridgeUtil = module.BridgeUtil;
      VibrationEffect = module.VibrationEffect;
    }, function (module) {
      Config = module.Config;
    }, function (module) {
      TimeAgent = module.TimeAgent;
    }, function (module) {
      ToggleBtn = module.ToggleBtn;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;
      cclegacy._RF.push({}, "7391cOOuMlC1Lf/AchlVNp5", "menu-popup", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let MenuPopup = exports('MenuPopup', (_dec = ccclass('MenuPopup'), _dec2 = property(ToggleBtn), _dec3 = property(ToggleBtn), _dec4 = property(ToggleBtn), _dec5 = property(Label), _dec(_class = (_class2 = class MenuPopup extends UIView {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "btnMusic", _descriptor, this);
          _initializerDefineProperty(this, "btnEffect", _descriptor2, this);
          _initializerDefineProperty(this, "btnVibration", _descriptor3, this);
          _initializerDefineProperty(this, "labelVersion", _descriptor4, this);
          this.clickTimes = 0;
        }
        onOpen(fromUI, ...args) {
          BridgeUtil.vibrate(30, VibrationEffect.CLICK);
          this.btnMusic.isOn = AudioManager.instance.switchMusic;
          this.btnEffect.isOn = AudioManager.instance.switchEffect;
          this.btnVibration.isOn = AudioManager.instance.switchVibration;
          this.labelVersion && (this.labelVersion.string = `V${Config.GAME_VERSION}`);
        }
        onClose() {
          GameDataManager.instance.saveData();
        }
        onMusicBtn() {
          AudioManager.instance.onBtnClicked();
          let audioMgr = AudioManager.instance;
          this.btnMusic.isOn = !this.btnMusic.isOn;
          audioMgr.switchMusic = this.btnMusic.isOn;
          if (audioMgr.switchMusic) {
            audioMgr.playMusicLoop(AudioUrl.BGM);
          } else {
            audioMgr.stopMusic();
          }
        }
        onSoundEffectBtn() {
          AudioManager.instance.onBtnClicked();
          let audioMgr = AudioManager.instance;
          this.btnEffect.isOn = !this.btnEffect.isOn;
          audioMgr.switchEffect = this.btnEffect.isOn;
        }
        onVibrationBtn() {
          AudioManager.instance.onBtnClicked();
          let audioMgr = AudioManager.instance;
          this.btnVibration.isOn = !this.btnVibration.isOn;
          audioMgr.switchVibration = this.btnVibration.isOn;
        }
        onContactBtn() {
          AudioManager.instance.onBtnClicked();
          let now = new Date(TimeAgent.instance.getTime());
          let date = now.toLocaleDateString();
          let title = `【Feedback】Face Sort: Mood (${date})`;
          let content = "=================================================================" + "\n";
          content += "Thank you for contacting us! We would appreciate it if you could share more details regarding your issue or inquiry below." + "\n";
          content += `App Version: [V${Config.GAME_VERSION}]-${GameDataManager.instance.getInviteCode()}\n`;
          content += "=================================================================" + "\n";
          BridgeUtil.sendMail(Config.MAIL, title, content);
        }
        onPolicyBtn() {
          AudioManager.instance.onBtnClicked();
          UIManager.instance.open(UIID.PolicyPopup);
        }
        onCloseBtn() {
          AudioManager.instance.onBtnClicked();
          UIManager.instance.close(this);
        }
        onGmBtn() {
          let config = GameDataManager.instance.mainConfig;
          if (!config) {
            console.log('onGmBtn-config is null');
            return;
          }
          this.clickTimes++;
          if (this.clickTimes >= 5) {
            this.clickTimes = 0;
            UIManager.instance.open(UIID.GmView);
          }
          this.unschedule(this.cleanClickTimes.bind(this));
          this.scheduleOnce(this.cleanClickTimes.bind(this), 1);
        }
        cleanClickTimes() {
          this.clickTimes = 0;
        }
        onRestartBtn() {
          AudioManager.instance.onBtnClicked();
          UIManager.instance.close(this);
          director.emit(GameEvent.STAGE, ParamStage.FAIL, false);
        }
        onHomeBtn() {
          AudioManager.instance.onBtnClicked();
          UIManager.instance.closeAll();
          director.loadScene('map');
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "btnMusic", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "btnEffect", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "btnVibration", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "labelVersion", [_dec5], {
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

System.register("chunks:///_virtual/mount-manager.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "4f3b3gknPlLUIOedWXAXkAm", "mount-manager", undefined);
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
      cclegacy._RF.push({}, "d1a7c8SqbpJi6YzT+zsvK2x", "mount-pod", undefined);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/mount-point.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "2d68amfU1hJTqOJBezLVYSM", "mount-point", undefined);
      let MountPoint = exports('MountPoint', /*#__PURE__*/function (MountPoint) {
        MountPoint["RemoteWebConfigUpdated"] = "RemoteWebConfigUpdated";
        MountPoint["RemoteStoreConfigUpdated"] = "RemoteStoreConfigUpdated";
        MountPoint["RemoteStoreDataUpdated"] = "RemoteStoreDataUpdated";
        MountPoint["NativeNotifyPageRc"] = "NativeNotifyPageRc";
        MountPoint["NotifyWebContReady"] = "NotifyWebContReady";
        MountPoint["NativeNotifyCurrency"] = "NativeNotifyCurrency";
        MountPoint["NativeNotifyIsRedeem"] = "NativeNotifyIsRedeem";
        MountPoint["NativeNotifyRedeemAount"] = "NativeNotifyRedeemAount";
        MountPoint["NativeNotifyProgressChange"] = "NativeNotifyProgressChange";
        MountPoint["NativeNotifyResetData"] = "NativeNotifyResetData";
        MountPoint["RemoteFetchIllustration"] = "NativeFetchIllustration";
        MountPoint["NativeCheckLocalCache"] = "NativeCheckLocalCache";
        MountPoint["NativeNotifyGetIllustration"] = "NativeNotifyGetIllustration";
        MountPoint["NativeNotifyLoadPicture"] = "NativeNotifyLoadPicture";
        MountPoint["NativeNotifyGetPreloadTaskState"] = "NativeNotifyGetPreloadTaskState";
        MountPoint["NativeNotifyGetShowPageFrame"] = "NativeNotifyGetShowPageFrame";
        MountPoint["HasStore"] = "HasStore";
        MountPoint["StageInitUIConf"] = "StageInitUIConf";
        MountPoint["RFlagChanged"] = "RFlagChanged";
        MountPoint["GetMoreGameUrl"] = "GetMoreGameUrl";
        return MountPoint;
      }({}));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/move-agent.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "f1d5140ksZCS4ipNMDGYNEI", "move-agent", undefined);
      class MoveAgent {}
      exports('MoveAgent', MoveAgent);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/move-end-popup.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './ui-view.ts', './ui-manager.ts', './ad-manager.ts', './game-data-manager.ts', './type-define.ts', './game-constants.ts', './audio-manager.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, _decorator, director, UIView, UIManager, AdManager, GameDataManager, ToolType, GameEvent, AudioManager;
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
      UIView = module.UIView;
    }, function (module) {
      UIManager = module.UIManager;
    }, function (module) {
      AdManager = module.AdManager;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }, function (module) {
      ToolType = module.ToolType;
    }, function (module) {
      GameEvent = module.GameEvent;
    }, function (module) {
      AudioManager = module.AudioManager;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2;
      cclegacy._RF.push({}, "1338fRY6pxMA7dnafTQx1Es", "move-end-popup", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let MoveEndPopup = exports('MoveEndPopup', (_dec = ccclass('MoveEndPopup'), _dec2 = property(Node), _dec3 = property(Node), _dec(_class = (_class2 = class MoveEndPopup extends UIView {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "adBtn", _descriptor, this);
          _initializerDefineProperty(this, "useBtn", _descriptor2, this);
        }
        onOpen(fromUI, ...args) {
          if (GameDataManager.instance.getToolNum(ToolType.Key) > 0) {
            this.useBtn.active = true;
            this.adBtn.active = false;
          } else {
            this.adBtn.active = true;
            this.useBtn.active = false;
          }
        }
        onAdBtn() {
          AdManager.instance.openVideoAd('ItemObtainPopup', (entry, success) => {
            success && this.onObtainToolSuccess();
          });
        }
        onRestartBtn() {
          // TODO: restart
          AudioManager.instance.onBtnClicked();
          UIManager.instance.close(this);
        }
        onCloseBtn() {
          AudioManager.instance.onBtnClicked();
          UIManager.instance.close(this);
        }
        onObtainToolSuccess() {
          AudioManager.instance.onBtnClicked();
          let gdMgr = GameDataManager.instance;
          let amount = gdMgr.getToolRewardNum(ToolType.Key);
          gdMgr.addToolNum(ToolType.Key, amount);
          // use tool
          director.emit(GameEvent.USE_TOOL_KEY);
          UIManager.instance.close(this);
        }
        onUseKeyBtn() {
          AudioManager.instance.onBtnClicked();
          director.emit(GameEvent.USE_TOOL_KEY);
          UIManager.instance.close(this);
        }
        onClose() {
          GameDataManager.instance.saveData(true);
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "adBtn", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "useBtn", [_dec3], {
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

System.register("chunks:///_virtual/move-step.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "11137PegflP1oG3FEkCMEXC", "move-step", undefined);
      class MoveStep {
        constructor(fromColumnIndex, toColumnIndex, boxCount) {
          this._fromColumnIndex = 0;
          this._toColumnIndex = 0;
          this._boxCount = 0;
          this._fromColumnIndex = fromColumnIndex;
          this._toColumnIndex = toColumnIndex;
          this._boxCount = boxCount;
        }
        get fromColumnIndex() {
          return this._fromColumnIndex;
        }
        get toColumnIndex() {
          return this._toColumnIndex;
        }
        get boxCount() {
          return this._boxCount;
        }
      }
      exports('MoveStep', MoveStep);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/native-agent.ts", ['cc'], function (exports) {
  var cclegacy, native;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      native = module.native;
    }],
    execute: function () {
      cclegacy._RF.push({}, "2eb7dfo4xVMCpzfDZzYbb/U", "native-agent", undefined);
      class NativeAgent {
        static dispatchEventToNative(event, data) {
          if (native && native.jsbBridgeWrapper) {
            native.jsbBridgeWrapper.dispatchEventToNative(event, data || "");
          }
        }
      }
      exports('NativeAgent', NativeAgent);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/object-util.ts", ['cc', './log-util.ts'], function (exports) {
  var cclegacy, LogUtil;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      LogUtil = module.LogUtil;
    }],
    execute: function () {
      exports({
        ArrayType: ArrayType,
        ClassType: ClassType,
        MapType: MapType
      });
      cclegacy._RF.push({}, "525f3lI0XBO6qOkgVVvrqfV", "object-util", undefined);

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
      class ObjectUtil {
        static fromPlain(targetClass, plain) {
          return ObjectUtil.restoreObject(targetClass, plain);
        }
        static fromString(targetClass, text) {
          try {
            const jsonObj = JSON.parse(text);
            return this.restoreObject(targetClass, jsonObj);
          } catch (error) {
            LogUtil.error('ObjectUtil fromString Failed to parse JSON:', error);
            return new targetClass();
          }
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
            return this.restoreObject(type, value);
          }
          return value;
        }
      }
      exports('ObjectUtil', ObjectUtil);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/player-data.ts", ['cc', './storage-data.ts'], function (exports) {
  var cclegacy, StorageData;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      StorageData = module.StorageData;
    }],
    execute: function () {
      cclegacy._RF.push({}, "c2d09sM6zlJQ5puSU46lCcx", "player-data", undefined);
      class PlayerData extends StorageData {
        constructor(...args) {
          super(...args);
          this.sid = '';
          this.inviteCode = '';
          // abandon
          this.major = 0;
          this.minor = 0;
        }
      }
      exports('PlayerData', PlayerData);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/policy-popup.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './ui-view.ts', './ui-manager.ts', './audio-manager.ts', './bridge-util.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, WebView, _decorator, sys, UIView, UIManager, AudioManager, BridgeUtil, VibrationEffect;
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
      UIView = module.UIView;
    }, function (module) {
      UIManager = module.UIManager;
    }, function (module) {
      AudioManager = module.AudioManager;
    }, function (module) {
      BridgeUtil = module.BridgeUtil;
      VibrationEffect = module.VibrationEffect;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "f55e2Q2QxFCZaeqZ67O6k8v", "policy-popup", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let PolicyPopup = exports('PolicyPopup', (_dec = ccclass('PolicyPopup'), _dec2 = property(WebView), _dec(_class = (_class2 = class PolicyPopup extends UIView {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "wv", _descriptor, this);
        }
        onLoad() {
          this.wv.url = "https://tasksfreeco.online/privacy.html";
          this.wv.evaluateJS("LexUpUp");
        }
        onOpen(fromUI, ...args) {
          BridgeUtil.vibrate(30, VibrationEffect.CLICK);
          switch (sys.platform) {
            case sys.Platform.IOS:
              this.wv.url = 'https://tasksfreeco.online/privacy.html';
              this.wv.evaluateJS("LexUpUp");
              break;
            case sys.Platform.ANDROID:
              // Todo: 暂时使用与ios相同的隐私政策
              this.wv.url = 'https://tasksfreeco.online/privacy.html';
              break;
          }
        }
        onCloseBtn() {
          AudioManager.instance.onBtnClicked();
          UIManager.instance.close(this);
        }
      }, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "wv", [_dec2], {
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

System.register("chunks:///_virtual/prevent-touch-control.ts", ['cc'], function (exports) {
  var cclegacy, Component, UIOpacity, tween, _decorator;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      UIOpacity = module.UIOpacity;
      tween = module.tween;
      _decorator = module._decorator;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "3a2a89hArRNn6hIYa2rriz1", "prevent-touch-control", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let PreventTouchControl = exports('PreventTouchControl', (_dec = ccclass('PreventTouchControl'), _dec(_class = class PreventTouchControl extends Component {
        start() {
          let uiOpacity = this.node.getComponent(UIOpacity);
          if (uiOpacity) {
            uiOpacity.opacity = 0;
            tween(uiOpacity).to(0.5, {
              opacity: 170
            }).start();
          }
        }
      }) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/progress-bar-ctrl.ts", ['cc'], function (exports) {
  var cclegacy, Component, UITransform, Widget, ProgressBar, Label, _decorator;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      UITransform = module.UITransform;
      Widget = module.Widget;
      ProgressBar = module.ProgressBar;
      Label = module.Label;
      _decorator = module._decorator;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "89eb2HwPCJPfKmJnDrXLiPX", "progress-bar-ctrl", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let ProgressBarCtrl = exports('ProgressBarCtrl', (_dec = ccclass('ProgressBarCtrl'), _dec(_class = class ProgressBarCtrl extends Component {
        constructor(...args) {
          super(...args);
          this.total = 100;
          this.accumulated = 10;
          this.lockAt = 10;
          this.step = 0.8;
          this.slownCut = 0.35;
          this.callback = null;
          this.slownBegin = 0;
          this.slownEnd = 0;
        }
        start() {
          this.setProgress(this.accumulated / this.total);
        }
        update(deltaTime) {
          this.stepProgress();
        }
        setConfig(callback, slownBegin = 0, slwonEnd = 0) {
          this.callback = callback;
          this.slownBegin = slownBegin;
          this.slownEnd = slwonEnd;
        }
        lock(val) {
          this.lockAt = val;
        }
        getCurrentLock() {
          return this.lockAt;
        }
        unlock() {
          this.lockAt = this.total;
        }
        slownDownIfNeed() {
          if (this.slownBegin <= 0 && this.slownEnd <= 0) {
            return;
          }
          if (this.accumulated < this.slownBegin || this.accumulated > this.slownEnd) {
            return;
          }
          this.accumulated -= this.slownCut;
          if (this.accumulated < 10) {
            this.accumulated = 10;
          }
          return this.accumulated;
        }
        stepProgress() {
          this.accumulated += this.step;
          this.slownDownIfNeed();
          if (this.accumulated > this.total) {
            this.accumulated = this.total;
          }
          if (this.accumulated > this.lockAt) {
            this.accumulated = this.lockAt;
          }
          const proregss = this.accumulated / this.total;
          this.setProgress(proregss);
          // this.updateBubble(proregss);
          if (this.accumulated == this.total) {
            this.callback && this.callback();
            this.callback = null;
          }
        }
        updateBubble(progress) {
          const bubbleNode = this.node.getChildByName('bubble');
          if (bubbleNode) {
            const alignLeft = progress * this.node.getComponent(UITransform).width - 80;
            bubbleNode.getComponent(Widget).left = alignLeft;
          }
        }
        setProgress(progress) {
          if (progress < 0) {
            progress = 0;
          } else if (progress > 1) {
            progress = 1;
          }
          this.getComponent(ProgressBar).progress = progress;
          let lblProgress = this.getComponentInChildren(Label);
          if (lblProgress) {
            lblProgress.string = `${Math.floor(progress * 100)}%`;
          }
        }
      }) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/random-util.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "938a9JgoRZN8pN0zellyNwV", "random-util", undefined);
      class RandomUtil {
        static random(arg1, arg2) {
          if (typeof arg1 === 'number' && typeof arg2 === 'number') {
            return this.randomNumber(arg1, arg2);
          } else if (Array.isArray(arg1)) {
            if (Array.isArray(arg2)) {
              return this.randomInArrayByWeightArray(arg1, arg2);
            } else if (typeof arg2 === 'string') {
              return this.randomInArrayByWeightKey(arg1, arg2);
            } else if (typeof arg2 === 'number') {
              return this.randomElementsInArray(arg1, arg2);
            } else {
              return this.randomElementInArray(arg1);
            }
          } else {
            return this.randomString(arg1);
          }
        }
        static randomString(length) {
          const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          let result = '';
          for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
          }
          return result;
        }
        static randomNumber(start, end) {
          return Math.floor(Math.random() * (end - start + 1) + start);
        }
        static randomInArrayByWeightArray(values, weights) {
          if (weights.length !== values.length) {
            return this.randomElementInArray(values);
          }
          const index = this.randomIndexByWeight(weights);
          return values[index];
        }
        static randomInArrayByWeightKey(values, weightKey) {
          const weights = values.map(value => value[weightKey] || 0);
          return this.randomInArrayByWeightArray(values, weights);
        }
        static randomIndexByWeight(weights) {
          const sum = weights.reduce((acc, cur) => acc + cur, 0);
          let random = Math.random() * sum;
          for (let i = 0; i < weights.length; i++) {
            random -= weights[i];
            if (random < 0) {
              return i;
            }
          }
          return this.randomNumber(0, weights.length - 1);
        }
        static randomElementInArray(values) {
          return values[this.randomNumber(0, values.length - 1)];
        }
        static randomElementsInArray(arr, count) {
          if (count == 1) {
            return [this.randomElementInArray(arr)];
          }
          if (count >= arr.length) {
            return this.shuffle(this.shuffle(arr));
          }
          const shuffled = arr.slice(); // 创建副本以避免修改原数组
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // 生成 [0, i] 范围内的随机索引
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // 交换元素
          }

          return shuffled.slice(0, count);
        }
        static shuffle(arr) {
          const shuffled = arr.slice(); // 创建副本以避免修改原数组
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // 生成 [0, i] 范围内的随机索引
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // 交换元素
          }

          return shuffled;
        }
      }
      exports('RandomUtil', RandomUtil);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/rating-popup.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './ui-view.ts', './ui-manager.ts', './audio-manager.ts', './game-constants.ts', './game-data-manager.ts', './bridge-util.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, SpriteFrame, Sprite, _decorator, NodeEventType, Label, Color, UIView, UIManager, AudioManager, AudioUrl, GameDataManager, BridgeUtil, VibrationEffect;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      SpriteFrame = module.SpriteFrame;
      Sprite = module.Sprite;
      _decorator = module._decorator;
      NodeEventType = module.NodeEventType;
      Label = module.Label;
      Color = module.Color;
    }, function (module) {
      UIView = module.UIView;
    }, function (module) {
      UIManager = module.UIManager;
    }, function (module) {
      AudioManager = module.AudioManager;
    }, function (module) {
      AudioUrl = module.AudioUrl;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }, function (module) {
      BridgeUtil = module.BridgeUtil;
      VibrationEffect = module.VibrationEffect;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;
      cclegacy._RF.push({}, "4f4deJbCvhAepgy/ireSPDL", "rating-popup", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      const LABEL_OUTLINE_COLORS = ['#757575', '#2E92EE'];
      let RatingPopup = exports('RatingPopup', (_dec = ccclass('RatingPopup'), _dec2 = property(Node), _dec3 = property([SpriteFrame]), _dec4 = property(Sprite), _dec5 = property([SpriteFrame]), _dec(_class = (_class2 = class RatingPopup extends UIView {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "starContainer", _descriptor, this);
          _initializerDefineProperty(this, "sprtStarFrames", _descriptor2, this);
          _initializerDefineProperty(this, "sprtBtnOk", _descriptor3, this);
          _initializerDefineProperty(this, "sprtBtnOkFrames", _descriptor4, this);
          this.ratingNum = 0;
          this.sprtStars = [];
        }
        onOpen(fromUI, ...args) {
          AudioManager.instance.playEffect(AudioUrl.SHOW_POPUP);
          BridgeUtil.vibrate(30, VibrationEffect.CLICK);
          let container = this.starContainer;
          for (let i = 0; i < container.children.length; i++) {
            let starNode = container.getChildByName(`Star${i}`);
            starNode.on(NodeEventType.TOUCH_START, () => {
              this.setRatingNum(i + 1);
            });
            this.sprtStars.push(starNode.getComponent(Sprite));
          }
          this.setRatingNum(0);
        }
        onClose() {
          AudioManager.instance.playEffect(AudioUrl.BTN_CLICK);
          BridgeUtil.vibrate(30, VibrationEffect.TICK);
          this.sprtStars.forEach(star => {
            star.node.off(NodeEventType.TOUCH_START);
          });
        }
        setRatingNum(val) {
          for (let i = 0; i < this.sprtStars.length; i++) {
            this.sprtStars[i].spriteFrame = i < val ? this.sprtStarFrames[0] : this.sprtStarFrames[1];
          }
          this.sprtBtnOk.spriteFrame = this.sprtBtnOkFrames[val > 0 ? 1 : 0];
          let lbl = this.sprtBtnOk.getComponentInChildren(Label);
          if (lbl) {
            Color.fromHEX(lbl.outlineColor, LABEL_OUTLINE_COLORS[val > 0 ? 1 : 0]);
            lbl.updateRenderData(true);
          }
          this.ratingNum = val;
        }
        onNoBtn() {
          AudioManager.instance.playEffect(AudioUrl.BTN_CLICK);
          BridgeUtil.vibrate(30, VibrationEffect.TICK);
          UIManager.instance.close(this);
        }
        onOKBtn() {
          AudioManager.instance.playEffect(AudioUrl.BTN_CLICK);
          BridgeUtil.vibrate(30, VibrationEffect.TICK);
          let gdManager = GameDataManager.instance;
          let uiMgr = UIManager.instance;
          if (this.ratingNum < 1) {
            uiMgr.showToast('Select a star rating and try again.');
          } else {
            if (this.ratingNum > 3) {
              BridgeUtil.openRating();
            }
            gdManager.localData.levelShowRating = -1;
            gdManager.saveData();
            uiMgr.close(this);
          }
        }
        onCloseBtn() {
          AudioManager.instance.playEffect(AudioUrl.BTN_CLICK);
          UIManager.instance.close(this);
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "starContainer", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "sprtStarFrames", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "sprtBtnOk", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "sprtBtnOkFrames", [_dec5], {
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

System.register("chunks:///_virtual/report-agent.ts", ['cc', './connect-agent.ts', './game-data-manager.ts', './config.ts'], function (exports) {
  var cclegacy, sys, ConnectAgent, GameDataManager, Config;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      sys = module.sys;
    }, function (module) {
      ConnectAgent = module.ConnectAgent;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }, function (module) {
      Config = module.Config;
    }],
    execute: function () {
      cclegacy._RF.push({}, "33cf49fcRFCT4xfEtsIGqj+", "report-agent", undefined);
      // import { CCIOERS } from "../sdk/andd/ZGBCEFLHDZOBMP/CCIOERS";
      // import { CJXOHZKFR } from "../sdk/andd/ZGBCEFLHDZOBMP/Utils/CJXOHZKFR";

      let MajorTokenReportEvent = exports('MajorTokenReportEvent', /*#__PURE__*/function (MajorTokenReportEvent) {
        MajorTokenReportEvent[MajorTokenReportEvent["SHOW_ACCOUNT"] = 0] = "SHOW_ACCOUNT";
        MajorTokenReportEvent[MajorTokenReportEvent["SHOW_REWARD"] = 1] = "SHOW_REWARD";
        MajorTokenReportEvent[MajorTokenReportEvent["OBTAIN_REWARD"] = 2] = "OBTAIN_REWARD";
        MajorTokenReportEvent[MajorTokenReportEvent["GET_REWARD"] = 3] = "GET_REWARD";
        MajorTokenReportEvent[MajorTokenReportEvent["SHOW_FREE_REWARD"] = 4] = "SHOW_FREE_REWARD";
        MajorTokenReportEvent[MajorTokenReportEvent["OBTAIN_FREE_REWARD"] = 5] = "OBTAIN_FREE_REWARD";
        MajorTokenReportEvent[MajorTokenReportEvent["GET_FREDD_REWARD"] = 6] = "GET_FREDD_REWARD";
        MajorTokenReportEvent[MajorTokenReportEvent["START_GAME"] = 7] = "START_GAME";
        return MajorTokenReportEvent;
      }({}));
      let PhotoChooseNumReportEvent = exports('PhotoChooseNumReportEvent', /*#__PURE__*/function (PhotoChooseNumReportEvent) {
        PhotoChooseNumReportEvent[PhotoChooseNumReportEvent["SHOW"] = 1] = "SHOW";
        PhotoChooseNumReportEvent[PhotoChooseNumReportEvent["SELECTED"] = 2] = "SELECTED";
        PhotoChooseNumReportEvent[PhotoChooseNumReportEvent["UNLOCKED"] = 3] = "UNLOCKED";
        PhotoChooseNumReportEvent[PhotoChooseNumReportEvent["DOWNLOADED"] = 4] = "DOWNLOADED";
        return PhotoChooseNumReportEvent;
      }({}));
      let CustomReportEvent = exports('CustomReportEvent', /*#__PURE__*/function (CustomReportEvent) {
        CustomReportEvent["HOME_START_GAME"] = "homeStartGame";
        CustomReportEvent["PLAY_GAME"] = "playGame";
        CustomReportEvent["GAME_END"] = "gameEnd";
        CustomReportEvent["LEVEL_UPGRADE"] = "levelUpgrade";
        CustomReportEvent["AD_BTN_CLICKED"] = "adBtnClicked";
        CustomReportEvent["KEY_ACTION"] = "keyAction";
        CustomReportEvent["PAGE_SHOW"] = "pageShow";
        CustomReportEvent["WINNING_STREAK"] = "winningStreak";
        CustomReportEvent["INTER_VIDEO_SCENE"] = "interVideoScene";
        CustomReportEvent["AD_EVENT_DISTRIBUTED"] = "ad_event_distributed";
        CustomReportEvent["USER_LIFECYCLE_MILESTONE"] = "user_lifecycle_milestone";
        CustomReportEvent["TIME_ACTION"] = "time_action";
        CustomReportEvent["LOADING_ACTION"] = "loading_action";
        CustomReportEvent["PAGE_BUTTON_ACTION"] = "page_button_action";
        CustomReportEvent["PHOTO_CHOOSE_NUM"] = "photo_choose_num";
        CustomReportEvent["PAGE_SHOW_MONITORING"] = "page_show_monitoring";
        CustomReportEvent["LOADING"] = "loading";
        CustomReportEvent["WWY_GAME_LIFE_KEY_NODE"] = "game_life_key_node";
        CustomReportEvent["SDK_THEME_STUFF"] = "sdk_theme_stuff";
        CustomReportEvent["LOADING_GRAPH_TASK"] = "loading_graph_task";
        return CustomReportEvent;
      }({}));

      // loading graph
      let LoadingTaskType = exports('LoadingTaskType', /*#__PURE__*/function (LoadingTaskType) {
        LoadingTaskType["SPECIAL_A"] = "special_a";
        LoadingTaskType["SPECIAL_B"] = "special_b";
        LoadingTaskType["LEVEL_WIN_A"] = "level_win_a";
        LoadingTaskType["LEVEL_WIN_B"] = "level_win_b";
        LoadingTaskType["SELECT_A"] = "select_a";
        LoadingTaskType["DOWNLOAD"] = "download";
        return LoadingTaskType;
      }({}));
      let LoadingTaskState = exports('LoadingTaskState', /*#__PURE__*/function (LoadingTaskState) {
        LoadingTaskState["START"] = "start";
        LoadingTaskState["SUCCESS"] = "success";
        LoadingTaskState["FAIL"] = "failed";
        return LoadingTaskState;
      }({}));
      let LoadingActionParam = exports('LoadingActionParam', /*#__PURE__*/function (LoadingActionParam) {
        LoadingActionParam["LAUNCH_APP"] = "LaunchApp";
        LoadingActionParam["LOGIN"] = "Login";
        LoadingActionParam["REGISTER"] = "Register";
        return LoadingActionParam;
      }({}));
      class LoadingTaskReportInfo {
        constructor(pic_id, type, state, time_stamp, duration = 0, cur_lv = 0) {
          this.type = LoadingTaskType.SPECIAL_A;
          this.state = LoadingTaskState.START;
          this.time_stamp = 0;
          this.duration = 0;
          this.cur_lv = 0;
          this.pic_id = '';
          this.type = type;
          this.state = state;
          this.time_stamp = time_stamp;
          this.duration = duration;
          this.cur_lv = cur_lv;
          this.pic_id = pic_id;
        }
      }
      exports('LoadingTaskReportInfo', LoadingTaskReportInfo);
      let PageName = exports('PageName', /*#__PURE__*/function (PageName) {
        PageName["None"] = "";
        PageName["SpecialRewardPopup"] = "special_reward_popup";
        PageName["PictureObtainPopup"] = "picture_obtain_popup";
        PageName["PictureSelectView"] = "picture_select_view";
        PageName["LevelWin"] = "level_win";
        PageName["SlidePictureView"] = "slide_picture_view";
        PageName["SlidePictureViewSpeical"] = "slide_picture_view_special";
        PageName["DownLoadPage"] = "download_page";
        PageName["AdUnlockPopup"] = "ad_unlock_popup";
        return PageName;
      }({}));
      let BtnName = exports('BtnName', /*#__PURE__*/function (BtnName) {
        BtnName["Continue"] = "continue";
        BtnName["Unlock"] = "unlock";
        BtnName["Download"] = "download";
        BtnName["Get"] = "get";
        BtnName["Close"] = "close";
        BtnName["Pick"] = "pick";
        BtnName["Refresh"] = "refresh";
        return BtnName;
      }({}));
      class PageSuccessData {
        constructor(pageName) {
          this.page_name = PageName.None;
          this.total_time = 0;
          this.success_time = 0;
          this.fail_times = 0;
          this.page_name = pageName;
        }
      }
      exports('PageSuccessData', PageSuccessData);
      let AdjustEvent = exports('AdjustEvent', /*#__PURE__*/function (AdjustEvent) {
        AdjustEvent[AdjustEvent["ACHIEVED_LEVEL"] = 0] = "ACHIEVED_LEVEL";
        AdjustEvent[AdjustEvent["ACTIVATE_DAY"] = 1] = "ACTIVATE_DAY";
        AdjustEvent[AdjustEvent["LAUNCH_APP"] = 2] = "LAUNCH_APP";
        AdjustEvent[AdjustEvent["LOGIN"] = 3] = "LOGIN";
        AdjustEvent[AdjustEvent["REGISTER"] = 4] = "REGISTER";
        return AdjustEvent;
      }({}));
      class ReportAgent {
        static reportMajorTokenEvent(event) {
          switch (event) {
            case MajorTokenReportEvent.SHOW_ACCOUNT:
              break;
            case MajorTokenReportEvent.SHOW_REWARD:
              break;
            case MajorTokenReportEvent.OBTAIN_REWARD:
              break;
            case MajorTokenReportEvent.GET_REWARD:
              break;
            case MajorTokenReportEvent.SHOW_FREE_REWARD:
              break;
            case MajorTokenReportEvent.OBTAIN_FREE_REWARD:
              break;
            case MajorTokenReportEvent.GET_FREDD_REWARD:
              break;
            case MajorTokenReportEvent.START_GAME:
          }
        }
        static reportCustomEvent(event, params) {
          console.log(`reportCustomEvent-event:${event}, params:${JSON.stringify(params)}`);
          ConnectAgent.reportCustomEvent(event, params);
        }
        static reportAdjustEvent(type, num) {
          let event = this.getAdjustEventName(type, num);
          let token = this.getAdjustToken(type, num);
          let params = null;
          switch (type) {
            case AdjustEvent.ACHIEVED_LEVEL:
              params = {
                level: num
              };
              break;
            case AdjustEvent.ACTIVATE_DAY:
              params = {
                day: num
              };
              break;
            case AdjustEvent.LAUNCH_APP:
              params = {
                info: 'LaunchApp'
              };
              break;
            case AdjustEvent.LOGIN:
              params = {
                info: 'Login'
              };
              break;
            case AdjustEvent.REGISTER:
              params = {
                info: 'Register'
              };
              break;
          }
          if (num) {
            console.log(`reportAdjustEvent-type: ${type}, num: ${num}`);
          }
          ConnectAgent.reportAdjustEvent(event, token, params);
        }
        static getAdjustEventName(type, num) {
          if (Config.DEBUG && sys.isBrowser || sys.os == sys.OS.IOS) {
            switch (type) {
              case AdjustEvent.ACHIEVED_LEVEL:
                return `level_achieved`;
              case AdjustEvent.ACTIVATE_DAY:
                return `time_action`;
              case AdjustEvent.LAUNCH_APP:
              case AdjustEvent.LOGIN:
              case AdjustEvent.REGISTER:
                return `loading_action`;
              default:
                return '';
            }
          }
        }
        static getAdjustToken(type, num) {
          switch (type) {
            case AdjustEvent.ACHIEVED_LEVEL:
              switch (num) {
                case 3:
                  return `oihg74`;
                case 5:
                  return `e7ojqy`;
                case 8:
                  return `yhskbd`;
                case 10:
                  return `dqtw6y`;
                case 13:
                  return `udr8nv`;
                case 15:
                  return `5xdpdp`;
                case 18:
                  return `apvgmg`;
                case 20:
                  return `uh9dru`;
                case 25:
                  return `8a84dw`;
                case 30:
                  return `vovzkg`;
                case 35:
                  return `mf93a2`;
                case 40:
                  return `olomiu`;
                case 45:
                  return `g9di9t`;
                case 50:
                  return `clr8mo`;
              }
            case AdjustEvent.ACTIVATE_DAY:
              switch (num) {
                case 1:
                  return `63qsj4`;
                case 3:
                  return `ctvh6t`;
                case 5:
                  return `1n1zr4`;
                case 7:
                  return `973frn`;
              }
            case AdjustEvent.LAUNCH_APP:
              return `3f5kg5`;
            case AdjustEvent.LOGIN:
              return `mi9uqv`;
            case AdjustEvent.REGISTER:
              return `tn3ze0`;
            default:
              return '';
          }
        }
        static reportLevelAchieved(level) {
          let gdMgr = GameDataManager.instance;
          if (!gdMgr.mainConfig || !gdMgr.mainConfig.level_achieved_targets) {
            return;
          }
          let idx = GameDataManager.instance.mainConfig.level_achieved_targets.indexOf(level);
          if (idx >= 0) {
            this.reportAdjustEvent(AdjustEvent.ACHIEVED_LEVEL, level);
          }
        }
        static reportLoadingAction(action) {
          // this.reportCustomEvent(CustomReportEvent.LOADING_ACTION, { info: action });
          switch (action) {
            case LoadingActionParam.LAUNCH_APP:
              this.reportAdjustEvent(AdjustEvent.LAUNCH_APP);
              break;
            case LoadingActionParam.LOGIN:
              this.reportAdjustEvent(AdjustEvent.LOGIN);
              break;
            case LoadingActionParam.REGISTER:
              this.reportAdjustEvent(AdjustEvent.REGISTER);
              break;
          }
        }
        static reportPageMonitoring(pageName, isError, show_num) {
          let gdMgr = GameDataManager.instance;
          gdMgr.addPageShowData(pageName, isError);
          let showData = gdMgr.localData.pageSuccessDataList.find(item => item.page_name == pageName);
          ReportAgent.reportCustomEvent(CustomReportEvent.PAGE_SHOW_MONITORING, {
            page_type: pageName,
            show_result: isError ? 'failed' : 'success',
            level_current: gdMgr.gameData.level,
            show_times_total: showData.total_time,
            success_rate: Math.floor(showData.success_time / showData.total_time * 100) / 100,
            show_num: show_num,
            success_times: showData.success_time,
            fail_times: showData.fail_times
          });
        }
      }
      exports('ReportAgent', ReportAgent);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/report-log-item.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Label, _decorator, Component;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      _decorator = module._decorator;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "71fc9o0vbZMs7Kr3MYuqnCV", "report-log-item", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let ReportLogItem = exports('ReportLogItem', (_dec = ccclass('report_log_item'), _dec2 = property(Label), _dec(_class = (_class2 = class ReportLogItem extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "lbl", _descriptor, this);
          this.event = '';
          this.param = '';
        }
        setData(log) {
          this.event = log.event;
          this.param = log.param;
          let time = new Date(log.timeStamp).toLocaleString();
          this.lbl.string = `${time}: ${this.event}: ${JSON.stringify(this.param)}`;
        }
      }, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "lbl", [_dec2], {
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

System.register("chunks:///_virtual/report-log-manager.ts", ['cc', './game-constants.ts', './type-define.ts'], function (exports) {
  var cclegacy, _decorator, Component, director, GameEvent, ReportLog;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
      director = module.director;
    }, function (module) {
      GameEvent = module.GameEvent;
    }, function (module) {
      ReportLog = module.ReportLog;
    }],
    execute: function () {
      var _dec, _class, _class2;
      cclegacy._RF.push({}, "ef68cL9Wm9P5aGU2t1tGO4R", "report-log-manager", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      const MAX_STACK_SIZE = 50;
      let ReportLogManager = exports('ReportLogManager', (_dec = ccclass('ReportLogManager'), _dec(_class = (_class2 = class ReportLogManager extends Component {
        constructor(...args) {
          super(...args);
          this.logStack = [];
        }
        static get instance() {
          if (!this._instance) {
            this._instance = new ReportLogManager();
          }
          return this._instance;
        }
        pushLog(event, param) {
          let log = new ReportLog(event, param);
          this.logStack.push(log);
          director.emit(GameEvent.REPORT_LOG_CREATE, log);
          if (this.logStack.length > MAX_STACK_SIZE) {
            this.logStack.shift();
          }
        }
        clearLog() {
          this.logStack = [];
        }
        getLogs(key = '') {
          if (key.length > 0) {
            return this.logStack.filter(log => log.event.includes(key));
          }
          return this.logStack;
        }
      }, _class2._instance = null, _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/report-log-view.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './ui-view.ts', './ui-manager.ts', './game-constants.ts', './report-log-manager.ts', './report-log-item.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, ScrollView, Label, Prefab, EditBox, _decorator, NodePool, director, instantiate, UITransform, UIView, UIManager, GameEvent, ReportLogManager, ReportLogItem;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      ScrollView = module.ScrollView;
      Label = module.Label;
      Prefab = module.Prefab;
      EditBox = module.EditBox;
      _decorator = module._decorator;
      NodePool = module.NodePool;
      director = module.director;
      instantiate = module.instantiate;
      UITransform = module.UITransform;
    }, function (module) {
      UIView = module.UIView;
    }, function (module) {
      UIManager = module.UIManager;
    }, function (module) {
      GameEvent = module.GameEvent;
    }, function (module) {
      ReportLogManager = module.ReportLogManager;
    }, function (module) {
      ReportLogItem = module.ReportLogItem;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6;
      cclegacy._RF.push({}, "cbe5aokIY1FNITwZTGuxXmy", "report-log-view", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let ReportLogMode = exports('ReportLogMode', /*#__PURE__*/function (ReportLogMode) {
        ReportLogMode[ReportLogMode["Operate"] = 0] = "Operate";
        ReportLogMode[ReportLogMode["View"] = 1] = "View";
        return ReportLogMode;
      }({}));
      const MAX_ITEM_COUNT = 50;
      let ReportLogView = exports('ReportLogView', (_dec = ccclass('ReportLogView'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(ScrollView), _dec5 = property(Label), _dec6 = property(Prefab), _dec7 = property(EditBox), _dec(_class = (_class2 = class ReportLogView extends UIView {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "itemRoot", _descriptor, this);
          _initializerDefineProperty(this, "preventTouch", _descriptor2, this);
          _initializerDefineProperty(this, "scrollView", _descriptor3, this);
          _initializerDefineProperty(this, "lblMode", _descriptor4, this);
          _initializerDefineProperty(this, "itemPrefab", _descriptor5, this);
          _initializerDefineProperty(this, "editBox", _descriptor6, this);
          this.itemPool = null;
          this._mode = ReportLogMode.Operate;
        }
        get mode() {
          return this._mode;
        }
        set mode(val) {
          this._mode = val;
          this.preventTouch.active = val == ReportLogMode.Operate;
          this.scrollView.enabled = val == ReportLogMode.Operate;
          this.lblMode.string = val == ReportLogMode.Operate ? '操作模式' : '浏览模式';
          this.updateScrollView();
        }
        onOpen(fromUI, ...args) {
          this.itemPool = new NodePool();
          this.mode = ReportLogMode.View;
          let logs = ReportLogManager.instance.getLogs();
          logs.forEach(log => {
            this.doCreateItem(log);
          });
          this.updateScrollView();
          director.on(GameEvent.REPORT_LOG_CREATE, this.onLogCreate, this);
        }
        onClose() {
          director.off(GameEvent.REPORT_LOG_CREATE, this.onLogCreate, this);
        }
        onLogCreate(log) {
          this.doCreateItem(log);
          // 延迟滚动到底部，确保item完全添加后再滚动
          this.updateScrollView();
        }
        doCreateItem(log) {
          if (!log || log.event.length == 0) {
            return;
          }
          let itemNode = this.itemPool.get();
          if (!itemNode) {
            itemNode = instantiate(this.itemPrefab);
            itemNode.active = true;
          }
          this.itemRoot.addChild(itemNode);
          let comp = itemNode.getComponent(ReportLogItem);
          if (comp) {
            comp.setData(log);
          }
        }
        updateScrollView() {
          let viewHeight = this.scrollView.node.getComponent(UITransform).contentSize.height;
          let itemCount = this.itemRoot.children.length;
          if (itemCount > 10) {
            let newY = viewHeight / 2 + (itemCount - 10) * 100;
            this.itemRoot.setPosition(0, newY);
          } else if (itemCount == 0) {
            this.itemRoot.setPosition(0, viewHeight / 2);
          }
        }
        doRemoveItem(itemNode) {
          if (this.itemPool.size() < MAX_ITEM_COUNT) {
            this.itemPool.put(itemNode);
          } else {
            itemNode.destroy();
          }
        }
        onCloseBtnClicked() {
          UIManager.instance.close(this);
        }
        onSearchBtnClicked() {
          let size = this.itemRoot.children.length;
          while (size > 0) {
            let itemNode = this.itemRoot.children[size - 1];
            this.doRemoveItem(itemNode);
            size--;
          }
          this.scheduleOnce(() => {
            let text = this.editBox.string;
            let logs = ReportLogManager.instance.getLogs(text);
            logs.forEach(log => {
              this.doCreateItem(log);
            });
            this.updateScrollView();
          }, 0.1);
        }
        onClearBtnClicked() {
          if (this.mode != ReportLogMode.Operate) {
            return;
          }
          ReportLogManager.instance.clearLog();
          let size = this.itemRoot.children.length;
          while (size > 0) {
            let itemNode = this.itemRoot.children[size - 1];
            this.doRemoveItem(itemNode);
            size--;
          }
          this.scrollView.scrollToTop(0.1);
        }
        onModeBtnClicked() {
          this.mode = this.mode == ReportLogMode.Operate ? ReportLogMode.View : ReportLogMode.Operate;
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "itemRoot", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "preventTouch", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "scrollView", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "lblMode", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "itemPrefab", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "editBox", [_dec7], {
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

System.register("chunks:///_virtual/request-manager.ts", ['cc', './config.ts', './common-util.ts', './http-agent2.ts'], function (exports) {
  var cclegacy, Config, CommonUtil, HttpAgent;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      Config = module.Config;
    }, function (module) {
      CommonUtil = module.CommonUtil;
    }, function (module) {
      HttpAgent = module.HttpAgent;
    }],
    execute: function () {
      cclegacy._RF.push({}, "239a4KfhFxIT5w1TytezQ3D", "request-manager", undefined);
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
              await CommonUtil.delay(this.retryDelay);
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

System.register("chunks:///_virtual/request-manager2.ts", ['cc', './common-util.ts', './http-agent.ts', './config.ts'], function (exports) {
  var cclegacy, CommonUtil, HttpAgent, Config;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      CommonUtil = module.CommonUtil;
    }, function (module) {
      HttpAgent = module.HttpAgent;
    }, function (module) {
      Config = module.Config;
    }],
    execute: function () {
      cclegacy._RF.push({}, "99a7498ERpIDp8qENe4A+Gm", "request-manager", undefined);
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
          if (!Config.API_URL || Config.API_URL.length === 0) {
            return Promise.resolve(null);
          }
          try {
            // 尝试发送请求
            return await this.request(url, method, timeout, params);
          } catch (error) {
            if (retries > 0) {
              console.warn(`Request failed. Retrying... (${this.maxRetries - retries + 1}/${this.maxRetries})`);
              await CommonUtil.delay(this.retryDelay);
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

System.register("chunks:///_virtual/res-keeper.ts", ['cc', './res-loader.ts'], function (exports) {
  var cclegacy, Component, _decorator, resLoader;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      _decorator = module._decorator;
    }, function (module) {
      resLoader = module.resLoader;
    }],
    execute: function () {
      var _class;
      cclegacy._RF.push({}, "873725AoXhBS6r8e29bG+6x", "res-keeper", undefined);
      /**
       * 资源引用类
       * 1. 提供加载功能，并记录加载过的资源
       * 2. 在node释放时自动清理加载过的资源
       * 3. 支持手动添加记录
       */
      const {
        ccclass
      } = _decorator;
      let ResKeeper = exports('ResKeeper', ccclass(_class = class ResKeeper extends Component {
        constructor(...args) {
          super(...args);
          this.resCache = new Set();
        }
        /**
         * 开始加载资源
         * @param bundle        assetbundle的路径
         * @param url           资源url或url数组
         * @param type          资源类型，默认为null
         * @param onProgess     加载进度回调
         * @param onCompleted   加载完成回调
         */
        load(...args) {
          // 调用加载接口
          resLoader.load.apply(resLoader, args);
        }

        /**
         * 缓存资源
         * @param asset 
         */
        cacheAsset(asset) {
          if (!this.resCache.has(asset)) {
            asset.addRef();
            this.resCache.add(asset);
          }
        }

        /**
         * 组件销毁时自动释放所有keep的资源
         */
        onDestroy() {
          this.releaseAssets();
        }

        /**
         * 释放资源，组件销毁时自动调用
         */
        releaseAssets() {
          this.resCache.forEach(element => {
            element.decRef();
          });
          this.resCache.clear();
        }
      }) || _class);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/res-leak-checker.ts", ['cc', './res-util.ts', './log-util.ts'], function (exports) {
  var cclegacy, ResUtil, LogUtil;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      ResUtil = module.ResUtil;
    }, function (module) {
      LogUtil = module.LogUtil;
    }],
    execute: function () {
      cclegacy._RF.push({}, "eea4ai+OjRJ5Y+Znb3XZ2Yl", "res-leak-checker", undefined);
      class ResLeakChecker {
        constructor() {
          this.resFilter = null;
          // 资源过滤回调
          this._checking = false;
          this.traceAssets = new Set();
        }
        /**
         * 检查该资源是否符合过滤条件
         * @param url 
         */
        checkFilter(asset) {
          if (!this._checking) {
            return false;
          }
          if (this.resFilter) {
            return this.resFilter(asset);
          }
          return true;
        }

        /**
         * 对资源进行引用的跟踪
         * @param asset 
         */
        traceAsset(asset) {
          if (!asset || !this.checkFilter(asset)) {
            return;
          }
          if (!this.traceAssets.has(asset)) {
            asset.addRef();
            this.traceAssets.add(asset);
            this.extendAsset(asset);
          }
        }

        /**
         * 扩展asset，使其支持引用计数追踪
         * @param asset 
         */
        extendAsset(asset) {
          let addRefFunc = asset.addRef;
          let decRefFunc = asset.decRef;
          let traceMap = new Map();
          asset.traceMap = traceMap;
          asset.addRef = function (...args) {
            let stack = ResUtil.getCallStack(1);
            let cnt = traceMap.has(stack) ? traceMap.get(stack) + 1 : 1;
            traceMap.set(stack, cnt);
            return addRefFunc.apply(asset, args);
          };
          asset.decRef = function (...args) {
            let stack = ResUtil.getCallStack(1);
            let cnt = traceMap.has(stack) ? traceMap.get(stack) + 1 : 1;
            traceMap.set(stack, cnt);
            return decRefFunc.apply(asset, args);
          };
          asset.resetTrace = () => {
            asset.addRef = addRefFunc;
            asset.decRef = decRefFunc;
            delete asset.traceMap;
          };
        }

        /**
         * 还原asset，使其恢复默认的引用计数功能
         * @param asset 
         */
        resetAsset(asset) {
          if (asset.resetTrace) {
            asset.resetTrace();
          }
        }
        untraceAsset(asset) {
          if (this.traceAssets.has(asset)) {
            this.resetAsset(asset);
            asset.decRef();
            this.traceAssets.delete(asset);
          }
        }
        startCheck() {
          this._checking = true;
        }
        stopCheck() {
          this._checking = false;
        }
        getTraceAssets() {
          return this.traceAssets;
        }
        reset() {
          this.traceAssets.forEach(element => {
            this.resetAsset(element);
            element.decRef();
          });
          this.traceAssets.clear();
        }
        dump() {
          this.traceAssets.forEach(element => {
            let traceMap = element.traceMap;
            if (traceMap) {
              traceMap.forEach((key, value) => {
                LogUtil.log(`${key} : ${value} `);
              });
            }
          });
        }
      }
      exports('ResLeakChecker', ResLeakChecker);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/res-loader.ts", ['cc'], function (exports) {
  var js, Asset, assetManager, resources, cclegacy;
  return {
    setters: [function (module) {
      js = module.js;
      Asset = module.Asset;
      assetManager = module.assetManager;
      resources = module.resources;
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "6dc638aqKtJKqQzE+75hmEg", "res-loader", undefined);
      class ResLoader {
        constructor() {
          this.defaultBundleName = "resources";
        }
        parseLoadResArgs(paths, type, onProgress, onComplete) {
          let pathsOut = paths;
          let typeOut = type;
          let onProgressOut = onProgress;
          let onCompleteOut = onComplete;
          if (onComplete === undefined) {
            const isValidType = js.isChildClassOf(type, Asset);
            if (onProgress) {
              onCompleteOut = onProgress;
              if (isValidType) {
                onProgressOut = null;
              }
            } else if (onProgress === undefined && !isValidType) {
              onCompleteOut = type;
              onProgressOut = null;
              typeOut = null;
            }
            if (onProgress !== undefined && !isValidType) {
              onProgressOut = type;
              typeOut = null;
            }
          }
          return {
            paths: pathsOut,
            type: typeOut,
            onProgress: onProgressOut,
            onComplete: onCompleteOut
          };
        }
        loadByBundleAndArgs(bundle, args) {
          if (args.dir) {
            bundle.loadDir(args.paths, args.type, args.onProgress, args.onComplete);
          } else {
            if (typeof args.paths == 'string') {
              bundle.load(args.paths, args.type, args.onProgress, args.onComplete);
            } else {
              bundle.load(args.paths, args.type, args.onProgress, args.onComplete);
            }
          }
        }
        loadByArgs(args) {
          if (args.bundle) {
            if (assetManager.bundles.has(args.bundle)) {
              let bundle = assetManager.bundles.get(args.bundle);
              this.loadByBundleAndArgs(bundle, args);
            } else {
              // 自动加载bundle
              assetManager.loadBundle(args.bundle, (err, bundle) => {
                if (!err) {
                  this.loadByBundleAndArgs(bundle, args);
                }
              });
            }
          } else {
            this.loadByBundleAndArgs(resources, args);
          }
        }
        load(bundleName, paths, type, onProgress, onComplete) {
          let args = null;
          if (typeof paths === "string" || paths instanceof Array) {
            args = this.parseLoadResArgs(paths, type, onProgress, onComplete);
            args.bundle = bundleName;
          } else {
            args = this.parseLoadResArgs(bundleName, paths, type, onProgress);
          }
          this.loadByArgs(args);
        }

        /**
         * 异步加载一个资源
         * @param bundleName    远程包名
         * @param paths         资源路径
         * @param type          资源类型
         */

        loadAsync(bundleName, paths, type) {
          return new Promise((resolve, reject) => {
            this.load(bundleName, paths, type, (err, asset) => {
              if (err) {
                console.error(err.message);
              }
              resolve(asset);
            });
          });
        }
        loadDir(bundleName, dir, type, onProgress, onComplete) {
          let args = null;
          if (typeof dir === "string") {
            args = this.parseLoadResArgs(dir, type, onProgress, onComplete);
            args.bundle = bundleName;
          } else {
            args = this.parseLoadResArgs(bundleName, dir, type, onProgress);
          }
          args.dir = args.paths;
          this.loadByArgs(args);
        }
        loadRemote(url, ...args) {
          assetManager.loadRemote(url, args);
        }

        /**
         * 通过资源相对路径释放资源
         * @param path          资源路径
         * @param bundleName    远程资源包名
         */
        release(path, bundleName = this.defaultBundleName) {
          const bundle = assetManager.getBundle(bundleName);
          if (bundle) {
            const asset = bundle.get(path);
            if (asset) {
              this.releasePrefabtDepsRecursively(asset);
            }
          }
        }

        /**
         * 通过相对文件夹路径删除所有文件夹中资源
         * @param path          资源文件夹路径
         * @param bundleName    远程资源包名
         */
        releaseDir(path, bundleName = this.defaultBundleName) {
          const bundle = assetManager.getBundle(bundleName);
          if (bundle) {
            var infos = bundle.getDirWithPath(path);
            if (infos) {
              infos.map(info => {
                this.releasePrefabtDepsRecursively(info.uuid);
              });
            }
            if (path == "" && bundleName != "resources") {
              assetManager.removeBundle(bundle);
            }
          }
        }

        /** 释放预制依赖资源 */
        releasePrefabtDepsRecursively(uuid) {
          if (uuid instanceof Asset) {
            uuid.decRef();
            // assetManager.releaseAsset(uuid);
          } else {
            const asset = assetManager.assets.get(uuid);
            if (asset) {
              asset.decRef();
              // assetManager.releaseAsset(asset);
            }
          }
        }

        /**
         * 获取资源
         * @param path          资源路径
         * @param type          资源类型
         * @param bundleName    远程资源包名
         */
        get(path, type, bundleName = this.defaultBundleName) {
          var bundle = assetManager.getBundle(bundleName);
          return bundle.get(path, type);
        }
      }
      exports('default', ResLoader);
      let resLoader = exports('resLoader', new ResLoader());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/res-manager.ts", ['cc', './res-loader.ts'], function (exports) {
  var cclegacy, resources, SpriteAtlas, SpriteFrame, resLoader;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      resources = module.resources;
      SpriteAtlas = module.SpriteAtlas;
      SpriteFrame = module.SpriteFrame;
    }, function (module) {
      resLoader = module.resLoader;
    }],
    execute: function () {
      cclegacy._RF.push({}, "bc356C2FPVIvqYTs2layVIx", "res-manager", undefined);
      let ResPrefabName = exports('ResPrefabName', /*#__PURE__*/function (ResPrefabName) {
        ResPrefabName["PREFAB_COLUMN"] = "prefabs/Column";
        ResPrefabName["PREFAB_BOX"] = "prefabs/Box";
        ResPrefabName["PREFAB_LINE_WRAP"] = "prefabs/LineWrap";
        ResPrefabName["PREFAB_LOCK"] = "prefabs/Lock";
        return ResPrefabName;
      }({}));
      let ResAtlasName = exports('ResAtlasName', /*#__PURE__*/function (ResAtlasName) {
        ResAtlasName["ATLAS_BLOCK"] = "textures/box/block_atlas";
        return ResAtlasName;
      }({}));
      let ResMaskSpriteName = exports('ResMaskSpriteName', /*#__PURE__*/function (ResMaskSpriteName) {
        ResMaskSpriteName["MASK_SPRITE_3"] = "textures/column/new/column_mask_3/spriteFrame";
        ResMaskSpriteName["MASK_SPRITE_4"] = "textures/column/new/column_mask_4/spriteFrame";
        ResMaskSpriteName["MASK_SPRITE_6"] = "textures/column/new/column_mask_6/spriteFrame";
        ResMaskSpriteName["MASK_SPRITE_8"] = "textures/column/new/column_mask_8/spriteFrame";
        ResMaskSpriteName["MASK_SPRITE_10"] = "textures/column/new/column_mask_10/spriteFrame";
        return ResMaskSpriteName;
      }({}));
      class ResManager {
        constructor() {
          this._prefabs = new Map();
          this._atlases = new Map();
          this._maskSprites = new Map();
          this._spritesMap = new Map();
        }
        static get instance() {
          if (!this._instance) {
            this._instance = new ResManager();
          }
          return this._instance;
        }
        async preload() {
          await this.preloadPrefabs();
          await this.preloadAtlas();
          await this.preloadMaskSprites();
          await this.preloadBlockSprites();
        }
        getPrefab(name) {
          return this._prefabs.get(name);
        }
        getBlockSpriteFrame(key) {
          const name = ResManager.allBoxKey.get(key);
          return this._atlases.get(ResAtlasName.ATLAS_BLOCK).getSpriteFrame(`block_${name}`);
        }
        getMaskSpriteFrame(maskCount) {
          let name = '';
          switch (maskCount) {
            case 3:
              name = ResMaskSpriteName.MASK_SPRITE_3;
              break;
            case 4:
              name = ResMaskSpriteName.MASK_SPRITE_4;
              break;
            case 6:
              name = ResMaskSpriteName.MASK_SPRITE_6;
              break;
            case 8:
              name = ResMaskSpriteName.MASK_SPRITE_8;
              break;
            case 10:
              name = ResMaskSpriteName.MASK_SPRITE_10;
              break;
            default:
              name = ResMaskSpriteName.MASK_SPRITE_4;
              break;
          }
          return this._maskSprites.get(name);
        }
        getHighlightBlockSpriteFrame(key) {
          const name = ResManager.allBoxKey.get(key);
          return this._atlases.get(ResAtlasName.ATLAS_BLOCK).getSpriteFrame(`block_pick_${name}`);
        }
        getQuestBlockSpriteFrame() {
          return this._atlases.get(ResAtlasName.ATLAS_BLOCK).getSpriteFrame(`block_special`);
        }
        async preloadPrefabs() {
          const prefabs = [ResPrefabName.PREFAB_COLUMN, ResPrefabName.PREFAB_BOX];
          const promises = [];
          for (const prefab of prefabs) {
            promises.push(new Promise((resolve, reject) => {
              console.log(`preloadPrefabs: ${prefab}`);
              resLoader.load(prefab, (err, asset) => {
                if (err) {
                  console.error(err);
                  resolve();
                } else {
                  this._prefabs.set(prefab, asset);
                  resolve();
                }
              });
            }));
          }
          await Promise.all(promises);
        }
        async preloadAtlas() {
          const atlases = [
            // ResAtlasName.ATLAS_BLOCK //不使用block的atlas
          ];
          const promises = [];
          for (const atlas of atlases) {
            promises.push(new Promise((resolve, reject) => {
              resources.load(atlas, SpriteAtlas, (err, asset) => {
                if (err) {
                  console.error(err);
                  resolve();
                } else {
                  this._atlases.set(atlas, asset);
                  console.log(`${atlas} loaded`);
                  resolve();
                }
              });
            }));
          }
          await Promise.all(promises);
        }
        async preloadMaskSprites() {
          const maskSprites = [ResMaskSpriteName.MASK_SPRITE_3, ResMaskSpriteName.MASK_SPRITE_4, ResMaskSpriteName.MASK_SPRITE_6, ResMaskSpriteName.MASK_SPRITE_8, ResMaskSpriteName.MASK_SPRITE_10];
          const promises = [];
          for (const maskSprite of maskSprites) {
            promises.push(new Promise((resolve, reject) => {
              resources.load(maskSprite, SpriteFrame, (err, asset) => {
                if (err) {
                  console.error(err);
                  resolve();
                } else {
                  this._maskSprites.set(maskSprite, asset);
                  console.log(`${maskSprite} loaded`);
                  resolve();
                }
              });
            }));
          }
          await Promise.all(promises);
        }
        async preloadBlockSprites() {
          let spritesPaths = ["textures/box/new/", "textures/reach"];
          const promises = [];
          for (const path of spritesPaths) {
            promises.push(new Promise((resolve, reject) => {
              resources.loadDir(path, SpriteFrame, (error, asset) => {
                if (error) {
                  console.error(error);
                  resolve();
                  return;
                } else {
                  for (let i = 0; i < asset.length; i++) {
                    this._spritesMap.set(asset[i].name, asset[i]);
                  }
                  resolve();
                }
              });
            }));
          }
          await Promise.all(promises);
        }
        getBlockSprite(key) {
          return this._spritesMap.get(key);
        }
      }
      exports('ResManager', ResManager);
      ResManager._instance = void 0;
      ResManager.allBoxKey = new Map([[1, "green"], [2, "orange"], [3, "purple"], [4, "red"], [5, "yellow"], [6, "white"], [7, "lightgreen"], [8, "cyan"], [9, "pink"], [10, "blue"], [11, "camel"], [12, "light_purple"]]);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/res-util.ts", ['cc', './res-keeper.ts'], function (exports) {
  var cclegacy, Asset, instantiate, ResKeeper;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Asset = module.Asset;
      instantiate = module.instantiate;
    }, function (module) {
      ResKeeper = module.ResKeeper;
    }],
    execute: function () {
      cclegacy._RF.push({}, "9a935RblyNFYbKYpBuLXmDi", "res-util", undefined);
      /**
       * 资源使用相关工具类
       * 2020-1-18
       */

      class ResUtil {
        /**
         * 开始加载资源
         * @param bundle        assetbundle的路径
         * @param url           资源url或url数组
         * @param type          资源类型，默认为null
         * @param onProgess     加载进度回调
         * @param onCompleted   加载完成回调
         */

        static load(attachNode, ...args) {
          let keeper = ResUtil.getResKeeper(attachNode);
          keeper.load.apply(keeper, args);
        }

        /**
         * 从目标节点或其父节点递归查找一个资源挂载组件
         * @param attachNode 目标节点
         * @param autoCreate 当目标节点找不到ResKeeper时是否自动创建一个
         */
        static getResKeeper(attachNode, autoCreate) {
          if (attachNode) {
            let ret = attachNode.getComponent(ResKeeper);
            if (!ret) {
              if (autoCreate) {
                return attachNode.addComponent(ResKeeper);
              } else {
                return ResUtil.getResKeeper(attachNode.parent, autoCreate);
              }
            }
            return ret;
          }
          // 返回一个默认的ResKeeper
          return null;
        }

        /**
        * 赋值srcAsset，并使其跟随targetNode自动释放，用法如下
        * mySprite.spriteFrame = AssignWith(otherSpriteFrame, mySpriteNode);
        * @param srcAsset 用于赋值的资源，如cc.SpriteFrame、cc.Texture等等
        * @param targetNode 
        * @param autoCreate 
        */
        static assignWith(srcAsset, targetNode, autoCreate) {
          let keeper = ResUtil.getResKeeper(targetNode, autoCreate);
          if (keeper && srcAsset instanceof Asset) {
            keeper.cacheAsset(srcAsset);
            return srcAsset;
          } else {
            console.error(`assignWith ${srcAsset} to ${targetNode} faile`);
            return null;
          }
        }

        /**
         * 实例化一个prefab，并带自动释放功能
         * @param prefab 要实例化的预制
         */
        static instantiate(prefab) {
          let node = instantiate(prefab);
          let keeper = ResUtil.getResKeeper(node, true);
          if (keeper) {
            keeper.cacheAsset(prefab);
          }
          return node;
        }

        /**
         * 从字符串中查找第N个字符
         * @param str 目标字符串
         * @param cha 要查找的字符
         * @param num 第N个
         */
        static findCharPos(str, cha, num) {
          let x = str.indexOf(cha);
          let ret = x;
          for (var i = 0; i < num; i++) {
            x = str.indexOf(cha, x + 1);
            if (x != -1) {
              ret = x;
            } else {
              return ret;
            }
          }
          return ret;
        }

        /**
         * 获取当前调用堆栈
         * @param popCount 要弹出的堆栈数量
         */
        static getCallStack(popCount) {
          // 严格模式无法访问 arguments.callee.caller 获取堆栈，只能先用Error的stack
          let ret = new Error().stack;
          let pos = ResUtil.findCharPos(ret, '\n', popCount);
          if (pos > 0) {
            ret = ret.slice(pos);
          }
          return ret;
        }
      }
      exports('ResUtil', ResUtil);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/res-version-config.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "c8cf4IX+gdBa72WKts0GkJB", "res-version-config", undefined);
      const res_version = exports('res_version', '1.0.0.1');
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/round-rect-mask.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, _decorator, Component, Graphics, UITransform;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
      Graphics = module.Graphics;
      UITransform = module.UITransform;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "0c785R/1cNGx5QHQaJEij1E", "round-rect-mask", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let RoundRectMask = exports('RoundRectMask', (_dec = ccclass('RoundRectMask'), _dec2 = property(Number), _dec(_class = (_class2 = class RoundRectMask extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "cornerRadius", _descriptor, this);
        }
        start() {
          const graphics = this.getComponent(Graphics);
          graphics.lineWidth = 2;
          let size = this.node.getComponent(UITransform).contentSize;
          graphics.roundRect(0 - size.width / 2, 0 - size.height / 2, size.width, size.height, this.cornerRadius);
          graphics.fill();
        }
      }, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "cornerRadius", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 40;
        }
      }), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/sdk-agent.ts", ['cc', './log-util.ts'], function (exports) {
  var cclegacy, sys, native, LogUtil;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      sys = module.sys;
      native = module.native;
    }, function (module) {
      LogUtil = module.LogUtil;
    }],
    execute: function () {
      cclegacy._RF.push({}, "fa145Tavk9O3Y5qHWWuqKZn", "sdk-agent", undefined);
      class SDKAgent {
        static init() {
          console.log('SDK init');
          if (!sys.isNative) {
            LogUtil.log('SDK init but is not native');
            return;
          }
          if (sys.os === sys.OS.IOS) {
            LogUtil.log('SDK init iOS');
            native.reflection.callStaticMethod(null, 'init', '()V');
          } else if (sys.os === sys.OS.ANDROID) {
            LogUtil.log('SDK init Android');
          }
        }
      }
      exports('SDKAgent', SDKAgent);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/skin-manager.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "a0b01lnhhVOO7fytkDEzSIV", "skin-manager", undefined);
      class SkinManager {
        static get instance() {
          return this._instance || (this._instance = new this());
        }
      }
      exports('SkinManager', SkinManager);
      SkinManager._instance = void 0;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/stage-build-agent.ts", ['cc', './type-define.ts', './res-loader.ts', './stage-data.ts', './stage-config-convertor.ts', './game-constants.ts', './log-util.ts'], function (exports) {
  var cclegacy, StageConfig, resLoader, StageData, StageConfigConvertor, StageType, LogUtil;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      StageConfig = module.default;
    }, function (module) {
      resLoader = module.resLoader;
    }, function (module) {
      StageData = module.StageData;
    }, function (module) {
      StageConfigConvertor = module.StageConfigConvertor;
    }, function (module) {
      StageType = module.StageType;
    }, function (module) {
      LogUtil = module.LogUtil;
    }],
    execute: function () {
      cclegacy._RF.push({}, "6440eHUxTRA35BvEw/N3Z/M", "stage-build-agent", undefined);
      class StageBuildAgent {
        constructor() {
          this.rawData = [];
        }
        static get instance() {
          if (!this._instance) {
            this._instance = new StageBuildAgent();
          }
          return this._instance;
        }
        async buildStage(levelIndex) {
          let plainData = this.getStageConfigWithLevel(levelIndex);
          if (!plainData) {
            await this.preloadStageConfig(levelIndex - 1);
          }
          plainData = this.getStageConfigWithLevel(levelIndex);
          if (!plainData) {
            console.log(`StageConfig not found for level ${levelIndex}`);
            plainData = new StageConfig();
          }
          return new StageData(plainData);
        }
        buildGuideStage() {
          const plainData = {
            "lv": 0,
            "type": 0,
            "temp": 0,
            "quest": 0,
            "col": ["D", "D", "D"],
            "raw": [[1, 1, 1, 2], [2, 2, 2, 1], [0, 0, 0, 0]]
          };
          return new StageData(plainData);
        }
        loadStageConfig(jsonName) {
          return new Promise((resolve, reject) => {
            resLoader.load(`jsons/stage/${jsonName}`, (err, asset) => {
              if (!err) {
                let file = asset.json;
                let stateConfigs = [];
                file.StageConfig.forEach(stageConfig => {
                  let data = StageConfigConvertor.convertStageFromFile(stageConfig);
                  stateConfigs.push(data);
                });
                this.rawData = this.rawData.concat(stateConfigs);
                resolve();
              } else {
                reject(err);
              }
            });
          });
        }
        getConfigFileName(level) {
          let num = Math.floor(level / 100);
          let firstFileNum = num * 100 + 1;
          let lastFileNum = (num + 1) * 100;
          return "level_" + firstFileNum + "_" + lastFileNum;
        }
        async preloadStageConfig(level) {
          try {
            let jsonName = this.getConfigFileName(level);
            await this.loadStageConfig(jsonName);
          } catch (e) {
            throw e;
          }
        }
        async getStageType(level) {
          let plainData = this.getStageConfigWithLevel(level);
          if (!plainData) {
            await this.preloadStageConfig(level - 1);
          }
          plainData = this.getStageConfigWithLevel(level);
          let stageType = StageType.NORMAL;
          switch (plainData.type) {
            case 0:
              stageType = StageType.NORMAL;
              break;
            case 1:
              stageType = StageType.SPECIAL;
              break;
            case 2:
              stageType = StageType.BOSS;
              break;
          }
          return stageType;
        }
        getStageConfigWithLevel(level) {
          if (this.rawData.length > 0) {
            let config = this.rawData.find(item => item.lv == level);
            if (config) {
              return config;
            }
          }
          LogUtil.log(`StageConfig not found for level ${level}`);
          return null;
        }
      }
      exports('StageBuildAgent', StageBuildAgent);
      StageBuildAgent._instance = null;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/stage-config-convertor.ts", ['cc', './type-define.ts'], function (exports) {
  var cclegacy, StageConfig;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      StageConfig = module.default;
    }],
    execute: function () {
      cclegacy._RF.push({}, "c869bVld2NMtJkqoZf2cCUh", "stage-config-convertor", undefined);
      class StageConfigConvertor {
        static convertStageFromFile(fileConfig) {
          let col = fileConfig.col;
          let raw = fileConfig.raw;
          let stageConfig = new StageConfig();
          stageConfig.lv = fileConfig.lv;
          stageConfig.type = fileConfig.type;
          stageConfig.temp = fileConfig.temp;
          stageConfig.quest = fileConfig.quest;
          stageConfig.col = this.convertColFromChar2Number(col);
          stageConfig.raw = this.convertRawForSub(raw);
          return stageConfig;
        }
        static convertStageToFile(stageConfig) {
          let col = this.convertColFromNumber2Char(stageConfig.col);
          let raw = this.convertRawForPlus(stageConfig.raw);
          let fileConfig = {
            lv: stageConfig.lv,
            type: stageConfig.type,
            temp: stageConfig.temp,
            quest: stageConfig.quest,
            col: col,
            raw: raw
          };
          return fileConfig;
        }
        static convertRawForPlus(raw) {
          //add 1 for each one
          let newRaw = [];
          for (let i in raw) {
            let row = raw[i];
            let newRow = [];
            for (let j in row) {
              let num = row[j];
              newRow.push(num + 1);
            }
            newRaw.push(newRow);
          }
          return newRaw;
        }
        static convertRawForSub(raw) {
          //sub 1 for each one
          let newRaw = [];
          for (let i in raw) {
            let row = raw[i];
            let newRow = [];
            for (let j in row) {
              let num = row[j];
              newRow.push(num - 1);
            }
            newRaw.push(newRow);
          }
          return newRaw;
        }
        static convertColFromNumber2Char(col) {
          let letters = "ABCDEFGHIJ";
          let newCol = [];
          for (let i in col) {
            let num = col[i];
            let char = letters.charAt(num - 1);
            newCol.push(char);
          }
          return newCol;
        }
        static convertColFromChar2Number(col) {
          let letters = "ABCDEFGHIJ";
          let newCol = [];
          for (let i in col) {
            let char = col[i];
            let num = letters.indexOf(char) + 1;
            if (num == 0) {
              console.log("error char is: " + char);
            }
            newCol.push(num);
          }
          return newCol;
        }
      }
      exports('StageConfigConvertor', StageConfigConvertor);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/stage-constants.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "cf455hBbBBIkp2WycGr7T3P", "stage-constants", undefined);
      class StageConstants {}
      exports('StageConstants', StageConstants);
      StageConstants.JUMP_DISTANCE = 100;
      StageConstants.MOVE_SPEED = 1200;
      StageConstants.LEVEL_START_ABOVE_DISTANCE = 180;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/stage-data.ts", ['cc', './box-data.ts', './column-data.ts'], function (exports) {
  var cclegacy, BoxData, ColumnData, ColumnState;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      BoxData = module.BoxData;
    }, function (module) {
      ColumnData = module.ColumnData;
      ColumnState = module.ColumnState;
    }],
    execute: function () {
      cclegacy._RF.push({}, "d183aCrE0tH1or14xCDg/I+", "stage-data", undefined);
      class BoxGroup {
        get boxCount() {
          return this.endIndex - this.fromIndex + 1;
        }
        constructor(fromIndex, endIndex, groupKey) {
          this.fromIndex = void 0;
          this.endIndex = void 0;
          this.groupKey = void 0;
          this.fromIndex = fromIndex;
          this.endIndex = endIndex;
          this.groupKey = groupKey;
        }
      }
      exports('BoxGroup', BoxGroup);
      class StageData {
        constructor(plainLevelData) {
          this._plainLevelData = void 0;
          this._columns = void 0;
          this._templateId = 0;
          this._isAlreadyWin = false;
          this._quest = 0;
          this._plainLevelData = plainLevelData;
          this.parsePlainLevelData();
        }
        get columns() {
          return this._columns;
        }
        get columnCount() {
          return this._columns.length;
        }
        get templateId() {
          return this._templateId;
        }
        get quest() {
          return this._quest;
        }
        parsePlainLevelData() {
          const plainData = this._plainLevelData;
          const rawData = plainData.raw;
          const columns = [];
          this._quest = plainData.quest;
          const mostCountInCol = rawData.reduce((acc, value) => Math.max(acc, value.length), 0);
          for (let i = 0; i < rawData.length; i++) {
            const column = new ColumnData();
            const datasInCol = rawData[i];
            for (let j = 0; j < datasInCol.length; j++) {
              let data = datasInCol[j];
              if (data > 0) {
                column.addBoxData(new BoxData(data));
              }
            }
            column.lockCount = datasInCol.reduce((acc, value) => acc + (value == -1 ? 1 : 0), 0);
            column.maxBoxCount = datasInCol.length;
            column.questCount = this._quest ? column.boxCount - 1 : 0;
            column.isCanReach = column.maxBoxCount == mostCountInCol;
            columns.push(column);
          }
          this._templateId = plainData.temp;
          this._columns = columns;
        }
        getColumnData(columnIndex) {
          return this._columns[columnIndex];
        }
        canJump(columnIndex) {
          const columnData = this.getColumnData(columnIndex);
          console.log('phiz:canJump:StageData', columnIndex, columnData.columnState);
          return columnData.columnState === ColumnState.IDLE || columnData.columnState === ColumnState.LANDING;
        }
        canLand(columnIndex) {
          const columnData = this.getColumnData(columnIndex);
          console.log('phiz:canLand:StageData', columnIndex, columnData.columnState);
          return columnData.columnState === ColumnState.JUMPING || columnData.columnState === ColumnState.FLOATING;
        }
        getTopBoxGroup(columnIndex, count = 0) {
          const columnData = this.getColumnData(columnIndex);
          const boxDatas = columnData.boxDatas;
          const questCount = columnData.questCount;
          if (boxDatas.length === 0) {
            return null;
          }

          // 从顶部开始获取盒子数据
          const topIndex = boxDatas.length - 1;
          let fromIndex = topIndex;
          let endIndex = topIndex;
          let groupKey = boxDatas[topIndex].key;
          if (count > 0) {
            // 当count大于0时，为回退操作，根据上一步的box数量进行移动
            fromIndex = endIndex - count + 1;
          } else {
            // 当count等于0时，为正常移动，根据实际成组的box数量进行移动
            for (let i = topIndex - 1; i >= 0; i--) {
              if (boxDatas[i].key === groupKey && i > questCount - 1) {
                fromIndex = i;
              } else {
                break;
              }
            }
          }
          return new BoxGroup(fromIndex, endIndex, groupKey);
        }
        isMatch(fromColumnIndex, toColumnIndex) {
          const fromColumnData = this.getColumnData(fromColumnIndex);
          const toColumnData = this.getColumnData(toColumnIndex);
          if (fromColumnData.columnState !== ColumnState.JUMPING && fromColumnData.columnState !== ColumnState.FLOATING) {
            return false;
          }
          if (toColumnData.columnState === ColumnState.JUMPING || toColumnData.columnState === ColumnState.FLOATING) {
            return false;
          }
          if (fromColumnData.boxCount === 0) {
            return false;
          }
          if (toColumnData.getEmptyCount() === 0) {
            return false;
          }
          if (toColumnData.boxCount === 0) {
            return true;
          }
          if (toColumnData.boxCount === toColumnData.maxBoxCount) {
            return false;
          }
          const fromBoxData = fromColumnData.boxDatas[fromColumnData.boxCount - 1];
          const toBoxData = toColumnData.boxDatas[toColumnData.boxCount - 1];
          if (!fromBoxData || !toBoxData) {
            return false;
          }
          return fromBoxData.key === toBoxData.key;
        }
        moveBox(fromColumnIndex, toColumnIndex) {
          const fromColumnData = this.getColumnData(fromColumnIndex);
          const toColumnData = this.getColumnData(toColumnIndex);
          const fromBoxData = fromColumnData.popBoxData();
          toColumnData.addBoxData(fromBoxData);
        }
        isReached(columnIndex) {
          const columnData = this.getColumnData(columnIndex);
          return columnData.columnState === ColumnState.REACHED;
        }
        isWin() {
          return this._columns.every(column => column.columnState === ColumnState.REACHED || column.isEmpty());
        }
        get alreadyWin() {
          return this._isAlreadyWin;
        }
        set alreadyWin(value) {
          this._isAlreadyWin = value;
        }
      }
      exports('StageData', StageData);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/stage-helper.ts", ['cc'], function (exports) {
  var cclegacy, director;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      director = module.director;
    }],
    execute: function () {
      cclegacy._RF.push({}, "fbab6VOXwdCW53mxDsKDemc", "stage-helper", undefined);
      let StageEvent = exports('StageEvent', /*#__PURE__*/function (StageEvent) {
        StageEvent["CLICK_DISABLE"] = "CLICK_DISABLE";
        StageEvent["CLICK_ENABLE"] = "CLICK_ENABLE";
        StageEvent["LEVEL_ENTER"] = "LEVEL_ENTER";
        return StageEvent;
      }({}));
      class StageHelper {
        static disableClick() {
          director.emit(StageEvent.CLICK_DISABLE);
        }
        static enableClick() {
          director.emit(StageEvent.CLICK_ENABLE);
        }
        static levelEnter(name) {
          director.emit(StageEvent.LEVEL_ENTER, name);
        }
      }
      exports('StageHelper', StageHelper);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/stage-logic.ts", ['cc', './log-util.ts', './ui-util.ts', './box-control.ts', './column-data.ts', './stage-constants.ts', './game-desk.ts', './bezier-util.ts', './box-pool.ts', './move-step.ts', './animate-canvas.ts', './game-constants.ts', './game-data-manager.ts', './audio-manager.ts', './report-agent.ts', './ui-manager.ts', './bridge-util.ts', './ui-config.ts'], function (exports) {
  var cclegacy, director, UITransform, Vec3, Tween, tween, v3, UIOpacity, LogUtil, UIUtil, BoxControl, ColumnState, StageConstants, GameDesk, BezierUtil, BoxPool, MoveStep, AnimateCanvas, GameEvent, AudioUrl, GameDataManager, AudioManager, ReportAgent, CustomReportEvent, UIManager, BridgeUtil, VibrationEffect, UIID;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      director = module.director;
      UITransform = module.UITransform;
      Vec3 = module.Vec3;
      Tween = module.Tween;
      tween = module.tween;
      v3 = module.v3;
      UIOpacity = module.UIOpacity;
    }, function (module) {
      LogUtil = module.LogUtil;
    }, function (module) {
      UIUtil = module.UIUtil;
    }, function (module) {
      BoxControl = module.BoxControl;
    }, function (module) {
      ColumnState = module.ColumnState;
    }, function (module) {
      StageConstants = module.StageConstants;
    }, function (module) {
      GameDesk = module.GameDesk;
    }, function (module) {
      BezierUtil = module.BezierUtil;
    }, function (module) {
      BoxPool = module.BoxPool;
    }, function (module) {
      MoveStep = module.MoveStep;
    }, function (module) {
      AnimateCanvas = module.AnimateCanvas;
    }, function (module) {
      GameEvent = module.GameEvent;
      AudioUrl = module.AudioUrl;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }, function (module) {
      AudioManager = module.AudioManager;
    }, function (module) {
      ReportAgent = module.ReportAgent;
      CustomReportEvent = module.CustomReportEvent;
    }, function (module) {
      UIManager = module.UIManager;
    }, function (module) {
      BridgeUtil = module.BridgeUtil;
      VibrationEffect = module.VibrationEffect;
    }, function (module) {
      UIID = module.UIID;
    }],
    execute: function () {
      cclegacy._RF.push({}, "c0f12HV2DZICYTPqSeBwi01", "stage-logic", undefined);
      class StageLogic {
        constructor(stageData, deskNode) {
          this._stageData = null;
          this._deskNode = null;
          this._lastFloatingColumnIndex = -1;
          this._moveSteps = [];
          this._gameOverStepCount = -1;
          this._gameOverReactionId = -1;
          this._stageData = stageData;
          this._deskNode = deskNode;
        }
        get stageData() {
          return this._stageData;
        }
        resetStage() {
          this._moveSteps = [];
          this._gameOverStepCount = -1;
          director.emit(GameEvent.MOVE_STEP_CHANGE, this._moveSteps.length);
          this._lastFloatingColumnIndex = -1;
          this._stageData.parsePlainLevelData();
          const animateCanvas = this.getAnimateCanvas();
          animateCanvas.clearAllAniBoxNode();
        }
        onColumnClick(columnIndex) {
          if (columnIndex == -1) {
            // 选中后点击空白处，取消选中
            if (this._lastFloatingColumnIndex !== -1) {
              this.actionLanding(this._lastFloatingColumnIndex);
            }
            return;
          }
          const columnData = this.getColumnData(columnIndex);
          if (columnData.columnState === ColumnState.PUBLISHING || columnData.columnState === ColumnState.REACHED) {
            LogUtil.log('onColumnClick:StageLogic can not click publishing or reached column:', columnIndex, "columnState:", columnData.columnState);
            return;
          }
          console.log('t123 onColumnClick:StageLogic this._lastFloatingColumnIndex:', this._lastFloatingColumnIndex, "columnIndex:", columnIndex);
          if (this._lastFloatingColumnIndex !== -1) {
            // 如果当前点击的column和上一次浮动的column相同，则不进行操作
            if (this._lastFloatingColumnIndex === columnIndex) {
              this.actionClickColumn(columnIndex);
              return;
            }

            // 如果当前点击的column和上一次浮动的column不同，则进行判断能否移动
            if (this.isMatch(this._lastFloatingColumnIndex, columnIndex)) {
              this.actionMoving(this._lastFloatingColumnIndex, columnIndex);
              this._lastFloatingColumnIndex = -1;
              if (this.isMoveEnd()) {
                this._gameOverStepCount = this._moveSteps.length + 1;
                clearTimeout(this._gameOverReactionId);
                this._gameOverReactionId = setTimeout(this.updateForMoveEnd.bind(this), GameDataManager.instance.mainConfig.game_over_reaction_time * 1000);
              }
            } else {
              this.actionLanding(this._lastFloatingColumnIndex);
              this.actionClickColumn(columnIndex);
            }
          } else {
            this.actionClickColumn(columnIndex);
          }
        }
        getColumnControl(columnIndex) {
          return this._deskNode.getComponent(GameDesk).getColumnControl(columnIndex);
        }
        getColumnData(columnIndex) {
          return this._stageData.columns[columnIndex];
        }
        getBoxNode(columnIndex, boxIndex) {
          let column = this.getColumnControl(columnIndex);
          if (column) {
            return column.getBoxNode(boxIndex);
          } else {
            console.error('can not find column', columnIndex);
            return null;
          }
        }
        getBoxWrapNode(columnIndex, boxIndex) {
          return this.getColumnControl(columnIndex).getBoxWrapNode(boxIndex);
        }
        getBoxData(columnIndex, boxIndex) {
          return this.getColumnData(columnIndex).getBoxData(boxIndex);
        }
        actionClickColumn(columnIndex) {
          console.log('t123 actionClickColumn:StageLogic, columnIndex:', columnIndex);
          if (this.stageData.canJump(columnIndex)) {
            console.log('t123 actionClickColumn:StageLogic can jump, columnIndex:', columnIndex);
            this.actionJump(columnIndex);
            this._lastFloatingColumnIndex = columnIndex;
          } else if (this.stageData.canLand(columnIndex)) {
            this.actionLanding(columnIndex);
            this._lastFloatingColumnIndex = -1;
          } else {
            console.log('t123 actionClickColumn:StageLogic can not jump or land. columnIndex:', columnIndex);
            this._lastFloatingColumnIndex = -1;
          }
        }
        getLastFloatingColumnIndex() {
          return this._lastFloatingColumnIndex;
        }
        getLastFloatingColumnData() {
          return this.getColumnData(this._lastFloatingColumnIndex);
        }
        isMatch(fromColumnIndex, toColumnIndex) {
          return this.stageData.isMatch(fromColumnIndex, toColumnIndex);
        }
        actionJump(columnIndex) {
          console.log('actionJump:StageLogic', columnIndex);
          const columnData = this.getColumnData(columnIndex);
          if (columnData.columnState === ColumnState.JUMPING) {
            return;
          }
          return new Promise(async (resolve, reject) => {
            const topBoxGroup = this.stageData.getTopBoxGroup(columnIndex);
            if (!topBoxGroup) {
              // 点击空列
              columnData.setColumnState(ColumnState.IDLE);
              resolve();
              return;
            }
            AudioManager.instance.playEffect(AudioUrl.MOVE_BOX_START);
            BridgeUtil.vibrate(30, VibrationEffect.TICK);
            columnData.setColumnState(ColumnState.JUMPING);
            const promises = [];
            for (let i = topBoxGroup.fromIndex; i <= topBoxGroup.endIndex; i++) {
              promises.push(this.animateJumping(columnIndex, i, StageConstants.JUMP_DISTANCE));
            }
            await Promise.all(promises);
            columnData.setColumnState(ColumnState.FLOATING);
            resolve();
          });
        }
        actionLanding(columnIndex) {
          const columnData = this.getColumnData(columnIndex);
          if (columnData.columnState === ColumnState.LANDING) {
            return;
          }
          return new Promise(async (resolve, reject) => {
            const topBoxGroup = this.stageData.getTopBoxGroup(columnIndex);
            if (!topBoxGroup) {
              columnData.setColumnState(ColumnState.IDLE);
              resolve();
              return;
            }
            columnData.setColumnState(ColumnState.LANDING);
            const promises = [];
            for (let i = topBoxGroup.fromIndex; i <= topBoxGroup.endIndex; i++) {
              promises.push(this.animateLanding(columnIndex, i));
            }
            await Promise.all(promises);
            columnData.setColumnState(ColumnState.IDLE);
            resolve();
          });
        }
        moveBox(fromColumnIndex, toColumnIndex) {
          const fromColumnData = this.getColumnData(fromColumnIndex);
          const toColumnData = this.getColumnData(toColumnIndex);
          const fromBoxNode = this.getBoxNode(fromColumnIndex, fromColumnData.boxCount - 1);
          const toBoxWrapNode = this.getBoxWrapNode(toColumnIndex, toColumnData.boxCount);
          fromBoxNode.removeFromParent();
          fromBoxNode.parent = toBoxWrapNode;
          fromBoxNode.active = false;
          this.stageData.moveBox(fromColumnIndex, toColumnIndex);
        }
        actionMoving(fromColumnIndex, toColumnIndex, count = 0) {
          console.log('actionMoving:StageLogic', fromColumnIndex, toColumnIndex);
          const fromColumnData = this.getColumnData(fromColumnIndex);
          const toColumnData = this.getColumnData(toColumnIndex);
          const toColumnEmptyCount = toColumnData.getEmptyCount();
          if (toColumnEmptyCount === 0) {
            return;
          }
          if (GameDataManager.instance.localData.isFirstMoveBox) {
            GameDataManager.instance.localData.isFirstMoveBox = false;
            ReportAgent.reportCustomEvent(CustomReportEvent.USER_LIFECYCLE_MILESTONE, {
              action: 'face_move'
            });
          }
          if (GameDataManager.instance.gameData.level == 2 && GameDataManager.instance.localData.isFirstMoveBoxInLv2) {
            GameDataManager.instance.localData.isFirstMoveBoxInLv2 = false;
            ReportAgent.reportCustomEvent(CustomReportEvent.USER_LIFECYCLE_MILESTONE, {
              action: 'face_move_two'
            });
          }
          return new Promise(async (resolve, reject) => {
            const fromTopBoxGroup = this.stageData.getTopBoxGroup(fromColumnIndex, count);
            if (!fromTopBoxGroup) {
              fromColumnData.setColumnState(ColumnState.IDLE);
              resolve();
              return;
            }
            if (fromTopBoxGroup.boxCount > toColumnEmptyCount) {
              fromColumnData.setColumnState(ColumnState.LANDING);
            } else {
              fromColumnData.setColumnState(ColumnState.IDLE);
            }
            toColumnData.setColumnState(ColumnState.MOVING);
            toColumnData.addMoveInFromColumnIndex(fromColumnIndex);
            let targetIndex = toColumnData.boxCount;
            const promises = [];
            let indexInSequence = 0;
            for (let i = fromTopBoxGroup.endIndex; i >= fromTopBoxGroup.fromIndex; i--) {
              if (targetIndex < toColumnData.maxBoxCount && toColumnData.getEmptyCount() > 0) {
                this.moveBox(fromColumnIndex, toColumnIndex);
                promises.push(this.animateMoving(fromColumnIndex, i, toColumnIndex, targetIndex++, indexInSequence++));
              } else {
                promises.push(this.animateLanding(fromColumnIndex, i).then(() => {
                  fromColumnData.setColumnState(ColumnState.IDLE);
                }));
              }
            }
            if (fromColumnData.columnState !== ColumnState.LANDING) {
              promises.push(this.publishQuest(fromColumnIndex, true));
            }
            await Promise.all(promises);
            console.log(`mix10 all moving finish fromColumnIndex:${fromColumnIndex}, toColumnIndex:${toColumnIndex}`);
            this.addMoveStep(fromColumnIndex, toColumnIndex, fromTopBoxGroup.boxCount);
            toColumnData.removeMoveInFromColumnIndex(fromColumnIndex);
            if (!toColumnData.hasMoveInFromOtherColumn()) {
              if (toColumnData.isReached()) {
                console.log(`mix10 toColumnData isReached toColumnIndex:${toColumnIndex}`);
                this.actionReach(toColumnIndex);
                this.showReachEffect();
              } else {
                toColumnData.setColumnState(ColumnState.IDLE);
              }
            }
            console.log(`t123 actionMoving:StageLogic fromColumnIndex:${fromColumnIndex}, fromColumnData.columnState:${fromColumnData.columnState}, toColumnIndex:${toColumnIndex}, toColumnData.columnState:${toColumnData.columnState}`);
            resolve();
          });
        }
        actionReach(columnIndex) {
          const columnData = this.getColumnData(columnIndex);
          columnData.setColumnState(ColumnState.REACHED);
          if (GameDataManager.instance.localData.isFirstCompleteColumn) {
            GameDataManager.instance.localData.isFirstCompleteColumn = false;
            ReportAgent.reportCustomEvent(CustomReportEvent.USER_LIFECYCLE_MILESTONE, {
              action: 'face_finish'
            });
          }
          if (GameDataManager.instance.gameData.level == 2 && GameDataManager.instance.localData.isFirstCompleteColumnInLv2) {
            GameDataManager.instance.localData.isFirstCompleteColumnInLv2 = false;
            ReportAgent.reportCustomEvent(CustomReportEvent.USER_LIFECYCLE_MILESTONE, {
              action: 'face_finish_two'
            });
          }
          return new Promise(async (resolve, reject) => {
            const promises = [];
            for (let i = 0; i < columnData.boxCount; i++) {
              promises.push(this.animateReach(columnIndex, i));
            }
            let reachColor = this.getBoxData(columnIndex, 0);
            await Promise.all(promises);
            await this.getColumnControl(columnIndex).setReached(reachColor.key);
            this.checkWin();
            resolve();
          });
        }
        animateReach(columnIndex, boxIndex) {
          const boxData = this.getBoxData(columnIndex, boxIndex);
          const boxNode = this.getBoxNode(columnIndex, boxIndex);
          boxNode.active = false;
          const animateCanvas = this.getAnimateCanvas();
          const aniNode = animateCanvas.getAnimateBoxNode(boxData, boxNode);
          if (!aniNode) {
            return Promise.resolve();
          }
          AudioManager.instance.playEffect(AudioUrl.COLUMN_COMPLETED);
          BridgeUtil.vibrate(30, VibrationEffect.TICK);
          return new Promise((resolve, reject) => {
            aniNode.getComponent(BoxControl).doAniReach(boxIndex).then(() => {
              boxNode.getComponent(UITransform).priority = -1;
              boxNode.active = true;
              boxNode.getComponent(BoxControl).setBoxReach();
              resolve();
              BoxPool.instance.putNode(aniNode);
            });
          });
        }
        animateJumping(columnIndex, boxIndex, distance) {
          const boxData = this.getBoxData(columnIndex, boxIndex);
          const boxNode = this.getBoxNode(columnIndex, boxIndex);
          boxNode.active = false;
          const animateCanvas = this.getAnimateCanvas();
          const aniNode = animateCanvas.getAnimateBoxNode(boxData, boxNode);
          if (!aniNode) {
            return Promise.resolve();
          }
          const fromPosInCanvas = aniNode.position;
          const toPosInCanvas = new Vec3(fromPosInCanvas.x, fromPosInCanvas.y + distance, 0);
          aniNode.position = fromPosInCanvas;
          const promise = new Promise((resolve, reject) => {
            Tween.stopAllByTarget(aniNode);
            tween(aniNode).call(() => {
              aniNode.getComponent(BoxControl).doAniJumping();
            }).delay(0.1).to(0.166, {
              position: toPosInCanvas,
              scale: v3(1.2, 1.2, 1)
            }).call(() => {
              aniNode.getComponent(BoxControl).doAniPickUp();
              resolve();
            }).start();
          });
          return promise;
        }
        animateLanding(columnIndex, boxIndex) {
          const boxData = this.getBoxData(columnIndex, boxIndex);
          const boxNode = this.getBoxNode(columnIndex, boxIndex);
          const animateCanvas = this.getAnimateCanvas();
          const aniNode = animateCanvas.getAnimateBoxNode(boxData, boxNode);
          if (!aniNode) {
            return Promise.resolve();
          }
          const targetPosInCanvas = animateCanvas.convertToCanvasPosition(boxNode.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0)));
          const promise = new Promise((resolve, reject) => {
            Tween.stopAllByTarget(aniNode);
            tween(aniNode).call(() => {
              aniNode.getComponent(BoxControl).doAniLanding();
            }).delay(0.1).to(UIUtil.calcMoveDuration(aniNode.position, targetPosInCanvas), {
              position: targetPosInCanvas,
              scale: v3(1, 1, 1)
            }).call(() => {
              boxNode.active = true;
              resolve();
              BoxPool.instance.putNode(aniNode);
            }).start();
          });
          return promise;
        }

        // 数据与动画分离，所以进入animateMoving时，数据和节点node已经添加到了目标位置
        animateMoving(fromColumnIndex, fromBoxIndex, toColumnIndex, toBoxIndex, indexInSequence) {
          const animateCanvas = this.getAnimateCanvas();
          const fromBoxWrapNode = this.getBoxWrapNode(fromColumnIndex, fromBoxIndex);
          const boxData = this.getBoxData(toColumnIndex, toBoxIndex);
          const boxNode = this.getBoxNode(toColumnIndex, toBoxIndex);
          if (!boxNode || !boxNode || !boxNode.isValid) {
            LogUtil.error('animateMoving:StageLogic can not find boxNode', toColumnIndex, toBoxIndex);
            return Promise.resolve();
          }
          const aniNode = animateCanvas.getAnimateBoxNode(boxData, fromBoxWrapNode);
          if (!aniNode) {
            return Promise.resolve();
          }
          const fromPosInCanvas = aniNode.position;
          const toBoxWrapNode = this.getBoxWrapNode(toColumnIndex, toBoxIndex);
          const toPosInCanvas = animateCanvas.convertToCanvasPosition(toBoxWrapNode.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0)));
          const fromColumnControl = this.getColumnControl(fromColumnIndex);
          const toColumnControl = this.getColumnControl(toColumnIndex);
          const fromColumnTopY = fromColumnControl.getDistanceAbovePointWorldPosition(StageConstants.JUMP_DISTANCE).y;
          const toColumnTopY = toColumnControl.getDistanceAbovePointWorldPosition(StageConstants.JUMP_DISTANCE).y;
          const fromColumnTopYInCanvas = animateCanvas.convertToCanvasPosition(v3(0, fromColumnTopY, 0)).y;
          const toColumnTopYInCanvas = animateCanvas.convertToCanvasPosition(v3(0, toColumnTopY, 0)).y;
          const fromTopPos = new Vec3(fromPosInCanvas.x, Math.max(fromColumnTopYInCanvas, toColumnTopYInCanvas), 0);
          const toTopPos = new Vec3(toPosInCanvas.x, Math.max(fromColumnTopYInCanvas, toColumnTopYInCanvas), 0);
          const distanceX = Math.abs(toPosInCanvas.x - fromPosInCanvas.x);
          // 计算贝塞尔曲线的控制点
          const controlPoint1 = new Vec3(fromTopPos.x, fromTopPos.y + distanceX / 2, 0);
          const controlPoint2 = new Vec3(toTopPos.x, toTopPos.y + distanceX / 2, 0);
          const duration1 = UIUtil.calcMoveDuration(fromPosInCanvas, fromTopPos, StageConstants.MOVE_SPEED * 3);
          const duration2 = BezierUtil.calculateCubicBezierMoveDuration(fromTopPos, controlPoint1, controlPoint2, toTopPos);
          // 下落时间
          const duration3 = UIUtil.calcMoveDuration(toTopPos, toPosInCanvas, StageConstants.MOVE_SPEED * 3);
          return new Promise((resolve, reject) => {
            Tween.stopAllByTarget(aniNode);
            tween(aniNode).delay(indexInSequence * 0.02).to(duration1, {
              position: fromTopPos
            }).to(duration2, {}, {
              onUpdate: (target, ratio) => {
                const pos = BezierUtil.calculateCubicBezierPoint(fromTopPos, controlPoint1, controlPoint2, toTopPos, ratio);
                target.position = pos;
              }
            }).to(duration3, {
              position: toPosInCanvas
            }).call(() => {
              console.log("mix10 animateMoving call aniNode name :", aniNode.name);
              boxNode.active = true;
              resolve();
              BoxPool.instance.putNode(aniNode);
            }).start();
          });
        }
        async unLockColumn() {
          const lastColumnIndex = this.stageData.columnCount - 1;
          const lastColumnData = this.getColumnData(lastColumnIndex);
          if (lastColumnData.lockCount <= 0) {
            lastColumnData.lockCount = 0;
            return false;
          }
          lastColumnData.lockCount -= 1;
          await this.actionUnLockColumn(lastColumnIndex);
          return true;
        }
        actionUnLockColumn(columnIndex) {
          const control = this.getColumnControl(columnIndex);
          return control.actionUnLock();
        }
        actionPublishQuest() {
          const promises = [];
          for (let i = 0; i < this.stageData.columnCount; i++) {
            promises.push(this.publishQuest(i));
          }
          if (promises.length === 0) {
            UIManager.instance.showToast("No blocks to view.");
            return Promise.resolve();
          }
          return new Promise((resolve, reject) => {
            Promise.all(promises).then(() => {
              resolve();
            });
          });
        }
        async publishQuest(columnIndex, justTop = false) {
          const columnData = this.getColumnData(columnIndex);
          if (columnData.questCount > 0) {
            const control = this.getColumnControl(columnIndex);
            const unQuestBoxIndex = columnData.questCount - 1;
            const topBoxIndex = columnData.boxCount - 1;
            if (justTop) {
              if (unQuestBoxIndex != topBoxIndex) {
                return Promise.resolve();
              }
            }
            columnData.publishQuest();
            if (unQuestBoxIndex >= 0) {
              const unQuestBoxNode = control.getBoxNode(unQuestBoxIndex);
              columnData.setColumnState(ColumnState.PUBLISHING);
              return new Promise(async (resolve, reject) => {
                await unQuestBoxNode.getComponent(BoxControl).doAniPublishQuest();
                columnData.setColumnState(ColumnState.IDLE);
                resolve();
              });
            }
          }
          return Promise.resolve();
        }
        addMoveStep(fromColumnIndex, toColumnIndex, boxCount) {
          this._moveSteps.push(new MoveStep(fromColumnIndex, toColumnIndex, boxCount));
          director.emit(GameEvent.MOVE_STEP_CHANGE, this._moveSteps.length);
          BridgeUtil.vibrate(30, VibrationEffect.TICK);
          switch (boxCount) {
            case 1:
              {
                AudioManager.instance.playEffect(AudioUrl.MOVE_BOX_END_1);
                break;
              }
            case 2:
              {
                AudioManager.instance.playEffect(AudioUrl.MOVE_BOX_END_2);
                break;
              }
            default:
              {
                AudioManager.instance.playEffect(AudioUrl.MOVE_BOX_END_3);
              }
              break;
          }
        }
        async actionBackMove() {
          const lastMoveStep = this._moveSteps.pop();
          if (!lastMoveStep) {
            return Promise.resolve(false);
          }
          director.emit(GameEvent.MOVE_STEP_CHANGE, this._moveSteps.length);
          const fromColumnData = this.getColumnData(lastMoveStep.fromColumnIndex);
          const toColumnData = this.getColumnData(lastMoveStep.toColumnIndex);
          if (fromColumnData.columnState === ColumnState.REACHED || toColumnData.columnState === ColumnState.REACHED) {
            LogUtil.log('actionBackMove:StageLogic fromColumnData or toColumnData is reached', lastMoveStep.fromColumnIndex, lastMoveStep.toColumnIndex, lastMoveStep.boxCount);
            return Promise.resolve(false);
          }
          if (fromColumnData.columnState === ColumnState.MOVING || toColumnData.columnState === ColumnState.MOVING) {
            LogUtil.log('actionBackMove:StageLogic fromColumnData or toColumnData is moving', lastMoveStep.fromColumnIndex, lastMoveStep.toColumnIndex, lastMoveStep.boxCount);
            return Promise.resolve(false);
          }
          if (fromColumnData.columnState === ColumnState.JUMPING || toColumnData.columnState === ColumnState.JUMPING) {
            LogUtil.log('actionBackMove:StageLogic fromColumnData or toColumnData is jumping', lastMoveStep.fromColumnIndex, lastMoveStep.toColumnIndex, lastMoveStep.boxCount);
            return Promise.resolve(false);
          }
          const landingPromises = [];
          if (fromColumnData.columnState === ColumnState.FLOATING) {
            landingPromises.push(this.actionLanding(lastMoveStep.fromColumnIndex));
          }
          if (toColumnData.columnState === ColumnState.FLOATING) {
            landingPromises.push(this.actionLanding(lastMoveStep.toColumnIndex));
          }
          await Promise.all(landingPromises);
          const movePromises = [];
          for (let i = 0; i < lastMoveStep.boxCount; i++) {
            const backMoveFromColumnIndex = lastMoveStep.toColumnIndex;
            const backMoveToColumnIndex = lastMoveStep.fromColumnIndex;
            movePromises.push(this.actionMoving(backMoveFromColumnIndex, backMoveToColumnIndex, lastMoveStep.boxCount));
          }
          await Promise.all(movePromises);
          return new Promise((resolve, reject) => {
            resolve(true);
          });
        }
        getAnimateCanvas() {
          return this._deskNode.getChildByName("animate_canvas").getComponent(AnimateCanvas);
        }
        async levelStartAnimation() {
          const animateCanvas = this.getAnimateCanvas();
          animateCanvas.clearAllAniBoxNode();
          const promises = [];
          for (let i = 0; i < this.stageData.columnCount; i++) {
            const columnData = this.getColumnData(i);
            const columnControl = this.getColumnControl(i);
            for (let j = 0; j < columnData.boxCount; j++) {
              const boxData = columnData.getBoxData(j);
              const boxNode = this.getBoxNode(i, j);
              if (!boxNode) {
                console.error('can not find boxNode', i, j);
              }
              boxNode.active = false;
              const aniNode = animateCanvas.getAnimateBoxNode(boxData, boxNode);
              if (!aniNode) {
                LogUtil.error('levelStartAnimation:StageLogic can not find aniNode', i, j);
                continue;
              }
              aniNode.scale = v3(0.1, 0.1, 1);
              aniNode.getComponent(UIOpacity).opacity = 0;
              const startPos = animateCanvas.convertToCanvasPosition(columnControl.getDistanceAbovePointWorldPosition(StageConstants.LEVEL_START_ABOVE_DISTANCE));
              aniNode.position = startPos;
              const nodePos = boxNode.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0));
              const endPos = animateCanvas.convertToCanvasPosition(nodePos);
              const distance = Math.abs(endPos.y - startPos.y);
              const duration = distance / StageConstants.MOVE_SPEED;
              const promise = new Promise((resolve, reject) => {
                tween(aniNode).delay(j * 0.1).call(() => {
                  aniNode.getComponent(UIOpacity).opacity = 255;
                }).to(0.1, {
                  scale: v3(1, 1, 1)
                }).to(duration, {
                  position: endPos
                }).call(() => {
                  aniNode.active = false;
                  boxNode.active = true;
                  resolve();
                  BoxPool.instance.putNode(aniNode);
                }).start();
              });
              promises.push(promise);
            }
          }
          if (promises.length === 0) {
            return Promise.resolve();
          }
          await Promise.all(promises);
          AudioManager.instance.playEffect(AudioUrl.MOVE_BOX_END_3);
          return Promise.resolve();
        }
        checkWin() {
          if (this.isWin() && !this._stageData.alreadyWin) {
            this._stageData.alreadyWin = true;
            director.emit(GameEvent.GAME_WIN);
          }
        }
        isWin() {
          return this._stageData.isWin();
        }
        isMoveEnd() {
          let columns = this.stageData.columns;

          //has empty column
          let hasEmpty = columns.some(columnData => {
            return columnData.isEmpty() && !columnData.isLocked;
          });
          if (hasEmpty) {
            return false;
          }

          //get all top box
          let topGroups = [];
          for (let i = 0; i < columns.length; ++i) {
            if (columns[i].isEmpty()) {
              continue;
            }
            let topGroup = this.stageData.getTopBoxGroup(i);
            if (topGroup) {
              topGroups.push(topGroup);
            }
          }

          //has same box and has enough space
          for (let i = 0; i < topGroups.length; ++i) {
            for (let j = 0; j < topGroups.length; ++j) {
              if (i == j) {
                continue;
              }
              if (topGroups[i].boxCount > 0 && topGroups[j].boxCount > 0) {
                if (topGroups[i].groupKey == topGroups[j].groupKey) {
                  if (columns[j].availableCount >= topGroups[i].boxCount) {
                    return false;
                  } else if (columns[i].availableCount >= topGroups[j].boxCount) {
                    return false;
                  }
                }
              }
            }
          }
          return true;
        }
        updateForMoveEnd() {
          if (this._gameOverStepCount == this._moveSteps.length) {
            // show tool popup
            UIManager.instance.open(UIID.MoveEndPopup);
          }
        }
        showReachEffect() {
          this._deskNode.getComponent(GameDesk).showColumnReachLight();
        }
      }
      exports('StageLogic', StageLogic);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/stage.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './game-desk.ts', './stage-helper.ts', './ui-manager.ts', './ui-config.ts', './audio-manager.ts', './game-constants.ts', './game-data-manager.ts', './report-agent.ts', './mount-manager.ts', './mount-point.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, Label, Sprite, _decorator, Component, director, UIOpacity, sp, Color, tween, GameDesk, StageEvent, UIManager, UICF, UIID, AudioManager, GameEvent, AudioUrl, GameDataManager, ReportAgent, CustomReportEvent, LoadingActionParam, MountManager, MountPoint;
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
      Component = module.Component;
      director = module.director;
      UIOpacity = module.UIOpacity;
      sp = module.sp;
      Color = module.Color;
      tween = module.tween;
    }, function (module) {
      GameDesk = module.GameDesk;
    }, function (module) {
      StageEvent = module.StageEvent;
    }, function (module) {
      UIManager = module.UIManager;
    }, function (module) {
      UICF = module.UICF;
      UIID = module.UIID;
    }, function (module) {
      AudioManager = module.AudioManager;
    }, function (module) {
      GameEvent = module.GameEvent;
      AudioUrl = module.AudioUrl;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }, function (module) {
      ReportAgent = module.ReportAgent;
      CustomReportEvent = module.CustomReportEvent;
      LoadingActionParam = module.LoadingActionParam;
    }, function (module) {
      MountManager = module.MountManager;
    }, function (module) {
      MountPoint = module.MountPoint;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6;
      cclegacy._RF.push({}, "edf92Lt2EhOmJgPdXVkr5LO", "stage", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let Stage = exports('Stage', (_dec = ccclass('stage'), _dec2 = property(Node), _dec3 = property(GameDesk), _dec4 = property(Node), _dec5 = property(Label), _dec6 = property(Node), _dec7 = property(Sprite), _dec(_class = (_class2 = class Stage extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "clickBlockNode", _descriptor, this);
          _initializerDefineProperty(this, "gameDesk", _descriptor2, this);
          _initializerDefineProperty(this, "aniEnterNode", _descriptor3, this);
          _initializerDefineProperty(this, "lblLv", _descriptor4, this);
          _initializerDefineProperty(this, "constNode", _descriptor5, this);
          _initializerDefineProperty(this, "bgSpr", _descriptor6, this);
        }
        onLoad() {
          director.on(StageEvent.CLICK_DISABLE, this.diableClick, this);
          director.on(StageEvent.CLICK_ENABLE, this.enableClick, this);
          director.on(StageEvent.LEVEL_ENTER, this.animateLevelEnter, this);
          director.on(GameEvent.INTRODUCTION_VIEW_CLOSE, this.openGame, this);
          this.node.on(Node.EventType.TOUCH_START, this.onClickCanvas, this);
        }
        onDestroy() {
          director.off(StageEvent.CLICK_DISABLE, this.diableClick, this);
          director.off(StageEvent.CLICK_ENABLE, this.enableClick, this);
          director.off(StageEvent.LEVEL_ENTER, this.animateLevelEnter, this);
          director.off(GameEvent.INTRODUCTION_VIEW_CLOSE, this.openGame, this);
          this.node.off(Node.EventType.TOUCH_START, this.onClickCanvas, this);
        }
        start() {
          MountManager.instance.notify(MountPoint.StageInitUIConf, UICF);
          UIManager.instance.initUIConf(UICF);
          UIManager.instance.updateLayers();

          // if (GameDataManager.instance.localData.firstLogin) {
          //     UIManager.instance.open(UIID.IntroductionView);
          //     GameDataManager.instance.localData.firstLogin = false;
          //     this.gameDesk.node.active = false;
          //     this.gameDesk.node.getComponent(UIOpacity).opacity = 0;
          // } else {
          //     this.openGame();
          // }

          this.openGame();
          if (GameDataManager.instance.localData.isFirstEnterGame) {
            GameDataManager.instance.localData.isFirstEnterGame = false;
            ReportAgent.reportCustomEvent(CustomReportEvent.USER_LIFECYCLE_MILESTONE, {
              action: 'game_start'
            });
          }
          ReportAgent.reportLoadingAction(LoadingActionParam.LOGIN);
          MountManager.instance.notify(MountPoint.NotifyWebContReady, {
            node: this.constNode
          });
        }
        update(deltaTime) {}
        openGame() {
          this.gameDesk.node.active = true;
          this.gameDesk.node.getComponent(UIOpacity).opacity = 255;
          UIManager.instance.open(UIID.MainView);
        }
        diableClick() {
          this.clickBlockNode.active = true;
        }
        enableClick() {
          this.clickBlockNode.active = false;
        }
        animateLevelEnter(stageTyep) {
          this.aniEnterNode.active = true;
          this.aniEnterNode.getComponent(UIOpacity).opacity = 255;
          const skeleton = this.aniEnterNode.getChildByName("skeleton").getComponent(sp.Skeleton);
          let audioMgr = AudioManager.instance;
          switch (stageTyep) {
            case 'normal':
              skeleton.setAnimation(0, "level", false);
              this.lblLv.color = new Color().fromHEX("#FFD58E");
              this.lblLv.shadowColor = new Color().fromHEX("#D18003");
              this.lblLv.outlineColor = new Color().fromHEX("#290505");
              audioMgr.playEffect(AudioUrl.STAGE_START);
              this.lblLv.string = `Level ${GameDataManager.instance.gameData.level}`;
              break;
            case 'special':
              skeleton.setAnimation(0, "special level", false);
              this.lblLv.color = new Color().fromHEX("#E2BCFF");
              this.lblLv.shadowColor = new Color().fromHEX("#290505");
              this.lblLv.outlineColor = new Color().fromHEX("#A940FC");
              audioMgr.playEffect(AudioUrl.SPECIAL_STAGE_START);
              this.lblLv.string = `Special Level`;
              break;
            case 'boss':
              skeleton.setAnimation(0, "hard level", false);
              this.lblLv.color = new Color().fromHEX("#FF7C7E");
              this.lblLv.shadowColor = new Color().fromHEX("#290505");
              this.lblLv.outlineColor = new Color().fromHEX("#B52E1F");
              audioMgr.playEffect(AudioUrl.HARD_STAGE_START);
              this.lblLv.string = `Hard Level`;
              break;
          }
          this.scheduleOnce(() => {
            tween(this.aniEnterNode.getComponent(UIOpacity)).to(0.2, {
              opacity: 255
            }).call(() => {
              this.aniEnterNode.active = false;
              // this.enableClick();
            }).start();
          }, 2.0);
        }
        onClickCanvas() {
          director.emit(GameEvent.CLICK_STAGE_CANVAS);
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "clickBlockNode", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "gameDesk", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "aniEnterNode", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "lblLv", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "constNode", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "bgSpr", [_dec7], {
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

System.register("chunks:///_virtual/storage-agent.ts", ['cc', './random-util.ts'], function (exports) {
  var cclegacy, sys, RandomUtil;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      sys = module.sys;
    }, function (module) {
      RandomUtil = module.RandomUtil;
    }],
    execute: function () {
      cclegacy._RF.push({}, "b3e542Uts5CMaGlQrne5iZ1", "storage-agent", undefined);
      class StorageAgent {
        static getUid() {
          var uid = sys.localStorage.getItem("uid");
          if (!uid) {
            uid = this.generateUid();
            sys.localStorage.setItem("uid", uid);
          }
          return uid;
        }
        static generateUid() {
          return RandomUtil.random(32);
        }
        static save(key, value) {
          localStorage.setItem(key, JSON.stringify(value));
        }
        static load(key) {
          const value = localStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        }
      }
      exports('StorageAgent', StorageAgent);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/storage-data.ts", ['cc', './object-util.ts', './storage-agent.ts'], function (exports) {
  var cclegacy, ObjectUtil, StorageAgent;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      ObjectUtil = module.ObjectUtil;
    }, function (module) {
      StorageAgent = module.StorageAgent;
    }],
    execute: function () {
      cclegacy._RF.push({}, "e6990KFu6pCQIFGHVJoVSCM", "storage-data", undefined);
      class StorageData {
        constructor() {}
        static getClassName() {
          return this.name;
        }
        getInstanceClassName() {
          return this.constructor.name;
        }
        saveToLocal() {
          const storageKey = this.getInstanceClassName();
          console.log("saveToLocal storageKey: ", storageKey);
          StorageAgent.save(storageKey, this);
        }
        loadFromLocal() {
          const storageKey = this.getInstanceClassName();
          console.log("loadFromLocal storageKey: ", storageKey);
          const plainData = StorageAgent.load(storageKey);
          if (plainData) {
            const newInstance = ObjectUtil.fromPlain(this.constructor, plainData);
            Object.assign(this, newInstance);
          }
        }
      }
      exports('StorageData', StorageData);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/storage-manager.ts", ['cc', './random-util.ts', './log-util.ts'], function (exports) {
  var cclegacy, sys, RandomUtil, LogUtil;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      sys = module.sys;
    }, function (module) {
      RandomUtil = module.RandomUtil;
    }, function (module) {
      LogUtil = module.LogUtil;
    }],
    execute: function () {
      cclegacy._RF.push({}, "6804daDFbROUYWm07uOrAS7", "storage-manager", undefined);
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
          return RandomUtil.random(32);
        }
        getJson(key, defaultValue) {
          try {
            const r = this.get(key);
            LogUtil.log("getJson", key, r);
            return r && JSON.parse(r) || defaultValue;
          } catch (error) {
            LogUtil.error("getJson error", key, error);
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

System.register("chunks:///_virtual/streak-anim-star.ts", ['cc', './game-data-manager.ts'], function (exports) {
  var cclegacy, Component, sp, Label, Sprite, _decorator, GameDataManager;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      sp = module.sp;
      Label = module.Label;
      Sprite = module.Sprite;
      _decorator = module._decorator;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "e9271c7u6FDgbHtkrRRIwC1", "streak-anim-star", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let StreakAnimStar = exports('StreakAnimStar', (_dec = ccclass('StreakAnimStar'), _dec(_class = class StreakAnimStar extends Component {
        constructor(...args) {
          super(...args);
          this.skeleton = null;
          this.lblStreak = null;
          this.sprStar = null;
        }
        onLoad() {
          this.skeleton = this.getComponentInChildren(sp.Skeleton);
          this.lblStreak = this.getComponentInChildren(Label);
          this.sprStar = this.getComponentInChildren(Sprite);
        }
        set streak(val) {
          this.lblStreak.string = val.toString();
          if (GameDataManager.instance.gameData.winStreakNum === 0) {
            this.skeleton.node.active = false;
            this.sprStar.node.active = true;
          } else {
            this.skeleton.node.active = true;
            this.sprStar.node.active = false;
            let stage = GameDataManager.instance.getWinStreakRewardStage(val);
            switch (stage) {
              case 1:
                this.skeleton.setSkin(`idle2`);
                break;
              case 2:
                this.skeleton.setSkin(`idle3`);
                break;
              case 3:
                this.skeleton.setSkin(`idle4`);
                break;
              case 4:
                this.skeleton.setSkin(`idle5`);
                break;
              default:
                this.skeleton.setSkin(`idle6`);
                break;
            }
            this.skeleton.setAnimation(0, 'level wine_idle', true);
          }
        }
      }) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/streak-star.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './game-data-manager.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Label, Sprite, SpriteFrame, _decorator, Component, GameDataManager;
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
      Component = module.Component;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3;
      cclegacy._RF.push({}, "ee74ekznq9A4b0KR5SerFWM", "streak-star", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let StreakStar = exports('StreakStar', (_dec = ccclass('StreakStar'), _dec2 = property(Label), _dec3 = property(Sprite), _dec4 = property([SpriteFrame]), _dec(_class = (_class2 = class StreakStar extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "lblStreak", _descriptor, this);
          _initializerDefineProperty(this, "sprStar", _descriptor2, this);
          _initializerDefineProperty(this, "starFrames", _descriptor3, this);
        }
        set streak(val) {
          this.lblStreak.string = val.toString();
          let stage = GameDataManager.instance.getWinStreakRewardStage(val);
          let frame = this.starFrames[stage];
          if (frame) {
            this.sprStar.spriteFrame = frame;
          } else {
            console.log('StarFrame is null, stage:', stage, 'streak:', val);
          }
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "lblStreak", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "sprStar", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "starFrames", [_dec4], {
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

System.register("chunks:///_virtual/string-util.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "2a0a6lzfc1AJpf9SRvep/RI", "string-util", undefined);
      class StringUtil {
        /**
         * 替换字符串中的模板占位符（如 #{key}）
         * @param input 原始字符串
         * @param replacements 替换规则（键值对）
         * @returns 替换后的字符串
         */
        static replaceTemplateStrings(input, replacements) {
          const regex = /#\{(\w+)\}/g;
          return input.replace(regex, (match, key) => {
            return key in replacements ? replacements[key].toString() : match;
          });
        }
        static timeFormat(time, isZeroShow = true) {
          const hours = Math.floor(time / 3600);
          const minutes = Math.floor(time % 3600 / 60);
          const seconds = time % 60;
          let formatted = '';
          if (isZeroShow || hours > 0) {
            formatted += `${hours}:`;
          }
          formatted += `${this.pad(minutes)}:${this.pad(seconds)}`;
          return formatted;
        }
        static pad(num) {
          if (num < 10) {
            return `0${num.toFixed(0)}`;
          } else {
            return num.toFixed(0);
          }
        }
      }
      exports('StringUtil', StringUtil);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/svg-util.ts", ['cc', './log-util.ts'], function (exports) {
  var cclegacy, Vec3, LogUtil;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Vec3 = module.Vec3;
    }, function (module) {
      LogUtil = module.LogUtil;
    }],
    execute: function () {
      cclegacy._RF.push({}, "847f8AyQg5KW4K7d1CBivO3", "svg-util", undefined);
      class SvgUtil {
        static exportPoints() {
          LogUtil.log("svgPathClub points", JSON.stringify(this.samplePointsFromSvgPath(this.svgPathClub, 52, 780)));
          LogUtil.log("svgPathDiamond points", JSON.stringify(this.samplePointsFromSvgPath(this.svgPathDiamond, 52, 780)));
          LogUtil.log("svgPathHeart points", JSON.stringify(this.samplePointsFromSvgPath(this.svgPathHeart, 52, 780)));
          LogUtil.log("svgPathSpade points", JSON.stringify(this.samplePointsFromSvgPath(this.svgPathSpade, 52, 780)));
        }
        static samplePointsFromSvgPath(svgPath, totalPoints, maxWidth) {
          const commands = this.parseSvgCommands(svgPath);
          const segments = this.analyzeSegments(commands);
          const points = this.generateSmartPoints(segments, totalPoints).map(p => new Vec3(p.x, -p.y, 0));
          const {
            minX,
            maxX,
            minY,
            maxY
          } = this.getBounds(points);
          const width = maxX - minX;
          const height = maxY - minY;
          const scale = maxWidth / Math.max(width, height, 1);
          const offsetX = (maxX + minX) / 2;
          const offsetY = (maxY + minY) / 2;
          return points.map(p => new Vec3((p.x - offsetX) * scale, (p.y - offsetY) * scale, 0));
        }
        static parseSvgCommands(path) {
          const commandRegex = /([A-Za-z])([^A-Za-z]*)/g;
          const commands = [];
          let match;
          while ((match = commandRegex.exec(path)) !== null) {
            const type = match[1];
            const params = match[2].trim().split(/[\s,]+/).filter(Boolean).map(Number);
            commands.push({
              type: type.toUpperCase(),
              params,
              isRelative: type === type.toLowerCase()
            });
          }
          return commands;
        }
        static analyzeSegments(commands) {
          const segments = [];
          let current = new Vec3();
          let startPoint = null;
          for (const cmd of commands) {
            const type = cmd.type.toUpperCase();
            switch (type) {
              case 'M':
                current.set(cmd.params[0], cmd.params[1], 0);
                startPoint = current.clone(); // 记录起点
                const length = 0;
                segments.push({
                  type: 'move',
                  length,
                  command: cmd
                });
                break;
              case 'L':
                {
                  const end = new Vec3(cmd.params[0], cmd.params[1], 0);
                  const length = current.subtract(end).length();
                  segments.push({
                    type: 'line',
                    length,
                    command: cmd
                  });
                  current.set(end);
                  break;
                }
              case 'H':
                {
                  const x = cmd.params[0];
                  const end = new Vec3(x, current.y, 0);
                  const length = Math.abs(end.x - current.x);
                  if (cmd.params.length == 1) {
                    cmd.params.push(current.y);
                  }
                  segments.push({
                    type: 'line',
                    length,
                    command: cmd
                  });
                  current.set(end);
                  break;
                }
              case 'V':
                {
                  const y = cmd.params[0];
                  const end = new Vec3(current.x, y, 0);
                  const length = Math.abs(end.y - current.y);
                  if (cmd.params.length == 1) {
                    cmd.params.push(current.x);
                  }
                  segments.push({
                    type: 'line',
                    length,
                    command: cmd
                  });
                  current.set(end);
                  break;
                }
              case 'C':
                {
                  const cp1 = new Vec3(cmd.params[0], cmd.params[1], 0);
                  const cp2 = new Vec3(cmd.params[2], cmd.params[3], 0);
                  const end = new Vec3(cmd.params[4], cmd.params[5], 0);
                  const approxLength = this.cubicBezierApproxLength(current, cp1, cp2, end);
                  segments.push({
                    type: 'curve',
                    length: approxLength,
                    command: cmd
                  });
                  current.set(end);
                  break;
                }
              case 'S':
                {
                  throw new Error('Smooth cubic bezier is not supported');
                }
              case 'Q':
                {
                  const cp = new Vec3(cmd.isRelative ? current.x + cmd.params[0] : cmd.params[0], cmd.isRelative ? current.y + cmd.params[1] : cmd.params[1], 0);
                  const end = new Vec3(cmd.isRelative ? current.x + cmd.params[2] : cmd.params[2], cmd.isRelative ? current.y + cmd.params[3] : cmd.params[3], 0);

                  // 计算二次贝塞尔曲线的近似长度
                  const approxLength = this.quadraticBezierApproxLength(current, cp, end);
                  segments.push({
                    type: 'quadratic',
                    length: approxLength,
                    command: cmd
                  });
                  current.set(end);
                  break;
                }
              case 'A':
                {
                  const [rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y] = cmd.params;
                  const end = new Vec3(cmd.isRelative ? current.x + x : x, cmd.isRelative ? current.y + y : y, 0);
                  const approxLength = this.arcApproxLength(current, end, rx, ry, xAxisRotation, largeArcFlag, sweepFlag);
                  LogUtil.log("approxLength", approxLength);
                  segments.push({
                    type: 'arc',
                    length: approxLength,
                    command: cmd
                  });
                  current.set(end);
                  break;
                }
              case 'Z':
                if (startPoint) {
                  const length = current.subtract(startPoint).length();
                  segments.push({
                    type: 'line',
                    length,
                    command: {
                      type: 'L',
                      params: [startPoint.x, startPoint.y],
                      isRelative: false
                    }
                  });
                  current.set(startPoint);
                }
                break;
              default:
                LogUtil.log("un support command: ", cmd);
                throw new Error(`Unsupported command: ${type}`);
            }
          }
          return segments;
        }

        /** 三次贝塞尔曲线近似长度计算 */
        static cubicBezierApproxLength(p0, p1, p2, p3) {
          const steps = 200; // 增加采样点数量
          let length = 0;
          let prev = p0.clone();
          for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            const point = this.cubicBezier(p0, p1, p2, p3, t);
            length += prev.subtract(point).length();
            prev.set(point);
          }
          return length;
        }

        /** 三次贝塞尔曲线公式 */
        static cubicBezier(p0, p1, p2, p3, t) {
          const u = 1 - t;
          return new Vec3(u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x, u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y, 0);
        }
        static generateSmartPoints(segments, totalPoints) {
          const points = [];
          let current = new Vec3();
          let remainingPoints = totalPoints;

          // 计算总权重（曲线段权重更高）
          const totalWeight = segments.reduce((sum, seg) => {
            const weight = seg.type === 'curve' || seg.type === 'arc' || seg.type === 'quadratic' ? seg.length * 1 : seg.length; // 曲线段权重加倍
            return sum + weight;
          }, 0);
          segments.forEach((seg, index) => {
            if (seg.type === 'move') {
              current.set(seg.command.params[0], seg.command.params[1], 0);
              return;
            }
            const weight = seg.type === 'curve' || seg.type === 'arc' || seg.type === 'quadratic' ? seg.length * 1 : seg.length;
            const ratio = weight / totalWeight;
            let segmentPoints = Math.max(2, Math.round(totalPoints * ratio));
            if (index === segments.length - 1) {
              segmentPoints = remainingPoints; // 分配剩余点数
            }

            remainingPoints -= segmentPoints;

            // 根据段类型生成点
            switch (seg.type) {
              case 'line':
                this.handleLineWithPoints(seg.command, current, points, segmentPoints);
                break;
              case 'curve':
                this.handleCubicWithPoints(seg.command, current, points, segmentPoints);
                break;
              case 'arc':
                this.handleArcWithPoints(seg.command, current, points, segmentPoints);
                break;
              case 'quadratic':
                this.handleQuadraticWithPoints(seg.command, current, points, segmentPoints);
                break;
            }
          });
          return points;
        }

        /** 按点数生成二次贝塞尔曲线 */
        static handleQuadraticWithPoints(cmd, current, points, segmentPoints) {
          const [x1, y1, x, y] = cmd.params;
          const cp = new Vec3(cmd.isRelative ? current.x + x1 : x1, cmd.isRelative ? current.y + y1 : y1, 0);
          const end = new Vec3(cmd.isRelative ? current.x + x : x, cmd.isRelative ? current.y + y : y, 0);
          for (let i = 0; i < segmentPoints - 1; i++) {
            const t = i / (segmentPoints - 1);
            const point = this.quadraticBezier(current, cp, end, t);
            points.push(point);
          }
          current.set(end);
        }

        /** 按点数生成椭圆弧 */
        static handleArcWithPoints(cmd, current, points, segmentPoints) {
          const [rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y] = cmd.params;
          const end = new Vec3(cmd.isRelative ? current.x + x : x, cmd.isRelative ? current.y + y : y, 0);

          // 椭圆弧参数转换为标准参数
          const arcParams = this.convertArcToCenterParams(current, end, rx, ry, xAxisRotation * Math.PI / 180, largeArcFlag, sweepFlag);

          // 生成椭圆弧上的点
          for (let i = 0; i < segmentPoints - 1; i++) {
            const t = i / (segmentPoints - 1);
            const point = this.getArcPoint(arcParams, t, rx, ry, xAxisRotation * Math.PI / 180);
            points.push(point);
          }
          current.set(end);
        }

        /** 按点数生成直线 */
        static handleLineWithPoints(cmd, current, points, segmentPoints) {
          // LogUtil.log("handleLineWithPoints", cmd, current, points, segmentPoints);
          const end = new Vec3(cmd.isRelative ? current.x + cmd.params[0] : cmd.params[0], cmd.isRelative ? current.y + cmd.params[1] : cmd.params[1], 0);
          for (let i = 0; i < segmentPoints - 1; i++) {
            const t = i / (segmentPoints - 1);
            const x = current.x * (1 - t) + end.x * t;
            const y = current.y * (1 - t) + end.y * t;
            points.push(new Vec3(x, y, 0));
          }
          current.set(end);
        }

        /** 按点数生成贝塞尔曲线 */
        static handleCubicWithPoints(cmd, current, points, segmentPoints) {
          const [x1, y1, x2, y2, x, y] = cmd.params;
          const cp1 = new Vec3(cmd.isRelative ? current.x + x1 : x1, cmd.isRelative ? current.y + y1 : y1, 0);
          const cp2 = new Vec3(cmd.isRelative ? current.x + x2 : x2, cmd.isRelative ? current.y + y2 : y2, 0);
          const end = new Vec3(cmd.isRelative ? current.x + x : x, cmd.isRelative ? current.y + y : y, 0);
          for (let i = 0; i < segmentPoints - 1; i++) {
            const t = i / (segmentPoints - 1);
            const point = this.cubicBezier(current, cp1, cp2, end, t);
            points.push(point);
          }
          current.set(end);
        }

        /** 获取坐标范围 */
        static getBounds(points) {
          return points.reduce((acc, p) => ({
            minX: Math.min(acc.minX, p.x),
            maxX: Math.max(acc.maxX, p.x),
            minY: Math.min(acc.minY, p.y),
            maxY: Math.max(acc.maxY, p.y)
          }), {
            minX: Infinity,
            maxX: -Infinity,
            minY: Infinity,
            maxY: -Infinity
          });
        }

        /** 椭圆弧近似长度计算 */
        static arcApproxLength(start, end, rx, ry, xAxisRotation, largeArcFlag, sweepFlag) {
          const steps = 100; // 采样点数量
          let length = 0;

          // 将角度转换为弧度
          const rotation = xAxisRotation * Math.PI / 180;

          // 椭圆弧参数转换为标准参数
          const arcParams = this.convertArcToCenterParams(start, end, rx, ry, rotation, largeArcFlag, sweepFlag);

          // 采样计算长度
          let prevPoint = this.getArcPoint(arcParams, 0, rx, ry, rotation);
          for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            const point = this.getArcPoint(arcParams, t, rx, ry, rotation);
            length += prevPoint.subtract(point).length();
            prevPoint = point;
          }
          return length;
        }

        /** 将椭圆弧参数转换为中心参数 */
        static convertArcToCenterParams(start, end, rx, ry, rotation, largeArcFlag, sweepFlag) {
          // 修正半径
          rx = Math.abs(rx);
          ry = Math.abs(ry);

          // 将起点和终点转换到椭圆的局部坐标系
          const dx = (start.x - end.x) / 2;
          const dy = (start.y - end.y) / 2;
          const cosRotation = Math.cos(rotation);
          const sinRotation = Math.sin(rotation);
          const x1p = cosRotation * dx + sinRotation * dy;
          const y1p = -sinRotation * dx + cosRotation * dy;

          // 修正半径以确保椭圆弧有效
          const rxSq = rx * rx;
          const rySq = ry * ry;
          const x1pSq = x1p * x1p;
          const y1pSq = y1p * y1p;
          let scale = Math.sqrt((rxSq * rySq - rxSq * y1pSq - rySq * x1pSq) / (rxSq * y1pSq + rySq * x1pSq));
          if (scale < 0) scale = 0;
          if (largeArcFlag === sweepFlag) scale = -scale;
          const cxp = scale * (rx * y1p) / ry;
          const cyp = scale * -(ry * x1p) / rx;

          // 将中心点转换回全局坐标系
          const cx = cosRotation * cxp - sinRotation * cyp + (start.x + end.x) / 2;
          const cy = sinRotation * cxp + cosRotation * cyp + (start.y + end.y) / 2;

          // 计算起始角度和角度跨度
          const startAngle = Math.atan2((y1p - cyp) / ry, (x1p - cxp) / rx);
          const endAngle = Math.atan2((-y1p - cyp) / ry, (-x1p - cxp) / rx);
          let deltaAngle = endAngle - startAngle;
          if (sweepFlag === 0 && deltaAngle > 0) {
            deltaAngle -= 2 * Math.PI;
          } else if (sweepFlag === 1 && deltaAngle < 0) {
            deltaAngle += 2 * Math.PI;
          }
          return {
            cx,
            cy,
            startAngle,
            deltaAngle
          };
        }

        /** 获取椭圆弧上某个位置的点 */
        static getArcPoint(arcParams, t, rx, ry, rotation) {
          const angle = arcParams.startAngle + arcParams.deltaAngle * t;

          // 计算未旋转的椭圆上的点
          const xUnrotated = rx * Math.cos(angle);
          const yUnrotated = ry * Math.sin(angle);

          // 应用旋转变换
          const cosRotation = Math.cos(rotation);
          const sinRotation = Math.sin(rotation);
          const x = cosRotation * xUnrotated - sinRotation * yUnrotated + arcParams.cx;
          const y = sinRotation * xUnrotated + cosRotation * yUnrotated + arcParams.cy;
          return new Vec3(x, y, 0);
        }

        /** 二次贝塞尔曲线近似长度计算 */
        static quadraticBezierApproxLength(p0, p1, p2) {
          const steps = 100; // 采样点数量
          let length = 0;
          let prev = p0.clone();
          for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            const point = this.quadraticBezier(p0, p1, p2, t);
            length += prev.subtract(point).length();
            prev.set(point);
          }
          return length;
        }

        /** 二次贝塞尔曲线公式 */
        static quadraticBezier(p0, p1, p2, t) {
          const u = 1 - t;
          return new Vec3(u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x, u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y, 0);
        }
      }
      exports('SvgUtil', SvgUtil);
      SvgUtil.svgPathClub = "M 160 236 H 96 C 94.7274 234.2689 93.4548 232.5378 92.1821 230.8066 L 104.4598 191.5244 A 52.0014 52.0014 0 1 1 76 96 Q 78.0321 96 80.0544 96.1563 A 52.0001 52.0001 0 1 1 175.9454 96.1563 Q 177.966 96.001 180 96 A 52 52 0 1 1 151.5409 191.5254 L 163.8179 230.8066 A 4.0002 4.0002 0 0 1 160 236";
      SvgUtil.svgPathDiamond = "M 250.587 -2 L 43.227 250.587 L 250.587 503.174 L 457.947 250.587 L 250.587 -2";
      SvgUtil.svgPathHeart = "M 43 17.0766 C 43 11 38.4165 6.8393 32.7626 6.8393 C 29.0403 6.8393 25.7918 8.8325 24 11.8033 C 22.2081 8.8325 18.9597 6.8393 15.2374 6.8393 C 9.5835 6.8393 5.0001 11.4227 5.0001 17.0766 C 5.0001 18.3691 5.2497 19.6006 5.6867 20.7393 C 9.0718 30.4761 24.0001 41.1608 24.0001 41.1608 C 24.0001 41.1608 38.9283 30.4761 42.3135 20.7393 C 42.7505 19.6007 43.0002 18.3691 43 17.0766";
      SvgUtil.svgPathSpade = "M 6.0038 32.9805 C 6.0038 38.9336 9.9882 42.918 15.9413 42.918 C 18.5429 42.918 20.957 42.0273 22.6444 40.668 C 21.707 43.1992 19.9726 45.1211 18.9648 46.293 C 17.5116 48.0976 18.1913 50.4883 20.746 50.4883 L 35.2304 50.4883 C 37.7851 50.4883 38.4648 48.0976 37.0116 46.293 C 36.0038 45.1211 34.2695 43.1992 33.3319 40.668 C 35.0195 42.0273 37.457 42.918 40.0351 42.918 C 46.0116 42.918 49.9962 38.9336 49.9962 32.9805 C 49.9962 23.0898 35.9804 18.2383 30.2851 7.2226 C 29.7929 6.2617 29.2538 5.5117 27.9882 5.5117 C 26.7226 5.5117 26.207 6.2617 25.6913 7.2226 C 19.996 18.2383 6.0038 23.0898 6.0038 32.9805";
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/time-agent.ts", ['cc', './storage-manager.ts', './log-util.ts'], function (exports) {
  var cclegacy, _decorator, StorageManager, LogUtil;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }, function (module) {
      StorageManager = module.StorageManager;
    }, function (module) {
      LogUtil = module.LogUtil;
    }],
    execute: function () {
      var _dec, _class, _class2;
      cclegacy._RF.push({}, "c8920mfieRFeLAGMhJlPXed", "time-agent", undefined);
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
          LogUtil.log('TimeAgent serverTime:', serverTime, "Local time is: ", new Date(serverTime).toLocaleString(), "UTC time is: ", new Date(serverTime).toUTCString());
          LogUtil.log('TimeAgent clientTime:', clientTime, "Local time is: ", new Date(clientTime).toLocaleString(), "UTC time is: ", new Date(clientTime).toUTCString());
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

System.register("chunks:///_virtual/toast.ts", ['cc', './ui-view.ts', './ui-manager.ts', './ui-config.ts'], function (exports) {
  var cclegacy, Animation, Label, _decorator, UIView, UIManager, UIID;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Animation = module.Animation;
      Label = module.Label;
      _decorator = module._decorator;
    }, function (module) {
      UIView = module.UIView;
    }, function (module) {
      UIManager = module.UIManager;
    }, function (module) {
      UIID = module.UIID;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "1bf61Mrx7VL+Y3XpGmovqbX", "toast", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let Toast = exports('Toast', (_dec = ccclass('Toast'), _dec(_class = class Toast extends UIView {
        constructor(...args) {
          super(...args);
          this.label = null;
          this.animaiton = null;
          this.onCompleted = null;
        }
        onEnable() {
          if (this.animaiton) {
            this.animaiton.on(Animation.EventType.FINISHED, this.onAnimationFinished, this);
          }
        }
        onDisable() {
          if (this.animaiton) {
            this.animaiton.off(Animation.EventType.FINISHED, this.onAnimationFinished, this);
          }
        }
        init() {
          this.animaiton = this.getComponentInChildren(Animation);
          this.label = this.getComponentInChildren(Label);
        }
        onAnimationFinished() {
          this.onCompleted && this.onCompleted();
          this.onCompleted = null;
          this.animaiton.stop();
          UIManager.instance.hideToast(UIID.Toast);
        }
        onOpen(fromUI, ...args) {
          let msg = args[0];
          this.label.string = msg.content;
          this.animaiton.play();
        }
      }) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/toggle-btn.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, SpriteFrame, _decorator, Button, Sprite;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      SpriteFrame = module.SpriteFrame;
      _decorator = module._decorator;
      Button = module.Button;
      Sprite = module.Sprite;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "b3907y+vvNH/IDBHvnM0Jup", "toggle-btn", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let ToggleBtn = exports('ToggleBtn', (_dec = ccclass('ToggleBtn'), _dec2 = property([SpriteFrame]), _dec(_class = (_class2 = class ToggleBtn extends Button {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "sprtFrames", _descriptor, this);
          this._isOn = false;
        }
        set isOn(val) {
          this._isOn = val;
          let spr = this.getComponent(Sprite);
          spr && (spr.spriteFrame = this.sprtFrames[this._isOn ? 1 : 0]);
        }
        get isOn() {
          return this._isOn;
        }
      }, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "sprtFrames", [_dec2], {
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

System.register("chunks:///_virtual/token-account.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './type-define.ts', './game-constants.ts', './game-data-manager.ts', './mount-manager.ts', './mount-point.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Label, Enum, _decorator, Component, director, tween, Color, UIOpacity, ItemType, GameEvent, GameDataManager, MountManager, MountPoint;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      Enum = module.Enum;
      _decorator = module._decorator;
      Component = module.Component;
      director = module.director;
      tween = module.tween;
      Color = module.Color;
      UIOpacity = module.UIOpacity;
    }, function (module) {
      ItemType = module.ItemType;
    }, function (module) {
      GameEvent = module.GameEvent;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }, function (module) {
      MountManager = module.MountManager;
    }, function (module) {
      MountPoint = module.MountPoint;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3;
      cclegacy._RF.push({}, "e1531ps5xxEWKL5P+cRVi+y", "token-account", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let TokenAccount = exports('TokenAccount', (_dec = ccclass('TokenAccount'), _dec2 = property(Label), _dec3 = property({
        type: Enum(ItemType)
      }), _dec4 = property(Label), _dec(_class = (_class2 = class TokenAccount extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "lblNum", _descriptor, this);
          _initializerDefineProperty(this, "itemType", _descriptor2, this);
          _initializerDefineProperty(this, "lblDelta", _descriptor3, this);
          this.changeNum = 0;
          this.accountNum = 0;
          this.isPlaying = false;
        }
        start() {
          this.lblDelta.node.active = false;
        }
        onEnable() {
          this.updateUI();
          director.on(GameEvent.TOKEN_ACCOUNT_CHANGE, this.onAccountChange, this);
        }
        onDisable() {
          director.off(GameEvent.TOKEN_ACCOUNT_CHANGE, this.onAccountChange, this);
        }
        setNum(val) {
          switch (this.itemType) {
            case ItemType.MinorToken:
              {
                this.lblNum.string = `${val.toFixed(0)}`;
              }
              break;
          }
        }
        rollTo(targetValue, duration = 1) {
          let currentValue = parseFloat(this.lblNum.string.replace(/[^\d.-]/g, '')) || 0; // 获取当前值

          let lblNum = this.lblNum;
          tween({
            value: currentValue
          }).to(duration, {
            value: targetValue
          }, {
            onUpdate: tweenObj => {
              let value = `${Math.round(tweenObj.value)}`;
              lblNum.string = value;
            }
          }).start();
        }
        playChangeAnim(val) {
          if (val === 0) {
            return;
          }
          let symbol = val > 0 ? '+' : '';
          let currency = MountManager.instance.notify(MountPoint.NativeNotifyCurrency, null);
          this.lblDelta.node.active = true;
          this.lblDelta.string = `${symbol}${val.toFixed(0)}`;
          let color = val > 0 ? "00FF47" : "FF0000";
          Color.fromHEX(this.lblDelta.color, color);
          this.lblDelta.updateRenderData(true);
          let comp = this.lblDelta.getComponent(UIOpacity);
          tween(comp).stop();
          let dur = 1;
          comp.opacity = 255;
          tween(comp).to(dur, {
            opacity: 0
          }, {
            easing: 'sineOut'
          }).call(() => {
            this.lblDelta.node.active = false;
          }).start();
        }
        onAccountChange(...params) {
          let data = params[0];
          if (data.type != this.itemType) {
            return;
          }
          this.changeNum += data.change;
          this.accountNum = data.account;
          if (!this.isPlaying) {
            this.isPlaying = true;
            let dur = 1;
            this.scheduleOnce(() => {
              this.rollTo(this.accountNum, dur);
              this.playChangeAnim(this.changeNum);
              this.changeNum = 0;
              this.accountNum = 0;
              this.isPlaying = false;
            }, dur);
          }
        }
        updateUI() {
          let gdMgr = GameDataManager.instance;
          switch (this.itemType) {
            case ItemType.MinorToken:
              {
                this.setNum(gdMgr.getMinorToken());
              }
              break;
          }
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "lblNum", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "itemType", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return ItemType.MinorToken;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "lblDelta", [_dec4], {
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

System.register("chunks:///_virtual/tool-btn.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './type-define.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Enum, Label, Node, _decorator, Component, UIOpacity, ToolType;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Enum = module.Enum;
      Label = module.Label;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
      UIOpacity = module.UIOpacity;
    }, function (module) {
      ToolType = module.ToolType;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3;
      cclegacy._RF.push({}, "82dc41+udRMgbGoBl/xRmlj", "tool-btn", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let ToolBtn = exports('ToolBtn', (_dec = ccclass('ToolBtn'), _dec2 = property({
        type: Enum(ToolType)
      }), _dec3 = property(Label), _dec4 = property(Node), _dec(_class = (_class2 = class ToolBtn extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "toolType", _descriptor, this);
          _initializerDefineProperty(this, "lblNum", _descriptor2, this);
          _initializerDefineProperty(this, "iconActive", _descriptor3, this);
        }
        setNum(num) {
          this.lblNum.string = num.toString();
          if (num > 0) {
            this.lblNum.node.parent.active = true;
            this.lblNum.string = num.toString();
            this.iconActive.active = false;
          } else {
            this.lblNum.node.parent.active = false;
            this.iconActive.active = true;
          }
        }
        set enable(val) {
          let uiOpacity = this.node.getComponent(UIOpacity);
          uiOpacity.opacity = val ? 255 : 170;
        }
        get enable() {
          let uiOpacity = this.node.getComponent(UIOpacity);
          return uiOpacity.opacity == 255;
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "toolType", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return ToolType.Undo;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "lblNum", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "iconActive", [_dec4], {
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

System.register("chunks:///_virtual/type-define.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './object-util.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, MapType, ArrayType, ClassType;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      MapType = module.MapType;
      ArrayType = module.ArrayType;
      ClassType = module.ClassType;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class9, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _dec7, _class12, _descriptor7, _dec8, _class14, _descriptor8;
      cclegacy._RF.push({}, "550f8dwBhlMcaKn/QtWqA6N", "type-define", undefined);
      let ToolType = exports('ToolType', /*#__PURE__*/function (ToolType) {
        ToolType[ToolType["Magnifier"] = 0] = "Magnifier";
        ToolType[ToolType["Undo"] = 1] = "Undo";
        ToolType[ToolType["Key"] = 2] = "Key";
        return ToolType;
      }({}));
      let LevelType = exports('LevelType', /*#__PURE__*/function (LevelType) {
        LevelType[LevelType["Normal"] = 0] = "Normal";
        LevelType[LevelType["Hard"] = 1] = "Hard";
        LevelType[LevelType["Special"] = 2] = "Special";
        return LevelType;
      }({}));
      let ItemType = exports('ItemType', /*#__PURE__*/function (ItemType) {
        ItemType[ItemType["MinorToken"] = 0] = "MinorToken";
        return ItemType;
      }({}));
      class WinStreakRewardInfo {
        constructor(targetStreak, rewardType, rewardAmount) {
          this.streak = 0;
          this.type = ToolType.Magnifier;
          this.amount = 0;
          this.streak = targetStreak;
          this.type = rewardType;
          this.amount = rewardAmount;
        }
      }
      exports('WinStreakRewardInfo', WinStreakRewardInfo);
      let InterAdPageId = exports('InterAdPageId', /*#__PURE__*/function (InterAdPageId) {
        InterAdPageId["LevelWin"] = "level_win";
        InterAdPageId["LevelStart"] = "level_start";
        return InterAdPageId;
      }({}));
      class InterAdPageInfo {
        constructor(pageId, is_open, add_weight) {
          this.pageId = "";
          this.is_open = true;
          this.add_weight = 100;
          this.pageId = pageId;
          this.is_open = is_open;
          this.add_weight = add_weight;
        }
      }
      exports('InterAdPageInfo', InterAdPageInfo);
      class StageConfig {
        constructor() {
          this.lv = 1;
          this.type = 0;
          // 0 normal， 1 special， 2 boss
          this.temp = 0;
          //1 template，0 non-template
          this.quest = 0;
          // 0quest，1non-quest
          this.col = [4, 4, 4, 4, 4];
          this.raw = [[1, 2, 3, 4], [1, 2, 3, 4], [-1, -1, -1, -1], [1, 2, 3, 4], [0, 0, 0, 0]];
        } //0empty -1lock，>=1normal）
      }
      exports('default', StageConfig);

      // ----------------------------Data Subtype Define----------------------------
      class FirstGameAcion {
        //引导类型数据
      }
      exports('FirstGameAcion', FirstGameAcion);
      let RewardState = exports('RewardState', /*#__PURE__*/function (RewardState) {
        RewardState[RewardState["Locked"] = 0] = "Locked";
        RewardState[RewardState["Unlocked"] = 1] = "Unlocked";
        RewardState[RewardState["Claimed"] = 2] = "Claimed";
        return RewardState;
      }({}));
      class WinStreakRewardData {
        constructor(targetStreak, state) {
          this.targetStreak = 0;
          this.state = RewardState.Locked;
          this.targetStreak = targetStreak;
          this.state = state;
        }
      }
      exports('WinStreakRewardData', WinStreakRewardData);
      class ReportLog {
        constructor(event, param) {
          this.event = '';
          this.param = '';
          this.timeStamp = 0;
          this.event = event;
          this.param = param;
          this.timeStamp = Date.now();
        }
      }
      exports('ReportLog', ReportLog);

      // Sg
      // Sg Data
      let SgState = exports('SgState', /*#__PURE__*/function (SgState) {
        SgState[SgState["Unready"] = 0] = "Unready";
        SgState[SgState["Ready"] = 1] = "Ready";
        SgState[SgState["Started"] = 2] = "Started";
        return SgState;
      }({}));
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
        reset() {
          this.isLocked = true;
          this.isShowed = false;
          this.isSelected = false;
          this.isFavorite = false;
          this.isBg = false;
        }
      }
      exports('PictureData', PictureData);
      class AlbumData {
        constructor() {
          this.pictures = {};
        }
      }
      exports('AlbumData', AlbumData);
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
      let SgData = exports('SgData', (_dec = MapType(String, PictureData), _dec2 = ArrayType(PictureInfo), _dec3 = ArrayType(PictureInfo), _dec4 = ArrayType(PictureInfo), _dec5 = ArrayType(PictureInfo), _dec6 = MapType(String, AlbumData), (_class9 = class SgData {
        constructor() {
          _initializerDefineProperty(this, "illustration", _descriptor, this);
          _initializerDefineProperty(this, "unselectedSpecialPicInfoList", _descriptor2, this);
          _initializerDefineProperty(this, "unselectedNormalPicInfoList", _descriptor3, this);
          _initializerDefineProperty(this, "selectedPicInfoList", _descriptor4, this);
          _initializerDefineProperty(this, "downloadedPicInfoList", _descriptor5, this);
          _initializerDefineProperty(this, "album", _descriptor6, this);
          this.selectFreqCount = 0;
          this.isPlayPlots = false;
          this.state = SgState.Unready;
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class9.prototype, "illustration", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return {};
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class9.prototype, "unselectedSpecialPicInfoList", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class9.prototype, "unselectedNormalPicInfoList", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class9.prototype, "selectedPicInfoList", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class9.prototype, "downloadedPicInfoList", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class9.prototype, "album", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return {};
        }
      })), _class9)));

      // Sg Config
      class SelectFrequencyConfig {
        constructor() {
          this.frequency = 5;
          this.show_num = 3;
        }
      }
      exports('SelectFrequencyConfig', SelectFrequencyConfig);
      let SgSelectInfo = exports('SgSelectInfo', (_dec7 = ClassType(SelectFrequencyConfig), (_class12 = class SgSelectInfo {
        constructor() {
          this.refresh_time = 1;
          this.special_num = 0;
          _initializerDefineProperty(this, "special_frequency", _descriptor7, this);
        }
      }, _descriptor7 = _applyDecoratedDescriptor(_class12.prototype, "special_frequency", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new SelectFrequencyConfig();
        }
      }), _class12)));
      let SgConfig = exports('SgConfig', (_dec8 = ClassType(SgSelectInfo), (_class14 = class SgConfig {
        constructor() {
          this.is_sg = false;
          this.loading_after_flag = true;
          this.illustration_cost = 1000;
          this.album_cost = 10;
          this.preload_time = 20;
          this.unselected_size = 50;
          _initializerDefineProperty(this, "select", _descriptor8, this);
          this.unshow_limit = 10;
        }
      }, _descriptor8 = _applyDecoratedDescriptor(_class14.prototype, "select", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new SgSelectInfo();
        }
      }), _class14)));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ui-config.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "1a3e4p4Ov9B4IfAr5nMLw8Y", "ui-config", undefined);
      let UIID = exports('UIID', /*#__PURE__*/function (UIID) {
        UIID[UIID["Toast"] = 0] = "Toast";
        UIID[UIID["Loading"] = 1] = "Loading";
        UIID[UIID["GuideTips"] = 2] = "GuideTips";
        UIID[UIID["ReportLogView"] = 3] = "ReportLogView";
        UIID[UIID["MainView"] = 4] = "MainView";
        UIID[UIID["MenuPopup_1"] = 5] = "MenuPopup_1";
        UIID[UIID["MenuPopup_2"] = 6] = "MenuPopup_2";
        UIID[UIID["RatingPopup"] = 7] = "RatingPopup";
        UIID[UIID["PolicyPopup"] = 8] = "PolicyPopup";
        UIID[UIID["GmView"] = 9] = "GmView";
        UIID[UIID["WinStreakRewardView"] = 10] = "WinStreakRewardView";
        UIID[UIID["ItemObtainPopup"] = 11] = "ItemObtainPopup";
        UIID[UIID["LevelWinPopup"] = 12] = "LevelWinPopup";
        UIID[UIID["MoveEndPopup"] = 13] = "MoveEndPopup";
        UIID[UIID["BeyondPopup"] = 14] = "BeyondPopup";
        UIID[UIID["PictureObtainPopup"] = 15] = "PictureObtainPopup";
        UIID[UIID["AdUnlockPopup"] = 16] = "AdUnlockPopup";
        UIID[UIID["SlidePictureView"] = 17] = "SlidePictureView";
        UIID[UIID["IllustrationViewSg"] = 18] = "IllustrationViewSg";
        UIID[UIID["PictureObtainView"] = 19] = "PictureObtainView";
        UIID[UIID["PictureSelectView"] = 20] = "PictureSelectView";
        UIID[UIID["StartViewSg"] = 21] = "StartViewSg";
        UIID[UIID["PictureView"] = 22] = "PictureView";
        UIID[UIID["LoadingSg"] = 23] = "LoadingSg";
        return UIID;
      }({}));
      let UICF = exports('UICF', {
        //common
        [UIID.Toast]: {
          prefab: "prefabs/ui/common/Toast"
        },
        [UIID.Loading]: {
          prefab: "prefabs/ui/common/LoadingView",
          preventTouch: true
        },
        [UIID.GuideTips]: {
          prefab: "prefabs/ui/common/GuideTips"
        },
        [UIID.ReportLogView]: {
          prefab: "prefabs/ui/common/ReportLogView"
        },
        //main
        [UIID.MainView]: {
          prefab: "prefabs/ui/main/MainView"
        },
        [UIID.MenuPopup_1]: {
          prefab: "prefabs/ui/main/MenuPopup-1",
          preventTouch: true
        },
        [UIID.MenuPopup_2]: {
          prefab: "prefabs/ui/main/MenuPopup-2",
          preventTouch: true
        },
        [UIID.RatingPopup]: {
          prefab: "prefabs/ui/main/RatingPopup",
          preventTouch: true
        },
        [UIID.PolicyPopup]: {
          prefab: "prefabs/ui/main/PolicyPopup",
          preventTouch: true
        },
        [UIID.GmView]: {
          prefab: "prefabs/ui/main/GmView",
          preventTouch: true
        },
        [UIID.ItemObtainPopup]: {
          prefab: "prefabs/ui/main/ItemObtainPopup",
          preventTouch: true
        },
        [UIID.LevelWinPopup]: {
          prefab: "prefabs/ui/main/LevelWinPopup",
          preventTouch: true
        },
        [UIID.MoveEndPopup]: {
          prefab: "prefabs/ui/main/MoveEndPopup",
          preventTouch: true
        }
      });
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ui-manager.ts", ['cc', './res-loader.ts', './ui-view.ts', './ui-config.ts', './game-data-manager.ts'], function (exports) {
  var cclegacy, director, Prefab, instantiate, Node, UITransform, view, log, isValid, resLoader, UIShowTypes, UIView, UIID, GameDataManager;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      director = module.director;
      Prefab = module.Prefab;
      instantiate = module.instantiate;
      Node = module.Node;
      UITransform = module.UITransform;
      view = module.view;
      log = module.log;
      isValid = module.isValid;
    }, function (module) {
      resLoader = module.resLoader;
    }, function (module) {
      UIShowTypes = module.UIShowTypes;
      UIView = module.UIView;
    }, function (module) {
      UIID = module.UIID;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }],
    execute: function () {
      cclegacy._RF.push({}, "ca8b2LiyUxO3LKaGNoAMhgY", "ui-manager", undefined);

      /**
       * UIManager界面管理类
       * 
       * 1.打开界面，根据配置自动加载界面、调用初始化、播放打开动画、隐藏其他界面、屏蔽下方界面点击
       * 2.关闭界面，根据配置自动关闭界面、播放关闭动画、恢复其他界面
       * 3.切换界面，与打开界面类似，但是是将当前栈顶的界面切换成新的界面（先关闭再打开）
       * 4.提供界面缓存功能
       */

      /** UI栈结构体 */
      /** UI配置结构体 */
      /** ui动画名 */
      const UiAni = {
        Open: "ui-open",
        Close: "ui-close"
      };
      class UIManager {
        constructor() {
          /** ui层级 */
          this.uiLayer0 = null;
          this.uiLayer1 = null;
          this.toastLayer = null;
          this.guideLayer = null;
          /** 资源加载计数器，用于生成唯一的资源占用key */
          this.useCount = 0;
          /** 背景UI（有若干层UI是作为背景UI，而不受切换等影响）*/
          this.BackGroundUI = 0;
          /** 是否正在关闭UI */
          this.isClosing = false;
          /** 是否正在打开UI */
          this.isOpening = false;
          /** UI界面缓存（key为UIId，value为UIView节点）*/
          this.UICache = {};
          /** UI界面栈（{UIID + UIView + UIArgs}数组）*/
          this.UIStack = [];
          /** UI待打开列表 */
          this.UIOpenQueue = [];
          /** UI待关闭列表 */
          this.UICloseQueue = [];
          /** UI配置 */
          this.UIConf = {};
          this.toastView = null;
          this.guideView = null;
          /** UI打开前回调 */
          this.uiOpenBeforeDelegate = null;
          /** UI打开回调 */
          this.uiOpenDelegate = null;
          /** UI关闭回调 */
          this.uiCloseDelegate = null;
        }
        static get instance() {
          if (!this._instance) {
            this._instance = new UIManager();
            this._instance.init();
          }
          return this._instance;
        }
        /**
         * 初始化所有UI的配置对象
         * @param conf 配置对象
         */
        initUIConf(conf) {
          this.UIConf = conf;
        }

        /**
         * 设置或覆盖某uiId的配置
         * @param uiId 要设置的界面id
         * @param conf 要设置的配置
         */
        setUIConf(uiId, conf) {
          this.UIConf[uiId] = conf;
        }
        init() {
          this.updateLayers();
        }
        updateLayers() {
          let canvas = director.getScene().getChildByName("Canvas");
          this.uiLayer0 = canvas.getChildByName("uiLayer0");
          this.uiLayer1 = canvas.getChildByName("uiLayer1");
          this.guideLayer = canvas.getChildByName("guideLayer");
          this.toastLayer = canvas.getChildByName("toastLayer");
        }

        /****************** 私有方法，UIManager内部的功能和基础规则 *******************/

        /**
         * 添加防触摸层
         * @param zOrder 屏蔽层的层级
         */
        async preventTouch(zOrder) {
          let prefab = await resLoader.loadAsync('prefabs/ui/common/PreventTouch', Prefab);
          let node = prefab ? instantiate(prefab) : new Node();
          node.name = 'preventTouch';
          let uiCom = node.addComponent(UITransform);
          uiCom.setContentSize(view.getVisibleSize());
          node.on(Node.EventType.TOUCH_START, function (event) {
            event.propagationStopped = true;
          }, node);
          this.uiLayer1.addChild(node);
          uiCom.priority = zOrder - 0.01;
          return node;
        }

        /** 自动执行下一个待关闭或待打开的界面 */
        autoExecNextUI() {
          // 逻辑上是先关后开
          if (this.UICloseQueue.length > 0) {
            let uiQueueInfo = this.UICloseQueue[0];
            this.UICloseQueue.splice(0, 1);
            this.close(uiQueueInfo);
          } else if (this.UIOpenQueue.length > 0) {
            let uiQueueInfo = this.UIOpenQueue[0];
            this.UIOpenQueue.splice(0, 1);
            this.open(uiQueueInfo.uiId, uiQueueInfo.uiArgs);
          }
        }

        /**
         * 自动检测动画组件以及特定动画，如存在则播放动画，无论动画是否播放，都执行回调
         * @param aniName 动画名
         * @param aniOverCallback 动画播放完成回调
         */
        autoExecAnimation(uiView, aniName, aniOverCallback) {
          // 播放动画
          // 暂时先省略动画播放的逻辑
          if (uiView.animComp) {
            uiView.aniOverCallback = aniOverCallback;
            uiView.animComp.play(aniName);
          } else {
            console.warn(`uiView ${uiView.node.name} animComp is null`);
            aniOverCallback();
          }
        }

        /**
         * 自动检测资源预加载组件，如果存在则加载完成后调用completeCallback，否则直接调用
         * @param completeCallback 资源加载完成回调
         */
        autoLoadRes(uiView, completeCallback) {
          // 暂时先省略
          completeCallback();
        }

        /** 根据界面显示类型刷新显示 */
        updateUI() {
          let hideIndex = 0;
          let showIndex = this.UIStack.length - 1;
          for (; showIndex >= 0; --showIndex) {
            let mode = this.UIStack[showIndex].uiView.showType;
            // 无论何种模式，最顶部的UI都是应该显示的
            this.UIStack[showIndex].uiView.node.active = true;
            if (this.UIStack[showIndex].preventNode) {
              this.UIStack[showIndex].preventNode.active = true;
            }
            if (UIShowTypes.UIFullScreen == mode) {
              break;
            } else if (UIShowTypes.UISingle == mode) {
              for (let i = 0; i < this.BackGroundUI; ++i) {
                this.UIStack[i].uiView.node.active = true;
                if (this.UIStack[i].preventNode) {
                  this.UIStack[i].preventNode.active = true;
                }
              }
              hideIndex = this.BackGroundUI;
              break;
            }
          }
          // 隐藏不应该显示的部分UI
          for (let hide = hideIndex; hide < showIndex; ++hide) {
            let mode = this.UIStack[hide].uiView.showType;
            if (UIShowTypes.UIFullScreen == mode) {
              continue;
            }
            this.UIStack[hide].uiView.node.active = false;
            if (this.UIStack[hide].preventNode) {
              this.UIStack[hide].preventNode.active = false;
            }
          }
        }

        /**
         * 异步加载一个UI的prefab，成功加载了一个prefab之后
         * @param uiId 界面id
         * @param processCallback 加载进度回调
         * @param completeCallback 加载完成回调
         * @param uiArgs 初始化参数
         */
        getOrCreateUI(uiId, processCallback, completeCallback, uiArgs) {
          var _this$UIConf$uiId;
          // 如果找到缓存对象，则直接返回
          let uiView = this.UICache[uiId];
          if (uiView) {
            completeCallback(uiView);
            return;
          }

          // 找到UI配置
          let uiPath = this.UIConf[uiId].prefab;
          if (null == uiPath) {
            log(`getOrCreateUI ${uiId} faile, prefab conf not found!`);
            completeCallback(null);
            return;
          }
          let bundle = ((_this$UIConf$uiId = this.UIConf[uiId]) == null ? void 0 : _this$UIConf$uiId.bundle) || 'resources';
          resLoader.load(bundle, uiPath, processCallback, (err, prefab) => {
            // 检查加载资源错误
            if (err) {
              log(`getOrCreateUI loadRes ${uiId} faile, bundle: ${bundle}, path: ${uiPath}, error: ${err}`);
              completeCallback(null);
              return;
            }
            // 检查实例化错误
            let uiNode = instantiate(prefab);
            if (null == uiNode) {
              log(`getOrCreateUI instantiate ${uiId} faile, bundle: ${bundle}, path: ${uiPath}`);
              completeCallback(null);
              prefab.decRef();
              return;
            }
            // 检查组件获取错误
            uiView = uiNode.getComponent(UIView);
            if (null == uiView) {
              log(`getOrCreateUI getComponent ${uiId} faile, bundle: ${bundle}, path: ${uiPath}`);
              uiNode.destroy();
              completeCallback(null);
              prefab.decRef();
              return;
            }
            // 异步加载UI预加载的资源
            this.autoLoadRes(uiView, () => {
              uiView.init(uiArgs);
              completeCallback(uiView);
              uiView.cacheAsset(prefab);
            });
          });
        }

        /**
         * UI被打开时回调，对UI进行初始化设置，刷新其他界面的显示，并根据
         * @param uiId 哪个界面被打开了
         * @param uiView 界面对象
         * @param uiInfo 界面栈对应的信息结构
         * @param uiArgs 界面初始化参数
         */
        onUIOpen(uiId, uiView, uiInfo, uiArgs) {
          if (null == uiView) {
            return;
          }
          // 激活界面
          uiInfo.uiView = uiView;
          uiView.node.active = true;
          let uiCom = uiView.getComponent(UITransform);
          if (!uiCom) {
            uiCom = uiView.addComponent(UITransform);
          }

          // 快速关闭界面的设置，绑定界面中的background，实现快速关闭
          if (uiView.quickClose) {
            let backGround = uiView.node.getChildByName('background');
            if (!backGround) {
              backGround = new Node();
              backGround.name = 'background';
              let uiCom = backGround.addComponent(UITransform);
              uiCom.setContentSize(view.getVisibleSize());
              uiView.node.addChild(backGround);
              uiCom.priority = -1;
            }
            backGround.targetOff(Node.EventType.TOUCH_START);
            backGround.on(Node.EventType.TOUCH_START, event => {
              event.propagationStopped = true;
              this.close(uiView);
            }, backGround);
          }

          // 添加到场景中
          if (uiId == UIID.MainView) {
            this.uiLayer0.addChild(uiView.node);
          } else {
            this.uiLayer1.addChild(uiView.node);
          }
          uiCom.priority = uiInfo.zOrder || this.UIStack.length;

          // 刷新其他UI
          this.updateUI();

          // 从那个界面打开的
          let fromUIID = 0;
          if (this.UIStack.length > 1) {
            fromUIID = this.UIStack[this.UIStack.length - 2].uiId;
          }

          // 打开界面之前回调
          if (this.uiOpenBeforeDelegate) {
            this.uiOpenBeforeDelegate(uiId, fromUIID);
          }

          // 执行onOpen回调
          uiView.onOpen(fromUIID, uiArgs);
          this.autoExecAnimation(uiView, UiAni.Open, () => {
            uiView.onOpenAniOver();
            if (this.uiOpenDelegate) {
              this.uiOpenDelegate(uiId, fromUIID);
            }
          });
        }

        /** 打开界面并添加到界面栈中 */
        async open(uiId, uiArgs = null, progressCallback = null) {
          let uiInfo = {
            uiId: uiId,
            uiArgs: uiArgs,
            uiView: null
          };
          if (this.isOpening || this.isClosing) {
            // 插入待打开队列
            this.UIOpenQueue.push(uiInfo);
            return;
          }
          let uiIndex = this.getUIIndex(uiId);
          if (-1 != uiIndex) {
            // 重复打开了同一个界面，直接回到该界面
            this.closeToUI(uiId, uiArgs);
            return;
          }

          // 设置UI的zOrder
          uiInfo.zOrder = this.UIStack.length + 1;
          this.UIStack.push(uiInfo);
          this.isOpening = true;

          // 先屏蔽点击
          if (this.UIConf[uiId].preventTouch) {
            uiInfo.preventNode = await this.preventTouch(uiInfo.zOrder);
          }

          // 预加载资源，并在资源加载完成后自动打开界面
          this.getOrCreateUI(uiId, progressCallback, uiView => {
            // 如果界面已经被关闭或创建失败
            if (uiInfo.isClose || null == uiView) {
              log(`getOrCreateUI ${uiId} faile!
                        close state : ${uiInfo.isClose} , uiView : ${uiView}`);
              this.isOpening = false;
              if (uiInfo.preventNode) {
                uiInfo.preventNode.destroy();
                uiInfo.preventNode = null;
              }
              return;
            }

            // 打开UI，执行配置
            this.onUIOpen(uiId, uiView, uiInfo, uiArgs);
            this.isOpening = false;
            this.autoExecNextUI();
          }, uiArgs);
        }

        /** 替换栈顶界面 */
        replace(uiId, uiArgs = null) {
          this.close(this.UIStack[this.UIStack.length - 1].uiView);
          this.open(uiId, uiArgs);
        }

        /**
         * 关闭当前界面
         * @param closeUI 要关闭的界面
         */
        close(closeUI) {
          let uiCount = this.UIStack.length;
          if (uiCount < 1 || this.isClosing || this.isOpening) {
            if (closeUI) {
              // 插入待关闭队列
              this.UICloseQueue.push(closeUI);
            }
            return;
          }
          let uiInfo;
          if (closeUI) {
            for (let index = this.UIStack.length - 1; index >= 0; index--) {
              let ui = this.UIStack[index];
              if (ui.uiView === closeUI) {
                uiInfo = ui;
                this.UIStack.splice(index, 1);
                break;
              }
            }
          } else {
            uiInfo = this.UIStack.pop();
          }
          // 找不到这个UI
          if (uiInfo === undefined) {
            return;
          }

          // 关闭当前界面
          let uiId = uiInfo.uiId;
          let uiView = uiInfo.uiView;
          uiInfo.isClose = true;

          // 回收遮罩层
          if (uiInfo.preventNode) {
            uiInfo.preventNode.destroy();
            uiInfo.preventNode = null;
          }
          if (!uiView) {
            return;
          }
          let preUIInfo = this.UIStack[uiCount - 2];
          // 处理显示模式
          this.updateUI();
          let close = () => {
            this.isClosing = false;
            // 显示之前的界面
            if (preUIInfo && preUIInfo.uiView && this.isTopUI(preUIInfo.uiId)) {
              // 如果之前的界面弹到了最上方（中间有肯能打开了其他界面）
              preUIInfo.uiView.node.active = true;
              // 回调onTop
              preUIInfo.uiView.onTop(uiId, uiView.onClose());
            } else {
              uiView.onClose();
            }
            if (this.uiCloseDelegate) {
              this.uiCloseDelegate(uiId);
            }
            if (uiView.cache) {
              this.UICache[uiId] = uiView;
              uiView.node.removeFromParent();
              log(`uiView removeFromParent ${uiInfo.uiId}`);
            } else {
              uiView.releaseAssets();
              uiView.node.destroy();
              log(`uiView destroy ${uiInfo.uiId}`);
            }
            this.autoExecNextUI();
          };
          // 执行关闭动画
          this.autoExecAnimation(uiView, UiAni.Close, close);
        }

        /** 关闭所有界面 */
        closeAll() {
          // 不播放动画，也不清理缓存
          for (const uiInfo of this.UIStack) {
            uiInfo.isClose = true;
            if (uiInfo.preventNode) {
              uiInfo.preventNode.destroy();
              uiInfo.preventNode = null;
            }
            if (uiInfo.uiView) {
              uiInfo.uiView.onClose();
              uiInfo.uiView.releaseAssets();
              uiInfo.uiView.node.destroy();
            }
          }
          if (this.toastView) {
            this.toastView.onClose();
            this.toastView.releaseAssets();
            this.toastView.node.destroy();
          }
          this.UIOpenQueue = [];
          this.UICloseQueue = [];
          this.UIStack = [];
          this.isOpening = false;
          this.isClosing = false;
        }

        /**
         * 关闭界面，一直关闭到顶部为uiId的界面，为避免循环打开UI导致UI栈溢出
         * @param uiId 要关闭到的uiId（关闭其顶部的ui）
         * @param uiArgs 打开的参数
         * @param bOpenSelf 
         */
        closeToUI(uiId, uiArgs, bOpenSelf = true) {
          let idx = this.getUIIndex(uiId);
          if (-1 == idx) {
            return;
          }
          idx = bOpenSelf ? idx : idx + 1;
          for (let i = this.UIStack.length - 1; i >= idx; --i) {
            let uiInfo = this.UIStack.pop();
            if (!uiInfo) {
              continue;
            }
            let uiId = uiInfo.uiId;
            let uiView = uiInfo.uiView;
            uiInfo.isClose = true;

            // 回收屏蔽层
            if (uiInfo.preventNode) {
              uiInfo.preventNode.destroy();
              uiInfo.preventNode = null;
            }
            if (this.uiCloseDelegate) {
              this.uiCloseDelegate(uiId);
            }
            if (uiView) {
              uiView.onClose();
              if (uiView.cache) {
                this.UICache[uiId] = uiView;
                uiView.node.removeFromParent();
              } else {
                uiView.releaseAssets();
                uiView.node.destroy();
              }
            }
          }
          this.updateUI();
          this.UIOpenQueue = [];
          this.UICloseQueue = [];
          bOpenSelf && this.open(uiId, uiArgs);
        }

        /** 清理界面缓存 */
        clearCache() {
          for (const key in this.UICache) {
            let ui = this.UICache[key];
            if (isValid(ui.node)) {
              if (isValid(ui)) {
                ui.releaseAssets();
              }
              ui.node.destroy();
            }
          }
          this.UICache = {};
        }

        /******************** UI的便捷接口 *******************/
        isTopUI(uiId) {
          if (this.UIStack.length == 0) {
            return false;
          }
          return this.UIStack[this.UIStack.length - 1].uiId == uiId;
        }
        getUI(uiId) {
          for (let index = 0; index < this.UIStack.length; index++) {
            const element = this.UIStack[index];
            if (uiId == element.uiId) {
              return element.uiView;
            }
          }
          return null;
        }
        getTopUI() {
          if (this.UIStack.length > 0) {
            return this.UIStack[this.UIStack.length - 1].uiView;
          }
          return null;
        }
        getUIIndex(uiId) {
          for (let index = 0; index < this.UIStack.length; index++) {
            const element = this.UIStack[index];
            if (uiId == element.uiId) {
              return index;
            }
          }
          return -1;
        }
        showToast(msg) {
          this.getOrCreateUI(UIID.Toast, null, uiView => {
            if (null == uiView || !uiView.node) {
              return;
            }
            if (!this.toastLayer) {
              console.warn("toastLayer is null");
              return;
            }
            this.toastLayer.addChild(uiView.node);
            uiView.onOpen(0, {
              content: msg
            });
            this.toastView = uiView;
          }, null);
        }
        hideToast(toastId) {
          var _this$toastView, _this$toastView2;
          (_this$toastView = this.toastView) == null || _this$toastView.onClose();
          (_this$toastView2 = this.toastView) == null || _this$toastView2.node.removeFromParent();
          this.toastView = null;
        }
        showGuide(guideInfo) {
          let guideView = this.getUI(UIID.GuideTips);
          if (guideView) {
            guideView.updatePage(guideInfo);
          } else {
            this.open(UIID.GuideTips, guideInfo);
          }
        }
        hideGuide() {
          let guideView = this.getUI(UIID.GuideTips);
          if (guideView) {
            this.close(guideView);
          }
        }

        // sg
        openPictureSelectView() {
          let selectCfg = GameDataManager.instance.mainConfig.sg.select;
          let specialNum = selectCfg.special_num;
          let sgData = GameDataManager.instance.gameData.sgData;
          if (++sgData.selectFreqCount >= selectCfg.special_frequency.frequency) {
            specialNum = selectCfg.special_frequency.show_num;
            sgData.selectFreqCount = 0;
          }
          let listNormal = GameDataManager.instance.getAvailablePictureList(4 - specialNum, false);
          let listSpecial = GameDataManager.instance.getAvailablePictureList(specialNum, true);
          let infoList = listNormal.concat(listSpecial);
          this.open(UIID.PictureSelectView, {
            infoList: infoList
          });
        }
      }
      exports('UIManager', UIManager);
      UIManager._instance = null;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ui-screen-adapter.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './log-util.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, _decorator, Component, sys, view, UITransform, LogUtil;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
      sys = module.sys;
      view = module.view;
      UITransform = module.UITransform;
    }, function (module) {
      LogUtil = module.LogUtil;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3;
      cclegacy._RF.push({}, "2cbe6ORtZ9AWrbGQtg+rBDZ", "ui-screen-adapter", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let UIScreenAdapter = exports('UIScreenAdapter', (_dec = ccclass('UIScreenAdapter'), _dec2 = property({
        type: Node,
        tooltip: 'Widget组件不要设置纵向对齐'
      }), _dec3 = property({
        type: Node,
        tooltip: '顶部UI'
      }), _dec4 = property(Node), _dec(_class = (_class2 = class UIScreenAdapter extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "content", _descriptor, this);
          _initializerDefineProperty(this, "topUI", _descriptor2, this);
          _initializerDefineProperty(this, "topBg", _descriptor3, this);
        }
        start() {
          this.scheduleOnce(() => {
            this.adaptToScreen();
          }, 0);
        }
        adaptToScreen() {
          let safeArea = sys.getSafeAreaRect();
          let winSize = view.getVisibleSize();

          // 内容区域适配
          this.content && this.content.getComponent(UITransform).setContentSize(winSize.width, safeArea.height);
          // 顶部背景
          let topBgHeight = winSize.height - (safeArea.y + safeArea.height);
          this.topBg && LogUtil.log(`(${this.node.name})ScreenAdapter-topBgHeight1`, topBgHeight);
          if (this.topUI) {
            topBgHeight += this.topUI.getComponent(UITransform).contentSize.height + 70;
          }
          if (this.topBg) {
            LogUtil.log(`(${this.node.name})ScreenAdapter-topBgHeight2`, topBgHeight);
            // this.topBg.getComponent(UITransform).setContentSize(winSize.width, topBgHeight);
            this.topBg.getComponent(UITransform).height = topBgHeight;
          }
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "content", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "topUI", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "topBg", [_dec4], {
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

System.register("chunks:///_virtual/ui-util.ts", ['cc', './stage-constants.ts'], function (exports) {
  var cclegacy, director, UITransform, StageConstants;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      director = module.director;
      UITransform = module.UITransform;
    }, function (module) {
      StageConstants = module.StageConstants;
    }],
    execute: function () {
      cclegacy._RF.push({}, "7dbf6RKwoZIYKsfpXIwM5Eh", "ui-util", undefined);
      class UIUtil {
        static calculateDistance(pos1, pos2) {
          const dx = pos2.x - pos1.x;
          const dy = pos2.y - pos1.y;
          return Math.sqrt(dx * dx + dy * dy);
        }
        static calcMoveDuration(startPos, endPos, speed = StageConstants.MOVE_SPEED) {
          const distance = UIUtil.calculateDistance(startPos, endPos);
          let baseTime = distance / speed;
          let speedMultiplier = 1 + distance / 8000; // 调整分母为调整距离与速度变化的关系（分母越小，影响越大）
          let optimizedTime = baseTime / speedMultiplier;
          // 确保时间不会太短，设置最小时间限制
          let minTime = 0.1; // 最小0.1秒
          return Math.max(optimizedTime, minTime);
        }

        /**
         * 将屏幕坐标转换为某节点的坐标系(用于点击事件的坐标转换)
         * @param sPos 屏幕（点击）坐标
         * @param parent 目标坐标系的父节点
         * @param root 调用组件的根节点（一般传 this.node）
         * @returns 本地坐标
         */
        static convertScreenPosToLocal(sPos, parent, root) {
          let uiCamera = director.root.batcher2D.getFirstRenderCamera(root);
          uiCamera.screenToWorld(sPos, sPos);
          let lPos = parent.getComponent(UITransform).convertToNodeSpaceAR(sPos);
          return lPos;
        }
      }
      exports('UIUtil', UIUtil);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ui-view.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './res-keeper.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Enum, Animation, _decorator, ResKeeper;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Enum = module.Enum;
      Animation = module.Animation;
      _decorator = module._decorator;
    }, function (module) {
      ResKeeper = module.ResKeeper;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _class3;
      cclegacy._RF.push({}, "9230bZzJs5EtofShtsOAGnk", "ui-view", undefined);

      /**
       * UIView界面基础类
       * 
       * 1. 快速关闭与屏蔽点击的选项配置
       * 2. 界面缓存设置（开启后界面关闭不会被释放，以便下次快速打开）
       * 3. 界面显示类型配置
       * 
       * 4. 加载资源接口（随界面释放自动释放），this.loadRes(xxx)
       * 5. 由UIManager释放
       * 
       * 5. 界面初始化回调（只调用一次）
       * 6. 界面打开回调（每次打开回调）
       * 7. 界面打开动画播放结束回调（动画播放完回调）
       * 8. 界面关闭回调
       * 9. 界面置顶回调
       */

      const {
        ccclass,
        property
      } = _decorator;

      /** 界面展示类型 */
      let UIShowTypes = exports('UIShowTypes', /*#__PURE__*/function (UIShowTypes) {
        UIShowTypes[UIShowTypes["UIFullScreen"] = 0] = "UIFullScreen";
        UIShowTypes[UIShowTypes["UIAddition"] = 1] = "UIAddition";
        UIShowTypes[UIShowTypes["UISingle"] = 2] = "UISingle";
        return UIShowTypes;
      }({})); // 单界面显示，只显示当前界面和背景界面，性能较好
      let UIView = exports('UIView', (_dec = property({
        type: Enum(UIShowTypes)
      }), _dec2 = property(Animation), ccclass(_class = (_class2 = (_class3 = class UIView extends ResKeeper {
        constructor(...args) {
          super(...args);
          /** 快速关闭 */
          _initializerDefineProperty(this, "quickClose", _descriptor, this);
          /** 屏蔽点击选项 在UIConf设置屏蔽点击*/
          // @property
          // preventTouch: boolean = true;
          /** 缓存选项 */
          _initializerDefineProperty(this, "cache", _descriptor2, this);
          /** 播放通用UI动画 */
          /** 界面显示类型 */
          _initializerDefineProperty(this, "showType", _descriptor3, this);
          /** 用于播放UI开关动画的组件，绑定在子节点下面*/
          _initializerDefineProperty(this, "animComp", _descriptor4, this);
          /** 界面id */
          this.UIid = 0;
          this.aniOverCallback = null;
        }
        onEnable() {
          if (this.animComp) {
            this.animComp.on(Animation.EventType.FINISHED, () => {
              this.aniOverCallback && this.aniOverCallback();
            }, this);
          }
        }
        onDisable() {
          if (this.animComp) {
            this.animComp.off(Animation.EventType.FINISHED);
          }
        }

        /********************** UI的回调 ***********************/
        /**
         * 当界面被创建时回调，生命周期内只调用
         * @param args 可变参数
         */
        init(...args) {}

        /**
         * 当界面被打开时回调，每次调用Open时回调
         * @param fromUI 从哪个UI打开的
         * @param args 可变参数
         */
        onOpen(fromUI, ...args) {}

        /**
         * 每次界面Open动画播放完毕时回调
         */
        onOpenAniOver() {}

        /**
         * 当界面被关闭时回调，每次调用Close时回调
         * 返回值会传递给下一个界面
         */
        onClose() {}

        /**
         * 当界面被置顶时回调，Open时并不会回调该函数
         * @param preID 前一个ui
         * @param args 可变参数，
         */
        onTop(preID, ...args) {}
      }, _class3.uiIndex = 0, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "quickClose", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "cache", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "showType", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return UIShowTypes.UISingle;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "animComp", [_dec2], {
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

System.register("chunks:///_virtual/union-fetch-agent.ts", ['cc', './config.ts', './game-data-manager.ts', './time-agent.ts', './request-manager.ts', './log-util.ts', './storage-agent.ts', './config-agent.ts', './data-agent.ts'], function (exports) {
  var cclegacy, Config, GameDataManager, TimeAgent, ReqeustManager, LogUtil, StorageAgent, ConfigAgent, ConfigType, DataType, DataAgent;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      Config = module.Config;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }, function (module) {
      TimeAgent = module.TimeAgent;
    }, function (module) {
      ReqeustManager = module.ReqeustManager;
    }, function (module) {
      LogUtil = module.LogUtil;
    }, function (module) {
      StorageAgent = module.StorageAgent;
    }, function (module) {
      ConfigAgent = module.ConfigAgent;
      ConfigType = module.ConfigType;
    }, function (module) {
      DataType = module.DataType;
      DataAgent = module.DataAgent;
    }],
    execute: function () {
      cclegacy._RF.push({}, "304fey0KSBBIYSZl9zAnjMK", "union-fetch-agent", undefined);
      class UnionFetchAgent {
        /*
        需要notify的数据（一般是bundle），再保存到数据后，再notify
        主包里面使用的数据，直接init即可
        */
        static fetchUnionData() {
          const uid = StorageAgent.getUid();
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
                        console.log(`Fetch Union-MainConfig: ${JSON.stringify(config)}`);
                        GameDataManager.instance.mainConfig = ConfigAgent.getConfig(ConfigType.Main);
                      } else if (category == ConfigType.Base) {
                        console.log(`Fetch Union-BaseConfig: ${JSON.stringify(config)}`);
                        GameDataManager.instance.baseConfig = ConfigAgent.getConfig(ConfigType.Base);
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
                      console.log(`Fetch Union-GameData: ${JSON.stringify(gameData)}`);
                      GameDataManager.instance.initDataFromServer(gameData, savePlayerData);
                      DataAgent.saveData(DataType.Game, gameData);
                    }
                    if (playerData[DataType.Player]) {
                      const pData = JSON.parse(playerData[DataType.Player]);
                      console.log(`Fetch Union-GainData: ${JSON.stringify(pData)}`);
                      DataAgent.saveData(DataType.Gain, pData);
                    }
                    DataAgent.saveData(DataType.Player, savePlayerData);
                  }
                }
              }
              resolve();
            }).catch(error => {
              LogUtil.error('error fetchUnionData:', error);
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

System.register("chunks:///_virtual/welcome-hf-start.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './front-line.ts', './res-version-config.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, ProgressBar, Label, _decorator, Component, sp, sys, director, assetManager, FrontLine, FrontLineEvent, res_version;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      ProgressBar = module.ProgressBar;
      Label = module.Label;
      _decorator = module._decorator;
      Component = module.Component;
      sp = module.sp;
      sys = module.sys;
      director = module.director;
      assetManager = module.assetManager;
    }, function (module) {
      FrontLine = module.FrontLine;
      FrontLineEvent = module.FrontLineEvent;
    }, function (module) {
      res_version = module.res_version;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6;
      cclegacy._RF.push({}, "47ecangTVxCa7EltStD+FU7", "welcome-hf-start", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      const HOT_UPDATE_TIME_COST = exports('HOT_UPDATE_TIME_COST', 'hot_update_time_cost');
      const HOT_UPDATE_TIMESTAMP_2 = exports('HOT_UPDATE_TIMESTAMP_2', 'hot_update_timestamp_2');
      let WelcomeHfStart = exports('WelcomeHfStart', (_dec = ccclass('WelcomeHfStart'), _dec2 = property(Node), _dec3 = property(ProgressBar), _dec4 = property(Label), _dec5 = property(Label), _dec6 = property(Label), _dec7 = property(Label), _dec(_class = (_class2 = class WelcomeHfStart extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "skeletonNode", _descriptor, this);
          _initializerDefineProperty(this, "progressBar", _descriptor2, this);
          _initializerDefineProperty(this, "lblProgress", _descriptor3, this);
          _initializerDefineProperty(this, "lblLoading", _descriptor4, this);
          _initializerDefineProperty(this, "lblVersion", _descriptor5, this);
          _initializerDefineProperty(this, "lblWwyCode", _descriptor6, this);
          this.HOT_UPDATE_THRESHOLD = 5 * 60 * 1000;
          // 5分钟内的更新认为是刚更新过
          this.res_version = 0;
          this.dotCount = 0;
        }
        onLoad() {
          this.progressBar.progress = 0;
          this.lblProgress.string = '0%';
          const frontLine = this.node.getComponent(FrontLine);
          this.lblVersion.string = res_version;
          if (this.skeletonNode) {
            const trackEntry = this.skeletonNode.getComponent(sp.Skeleton).setAnimation(0, 'sggirl-1-2', true);
          }
          console.log('OjaiTest-HfStart-welcome-hf-start-onload');
          // 检查是否刚进行过热更新
          if (this.isRecentlyUpdated()) {
            console.log('OjaiTest-HfStart-检测到最近刚进行过热更新，直接进入游戏');
            this.enterGame();
            return;
          }

          // 发起热更新检查
          if (sys.isNative) {
            this.startHotUpdate();
          } else {
            this.simulateHotUpdate();
          }
        }
        start() {
          this.dotCount = 0;
          this.schedule(this.updateForLoadingLabel.bind(this), 0.3);
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
          const lastUpdateTime = sys.localStorage.getItem(HOT_UPDATE_TIMESTAMP_2);
          if (!lastUpdateTime) {
            return false;
          }
          const timestamp = parseInt(lastUpdateTime);
          const currentTime = Date.now();
          const timeDiff = currentTime - timestamp;
          console.log(`OjaiTest-HfStart-距离上次更新时间: ${timeDiff}ms`);
          return timeDiff < this.HOT_UPDATE_THRESHOLD;
        }

        /**
         * 记录热更新时间
         */
        recordUpdateTime() {
          sys.localStorage.setItem(HOT_UPDATE_TIMESTAMP_2, Date.now().toString());
          console.log('OjaiTest-HfStart-记录热更新时间');
        }

        /**
         * 模拟热更新流程（非原生环境）
         */
        simulateHotUpdate() {
          console.log('OjaiTest-HfStart-开始模拟热更新');
          let progress = 0;
          const totalTime = 3000; // 3秒
          const updateInterval = 50; // 每50ms更新一次
          const progressIncrement = updateInterval / totalTime * 100; // 每次更新的进度增量

          const updateProgressInterval = setInterval(() => {
            progress += progressIncrement;

            // 确保进度不超过100%
            if (progress >= 100) {
              progress = 100;
              clearInterval(updateProgressInterval);
              console.log('OjaiTest-HfStart-模拟热更新完成');
              this.enterGame();
            }

            // 调用进度更新函数
            this.updateProgress(progress / 100);
          }, updateInterval);
        }

        /**
         * 开始热更新流程
         */
        startHotUpdate() {
          let startTime = Date.now();
          console.log('OjaiTest-HfStart-开始热更新检查');
          const frontLine = this.node.getComponent(FrontLine);
          if (!frontLine) {
            console.error('OjaiTest-HfStart-FrontLine组件未找到');
            return;
          }
          let version = res_version;
          const versionParts = version.split('.');
          this.res_version = parseInt(versionParts[versionParts.length - 1]);
          this.lblVersion.string = `${version}-${this.res_version + 1}`;
          frontLine.start((success, message) => {
            console.log('OjaiTest-HfStart-热更新回调-success-msg:', success, message);
            if (success) {
              console.log('OjaiTest-HfStart-热更新成功');
              let endTime = Date.now();
              console.log(`OjaiTest-HfStart-热更新成功，耗时：${endTime - startTime}ms`);
              let timeCost = sys.localStorage.getItem(HOT_UPDATE_TIME_COST);
              if (!timeCost) {
                timeCost = 0;
              } else {
                try {
                  timeCost = parseFloat(timeCost);
                } catch (error) {
                  console.error('timeCost is not a number');
                  timeCost = 0;
                }
              }
              sys.localStorage.setItem(HOT_UPDATE_TIME_COST, (timeCost + (endTime - startTime) / 1000).toFixed(2));
            } else {
              console.log('OjaiTest-HfStart-热更新失败', message);
              if (this.res_version > 1) {
                this.enterGame();
              }
            }
          });
        }

        /**
         * 更新进度回调
         */
        updateProgress(progress) {
          this.unschedule(this.updateForLoadingLabel.bind(this));
          this.progressBar.progress = progress % 0.1 * 10;
          let stage = Math.floor(progress * 10);
          this.lblLoading.string = `Updating resources (${stage}/10)`;
          this.lblProgress.string = `${Math.floor(this.progressBar.progress * 100)}%`;
        }

        /**
         * 热更新成功回调
         */
        onUpdateSuccess() {
          console.log('OjaiTest-HfStart-热更新成功，准备重启游戏');
          this.recordUpdateTime();
          // 重启游戏，会重新回到这个场景
          // 注意：game.restart() 会在 front-line.ts 的 onUpdateSuccess 中被调用
        }

        /**
         * 热更新失败回调
         */
        onUpdateFailed() {
          console.log('OjaiTest-HfStart-热更新失败，继续进入游戏');
          if (this.res_version > 1) {
            this.enterGame();
          }
        }

        /**
         * 已经是最新版本回调
         */
        onAlreadyUpToDate() {
          console.log('OjaiTest-HfStart-已经是最新版本，直接进入游戏');
          if (this.res_version > 1) {
            this.enterGame();
          }
        }

        /**
         * 热更新错误回调
         */
        onUpdateError() {
          console.log('OjaiTest-HfStart-热更新出错，继续进入游戏');
          this.enterGame();
        }

        /**
         * 进入游戏主场景
         */
        async enterGame() {
          console.log('OjaiTest-HfStart-进入B游戏主场景');
          await this.loadBundles();
          director.loadScene('welcome');
        }
        updateForLoadingLabel() {
          let suffix = '.'.repeat(this.dotCount);
          const text = 'Loading' + suffix;
          this.lblLoading.string = text;

          // 增加点数，最多3个，然后循环重置
          this.dotCount = (this.dotCount + 1) % 4;
        }
        async loadBundles() {
          const bundles = ['bundle-beyond', 'bundle-sg'];
          const promises = [];
          for (let i = 0; i < bundles.length; i++) {
            const bundleName = bundles[i];
            const promise = new Promise((resolve, reject) => {
              assetManager.loadBundle(bundleName, (err, bundle) => {
                if (err) {
                  console.error('load bundle error:', bundleName, err);
                  resolve();
                  return;
                }
                resolve();
                console.log('load bundle success:', bundleName);
              });
            });
            promises.push(promise);
          }
          await Promise.all(promises);
          console.log('all bundles loaded');
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "skeletonNode", [_dec2], {
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
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "lblProgress", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "lblLoading", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "lblVersion", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "lblWwyCode", [_dec7], {
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

System.register("chunks:///_virtual/welcome.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './res-manager.ts', './box-pool.ts', './audio-manager.ts', './game-constants.ts', './config.ts', './union-fetch-agent.ts', './game-data-manager.ts', './report-agent.ts', './connect-agent.ts', './bridge-manager.ts', './log-util.ts', './mount-manager.ts', './mount-point.ts', './config-agent.ts', './storage-agent.ts', './stage-build-agent.ts', './time-agent.ts', './progress-bar-ctrl.ts', './res-version-config.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, Label, _decorator, Component, profiler, sp, director, assetManager, ResManager, BoxPool, AudioManager, AudioUrl, WelcomeDesc, Config, UnionFetchAgent, GameDataManager, ReportAgent, CustomReportEvent, LoadingActionParam, ConnectAgent, BridgeManager, LogUtil, MountManager, MountPoint, ConfigAgent, ConfigType, StorageAgent, StageBuildAgent, TimeAgent, ProgressBarCtrl, res_version;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      Label = module.Label;
      _decorator = module._decorator;
      Component = module.Component;
      profiler = module.profiler;
      sp = module.sp;
      director = module.director;
      assetManager = module.assetManager;
    }, function (module) {
      ResManager = module.ResManager;
    }, function (module) {
      BoxPool = module.BoxPool;
    }, function (module) {
      AudioManager = module.AudioManager;
    }, function (module) {
      AudioUrl = module.AudioUrl;
      WelcomeDesc = module.WelcomeDesc;
    }, function (module) {
      Config = module.Config;
    }, function (module) {
      UnionFetchAgent = module.UnionFetchAgent;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }, function (module) {
      ReportAgent = module.ReportAgent;
      CustomReportEvent = module.CustomReportEvent;
      LoadingActionParam = module.LoadingActionParam;
    }, function (module) {
      ConnectAgent = module.ConnectAgent;
    }, function (module) {
      BridgeManager = module.BridgeManager;
    }, function (module) {
      LogUtil = module.LogUtil;
    }, function (module) {
      MountManager = module.MountManager;
    }, function (module) {
      MountPoint = module.MountPoint;
    }, function (module) {
      ConfigAgent = module.ConfigAgent;
      ConfigType = module.ConfigType;
    }, function (module) {
      StorageAgent = module.StorageAgent;
    }, function (module) {
      StageBuildAgent = module.StageBuildAgent;
    }, function (module) {
      TimeAgent = module.TimeAgent;
    }, function (module) {
      ProgressBarCtrl = module.ProgressBarCtrl;
    }, function (module) {
      res_version = module.res_version;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6;
      cclegacy._RF.push({}, "2e59eFdxbFNdaBdeZEvNZAX", "welcome", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let Welcome = exports('Welcome', (_dec = ccclass('welcome'), _dec2 = property(Node), _dec3 = property(ProgressBarCtrl), _dec4 = property(Label), _dec5 = property(Label), _dec6 = property(Label), _dec7 = property(Label), _dec(_class = (_class2 = class Welcome extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "skeletonNode", _descriptor, this);
          _initializerDefineProperty(this, "progressBar", _descriptor2, this);
          _initializerDefineProperty(this, "lblLoading", _descriptor3, this);
          _initializerDefineProperty(this, "lblDesc", _descriptor4, this);
          _initializerDefineProperty(this, "lblWwyCode", _descriptor5, this);
          _initializerDefineProperty(this, "lblVersion", _descriptor6, this);
        }
        async start() {
          // if (!Config.DEBUG) {

          // }
          profiler.hideStats();
          AudioManager.instance.playMusicLoop(AudioUrl.BGM);
          if (GameDataManager.instance.localData.isFirstLaunch) {
            GameDataManager.instance.localData.isFirstLaunch = false;
            ReportAgent.reportCustomEvent(CustomReportEvent.USER_LIFECYCLE_MILESTONE, {
              action: 'star_first'
            });
          }
          this.initDesc();

          // 获取版本号并拆分
          this.lblVersion.string = res_version;
          if (this.skeletonNode) {
            const trackEntry = this.skeletonNode.getComponent(sp.Skeleton).setAnimation(0, 'sggirl-1-2', true);
          }
          this.schedule(this.updateLoadingLabel, 0.3);
          this.progressBar.setConfig(this.onProgressComplete.bind(this), 45, 80);
          BridgeManager.instance.setupNativeEventListner(async () => {
            this.progressBar.setProgress(0);
            this.progressBar.lock(30);

            // init
            let time0 = TimeAgent.instance.getTime();
            this.reportLoading("init", "start", time0);
            ConnectAgent.init();
            let time1 = TimeAgent.instance.getTime();
            this.reportLoading("init", "end", time0, time1);

            // report after ConnectAgent.init
            if (GameDataManager.instance.localData.isFirstLoading) {
              GameDataManager.instance.localData.isFirstLoading = false;
              ReportAgent.reportCustomEvent(CustomReportEvent.USER_LIFECYCLE_MILESTONE, {
                action: 'loading_first'
              });
              ReportAgent.reportLoadingAction(LoadingActionParam.REGISTER);
            }
            ReportAgent.reportLoadingAction(LoadingActionParam.LAUNCH_APP);

            // 获取配置
            await UnionFetchAgent.fetchUnionData();
            Config.INIT_FETCH_DATA = true;
            // 通知配置更新
            this.notifyAfterFetchData();
            this.progressBar.lock(70);
            await this.loadBundles();
            this.progressBar.lock(90);
            let wwyCode = GameDataManager.instance.getInviteCode();
            this.lblWwyCode.string = wwyCode !== '' ? `wwy-${GameDataManager.instance.getInviteCode()}` : '';
            await this.preloadRes();
            this.scheduleOnce(() => {
              GameDataManager.instance.updateLoginDayNum(Date.now());
              this.progressBar.lock(100);
            }, 1.5);
          });
        }
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
          }, 0.3);
        }
        onProgressComplete() {
          director.loadScene('map');
        }
        async preloadRes() {
          await ResManager.instance.preload();
          BoxPool.instance.preload();
          let lv = GameDataManager.instance.gameData.level;
          await StageBuildAgent.instance.preloadStageConfig(lv);
        }
        async loadBundles() {
          const bundles = ['bundle-beyond', 'bundle-sg'];
          const promises = [];
          for (let i = 0; i < bundles.length; i++) {
            const bundleName = bundles[i];
            const promise = new Promise((resolve, reject) => {
              assetManager.loadBundle(bundleName, (err, bundle) => {
                if (err) {
                  console.error('load bundle error:', bundleName, err);
                  resolve();
                  return;
                }
                resolve();
                LogUtil.log('load bundle success:', bundleName);
              });
            });
            promises.push(promise);
          }
          await Promise.all(promises);
          LogUtil.log('all bundles loaded');
        }
        notifyAfterFetchData() {
          MountManager.instance.notify(MountPoint.RemoteWebConfigUpdated, ConfigAgent.getConfig(ConfigType.Web));
        }
        initDesc() {
          let key = 'welcome_desc_id';
          let descId = StorageAgent.load(key) || 0;
          let str = WelcomeDesc[descId];
          if (!str) {
            descId = 0;
            str = WelcomeDesc[descId];
          }
          this.lblDesc.string = str;
          StorageAgent.save(key, descId + 1);
        }

        // Sg
        async loadSg() {
          try {
            console.log('loadSg--start');
            let gdMgr = GameDataManager.instance;
            let time0 = TimeAgent.instance.getTime();
            this.reportLoading("load_sg", "start", time0);
            let cacheSize = 8;
            let sgData = gdMgr.gameData.sgData;
            let needNum_n = cacheSize - sgData.unselectedNormalPicInfoList.length;
            needNum_n = Math.min(needNum_n, 4);
            let count_n = 0;
            let list = [];
            if (needNum_n > 0) {
              let list_n = gdMgr.getUncachedPictureList(needNum_n, false);
              if (list_n.length < needNum_n) {
                let promiseFetch = MountManager.instance.notify(MountPoint.RemoteFetchIllustration, {
                  total: 10,
                  adCount: 0
                })[0];
                if (promiseFetch instanceof Promise) {
                  await promiseFetch;
                }
                list_n = gdMgr.getUncachedPictureList(needNum_n, false);
              }
              list = list.concat(list_n);
              if (Config.DEBUG) {
                count_n = list_n.length;
              }
            }
            let needNum_s = cacheSize - gdMgr.gameData.sgData.unselectedSpecialPicInfoList.length - needNum_n;
            needNum_s = Math.min(needNum_s, 4);
            let count_s = 0;
            if (needNum_s > 0) {
              let list_s = gdMgr.getUncachedPictureList(needNum_s, true);
              if (list_s.length < needNum_s) {
                let promiseFetch = MountManager.instance.notify(MountPoint.RemoteFetchIllustration, {
                  total: 10,
                  adCount: 0
                })[0];
                if (promiseFetch instanceof Promise) {
                  await promiseFetch;
                }
                count_s = list_s.length;
              }
              list = list.concat(list_s);
              if (Config.DEBUG) {
                list_s = gdMgr.getUncachedPictureList(needNum_s, true);
              }
            }
            let promisePreload = MountManager.instance.notify(MountPoint.NativeNotifyLoadPicture, {
              infoList: list,
              type: 2,
              taskId: `welcome-pics`
            })[0];
            await promisePreload;
            console.log('loadSg--end');
            let time1 = TimeAgent.instance.getTime();
            this.reportLoading("load_sg", "end", time0, time1);
          } catch (error) {
            LogUtil.error('welcome loadSg:', error);
          }
        }
        reportLoading(stepId, action, startTime, endTime = null) {
          let dur = endTime ? endTime - startTime : 0;
          ReportAgent.reportCustomEvent(CustomReportEvent.LOADING, {
            loading_step_id: "init",
            loading_step_action: "start",
            loading_step_time: dur / 1000,
            user_type: GameDataManager.instance.localData.lastRFlag ? 1 : 2
          });
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "skeletonNode", [_dec2], {
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
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "lblLoading", [_dec4], {
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
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "lblWwyCode", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "lblVersion", [_dec7], {
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

System.register("chunks:///_virtual/win-streak-bar.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './game-data-manager.ts', './streak-star.ts', './streak-anim-star.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, ProgressBar, _decorator, Component, UITransform, GameDataManager, StreakStar, StreakAnimStar;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      ProgressBar = module.ProgressBar;
      _decorator = module._decorator;
      Component = module.Component;
      UITransform = module.UITransform;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }, function (module) {
      StreakStar = module.StreakStar;
    }, function (module) {
      StreakAnimStar = module.StreakAnimStar;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3;
      cclegacy._RF.push({}, "810e3ezMdBFyJwRcTGjzBm1", "win-streak-bar", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let WinStreakBar = exports('WinStreakBar', (_dec = ccclass('WinStreakBar'), _dec2 = property(ProgressBar), _dec3 = property(StreakAnimStar), _dec4 = property(StreakStar), _dec(_class = (_class2 = class WinStreakBar extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "progressBar", _descriptor, this);
          _initializerDefineProperty(this, "curStreakAnimStar", _descriptor2, this);
          _initializerDefineProperty(this, "targetStreakStar", _descriptor3, this);
          this._startPoint = 0;
          this._endPoint = 0;
        }
        set startPoint(val) {
          this._startPoint = val;
        }
        set endPoint(val) {
          this._endPoint = val;
          this.targetStreakStar.streak = val;
        }
        set curPoint(val) {
          let [start, end] = GameDataManager.instance.getWinStreakRange(val);
          this.startPoint = start;
          this.endPoint = end;
          GameDataManager.instance.gameData.streakTarget = end;
          this.progressBar.progress = (val - this._startPoint) / (this._endPoint - this._startPoint);
          let progress = this.progressBar.progress;
          let width = this.progressBar.getComponent(UITransform).width;
          this.curStreakAnimStar.node.setPosition(progress * width, 5);
          this.curStreakAnimStar.streak = val;
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "progressBar", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "curStreakAnimStar", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "targetStreakStar", [_dec4], {
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

System.register("chunks:///_virtual/win-streak-gift-popup.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './ui-view.ts', './type-define.ts', './game-data-manager.ts', './res-loader.ts', './audio-manager.ts', './game-constants.ts', './res-util.ts', './bridge-util.ts', './ui-config.ts', './ui-manager.ts', './report-agent.ts', './ad-manager.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Sprite, Label, _decorator, director, UIView, ToolType, GameDataManager, resLoader, AudioManager, AudioUrl, GameEvent, ResUtil, BridgeUtil, VibrationEffect, UIID, UIManager, ReportAgent, CustomReportEvent, AdManager;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Sprite = module.Sprite;
      Label = module.Label;
      _decorator = module._decorator;
      director = module.director;
    }, function (module) {
      UIView = module.UIView;
    }, function (module) {
      ToolType = module.ToolType;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }, function (module) {
      resLoader = module.resLoader;
    }, function (module) {
      AudioManager = module.AudioManager;
    }, function (module) {
      AudioUrl = module.AudioUrl;
      GameEvent = module.GameEvent;
    }, function (module) {
      ResUtil = module.ResUtil;
    }, function (module) {
      BridgeUtil = module.BridgeUtil;
      VibrationEffect = module.VibrationEffect;
    }, function (module) {
      UIID = module.UIID;
    }, function (module) {
      UIManager = module.UIManager;
    }, function (module) {
      ReportAgent = module.ReportAgent;
      CustomReportEvent = module.CustomReportEvent;
    }, function (module) {
      AdManager = module.AdManager;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2;
      cclegacy._RF.push({}, "a82643jlj1FY77IsFxXbWOM", "win-streak-gift-popup", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let WinStreakGiftPopup = exports('WinStreakGiftPopup', (_dec = ccclass('WinStreakGiftPopup'), _dec2 = property(Sprite), _dec3 = property(Label), _dec(_class = (_class2 = class WinStreakGiftPopup extends UIView {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "sprtItem", _descriptor, this);
          _initializerDefineProperty(this, "lblNum", _descriptor2, this);
          this.popupArgs = void 0;
        }
        onOpen(fromUI, ...args) {
          AudioManager.instance.playEffect(AudioUrl.GET_REWARD);
          BridgeUtil.vibrate(30, VibrationEffect.CLICK);
          this.popupArgs = args[0];
          ReportAgent.reportCustomEvent(CustomReportEvent.PAGE_SHOW, {
            info: "Streak gift"
          });
          let itemId = this.popupArgs.itemId;
          resLoader.load(`textures/tool/tool_${itemId}/spriteFrame`, (err, frame) => {
            this.sprtItem.spriteFrame = frame;
            ResUtil.assignWith(frame, this.node, true);
          });
          this.lblNum.string = `x${this.popupArgs.amount}`;
        }
        onOnceRewardBtn() {
          AudioManager.instance.onBtnClicked();
          this.doGetReward(1);
          UIManager.instance.close(this);
        }
        onTwiceRewardBtn() {
          AudioManager.instance.onBtnClicked();
          AdManager.instance.openVideoAd('ItemGetPopup', (entry, success) => {
            if (success) {
              this.doGetReward(2);
              UIManager.instance.close(this);
            }
          });
        }
        doGetReward(times) {
          let gdMgr = GameDataManager.instance;
          switch (this.popupArgs.itemId) {
            case ToolType.Magnifier:
              {
                gdMgr.gameData.toolMagnifierNum += this.popupArgs.amount * times;
              }
              break;
            case ToolType.Undo:
              {
                gdMgr.gameData.toolUndoNum += this.popupArgs.amount * times;
              }
              break;
            case ToolType.Key:
              {
                gdMgr.gameData.toolKeyNum += this.popupArgs.amount * times;
              }
              break;
          }
        }
        onClose() {
          if (GameDataManager.instance.isShowRatingPopup()) {
            UIManager.instance.open(UIID.RatingPopup);
          } else {
            director.emit(GameEvent.GAME_START);
          }
          GameDataManager.instance.saveData(true);
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "sprtItem", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "lblNum", [_dec3], {
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

System.register("chunks:///_virtual/win-streak-reward-item.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './type-define.ts', './streak-star.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Sprite, Label, Node, SpriteFrame, _decorator, Component, RewardState, StreakStar;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Sprite = module.Sprite;
      Label = module.Label;
      Node = module.Node;
      SpriteFrame = module.SpriteFrame;
      _decorator = module._decorator;
      Component = module.Component;
    }, function (module) {
      RewardState = module.RewardState;
    }, function (module) {
      StreakStar = module.StreakStar;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8;
      cclegacy._RF.push({}, "b16d5WkUfdM1qpG4q9k5SAq", "win-streak-reward-item", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let WinStreakRewardItem = exports('WinStreakRewardItem', (_dec = ccclass('WinStreakRewardItem'), _dec2 = property(StreakStar), _dec3 = property(Sprite), _dec4 = property(Label), _dec5 = property(Node), _dec6 = property(Node), _dec7 = property([SpriteFrame]), _dec8 = property(Sprite), _dec9 = property([SpriteFrame]), _dec(_class = (_class2 = class WinStreakRewardItem extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "streakStar", _descriptor, this);
          _initializerDefineProperty(this, "sprTool", _descriptor2, this);
          _initializerDefineProperty(this, "lblRewardNum", _descriptor3, this);
          _initializerDefineProperty(this, "iconLock", _descriptor4, this);
          _initializerDefineProperty(this, "iconUnlock", _descriptor5, this);
          _initializerDefineProperty(this, "toolFrames", _descriptor6, this);
          _initializerDefineProperty(this, "sprBg", _descriptor7, this);
          _initializerDefineProperty(this, "bgFrames", _descriptor8, this);
          this._streak = 0;
          this._state = RewardState.Locked;
        }
        set streak(val) {
          this._streak = val;
          this.streakStar.streak = val;
        }
        get streak() {
          return this._streak;
        }
        initWithInfo(info) {
          this.rewardNum = info.amount;
          this.toolType = info.type;
          this.streak = info.streak;
        }
        set state(val) {
          this._state = val;
          switch (this._state) {
            case RewardState.Locked:
              this.iconUnlock.active = false;
              this.iconLock.active = true;
              this.sprBg.spriteFrame = this.bgFrames[0];
              break;
            case RewardState.Unlocked:
              this.iconUnlock.active = false;
              this.iconLock.active = true;
              this.sprBg.spriteFrame = this.bgFrames[1];
              break;
            case RewardState.Claimed:
              this.iconUnlock.active = true;
              this.iconLock.active = false;
              this.sprBg.spriteFrame = this.bgFrames[1];
          }
        }
        get state() {
          return this._state;
        }
        set rewardNum(val) {
          this.lblRewardNum.string = val.toString();
        }
        set toolType(val) {
          this.sprTool.spriteFrame = this.toolFrames[val];
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "streakStar", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "sprTool", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "lblRewardNum", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "iconLock", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "iconUnlock", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "toolFrames", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "sprBg", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "bgFrames", [_dec9], {
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

System.register("chunks:///_virtual/win-streak-reward-view.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './ui-view.ts', './win-streak-reward-item.ts', './ui-manager.ts', './type-define.ts', './game-data-manager.ts', './log-util.ts', './ui-config.ts', './audio-manager.ts', './streak-anim-star.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, ProgressBar, _decorator, UIView, WinStreakRewardItem, UIManager, RewardState, WinStreakRewardData, GameDataManager, LogUtil, UIID, AudioManager, StreakAnimStar;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      ProgressBar = module.ProgressBar;
      _decorator = module._decorator;
    }, function (module) {
      UIView = module.UIView;
    }, function (module) {
      WinStreakRewardItem = module.WinStreakRewardItem;
    }, function (module) {
      UIManager = module.UIManager;
    }, function (module) {
      RewardState = module.RewardState;
      WinStreakRewardData = module.WinStreakRewardData;
    }, function (module) {
      GameDataManager = module.GameDataManager;
    }, function (module) {
      LogUtil = module.LogUtil;
    }, function (module) {
      UIID = module.UIID;
    }, function (module) {
      AudioManager = module.AudioManager;
    }, function (module) {
      StreakAnimStar = module.StreakAnimStar;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3;
      cclegacy._RF.push({}, "98cfazKHzhIHK16xfDsmJZR", "win-streak-reward-view", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      const PROGRESS_LIST = [0, 0.1, 0.25, 0.4];
      let WinStreakRewardView = exports('WinStreakRewardView', (_dec = ccclass('WinStreakRewardView'), _dec2 = property([WinStreakRewardItem]), _dec3 = property(StreakAnimStar), _dec4 = property(ProgressBar), _dec(_class = (_class2 = class WinStreakRewardView extends UIView {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "items", _descriptor, this);
          _initializerDefineProperty(this, "streakAnimStar", _descriptor2, this);
          _initializerDefineProperty(this, "progressBar", _descriptor3, this);
          this.rewardInfos = [];
        }
        onOpen(fromUI, ...args) {
          let gdMgr = GameDataManager.instance;
          let streakNum = gdMgr.gameData.winStreakNum;
          let streakStage = gdMgr.getWinStreakRewardStage(streakNum);
          this.streakAnimStar.streak = streakNum;
          let infoList = gdMgr.mainConfig.winning_streak_award[0];
          if (streakStage > 0) {
            infoList = gdMgr.mainConfig.winning_streak_award[streakStage - 1];
          }
          if (!infoList || infoList.length === 0) {
            LogUtil.log('WinStreakRewardView', 'infoList is null');
            infoList = gdMgr.mainConfig.winning_streak_endless_award[0];
          }
          this.rewardInfos = infoList;
          if (!this.rewardInfos) {
            LogUtil.log('WinStreakRewardView', 'infoList is null');
            UIManager.instance.showToast('Network Error');
            return;
          }

          // Todo: 获取数据和配置进行展示
          let unlockCount = 0;
          for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            if (item) {
              let cfg = this.rewardInfos[i];
              if (cfg) {
                item.initWithInfo(cfg);
              } else {
                item.node.active = false;
                break;
              }
              let data = gdMgr.localData.winStreakRewards.find(item => item.targetStreak === cfg.streak);
              let state = cfg.streak > gdMgr.gameData.winStreakNum ? RewardState.Locked : RewardState.Claimed;
              if (!data) {
                data = new WinStreakRewardData(cfg.streak, state);
                gdMgr.localData.winStreakRewards.push(data);
              } else {
                if (data.state === RewardState.Locked) {
                  data.state = state;
                }
              }
              item.state = data.state;
              if (item.state !== RewardState.Locked) {
                unlockCount++;
              }
            }
            let progress = PROGRESS_LIST[unlockCount];
            if (typeof progress === 'number') {
              this.progressBar.progress = progress;
            } else {
              this.progressBar.progress = 1;
            }
          }
        }
        onClose() {
          GameDataManager.instance.saveData(true);
        }
        onCloseBtn() {
          AudioManager.instance.onBtnClicked();
          UIManager.instance.close(this);
        }
        onClickItem(event, data) {
          let id = parseInt(data);
          let item = this.items[id];
          if (!item) {
            return;
          }
          switch (item.state) {
            case RewardState.Locked:
              {
                UIManager.instance.showToast('Receive your rewards instantly once the task is done!');
              }
              break;
            case RewardState.Unlocked:
              {
                let gdMgr = GameDataManager.instance;
                let data = gdMgr.localData.winStreakRewards.find(reward => reward.targetStreak === item.streak);
                if (!data) {
                  data = new WinStreakRewardData(item.streak, RewardState.Claimed);
                  gdMgr.localData.winStreakRewards.push(data);
                }
                let info = this.rewardInfos[id];
                if (info) {
                  UIManager.instance.open(UIID.ItemGetPopup, {
                    itemId: info.type,
                    amount: info.amount
                  });
                } else {
                  UIManager.instance.showToast('Network Error');
                  LogUtil.log(`WinStreakRewardView: can not find reward info, idx: ${id}`);
                }
                item.state = RewardState.Claimed;
              }
              break;
            case RewardState.Claimed:
              {
                UIManager.instance.showToast('You have already claimed this reward!');
              }
          }
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "items", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "streakAnimStar", [_dec3], {
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