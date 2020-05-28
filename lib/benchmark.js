"use strict";
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
        while (_) try {
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
exports.__esModule = true;
exports.benchmark = void 0;
var path_1 = require("path");
var promises_1 = require("fs/promises");
var puppeteer_1 = require("puppeteer");
var uuid_1 = require("uuid");
exports.benchmark = function (url, task) { return __awaiter(void 0, void 0, void 0, function () {
    var dist, browser, page, navigationPromise, buffer, traceEvents;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                dist = path_1["default"].join('measurement', (task.name || uuid_1.v4()) + ".json");
                return [4 /*yield*/, puppeteer_1["default"].launch()];
            case 1:
                browser = _d.sent();
                return [4 /*yield*/, browser.newPage()];
            case 2:
                page = _d.sent();
                navigationPromise = page.waitForNavigation();
                return [4 /*yield*/, page.goto(url)];
            case 3:
                _d.sent();
                return [4 /*yield*/, page.setViewport({ width: 1440, height: 810 })];
            case 4:
                _d.sent();
                return [4 /*yield*/, navigationPromise];
            case 5:
                _d.sent();
                return [4 /*yield*/, ((_a = task.before) === null || _a === void 0 ? void 0 : _a.call(task, page))];
            case 6:
                _d.sent();
                return [4 /*yield*/, page.evaluate(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, new Promise(function (resolve) { return window
                                        .requestIdleCallback(resolve, { timeout: 5000 }); })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 7:
                _d.sent();
                return [4 /*yield*/, page.tracing.start({ path: '/dev/null' })];
            case 8:
                _d.sent();
                return [4 /*yield*/, ((_b = task.main) === null || _b === void 0 ? void 0 : _b.call(task, page))];
            case 9:
                _d.sent();
                return [4 /*yield*/, page.evaluate(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, new Promise(function (resolve) { return window
                                        .requestIdleCallback(resolve, { timeout: 5000 }); })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 10:
                _d.sent();
                return [4 /*yield*/, page.tracing.stop()];
            case 11:
                buffer = _d.sent();
                return [4 /*yield*/, ((_c = task.after) === null || _c === void 0 ? void 0 : _c.call(task, page))];
            case 12:
                _d.sent();
                traceEvents = JSON.parse(buffer.toString()).traceEvents;
                return [4 /*yield*/, promises_1["default"].writeFile(path_1["default"].resolve(__dirname, 'public', dist), JSON.stringify(traceEvents))];
            case 13:
                _d.sent();
                return [4 /*yield*/, browser.close()];
            case 14:
                _d.sent();
                return [2 /*return*/, dist];
        }
    });
}); };
