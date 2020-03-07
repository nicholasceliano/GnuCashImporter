import { GnuCashTransaction } from './gnuCash/GnuCashTransaction'

export interface BankInstitution {
  ParseCSV(fileContent: string, accountGuid: string): GnuCashTransaction[];
  ParsePDF(): GnuCashTransaction[];
}
