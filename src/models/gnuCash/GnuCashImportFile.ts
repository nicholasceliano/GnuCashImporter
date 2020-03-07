import { GnuCashTransaction } from './GnuCashTransaction'

export interface GnuCashImportFile {
  FilePath: string;
  FileName: string;
  ImportType: string;
  ImportAccount: string;
  Transactions: GnuCashTransaction[];
}
