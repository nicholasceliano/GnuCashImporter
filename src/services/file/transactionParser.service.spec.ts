import { TransactionParserService } from './transactionParser.service'
import { container } from '../../inversify.config'

describe('TransactionParserService', () => {
  let service: TransactionParserService

  beforeEach(() => {
    service = container.get(TransactionParserService)
  })

  xit('', () => {
    service.GetTransactionsFromFile('', '', '', '')
  })
})
