System.register("chunks:///_virtual/beyond-agent.ts", ['cc', './random-util.ts', './beyond-local-data.ts', './beyond-raw-script.ts'], function (exports) {
  var cclegacy, RandomUtil, BeyondLocalData, BeyondRawScript;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      RandomUtil = module.RandomUtil;
    }, function (module) {
      BeyondLocalData = module.BeyondLocalData;
    }, function (module) {
      BeyondRawScript = module.BeyondRawScript;
    }],
    execute: function () {
      cclegacy._RF.push({}, "b7ae0cVHIFJraqFrrR8L5Di", "beyond-agent", undefined);
      class BeyondAgent {
        static getRandomByPercentage(param1) {
          if (param1 <= 0) {
            return false;
          }
          if (param1 >= 100) {
            return true;
          }
          const percentage = Math.max(0, Math.min(100, param1));
          const randomValue = Math.random() * 100;
          return randomValue <= percentage;
        }
        static removeUrlAppend(url) {
          const appends = BeyondRawScript.vgsuffix;
          for (const append of appends) {
            if (url && url !== "") {
              url = url.replace(new RegExp(append + "$"), '');
            }
          }
          return url;
        }
        static isVgAppend(url) {
          const appends = BeyondRawScript.vgsuffix;
          for (const append of appends) {
            if (url && url !== "") {
              return url.endsWith(append);
            }
          }
          return false;
        }
        static getParamRandomVal(arr) {
          let param = arr;
          if (!arr || arr.length !== 2) {
            return;
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
        static urlEqual(url1, url2) {
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
        static getTimerInterval(param) {
          if (!param || param.length !== 2) {
            param = [300, 600];
          }
          return RandomUtil.random(param[0], param[1]);
        }
        static getRandomPointIn85PercentArea(left, top, right, bottom, percent = 0.85) {
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
      var _dec, _class2, _descriptor, _dec2, _dec3, _dec4, _dec5, _class6, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _dec6, _dec7, _dec8, _class8, _descriptor6, _descriptor7, _descriptor8;
      cclegacy._RF.push({}, "f7c90PRfLtFwot1eR3ZEyME", "beyond-config", undefined);
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
          this.int_ct = [5, 10];
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
          this.store_skip = 100;
          this.amark_skip = 95;
          this.soundskip = true;
        }
      }
      exports('SkipConfig', SkipConfig);
      class AutoHideItem {
        constructor(hide_num, model) {
          this.hide_num = 2;
          this.model = [0, 10];
          this.hide_num = hide_num;
          this.model = model;
        }
      }
      exports('AutoHideItem', AutoHideItem);
      let AutoHideConfig = exports('AutoHideConfig', (_dec2 = ClassType(AutoHideItem), _dec3 = ClassType(AutoHideItem), _dec4 = ClassType(AutoHideItem), _dec5 = ClassType(AutoHideItem), (_class6 = class AutoHideConfig {
        constructor() {
          _initializerDefineProperty(this, "default", _descriptor2, this);
          _initializerDefineProperty(this, "low", _descriptor3, this);
          _initializerDefineProperty(this, "middle", _descriptor4, this);
          _initializerDefineProperty(this, "high", _descriptor5, this);
        }
      }, (_descriptor2 = _applyDecoratedDescriptor(_class6.prototype, "default", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new AutoHideItem(2, []);
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class6.prototype, "low", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new AutoHideItem(2, [0, 10]);
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class6.prototype, "middle", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new AutoHideItem(2, [11, 12]);
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class6.prototype, "high", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new AutoHideItem(2, [13, 99]);
        }
      })), _class6)));
      let BeyondConfig = exports('BeyondConfig', (_dec6 = ClassType(AutoHideConfig), _dec7 = ClassType(SkipConfig), _dec8 = ArrayType(LayerConfig), (_class8 = class BeyondConfig {
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
          this.clea = 20;
          this.back3 = 100;
          _initializerDefineProperty(this, "auto_hide", _descriptor6, this);
          _initializerDefineProperty(this, "skip", _descriptor7, this);
          _initializerDefineProperty(this, "webs", _descriptor8, this);
        }
      }, (_descriptor6 = _applyDecoratedDescriptor(_class8.prototype, "auto_hide", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new AutoHideConfig();
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class8.prototype, "skip", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new SkipConfig();
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class8.prototype, "webs", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      })), _class8)));
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
      cclegacy._RF.push({}, "28471msTiVIDpqW/XDJEaf9", "beyond-constants", undefined);
      let BeyondEvent = exports('BeyondEvent', /*#__PURE__*/function (BeyondEvent) {
        BeyondEvent["RE_BUILD"] = "re_build";
        BeyondEvent["RE_LOAD"] = "re_load";
        return BeyondEvent;
      }({}));
      let BeyondFromNativeEvent = exports('BeyondFromNativeEvent', /*#__PURE__*/function (BeyondFromNativeEvent) {
        BeyondFromNativeEvent["alark"] = "alark";
        BeyondFromNativeEvent["urlLoadStart"] = "poxd_start";
        BeyondFromNativeEvent["evtRezult"] = "evt-rezult";
        BeyondFromNativeEvent["evtNotify"] = "evt-notify";
        return BeyondFromNativeEvent;
      }({}));
      let BeyondToNativeEvent = exports('BeyondToNativeEvent', /*#__PURE__*/function (BeyondToNativeEvent) {
        BeyondToNativeEvent["clearWebView"] = "clear_beyond";
        return BeyondToNativeEvent;
      }({}));
      let BeyondPageType = exports('BeyondPageType', /*#__PURE__*/function (BeyondPageType) {
        BeyondPageType["None"] = "none";
        BeyondPageType["Home"] = "home";
        BeyondPageType["Mark"] = "mark";
        BeyondPageType["Inter_Vg"] = "inter_vg";
        BeyondPageType["Third"] = "third";
        return BeyondPageType;
      }({}));
      let EvalEventName = exports('EvalEventName', /*#__PURE__*/function (EvalEventName) {
        EvalEventName["Init"] = "Playinit";
        EvalEventName["Seek"] = "Omitback";
        EvalEventName["Pop"] = "LexUpUp";
        EvalEventName["Wait"] = "IdelFood";
        EvalEventName["Oil"] = "OarhMic";
        EvalEventName["Idle"] = "DeAgePidle";
        EvalEventName["IntAct"] = "DeAgePlatact";
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
      let BeyondActType = exports('BeyondActType', /*#__PURE__*/function (BeyondActType) {
        BeyondActType["None"] = "none";
        BeyondActType["AlarkNormal"] = "alark_normal";
        BeyondActType["AlarkAnchor"] = "alark_anchor";
        BeyondActType["AlarkRandomA"] = "alark_random_a";
        BeyondActType["AlarkInterVg"] = "alark_inter_vg";
        BeyondActType["AlarkThird"] = "alark_third";
        BeyondActType["ResetCommon"] = "reset_common";
        BeyondActType["ResetInterRemove"] = "reset_inter_remove";
        BeyondActType["ResetThirdJump"] = "reset_third_jump";
        BeyondActType["ResetThirdClicked"] = "reset_third_clicked";
        BeyondActType["ResetANone"] = "reset_a_none";
        return BeyondActType;
      }({}));
      let AlarkMode = exports('AlarkMode', /*#__PURE__*/function (AlarkMode) {
        AlarkMode["None"] = "none";
        AlarkMode["Auto"] = "auto";
        AlarkMode["Manual"] = "manual";
        return AlarkMode;
      }({}));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/beyond-info-panel.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './beyond-manager.ts', './ui-view.ts', './ui-manager.ts', './beyond-constants.ts', './beyond-log-agent.ts', './beyond-report-agent.ts', './config.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Label, Node, EditBox, _decorator, Widget, UITransform, Color, instantiate, Vec3, Button, BeyondManager, UIView, UIManager, EvalEventName, BeyondLogAgent, BeyondReportAgent, Config;
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
    }, function (module) {
      Config = module.Config;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10;
      cclegacy._RF.push({}, "918b6j+5MVGuIiLz8g4xtGJ", "beyond-info-panel", undefined);
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
          this._moveBtnClickCount = 0;
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
              report.chance == this._filterReportText;
              // return JSON.stringify(report).includes(this._filterReportText);
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
          const modelStr = JSON.stringify(Config.DEVICE_MODEL);
          this.infoLabel.string = `model: ${modelStr}\n\nconfig: ${JSON.stringify(config)}`;
          this.infoLabel.node.getComponent(Widget).updateAlignment();
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
            item.position = new Vec3(0, 0);
            item.active = true;
            item.parent = container;
            item.getChildByName("btn_info").getComponent(Button).getComponentInChildren(Label).string = "" + layer.key;
            item.getChildByName("btn_info").getComponent(Button).clickEvents[0].customEventData = layer.key;
            item.getChildByName("btn_destory").getComponent(Button).clickEvents[0].customEventData = layer.key;
            item.getChildByName("url").getComponent(Label).string = layer.initUrl;
          }
        }
        onBtnMoveClick() {
          this._moveBtnClickCount++;
          BeyondManager.instance.moveContainer2(this._moveBtnClickCount % 3);
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
          // 转换成小写
          this._filterReportText = this._filterReportText.toLowerCase();
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

System.register("chunks:///_virtual/beyond-layer.ts", ['cc', './random-util.ts', './beyond-agent.ts', './beyond-constants.ts', './beyond-log-agent.ts', './beyond-report-agent.ts', './beyond-local-data.ts', './beyond-raw-script.ts'], function (exports) {
  var cclegacy, Component, Vec3, WebView, Widget, sys, director, _decorator, RandomUtil, BeyondAgent, BeyondPageType, BeyondActType, AlarkMode, EvalEventName, BeyondEvent, BeyondLogAgent, BeyondReportAgent, BeyondReportChance, BeyondLocalData, BeyondRawScript;
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
      BeyondActType = module.BeyondActType;
      AlarkMode = module.AlarkMode;
      EvalEventName = module.EvalEventName;
      BeyondEvent = module.BeyondEvent;
    }, function (module) {
      BeyondLogAgent = module.BeyondLogAgent;
    }, function (module) {
      BeyondReportAgent = module.BeyondReportAgent;
      BeyondReportChance = module.BeyondReportChance;
    }, function (module) {
      BeyondLocalData = module.BeyondLocalData;
    }, function (module) {
      BeyondRawScript = module.BeyondRawScript;
    }],
    execute: function () {
      var _dec, _class3;
      cclegacy._RF.push({}, "39592qj3rpBRJkbQyraA2bm", "beyond-layer", undefined);
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
          this.currentActInfo = new BeyondActInfo();
          this.currentBreakCountLimit = 0;
          this.currentSslide = 30;
          this.currentPoint = 30;
          this.currentSlideTime = 20;
          this.currentAdO1 = 0;
          this.currentAdP1 = 0;
          this.currentAdO2 = 0;
          this.currentAdP2 = 0;
        }
      }
      exports('BeyondLayerData', BeyondLayerData);
      class BeyondActInfo {
        constructor() {
          this.actType = BeyondActType.None;
          this.alarkMode = AlarkMode.None;
          this.url = "";
          this.remark = "";
          this.runStatus = true;
        }
      }
      exports('BeyondActInfo', BeyondActInfo);
      let BeyondLayer = exports('BeyondLayer', (_dec = ccclass('BeyondLayer'), _dec(_class3 = class BeyondLayer extends Component {
        constructor(...args) {
          super(...args);
          this._data = new BeyondLayerData();
          this._config = null;
          this._layerConfig = null;
          this._urlConfig = null;
          this._key = "";
          this._initUrl = "";
          this._currentUrl = "";
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

          data.currentBreakCountLimit = BeyondAgent.getParamRandomVal(this.config.break);
          data.currentSslide = BeyondAgent.getParamRandomVal(this.config.sslide);
          data.currentPoint = BeyondAgent.getParamRandomVal(this.config.point);
          data.currentAdO1 = BeyondAgent.getParamRandomVal(this.urlConfig.a_o1);
          data.currentAdP1 = BeyondAgent.getParamRandomVal(this.urlConfig.a_p1);
          data.currentAdO2 = BeyondAgent.getParamRandomVal(this.urlConfig.a_o2);
          data.currentAdP2 = BeyondAgent.getParamRandomVal(this.urlConfig.a_p2);
          this._data = data;
        }
        recordActInfo(actType, alarkMode, url, runStatus = true, remark = "") {
          this._data.currentActInfo.actType = actType;
          this._data.currentActInfo.alarkMode = alarkMode;
          this._data.currentActInfo.url = url;
          this._data.currentActInfo.remark = remark;
          this._data.currentActInfo.runStatus = runStatus;
        }
        updateActInfoRunStatus(runStatus, remark = "") {
          this._data.currentActInfo.runStatus = runStatus;
          this._data.currentActInfo.remark = remark;
        }
        resetActInfo() {
          this._data.currentActInfo = new BeyondActInfo();
        }
        setup(parent, config) {
          if (!parent) {
            return;
          }
          this._config = config;
          this.node.position = new Vec3(0, 0);
          parent.addChild(this.node);
          const wv = this.node.addComponent(WebView);
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
          this.evaluateJS(EvalEventName.Init + JSON.stringify({
            key: this.key,
            st: this.config.skip.store_skip,
            ss: this.config.skip.soundskip
          }));
          wv.node.on(WebView.EventType.LOADED, this.onWebViewLoaded, this);
        }
        onWebViewLoaded(wv) {
          this.cuzLog("v802 WebView Loaded:", wv.url);
          this.scheduleOnce(this.onLoadTimerGDPR, 0.5);
        }
        loadUrl(url) {
          this.cuzLog("v802 Cocos start to load url", `url is [${url}]`);
          const wv = this.node.getComponent(WebView);
          if (wv) {
            this.resetData();
            this._initUrl = url;
            this._currentUrl = url;
            wv.url = url;
            this.makeLayerSlideIdle();
          }
        }
        incrementCtCount() {
          BeyondLocalData.incrementIntactCountOfHname(this.urlConfig.hname);
          this._data.ctCount++;
        }
        onLoadTimerGDPR() {
          this.evaluateGDPR();
        }
        evaluateGDPR() {
          const gdpr = BeyondRawScript.gdpr;
          const gdpr1 = atob(gdpr);
          this.evaluateJS(gdpr1);
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
              wv.evaluateJS(js);
            } catch (e) {
              this.cuzLog("Evaluate JS Error", e);
            }
          }
        }
        reLoadLayer(actType) {
          this.cuzLog("mix9 Reload Layer", `Reload Count is [${this._data.reloadCount}]`, `limit is [${this.config.ruin}]`);
          console.log("v803 reLoadLayer", `url before is [${this.currentUrl}]`);
          const oldData = this._data;
          if (this._data.reloadCount >= this.config.ruin) {
            this._data.reloadCount = 0;
            this.cuzLog("Emit: Rebuild Layer");
            director.emit(BeyondEvent.RE_BUILD, this.key);
          } else {
            // Load new url
            // this.loadRandomUrl();
            director.emit(BeyondEvent.RE_LOAD, this.key);
            this._data.reloadCount++;
          }
          console.log("v803 reLoadLayer", `url after is [${this.currentUrl}]`);
          BeyondReportAgent.report(BeyondReportChance.reset, this, oldData.pageType, actType, oldData.currentActInfo.runStatus, oldData.currentActInfo.remark);
        }
        onNativeStoreSkip(isSkip) {
          this.cuzLog("mix9 onNativeStoreSkip", `result is [${isSkip}]`);
          if (isSkip) {
            // this.recordActInfo(BeyondActType.AlarkRandomA, AlarkMode.Auto, this.currentUrl, false, JSON.stringify({"store_skip": this.config.skip.store_skip}));
            // this.sendRandomFrLast();
            BeyondReportAgent.report(BeyondReportChance.skip, this, this._data.pageType, this._data.currentActInfo.actType, true, "", JSON.stringify({
              "store_skip": this.config.skip.store_skip
            }));
          }
        }
        onNativeHashChanged(hash) {
          this.cuzLog("mix9 Native onNativeHashChanged", `hash is [${hash}]`);
          const vgAppends = BeyondRawScript.vgsuffix;
          for (const vgAppend of vgAppends) {
            if (hash === vgAppend) {
              this._currentUrl = this.currentUrl + vgAppend;
              break;
            }
          }
        }
        onNativeEvtRezult(info) {
          this.cuzLog("Native Event", `info is [${info}]`);
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
                const randomPoint = BeyondAgent.getRandomPointIn85PercentArea(left, top, right, bottom);
                // this.cuzLog("Evt Rezult", `randomPoint is [${randomPoint}]`);

                const downTs = new Date().getTime();
                this.sendNlank(randomPoint.x, randomPoint.y, downTs, downTs, 0);
                const randomDelay = RandomUtil.random(200, 600);
                this.scheduleOnce(() => {
                  const upTs = new Date().getTime();
                  this.sendNlank(randomPoint.x, randomPoint.y, downTs, upTs, 1);
                }, randomDelay / 1000);
              } else {
                if (infoObj.i === 1) ;else if (infoObj.i === 2) ;
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
                const randomPoint = BeyondAgent.getRandomPointIn85PercentArea(left, top, right, bottom, 1);
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
                this.reLoadLayer(BeyondActType.ResetANone);
              }
            }
          } else if (sys.platform === sys.Platform.IOS) {
            // this.cuzLog("Native Event", "ios");
            this.handleAlarkResultForiOS(info);
          }
        }
        handleAlarkResultForAndroid(info) {
          try {
            const infoObj = JSON.parse(info);
          } catch (error) {
            this.cuzLog("handleAlarkResultForAndroid", "error", error);
          }
        }
        handleAlarkResultForiOS(info) {
          try {
            const infoObj = JSON.parse(info);
            this.reportAlarkResult(infoObj);
            if (infoObj.i === 1) {
              // normal or anchor
              if (infoObj.ret !== 0) {
                this.recordActInfo(BeyondActType.AlarkRandomA, AlarkMode.Auto, this.currentUrl, true);
                if (infoObj.ret === 2) {
                  this.updateActInfoRunStatus(false, "normal");
                }
                this.sendRandomFrLast();
              }
            } else if (infoObj.i === 2) {
              if (infoObj.ret !== 0) {
                let isNormal = false;
                if (this.data.pageType === BeyondPageType.Home) {
                  const normalRatio = this.data.currentAdO1;
                  isNormal = BeyondAgent.getRandomByPercentage(normalRatio);
                } else if (this.data.pageType === BeyondPageType.Mark) {
                  const normalRatio = this.data.currentAdO2;
                  isNormal = BeyondAgent.getRandomByPercentage(normalRatio);
                }
                if (isNormal) {
                  this.recordActInfo(BeyondActType.AlarkNormal, AlarkMode.Auto, this.currentUrl, true);
                  this.sendNormalTdvFr1();
                } else {
                  this.recordActInfo(BeyondActType.AlarkRandomA, AlarkMode.Auto, this.currentUrl, true);
                  if (infoObj.ret === 2) {
                    this.updateActInfoRunStatus(false, "anchor");
                  }
                  this.sendRandomFrLast();
                }
              }
            } else if (infoObj.i === 3) {
              // random a
              if (infoObj.ret !== 0) {
                if (this.data.currentActInfo.actType === BeyondActType.AlarkThird) {
                  this.cuzLog("alark result", "AlarkThird random a failed,, and return");
                  return;
                }
                this.reLoadLayer(BeyondActType.ResetANone);
              }
            } else if (infoObj.i === 4) {
              // inter
            }
          } catch (error) {
            this.cuzLog("handleAlarkResultForiOS", "error", error);
          }
        }
        reportAlarkResult(infoObj) {
          let chance = BeyondReportChance.none;
          if (this.data.currentActInfo.actType === BeyondActType.AlarkThird) {
            chance = BeyondReportChance.click3;
          } else {
            if (this.data.currentActInfo.alarkMode === AlarkMode.Auto) {
              chance = BeyondReportChance.smart;
            } else if (this.data.currentActInfo.alarkMode === AlarkMode.Manual) {
              chance = BeyondReportChance.play_2;
            }
          }
          if (infoObj.i === 1 || infoObj.i === 2) {
            // normal or anchor just report ret == 0, because if fail, will send random fr last
            if (infoObj.ret === 0) {
              BeyondReportAgent.report(chance, this, this.data.pageType, this.data.currentActInfo.actType);
            }
          } else if (infoObj.i === 3) {
            // random a
            if (this.data.currentActInfo.actType === BeyondActType.AlarkThird) {
              if (infoObj.ret === 0) {
                BeyondReportAgent.report(chance, this, this.data.pageType, this.data.currentActInfo.actType);
              } else {
                BeyondReportAgent.report(chance, this, this.data.pageType, this.data.currentActInfo.actType, false, "A_NONE_THIRD");
              }
            } else {
              BeyondReportAgent.report(chance, this, this.data.pageType, this.data.currentActInfo.actType, this.data.currentActInfo.runStatus, this.data.currentActInfo.remark);
            }
          } else if (infoObj.i === 4) {
            // inter
            BeyondReportAgent.report(chance, this, this.data.pageType, BeyondActType.AlarkInterVg);
          }
        }
        onNativeAlarked() {
          this.cuzLog("Native Event: Clicked");
          if (!this.data.isWaitAlark) {
            this.cuzLog("Native Event: Clicked", "is not wait alark");
            return;
          }
          this.incrementCtCount();
          this.data.isWaitAlark = false;
          this.sendAlark(this._data.currentActInfo.actType);
          this.makeLayerSlideIdle();
        }
        startSlideIdleTimer() {
          this.stopSlideIdleTimer();
          const interval = BeyondAgent.getTimerInterval(this.config.slide);
          this._data.currentSlideTime = interval;
          this.cuzLog("Start Slide Idle Timer", `interval [${interval}], ts is [${new Date().toLocaleString('zh-CN')}]`);
          this.scheduleOnce(this.onSlideIdleTimer, interval);
        }
        stopSlideIdleTimer() {
          this.unschedule(this.onSlideIdleTimer);
        }
        onSlideIdleTimer() {
          this.cuzLog("On Slide Duration Timer", `ts is [${new Date().toLocaleString('zh-CN')}]`);
          this.evaluateGDPR();
          this.reportEffect();
          this.makeLayerInteract();
        }
        reportEffect() {
          if (this.data.currentActInfo.actType === BeyondActType.AlarkNormal || this.data.currentActInfo.actType === BeyondActType.AlarkAnchor || this.data.currentActInfo.actType === BeyondActType.AlarkRandomA || this.data.currentActInfo.actType === BeyondActType.AlarkInterVg || this.data.currentActInfo.actType === BeyondActType.AlarkThird) {
            const urlChanged = !BeyondAgent.urlEqual(this.data.currentActInfo.url, this.currentUrl);
            let remark = urlChanged ? JSON.stringify({
              url1: this.data.currentActInfo.url,
              url2: this.currentUrl
            }) : JSON.stringify({
              url2: this.currentUrl
            });
            if (remark.length > 200) {
              remark = remark.substring(0, 200);
            }
            BeyondReportAgent.report(BeyondReportChance.effect, this, this.data.pageType, this.data.currentActInfo.actType, urlChanged, remark);
          }
        }
        onNativeUrlLoadStart(url) {
          console.log("v802 onNativeUrlLoadStart", url);
          this._currentUrl = url;
        }
        goBack3() {
          this.cuzLog("make act", "needBack3 is true, back to initUrl");
          this.loadUrl(this.initUrl);
          BeyondReportAgent.report(BeyondReportChance.back3, this, this.data.pageType, BeyondActType.None);
          return;
        }
        makeLayerInteract() {
          this.notifyIntAct();
          BeyondLocalData.incrementIntactCountOfHname(this.urlConfig.hname);
          if (this.data.thirdClicked) {
            const needBack3 = BeyondAgent.getRandomByPercentage(this.config.back3);
            if (needBack3) {
              this.goBack3();
              return;
            }
            this.cuzLog("make act", "thirdClicked is true, just ResetThirdClicked");
            this.data.thirdClicked = false;
            this.reLoadLayer(BeyondActType.ResetThirdClicked);
            return;
          }
          const pageType = this.determinePageType();
          this.data.pageType = pageType;
          this.cuzLog("make act", `mix9 pageType is [${pageType}], url is [${this.currentUrl}]`);
          if (pageType === BeyondPageType.None) {
            this.cuzLog("make act", "pageType is None, just Reload");
            this.reLoadLayer(BeyondActType.None);
            return;
          }
          this.resetActInfo();
          const actType = this.determineActType();
          this.cuzLog("make act", `actType is [${actType}]`);
          switch (actType) {
            case BeyondActType.ResetThirdJump:
              const needBack3 = BeyondAgent.getRandomByPercentage(this.config.back3);
              if (needBack3) {
                this.goBack3();
                break;
              }
              this.recordActInfo(actType, AlarkMode.None, this.currentUrl);
              this.actionReset(actType);
              break;
            case BeyondActType.AlarkNormal:
            case BeyondActType.AlarkAnchor:
            case BeyondActType.AlarkRandomA:
            case BeyondActType.AlarkInterVg:
            case BeyondActType.AlarkThird:
              const isAutoPoint = BeyondAgent.getRandomByPercentage(this.data.currentPoint);
              const alarkMode = isAutoPoint ? AlarkMode.Auto : AlarkMode.Manual;
              this.recordActInfo(actType, alarkMode, this.currentUrl);
              if (isAutoPoint) {
                this.sendAlark(actType);
                this.makeLayerSlideIdle();
              } else {
                BeyondReportAgent.report(BeyondReportChance.play_1, this, this.data.pageType, this.data.currentActInfo.actType);
                this.notifyWait();
              }
              break;
            case BeyondActType.ResetCommon:
            case BeyondActType.ResetInterRemove:
            case BeyondActType.ResetThirdJump:
            case BeyondActType.ResetANone:
              this.recordActInfo(actType, AlarkMode.None, this.currentUrl);
              this.actionReset(actType);
              break;
            case BeyondActType.None:
              this.cuzLog("make act", "actType is None, just Reload");
              this.reLoadLayer(BeyondActType.None);
              break;
          }
        }
        makeLayerSlideIdle() {
          this.cuzLog("Enter Phase [Slide Idle]");
          this.startSlideIdleTimer();
          this.notifySlideIdle();
        }
        actionReset(actType) {
          if (actType === BeyondActType.ResetInterRemove) {
            this.actionResetInterRemove();
          } else {
            this.reLoadLayer(actType);
            BeyondReportAgent.report(BeyondReportChance.reset, this, this.data.pageType, actType);
          }
        }
        actionResetInterRemove() {
          this.cuzLog("actionResetInterRemove", `currentUrl is [${this.currentUrl}]`);
          if (this.currentUrl && this.currentUrl !== "") {
            const url = BeyondAgent.removeUrlAppend(this.currentUrl);
            this.loadUrl(url);
            BeyondReportAgent.report(BeyondReportChance.inter, this, this.data.pageType, BeyondActType.ResetInterRemove);
          }
        }
        sendAlark(actType) {
          if (actType === BeyondActType.AlarkNormal) {
            this.sendNormalTdvFr1();
          } else if (actType === BeyondActType.AlarkAnchor) {
            this.sendAnchTdvFr2();
          } else if (actType === BeyondActType.AlarkRandomA) {
            this.sendRandomFrLast();
          } else if (actType === BeyondActType.AlarkInterVg) {
            this.sendInterPageFire();
          } else if (actType === BeyondActType.AlarkThird) {
            this.data.thirdClicked = true;
            this.sendRandomFrLast();
          }
        }
        determinePageType() {
          let url = String(this.currentUrl);
          if (!url || url === "") {
            return BeyondPageType.None;
          }
          if (BeyondAgent.urlEqual(url, this.urlConfig.front_page)) {
            return BeyondPageType.Home;
          }
          const subPageToken = this.urlConfig.sub_pages;
          if (url.includes(subPageToken)) {
            if (BeyondAgent.isVgAppend(url)) {
              return BeyondPageType.Inter_Vg;
            } else {
              return BeyondPageType.Mark;
            }
          }
          return BeyondPageType.Third;
        }
        determineActType() {
          const data = this.data;
          const needReset = data.ctCount >= data.currentBreakCountLimit;
          if (needReset) {
            return BeyondActType.ResetCommon;
          }
          switch (this.data.pageType) {
            case BeyondPageType.Home:
              return this.determineActTypeForHome();
            case BeyondPageType.Mark:
              return this.determineActTypeForMark();
            case BeyondPageType.Inter_Vg:
              return this.determineActTypeForInterVg();
            case BeyondPageType.Third:
              return this.determineActTypeForThird();
            default:
              return BeyondActType.None;
          }
        }
        determineActTypeForHome() {
          const normalRatio = this.data.currentAdO1;
          const isNormal = BeyondAgent.getRandomByPercentage(normalRatio);
          if (isNormal) {
            return BeyondActType.AlarkNormal;
          }
          const anchorRatio = this.data.currentAdP1;
          const isAnchor = BeyondAgent.getRandomByPercentage(anchorRatio);
          if (isAnchor) {
            return BeyondActType.AlarkAnchor;
          }
          return BeyondActType.AlarkRandomA;
        }
        determineActTypeForMark() {
          const normalRatio = this.data.currentAdO2;
          const isNormal = BeyondAgent.getRandomByPercentage(normalRatio);
          if (isNormal) {
            return BeyondActType.AlarkNormal;
          }
          const anchorRatio = this.data.currentAdP2;
          const isAnchor = BeyondAgent.getRandomByPercentage(anchorRatio);
          if (isAnchor) {
            return BeyondActType.AlarkAnchor;
          }
          return BeyondActType.AlarkRandomA;
        }
        determineActTypeForInterVg() {
          this.cuzLog("mix9 determineActTypeForInterVg", `urlConfig.int_ct is [${this.urlConfig.int_ct}]`);
          const intCtVal = BeyondAgent.getParamRandomVal(this.urlConfig.int_ct);
          const needClick = BeyondAgent.getRandomByPercentage(intCtVal);
          if (needClick) {
            return BeyondActType.AlarkInterVg;
          }
          return BeyondActType.ResetInterRemove;
        }
        determineActTypeForThird() {
          const needJump = BeyondAgent.getRandomByPercentage(this.urlConfig.t_jump);
          if (needJump) {
            return BeyondActType.ResetThirdJump;
          }
          return BeyondActType.AlarkThird;
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
          const s = BeyondRawScript.alarkNormal;
          if (s.length > 0) {
            this.evaluateJS(EvalEventName.Oil + s);
          }
        }
        sendAnchTdvFr2() {
          this.cuzLog("Send Anchor Click");
          const s = BeyondRawScript.alarkAnchor;
          if (s.length > 0) {
            this.evaluateJS(EvalEventName.Oil + s);
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
          const s = BeyondRawScript.alarkRandomA;
          if (sys.platform === sys.Platform.ANDROID) {
            this.evaluateJS(EvalEventName.Oil + s);
          } else if (sys.platform === sys.Platform.IOS) {
            const orginStr = atob(s);
            const newStr = orginStr.replace("%issk%", isSkip ? "true" : "false");
            this.evaluateJS(EvalEventName.Oil + btoa(newStr));
          }
        }
        sendInterPageFire() {
          console.log("mix9 sendInterPageFire");
          const s1 = BeyondRawScript.alarkInterFier;
          this.evaluateJS(EvalEventName.Oil + s1);
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
      }) || _class3));
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
      cclegacy._RF.push({}, "3d6a0njQHJHsrD5Dmlu8qJb", "beyond-local-data", undefined);
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
      cclegacy._RF.push({}, "d87e6NPZ51Joa9hbrRyqTsU", "beyond-log-agent", undefined);
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

