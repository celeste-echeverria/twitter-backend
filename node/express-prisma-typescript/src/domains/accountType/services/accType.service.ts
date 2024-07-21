import { AccountTypeDTO } from "../dto";

export interface AccTypeService {
    createAccType: (accTypeId: string, accTypeName: string) => Promise<AccountTypeDTO>
    deleteAccType: (accTypeId: string) => Promise <void>
    getAccTypeById: (accTypeId: string) => Promise <AccountTypeDTO | null>
    getAccTypeByTypeName: (accTypeId: string) => Promise <AccountTypeDTO | null>
    getAccTypes: () => Promise <AccountTypeDTO[]>
}

