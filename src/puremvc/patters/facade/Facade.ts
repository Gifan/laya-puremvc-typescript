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

    export class Facade implements IFacade {
        static readonly SINGLETON_MSG: string = "Facade singleton already constructed!";
        static inst: IFacade = null;

        static getInstance(): IFacade {
            if (Facade.inst == null) {
                Facade.inst = new Facade();
            }
            return Facade.inst;
        }

        private $view: IView = new View();
        private $model: IModel = new Model();
        private $controller: IController = new Controller();

        constructor() {
            if (Facade.inst) {
                throw Error(Facade.SINGLETON_MSG);
            }
            Facade.inst = this;
            this.$initializeFacade();
        }

        private $initializeFacade(): void {
            this.$initializeModel();
            this.$initializeView();
            this.$initializeController();
        }

        protected $initializeModel(): void {

        }

        protected $initializeView(): void {

        }

        protected $initializeController(): void {

        }

        registerObserver(name: string, method: Function, caller: Object, receiveOnce?: boolean, priority?: number): void {
            this.$view.registerObserver(name, method, caller, receiveOnce, priority);
        }

        removeObserver(name: string, method: Function, caller: Object): void {
            this.$view.removeObserver(name, method, caller);
        }

        registerCommand(name: string, cls: new () => ICommand): void {
            this.$controller.registerCommand(name, cls);
        }

        removeCommand(name: string): void {
            this.$controller.removeCommand(name);
        }

        hasCommand(name: string): boolean {
            return this.$controller.hasCommand(name);
        }

        registerProxy(proxy: IProxy): void {
            this.$model.registerProxy(proxy);
        }

        removeProxy(name: string): void {
            this.$model.removeProxy(name);
        }

        retrieveProxy(name: string): IProxy {
            return this.$model.retrieveProxy(name);
        }

        hasProxy(name: string): boolean {
            return this.$model.hasProxy(name);
        }

        registerMediator(mediator: IMediator): void {
            this.$view.registerMediator(mediator);
        }

        removeMediator(name: string): void {
            this.$view.removeMediator(name);
        }

        retrieveMediator(name: string): IMediator {
            return this.$view.retrieveMediator(name);
        }

        hasMediator(name: string): boolean {
            return this.$view.hasMediator(name);
        }

        sendNotification(name: string, args?: any, cancelable?: boolean): void {
            this.$view.notifyObservers(name, args, cancelable);
        }

        notifyCancel(): void {
            this.$view.notifyCancel();
        }
    }
}