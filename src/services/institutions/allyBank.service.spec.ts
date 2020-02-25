import { AllyBankService } from './allyBank.service';
import { assert, expect } from 'chai';
import { GnuCashTransaction } from '../../models/GnuCashTransaction';

describe('AllyBankService', () => {
    let service: AllyBankService;
    let csvFile: string;

    beforeEach(() => {
        service = new AllyBankService();

        csvFile = 'Date,Time'; // Need to get this from file
    });

    xit('ImportCSV', () => {
        const resp = service.ImportCSV(csvFile)

        expect(resp).to.be.eq({
            AccountGuid: '',
            Description: '',
            Amount: 1234,
            PostDate: new Date(),
            CreateDate: new Date()
        } as GnuCashTransaction);
    });

    it('ImportPDF throws Not Implemented', () => {
        assert.throws(() => service.ImportPDF(), 'Not Implemented');
    });
});