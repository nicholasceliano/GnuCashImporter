import { GnuCashTransaction } from './GnuCashTransaction';

export interface GnuCashImportFile {
  Id: string
  FilePath: string;
  FileName: string;
  ImportType?: string
  Transactions: GnuCashTransaction[]
}
