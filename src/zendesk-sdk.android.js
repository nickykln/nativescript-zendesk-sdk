"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var platform_1 = require("tns-core-modules/platform");
var frame_1 = require("tns-core-modules/ui/frame");
var ZendeskSdk = (function () {
    function ZendeskSdk() {
    }
    ZendeskSdk.initialize = function (config) {
        zendesk.core.Zendesk.INSTANCE.init(frame_1.topmost().android.activity, config.zendeskUrl, config.applicationId, config.clientId);
        if (config.identity == null) {
            ZendeskSdk.setAnonymousIdentity();
        }
        else if (typeof config.identity === 'object') {
            ZendeskSdk.setAnonymousIdentity(config.identity);
        }
        else if (typeof config.identity === 'string') {
            ZendeskSdk.setJwtIdentity(config.identity);
        }
        zendesk.support.Support.INSTANCE.init(zendesk.core.Zendesk.INSTANCE);
        if (config.userLocale) {
            ZendeskSdk.setUserLocale(config.userLocale);
        }
        return ZendeskSdk;
    };
    ZendeskSdk.setUserLocale = function (locale) {
        if (zendesk.support.Support.INSTANCE) {
            zendesk.support.Support.INSTANCE.setHelpCenterLocaleOverride(new java.util.Locale(locale));
        }
        return ZendeskSdk;
    };
    ZendeskSdk.setAnonymousIdentity = function (anonUserIdentity) {
        if (anonUserIdentity === void 0) { anonUserIdentity = {}; }
        var anonymousIdentityBuilder = new zendesk.core.AnonymousIdentity.Builder();
        if (anonUserIdentity.name) {
            anonymousIdentityBuilder.withNameIdentifier(anonUserIdentity.name);
        }
        if (anonUserIdentity.email) {
            anonymousIdentityBuilder.withEmailIdentifier(anonUserIdentity.email);
        }
        zendesk.core.Zendesk.INSTANCE.setIdentity(anonymousIdentityBuilder.build());
        return ZendeskSdk;
    };
    ZendeskSdk.setJwtIdentity = function (jwtUserIdentifier) {
        zendesk.core.Zendesk.INSTANCE.setIdentity(new zendesk.core.JwtIdentity(jwtUserIdentifier));
        return ZendeskSdk;
    };
    ZendeskSdk.configureRequests = function (config) {
        if (config === void 0) { config = {}; }
        var temp = zendesk.support.request.RequestActivity.builder();
        if (config.requestSubject) {
            temp.withRequestSubject(config.requestSubject);
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
            temp.withTags(tags);
        }
        ZendeskSdk._requestUiConfig = temp.config();
        return ZendeskSdk;
    };
    ZendeskSdk.showHelpCenter = function (options) {
        if (options === void 0) { options = {}; }
        ZendeskSdk._initHelpCenter(options)
            .show(frame_1.topmost().android.activity, [ZendeskSdk._requestUiConfig]);
    };
    ZendeskSdk.showHelpCenterForCategoryIds = function (categoryIds, options) {
        if (options === void 0) { options = {}; }
        ZendeskSdk._initHelpCenter(options).withArticlesForCategoryIds(categoryIds)
            .show(frame_1.topmost().android.activity, [ZendeskSdk._requestUiConfig]);
    };
    ZendeskSdk.showHelpCenterForLabelNames = function (labelNames, options) {
        if (options === void 0) { options = {}; }
        ZendeskSdk._initHelpCenter(options).withLabelNames(labelNames)
            .show(frame_1.topmost().android.activity, [ZendeskSdk._requestUiConfig]);
    };
    ZendeskSdk.showHelpCenterForSectionIds = function (sectionIds, options) {
        if (options === void 0) { options = {}; }
        ZendeskSdk._initHelpCenter(options).withArticlesForSectionIds(sectionIds)
            .show(frame_1.topmost().android.activity, [ZendeskSdk._requestUiConfig]);
    };
    ZendeskSdk.showArticle = function (articleId) {
        zendesk.support.guide.ViewArticleActivity.builder(parseInt(articleId))
            .show(frame_1.topmost().android.activity, [ZendeskSdk._requestUiConfig]);
    };
    ZendeskSdk.createRequest = function () {
        zendesk.support.request.RequestActivity.builder()
            .show(frame_1.topmost().android.activity, [ZendeskSdk._requestUiConfig]);
    };
    ZendeskSdk.setIosTheme = function (theme) {
        return ZendeskSdk;
    };
    ZendeskSdk._initHelpCenter = function (options) {
        return zendesk.support.guide.HelpCenterActivity.builder()
            .withContactUsButtonVisible(false)
            .withCategoriesCollapsed(options.categoriesCollapsedAndroid != null
            ? options.categoriesCollapsedAndroid
            : false)
            .withShowConversationsMenuButton(options.conversationsMenu != null
            ? options.conversationsMenu
            : true);
    };
    ZendeskSdk._requestUiConfig = null;
    return ZendeskSdk;
}());
exports.ZendeskSdk = ZendeskSdk;
