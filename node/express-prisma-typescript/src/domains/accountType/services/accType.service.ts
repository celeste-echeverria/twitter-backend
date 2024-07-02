import { AccountTypeDTO } from "../dto";

export interface AccTypeService {
    createAccType: (accTypeId: string, accTypeName: string) => Promise<AccountTypeDTO>
    deleteAccType: (accTypeId: string) => Promise <void>
    getAccTypeById: (accTypeId: string) => Promise <AccountTypeDTO>
    getAccTypeByTypeName: (accTypeId: string) => Promise <AccountTypeDTO>
    getAccTypes: () => Promise <AccountTypeDTO[]>
}

