import { GnuCashTransaction } from './GnuCashTransaction';

export interface GnuCashImportFile {
  FilePath: string;
  FileName: string;
  ImportType?: string
  Transactions: GnuCashTransaction[]
}
