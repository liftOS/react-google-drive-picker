"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useDrivePicker;
var react_1 = require("react");
var typeDefs_1 = require("./typeDefs");
var useInjectScript_1 = __importDefault(require("./useInjectScript"));
function useDrivePicker() {
    var defaultScopes = [
        "https://www.googleapis.com/auth/drive.readonly",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/drive.metadata"
    ];
    var _a = (0, useInjectScript_1.default)('https://apis.google.com/js/api.js'), loaded = _a[0], error = _a[1];
    var _b = (0, useInjectScript_1.default)('https://accounts.google.com/gsi/client'), loadedGsi = _b[0], errorGsi = _b[1];
    var _c = (0, react_1.useState)(false), pickerApiLoaded = _c[0], setPickerApiLoaded = _c[1];
    var _d = (0, react_1.useState)(false), openAfterAuth = _d[0], setOpenAfterAuth = _d[1];
    var _e = (0, react_1.useState)(typeDefs_1.defaultConfiguration), config = _e[0], setConfig = _e[1];
    var _f = (0, react_1.useState)(), authRes = _f[0], setAuthRes = _f[1];
    var picker;
    (0, react_1.useEffect)(function () {
        if (loaded && !error && loadedGsi && !errorGsi && !pickerApiLoaded) {
            loadApis();
        }
    }, [loaded, error, loadedGsi, errorGsi, pickerApiLoaded]);
    (0, react_1.useEffect)(function () {
        if (openAfterAuth &&
            config.token &&
            loaded &&
            !error &&
            loadedGsi &&
            !errorGsi &&
            pickerApiLoaded) {
            createPicker(config);
            setOpenAfterAuth(false);
        }
    }, [
        openAfterAuth,
        config.token,
        loaded,
        error,
        loadedGsi,
        errorGsi,
        pickerApiLoaded,
    ]);
    var handleAuthResult = function (authResult) {
        if (authResult && !authResult.error) {
            setAuthRes(authResult);
            setPickerApiLoaded(true);
        }
        else {
            console.error('Authentication error:', authResult.error);
        }
    };
    var onAuthApiLoad = function () {
        window.gapi.auth.authorize({
            client_id: config.clientId,
            scope: defaultScopes,
            immediate: false,
        }, handleAuthResult);
    };
    var openPicker = function (config) {
        setConfig(config);
        if (!config.token) {
            var client = google.accounts.oauth2.initTokenClient({
                client_id: config.clientId,
                scope: __spreadArray(__spreadArray([], (defaultScopes || []), true), ((config === null || config === void 0 ? void 0 : config.customScopes) || []), true).join(' '),
                callback: function (tokenResponse) {
                    setAuthRes(tokenResponse);
                    createPicker(__assign(__assign({}, config), { token: tokenResponse.access_token }));
                },
            });
            client.requestAccessToken();
        }
        else if (loaded && !error && pickerApiLoaded) {
            return createPicker(config);
        }
        else {
            setOpenAfterAuth(true);
        }
    };
    var loadApis = function () {
        window.gapi.load('auth', { callback: onAuthApiLoad });
        window.gapi.load('picker', { callback: onPickerApiLoad });
    };
    var onPickerApiLoad = function () {
        setPickerApiLoaded(true);
    };
    var createPicker = function (_a) {
        var title = _a.title, token = _a.token, _b = _a.appId, appId = _b === void 0 ? '' : _b, _c = _a.supportDrives, supportDrives = _c === void 0 ? true : _c, developerKey = _a.developerKey, _d = _a.viewId, viewId = _d === void 0 ? 'DOCS' : _d, disabled = _a.disabled, multiselect = _a.multiselect, setOrigin = _a.setOrigin, _e = _a.showUploadView, showUploadView = _e === void 0 ? false : _e, showUploadFolders = _a.showUploadFolders, _f = _a.setParentFolder, setParentFolder = _f === void 0 ? '' : _f, viewMimeTypes = _a.viewMimeTypes, customViews = _a.customViews, _g = _a.locale, locale = _g === void 0 ? 'en' : _g, _h = _a.setIncludeFolders, setIncludeFolders = _h === void 0 ? false : _h, setSelectFolderEnabled = _a.setSelectFolderEnabled, _j = _a.disableDefaultView, disableDefaultView = _j === void 0 ? false : _j, callbackFunction = _a.callbackFunction, _k = _a.navHidden, navHidden = _k === void 0 ? false : _k, _l = _a.filterImagesAndVideos, filterImagesAndVideos = _l === void 0 ? false : _l, _m = _a.filterPDFs, filterPDFs = _m === void 0 ? false : _m, _o = _a.filterFolders, filterFolders = _o === void 0 ? false : _o, _p = _a.filterStarred, filterStarred = _p === void 0 ? true : _p;
        if (disabled)
            return false;
        var view = new google.picker.DocsView(google.picker.ViewId[viewId]);
        if (viewMimeTypes)
            view.setMimeTypes(viewMimeTypes);
        if (setIncludeFolders)
            view.setIncludeFolders(true);
        if (setSelectFolderEnabled)
            view.setSelectFolderEnabled(true);
        var starredView = new google.picker.DocsView(google.picker.ViewId[viewId]);
        starredView.setStarred(filterStarred).setLabel("Starred");
        if (viewMimeTypes)
            starredView.setMimeTypes(viewMimeTypes);
        if (setIncludeFolders)
            starredView.setIncludeFolders(true);
        if (setSelectFolderEnabled)
            starredView.setSelectFolderEnabled(true);
        var uploadView = new google.picker.DocsUploadView();
        if (viewMimeTypes)
            uploadView.setMimeTypes(viewMimeTypes);
        if (showUploadFolders)
            uploadView.setIncludeFolders(true);
        if (setParentFolder) {
            uploadView.setParent(setParentFolder);
            view.setParent(setParentFolder);
        }
        var sharedDriveView = new google.picker.DocsView();
        sharedDriveView.setOwnedByMe(false);
        if (viewMimeTypes)
            sharedDriveView.setMimeTypes(viewMimeTypes);
        if (setIncludeFolders)
            sharedDriveView.setIncludeFolders(true);
        if (setSelectFolderEnabled)
            sharedDriveView.setSelectFolderEnabled(true);
        if (supportDrives)
            sharedDriveView.setEnableDrives(true);
        var foldersView = new google.picker.DocsView(google.picker.ViewId.FOLDERS);
        if (setIncludeFolders)
            foldersView.setIncludeFolders(true);
        if (setSelectFolderEnabled)
            foldersView.setSelectFolderEnabled(true);
        var imagesAndVideos = new google.picker.DocsView(google.picker.ViewId.DOCS_IMAGES_AND_VIDEOS);
        var pdfs = new google.picker.DocsView(google.picker.ViewId.PDFS);
        picker = new google.picker.PickerBuilder()
            .setAppId(appId)
            .setOAuthToken(token)
            .setDeveloperKey(developerKey)
            .setLocale(locale)
            .setCallback(callbackFunction);
        if (setOrigin) {
            picker.setOrigin(setOrigin);
        }
        if (!disableDefaultView) {
            picker.addView(view);
        }
        if (filterFolders) {
            picker.addView(foldersView);
        }
        if (supportDrives) {
            picker.addView(sharedDriveView);
            picker.enableFeature(google.picker.Feature.SUPPORT_DRIVES);
        }
        if (filterImagesAndVideos) {
            picker.addView(imagesAndVideos);
        }
        if (filterPDFs) {
            picker.addView(pdfs);
        }
        if (navHidden) {
            picker.enableFeature(google.picker.Feature.NAV_HIDDEN);
        }
        if (customViews) {
            customViews.forEach(function (view) { return picker.addView(view); });
        }
        if (multiselect) {
            picker.enableFeature(google.picker.Feature.MULTISELECT_ENABLED);
        }
        if (showUploadView) {
            picker.addView(uploadView);
        }
        if (filterStarred) {
            picker.addView(starredView);
        }
        picker.setTitle(title || 'Google Drive Picker');
        picker.build().setVisible(true);
        return true;
    };
    return [openPicker, authRes];
}
//# sourceMappingURL=index.js.map