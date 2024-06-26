import { NotFoundException } from "@utils";
import { AccountTypeDTO } from "../dto";
import { AccountTypeRepository, AccountTypeRepositoryImpl } from "../repository";
import { AccTypeService } from "./accType.service";
import { db } from '@utils/database'

export class AccTypeServiceImpl implements AccTypeService{
    constructor(private readonly repository: AccountTypeRepository = new AccountTypeRepositoryImpl(db)){}

    async createAccType (accTypeName: string): Promise<AccountTypeDTO> {
        return await this.repository.create(accTypeName)  
    }

    async getAccTypeById (accTypeId: string): Promise<AccountTypeDTO> {
        const accType = await this.repository.getById(accTypeId)
        if (!accType) throw new NotFoundException('Account Type')
        return accType
    }

    async getAccTypeByTypeName (accTypeName: string): Promise<AccountTypeDTO>{
        const accType = await this.repository.getByTypeName(accTypeName)
        if (!accType) throw new NotFoundException('Account Type')
        return accType
    }
    
}