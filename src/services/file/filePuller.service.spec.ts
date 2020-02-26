import { FilePullerService } from './filePuller.service'
import { container } from '../../inversify.config'
import '../../prototypes/string.prototype'
import '../../prototypes/date.prototype'
import '../../prototypes/number.prototype'

describe('FilePullerService', () => {
  let service: FilePullerService

  beforeEach(() => {
    service = container.get(FilePullerService)
  })

  xit('', () => {
    service.ImportFilesFromDirectory()
  })
})
