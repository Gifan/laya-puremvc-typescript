var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
//程序入口
Laya.init(600, 400, Laya.WebGL);
var TestCommand = /** @class */ (function (_super) {
    __extends(TestCommand, _super);
    function TestCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestCommand.prototype.execute = function (x, y) {
        console.log("test x:" + x, ", y:" + y);
    };
    return TestCommand;
}(puremvc.SimpleCommand));
function func(x, y) {
    console.log("func x:" + x, ", y:" + y);
}
var TestMediator = /** @class */ (function (_super) {
    __extends(TestMediator, _super);
    function TestMediator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestMediator.prototype.listNotificationInterests = function () {
        this.handleNotification("a", this.$a);
    };
    TestMediator.prototype.$a = function (x, y) {
        console.log("a x:" + x, ", y:" + y);
    };
    TestMediator.NAME = "TestMediator";
    return TestMediator;
}(puremvc.Mediator));
puremvc.Facade.getInstance().registerCommand("a", TestCommand);
puremvc.Facade.getInstance().registerObserver("a", func, null);
puremvc.Facade.getInstance().registerMediator(new TestMediator(TestMediator.NAME, 1));
puremvc.Facade.getInstance().sendNotification("a", [0, 1]);
puremvc.Facade.getInstance().sendNotification("a", 2);
//# sourceMappingURL=Main.js.map