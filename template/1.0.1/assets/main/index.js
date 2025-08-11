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

System.register("chunks:///_virtual/main", ['./front-line.ts', './version-example.ts', './version-manager.ts', './welcome-hf-A.ts', './welcome-hf-B.ts'], function () {
  return {
    setters: [null, null, null, null, null],
    execute: function () {}
  };
});

System.register("chunks:///_virtual/version-example.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './version-manager.ts', './front-line.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Label, _decorator, Component, VersionManager, FrontLine;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      _decorator = module._decorator;
      Component = module.Component;
    }, function (module) {
      VersionManager = module.VersionManager;
    }, function (module) {
      FrontLine = module.FrontLine;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2;
      cclegacy._RF.push({}, "7b92djg4ItEu5Z33L4fqi6D", "version-example", undefined);
      const {
        ccclass,
        property
      } = _decorator;

      /**
       * 版本信息显示组件示例
       * 展示如何使用VersionManager和FrontLine的getVersion方法
       */
      let VersionExample = exports('VersionExample', (_dec = ccclass('VersionExample'), _dec2 = property(Label), _dec3 = property(Label), _dec(_class = (_class2 = class VersionExample extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "versionLabel", _descriptor, this);
          _initializerDefineProperty(this, "statusLabel", _descriptor2, this);
        }
        onLoad() {
          this.displayVersionInfo();
        }

        /**
         * 显示版本信息
         */
        displayVersionInfo() {
          // 方法1：使用VersionManager（推荐）
          const versionInfo = VersionManager.getVersionInfo();
          console.log('VersionExample: 版本信息', versionInfo);
          if (this.versionLabel) {
            this.versionLabel.string = `版本: ${VersionManager.formatVersion(versionInfo.version)}`;
          }
          if (this.statusLabel) {
            const status = versionInfo.isHotUpdated ? '热更新版本' : '本地版本';
            this.statusLabel.string = `状态: ${status}`;
          }

          // 方法2：使用FrontLine的getVersion方法
          const frontLine = this.node.getComponent(FrontLine);
          if (frontLine) {
            const frontLineVersion = frontLine.getVersion();
            console.log('VersionExample: FrontLine版本号', frontLineVersion);
          }

          // 示例：版本比较
          this.compareVersionExample();
        }

        /**
         * 版本比较示例
         */
        compareVersionExample() {
          const currentVersion = VersionManager.getCurrentVersion();
          const testVersions = ['1.0.0', '1.0.1', '1.1.0', '2.0.0'];
          console.log('VersionExample: 版本比较示例');
          testVersions.forEach(testVersion => {
            const result = VersionManager.compareVersions(currentVersion, testVersion);
            let comparison = '';
            if (result < 0) comparison = '小于';else if (result > 0) comparison = '大于';else comparison = '等于';
            console.log(`当前版本 ${currentVersion} ${comparison} ${testVersion}`);
          });
        }

        /**
         * 检查新版本示例
         */
        async checkNewVersionExample() {
          console.log('VersionExample: 开始检查新版本...');
          try {
            const hasNewVersion = await VersionManager.checkForNewVersion('https://example.com/version.manifest');
            if (hasNewVersion) {
              console.log('VersionExample: 发现新版本');
              if (this.statusLabel) {
                this.statusLabel.string = '状态: 发现新版本';
              }
            } else {
              console.log('VersionExample: 已是最新版本');
              if (this.statusLabel) {
                this.statusLabel.string = '状态: 已是最新版本';
              }
            }
          } catch (error) {
            console.error('VersionExample: 检查新版本失败', error);
            if (this.statusLabel) {
              this.statusLabel.string = '状态: 检查失败';
            }
          }
        }

        /**
         * 获取详细版本信息
         */
        getDetailedVersionInfo() {
          const versionInfo = VersionManager.getVersionInfo();
          console.log('VersionExample: 详细版本信息');
          console.log('- 版本号:', versionInfo.version);
          console.log('- 是否热更新:', versionInfo.isHotUpdated);
          console.log('- 更新时间:', versionInfo.updateTime ? new Date(versionInfo.updateTime).toLocaleString() : '无');
          console.log('- 版本格式验证:', VersionManager.isValidVersion(versionInfo.version));

          // 显示在界面上
          if (this.versionLabel) {
            const formattedVersion = VersionManager.formatVersion(versionInfo.version);
            const updateTime = versionInfo.updateTime ? new Date(versionInfo.updateTime).toLocaleString() : '无';
            this.versionLabel.string = `${formattedVersion}\n更新时间: ${updateTime}`;
          }
        }

        /**
         * 按钮点击事件示例
         */
        onRefreshVersionClick() {
          console.log('VersionExample: 刷新版本信息');
          this.displayVersionInfo();
        }
        onCheckNewVersionClick() {
          console.log('VersionExample: 检查新版本');
          this.checkNewVersionExample();
        }
        onShowDetailedInfoClick() {
          console.log('VersionExample: 显示详细信息');
          this.getDetailedVersionInfo();
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "versionLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "statusLabel", [_dec3], {
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

System.register("chunks:///_virtual/version-manager.ts", ['cc'], function (exports) {
  var cclegacy, native, sys;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      native = module.native;
      sys = module.sys;
    }],
    execute: function () {
      cclegacy._RF.push({}, "928f0ELgzVDB6i2AUIwxibV", "version-manager", undefined);

      /**
       * 版本管理工具类
       * 用于管理热更新后的版本信息
       */
      class VersionManager {
        /**
         * 获取当前版本号
         * 优先从热更新后的version.manifest文件读取，如果不存在则从本地读取
         */
        static getCurrentVersion() {
          try {
            // 获取可写路径下的version.manifest文件路径
            const storagePath = native.fileUtils.getWritablePath() + this.STORAGE_FOLDER_NAME;
            const versionManifestPath = storagePath + '/version.manifest';
            console.log(`VersionManager: 尝试读取热更新版本文件 ${versionManifestPath}`);

            // 检查热更新版本文件是否存在
            if (native.fileUtils.isFileExist(versionManifestPath)) {
              const fileContent = native.fileUtils.getStringFromFile(versionManifestPath);
              if (fileContent) {
                const manifestData = JSON.parse(fileContent);
                const version = manifestData.version;
                console.log(`VersionManager: 热更新版本号 ${version}`);

                // 保存到本地存储
                this.saveVersionToStorage(version);
                return version;
              }
            }

            // 如果热更新版本不存在，尝试从本地存储读取
            const storedVersion = this.getVersionFromStorage();
            if (storedVersion) {
              console.log(`VersionManager: 从本地存储读取版本号 ${storedVersion}`);
              return storedVersion;
            }

            // 如果都没有，返回默认版本
            console.log(`VersionManager: 使用默认版本号 ${this.DEFAULT_VERSION}`);
            return this.DEFAULT_VERSION;
          } catch (error) {
            console.error('VersionManager: 获取版本号失败', error);
            return this.DEFAULT_VERSION;
          }
        }

        /**
         * 检查是否有新版本可用
         * @param remoteVersionUrl 远程版本文件URL
         * @returns Promise<boolean> 是否有新版本
         */
        static async checkForNewVersion(remoteVersionUrl) {
          try {
            const currentVersion = this.getCurrentVersion();
            console.log(`VersionManager: 当前版本 ${currentVersion}，检查远程版本...`);

            // 这里可以实现远程版本检查逻辑
            // 由于需要网络请求，这里只是示例框架
            // 实际实现可以使用XMLHttpRequest或fetch

            return false; // 暂时返回false，表示没有新版本
          } catch (error) {
            console.error('VersionManager: 检查新版本失败', error);
            return false;
          }
        }

        /**
         * 比较两个版本号
         * @param versionA 版本A
         * @param versionB 版本B
         * @returns number 比较结果：-1表示A<B，0表示A=B，1表示A>B
         */
        static compareVersions(versionA, versionB) {
          const vA = versionA.split('.');
          const vB = versionB.split('.');
          for (let i = 0; i < Math.max(vA.length, vB.length); i++) {
            const a = parseInt(vA[i] || '0');
            const b = parseInt(vB[i] || '0');
            if (a < b) return -1;
            if (a > b) return 1;
          }
          return 0;
        }

        /**
         * 获取版本信息对象
         * @returns 包含版本信息的对象
         */
        static getVersionInfo() {
          const version = this.getCurrentVersion();
          const storagePath = native.fileUtils.getWritablePath() + this.STORAGE_FOLDER_NAME;
          const versionManifestPath = storagePath + '/version.manifest';
          const isHotUpdated = native.fileUtils.isFileExist(versionManifestPath);
          return {
            version,
            isHotUpdated,
            updateTime: isHotUpdated ? this.getLastUpdateTime() : undefined
          };
        }

        /**
         * 保存版本号到本地存储
         */
        static saveVersionToStorage(version) {
          try {
            sys.localStorage.setItem(this.VERSION_KEY, version);
            console.log(`VersionManager: 版本号已保存到本地存储 ${version}`);
          } catch (error) {
            console.error('VersionManager: 保存版本号到本地存储失败', error);
          }
        }

        /**
         * 从本地存储读取版本号
         */
        static getVersionFromStorage() {
          try {
            return sys.localStorage.getItem(this.VERSION_KEY);
          } catch (error) {
            console.error('VersionManager: 从本地存储读取版本号失败', error);
            return null;
          }
        }

        /**
         * 获取最后更新时间
         */
        static getLastUpdateTime() {
          try {
            const timestamp = sys.localStorage.getItem('hot_update_timestamp');
            return timestamp ? parseInt(timestamp) : undefined;
          } catch (error) {
            console.error('VersionManager: 获取最后更新时间失败', error);
            return undefined;
          }
        }

        /**
         * 格式化版本号显示
         * @param version 版本号
         * @returns 格式化后的版本号字符串
         */
        static formatVersion(version) {
          return `v${version}`;
        }

        /**
         * 验证版本号格式
         * @param version 版本号
         * @returns 是否为有效的版本号格式
         */
        static isValidVersion(version) {
          const versionPattern = /^\d+\.\d+\.\d+$/;
          return versionPattern.test(version);
        }
      }
      exports('VersionManager', VersionManager);
      VersionManager.STORAGE_FOLDER_NAME = 'front_line';
      VersionManager.VERSION_KEY = 'current_version';
      VersionManager.DEFAULT_VERSION = '1.0.0';
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/welcome-hf-A.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './front-line.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, ProgressBar, Label, _decorator, Component, profiler, sys, director, FrontLine, FrontLineEvent, HOT_UPDATE_TIMESTAMP, HOT_UPDATE_TIME_COST;
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
      profiler = module.profiler;
      sys = module.sys;
      director = module.director;
    }, function (module) {
      FrontLine = module.FrontLine;
      FrontLineEvent = module.FrontLineEvent;
      HOT_UPDATE_TIMESTAMP = module.HOT_UPDATE_TIMESTAMP;
      HOT_UPDATE_TIME_COST = module.HOT_UPDATE_TIME_COST;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3;
      cclegacy._RF.push({}, "e4aea4Ab2BI2K7U5K18jWoJ", "welcome-hf-A", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let WelcomeHfA = exports('WelcomeHfA', (_dec = ccclass('WelcomeHfA'), _dec2 = property(ProgressBar), _dec3 = property(Label), _dec4 = property(Label), _dec(_class = (_class2 = class WelcomeHfA extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "progressBar", _descriptor, this);
          _initializerDefineProperty(this, "lblProgress", _descriptor2, this);
          _initializerDefineProperty(this, "lblLoading", _descriptor3, this);
          this.HOT_UPDATE_THRESHOLD = 5 * 60 * 1000;
        }
        // 5分钟内的更新认为是刚更新过

        onLoad() {
          profiler.hideStats();
          this.progressBar.progress = 0;
          this.lblProgress.string = '0%';
          console.log('OjaiTest-welcome-hf-onloaded');
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

          // only update from 1.0.0 to 1.0.1
          if (frontLine.getVersion() != 'v1.0.0') {
            this.enterNext();
            return;
          }
          let startTime = Date.now();
          console.log('OjaiTest-开始热更新检查');
          frontLine.start((success, message) => {
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
          console.log('OjaiTest-进入下一个场景');
          // 根据配置决定进入哪个场景
          director.loadScene('welcome-hf-B');
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
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/welcome-hf-B.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './front-line.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, ProgressBar, Label, _decorator, Component, sys, director, FrontLineEvent, FrontLine;
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
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;
      cclegacy._RF.push({}, "47ecangTVxCa7EltStD+FU7", "welcome-hf-B", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      const HOT_UPDATE_TIME_COST = exports('HOT_UPDATE_TIME_COST', 'hot_update_time_cost');
      let WelcomeHfB = exports('WelcomeHfB', (_dec = ccclass('WelcomeHfB'), _dec2 = property(ProgressBar), _dec3 = property(Label), _dec4 = property(Label), _dec5 = property(Label), _dec(_class = (_class2 = class WelcomeHfB extends Component {
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
          console.log('OjaiTest-welcome-hf-onloaded');
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
          frontLine.start((success, message) => {
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
          director.loadScene('welcome');
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