"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var color_1 = require("tns-core-modules/color/color");
var platform_1 = require("tns-core-modules/platform");
var ZendeskSdk = (function () {
    function ZendeskSdk() {
    }
    ZendeskSdk.initialize = function (config) {
        ZDKZendesk.initializeWithAppIdClientIdZendeskUrl(config.applicationId, config.clientId, config.zendeskUrl);
        if (config.identity == null) {
            ZendeskSdk.setAnonymousIdentity();
        }
        else if (typeof config.identity === 'object') {
            ZendeskSdk.setAnonymousIdentity(config.identity);
        }
        else if (typeof config.identity === 'string') {
            ZendeskSdk.setJwtIdentity(config.identity);
        }
        ZDKSupport.initializeWithZendesk(ZDKZendesk.instance);
        if (config.userLocale) {
            ZendeskSdk.setUserLocale(config.userLocale);
        }
        return ZendeskSdk;
    };
    ZendeskSdk.setUserLocale = function (locale) {
        if (ZDKSupport.instance) {
            ZDKSupport.instance.helpCenterLocaleOverride = locale;
        }
        return ZendeskSdk;
    };
    ZendeskSdk.setAnonymousIdentity = function (anonUserIdentity) {
        if (anonUserIdentity === void 0) { anonUserIdentity = {}; }
        ZDKZendesk.instance.setIdentity(ZDKObjCAnonymous.alloc().initWithNameEmail(anonUserIdentity.name, anonUserIdentity.email));
        return ZendeskSdk;
    };
    ZendeskSdk.setJwtIdentity = function (jwtUserIdentifier) {
        ZDKZendesk.instance.setIdentity(ZDKObjCJwt.alloc().initWithToken(jwtUserIdentifier));
        return ZendeskSdk;
    };
    ZendeskSdk.configureRequests = function (config) {
        var temp = ZDKRequestUiConfiguration.new();
        if (config.requestSubject) {
            temp.subject = config.requestSubject;
        }
        var tags = [];
        if (config.addDeviceInfo) {
            for (var p in platform_1.device) {
                var value = platform_1.device[p];
                if (typeof value === 'string' && value.length) {
                    var tag = value.replace(/(\s|,)/g, '');
                    tags.push(p + ":" + tag);
                }
            }
        }
        if (config.tags && config.tags.length) {
            for (var _i = 0, _a = config.tags; _i < _a.length; _i++) {
                var value = _a[_i];
                if (typeof value === 'string' && value.length) {
                    var tag = value.replace(/(\s|,)/g, '');
                    tags.push(tag);
                }
            }
        }
        if (tags.length) {
            var tagsNSArray = NSMutableArray.alloc().initWithCapacity(tags.length);
            for (var _b = 0, tags_1 = tags; _b < tags_1.length; _b++) {
                var tag = tags_1[_b];
                tagsNSArray.addObject(tag);
            }
            temp.tags = tagsNSArray;
        }
        ZendeskSdk._requestUiConfig = temp;
        return ZendeskSdk;
    };
    ZendeskSdk.showHelpCenter = function (options) {
        if (options === void 0) { options = {}; }
        var vc = ZDKHelpCenterUi.buildHelpCenterOverviewWithConfigs(NSArray.arrayWithObject(ZendeskSdk._requestUiConfig));
        ZendeskSdk._initHelpCenter(options, vc);
    };
    ZendeskSdk.showHelpCenterForCategoryIds = function (categoryIds, options) {
        if (options === void 0) { options = {}; }
        var hcUiConfig = ZDKHelpCenterUiConfiguration.new();
        hcUiConfig.groupType = 2;
        var nsArray = NSMutableArray.array();
        for (var _i = 0, categoryIds_1 = categoryIds; _i < categoryIds_1.length; _i++) {
            var e = categoryIds_1[_i];
            nsArray.addObject(e);
        }
        hcUiConfig.groupIds = nsArray;
        var vc = ZDKHelpCenterUi.buildHelpCenterOverviewWithConfigs(NSArray.arrayWithObject(ZendeskSdk._requestUiConfig).arrayByAddingObject(hcUiConfig));
        ZendeskSdk._initHelpCenter(options, vc);
    };
    ZendeskSdk.showHelpCenterForLabelNames = function (labelNames, options) {
        if (options === void 0) { options = {}; }
        var hcUiConfig = ZDKHelpCenterUiConfiguration.new();
        var nsArray = NSMutableArray.array();
        for (var _i = 0, labelNames_1 = labelNames; _i < labelNames_1.length; _i++) {
            var e = labelNames_1[_i];
            nsArray.addObject(e);
        }
        hcUiConfig.labels = nsArray;
        var vc = ZDKHelpCenterUi.buildHelpCenterOverviewWithConfigs(NSArray.arrayWithObject(ZendeskSdk._requestUiConfig).arrayByAddingObject(hcUiConfig));
        ZendeskSdk._initHelpCenter(options, vc);
    };
    ZendeskSdk.showHelpCenterForSectionIds = function (sectionIds, options) {
        if (options === void 0) { options = {}; }
        var hcUiConfig = ZDKHelpCenterUiConfiguration.new();
        hcUiConfig.groupType = 1;
        var nsArray = NSMutableArray.array();
        for (var _i = 0, sectionIds_1 = sectionIds; _i < sectionIds_1.length; _i++) {
            var e = sectionIds_1[_i];
            nsArray.addObject(e);
        }
        hcUiConfig.groupIds = nsArray;
        var vc = ZDKHelpCenterUi.buildHelpCenterOverviewWithConfigs(NSArray.arrayWithObject(ZendeskSdk._requestUiConfig).arrayByAddingObject(hcUiConfig));
        ZendeskSdk._initHelpCenter(options, vc);
    };
    ZendeskSdk.showArticle = function (articleId) {
        var vc = ZDKHelpCenterUi.buildHelpCenterArticleWithArticleIdAndConfigs(articleId, NSArray.arrayWithObject(ZendeskSdk._requestUiConfig));
        UIApplication.sharedApplication.keyWindow.rootViewController
            .presentViewControllerAnimatedCompletion(vc, true, null);
    };
    ZendeskSdk.createRequest = function () {
        UIApplication.sharedApplication.keyWindow.rootViewController
            .presentViewControllerAnimatedCompletion(ZDKRequestUi.buildRequestUi(), true, null);
    };
    ZendeskSdk.setIosTheme = function (theme) {
        if (theme.primaryColor) {
            ZDKTheme.currentTheme.primaryColor = new color_1.Color(theme.primaryColor).ios;
        }
        return ZendeskSdk;
    };
    ZendeskSdk._initHelpCenter = function (options, vc) {
        if (options.conversationsMenu != null ? !options.conversationsMenu : false) {
            vc.uiDelegate = new ZDKHelpCenterConversationsUIDelegateImpl();
        }
        UIApplication.sharedApplication.keyWindow.rootViewController
            .presentViewControllerAnimatedCompletion(vc, true, null);
    };
    ZendeskSdk._requestUiConfig = null;
    return ZendeskSdk;
}());
exports.ZendeskSdk = ZendeskSdk;
var ZDKHelpCenterConversationsUIDelegateImpl = (function (_super) {
    __extends(ZDKHelpCenterConversationsUIDelegateImpl, _super);
    function ZDKHelpCenterConversationsUIDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ZDKHelpCenterConversationsUIDelegateImpl.prototype.active = function () {
        return 2;
    };
    ZDKHelpCenterConversationsUIDelegateImpl.prototype.navBarConversationsUIType = function () {
        return 2;
    };
    ZDKHelpCenterConversationsUIDelegateImpl.ObjCProtocols = [ZDKHelpCenterConversationsUIDelegate];
    return ZDKHelpCenterConversationsUIDelegateImpl;
}(NSObject));
