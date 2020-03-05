import { IpcRendererEvent, ipcRenderer } from 'electron'
import { RendererSwitch } from './rendererSwitch'

class RendererRunning implements RendererSwitch {
  /* eslint-disable */
  on(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void): Electron.IpcRenderer {
    return ipcRenderer.on(channel, listener)
  }

  send(channel: string, ...args: any[]): void {
    ipcRenderer.send(channel, ...args)
  }

  removeAllListeners(channel: string): Electron.IpcRenderer {
    return ipcRenderer.removeAllListeners(channel);
  }
}

const rendererRunning = new RendererRunning()

export { rendererRunning }
