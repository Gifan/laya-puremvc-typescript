/**
 * PureMVC Standard Framework for TypeScript - Copyright © 2012 Frederic Saunier
 * PureMVC Framework - Copyright © 2006-2012 Futurescale, Inc.
 * All rights reserved.

 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * Neither the name of Futurescale, Inc., PureMVC.org, nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
module puremvc {

    export class View implements IView {
        static readonly SINGLETON_MSG: string = "View singleton already constructed!";
        static inst: IView;

        private $mediators: { [name: string]: IMediator } = {};
        private $observers: { [name: string]: Array<boolean | IObserver> } = {};

        private $isCanceled: boolean = false;
        private $onceObservers: Array<IObserver> = [];

        constructor() {
            if (View.inst) {
                throw Error(View.SINGLETON_MSG);
            }
            View.inst = this;
        }

        /**
         * @receiveOnce: 是否只响应一次，默认为false
         * @priority: 优先级，优先响应级别高的消息，值越大，级别越高，默认为1
         */
        registerObserver(name: string, method: Function, caller: Object, receiveOnce: boolean = false, priority: number = 1): IObserver {
            if (name === void 0) {
                throw Error("Register Invalid Observer");
            }
            if (method === void 0) {
                throw Error("Register Invalid Observer Method");
            }
            let observers: Array<boolean | IObserver> = this.$observers[name];
            // 若列表不存在，则新建
            if (observers === void 0) {
                observers = this.$observers[name] = [false];
            }
            // 若当前禁止直接更新，则复制列表
            else if (observers[0] == true) {
                observers = this.$observers[name] = observers.concat();
                // 新生成的列表允许被更新
                observers[0] = false;
            }

            let index: number = -1;
            for (let i: number = 1; i < observers.length; i++) {
                const observer: IObserver = observers[i] as IObserver;
                if (observer.method == method && observer.caller == caller) {
                    return null;
                }
                // 优先级高的命令先执行
                if (index == -1 && observer.priority < priority) {
                    index = i;
                }
            }

            const observer: IObserver = new Observer();
            observer.name = name;
            observer.caller = caller;
            observer.method = method;
            observer.priority = priority;
            observer.receiveOnce = receiveOnce;
            if (index < 0) {
                observers.push(observer);
            }
            else {
                observers.splice(index, 0, observer);
            }
            return observer;
        }

        removeObserver(name: string, method: Function, caller: Object): void {
            if (name === void 0) {
                throw Error("Remove Invalid Observer");
            }
            if (method === void 0) {
                throw Error("Remove Invalid Observer Method");
            }
            let observers: Array<boolean | IObserver> = this.$observers[name];
            // 无此类事件
            if (observers === void 0) {
                return;
            }
            // 若当前禁止直接更新，则复制列表
            if (observers[0] == true) {
                observers = this.$observers[name] = observers.concat();
                // 新生成的列表允许被更新
                observers[0] = false;
            }
            for (let i: number = 1; i < observers.length; i++) {
                const observer: IObserver = observers[i] as IObserver;
                if (observer.method == method && observer.caller == caller) {
                    observers.splice(i, 1);
                    break;
                }
            }
            // 移除空列表
            if (observers.length == 1) {
                delete this.$observers[name];
            }
        }

        notifyCancel(): void {
            this.$isCanceled = true;
        }

        /**
         * @cancelable: 事件是否允许取消，默认为false
         */
        notifyObservers(name: string, args?: any, cancelable: boolean = false): void {
            if (name === void 0) {
                throw Error("Notify Invalid Command");
            }
            const observers: Array<boolean | IObserver> = this.$observers[name];
            // 无此类事件
            if (observers === void 0) {
                return;
            }
            // 标记禁止更新
            observers[0] = true;

            // 记录历史命令状态
            const isCanceled: boolean = this.$isCanceled;
            // 标记当前命令未取消
            this.$isCanceled = false;

            for (let i: number = 1; i < observers.length; i++) {
                const observer: IObserver = observers[i] as IObserver;
                // 一次性命令入栈
                if (observer.receiveOnce) {
                    this.$onceObservers.push(observer);
                }
                if (observer.caller == Controller.inst) {
                    observer.method.call(observer.caller, name, args);
                }
                else if (args === void 0) {
                    observer.method.call(observer.caller);
                }
                else if (args instanceof Array) {
                    observer.method.apply(observer.caller, args);
                }
                else {
                    observer.method.call(observer.caller, args);
                }
                // 命令允许被取消，且命令被取消
                if (cancelable && this.$isCanceled) {
                    break;
                }
            }
            // 回归历史命令状态
            this.$isCanceled = isCanceled;
            // 标记允许直接更新
            observers[0] = false;

            // 注销一次性命令
            while (this.$onceObservers.length > 0) {
                const observer: IObserver = this.$onceObservers.pop();
                this.removeObserver(observer.name, observer.method, observer.caller);
            }
        }

        registerMediator(mediator: IMediator): void {
            const name: string = mediator.getMediatorName();
            if (name == null) {
                throw Error("Register Invalid Mediator");
            }
            if (this.hasMediator(name)) {
                throw Error("Register Duplicate Mediator " + name);
            }
            this.$mediators[name] = mediator;
            mediator.listNotificationInterests();
            mediator.onRegister();
        }

        removeMediator(name: string): void {
            if (name === void 0) {
                throw Error("Remove Invalid Mediator");
            }
            const mediator: IMediator = this.retrieveMediator(name);
            if (mediator == null) {
                throw Error("Remove Non-Existent Mediator " + name);
            }
            delete this.$mediators[name];
            mediator.removeNotificationInterests();
            mediator.onRemove();
        }

        retrieveMediator(name: string): IMediator {
            return this.$mediators[name] || null;
        }

        hasMediator(name: string): boolean {
            return this.retrieveMediator(name) != null;
        }
    }

}