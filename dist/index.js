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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
    var _this = this;
    var defaultScopes = [
        "https://www.googleapis.com/auth/drive.readonly",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/drive.metadata",
    ];
    var _a = (0, useInjectScript_1.default)("https://apis.google.com/js/api.js"), loaded = _a[0], error = _a[1];
    var _b = (0, useInjectScript_1.default)("https://accounts.google.com/gsi/client"), loadedGsi = _b[0], errorGsi = _b[1];
    var _c = (0, react_1.useState)(false), pickerApiLoaded = _c[0], setPickerApiLoaded = _c[1];
    var _d = (0, react_1.useState)(false), openAfterAuth = _d[0], setOpenAfterAuth = _d[1];
    var _e = (0, react_1.useState)(typeDefs_1.defaultConfiguration), config = _e[0], setConfig = _e[1];
    var _f = (0, react_1.useState)(), authRes = _f[0], setAuthRes = _f[1];
    var _g = (0, react_1.useState)(null), pickerInstance = _g[0], setPickerInstance = _g[1];
    var _h = (0, react_1.useState)(false), tokenInvalid = _h[0], setTokenInvalid = _h[1];
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
            pickerApiLoaded &&
            !tokenInvalid) {
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
        tokenInvalid,
    ]);
    var handleAuthResult = function (authResult) {
        var _a;
        if (authResult && !authResult.error) {
            setAuthRes(authResult);
            setPickerApiLoaded(true);
            setTokenInvalid(false);
        }
        else {
            console.error("Authentication error:", authResult.error);
            setTokenInvalid(true);
            closePicker();
            (_a = config.callbackFunction) === null || _a === void 0 ? void 0 : _a.call(config, { action: "tokenError", docs: [] });
        }
    };
    var onAuthApiLoad = function () {
        window.gapi.auth.authorize({
            client_id: config.clientId,
            scope: defaultScopes,
            immediate: false,
        }, handleAuthResult);
    };
    var closePicker = function () {
        var pickerDialogs = document.querySelectorAll(".picker-dialog");
        var pickerDialogsBg = document.querySelectorAll(".picker-dialog-bg");
        if (pickerInstance) {
            try {
                pickerInstance.setVisible(false);
            }
            catch (e) {
                console.error("Error hiding picker:", e);
            }
            setPickerInstance(null);
        }
        pickerDialogs === null || pickerDialogs === void 0 ? void 0 : pickerDialogs.forEach(function (it) { return it.remove(); });
        pickerDialogsBg === null || pickerDialogsBg === void 0 ? void 0 : pickerDialogsBg.forEach(function (it) { return it.remove(); });
    };
    var openPicker = function (config) {
        var _a;
        setConfig(config);
        if (tokenInvalid) {
            console.warn("Token is invalid, not opening picker.");
            (_a = config.callbackFunction) === null || _a === void 0 ? void 0 : _a.call(config, { action: "tokenError", docs: [] });
            return false;
        }
        if (!config.token) {
            var client = google.accounts.oauth2.initTokenClient({
                client_id: config.clientId,
                scope: __spreadArray(__spreadArray([], (defaultScopes || []), true), ((config === null || config === void 0 ? void 0 : config.customScopes) || []), true).join(" "),
                callback: function (tokenResponse) {
                    var _a;
                    if (tokenResponse && tokenResponse.access_token) {
                        setAuthRes(tokenResponse);
                        setTokenInvalid(false);
                        createPicker(__assign(__assign({}, config), { token: tokenResponse.access_token }));
                    }
                    else {
                        console.error("Token retrieval failed:", tokenResponse);
                        setTokenInvalid(true);
                        closePicker();
                        (_a = config.callbackFunction) === null || _a === void 0 ? void 0 : _a.call(config, { action: "tokenError", docs: [] });
                    }
                },
                error_callback: function (error) {
                    var _a;
                    console.error("Error during token retrieval:", error);
                    setTokenInvalid(true);
                    closePicker();
                    (_a = config.callbackFunction) === null || _a === void 0 ? void 0 : _a.call(config, { action: "tokenError", docs: [] });
                },
            });
            client.requestAccessToken();
        }
        else if (loaded && !error && pickerApiLoaded) {
            validateToken(config.token)
                .then(function () {
                createPicker(config);
            })
                .catch(function () {
                var _a;
                console.error("Token validation failed, not opening picker.");
                setTokenInvalid(true);
                closePicker();
                (_a = config.callbackFunction) === null || _a === void 0 ? void 0 : _a.call(config, { action: "tokenError", docs: [] });
            });
            return true;
        }
        else {
            setOpenAfterAuth(true);
        }
        return undefined;
    };
    var loadApis = function () {
        window.gapi.load("auth", { callback: onAuthApiLoad });
        window.gapi.load("picker", { callback: onPickerApiLoad });
    };
    var onPickerApiLoad = function () {
        setPickerApiLoaded(true);
    };
    var createPicker = function (_a) {
        var title = _a.title, token = _a.token, _b = _a.appId, appId = _b === void 0 ? "" : _b, _c = _a.supportDrives, supportDrives = _c === void 0 ? true : _c, developerKey = _a.developerKey, _d = _a.viewId, viewId = _d === void 0 ? "DOCS" : _d, disabled = _a.disabled, multiselect = _a.multiselect, setOrigin = _a.setOrigin, _e = _a.showUploadView, showUploadView = _e === void 0 ? false : _e, showUploadFolders = _a.showUploadFolders, _f = _a.setParentFolder, setParentFolder = _f === void 0 ? "" : _f, viewMimeTypes = _a.viewMimeTypes, customViews = _a.customViews, _g = _a.locale, locale = _g === void 0 ? "en" : _g, _h = _a.setIncludeFolders, setIncludeFolders = _h === void 0 ? false : _h, setSelectFolderEnabled = _a.setSelectFolderEnabled, _j = _a.disableDefaultView, disableDefaultView = _j === void 0 ? false : _j, callbackFunction = _a.callbackFunction, _k = _a.navHidden, navHidden = _k === void 0 ? false : _k, _l = _a.filterImagesAndVideos, filterImagesAndVideos = _l === void 0 ? false : _l, _m = _a.filterPDFs, filterPDFs = _m === void 0 ? false : _m, _o = _a.filterFolders, filterFolders = _o === void 0 ? false : _o, _p = _a.filterStarred, filterStarred = _p === void 0 ? true : _p;
        if (disabled || tokenInvalid)
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
        var picker = new google.picker.PickerBuilder()
            .setAppId(appId)
            .setOAuthToken(token)
            .setDeveloperKey(developerKey)
            .setLocale(locale)
            .setCallback(function (data) {
            var pickerDialogs = document.querySelectorAll(".picker-dialog");
            var pickerDialogsBg = document.querySelectorAll(".picker-dialog-bg");
            function clearView(close) {
                var _a;
                if (close || ((_a = data === null || data === void 0 ? void 0 : data.docs) === null || _a === void 0 ? void 0 : _a.length)) {
                    callbackFunction === null || callbackFunction === void 0 ? void 0 : callbackFunction({ action: "cancel", docs: [] });
                    setTimeout(function () {
                        if (picker) {
                            setPickerInstance(null);
                        }
                        pickerDialogs === null || pickerDialogs === void 0 ? void 0 : pickerDialogs.forEach(function (it) { return it.remove(); });
                        pickerDialogsBg === null || pickerDialogsBg === void 0 ? void 0 : pickerDialogsBg.forEach(function (it) { return it.remove(); });
                    }, 100);
                }
            }
            pickerDialogsBg === null || pickerDialogsBg === void 0 ? void 0 : pickerDialogsBg.forEach(function (it) {
                var elem = it;
                elem.onclick = function () {
                    clearView(true);
                };
            });
            callbackFunction === null || callbackFunction === void 0 ? void 0 : callbackFunction(data);
            clearView((data === null || data === void 0 ? void 0 : data.action) === "cancel");
        });
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
        picker.setTitle(title || "Google Drive Picker");
        var builtPicker = picker.build();
        setPickerInstance(builtPicker);
        builtPicker.setVisible(true);
        return true;
    };
    var validateToken = function (token) { return __awaiter(_this, void 0, void 0, function () {
        var response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4, fetch("https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=".concat(token))];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        console.error("Token validation failed:", response.status, response.statusText);
                        setTokenInvalid(true);
                        throw new Error("Token validation failed: ".concat(response.status));
                    }
                    return [4, response.json()];
                case 2:
                    data = _a.sent();
                    console.log("Token validation successful:", data);
                    setTokenInvalid(false);
                    return [3, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error validating token:", error_1);
                    setTokenInvalid(true);
                    throw error_1;
                case 4: return [2];
            }
        });
    }); };
    return [openPicker, authRes];
}
//# sourceMappingURL=index.js.map