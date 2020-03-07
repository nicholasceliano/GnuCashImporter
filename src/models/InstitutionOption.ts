import { BankInstitution } from './BankInstitution'
import { SelectOption } from './utility/SelectOption'

export interface InsitutionOption extends SelectOption {
  BankInstitution: BankInstitution;
}
