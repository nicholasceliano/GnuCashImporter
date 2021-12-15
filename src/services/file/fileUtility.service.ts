import * as fs from 'fs'
import { injectable } from 'inversify'

@injectable()
export class FileUtilityService {
  GetFilePrefix (fileName: string): string {
    if (fileName.indexOf('_') > -1) {
      return fileName.split('_')[0]
    }

    throw Error('File not in correct format')
  }

  GetFileType (fileName: string): string {
    if (fileName.indexOf('.') > -1) {
      return fileName.substring(fileName.lastIndexOf('.'), fileName.length)
    }

    throw Error('File not in correct format')
  }

  IsValidFile (filePath: string): boolean {
    return fs.lstatSync(filePath).isFile() && (filePath.indexOf('.gitignore') === -1)
  }

  MoveFile(sourceFile: string, destinationFilePath: string) {
    const fileName = sourceFile.split('/')[sourceFile.split('/').length - 1]
    const desitinationFileLocation = `${destinationFilePath}\\${fileName}`
    fs.copyFile(sourceFile, desitinationFileLocation, () => {
      fs.unlinkSync(sourceFile)
    })

    return desitinationFileLocation
  }
}
