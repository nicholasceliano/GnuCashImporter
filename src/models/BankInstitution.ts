import { GnuCashTransaction } from './gnuCash/GnuCashTransaction'

export interface BankInstitution {
  ParseCSV(fileContent: string, accountGuid: string): Promise<GnuCashTransaction[]>;
  ParsePDF(): Promise<GnuCashTransaction[]>;
}
