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
var puremvc;
(function (puremvc) {
    var Facade = /** @class */ (function () {
        function Facade() {
            this.$view = new puremvc.View();
            this.$model = new puremvc.Model();
            this.$controller = new puremvc.Controller();
            if (Facade.inst !== null) {
                throw Error(Facade.SINGLETON_MSG);
            }
            Facade.inst = this;
            this.$initializeFacade();
        }
        Facade.getInstance = function () {
            if (Facade.inst === null) {
                Facade.inst = new Facade();
            }
            return Facade.inst;
        };
        Facade.prototype.$initializeFacade = function () {
            this.$initializeModel();
            this.$initializeView();
            this.$initializeController();
        };
        Facade.prototype.$initializeModel = function () {
        };
        Facade.prototype.$initializeView = function () {
        };
        Facade.prototype.$initializeController = function () {
        };
        Facade.prototype.registerObserver = function (name, method, caller, receiveOnce, priority) {
            this.$view.registerObserver(name, method, caller, receiveOnce, priority);
        };
        Facade.prototype.removeObserver = function (name, method, caller) {
            this.$view.removeObserver(name, method, caller);
        };
        Facade.prototype.registerCommand = function (name, cls) {
            this.$controller.registerCommand(name, cls);
        };
        Facade.prototype.removeCommand = function (name) {
            this.$controller.removeCommand(name);
        };
        Facade.prototype.hasCommand = function (name) {
            return this.$controller.hasCommand(name);
        };
        Facade.prototype.registerProxy = function (proxy) {
            this.$model.registerProxy(proxy);
        };
        Facade.prototype.removeProxy = function (name) {
            this.$model.removeProxy(name);
        };
        Facade.prototype.retrieveProxy = function (name) {
            return this.$model.retrieveProxy(name);
        };
        Facade.prototype.hasProxy = function (name) {
            return this.$model.hasProxy(name);
        };
        Facade.prototype.registerMediator = function (mediator) {
            this.$view.registerMediator(mediator);
        };
        Facade.prototype.removeMediator = function (name) {
            this.$view.removeMediator(name);
        };
        Facade.prototype.retrieveMediator = function (name) {
            return this.$view.retrieveMediator(name);
        };
        Facade.prototype.hasMediator = function (name) {
            return this.$view.hasMediator(name);
        };
        Facade.prototype.sendNotification = function (name, args, cancelable) {
            this.$view.notifyObservers(name, args, cancelable);
        };
        Facade.prototype.notifyCancel = function () {
            this.$view.notifyCancel();
        };
        Facade.SINGLETON_MSG = "Facade singleton already constructed!";
        Facade.inst = null;
        return Facade;
    }());
    puremvc.Facade = Facade;
})(puremvc || (puremvc = {}));
//# sourceMappingURL=Facade.js.map