import { IpcRenderer } from 'electron'

let isElectron = false
const userAgent = navigator.userAgent.toLowerCase()
if (userAgent.indexOf(' electron/') > -1) {
  isElectron = true
}

const ElectronApi: IpcRenderer = isElectron ? require('electron').ipcRenderer : require('./rendererNotRunning').ipcRenderer

export { ElectronApi }
