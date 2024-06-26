import { AccountTypeDTO } from "../dto";

export interface AccTypeService {
    createAccType: (accTypeId: string, accTypeName: string) => Promise<AccountTypeDTO>
    getAccTypeById: (accTypeId: string) => Promise <AccountTypeDTO>
    getAccTypeByTypeName: (accTypeId: string) => Promise <AccountTypeDTO>
}

