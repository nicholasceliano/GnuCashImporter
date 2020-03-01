import { IpcRendererEvent } from 'electron';

export interface RendererSwitch {
  send(channel: string, ...args: any[]): void
  on(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void): void | Electron.IpcRenderer
}
