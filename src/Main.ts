
//程序入口
Laya.init(600, 400, Laya.WebGL);

class TestCommand extends puremvc.SimpleCommand {

	execute(x: number, y: number): void {
		console.log("test x:" + x, ", y:" + y);
	}
}

function func(x: number, y: number) {
	console.log("func x:" + x, ", y:" + y);
}

class TestMediator extends puremvc.Mediator {

	static readonly NAME: string = "TestMediator";

	listNotificationInterests(): void {
		this.handleNotification("a", this.$a);
	}

	private $a(x: number, y: number) {
		console.log("a x:" + x, ", y:" + y);
	}
}

puremvc.Facade.getInstance().registerCommand("a", TestCommand);
puremvc.Facade.getInstance().registerObserver("a", func, null);

puremvc.Facade.getInstance().registerMediator(new TestMediator(TestMediator.NAME, 1))

puremvc.Facade.getInstance().sendNotification("a", [0, 1]);
puremvc.Facade.getInstance().sendNotification("a", 2);