import { GnuCashTransaction } from './GnuCashTransaction'

export interface BankInstitution {
  ImportCSV(fileContent: string): GnuCashTransaction[];
  ImportPDF(): GnuCashTransaction[];
}
