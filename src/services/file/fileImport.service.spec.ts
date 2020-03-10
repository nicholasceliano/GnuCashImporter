import 'reflect-metadata'
import { container } from '../../inversify.config'
import { GnuCashImportFile } from '../../models/gnuCash/GnuCashImportFile'
import '../../prototypes/string.prototype'
import '../../prototypes/date.prototype'
import '../../prototypes/number.prototype'
import { FileImportService } from './fileImport.service'

describe('FilePullerService', () => {
  let service: FileImportService
  let importFile: GnuCashImportFile

  beforeEach(() => {
    service = container.get(FileImportService)

    importFile = {
      FilePath: '',
      FileName: '',
      ImportType: '',
      ImportAccount: '',
      Transactions: []
    } as GnuCashImportFile
  })

  xit('', () => {
    service.ImportFiles(importFile)
  })
})
