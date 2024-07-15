"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useInjectScript;
var react_1 = require("react");
var injectorState = {
    queue: {},
    injectorMap: {},
    scriptMap: {},
};
function useInjectScript(url) {
    var _a = (0, react_1.useState)({
        loaded: false,
        error: false,
    }), state = _a[0], setState = _a[1];
    (0, react_1.useEffect)(function () {
        var _a, _b, _c, _d, _e;
        if (!((_a = injectorState.injectorMap) === null || _a === void 0 ? void 0 : _a[url])) {
            injectorState.injectorMap[url] = 'init';
        }
        if (injectorState.injectorMap[url] === 'loaded') {
            setState({
                loaded: true,
                error: false,
            });
            return;
        }
        if (injectorState.injectorMap[url] === 'error') {
            setState({
                loaded: true,
                error: true,
            });
            return;
        }
        var onScriptEvent = function (error) {
            var _a, _b, _c, _d;
            if (error)
                console.log('error loading the script');
            (_b = (_a = injectorState.queue) === null || _a === void 0 ? void 0 : _a[url]) === null || _b === void 0 ? void 0 : _b.forEach(function (job) { return job(error); });
            if (error && injectorState.scriptMap[url]) {
                (_d = (_c = injectorState.scriptMap) === null || _c === void 0 ? void 0 : _c[url]) === null || _d === void 0 ? void 0 : _d.remove();
                injectorState.injectorMap[url] = 'error';
            }
            else
                injectorState.injectorMap[url] = 'loaded';
            delete injectorState.scriptMap[url];
        };
        var stateUpdate = function (error) {
            setState({
                loaded: true,
                error: error,
            });
        };
        if (!((_b = injectorState.scriptMap) === null || _b === void 0 ? void 0 : _b[url])) {
            injectorState.scriptMap[url] = document.createElement('script');
            if (injectorState.scriptMap[url]) {
                injectorState.scriptMap[url].src = url;
                injectorState.scriptMap[url].async = true;
                document.body.append(injectorState.scriptMap[url]);
                injectorState.scriptMap[url].addEventListener('load', function () {
                    return onScriptEvent(false);
                });
                injectorState.scriptMap[url].addEventListener('error', function () {
                    return onScriptEvent(true);
                });
                injectorState.injectorMap[url] = 'loading';
            }
        }
        if (!((_c = injectorState.queue) === null || _c === void 0 ? void 0 : _c[url])) {
            injectorState.queue[url] = [stateUpdate];
        }
        else {
            (_e = (_d = injectorState.queue) === null || _d === void 0 ? void 0 : _d[url]) === null || _e === void 0 ? void 0 : _e.push(stateUpdate);
        }
        return function () {
            var _a, _b;
            if (!injectorState.scriptMap[url])
                return;
            (_a = injectorState.scriptMap[url]) === null || _a === void 0 ? void 0 : _a.removeEventListener('load', function () {
                return onScriptEvent(true);
            });
            (_b = injectorState.scriptMap[url]) === null || _b === void 0 ? void 0 : _b.removeEventListener('error', function () {
                return onScriptEvent(true);
            });
        };
    }, [url]);
    return [state.loaded, state.error];
}
//# sourceMappingURL=useInjectScript.js.map