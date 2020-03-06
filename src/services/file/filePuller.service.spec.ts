import 'reflect-metadata'
import { container } from '../../inversify.config'
import { FilePullerService } from './filePuller.service'
import { GnuCashImportFile } from '../../models/gnuCash/GnuCashImportFile'
import '../../prototypes/string.prototype'
import '../../prototypes/date.prototype'
import '../../prototypes/number.prototype'

describe('FilePullerService', () => {
  let service: FilePullerService
  let importFile: GnuCashImportFile

  beforeEach(() => {
    service = container.get(FilePullerService)

    importFile = {
      FilePath: '',
      FileName: '',
      ImportType: '',
      Transactions: []
    } as GnuCashImportFile
  })

  xit('', () => {
    service.ImportFiles(importFile)
  })
})