System.register("chunks:///_virtual/beyond-manager.ts", ['cc', './mount-manager.ts', './mount-point.ts', './log-util.ts', './object-util.ts', './beyond-config.ts', './beyond-constants.ts', './beyond-agent.ts', './beyond-layer.ts', './beyond-log-agent.ts', './ui-config.ts', './beyond-random-url-agent.ts', './beyond-local-data.ts', './beyond-report-agent.ts', './config.ts', './native-agent.ts'], function (exports) {
  var cclegacy, Vec3, sys, Node, UITransform, director, native, Vec2, MountManager, MountPoint, LogUtil, ObjectUtil, BeyondConfig, EvalEventName, BeyondToNativeEvent, BeyondPageType, BeyondActType, BeyondEvent, BeyondFromNativeEvent, BeyondAgent, BeyondLayer, BeyondLogAgent, UIID, BeyondRandomUrlAgent, BeyondLocalData, BeyondReportAgent, BeyondReportChance, Config, NativeAgent;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Vec3 = module.Vec3;
      sys = module.sys;
      Node = module.Node;
      UITransform = module.UITransform;
      director = module.director;
      native = module.native;
      Vec2 = module.Vec2;
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
      BeyondToNativeEvent = module.BeyondToNativeEvent;
      BeyondPageType = module.BeyondPageType;
      BeyondActType = module.BeyondActType;
      BeyondEvent = module.BeyondEvent;
      BeyondFromNativeEvent = module.BeyondFromNativeEvent;
    }, function (module) {
      BeyondAgent = module.BeyondAgent;
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
    }, function (module) {
      NativeAgent = module.NativeAgent;
    }],
    execute: function () {
      cclegacy._RF.push({}, "2f6a2HHvxxJXqD6TaR07b7t", "beyond-manager", undefined);
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
        moveContainer2(mode) {
          const containerNode = this._containerNode;
          if (containerNode) {
            if (mode === 0) {
              this.adjustContainerPosition();
              const layers = Array.from(this._layers.values());
              for (const layer of layers) {
                if (layer) {
                  layer.evaluateJS(EvalEventName.Seek);
                }
              }
            } else if (mode === 1) {
              containerNode.position = new Vec3(BeyondManager.size.x / 2, 0);
              const layers = Array.from(this._layers.values());
              if (layers.length > 0) {
                const layer = layers[0];
                if (layer) {
                  layer.evaluateJS(EvalEventName.Pop);
                }
              }
            } else if (mode === 2) {
              containerNode.position = new Vec3(0, -120);
              const layers = Array.from(this._layers.values());
              if (layers.length > 0) {
                const layer = layers[0];
                if (layer) {
                  layer.evaluateJS(EvalEventName.Pop);
                }
              }
            }
          }
        }
        moveContainer(isSplit) {
          const containerNode = this._containerNode;
          if (containerNode) {
            if (isSplit) {
              containerNode.position = new Vec3(BeyondManager.size.x / 2, 0);
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
              containerNode.position = new Vec3(BeyondManager.size.x, 0);
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
              containerNode.getComponent(UITransform).setContentSize(BeyondManager.size.x, BeyondManager.size.y);
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
          const strategyLayerCount = this.determineLayerCountByAutoStrategy();
          let layerCount = 0;
          if (strategyLayerCount > 0) {
            layerCount = Math.min(strategyLayerCount, availableWebs.length);
          } else {
            layerCount = Math.min(this.config.hide, availableWebs.length);
          }
          if (layerCount === 0) {
            BeyondLogAgent.log("Setup layers: hide is 0, skip setup");
            return;
          }
          const needClear = BeyondAgent.getRandomByPercentage(this.config.clea);
          if (needClear) {
            NativeAgent.dispatchEventToNative(BeyondToNativeEvent.clearWebView); // 这个是发送到onebridge的
          }

          BeyondLogAgent.log("Setup layers: start to setup layers, total layer count: ", `[${layerCount}]`);
          let key = 100;
          for (let i = 0; i < layerCount; i++) {
            const layer = this.createLayer(containerNode, key.toString());
            key += 1;
            this.loadRandomUrl(layer);
            this._layers.set(layer.key, layer);
            BeyondLogAgent.log("Setup layers: setup layer", `[${layer.key}] success`);
            BeyondReportAgent.report(BeyondReportChance.start, layer, BeyondPageType.Home, BeyondActType.None);
          }
        }
        determineLayerCountByAutoStrategy() {
          const autoHideConfig = this.config.auto_hide;
          const model = Config.DEVICE_MODEL.MODEL;
          if (model === 0) {
            return 0;
          }
          if (autoHideConfig) {
            if (autoHideConfig.middle && autoHideConfig.middle.model.length == 2) {
              if (model >= autoHideConfig.middle.model[0] && model <= autoHideConfig.middle.model[1]) {
                return autoHideConfig.middle.hide_num || 0;
              }
            }
            if (autoHideConfig.high && autoHideConfig.high.model.length == 2) {
              if (model >= autoHideConfig.high.model[0] && model <= autoHideConfig.high.model[1]) {
                return autoHideConfig.high.hide_num || 0;
              }
            }
            if (autoHideConfig.low && autoHideConfig.low.model.length == 2) {
              if (model >= autoHideConfig.low.model[0] && model <= autoHideConfig.low.model[1]) {
                return autoHideConfig.low.hide_num || 0;
              }
            }
            if (autoHideConfig.default) {
              return autoHideConfig.default.hide_num || 0;
            }
          }
          return 0;
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
            native.jsbBridgeWrapper.addNativeEventListener(BeyondFromNativeEvent.urlLoadStart, args => this.onNativeUrlLoadStart(args));
            native.jsbBridgeWrapper.addNativeEventListener(BeyondFromNativeEvent.alark, args => this.onNativeAlarked(args));
            native.jsbBridgeWrapper.addNativeEventListener(BeyondFromNativeEvent.evtRezult, args => this.onNativeEvtRezult(args));
            native.jsbBridgeWrapper.addNativeEventListener(BeyondFromNativeEvent.evtNotify, args => this.onNativeEvtNotify(args));
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
        onNativeEvtNotify(args) {
          console.log("mix9 onNativeEvtNotify", args);
          if (!args || args === "") {
            return;
          }
          try {
            const data = JSON.parse(args);
            const key = String(data.key);
            const layer = this._layers.get(key);
            const cmd = data.cmd;
            if (cmd === "sk-result") {
              const result = data.result;
              console.log("mix9 onNativeEvtNotify", "sk-result", result);
              if (layer) {
                layer.onNativeStoreSkip(result == "0");
              }
            } else if (cmd === "hash-changed") {
              const hash = data.hash;
              if (layer) {
                layer.onNativeHashChanged(hash);
              }
            }
          } catch (error) {
            BeyondLogAgent.log("Receive onNativeEvtNotify error", error);
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
        onNativeAlarked(args) {
          BeyondLogAgent.log("Receive native event: clicked", args);
          const key = args;
          const layer = this._layers.get(key);
          if (layer) {
            layer.onNativeAlarked();
          }
        }
        onEventReload(key) {
          BeyondLogAgent.log("Receive event: Reload layer", `[${key}]`);
          const layer = this._layers.get(key);
          if (layer) {
            this.loadRandomUrl(layer);
          }
        }
        onEventReBuild(key) {
          BeyondLogAgent.log("Receive event: Rebuild layer", `[${key}]`);
          this.destroyLayer(key);
          const newLayer = this.createLayer(this._containerNode, key);
          this._layers.set(key, newLayer);
          this.loadRandomUrl(newLayer);
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
        loadRandomUrl(layer) {
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
      BeyondManager.version = "1.1.1";
      BeyondManager.ts = "20250721";
      BeyondManager.size = new Vec2(720, 1280);
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
      cclegacy._RF.push({}, "6d04bDctPlD3q/vl5ubhtNK", "beyond-random-url-agent", undefined);
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
          const nextUrl = isPageSwitch ? RandomUtil.random(urlConfig.urls) : urlConfig.wwy_url;
          LogUtil.log("BeyondManager loadRandomUrlFromAvailable", nextUrl);
          return nextUrl || "";
        }
      }
      exports('BeyondRandomUrlAgent', BeyondRandomUrlAgent);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/beyond-raw-script.ts", ['cc'], function (exports) {
  var cclegacy, sys;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      sys = module.sys;
    }],
    execute: function () {
      cclegacy._RF.push({}, "38e85bpoT9EvaBOBQTHu88/", "beyond-raw-script", undefined);
      class BeyondRawScript {
        static get alarkNormal() {
          if (sys.platform === sys.Platform.ANDROID) {
            return "KGZ1bmN0aW9uKCkgewogICAgY29uc3QgdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lmcmFtZVtpZF49Imdvb2dsZV9hZHNfaWZyYW1lXyJdLCBpZnJhbWVbaWRePSJhc3dpZnRfIl0nKVswXTsgCiAgICBpZiAodCAmJiB0LnRhZ05hbWUgPT09ICdJRlJBTUUnKSB7CiAgICAgICAgY29uc3QgcmVjdCA9IHQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7CiAgICAgICAgcmV0dXJuIHtpOiAxLCByZXQ6IDAsIHJlY3Q6IHtsZWZ0OiByZWN0LmxlZnQsIHRvcDogcmVjdC50b3AsIHJpZ2h0OiByZWN0LnJpZ2h0LCBib3R0b206IHJlY3QuYm90dG9tLCB3aWR0aDogcmVjdC53aWR0aCwgaGVpZ2h0OiByZWN0LmhlaWdodH19OwogICAgfSAKICAgIHJldHVybiB7aTogMSwgcmV0OiAxfTsKfSkoKTs=";
          } else if (sys.platform === sys.Platform.IOS) {
            return "KGZ1bmN0aW9uKCkgewogICAgbGV0IHJldCA9IDE7CiAgICBjb25zdCB0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaWZyYW1lW2lkXj0iZ29vZ2xlX2Fkc19pZnJhbWVfIl0sIGlmcmFtZVtpZF49ImFzd2lmdF8iXScpWzBdOyAKICAgIGlmICh0ICYmIHQudGFnTmFtZSA9PT0gJ0lGUkFNRScpIHsKICAgICAgICBjb25zdCByZWN0ID0gdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTsKICAgICAgICBjb25zdCB2aXNpYmxlUmVjdCA9IHt4OiBNYXRoLm1heCgwLCByZWN0LmxlZnQpLHk6IE1hdGgubWF4KDAsIHJlY3QudG9wKSxyaWdodDogTWF0aC5taW4od2luZG93LmlubmVyV2lkdGgsIHJlY3QucmlnaHQpLGJvdHRvbTogTWF0aC5taW4od2luZG93LmlubmVySGVpZ2h0LCByZWN0LmJvdHRvbSl9OwogICAgICAgIHZpc2libGVSZWN0LncgPSBNYXRoLm1heCgwLCB2aXNpYmxlUmVjdC5yaWdodCAtIHZpc2libGVSZWN0LngpOwogICAgICAgIHZpc2libGVSZWN0LmggPSBNYXRoLm1heCgwLCB2aXNpYmxlUmVjdC5ib3R0b20gLSB2aXNpYmxlUmVjdC55KTsKCiAgICAgICAgaWYgKHZpc2libGVSZWN0LncgPiAwICYmIHZpc2libGVSZWN0LmggPiAwKSB7CiAgICAgICAgICAgIHQuY29udGVudFdpbmRvdy5wb3N0TWVzc2FnZSh7dHlwZTogJ21vbF9pbjEnLCByZWN0OiB7eDogdmlzaWJsZVJlY3QueCwgeTogdmlzaWJsZVJlY3QueSwgdzogdmlzaWJsZVJlY3QudywgaDogdmlzaWJsZVJlY3QuaCB9fSwgJyonKTsKICAgICAgICAgICAgcmV0ID0gMDsKICAgICAgICB9IGVsc2UgewogICAgICAgICAgICByZXQgPSAyOwogICAgICAgIH0KICAgIH0gZWxzZSB7CiAgICAgICAgcmV0ID0gMTsgLy8gbm8gaWZyYW1lCiAgICB9CgogICAgcmV0dXJuIHtpOiAxLCByZXQ6IHJldH07Cn0pKCk7Cg==";
          }
          return "";
        }
        static get alarkAnchor() {
          if (sys.platform === sys.Platform.ANDROID) {
            return "KGZ1bmN0aW9uKCkgewogICAgY29uc3QgdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWFuY2hvci1zaG93bj0idHJ1ZSJdJylbMF07IAogICAgaWYgKHQgJiYgdC50YWdOYW1lID09PSAnSUZSQU1FJykgewogICAgICAgIGNvbnN0IHJlY3QgPSB0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpOwogICAgICAgIHJldHVybiB7aTogMiwgcmV0OiAwLCByZWN0OiB7bGVmdDogcmVjdC5sZWZ0LCB0b3A6IHJlY3QudG9wLCByaWdodDogcmVjdC5yaWdodCwgYm90dG9tOiByZWN0LmJvdHRvbSwgd2lkdGg6IHJlY3Qud2lkdGgsIGhlaWdodDogcmVjdC5oZWlnaHR9fTsKICAgIH0gCgogICAgcmV0dXJuIHtpOiAyLCByZXQ6IDF9Owp9KSgpOw==";
          } else if (sys.platform === sys.Platform.IOS) {
            return "KGZ1bmN0aW9uKCkgewogICAgbGV0IHJldCA9IDE7CiAgICBjb25zdCBhcnIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1hbmNob3Itc2hvd249InRydWUiXScpOwogICAgY29uc3QgYXJyMiA9IEFycmF5LmZyb20oYXJyKS5tYXAoaXQgPT4gewogICAgICAgIHJldHVybiBpdC50YWdOYW1lID09PSAnSUZSQU1FJyA/IGl0IDogaXQucXVlcnlTZWxlY3RvcignaWZyYW1lJyk7CiAgICB9KS5maWx0ZXIoaXQgPT4gaXQpOwoKICAgIGlmIChhcnIyLmxlbmd0aCA9PSAwKSB7CiAgICAgICAgcmV0dXJuIHtpOiAyLCByZXQ6IDF9OwogICAgfQoKICAgIHJldCA9IDI7IC8vIGhhcyBidXQgbm90IGluIHZpZXcKICAgIGNvbnN0IHZmID0gYXJyMi5maWx0ZXIoaXQgPT4gewogICAgICAgIGNvbnN0IHJlY3QgPSBpdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTsKICAgICAgICBjb25zdCB2aXNpYmxlUmVjdCA9IHt4OiBNYXRoLm1heCgwLCByZWN0LmxlZnQpLHk6IE1hdGgubWF4KDAsIHJlY3QudG9wKSxyaWdodDogTWF0aC5taW4od2luZG93LmlubmVyV2lkdGgsIHJlY3QucmlnaHQpLGJvdHRvbTogTWF0aC5taW4od2luZG93LmlubmVySGVpZ2h0LCByZWN0LmJvdHRvbSl9OwogICAgICAgIHZpc2libGVSZWN0LncgPSBNYXRoLm1heCgwLCB2aXNpYmxlUmVjdC5yaWdodCAtIHZpc2libGVSZWN0LngpOwogICAgICAgIHZpc2libGVSZWN0LmggPSBNYXRoLm1heCgwLCB2aXNpYmxlUmVjdC5ib3R0b20gLSB2aXNpYmxlUmVjdC55KTsKICAgICAgICByZXR1cm4gdmlzaWJsZVJlY3QudyA+IDAgJiYgdmlzaWJsZVJlY3QuaCA+IDA7IAogICAgfSk7CgogICAgaWYgKHZmICYmIHZmLmxlbmd0aCA+IDApIHsKICAgICAgICBjb25zdCBpID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdmYubGVuZ3RoKTsKICAgICAgICBjb25zdCB0ID0gdmZbaV07CiAgICAgICAgaWYgKHQpIHsKICAgICAgICAgICAgaWYgKHQpIHsKICAgICAgICAgICAgICAgIGNvbnN0IHJlY3QgPSB0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpOwogICAgICAgICAgICAgICAgY29uc3QgdmlzaWJsZVJlY3QgPSB7eDogTWF0aC5tYXgoMCwgcmVjdC5sZWZ0KSx5OiBNYXRoLm1heCgwLCByZWN0LnRvcCkscmlnaHQ6IE1hdGgubWluKHdpbmRvdy5pbm5lcldpZHRoLCByZWN0LnJpZ2h0KSxib3R0b206IE1hdGgubWluKHdpbmRvdy5pbm5lckhlaWdodCwgcmVjdC5ib3R0b20pfTsKICAgICAgICAgICAgICAgIHZpc2libGVSZWN0LncgPSBNYXRoLm1heCgwLCB2aXNpYmxlUmVjdC5yaWdodCAtIHZpc2libGVSZWN0LngpOwogICAgICAgICAgICAgICAgdmlzaWJsZVJlY3QuaCA9IE1hdGgubWF4KDAsIHZpc2libGVSZWN0LmJvdHRvbSAtIHZpc2libGVSZWN0LnkpOwogICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3Zpc2libGVSZWN0JywgdmlzaWJsZVJlY3QpOwogICAgICAgICAgICAgICAgdC5jb250ZW50V2luZG93LnBvc3RNZXNzYWdlKHt0eXBlOiAnbW9sX2luMScsIHJlY3Q6IHt4OiB2aXNpYmxlUmVjdC54LCB5OiB2aXNpYmxlUmVjdC55LCB3OiB2aXNpYmxlUmVjdC53LCBoOiB2aXNpYmxlUmVjdC5oIH19LCAnKicpOwogICAgICAgICAgICAgICAgcmV0ID0gMDsKICAgICAgICAgICAgfQogICAgICAgIH0gCiAgICB9CiAgICByZXR1cm4ge2k6IDIsIHJldDogcmV0fTsKfSkoKTs=";
          }
          return "";
        }
        static get alarkRandomA() {
          if (sys.platform === sys.Platform.ANDROID) {
            return "KGZ1bmN0aW9uKCkgewogICAgY29uc3QgcyA9IFsiVXNlcnMgQWdyZWVtZW50IiwgIlByaXZhY3kgUG9saWN5IiwgIlRlcm1zIG9mIFNlcnZpY2UiLCAiQ29va2llIFBvbGljeSIsICJBYm91dCBVcyIsICJDb21wYW55IiwgIkNvbnRhY3QgVXMiLCAiSGVscCIsICJTdXBwb3J0IiwgIkZBUSIsICJDb29raWUiLCAiUHJpdmFjeSJdOwogICAgY29uc3QgYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2EnKTsKICAgIGlmIChhICYmIGEubGVuZ3RoID4gMCkgewogICAgICAgIGNvbnN0IGFyciA9IEFycmF5LmZyb20oYSk7CiAgICAgICAgY29uc3QgdmYgPSBhcnIuZmlsdGVyKGEgPT4gewogICAgICAgICAgICBjb25zdCByZWN0ID0gYS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTsKICAgICAgICAgICAgY29uc3QgaXNWaXNpYmxlID0gcmVjdC53aWR0aCA+IDAgJiYgcmVjdC5oZWlnaHQgPiAwICYmIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVjdC50b3AgPj0gMCAmJiByZWN0LmxlZnQgPj0gMCAmJiAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlY3QuYm90dG9tIDw9IHdpbmRvdy5pbm5lckhlaWdodCAmJiAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlY3QucmlnaHQgPD0gd2luZG93LmlubmVyV2lkdGggJiYgcmVjdC53aWR0aCA+IDAgJiYgcmVjdC5oZWlnaHQgPiAwOyAKICAgICAgICAgICAgcmV0dXJuIGlzVmlzaWJsZTsKICAgICAgICB9KTsKICAgICAgICAKICAgICAgICBjb25zdCBhMiA9IHZmLmZpbHRlcihhID0+IHsKICAgICAgICAgICAgY29uc3QgY2xlYW5UZXh0ID0gYS50ZXh0Q29udGVudC50cmltKCkucmVwbGFjZSgvXG4vZywgJycpOwogICAgICAgICAgICByZXR1cm4gY2xlYW5UZXh0Lmxlbmd0aCA+IDAgJiYgIXMuc29tZShzID0+IGNsZWFuVGV4dC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHMudG9Mb3dlckNhc2UoKSkpOwogICAgICAgIH0pOwoKICAgICAgICBpZiAoYTIgJiYgYTIubGVuZ3RoID4gMCkgewogICAgICAgICAgICBjb25zdCBpID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYTIubGVuZ3RoKTsKICAgICAgICAgICAgY29uc3Qgb25lID0gYTJbaV07CiAgICAgICAgICAgIGlmIChvbmUpIHsKICAgICAgICAgICAgICAgIGNvbnN0IHJlY3QgPSBvbmUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7CiAgICAgICAgICAgICAgICByZXR1cm4gewogICAgICAgICAgICAgICAgICAgIGk6IDMsIHJldDogMCwgdGV4dDogb25lLnRleHRDb250ZW50LnRyaW0oKS5yZXBsYWNlKC9cbi9nLCAnJyksIHJlY3Q6IHsgbGVmdDogcmVjdC5sZWZ0LCB0b3A6IHJlY3QudG9wLCByaWdodDogcmVjdC5yaWdodCwgYm90dG9tOiByZWN0LmJvdHRvbSB9CiAgICAgICAgICAgICAgICB9OwogICAgICAgICAgICB9CiAgICAgICAgfQogICAgfQoKICAgIHJldHVybiB7aTogMywgcmV0OiAxfTsKfSkoKTs=";
          } else if (sys.platform === sys.Platform.IOS) {
            return "KGZ1bmN0aW9uKCkgewogICAgY29uc3QgaXNzayA9ICVpc3NrJTsKICAgIGNvbnN0IHMgPSBbIlVzZXJzIEFncmVlbWVudCIsICJQcml2YWN5IFBvbGljeSIsICJUZXJtcyBvZiBTZXJ2aWNlIiwgIkNvb2tpZSBQb2xpY3kiLCAiQWJvdXQgVXMiLCAiQ29tcGFueSIsICJDb250YWN0IFVzIiwgIkhlbHAiLCAiU3VwcG9ydCIsICJGQVEiLCAiQ29va2llIiwgIlByaXZhY3kiLCAiUGxheSIsICJQbGF5IEdhbWUiLCAiUGxheSBOb3ciLCAiUGxheSBTdGFydCIsICJQbGF5IE5vdyJdOwogICAgY29uc3QgczIgPSBbIm1haWx0bzoiLCAidGVsOiIsICJjYWxsdG86IiwgIml0bXMtYXBwczovLyIsICJpdG1zOi8vIiwgIm1hcmtldDovLyIsICJpbnRlbnQ6Ly8iLCAiaHR0cHM6Ly9hcHBzLmFwcGxlLmNvbS9hcHAvYXBwbGUtc3RvcmUiXTsKICAgIGNvbnN0IGVsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnYScpOwogICAgY29uc3QgYXJyID0gQXJyYXkuZnJvbShlbGVtcykuZmlsdGVyKGl0ID0+IHsKICAgICAgICBjb25zdCByZWN0ID0gaXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7CiAgICAgICAgaWYgKHJlY3Qud2lkdGggPD0gMCB8fCByZWN0LmhlaWdodCA8PSAwKSB7CiAgICAgICAgICAgIHJldHVybiBmYWxzZTsKICAgICAgICB9CiAgICAgICAgCiAgICAgICAgY29uc3QgdmlzaWJsZVJlY3QgPSB7eDogTWF0aC5tYXgoMCwgcmVjdC5sZWZ0KSx5OiBNYXRoLm1heCgwLCByZWN0LnRvcCkscmlnaHQ6IE1hdGgubWluKHdpbmRvdy5pbm5lcldpZHRoLCByZWN0LnJpZ2h0KSxib3R0b206IE1hdGgubWluKHdpbmRvdy5pbm5lckhlaWdodCwgcmVjdC5ib3R0b20pfTsKICAgICAgICB2aXNpYmxlUmVjdC53ID0gTWF0aC5tYXgoMCwgdmlzaWJsZVJlY3QucmlnaHQgLSB2aXNpYmxlUmVjdC54KTsKICAgICAgICB2aXNpYmxlUmVjdC5oID0gTWF0aC5tYXgoMCwgdmlzaWJsZVJlY3QuYm90dG9tIC0gdmlzaWJsZVJlY3QueSk7CgogICAgICAgIHJldHVybiB2aXNpYmxlUmVjdC53ID4gMCAmJiB2aXNpYmxlUmVjdC5oID4gMDsKICAgIH0pLmZpbHRlcihpdCA9PiB7CiAgICAgICAgaWYgKCFpc3NrKSB7CiAgICAgICAgICAgIHJldHVybiB0cnVlOwogICAgICAgIH0KCiAgICAgICAgaWYgKGl0LmhyZWYpIHsKICAgICAgICAgICAgY29uc3QgdXJsID0gaXQuaHJlZi50b0xvd2VyQ2FzZSgpOwogICAgICAgICAgICBpZiAoczIuc29tZShzID0+IHVybC5zdGFydHNXaXRoKHMpKSkgeyByZXR1cm4gZmFsc2U7IH0KICAgICAgICB9CgogICAgICAgIGNvbnN0IGNsZWFuVGV4dCA9IGl0LnRleHRDb250ZW50LnRyaW0oKS5yZXBsYWNlKC9cbi9nLCAnJyk7CiAgICAgICAgcmV0dXJuIGNsZWFuVGV4dC5sZW5ndGggPT0gMCB8fCAoY2xlYW5UZXh0Lmxlbmd0aCA+IDAgJiYgIXMuc29tZShzID0+IGNsZWFuVGV4dC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHMudG9Mb3dlckNhc2UoKSkpKTsKICAgIH0pOwoKICAgIGNvbnN0IGkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBhcnIubGVuZ3RoKTsKICAgIGNvbnN0IG9uZSA9IGFycltpXTsKICAgIGlmIChvbmUpIHsKICAgICAgICBjb25zdCByZWN0ID0gb25lLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpOwogICAgICAgIGNvbnN0IHZpc2libGVSZWN0ID0ge3g6IE1hdGgubWF4KDAsIHJlY3QubGVmdCkseTogTWF0aC5tYXgoMCwgcmVjdC50b3ApLHJpZ2h0OiBNYXRoLm1pbih3aW5kb3cuaW5uZXJXaWR0aCwgcmVjdC5yaWdodCksYm90dG9tOiBNYXRoLm1pbih3aW5kb3cuaW5uZXJIZWlnaHQsIHJlY3QuYm90dG9tKX07CiAgICAgICAgdmlzaWJsZVJlY3QudyA9IE1hdGgubWF4KDAsIHZpc2libGVSZWN0LnJpZ2h0IC0gdmlzaWJsZVJlY3QueCk7CiAgICAgICAgdmlzaWJsZVJlY3QuaCA9IE1hdGgubWF4KDAsIHZpc2libGVSZWN0LmJvdHRvbSAtIHZpc2libGVSZWN0LnkpOwoKICAgICAgICB3aW5kb3cud2Via2l0Lm1lc3NhZ2VIYW5kbGVycy5kcmF3T3V0LnBvc3RNZXNzYWdlKHtyZWN0OiB2aXNpYmxlUmVjdCwgcHQ6IHt4OiB2aXNpYmxlUmVjdC54ICsgdmlzaWJsZVJlY3QudyAvIDIsIHk6IHZpc2libGVSZWN0LnkgKyB2aXNpYmxlUmVjdC5oIC8gMn0sIHRhZzogb25lLnRhZ05hbWV9KTsKICAgICAgICBvbmUuY2xpY2soKTsKICAgICAgICByZXR1cm4geyBpOiAzLCByZXQ6IDAsIHRleHQ6IG9uZS50ZXh0Q29udGVudC50cmltKCkucmVwbGFjZSgvXG4vZywgJycpIH07CiAgICB9CiAgICAKICAgIHJldHVybiB7aTogMywgcmV0OiAxfTsKfSkoKTs=";
          }
          return "";
        }
        static get gdpr() {
          return "KGZ1bmN0aW9uKCkgewogICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYnV0dG9uLmZjLWJ1dHRvbi5mYy1jdGEtY29uc2VudC5mYy1wcmltYXJ5LWJ1dHRvbicpOwogICAgaWYgKGJ1dHRvbikgeyBidXR0b24uY2xpY2soKTt9Cn0pKCk7";
        }
        static get alarkInterFier() {
          return "KGZ1bmN0aW9uKCkgewogICAgY29uc3QgdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXZpZ25ldHRlLWxvYWRlZD0idHJ1ZSJdJylbMF07IAogICAgaWYgKHQpIHsKICAgICAgICBpZiAoIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHQpLmRpc3BsYXkgPT0gJ2Jsb2NrJykgewogICAgICAgICAgICBsZXQgaWZyYW1lID0gbnVsbDsKICAgICAgICAgICAgaWYgKHQudGFnTmFtZSAhPT0gJ0lGUkFNRScpIHsKICAgICAgICAgICAgICAgIGlmcmFtZSA9IHQucXVlcnlTZWxlY3RvcignaWZyYW1lJyk7CiAgICAgICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgICAgICBpZnJhbWUgPSB0OwogICAgICAgICAgICB9OyAgIAoKICAgICAgICAgICAgaWYgKGlmcmFtZSkgewogICAgICAgICAgICAgICAgaWZyYW1lLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2Uoe3R5cGU6ICdmaXJlX2luMid9LCAnKicpOwogICAgICAgICAgICAgICAgcmV0dXJuIHtpOiA0LCByZXQ6IDB9OwogICAgICAgICAgICB9IGVsc2UgewogICAgICAgICAgICAgICAgcmV0dXJuIHtpOiA0LCByZXQ6IDF9OwogICAgICAgICAgICB9CiAgICAgICAgfSBlbHNlIHsKICAgICAgICAgICAgcmV0dXJuIHtpOiA0LCByZXQ6IDJ9OwogICAgICAgIH0KICAgIH0KCiAgICByZXR1cm4ge2k6IDQsIHJldDogM307Cn0pKCk7";
        }
        static get vgsuffix() {
          return [atob("I2dvb2dsZV92aWduZXR0ZQ=="), atob("I2dvb2dfZnVsbHNjcmVlbl9hZA==")];
        }
      }
      exports('BeyondRawScript', BeyondRawScript);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/beyond-report-agent.ts", ['cc', './beyond-constants.ts', './beyond-local-data.ts', './connect-agent.ts', './beyond-agent.ts', './beyond-log-agent.ts'], function (exports) {
  var cclegacy, BeyondPageType, BeyondActType, BeyondLocalData, ConnectAgent, BeyondAgent, BeyondLogAgent;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      BeyondPageType = module.BeyondPageType;
      BeyondActType = module.BeyondActType;
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
      cclegacy._RF.push({}, "9173fpoxsFHGo2I8w1GpY1F", "beyond-report-agent", undefined);
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
        BeyondReportChance["none"] = "none";
        BeyondReportChance["start"] = "start";
        BeyondReportChance["smart"] = "smart";
        BeyondReportChance["play_1"] = "play_1";
        BeyondReportChance["play_2"] = "play_2";
        BeyondReportChance["inter"] = "inter";
        BeyondReportChance["click3"] = "3click";
        BeyondReportChance["reset"] = "reset";
        BeyondReportChance["effect"] = "effect";
        BeyondReportChance["back3"] = "back3";
        BeyondReportChance["skip"] = "skip";
        return BeyondReportChance;
      }({}));
      class BeyondReportAgent {
        static report(chance, layer, pageType, actType, runStatus = true, remark = "", skipInfo = "") {
          if (chance === BeyondReportChance.none) {
            return;
          }
          if (!layer.urlConfig || !layer.layerConfig) {
            BeyondLogAgent.log("Report error: urlConfig or layerConfig is null");
            return;
          }
          const a = {
            chance: chance,
            w_id: layer.key,
            case: layer.urlConfig.hname,
            act: layer.data.currentSlideTime,
            reset: layer.data.currentBreakCountLimit,
            smart: layer.data.currentPoint,
            other_jump: layer.urlConfig.t_jump,
            w_weight: layer.layerConfig.web_weight,
            u_weight: BeyondAgent.getUrlWeight(layer.urlConfig),
            active: layer.config.hide,
            total: BeyondLocalData.getIntactCountOfHname(layer.urlConfig.hname),
            limit: layer.urlConfig.stint
          };

          // ad_n1 & ad_s1 & ad_n2 & ad_s2
          if (pageType === BeyondPageType.Home) {
            a["ad_n1"] = layer.data.currentAdO1;
            a["ad_s1"] = layer.data.currentAdP1;
          } else if (pageType === BeyondPageType.Mark) {
            a["ad_n2"] = layer.data.currentAdO2;
            a["ad_s2"] = layer.data.currentAdP2;
          }

          // reset_info
          if (chance === BeyondReportChance.reset) {
            // extra == {reset_info: BeyondResetInfo}
            if (actType === BeyondActType.ResetCommon) {
              a["reset_info"] = "common";
            } else if (actType === BeyondActType.ResetThirdJump) {
              a["reset_info"] = "jump";
            } else if (actType === BeyondActType.ResetThirdClicked) {
              a["reset_info"] = "a_click";
            } else if (actType === BeyondActType.ResetANone) {
              a["reset_info"] = "a_none";
            }
          }

          // play_info
          if (chance === BeyondReportChance.play_1 || chance === BeyondReportChance.play_2 || chance === BeyondReportChance.smart) {
            switch (actType) {
              case BeyondActType.AlarkNormal:
                a["play_info"] = "normal";
                break;
              case BeyondActType.AlarkAnchor:
                a["play_info"] = "special";
                break;
              case BeyondActType.AlarkRandomA:
                a["play_info"] = "other";
                break;
              case BeyondActType.AlarkInterVg:
                a["play_info"] = "inter";
                break;
            }
          }

          // location
          if (pageType === BeyondPageType.Home) {
            a["location"] = "home";
          } else if (pageType === BeyondPageType.Mark) {
            a["location"] = "mark";
          } else if (pageType === BeyondPageType.Inter_Vg) {
            a["location"] = "inter";
          } else if (pageType === BeyondPageType.Third) {
            a["location"] = "3click";
          }

          // run_statue
          if (chance === BeyondReportChance.smart || chance === BeyondReportChance.play_2 || chance === BeyondReportChance.effect || chance === BeyondReportChance.click3) {
            a["run_status"] = runStatus ? "true" : "false";
            a["remark"] = remark;
          }
          if (chance === BeyondReportChance.skip) {
            a["skip_info"] = skipInfo;
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

System.register("chunks:///_virtual/bundle-beyond", ['./beyond-agent.ts', './beyond-config.ts', './beyond-constants.ts', './beyond-info-panel.ts', './beyond-layer.ts', './beyond-local-data.ts', './beyond-log-agent.ts', './beyond-manager.ts', './beyond-random-url-agent.ts', './beyond-raw-script.ts', './beyond-report-agent.ts'], function () {
  return {
    setters: [null, null, null, null, null, null, null, null, null, null, null],
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