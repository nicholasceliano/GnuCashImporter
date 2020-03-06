import { GnuCashTransaction } from './gnuCash/GnuCashTransaction'

export interface BankInstitution {
  ParseCSV(fileContent: string): GnuCashTransaction[];
  ParsePDF(): GnuCashTransaction[];
}
