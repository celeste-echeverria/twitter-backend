import { UserDTO } from "@domains/user/dto";
import { AccountTypeDTO } from "../dto";

export interface AccountTypeRepository {
    create: (typeName: string) => Promise<AccountTypeDTO>
    delete: (accTypeId: string,) => Promise<void>
    getById: (accId: string) => Promise<AccountTypeDTO | null>
    getByTypeName: (typeName: string) => Promise <AccountTypeDTO | null>
    getAccTypes: (accTypeId: string) => Promise<AccountTypeDTO[]>
} 