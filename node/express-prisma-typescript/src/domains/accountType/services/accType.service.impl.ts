import { InternalServerErrorException, NotFoundException } from "@utils";
import { AccountTypeDTO } from "../dto";
import { AccountTypeRepository, AccountTypeRepositoryImpl } from "../repository";
import { AccTypeService } from "./accType.service";
import { db } from '@utils/database'

export class AccTypeServiceImpl implements AccTypeService{
    constructor(private readonly repository: AccountTypeRepository = new AccountTypeRepositoryImpl(db)){}

    async createAccType (accTypeName: string): Promise<AccountTypeDTO> {

        try{          
            return await this.repository.create(accTypeName)  
        } catch (error) {
            throw new InternalServerErrorException("createAccType")
        }
    }

    async deleteAccType (accTypeId: string) : Promise <void> {

        try{          
            await this.repository.delete(accTypeId)
        } catch (error) {
            throw new InternalServerErrorException("deleteAccType")
        }
    }

    async getAccTypeById (accTypeId: string): Promise<AccountTypeDTO> {

        try{
            const accType = await this.repository.getById(accTypeId)
            if (!accType) throw new NotFoundException('Account Type')
            return accType
        } catch (error) {
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException("getAccTypeById")
        }
    }

    async getAccTypeByTypeName (accTypeName: string): Promise<AccountTypeDTO>{

        try{
            const accType = await this.repository.getByTypeName(accTypeName)
            if (!accType) throw new NotFoundException('Account Type')
            return accType
        } catch (error) {
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException("getAccTypeByName")
        }   
    }

    async getAccTypes() : Promise <AccountTypeDTO[]> {
        
        try{
            return await this.getAccTypes()
        } catch (error) {
            throw new InternalServerErrorException("getAccTypes")
        }
    }
    
}