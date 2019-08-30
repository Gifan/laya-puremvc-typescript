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

    export class Controller implements IController {
        static readonly SINGLETON_MSG: string = "Controller singleton already constructed!";
        static inst: IController;

        private $commands: { [name: string]: new () => ICommand } = {};

        constructor() {
            if (Controller.inst) {
                throw Error(Controller.SINGLETON_MSG);
            }
            Controller.inst = this;
        }

        executeCommand(name: string, args: any): void {
            const cls: new () => ICommand = this.$commands[name];
            const command: ICommand = new cls();
            if (args === void 0) {
                command.execute.call(command);
            }
            else if (args instanceof Array) {
                command.execute.apply(command, args);
            }
            else {
                command.execute.call(command, args);
            }
        }

        registerCommand(name: string, cls: new () => ICommand): void {
            if (this.hasCommand(name)) {
                throw Error("Register Duplicate Command " + name);
            }
            this.$commands[name] = cls;
            View.inst.registerObserver(name, this.executeCommand, this);
        }

        removeCommand(name: string): void {
            if (this.hasCommand(name) == false) {
                throw Error("Remove Non-Existent Command " + name);
            }
            delete this.$commands[name];
            View.inst.removeObserver(name, this.executeCommand, this);
        }

        retrieveCommand(name: string): new () => ICommand {
            return this.$commands[name] || null;
        }

        hasCommand(name: string): boolean {
            return this.retrieveCommand(name) != null;
        }
    }
}