import { GnuCashDatabaseService } from './gnucashDatabase.service'
import { GnuCashTransaction } from '../../models/GnuCashTransaction'
import { container } from '../../inversify.config'
import '../../prototypes/string.prototype'
import '../../prototypes/date.prototype'
import '../../prototypes/number.prototype'
import { expect } from 'chai'
import { GnuCashImportMetaData } from '../../models/GnuCashImportMetaData'

describe('GnuCashDatabaseService', () => {
  let service: GnuCashDatabaseService

  beforeEach(() => {
    service = container.get(GnuCashDatabaseService)
  })

  it('Insert Transactions returns nothing when list is empty', () => {
    const resp = service.InsertTransactions([])

    expect(resp).to.be.undefined
  })

  xit('Insert Transactions returns correct metaData from list', () => {
    const t1 = {
      AccountGuid: '54321',
      Description: 'test2',
      Amount: 54321,
      PostDate: new Date('3/4/2020'),
      CreateDate: new Date()
    } as GnuCashTransaction
    const t2 = {
      AccountGuid: '12345',
      Description: 'test',
      Amount: 12345,
      PostDate: new Date('1/2/2020'),
      CreateDate: new Date()
    } as GnuCashTransaction

    const resp = service.InsertTransactions([t1, t2])

    expect((resp as GnuCashImportMetaData).EarliestRecordDate.getTime()).to.eq(t2.PostDate.getTime())
    expect((resp as GnuCashImportMetaData).LatestRecordDate.getTime()).to.eq(t1.PostDate.getTime())
  })
})
