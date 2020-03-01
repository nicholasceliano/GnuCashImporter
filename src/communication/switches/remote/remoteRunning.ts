import { RemoteSwitch } from './remoteSwitch'
import { remote } from 'electron'

class RemoteRunning implements RemoteSwitch {
  private maximized = false;

  close() {
    remote.getCurrentWindow().close()
  }

  maximizeResize() {
    if (this.maximized) {
      remote.getCurrentWindow().restore()
      this.maximized = false
    } else {
      remote.getCurrentWindow().maximize()
      this.maximized = true
    }
  }

  minimize() {
    remote.getCurrentWindow().minimize()
  }
}

const remoteRunning = new RemoteRunning()

export { remoteRunning }
