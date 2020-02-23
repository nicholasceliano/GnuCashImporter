import { BankInstitution } from "../../models/BankInstitution";
import { GnuCashTransaction } from "../../models/GnuCashTransaction";

export class TDAmeritrade implements BankInstitution {

    ImportCSV(fileContent: string): GnuCashTransaction[] {
        console.log(fileContent);
        throw ('Not Implemented');
    }

    ImportPDF(): GnuCashTransaction[] {
        throw ('Not Implemented');
    }
}