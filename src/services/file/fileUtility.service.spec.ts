import { FileUtilityService } from './fileUtility.service'
import { expect, assert } from 'chai'

describe('FileUtilityService', () => {
  let service: FileUtilityService
  let fileName: string

  beforeEach(() => {
    service = new FileUtilityService()

    fileName = 'ALLY_test1230492_test1234.csv'
  })

  it('File prefix returns everything before first underscore', () => {
    const resp = service.GetFilePrefix(fileName)

    expect(resp).to.eq('ALLY')
  })

  it('File type returns value after last period, including period', () => {
    const resp = service.GetFileType(fileName)

    expect(resp).to.eq('.csv')
  })

  it('Any path with .gitignore is not a valid file', () => {
    const resp = service.IsValidFile('.gitignore')

    expect(resp).to.be.false
  })

  it('File Directory is not a file', () => {
    const resp = service.IsValidFile('./FileUploadDirectory')

    expect(resp).to.be.false
  })

  xit('Any other file is valid', () => {
    const resp = service.IsValidFile('./src/index.ts')

    expect(resp).to.be.true
  })

  it('Exception thrown when prefix is missing', () => {
    assert.throws(() => service.GetFilePrefix('BadPrefixFile.csv'), 'File not in correct format')
  })

  it('Exception thrown when filetype extension is missing', () => {
    assert.throws(() => service.GetFileType('BadPrefixFilecsv'), 'File not in correct format')
  })
})
