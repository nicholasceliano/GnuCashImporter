import { IpcRendererEvent } from 'electron'
import { RendererSwitch } from './rendererSwitch'

class RendererNotRunning implements RendererSwitch {
  private renderNotRunning = 'Electon must be connected to use this function';
/* eslint-disable */
  on(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void): void {
    console.log(this.renderNotRunning)
  }

  send(channel: string, ...args: any[]): void {
    console.log(this.renderNotRunning)
  }
}

const rendererNotRunning = new RendererNotRunning()

export { rendererNotRunning }
