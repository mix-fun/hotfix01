System.register("chunks:///_virtual/beyond-agent.ts", ['cc', './random-util.ts', './beyond-constants.ts', './beyond-local-data.ts'], function (exports) {
  var cclegacy, RandomUtil, BeyondPageType, BeyondIntactType, BeyondLocalData;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      RandomUtil = module.RandomUtil;
    }, function (module) {
      BeyondPageType = module.BeyondPageType;
      BeyondIntactType = module.BeyondIntactType;
    }, function (module) {
      BeyondLocalData = module.BeyondLocalData;
    }],
    execute: function () {
      cclegacy._RF.push({}, "8169a+KErdKNKiyLJGS+WHl", "beyond-agent", undefined);
      class BeyondAgent {
        static determineNextIntactType(layer) {
          const data = layer.data;
          const needReset = data.ctCount >= data.currentBreakCountLimit;
          if (data.pageType === BeyondPageType.Home || data.pageType === BeyondPageType.Mark) {
            if (needReset) {
              return BeyondIntactType.Refresh;
            }
            const isAutoPoint = this.getRandomByPercentage(data.currentPoint);
            if (isAutoPoint) {
              return BeyondIntactType.Auto;
            }
            return BeyondIntactType.Wait;
          } else if (data.pageType === BeyondPageType.Mark_Vg) {
            if (needReset) {
              return BeyondIntactType.Refresh;
            }
            return BeyondIntactType.Remove;
          } else if (data.pageType === BeyondPageType.Third) {
            if (needReset) {
              return BeyondIntactType.Refresh;
            }
            const needJump = this.getRandomByPercentage(layer.urlConfig.t_jump);
            if (needJump) {
              layer.cuzLog("determineNextIntactType", `needJump is true, do jump, t_jump is [${layer.urlConfig.t_jump}]`);
              return BeyondIntactType.Refresh_Jump;
            }
            layer.data.thirdClicked = true;
            return BeyondIntactType.Click3;
          }
          return BeyondIntactType.None;
        }
        static getRandomByPercentage(param1) {
          const percentage = Math.max(0, Math.min(100, param1));
          const randomValue = Math.random() * 100;
          return randomValue <= percentage;
        }
        static removeUrlAppend(url) {
          const append = atob("I2dvb2dsZV92aWduZXR0ZQ==");
          if (url && url !== "") {
            return url.replace(new RegExp(append + "$"), '');
          }
          return "";
        }
        static getParamRandomVal(arr, defaultValue) {
          let param = arr;
          if (!arr || arr.length !== 2) {
            param = defaultValue;
          }
          return RandomUtil.random(param[0], param[1]);
        }
        static getUrlWeight(urlConfig) {
          const limit = urlConfig.stint;
          const originWeight = urlConfig.url_weight;
          const ctCount = BeyondLocalData.getIntactCountOfHname(urlConfig.hname);
          if (ctCount >= urlConfig.afk) {
            return 0;
          }
          if (ctCount >= limit) {
            return originWeight * 0.0001;
          }
          return originWeight;
        }
      }
      exports('BeyondAgent', BeyondAgent);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/beyond-config.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './object-util.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, ArrayType, ClassType;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      ArrayType = module.ArrayType;
      ClassType = module.ClassType;
    }],
    execute: function () {
      var _dec, _class2, _descriptor, _dec2, _dec3, _class5, _descriptor2, _descriptor3;
      cclegacy._RF.push({}, "b9c8eFM4qVDMIphtVmdqnxN", "beyond-config", undefined);
      class UrlConfig {
        constructor() {
          this.hname = "";
          this.pageswitch = 50;
          //v_1.1.0_20250717
          this.afk = 200;
          //v_1.1.0_20250717
          this.wwy_url = "";
          //v_1.1.0_20250717
          this.urls = [];
          this.front_page = "";
          this.sub_pages = "";
          this.a_o1 = [10, 15];
          this.a_p1 = [10, 15];
          this.a_o2 = [10, 15];
          this.a_p2 = [10, 15];
          this.t_jump = 40;
          this.stint = 100;
          this.url_weight = 10;
        }
      }
      exports('UrlConfig', UrlConfig);
      let LayerConfig = exports('LayerConfig', (_dec = ArrayType(UrlConfig), (_class2 = class LayerConfig {
        constructor() {
          this.wname = "";
          this.client_tag = "";
          // 客户端标签,非客户端下发
          this.web_weight = 1000;
          _initializerDefineProperty(this, "urls", _descriptor, this);
        }
      }, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "urls", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _class2)));
      class SkipConfig {
        constructor() {
          this.store_skip = 95;
          this.amark_skip = 95;
        }
      }
      exports('SkipConfig', SkipConfig);
      let BeyondConfig = exports('BeyondConfig', (_dec2 = ClassType(SkipConfig), _dec3 = ArrayType(LayerConfig), (_class5 = class BeyondConfig {
        constructor() {
          this.plan = "code";
          this.hide = 2;
          this.gdpr = 6;
          this.break = [9, 9];
          this.ruin = 3;
          this.slide = [7, 9];
          this.sslide = [40, 60];
          this.digital = false;
          this.point = [20, 30];
          _initializerDefineProperty(this, "skip", _descriptor2, this);
          _initializerDefineProperty(this, "webs", _descriptor3, this);
        }
      }, (_descriptor2 = _applyDecoratedDescriptor(_class5.prototype, "skip", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new SkipConfig();
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class5.prototype, "webs", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      })), _class5)));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/beyond-constants.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "9bdc81YdZRIWo+1WFC2Zi1h", "beyond-constants", undefined);
      let BeyondEvent = exports('BeyondEvent', /*#__PURE__*/function (BeyondEvent) {
        BeyondEvent["RE_BUILD"] = "re_build";
        BeyondEvent["RE_LOAD"] = "re_load";
        return BeyondEvent;
      }({}));
      let BeyondNativeEvent = exports('BeyondNativeEvent', /*#__PURE__*/function (BeyondNativeEvent) {
        BeyondNativeEvent["alark"] = "alark";
        BeyondNativeEvent["urlLoadStart"] = "poxd_start";
        BeyondNativeEvent["urlLoadFinished"] = "poxd_finished";
        BeyondNativeEvent["evtRezult"] = "evt-rezult";
        return BeyondNativeEvent;
      }({}));
      let BeyondIntactType = exports('BeyondIntactType', /*#__PURE__*/function (BeyondIntactType) {
        BeyondIntactType["None"] = "none";
        BeyondIntactType["Auto"] = "auto";
        BeyondIntactType["Click3"] = "click3";
        BeyondIntactType["Wait"] = "wait";
        BeyondIntactType["Remove"] = "remove";
        BeyondIntactType["Refresh"] = "refresh";
        BeyondIntactType["Refresh_Jump"] = "refresh_jump";
        return BeyondIntactType;
      }({}));
      let BeyondPageType = exports('BeyondPageType', /*#__PURE__*/function (BeyondPageType) {
        BeyondPageType["None"] = "none";
        BeyondPageType["Home"] = "home";
        BeyondPageType["Mark"] = "mark";
        BeyondPageType["Mark_Vg"] = "mark_vg";
        BeyondPageType["Third"] = "third";
        return BeyondPageType;
      }({}));
      let EvalEventName = exports('EvalEventName', /*#__PURE__*/function (EvalEventName) {
        EvalEventName["Init"] = "pra-init";
        EvalEventName["Seek"] = "prk-seek";
        EvalEventName["Pop"] = "prl-pop";
        EvalEventName["Wait"] = "prc-wait";
        EvalEventName["Oil"] = "pro-oil";
        EvalEventName["Idle"] = "phase-idle";
        EvalEventName["IntAct"] = "phase-intact";
        EvalEventName["Nlank"] = "cre-nlank";
        return EvalEventName;
      }({}));
      let BeyondAlarKType = exports('BeyondAlarKType', /*#__PURE__*/function (BeyondAlarKType) {
        BeyondAlarKType["NONE"] = "none";
        BeyondAlarKType["NORMAL"] = "normal";
        BeyondAlarKType["ANCHOR"] = "anchor";
        BeyondAlarKType["RANDOM_A"] = "random_a";
        return BeyondAlarKType;
      }({}));
      let BeyondResetInfo = exports('BeyondResetInfo', /*#__PURE__*/function (BeyondResetInfo) {
        BeyondResetInfo["COMMON"] = "common";
        BeyondResetInfo["JUMP"] = "jump";
        BeyondResetInfo["A_NONE"] = "a_none";
        BeyondResetInfo["A_CLICK"] = "a_click";
        return BeyondResetInfo;
      }({}));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/beyond-info-panel.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './beyond-manager.ts', './ui-view.ts', './ui-manager.ts', './beyond-constants.ts', './beyond-log-agent.ts', './beyond-report-agent.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Label, Node, EditBox, _decorator, Widget, UITransform, Color, instantiate, Vec3, Button, BeyondManager, UIView, UIManager, EvalEventName, BeyondLogAgent, BeyondReportAgent;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      Node = module.Node;
      EditBox = module.EditBox;
      _decorator = module._decorator;
      Widget = module.Widget;
      UITransform = module.UITransform;
      Color = module.Color;
      instantiate = module.instantiate;
      Vec3 = module.Vec3;
      Button = module.Button;
    }, function (module) {
      BeyondManager = module.BeyondManager;
    }, function (module) {
      UIView = module.UIView;
    }, function (module) {
      UIManager = module.UIManager;
    }, function (module) {
      EvalEventName = module.EvalEventName;
    }, function (module) {
      BeyondLogAgent = module.BeyondLogAgent;
    }, function (module) {
      BeyondReportAgent = module.BeyondReportAgent;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10;
      cclegacy._RF.push({}, "57bff+gYQdEy7biFSFZLJiW", "beyond-info-panel", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let BeyondInfoPanel = exports('BeyondInfoPanel', (_dec = ccclass('BeyondInfoPanel'), _dec2 = property(Label), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property(Node), _dec6 = property(Node), _dec7 = property(Node), _dec8 = property(Node), _dec9 = property(Node), _dec10 = property(EditBox), _dec11 = property(EditBox), _dec(_class = (_class2 = class BeyondInfoPanel extends UIView {
        constructor(...args) {
          super(...args);
          this._isSplite = false;
          _initializerDefineProperty(this, "infoLabel", _descriptor, this);
          _initializerDefineProperty(this, "preLayerItem", _descriptor2, this);
          _initializerDefineProperty(this, "layerContainer", _descriptor3, this);
          _initializerDefineProperty(this, "logContainer", _descriptor4, this);
          _initializerDefineProperty(this, "reportContainer", _descriptor5, this);
          _initializerDefineProperty(this, "infoContainer", _descriptor6, this);
          _initializerDefineProperty(this, "logContent", _descriptor7, this);
          _initializerDefineProperty(this, "reportContent", _descriptor8, this);
          _initializerDefineProperty(this, "filterReportEditBox", _descriptor9, this);
          _initializerDefineProperty(this, "filterLayerEditBox", _descriptor10, this);
          this._logItemCount = 50;
          this._reportItemCount = 50;
          this._filterReportText = "";
          this._filterLayerName = "";
        }
        start() {
          this.infoContainer.active = true;
          this.logContainer.active = false;
          this.layerContainer.active = false;
          this.initLogContent();
          this.initReportContent();
          this.schedule(this.onUpdateLog, 1.0);
          this.schedule(this.onUpdateReport, 1.0);
        }
        update(deltaTime) {}
        initLogContent() {
          const content = this.logContent;
          content.removeAllChildren();
          for (let i = 0; i < this._logItemCount; i++) {
            const item = new Node();
            item.addComponent(Widget);
            item.getComponent(Widget).isAlignLeft = true;
            item.getComponent(Widget).isAlignRight = true;
            item.getComponent(Widget).left = 0;
            item.getComponent(Widget).right = 0;
            item.getComponent(Widget).updateAlignment();
            item.addComponent(UITransform);
            item.getComponent(UITransform).width = 800;
            item.addComponent(Label);
            item.getComponent(Label).string = "";
            item.getComponent(Label).color = Color.BLACK;
            item.getComponent(Label).fontSize = 32;
            item.getComponent(Label).horizontalAlign = Label.HorizontalAlign.LEFT;
            item.getComponent(Label).verticalAlign = Label.VerticalAlign.TOP;
            item.getComponent(Label).lineHeight = 32;
            item.getComponent(Label).overflow = Label.Overflow.RESIZE_HEIGHT;
            item.parent = content;
          }
        }
        initReportContent() {
          const content = this.reportContent;
          content.removeAllChildren();
          for (let i = 0; i < this._reportItemCount; i++) {
            const item = new Node();
            item.addComponent(Widget);
            item.getComponent(Widget).isAlignLeft = true;
            item.getComponent(Widget).isAlignRight = true;
            item.getComponent(Widget).left = 0;
            item.getComponent(Widget).right = 0;
            item.getComponent(Widget).updateAlignment();
            item.addComponent(UITransform);
            item.getComponent(UITransform).width = 800;
            item.addComponent(Label);
            item.getComponent(Label).string = "";
            item.getComponent(Label).color = Color.BLACK;
            item.getComponent(Label).fontSize = 32;
            item.getComponent(Label).horizontalAlign = Label.HorizontalAlign.LEFT;
            item.getComponent(Label).verticalAlign = Label.VerticalAlign.TOP;
            item.getComponent(Label).lineHeight = 32;
            item.getComponent(Label).overflow = Label.Overflow.RESIZE_HEIGHT;
            item.parent = content;
          }
        }
        updateLogItem(index, log) {
          const item = this.logContent.children[index];
          item.getComponent(Label).fontSize = 32;
          if (item) {
            item.getComponent(Label).string = log;
            if (log.includes("Slide")) {
              item.getComponent(Label).color = Color.RED;
            } else if (log.includes("Intact")) {
              item.getComponent(Label).color = Color.GREEN;
            } else if (log.includes("Rebuild")) {
              item.getComponent(Label).color = Color.BLUE;
            } else if (log.includes("Reload")) {
              // 紫色
              item.getComponent(Label).color = new Color(128, 0, 128);
            } else if (log.includes("Mark_Vg")) {
              //字体加粗
              item.getComponent(Label).fontSize = 42;
              item.getComponent(Label).color = Color.MAGENTA;
            } else {
              item.getComponent(Label).color = Color.BLACK;
            }
          }
        }
        updateReportItem(index, report) {
          const reportStr = JSON.stringify(report);
          const item = this.reportContent.children[index];
          if (item) {
            item.getComponent(Label).string = reportStr;
            if (report.run_status == "false") {
              item.getComponent(Label).color = Color.RED;
            } else {
              item.getComponent(Label).color = Color.BLACK;
            }
          }
        }
        onUpdateLog() {
          const logs = BeyondLogAgent.logs;
          const lastLogs = logs.slice(-this._logItemCount);
          const childrenSize = this.logContent.children.length;
          for (let i = 0; i < childrenSize; i++) {
            const item = this.logContent.children[i];
            if (item) {
              if (i < lastLogs.length) {
                this.updateLogItem(i, lastLogs[i]);
              } else {
                item.getComponent(Label).string = "";
              }
            }
          }
        }
        onUpdateReport() {
          let reports = BeyondReportAgent.reports;
          reports = reports.filter(report => {
            if (this._filterLayerName && this._filterLayerName.length > 0) {
              if (report.w_id !== this._filterLayerName) {
                return false;
              }
            }
            if (this._filterReportText && this._filterReportText.length > 0) {
              return JSON.stringify(report).includes(this._filterReportText);
            }
            return true;
          });
          const lastReports = reports.slice(-this._reportItemCount);
          const childrenSize = this.reportContent.children.length;
          for (let i = 0; i < childrenSize; i++) {
            const item = this.reportContent.children[i];
            if (item) {
              if (i < lastReports.length) {
                this.updateReportItem(i, lastReports[i]);
              } else {
                item.getComponent(Label).string = "";
              }
            }
          }
        }
        onBtnCloseClick() {
          UIManager.instance.close(this);
        }
        onBtnInfoClick() {
          this.infoContainer.active = true;
          this.logContainer.active = false;
          this.layerContainer.active = false;
          this.reportContainer.active = false;
          const config = BeyondManager.instance.config;
          this.infoLabel.string = JSON.stringify(config);
        }
        onBtnLayersClick() {
          this.infoContainer.active = false;
          this.logContainer.active = false;
          this.layerContainer.active = true;
          this.reportContainer.active = false;
          this.loadLayers();
        }
        onBtnLogClick() {
          this.infoContainer.active = false;
          this.logContainer.active = true;
          this.layerContainer.active = false;
          this.reportContainer.active = false;
        }
        onBtnReportClick() {
          this.infoContainer.active = false;
          this.logContainer.active = false;
          this.layerContainer.active = false;
          this.reportContainer.active = true;
        }
        onBtnAllWebInfoClick() {
          this.infoContainer.active = false;
          this.logContainer.active = false;
          this.layerContainer.active = false;
          this.reportContainer.active = false;
        }
        loadLayers() {
          const container = this.layerContainer;
          if (!container) {
            return;
          }
          container.removeAllChildren();
          const layers = BeyondManager.instance.layers;
          for (const layer of layers.values()) {
            const item = instantiate(this.preLayerItem);
            item.position = new Vec3(-80, 0);
            item.active = true;
            item.parent = container;
            item.getChildByName("btn_info").getComponent(Button).getComponentInChildren(Label).string = "" + layer.key;
            item.getChildByName("btn_info").getComponent(Button).clickEvents[0].customEventData = layer.key;
            item.getChildByName("btn_destory").getComponent(Button).clickEvents[0].customEventData = layer.key;
            item.getChildByName("url").getComponent(Label).string = layer.initUrl;
          }
        }
        onBtnMoveClick() {
          this._isSplite = !this._isSplite;
          BeyondManager.instance.moveContainer(this._isSplite);
        }
        onLayerItemClick(evt, key) {
          console.log("onLayerItemClick", key);
          const evtbtn = evt.target;
          const allBtn = this.layerContainer.getComponentsInChildren(Button);
          allBtn.forEach(btn => {
            btn.getComponentInChildren(Label).color = Color.BLACK;
          });
          evtbtn.getComponentInChildren(Label).color = Color.RED;
          this._isSplite = true;
          BeyondManager.instance.moveContainer(this._isSplite);
          const layer = BeyondManager.instance.layers.get(key);
          if (layer) {
            layer.evaluateJS(EvalEventName.Pop);
          }
        }
        onBtnDestoryLayerClick(evt, key) {
          BeyondManager.instance.destroyLayer(key);
          this.loadLayers();
        }
        onBtnFilterClick() {
          this._filterReportText = this.filterReportEditBox.string;
          this._filterLayerName = this.filterLayerEditBox.string;
          console.log("onBtnFilterClick", this._filterReportText);
          this.onUpdateReport();
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "infoLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "preLayerItem", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "layerContainer", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "logContainer", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "reportContainer", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "infoContainer", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "logContent", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "reportContent", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "filterReportEditBox", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "filterLayerEditBox", [_dec11], {
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

System.register("chunks:///_virtual/beyond-layer.ts", ['cc', './random-util.ts', './beyond-agent.ts', './beyond-constants.ts', './beyond-log-agent.ts', './beyond-report-agent.ts', './beyond-local-data.ts'], function (exports) {
  var cclegacy, Component, Vec3, WebView, Widget, sys, director, _decorator, RandomUtil, BeyondAgent, BeyondPageType, BeyondIntactType, BeyondAlarKType, EvalEventName, BeyondEvent, BeyondResetInfo, BeyondLogAgent, BeyondReportAgent, BeyondReportChance, BeyondLocalData;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      Vec3 = module.Vec3;
      WebView = module.WebView;
      Widget = module.Widget;
      sys = module.sys;
      director = module.director;
      _decorator = module._decorator;
    }, function (module) {
      RandomUtil = module.RandomUtil;
    }, function (module) {
      BeyondAgent = module.BeyondAgent;
    }, function (module) {
      BeyondPageType = module.BeyondPageType;
      BeyondIntactType = module.BeyondIntactType;
      BeyondAlarKType = module.BeyondAlarKType;
      EvalEventName = module.EvalEventName;
      BeyondEvent = module.BeyondEvent;
      BeyondResetInfo = module.BeyondResetInfo;
    }, function (module) {
      BeyondLogAgent = module.BeyondLogAgent;
    }, function (module) {
      BeyondReportAgent = module.BeyondReportAgent;
      BeyondReportChance = module.BeyondReportChance;
    }, function (module) {
      BeyondLocalData = module.BeyondLocalData;
    }],
    execute: function () {
      var _dec, _class2;
      cclegacy._RF.push({}, "71f9aBsfMlMvLaj4Y3SvKk3", "beyond-layer", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      class BeyondLayerData {
        constructor() {
          this.ctCount = 0;
          this.reloadCount = 0;
          this.pageType = BeyondPageType.Home;
          this.isWaitAlark = false;
          this.thirdClicked = false;
          this.currentBreakCountLimit = 0;
          this.currentSslide = 30;
          this.currentPoint = 30;
          this.currentSlideTime = 20;
        }
      }
      exports('BeyondLayerData', BeyondLayerData);
      let BeyondLayer = exports('BeyondLayer', (_dec = ccclass('BeyondLayer'), _dec(_class2 = class BeyondLayer extends Component {
        constructor(...args) {
          super(...args);
          this._data = new BeyondLayerData();
          this._config = null;
          this._layerConfig = null;
          this._urlConfig = null;
          this._key = "";
          this._initUrl = "";
          this._currentUrl = "";
          this._lastIntactUrl = "";
          this._lastIntActInfo = {
            intactType: BeyondIntactType.None,
            alarkType: BeyondAlarKType.NONE,
            ratio: 0
          };
        }
        updateLastIntActInfo(intactType, alarkType, ratio) {
          this._lastIntActInfo.intactType = intactType;
          this._lastIntActInfo.alarkType = alarkType;
          this._lastIntActInfo.ratio = ratio;
        }
        get key() {
          return this._key;
        }
        set key(value) {
          this._key = value;
        }
        get config() {
          return this._config;
        }
        get data() {
          return this._data;
        }
        set urlConfig(value) {
          this._urlConfig = value;
        }
        set layerConfig(value) {
          this._layerConfig = value;
        }
        get urlConfig() {
          return this._urlConfig;
        }
        get layerConfig() {
          return this._layerConfig;
        }
        get currentUrl() {
          return this._currentUrl;
        }
        get initUrl() {
          return this._initUrl;
        }
        resetData() {
          const data = new BeyondLayerData();
          data.reloadCount = this._data.reloadCount; //reloadCount 只在rebuild时重置
          data.currentBreakCountLimit = BeyondAgent.getParamRandomVal(this.config.break, [10, 20]);
          data.currentSslide = BeyondAgent.getParamRandomVal(this.config.sslide, [40, 60]);
          data.currentPoint = BeyondAgent.getParamRandomVal(this.config.point, [20, 30]);
          this._data = data;
        }
        setup(parent, config) {
          if (!parent) {
            return;
          }
          this._config = config;
          this.node.position = new Vec3(0, 0);
          parent.addChild(this.node);
          const wv = this.node.addComponent(WebView);
          // wv.setJavascriptInterfaceScheme("haplx:");
          // wv.setOnJSCallback(this.onWebViewCallback.bind(this));

          const widget = this.node.addComponent(Widget);
          widget.isAlignTop = true;
          widget.isAlignBottom = true;
          widget.isAlignLeft = true;
          widget.isAlignRight = true;
          widget.top = 0;
          widget.bottom = 0;
          widget.left = 0;
          widget.right = 0;
          widget.updateAlignment();
          this.evaluateJS(EvalEventName.Init + this.key);
        }

        // scheduleForGDPR() {
        //     const t = this.config.gdpr;
        //     this.scheduleOnce(this.makeGDPR, t);
        // }

        incrementCtCount() {
          BeyondLocalData.incrementIntactCountOfHname(this.urlConfig.hname);
          this._data.ctCount++;
        }
        loadUrl(url) {
          this.cuzLog("Cocos start to load url", `url is [${url}]`);
          const wv = this.node.getComponent(WebView);
          if (wv) {
            this.resetData();
            this._initUrl = url;
            this._currentUrl = url;
            wv.url = url;
            this.makeLayerSlideIdle();
            // this.scheduleForGDPR();
          }
        }

        evaluateJS(js) {
          if (!sys.isNative) {
            return;
          }
          if (!this.node) {
            return;
          }
          const wv = this.node.getComponent(WebView);
          if (wv) {
            try {
              const gdpr = "KGZ1bmN0aW9uKCkgewogICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYnV0dG9uLmZjLWJ1dHRvbi5mYy1jdGEtY29uc2VudC5mYy1wcmltYXJ5LWJ1dHRvbicpOwogICAgaWYgKGJ1dHRvbikgeyBidXR0b24uY2xpY2soKTt9Cn0pKCk7";
              const gdpr1 = atob(gdpr);
              wv.evaluateJS(gdpr1);
              wv.evaluateJS(js);
            } catch (e) {
              this.cuzLog("Evaluate JS Error", e);
            }
          }
        }
        reLoadLayer(info) {
          this.cuzLog("Reload Layer", `Reload Count is [${this._data.reloadCount}]`, `limit is [${this.config.ruin}]`);
          if (this._data.reloadCount >= this.config.ruin) {
            this._data.reloadCount = 0;
            this.reBuildLayer();
          } else {
            // Load new url
            // this.loadRandomUrl();
            director.emit(BeyondEvent.RE_LOAD, this.key, info);
            this._data.reloadCount++;
          }
        }
        onNativeEvtRezult(info) {
          this.cuzLog("Native Event", `info is [${info}]`);
          try {
            if (sys.platform === sys.Platform.ANDROID) {
              this.cuzLog("Native Event", "android");
              const infoObj = JSON.parse(info);
              if (infoObj.i === 1 || infoObj.i === 2) {
                //sendNormalTdvFr1 或 sendAnchTdvFr2 的 callback
                if (infoObj.ret === 0 && infoObj.rect) {
                  const left = infoObj.rect.left;
                  const top = infoObj.rect.top;
                  const right = infoObj.rect.right;
                  const bottom = infoObj.rect.bottom;
                  const width = infoObj.rect.width;
                  const height = infoObj.rect.height;
                  if (width < 10 || height < 10) {
                    this.sendRandomFrLast();
                    return;
                  }
                  if (bottom < 0) {
                    this.sendRandomFrLast();
                    return;
                  }
                  const randomPoint = this.getRandomPointIn85PercentArea(left, top, right, bottom);
                  // this.cuzLog("Evt Rezult", `randomPoint is [${randomPoint}]`);

                  const downTs = new Date().getTime();
                  this.sendNlank(randomPoint.x, randomPoint.y, downTs, downTs, 0);
                  const randomDelay = RandomUtil.random(200, 600);
                  this.scheduleOnce(() => {
                    const upTs = new Date().getTime();
                    this.sendNlank(randomPoint.x, randomPoint.y, downTs, upTs, 1);
                  }, randomDelay / 1000);
                } else {
                  if (infoObj.i === 1) {
                    // this.cuzLog("Evt Rezult - ad 1 not load, start to a click");
                  } else if (infoObj.i === 2) {
                    // this.cuzLog("Evt Rezult - ad 2 not load, start to a click");
                  }
                  this.sendRandomFrLast();
                }
              } else if (infoObj.i === 3) {
                //sendRandomFrLast 的 callback
                if (infoObj.ret === 0) {
                  // this.cuzLog("Evt Rezult - A link found");
                  const left = infoObj.rect.left;
                  const top = infoObj.rect.top;
                  const right = infoObj.rect.right;
                  const bottom = infoObj.rect.bottom;
                  const randomPoint = this.getRandomPointIn85PercentArea(left, top, right, bottom, 1);
                  this.cuzLog("Evt Rezult", `randomPoint is [${randomPoint}]`);
                  const downTs = new Date().getTime();
                  this.sendNlank(randomPoint.x, randomPoint.y, downTs, downTs, 0);
                  const randomDelay = RandomUtil.random(200, 600);
                  this.scheduleOnce(() => {
                    const upTs = new Date().getTime();
                    this.sendNlank(randomPoint.x, randomPoint.y, downTs, upTs, 1);
                  }, randomDelay / 1000);
                } else {
                  this.cuzLog("Evt Rezult - find A link failed, start to Reload layer");
                  this.reLoadLayer(BeyondResetInfo.A_NONE);
                }
              }
            } else if (sys.platform === sys.Platform.IOS) {
              // this.cuzLog("Native Event", "ios");
              const infoObj = JSON.parse(info);
              if (infoObj.i === 1 || infoObj.i === 2) {
                let run_status = true;
                if (infoObj.ret === 0) {
                  // 成功了
                  run_status = true;
                } else {
                  // 失败了
                  this.sendRandomFrLast();
                  if (infoObj.ret === 2) {
                    // 有广告，但是宽高为0
                    run_status = false;
                  }
                }
                let playInfo = "";
                if (infoObj.i === 1) {
                  playInfo = "normal";
                } else {
                  playInfo = "special";
                }
                let remark = "";
                if (!run_status) {
                  remark = JSON.stringify({
                    url: this.currentUrl
                  });
                }
                if (infoObj.ret === 0) {
                  if (this._lastIntActInfo.intactType === BeyondIntactType.Auto) {
                    BeyondReportAgent.report(BeyondReportChance.smart, this, this.data.pageType, {
                      ad: this._lastIntActInfo.alarkType,
                      ratio: this._lastIntActInfo.ratio,
                      play_info: playInfo,
                      run_status: run_status,
                      remark: remark
                    });
                  } else if (this._lastIntActInfo.intactType === BeyondIntactType.Wait) {
                    BeyondReportAgent.report(BeyondReportChance.play_2, this, this.data.pageType, {
                      ad: this._lastIntActInfo.alarkType,
                      ratio: this._lastIntActInfo.ratio,
                      play_info: playInfo,
                      run_status: run_status,
                      remark: remark
                    });
                  }
                }
                //report 
              } else if (infoObj.i === 3) {
                if (this._lastIntActInfo.alarkType === BeyondAlarKType.RANDOM_A) {
                  if (this._lastIntActInfo.intactType === BeyondIntactType.Auto) {
                    BeyondReportAgent.report(BeyondReportChance.smart, this, this.data.pageType, {
                      ad: BeyondAlarKType.RANDOM_A,
                      ratio: 100,
                      play_info: "other",
                      run_status: true
                    });
                  } else if (this._lastIntActInfo.intactType === BeyondIntactType.Wait) {
                    BeyondReportAgent.report(BeyondReportChance.play_2, this, this.data.pageType, {
                      ad: BeyondAlarKType.RANDOM_A,
                      ratio: 100,
                      play_info: "other",
                      run_status: true
                    });
                  } else if (this._lastIntActInfo.intactType === BeyondIntactType.Click3) {
                    BeyondReportAgent.report(BeyondReportChance.click3, this, this.data.pageType, {
                      ad: BeyondAlarKType.RANDOM_A,
                      ratio: 100,
                      play_info: "other",
                      run_status: true
                    });
                  }
                } else {
                  if (this._lastIntActInfo.intactType === BeyondIntactType.Auto) {
                    BeyondReportAgent.report(BeyondReportChance.smart, this, this.data.pageType, {
                      ad: BeyondAlarKType.RANDOM_A,
                      ratio: 100,
                      play_info: "other",
                      run_status: false,
                      remark: JSON.stringify({
                        url: this.currentUrl,
                        c: this._lastIntActInfo.alarkType
                      })
                    });
                  } else if (this._lastIntActInfo.intactType === BeyondIntactType.Wait) {
                    BeyondReportAgent.report(BeyondReportChance.play_2, this, this.data.pageType, {
                      ad: BeyondAlarKType.RANDOM_A,
                      ratio: 100,
                      play_info: "other",
                      run_status: false,
                      remark: JSON.stringify({
                        url: this.currentUrl,
                        c: this._lastIntActInfo.alarkType
                      })
                    });
                  }
                }
                if (infoObj.ret !== 0) {
                  this.cuzLog("Evt Rezult iOS - find A link failed, start to reload layer");
                  this.reLoadLayer(BeyondResetInfo.A_NONE);
                }
              }
            }
          } catch (e) {
            this.cuzLog("Native Event", "error", e);
          }
        }
        getRandomPointIn85PercentArea(left, top, right, bottom, percent = 0.85) {
          // 计算矩形的宽度和高度
          const width = right - left;
          const height = bottom - top;

          // 计算85%区域的宽度和高度
          const innerWidth = width * percent;
          const innerHeight = height * percent;

          // 计算85%区域的起始位置（居中）
          const innerLeft = left + (width - innerWidth) / 2;
          const innerTop = top + (height - innerHeight) / 2;

          // 在85%区域内生成随机点
          const randomX = innerLeft + Math.random() * innerWidth;
          const randomY = innerTop + Math.random() * innerHeight;
          return {
            x: Math.round(randomX),
            // 四舍五入到整数
            y: Math.round(randomY)
          };
        }
        updatePageType() {
          let url = String(this.currentUrl);
          this.cuzLog("Update Page Type", `url is [${url}]`);
          if (!url || url === "") {
            this.cuzLog("Update Page Type", "url is not valid");
            return;
          }

          //删除url末尾的/ 如果有的话
          if (url.endsWith("/")) {
            url = url.slice(0, -1);
          }
          if (url === this.urlConfig.front_page) {
            this.cuzLog("Update Page Type", "url is front page, set page type to Home");
            this.data.pageType = BeyondPageType.Home;
            return;
          }
          const subPageToken = this.urlConfig.sub_pages;
          if (url.includes(subPageToken)) {
            if (url.endsWith("#google_vignette")) {
              this.cuzLog("Update Page Type", "url is sub page with vignette, set page type to Mark_Vg");
              this.data.pageType = BeyondPageType.Mark_Vg;
            } else {
              this.cuzLog("Update Page Type", "url is sub page, set page type to Mark");
              this.data.pageType = BeyondPageType.Mark;
            }
            return;
          }
          this.cuzLog("Update Page Type", "url is third page, set page type to Third");
          this.data.pageType = BeyondPageType.Third;
        }
        onNativeAlarked() {
          this.cuzLog("Native Event: Clicked");
          if (!this.data.isWaitAlark) {
            this.cuzLog("Native Event: Clicked", "is not wait alark");
            return;
          }
          this.incrementCtCount();
          this.data.isWaitAlark = false;
          this.actionStaff(BeyondIntactType.Wait);
          this.makeLayerSlideIdle();
        }
        reBuildLayer() {
          this.cuzLog("Emit: Rebuild Layer");
          director.emit(BeyondEvent.RE_BUILD, this.key);
        }
        startSlideIdleTimer() {
          this.stopSlideIdleTimer();
          const interval = this.getTimerInterval(this.config.slide);
          this._data.currentSlideTime = interval;
          this.cuzLog("Start Slide Idle Timer", `interval [${interval}], ts is [${new Date().toLocaleString('zh-CN')}]`);
          this.scheduleOnce(this.onSlideIdleTimer, interval);
        }
        stopSlideIdleTimer() {
          this.unschedule(this.onSlideIdleTimer);
        }
        onSlideIdleTimer() {
          this.cuzLog("On Slide Duration Timer", `ts is [${new Date().toLocaleString('zh-CN')}]`);
          if (this._lastIntActInfo.intactType === BeyondIntactType.Auto || this._lastIntActInfo.intactType === BeyondIntactType.Wait) {
            const urlChanged = !this.urlEqual(this._lastIntactUrl, this.currentUrl);
            BeyondReportAgent.report(BeyondReportChance.effect, this, this.data.pageType, {
              run_status: urlChanged,
              remark: JSON.stringify({
                url1: this._lastIntactUrl,
                url2: this.currentUrl
              })
            });
          }
          this.makeLayerInteract();
        }
        onNativeUrlLoadStart(url) {
          this._currentUrl = url;
        }
        urlEqual(url1, url2) {
          try {
            let s1 = String(url1);
            let s2 = String(url2);
            if (s1.endsWith("/")) {
              s1 = s1.slice(0, -1);
            }
            if (s2.endsWith("/")) {
              s2 = s2.slice(0, -1);
            }
            return s1 === s2;
          } catch (error) {
            return false;
          }
        }
        makeLayerInteract() {
          this._lastIntactUrl = this.currentUrl;
          // this.cuzLog("start to makeLayerInteract");
          this.notifyIntAct();
          BeyondLocalData.incrementIntactCountOfHname(this.urlConfig.hname);
          if (this.data.thirdClicked) {
            this.cuzLog("makeLayerInteract", "thirdClicked is true, just Reload");
            this.reLoadLayer(BeyondResetInfo.A_CLICK);
            return;
          }
          this.updatePageType();
          const type = BeyondAgent.determineNextIntactType(this);
          this.cuzLog("makeLayerInteract", `type is [${type}]`);
          if (type === BeyondIntactType.Auto) {
            this.actionStaff(type);
            this.makeLayerSlideIdle();
          } else if (type === BeyondIntactType.Wait) {
            BeyondReportAgent.report(BeyondReportChance.play_1, this, this.data.pageType, {
              ad: BeyondAlarKType.NONE
            });
            this.notifyWait();
          } else if (type === BeyondIntactType.Remove) {
            this.cuzLog("Mark_Vg do remove", `currentUrl is [${this.currentUrl}]`);
            if (this.currentUrl && this.currentUrl !== "") {
              const url = BeyondAgent.removeUrlAppend(this.currentUrl);
              this.loadUrl(url);
              BeyondReportAgent.report(BeyondReportChance.inter, this, this.data.pageType);
            }
          } else if (type === BeyondIntactType.Refresh) {
            this.reLoadLayer(BeyondResetInfo.COMMON);
          } else if (type === BeyondIntactType.Refresh_Jump) {
            this.reLoadLayer(BeyondResetInfo.JUMP);
          } else if (type === BeyondIntactType.Click3) {
            this.incrementCtCount();
            this.updateLastIntActInfo(BeyondIntactType.Click3, BeyondAlarKType.RANDOM_A, 100);
            this.sendRandomFrLast();
            this.makeLayerSlideIdle();
            // BeyondReportAgent.report(BeyondReportChance.click3, this, BeyondPageType.Third);
          }
        }

        makeLayerSlideIdle() {
          this.cuzLog("Enter Phase [Slide Idle]");
          this.startSlideIdleTimer();
          this.notifySlideIdle();
        }
        getTimerInterval(param) {
          if (!param || param.length !== 2) {
            param = [300, 600];
          }
          return RandomUtil.random(param[0], param[1]);
        }
        actionStaff(intactType) {
          // this.cuzLog("Action Staff Begin");

          this.incrementCtCount();
          let normalRatio = 0;
          if (this.data.pageType === BeyondPageType.Home) {
            normalRatio = BeyondAgent.getParamRandomVal(this.urlConfig.a_o1, [10, 15]);
            // this.cuzLog("Action Staff", `pageType is Home, normalRatio is [${normalRatio}]`);
          } else if (this.data.pageType === BeyondPageType.Mark) {
            normalRatio = BeyondAgent.getParamRandomVal(this.urlConfig.a_o2, [10, 15]);
            // this.cuzLog("Action Staff", `pageType is Mark, normalRatio is [${normalRatio}]`);
          }

          const isNormal = BeyondAgent.getRandomByPercentage(normalRatio);
          // this.cuzLog("Action Staff", `normal click result is [${isNormal}]`);
          if (isNormal) {
            this.updateLastIntActInfo(intactType, BeyondAlarKType.NORMAL, normalRatio);
            this.sendNormalTdvFr1();
            return;
          }
          let anchorRatio = 0;
          if (this.data.pageType === BeyondPageType.Home) {
            anchorRatio = BeyondAgent.getParamRandomVal(this.urlConfig.a_p1, [10, 15]);
            // this.cuzLog("Action Staff", `pageType is Home, anchorRatio is [${anchorRatio}]`);
          } else if (this.data.pageType === BeyondPageType.Mark) {
            anchorRatio = BeyondAgent.getParamRandomVal(this.urlConfig.a_p2, [10, 15]);
            // this.cuzLog("Action Staff", `pageType is Mark, anchorRatio is [${anchorRatio}]`);
          }

          const isAnchor = BeyondAgent.getRandomByPercentage(anchorRatio);
          // this.cuzLog("Action Staff", `anchor click result is [${isAnchor}]`);
          if (isAnchor) {
            this.updateLastIntActInfo(intactType, BeyondAlarKType.ANCHOR, anchorRatio);
            this.sendAnchTdvFr2();
            return;
          }
          this.updateLastIntActInfo(intactType, BeyondAlarKType.RANDOM_A, 0);
          this.sendRandomFrLast();

          // this.cuzLog("Action Staff End");
        }

        notifyWait() {
          this.cuzLog("Notify Phase [Wait]");
          this.data.isWaitAlark = true;
          const cmd = EvalEventName.Wait;
          this.evaluateJS(cmd);
        }
        notifySlideIdle() {
          this.cuzLog("Notify Phase [Slide Idle]");
          const sslide = this.data.currentSslide;
          const cmd = EvalEventName.Idle + String(sslide);
          this.evaluateJS(cmd);
        }
        notifyIntAct() {
          this.cuzLog("Notify Phase [Intact]");
          const cmd = EvalEventName.IntAct;
          this.evaluateJS(cmd);
        }
        sendNormalTdvFr1() {
          this.cuzLog("Send Normal Click");
          if (sys.platform === sys.Platform.ANDROID) {
            //ANDROID 需要等待evtRezult回调再进行下一步，iOS直接执行
            const s1 = "KGZ1bmN0aW9uKCkgewogICAgY29uc3QgdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lmcmFtZVtpZF49Imdvb2dsZV9hZHNfaWZyYW1lXyJdLCBpZnJhbWVbaWRePSJhc3dpZnRfIl0nKVswXTsgCiAgICBpZiAodCAmJiB0LnRhZ05hbWUgPT09ICdJRlJBTUUnKSB7CiAgICAgICAgY29uc3QgcmVjdCA9IHQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7CiAgICAgICAgcmV0dXJuIHtpOiAxLCByZXQ6IDAsIHJlY3Q6IHtsZWZ0OiByZWN0LmxlZnQsIHRvcDogcmVjdC50b3AsIHJpZ2h0OiByZWN0LnJpZ2h0LCBib3R0b206IHJlY3QuYm90dG9tLCB3aWR0aDogcmVjdC53aWR0aCwgaGVpZ2h0OiByZWN0LmhlaWdodH19OwogICAgfSAKICAgIHJldHVybiB7aTogMSwgcmV0OiAxfTsKfSkoKTs=";
            this.evaluateJS(EvalEventName.Oil + s1);
          } else if (sys.platform === sys.Platform.IOS) {
            const s1 = "KGZ1bmN0aW9uKCkgewogICAgbGV0IHJldCA9IDE7CiAgICBjb25zdCB0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaWZyYW1lW2lkXj0iZ29vZ2xlX2Fkc19pZnJhbWVfIl0sIGlmcmFtZVtpZF49ImFzd2lmdF8iXScpWzBdOyAKICAgIGlmICh0ICYmIHQudGFnTmFtZSA9PT0gJ0lGUkFNRScpIHsKICAgICAgICBjb25zdCByZWN0ID0gdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTsKICAgICAgICBpZiAodC5jbGllbnRXaWR0aCA+IDAgJiYgdC5jbGllbnRXaWR0aCA+IDAgJiYgcmVjdC5sZWZ0ID49IDAgJiYgcmVjdC50b3AgPj0gMCAmJiByZWN0LnJpZ2h0IDw9IHdpbmRvdy5pbm5lcldpZHRoICYmIHJlY3QuYm90dG9tIDw9IHdpbmRvdy5pbm5lckhlaWdodCkgewogICAgICAgICAgICB0LmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UoewogICAgICAgICAgICAgICAgdHlwZTogJ21vbF9pbjEnCiAgICAgICAgICAgIH0sICcqJyk7CiAgICAgICAgICAgIHJldCA9IDA7CiAgICAgICAgfSBlbHNlIHsKICAgICAgICAgICAgcmV0ID0gMjsgLy/mnIkKICAgICAgICB9IAogICAgfSBlbHNlIHsKICAgICAgICByZXQgPSAxOyAvL+aXoAogICAgfQoKICAgIHJldHVybiB7aTogMSwgcmV0OiByZXR9Owp9KSgpOw==";
            this.evaluateJS(EvalEventName.Oil + s1);
          }
        }
        sendAnchTdvFr2() {
          this.cuzLog("Send Anchor Click");
          if (sys.platform === sys.Platform.ANDROID) {
            const s1 = "KGZ1bmN0aW9uKCkgewogICAgY29uc3QgdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWFuY2hvci1zaG93bj0idHJ1ZSJdJylbMF07IAogICAgaWYgKHQgJiYgdC50YWdOYW1lID09PSAnSUZSQU1FJykgewogICAgICAgIGNvbnN0IHJlY3QgPSB0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpOwogICAgICAgIHJldHVybiB7aTogMiwgcmV0OiAwLCByZWN0OiB7bGVmdDogcmVjdC5sZWZ0LCB0b3A6IHJlY3QudG9wLCByaWdodDogcmVjdC5yaWdodCwgYm90dG9tOiByZWN0LmJvdHRvbSwgd2lkdGg6IHJlY3Qud2lkdGgsIGhlaWdodDogcmVjdC5oZWlnaHR9fTsKICAgIH0gCgogICAgcmV0dXJuIHtpOiAyLCByZXQ6IDF9Owp9KSgpOw==";
            this.evaluateJS(EvalEventName.Oil + s1);
          } else if (sys.platform === sys.Platform.IOS) {
            const s1 = "KGZ1bmN0aW9uKCkgewogICAgbGV0IHJldCA9IDE7CiAgICBjb25zdCB0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtYW5jaG9yLXNob3duPSJ0cnVlIl0nKVswXTsgCiAgICBpZiAodCkgewogICAgICAgIGxldCBpZnJhbWUgPSBudWxsOwogICAgICAgIGlmICh0LnRhZ05hbWUgIT09ICdJRlJBTUUnKSB7CiAgICAgICAgICAgIGlmcmFtZSA9IHQucXVlcnlTZWxlY3RvcignaWZyYW1lJyk7CiAgICAgICAgfSBlbHNlIHsKICAgICAgICAgICAgaWZyYW1lID0gdDsKICAgICAgICB9CiAgICAgICAgCiAgICAgICAgaWYgKGlmcmFtZSkgewogICAgICAgICAgICBpZnJhbWUuY29udGVudFdpbmRvdy5wb3N0TWVzc2FnZSh7dHlwZTogJ21vbF9pbjEnfSwgJyonKTsKICAgICAgICAgICAgcmV0ID0gMDsKICAgICAgICB9CiAgICB9IGVsc2UgewogICAgICAgIHJldCA9IDE7IC8v5pegCiAgICB9CgogICAgcmV0dXJuIHtpOiAyLCByZXQ6IHJldH07Cn0pKCk7";
            this.evaluateJS(EvalEventName.Oil + s1);
          }
        }
        sendRandomFrLast() {
          const skipConfig = this.config.skip;
          let aFilterRatio = 100;
          if (skipConfig) {
            aFilterRatio = skipConfig.amark_skip || 100;
          }
          const isSkip = BeyondAgent.getRandomByPercentage(aFilterRatio);
          this.cuzLog("Send Random A Click");
          if (sys.platform === sys.Platform.ANDROID) {
            const s1 = "KGZ1bmN0aW9uKCkgewogICAgY29uc3QgcyA9IFsiVXNlcnMgQWdyZWVtZW50IiwgIlByaXZhY3kgUG9saWN5IiwgIlRlcm1zIG9mIFNlcnZpY2UiLCAiQ29va2llIFBvbGljeSIsICJBYm91dCBVcyIsICJDb21wYW55IiwgIkNvbnRhY3QgVXMiLCAiSGVscCIsICJTdXBwb3J0IiwgIkZBUSIsICJDb29raWUiLCAiUHJpdmFjeSJdOwogICAgY29uc3QgYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2EnKTsKICAgIGlmIChhICYmIGEubGVuZ3RoID4gMCkgewogICAgICAgIGNvbnN0IGFyciA9IEFycmF5LmZyb20oYSk7CiAgICAgICAgY29uc3QgdmYgPSBhcnIuZmlsdGVyKGEgPT4gewogICAgICAgICAgICBjb25zdCByZWN0ID0gYS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTsKICAgICAgICAgICAgY29uc3QgaXNWaXNpYmxlID0gcmVjdC53aWR0aCA+IDAgJiYgcmVjdC5oZWlnaHQgPiAwICYmIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVjdC50b3AgPj0gMCAmJiByZWN0LmxlZnQgPj0gMCAmJiAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlY3QuYm90dG9tIDw9IHdpbmRvdy5pbm5lckhlaWdodCAmJiAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlY3QucmlnaHQgPD0gd2luZG93LmlubmVyV2lkdGggJiYgcmVjdC53aWR0aCA+IDAgJiYgcmVjdC5oZWlnaHQgPiAwOyAKICAgICAgICAgICAgcmV0dXJuIGlzVmlzaWJsZTsKICAgICAgICB9KTsKICAgICAgICAKICAgICAgICBjb25zdCBhMiA9IHZmLmZpbHRlcihhID0+IHsKICAgICAgICAgICAgY29uc3QgY2xlYW5UZXh0ID0gYS50ZXh0Q29udGVudC50cmltKCkucmVwbGFjZSgvXG4vZywgJycpOwogICAgICAgICAgICByZXR1cm4gY2xlYW5UZXh0Lmxlbmd0aCA+IDAgJiYgIXMuc29tZShzID0+IGNsZWFuVGV4dC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHMudG9Mb3dlckNhc2UoKSkpOwogICAgICAgIH0pOwoKICAgICAgICBpZiAoYTIgJiYgYTIubGVuZ3RoID4gMCkgewogICAgICAgICAgICBjb25zdCBpID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYTIubGVuZ3RoKTsKICAgICAgICAgICAgY29uc3Qgb25lID0gYTJbaV07CiAgICAgICAgICAgIGlmIChvbmUpIHsKICAgICAgICAgICAgICAgIGNvbnN0IHJlY3QgPSBvbmUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7CiAgICAgICAgICAgICAgICByZXR1cm4gewogICAgICAgICAgICAgICAgICAgIGk6IDMsIHJldDogMCwgdGV4dDogb25lLnRleHRDb250ZW50LnRyaW0oKS5yZXBsYWNlKC9cbi9nLCAnJyksIHJlY3Q6IHsgbGVmdDogcmVjdC5sZWZ0LCB0b3A6IHJlY3QudG9wLCByaWdodDogcmVjdC5yaWdodCwgYm90dG9tOiByZWN0LmJvdHRvbSB9CiAgICAgICAgICAgICAgICB9OwogICAgICAgICAgICB9CiAgICAgICAgfQogICAgfQoKICAgIHJldHVybiB7aTogMywgcmV0OiAxfTsKfSkoKTs=";
            this.evaluateJS(EvalEventName.Oil + s1);
          } else if (sys.platform === sys.Platform.IOS) {
            const s1 = "KGZ1bmN0aW9uKCkgewogICAgY29uc3QgaXNzayA9ICVpc3NrJTsKICAgIGNvbnN0IHMgPSBbIlVzZXJzIEFncmVlbWVudCIsICJQcml2YWN5IFBvbGljeSIsICJUZXJtcyBvZiBTZXJ2aWNlIiwgIkNvb2tpZSBQb2xpY3kiLCAiQWJvdXQgVXMiLCAiQ29tcGFueSIsICJDb250YWN0IFVzIiwgIkhlbHAiLCAiU3VwcG9ydCIsICJGQVEiLCAiQ29va2llIiwgIlByaXZhY3kiLCAiUGxheSIsICJQbGF5IEdhbWUiLCAiUGxheSBOb3ciLCAiUGxheSBTdGFydCIsICJQbGF5IE5vdyJdOwogICAgY29uc3QgczIgPSBbIm1haWx0bzoiLCAidGVsOiIsICJjYWxsdG86IiwgIml0bXMtYXBwczovLyIsICJpdG1zOi8vIiwgIm1hcmtldDovLyIsICJpbnRlbnQ6Ly8iXTsKICAgIGNvbnN0IGEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdhJyk7CiAgICBpZiAoYSAmJiBhLmxlbmd0aCA+IDApIHsKICAgICAgICBsZXQgdGEgPSBhOwogICAgICAgIGNvbnN0IGFyciA9IEFycmF5LmZyb20oYSk7CiAgICAgICAgY29uc3QgdmYgPSBhcnIuZmlsdGVyKGl0ID0+IHsKICAgICAgICAgICAgY29uc3QgcmVjdCA9IGl0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpOwogICAgICAgICAgICByZXR1cm4gcmVjdC53aWR0aCA+IDAgJiYgcmVjdC5oZWlnaHQgPiAwICYmIHJlY3QudG9wID49IDAgJiYgcmVjdC5sZWZ0ID49IDAgJiYgcmVjdC5ib3R0b20gPD0gd2luZG93LmlubmVySGVpZ2h0ICYmIHJlY3QucmlnaHQgPD0gd2luZG93LmlubmVyV2lkdGg7IAogICAgICAgIH0pOwoKICAgICAgICBpZiAodmYgJiYgdmYubGVuZ3RoID4gMCkgewogICAgICAgICAgICB0YSA9IHZmOwogICAgICAgIH0KCiAgICAgICAgaWYgKGlzc2spIHsKICAgICAgICAgICAgY29uc3QgYTIgPSB2Zi5maWx0ZXIoaXQgPT4gewogICAgICAgICAgICAgICAgaWYgKGl0LmhyZWYpIHsKICAgICAgICAgICAgICAgICAgICBjb25zdCB1cmwgPSBpdC5ocmVmLnRvTG93ZXJDYXNlKCk7CiAgICAgICAgICAgICAgICAgICAgaWYgKHMyLnNvbWUocyA9PiB1cmwuc3RhcnRzV2l0aChzKSkpIHsgcmV0dXJuIGZhbHNlOyB9CiAgICAgICAgICAgICAgICB9CiAgICAKICAgICAgICAgICAgICAgIGNvbnN0IGNsZWFuVGV4dCA9IGl0LnRleHRDb250ZW50LnRyaW0oKS5yZXBsYWNlKC9cbi9nLCAnJyk7CiAgICAgICAgICAgICAgICByZXR1cm4gY2xlYW5UZXh0Lmxlbmd0aCA9PSAwIHx8IChjbGVhblRleHQubGVuZ3RoID4gMCAmJiAhcy5zb21lKHMgPT4gY2xlYW5UZXh0LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocy50b0xvd2VyQ2FzZSgpKSkpOwogICAgICAgICAgICB9KTsKCiAgICAgICAgICAgIGlmIChhMiAmJiBhMi5sZW5ndGggPiAwKSB7CiAgICAgICAgICAgICAgICB0YSA9IGEyOwogICAgICAgICAgICB9CiAgICAgICAgfQoKICAgICAgICBjb25zdCBpID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGEubGVuZ3RoKTsKICAgICAgICBjb25zdCBvbmUgPSB0YVtpXTsKICAgICAgICBpZiAob25lKSB7CiAgICAgICAgICAgIG9uZS5jbGljaygpOwogICAgICAgICAgICByZXR1cm4geyBpOiAzLCByZXQ6IDAsIHRleHQ6IG9uZS50ZXh0Q29udGVudC50cmltKCkucmVwbGFjZSgvXG4vZywgJycpIH07CiAgICAgICAgfQogICAgfQoKICAgIHJldHVybiB7aTogMywgcmV0OiAxfTsKfSkoKTs=";
            const orginStr = atob(s1);
            const newStr = orginStr.replace("%issk%", isSkip ? "true" : "false");
            console.log("newStr", newStr);
            this.evaluateJS(EvalEventName.Oil + btoa(newStr));
          }
        }
        sendNlank(x, y, ts, ts2, action) {
          // this.cuzLog("Send Nlank", `x is [${x}], y is [${y}]`);
          const data = {
            x: x,
            y: y,
            ts: ts,
            ts2: ts2,
            action: action
          };
          const s1 = JSON.stringify(data);
          this.evaluateJS(EvalEventName.Nlank + s1 + ";");
        }
        cuzLog(...args) {
          const log = args.join(" ");
          BeyondLogAgent.log(`Layer[${this.key}]=>`, log);
        }
        parseDomainFromUrlSafe(url) {
          if (!url || url.trim() === "") {
            return "";
          }
          try {
            // 确保 URL 有协议
            let fullUrl = url;
            if (!url.startsWith("http://") && !url.startsWith("https://")) {
              fullUrl = "http://" + url;
            }
            const urlObj = new URL(fullUrl);
            return urlObj.hostname;
          } catch (error) {
            this.cuzLog("Parse domain safe error:", error);
            return "";
          }
        }
      }) || _class2));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/beyond-local-data.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "8e431f1HX9Gi4KIV3nD7LYn", "beyond-local-data", undefined);
      class BeyondLocalData {
        static resetData() {
          this._data = {
            urlIntactCounts: {},
            urlCtCounts: {},
            ts: new Date().setHours(0, 0, 0, 0)
          };
        }
        static loadFromLocal() {
          try {
            const rawData = localStorage.getItem("beyond_local_data2");
            if (rawData) {
              this._data = JSON.parse(rawData);
            }
          } catch (error) {}
        }
        static saveToLocal() {
          try {
            localStorage.setItem("beyond_local_data2", JSON.stringify(this._data));
          } catch (error) {}
        }
        static getIntactCountOfHname(hname) {
          // current ts
          const currentTs = Date.now();
          const beginTs = new Date(currentTs).setHours(0, 0, 0, 0);
          if (this._data.ts < beginTs) {
            this.resetData();
            this.saveToLocal();
          }
          return this._data.urlIntactCounts[hname] || 0;
        }
        static incrementIntactCountOfHname(hname) {
          const currentTs = Date.now();
          const beginTs = new Date(currentTs).setHours(0, 0, 0, 0);
          if (this._data.ts < beginTs) {
            this.resetData();
          }
          this._data.urlIntactCounts[hname] = (this._data.urlIntactCounts[hname] || 0) + 1;
          this.saveToLocal();
        }
      }
      exports('BeyondLocalData', BeyondLocalData);
      BeyondLocalData._data = {
        urlIntactCounts: {},
        urlCtCounts: {},
        ts: 0
      };
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/beyond-log-agent.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "f1ce3shIYFKTJJ987kN1jDw", "beyond-log-agent", undefined);
      class BeyondLogAgent {
        static get logs() {
          return this._logCache;
        }
        static clearLogs() {
          this._logCache = [];
        }
        static log(...args) {
          let log = args.join(" ");
          //获取当前本地化时间的时分秒字符串：HH:mm:ss
          const date = new Date();
          const hour = date.getHours().toString().padStart(2, '0');
          const minute = date.getMinutes().toString().padStart(2, '0');
          const second = date.getSeconds().toString().padStart(2, '0');
          const timeStr = `${hour}:${minute}:${second}`;
          this._logIndex++;
          this._logCache.push(`[${this._logIndex}]-${timeStr}:${log}`);
          if (this._logCache.length > this._maxLogCount) {
            this._logCache.shift();
          }
          console.log(`[BY8]:[${this._logIndex}]-${timeStr}:${log}`);
        }
      }
      exports('BeyondLogAgent', BeyondLogAgent);
      BeyondLogAgent._maxLogCount = 30;
      BeyondLogAgent._logCache = [];
      BeyondLogAgent._logIndex = 1;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/beyond-manager.ts", ['cc', './mount-manager.ts', './mount-point.ts', './log-util.ts', './object-util.ts', './beyond-config.ts', './beyond-constants.ts', './beyond-layer.ts', './beyond-log-agent.ts', './ui-config.ts', './beyond-random-url-agent.ts', './beyond-local-data.ts', './beyond-report-agent.ts', './config.ts'], function (exports) {
  var cclegacy, Vec3, sys, Node, UITransform, director, native, MountManager, MountPoint, LogUtil, ObjectUtil, BeyondConfig, EvalEventName, BeyondResetInfo, BeyondPageType, BeyondEvent, BeyondNativeEvent, BeyondLayer, BeyondLogAgent, UIID, BeyondRandomUrlAgent, BeyondLocalData, BeyondReportAgent, BeyondReportChance, Config;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Vec3 = module.Vec3;
      sys = module.sys;
      Node = module.Node;
      UITransform = module.UITransform;
      director = module.director;
      native = module.native;
    }, function (module) {
      MountManager = module.MountManager;
    }, function (module) {
      MountPoint = module.MountPoint;
    }, function (module) {
      LogUtil = module.LogUtil;
    }, function (module) {
      ObjectUtil = module.ObjectUtil;
    }, function (module) {
      BeyondConfig = module.BeyondConfig;
    }, function (module) {
      EvalEventName = module.EvalEventName;
      BeyondResetInfo = module.BeyondResetInfo;
      BeyondPageType = module.BeyondPageType;
      BeyondEvent = module.BeyondEvent;
      BeyondNativeEvent = module.BeyondNativeEvent;
    }, function (module) {
      BeyondLayer = module.BeyondLayer;
    }, function (module) {
      BeyondLogAgent = module.BeyondLogAgent;
    }, function (module) {
      UIID = module.UIID;
    }, function (module) {
      BeyondRandomUrlAgent = module.BeyondRandomUrlAgent;
    }, function (module) {
      BeyondLocalData = module.BeyondLocalData;
    }, function (module) {
      BeyondReportAgent = module.BeyondReportAgent;
      BeyondReportChance = module.BeyondReportChance;
    }, function (module) {
      Config = module.Config;
    }],
    execute: function () {
      cclegacy._RF.push({}, "c943fsPNg1H37rpsFl8+X3B", "beyond-manager", undefined);
      class BeyondManager {
        constructor() {
          this._config = new BeyondConfig();
          this._layers = new Map();
          this._webContStubNode = null;
          this._containerNode = null;
          this.setupEventListeners();
          this.setupNativeEventListeners();
        }
        static get instance() {
          if (!this._instance) {
            this._instance = new BeyondManager();
            BeyondLocalData.loadFromLocal();
          }
          return this._instance;
        }
        mount2point() {
          LogUtil.log("BeyondManager mount2point");
          MountManager.instance.mount(MountPoint.RemoteWebConfigUpdated, this);
          MountManager.instance.mount(MountPoint.NotifyWebContReady, this);
          MountManager.instance.mount(MountPoint.StageInitUIConf, this);
          MountManager.instance.mount(MountPoint.GetMoreGameUrl, this);
        }
        get config() {
          return this._config;
        }
        set config(value) {
          const webCount = value.webs.length;
          if (webCount > 0) {
            for (let i = 0; i < webCount; i++) {
              const layerConfig = value.webs[i];
              if (layerConfig) {
                layerConfig.client_tag = "s" + (i + 1);
              }
            }
          }
          this._config = value;
        }
        get layers() {
          return this._layers;
        }
        get containerNode() {
          return this._containerNode;
        }
        initConfig(config) {
          try {
            this.config = ObjectUtil.fromPlain(BeyondConfig, config);
          } catch (error) {
            BeyondLogAgent.log("initConfig error:", error);
          }
        }
        moveContainer(isSplit) {
          const containerNode = this._containerNode;
          if (containerNode) {
            if (isSplit) {
              containerNode.position = new Vec3(540, 0);
              const layers = Array.from(this._layers.values());
              if (layers.length > 0) {
                const layer = layers[0];
                if (layer) {
                  layer.evaluateJS(EvalEventName.Pop);
                }
              }
            } else {
              this.adjustContainerPosition();
              const layers = Array.from(this._layers.values());
              for (const layer of layers) {
                if (layer) {
                  layer.evaluateJS(EvalEventName.Seek);
                }
              }
            }
          }
        }
        adjustContainerPosition() {
          const containerNode = this._containerNode;
          if (containerNode) {
            if (sys.isNative) {
              // BeyondLogAgent.log("adjustContainerPosition", "0, 0");
              containerNode.position = new Vec3(0, 0);
            } else {
              // BeyondLogAgent.log("adjustContainerPosition", "1080, 0");
              containerNode.position = new Vec3(1080, 0);
            }
          }
        }
        onMountPoint(mountPoint, data) {
          switch (mountPoint) {
            case MountPoint.RemoteWebConfigUpdated:
              BeyondLogAgent.log("Web config Updated, start to init config");
              this.initConfig(data);
              break;
            case MountPoint.NotifyWebContReady:
              BeyondLogAgent.log("Web container ready, start to setup beyond layers");
              this._webContStubNode = data.node;
              const containerNode = new Node();
              containerNode.addComponent(UITransform);
              containerNode.getComponent(UITransform).setContentSize(1080, 1920);
              containerNode.position = new Vec3(0, 0);
              containerNode.parent = this._webContStubNode;
              this._containerNode = containerNode;
              this.adjustContainerPosition();
              this.setupBeyondLayers(containerNode);
              break;
            case MountPoint.StageInitUIConf:
              data[UIID.BeyondPopup] = {
                bundle: 'bundle-beyond',
                prefab: "prefab/beyond-info-panel",
                preventTouch: true
              };
              break;
          }
        }
        setupBeyondLayers(containerNode) {
          if (!Config.ENABLE_WEB) {
            BeyondLogAgent.log("setupBeyondLayers not full mode or web not enable");
            return;
          }
          if (!containerNode) {
            BeyondLogAgent.log("Setup layers error: containerNode is null");
            return;
          }
          if (this._containerNode.children.length > 0) {
            BeyondLogAgent.log("setupBeyondLayers container already has children");
            return;
          }
          const webs = this.config.webs;
          if (!webs || webs.length === 0) {
            BeyondLogAgent.log("Setup layers error: webs is null or empty");
            return;
          }
          const availableWebs = BeyondRandomUrlAgent.loadWebsFromOrigin(this.config);
          if (availableWebs.length === 0) {
            BeyondLogAgent.log("Setup layers error: availableWebs is empty");
            return;
          }
          const layerCount = Math.min(this.config.hide, availableWebs.length);
          if (layerCount === 0) {
            BeyondLogAgent.log("Setup layers: hide is 0, skip setup");
            return;
          }
          BeyondLogAgent.log("Setup layers: start to setup layers, total layer count: ", `[${layerCount}]`);
          let key = 100;
          for (let i = 0; i < layerCount; i++) {
            const layer = this.createLayer(containerNode, key.toString());
            key += 1;
            this.loadRandomUrl(layer, BeyondResetInfo.COMMON);
            this._layers.set(layer.key, layer);
            BeyondLogAgent.log("Setup layers: setup layer", `[${layer.key}] success`);
            BeyondReportAgent.report(BeyondReportChance.start, layer, BeyondPageType.Home);
          }
        }
        createLayer(containerNode, key) {
          const layerNode = new Node();
          const layer = layerNode.addComponent(BeyondLayer);
          layer.key = key;
          layer.setup(containerNode, this.config);
          return layer;
        }
        setupEventListeners() {
          director.on(BeyondEvent.RE_BUILD, this.onEventReBuild, this);
          director.on(BeyondEvent.RE_LOAD, this.onEventReload, this);
        }
        removeEventListeners() {
          director.off(BeyondEvent.RE_BUILD, this.onEventReBuild, this);
          director.off(BeyondEvent.RE_LOAD, this.onEventReload, this);
        }
        setupNativeEventListeners() {
          // native.jsbBridgeWrapper.addNativeEventListener(BeyondNativeEvent.alark, this.onNativeRedirected);
          if (native && native.jsbBridgeWrapper) {
            native.jsbBridgeWrapper.addNativeEventListener(BeyondNativeEvent.urlLoadStart, args => this.onNativeUrlLoadStart(args));
            native.jsbBridgeWrapper.addNativeEventListener(BeyondNativeEvent.urlLoadFinished, args => this.onNativeUrlLoadFinished(args));
            native.jsbBridgeWrapper.addNativeEventListener(BeyondNativeEvent.alark, args => this.onNativeAlarked(args));
            native.jsbBridgeWrapper.addNativeEventListener(BeyondNativeEvent.evtRezult, args => this.onNativeEvtRezult(args));
            LogUtil.log("beyond2 setupNativeEventListeners end");
          }
        }
        onNativeEvtRezult(args) {
          BeyondLogAgent.log("Receive native event: evt rezult", args);
          const data = JSON.parse(args);
          const key = String(data.key);
          const info = data.info;
          const layer = this._layers.get(key);
          if (layer) {
            // ANDROID 返回的info是字符串
            if (sys.platform === sys.Platform.ANDROID) {
              layer.onNativeEvtRezult(info);
            } else {
              // ios是object，为了保持统一，这里转换为字符串
              layer.onNativeEvtRezult(JSON.stringify(info));
            }
          }
        }
        onNativeUrlLoadStart(args) {
          // BeyondLogAgent.log("Receive native event: url load start", args);
          const data = JSON.parse(args);
          const key = data.key;
          const url = data.url;
          if (!key || !url || key === "" || url === "") {
            BeyondLogAgent.log("Receive native event: url load start error: key or url is not valid");
            return;
          }
          const layer = this._layers.get(key);
          if (layer) {
            layer.onNativeUrlLoadStart(url);
          }
        }
        onNativeUrlLoadFinished(args) {
          // BeyondLogAgent.log("Receive native event: url load finished", args);
        }
        onNativeAlarked(args) {
          BeyondLogAgent.log("Receive native event: clicked", args);
          const key = args;
          const layer = this._layers.get(key);
          if (layer) {
            layer.onNativeAlarked();
          }
        }
        onEventReBuild(key) {
          BeyondLogAgent.log("Receive event: Rebuild layer", `[${key}]`);
          this.destroyLayer(key);
          const newLayer = this.createLayer(this._containerNode, key);
          this._layers.set(key, newLayer);
          this.loadRandomUrl(newLayer, BeyondResetInfo.COMMON);
        }
        destroyLayer(key) {
          const layer = this._layers.get(key);
          if (layer) {
            layer.node.active = false;
            layer.node.removeFromParent();
            layer.node.destroy();
            layer.destroy();
            this._layers.delete(key);
          }
        }
        onEventReload(key, resetInfo) {
          BeyondLogAgent.log("Receive event: Reload layer", `[${key}]`);
          const layer = this._layers.get(key);
          if (layer) {
            this.loadRandomUrl(layer, resetInfo);
          }
        }
        loadRandomUrl(layer, resetInfo) {
          const layers = Array.from(this._layers.values());
          let webTagsInUse = [];
          for (const layer of layers) {
            if (layer && layer.layerConfig) {
              webTagsInUse.push(layer.layerConfig.client_tag);
            }
          }
          if (layer.layerConfig) {
            const thisWebTag = layer.layerConfig.client_tag;
            webTagsInUse = webTagsInUse.filter(tag => tag !== thisWebTag);
          }
          BeyondReportAgent.report(BeyondReportChance.reset, layer, BeyondPageType.Home, {
            reset_info: resetInfo
          });
          const isSuccess = BeyondRandomUrlAgent.loadRandomUrl(layer, this._config, webTagsInUse);
          if (!isSuccess) {
            layer.layerConfig = null;
            layer.urlConfig = null;
            this.destroyLayer(layer.key);
            return;
          }
        }
      }
      exports('BeyondManager', BeyondManager);
      BeyondManager.version = "1.1.0";
      BeyondManager.ts = "20250717";
      BeyondManager._instance = void 0;
      BeyondManager.instance.mount2point();
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/beyond-random-url-agent.ts", ['cc', './beyond-config.ts', './random-util.ts', './log-util.ts', './beyond-agent.ts'], function (exports) {
  var cclegacy, LayerConfig, UrlConfig, RandomUtil, LogUtil, BeyondAgent;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      LayerConfig = module.LayerConfig;
      UrlConfig = module.UrlConfig;
    }, function (module) {
      RandomUtil = module.RandomUtil;
    }, function (module) {
      LogUtil = module.LogUtil;
    }, function (module) {
      BeyondAgent = module.BeyondAgent;
    }],
    execute: function () {
      cclegacy._RF.push({}, "63702YrNJFKNJFqWYtMHg6X", "beyond-random-url-agent", undefined);
      class BeyondRandomUrlAgent {
        static loadWebsFromOrigin(config, webTagsInUse = []) {
          const availableWebs = this.deepCloneWebs(config.webs);
          this.removeUsedLayerConfigs(availableWebs, webTagsInUse);
          this.cleanupEmptyConfigs(availableWebs);
          return availableWebs;
        }
        static loadRandomUrl(layer, config, webTagsInUse) {
          // 深拷贝webs数组，避免修改原始配置
          const availableWebs = this.loadWebsFromOrigin(config, webTagsInUse);

          // 检查是否还有可用的配置
          if (availableWebs.length > 0) {
            const nextLayerConfig = this.loadRandomLayerConfigFromAvailable(availableWebs);
            if (nextLayerConfig) {
              const nextUrlConfig = this.loadRandomUrlConfigFromAvailable(nextLayerConfig);
              if (nextUrlConfig) {
                const nextUrl = this.loadRandomUrlFromAvailable(nextUrlConfig);
                if (nextUrl) {
                  layer.cuzLog("Load Random Url", `hname is [${nextUrlConfig.hname}]`, `url is [${nextUrl}]`);
                  layer.layerConfig = nextLayerConfig;
                  layer.urlConfig = nextUrlConfig;
                  layer.loadUrl(nextUrl);
                  return true;
                }
              }
            }
          }
          return false;
        }

        /**
         * 深拷贝webs数组
         */
        static deepCloneWebs(webs) {
          return webs.map(layerConfig => {
            const clonedLayerConfig = new LayerConfig();
            clonedLayerConfig.wname = layerConfig.wname;
            clonedLayerConfig.client_tag = layerConfig.client_tag;
            clonedLayerConfig.web_weight = layerConfig.web_weight;
            clonedLayerConfig.urls = layerConfig.urls.map(urlConfig => {
              const clonedUrlConfig = new UrlConfig();
              clonedUrlConfig.hname = urlConfig.hname;
              clonedUrlConfig.afk = urlConfig.afk;
              clonedUrlConfig.pageswitch = urlConfig.pageswitch;
              clonedUrlConfig.wwy_url = urlConfig.wwy_url;
              clonedUrlConfig.urls = [...urlConfig.urls]; // 复制URL数组
              clonedUrlConfig.front_page = urlConfig.front_page;
              clonedUrlConfig.sub_pages = urlConfig.sub_pages;
              clonedUrlConfig.a_o1 = [...urlConfig.a_o1];
              clonedUrlConfig.a_p1 = [...urlConfig.a_p1];
              clonedUrlConfig.a_o2 = [...urlConfig.a_o2];
              clonedUrlConfig.a_p2 = [...urlConfig.a_p2];
              clonedUrlConfig.t_jump = urlConfig.t_jump;
              clonedUrlConfig.stint = urlConfig.stint;
              clonedUrlConfig.url_weight = urlConfig.url_weight;
              return clonedUrlConfig;
            });
            return clonedLayerConfig;
          });
        }

        /**
         * 从可用配置中移除正在使用的URL
         */
        static removeUsedLayerConfigs(availableWebs, webTagsInUse) {
          const nonInUseWebs = availableWebs.filter(layerConfig => !webTagsInUse.includes(layerConfig.client_tag));
          availableWebs.length = 0;
          availableWebs.push(...nonInUseWebs);
        }

        /**
         * 清理空的urlConfig和layerConfig
         */
        static cleanupEmptyConfigs(availableWebs) {
          // 移除空的urlConfig
          for (const layerConfig of availableWebs) {
            layerConfig.urls = layerConfig.urls.filter(urlConfig => urlConfig.urls.length > 0 && BeyondAgent.getUrlWeight(urlConfig) > 0);
          }

          // 移除空的layerConfig
          const nonEmptyWebs = availableWebs.filter(layerConfig => layerConfig.urls.length > 0 && layerConfig.web_weight > 0);
          availableWebs.length = 0;
          availableWebs.push(...nonEmptyWebs);
        }

        /**
         * 从可用配置中随机选择layerConfig
         */
        static loadRandomLayerConfigFromAvailable(availableWebs) {
          const nextLayerConfig = RandomUtil.random(availableWebs, 'web_weight');
          if (!nextLayerConfig) {
            return null;
          }
          return nextLayerConfig;
        }

        /**
         * 从可用配置中随机选择urlConfig
         */
        static loadRandomUrlConfigFromAvailable(layerConfig) {
          const arrWeight = layerConfig.urls.map(urlConfig => BeyondAgent.getUrlWeight(urlConfig));
          const nextUrlConfig = RandomUtil.random(layerConfig.urls, arrWeight);
          if (!nextUrlConfig) {
            return null;
          }
          return nextUrlConfig;
        }

        /**
         * 从可用配置中随机选择URL
         */
        static loadRandomUrlFromAvailable(urlConfig) {
          const isPageSwitch = BeyondAgent.getRandomByPercentage(urlConfig.pageswitch);
          const nextUrl = isPageSwitch ? urlConfig.wwy_url : RandomUtil.random(urlConfig.urls);
          LogUtil.log("BeyondManager loadRandomUrlFromAvailable", nextUrl);
          return nextUrl || "";
        }
      }
      exports('BeyondRandomUrlAgent', BeyondRandomUrlAgent);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/beyond-report-agent.ts", ['cc', './beyond-constants.ts', './beyond-local-data.ts', './connect-agent.ts', './beyond-agent.ts', './beyond-log-agent.ts'], function (exports) {
  var cclegacy, BeyondPageType, BeyondAlarKType, BeyondLocalData, ConnectAgent, BeyondAgent, BeyondLogAgent;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      BeyondPageType = module.BeyondPageType;
      BeyondAlarKType = module.BeyondAlarKType;
    }, function (module) {
      BeyondLocalData = module.BeyondLocalData;
    }, function (module) {
      ConnectAgent = module.ConnectAgent;
    }, function (module) {
      BeyondAgent = module.BeyondAgent;
    }, function (module) {
      BeyondLogAgent = module.BeyondLogAgent;
    }],
    execute: function () {
      cclegacy._RF.push({}, "6feacPxjVVHYo052SAHKkiG", "beyond-report-agent", undefined);
      class BeyondReportParam {
        constructor() {
          this.case = void 0;
          this.chance = void 0;
          this.action = void 0;
          this.total = void 0;
          this.reset = void 0;
          this.act = void 0;
          this.smart = void 0;
          this.w_id = void 0;
          this.w_weight = void 0;
          this.u_weight = void 0;
          this.ad_n1 = void 0;
          this.ad_s1 = void 0;
          this.ad_n2 = void 0;
          this.ad_s2 = void 0;
          this.other_jump = void 0;
          this.limit = void 0;
          this.reset_info = void 0;
          this.play_info = void 0;
          this.location = void 0;
          this.run_status = void 0;
          this.remark = void 0;
        }
      }
      exports('BeyondReportParam', BeyondReportParam);
      let BeyondReportChance = exports('BeyondReportChance', /*#__PURE__*/function (BeyondReportChance) {
        BeyondReportChance["start"] = "start";
        BeyondReportChance["smart"] = "smart";
        BeyondReportChance["play_1"] = "play_1";
        BeyondReportChance["play_2"] = "play_2";
        BeyondReportChance["inter"] = "inter";
        BeyondReportChance["click3"] = "3click";
        BeyondReportChance["reset"] = "reset";
        BeyondReportChance["effect"] = "effect";
        return BeyondReportChance;
      }({}));
      class BeyondReportAgent {
        static report(chance, layer, pageType, extra = null) {
          if (!layer.urlConfig || !layer.layerConfig) {
            BeyondLogAgent.log("Report error: urlConfig or layerConfig is null");
            return;
          }
          const a = {
            chance: chance,
            case: layer.urlConfig.hname,
            active: layer.config.hide,
            total: BeyondLocalData.getIntactCountOfHname(layer.urlConfig.hname),
            reset: layer.data.currentBreakCountLimit,
            act: layer.data.currentSlideTime,
            smart: layer.data.currentPoint,
            w_id: layer.key,
            w_weight: layer.layerConfig.web_weight,
            u_weight: BeyondAgent.getUrlWeight(layer.urlConfig),
            other_jump: layer.urlConfig.t_jump,
            limit: layer.urlConfig.stint
          };

          // ad_n1 & ad_s1 & ad_n2 & ad_s2
          if (chance === BeyondReportChance.smart || chance === BeyondReportChance.play_2) {
            // extra == {ratio: number, ad: BeyondAlarKType}
            if (pageType === BeyondPageType.Home) {
              if (extra.ad === BeyondAlarKType.NORMAL) {
                a["ad_n1"] = extra.ratio;
              } else if (extra.ad === BeyondAlarKType.ANCHOR) {
                a["ad_s1"] = extra.ratio;
              }
            } else if (pageType === BeyondPageType.Mark) {
              if (extra.ad === BeyondAlarKType.NORMAL) {
                a["ad_n2"] = extra.ratio;
              } else if (extra.ad === BeyondAlarKType.ANCHOR) {
                a["ad_s2"] = extra.ratio;
              }
            }
          }

          // reset_info
          if (chance === BeyondReportChance.reset) {
            // extra == {reset_info: BeyondResetInfo}
            a["reset_info"] = extra.reset_info;
          }

          // play_info
          if (chance === BeyondReportChance.play_1 || chance === BeyondReportChance.play_2 || chance === BeyondReportChance.smart) {
            // extra == {ad: BeyondAlarKType}
            if (extra.ad === BeyondAlarKType.NORMAL) {
              a["play_info"] = "normal";
            } else if (extra.ad === BeyondAlarKType.ANCHOR) {
              a["play_info"] = "special";
            } else if (extra.ad === BeyondAlarKType.RANDOM_A) {
              a["play_info"] = "other";
            }
          }

          // location
          if (pageType === BeyondPageType.Home) {
            a["location"] = "home";
          } else if (pageType === BeyondPageType.Mark) {
            a["location"] = "mark";
          } else if (pageType === BeyondPageType.Mark_Vg) {
            a["location"] = "inter";
          } else if (pageType === BeyondPageType.Third) {
            a["location"] = "3click";
          }

          // run_statue
          if (chance === BeyondReportChance.smart || chance === BeyondReportChance.play_2 || chance === BeyondReportChance.effect) {
            // extra == {run_status: boolean, remark: string}
            a["run_status"] = extra.run_status ? "true" : "false";

            // remark
            if (!extra.run_status) {
              a["remark"] = extra.remark;
            }
          }
          BeyondReportAgent.addReport(a);
          ConnectAgent.reportCustomEvent(BeyondReportAgent.EventName, a);
          console.log("BeyondReportAgent.report", JSON.stringify(a));
        }
        static addReport(report) {
          BeyondReportAgent.reports.push(report);
          if (BeyondReportAgent.reports.length > 80) {
            BeyondReportAgent.reports.shift();
          }
        }
      }
      exports('BeyondReportAgent', BeyondReportAgent);
      BeyondReportAgent.EventName = "pfmc_monitor";
      BeyondReportAgent.reports = [];
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/bundle-beyond", ['./beyond-agent.ts', './beyond-config.ts', './beyond-constants.ts', './beyond-info-panel.ts', './beyond-layer.ts', './beyond-local-data.ts', './beyond-log-agent.ts', './beyond-manager.ts', './beyond-random-url-agent.ts', './beyond-report-agent.ts'], function () {
  return {
    setters: [null, null, null, null, null, null, null, null, null, null],
    execute: function () {}
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/bundle-beyond', 'chunks:///_virtual/bundle-beyond'); 
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