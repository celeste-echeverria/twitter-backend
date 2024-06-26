export class AccountTypeDTO {

    constructor(accType: AccountTypeDTO){
        this.id = accType.id
        this.typeName = accType.typeName
    }

    id: string
    typeName: string

}