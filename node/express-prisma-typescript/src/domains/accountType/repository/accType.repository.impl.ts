import { AccountTypeDTO } from "../dto";
import { AccountTypeRepository } from "./accType.repository";
import { PrismaClient } from "@prisma/client";

export class AccountTypeRepositoryImpl implements AccountTypeRepository {
    constructor (private readonly db: PrismaClient) {}

    async create (typeName: string): Promise<AccountTypeDTO>{
        const accType = await this.db.accountType.create({
            data: {
                typeName: typeName,
            }
        })
        return new AccountTypeDTO(accType)
    };
    
    async delete (accTypeId: string): Promise<void> {
        await this.db.accountType.delete({
            where: {
                id: accTypeId,
            },
        });
    }
    
    async getById (accTypeId: string): Promise <AccountTypeDTO | null> {
        const accType = await this.db.accountType.findUnique({
            where:{
                id: accTypeId
            }
        })
        return (accType != null) ? new AccountTypeDTO(accType) : null
    }

    async getByTypeName (accTypeName: string): Promise <AccountTypeDTO | null> {
        const accType = await this.db.accountType.findUnique({
            where:{
                typeName: accTypeName
            }
        })
        return (accType != null) ? new AccountTypeDTO(accType) : null
    }

    async getAccTypes (): Promise <AccountTypeDTO[]> {
        const accTypes = await this.db.accountType.findMany()
        return accTypes.map(accType => new AccountTypeDTO(accType))
    }
    
}
