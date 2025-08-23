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

System.register("chunks:///_virtual/main", ['./front-line.ts', './progress-bar-ctrl.ts', './res-version-config.ts', './round-rect-mask.ts', './welcome-hf-pre.ts', './welcome-hf-start.ts'], function () {
  return {
    setters: [null, null, null, null, null, null],
    execute: function () {}
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

System.register("chunks:///_virtual/welcome-hf-pre.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './front-line.ts', './progress-bar-ctrl.ts', './res-version-config.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Label, _decorator, Component, profiler, sys, director, FrontLine, FrontLineEvent, HOT_UPDATE_TIME_COST, ProgressBarCtrl, res_version;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      _decorator = module._decorator;
      Component = module.Component;
      profiler = module.profiler;
      sys = module.sys;
      director = module.director;
    }, function (module) {
      FrontLine = module.FrontLine;
      FrontLineEvent = module.FrontLineEvent;
      HOT_UPDATE_TIME_COST = module.HOT_UPDATE_TIME_COST;
    }, function (module) {
      ProgressBarCtrl = module.ProgressBarCtrl;
    }, function (module) {
      res_version = module.res_version;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;
      cclegacy._RF.push({}, "e4aea4Ab2BI2K7U5K18jWoJ", "welcome-hf-pre", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let WelcomeHfPre = exports('WelcomeHfPre', (_dec = ccclass('WelcomeHfPre'), _dec2 = property(ProgressBarCtrl), _dec3 = property(Label), _dec4 = property(Label), _dec5 = property(Label), _dec(_class = (_class2 = class WelcomeHfPre extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "progressBar", _descriptor, this);
          _initializerDefineProperty(this, "lblVersion", _descriptor2, this);
          _initializerDefineProperty(this, "lblWwyCode", _descriptor3, this);
          _initializerDefineProperty(this, "lblLoading", _descriptor4, this);
          this.timeCount = 5;
          this.isToPageA = true;
        }
        onLoad() {
          let frontLine = this.node.getComponent(FrontLine);
          if (frontLine) {
            this.lblVersion.string = res_version;
          }
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
        async start() {
          console.log("OjaiTest-HfPre-startScene-start");
          profiler.hideStats();
          this.updateLoadingLabel();
          this.progressBar.setConfig(this.onProgressComplete.bind(this), 45, 80);
          this.progressBar.setProgress(0);
          this.progressBar.lock(30);
          this.progressBar.lock(99);
          this.startHotUpdate();
          if (!sys.isNative) {
            this.enterToNext();
          }
        }

        /**
         * 开始热更新流程
         */
        startHotUpdate() {
          const frontLine = this.node.getComponent(FrontLine);
          if (!frontLine) {
            console.error('OjaiTest-HfPre-FrontLine组件未找到');
            this.enterToNext();
            return;
          }

          // 获取版本号并拆分
          let version = res_version;
          const versionParts = version.split('.');
          const lastPart = parseInt(versionParts[versionParts.length - 1]);
          this.lblVersion.string = version;
          sys.localStorage.setItem('version', version);

          // 判断最后一位是否为0
          if (lastPart > 0) {
            console.log(`OjaiTest-HfPre-版本号最后一位不为0，跳过热更新，版本号: ${version}`);
            this.enterToNext();
            return;
          }
          let startTime = Date.now();
          console.log('OjaiTest-HfPre-开始热更新检查');
          if (sys.isNative) {
            frontLine.start((success, message) => {
              if (success) {
                let endTime = Date.now();
                console.log(`OjaiTest-HfPre-热更新成功，耗时：${endTime - startTime}ms`);
                sys.localStorage.setItem(HOT_UPDATE_TIME_COST, ((endTime - startTime) / 1000).toFixed(2));
              } else {
                console.log('OjaiTest-HfPre-热更新失败', message);
                this.enterToNext();
              }
            });
          } else {
            this.enterToNext();
          }
        }
        onProgressComplete() {
          director.loadScene("welcome-hf-start");
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
          }, 0.3);
        }

        /**
         * 更新进度回调
         */
        updateProgress(progress) {
          if (progress > 0.3) {
            this.progressBar.setProgress(progress);
          }
        }

        /**
         * 热更新成功回调
         */
        onUpdateSuccess() {
          console.log('OjaiTest-HfPre-热更新成功，准备重启游戏');
        }

        /**
         * 热更新失败回调
         */
        onUpdateFailed() {
          console.log('OjaiTest-HfPre-热更新失败，继续进入游戏');
          this.enterToNext();
        }

        /**
         * 已经是最新版本回调
         */
        onAlreadyUpToDate() {
          console.log('OjaiTest-HfPre-已经是最新版本，直接进入游戏');
          this.enterToNext();
        }

        /**
         * 热更新错误回调
         */
        onUpdateError() {
          console.log('OjaiTest-HfPre-热更新出错，继续进入游戏');
          this.enterToNext();
        }

        /**
         * 进入游戏主场景
         */
        enterToNext() {
          this.progressBar.lock(100);
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "progressBar", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "lblVersion", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "lblWwyCode", [_dec4], {
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
      })), _class2)) || _class));
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