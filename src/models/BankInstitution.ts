import { GnuCashTransaction } from './GnuCashTransaction'

export interface BankInstitution {
  ParseCSV(fileContent: string): GnuCashTransaction[];
  ParsePDF(): GnuCashTransaction[];
}
