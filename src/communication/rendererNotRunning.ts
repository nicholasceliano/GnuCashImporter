import { IpcRenderer, IpcMainInvokeEvent, IpcRendererEvent } from 'electron'

class RendererNotRunning implements IpcRenderer {
  private renderNotRunning = 'Electon must be connected to use this function';
  /* eslint-disable */
  handle(channel: string, listener: (event: IpcMainInvokeEvent, ...args: any[]) => (Promise<void>) | (any)): void {
    console.log(this.renderNotRunning)
  }

  handleOnce(channel: string, listener: (event: IpcMainInvokeEvent, ...args: any[]) => (Promise<void>) | (any)): void {
    console.log(this.renderNotRunning)
  }

  invoke(channel: string, ...args: any[]): Promise<any> {
    console.log(this.renderNotRunning)
    return Promise.resolve(this.renderNotRunning)
  }

  on(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void): this {
    console.log(this.renderNotRunning)
    return this
  }

  once(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void): this {
    console.log(this.renderNotRunning)
    return this
  }

  removeAllListeners(channel: string): this {
    console.log(this.renderNotRunning)
    return this
  }

  send(channel: string, ...args: any[]): void {
    console.log(this.renderNotRunning)
  }

  sendSync(channel: string, ...args: any[]): any {
    console.log(this.renderNotRunning)
  }

  sendTo(webContentsId: number, channel: string, ...args: any[]): void {
    console.log(this.renderNotRunning)
  }

  sendToHost(channel: string, ...args: any[]): void {
    console.log(this.renderNotRunning)
  }

  removeListener(channel: string, listener: (...args: any[]) => void): this {
    console.log(this.renderNotRunning)
    return this
  }

  addListener(event: string | symbol, listener: (...args: any[]) => void): this {
    console.log(this.renderNotRunning)
    return this
  }

  off(event: string | symbol, listener: (...args: any[]) => void): this {
    console.log(this.renderNotRunning)
    return this
  }

  setMaxListeners(n: number): this {
    console.log(this.renderNotRunning)
    return this
  }

  getMaxListeners(): number {
    console.log(this.renderNotRunning)
    return 0
  }

  listeners(event: string | symbol): Function[] {
    console.log(this.renderNotRunning)
    return []
  }

  rawListeners(event: string | symbol): Function[] {
    console.log(this.renderNotRunning)
    return []
  }

  emit(event: string | symbol, ...args: any[]): boolean {
    console.log(this.renderNotRunning)
    return false
  }

  listenerCount(type: string | symbol): number {
    console.log(this.renderNotRunning)
    return 0
  }

  prependListener(event: string | symbol, listener: (...args: any[]) => void): this {
    console.log(this.renderNotRunning)
    return this
  }

  prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this {
    console.log(this.renderNotRunning)
    return this
  }

  eventNames(): Array<string | symbol> {
    console.log(this.renderNotRunning)
    return []
  }
}

const ipcRenderer = new RendererNotRunning()

export { ipcRenderer }
