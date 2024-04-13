import { CreateUserDto } from "./dto/users.dto";
import { User } from "./users.schema";

export class UsersMapper{
    
    createUser(data: CreateUserDto){
        const dataMapped: User = {
            phoneNumber: data.phoneNumber,
            userName: data.userName,
            email: data.email,
            password: data.password,
        } 
        return dataMapped;
    }

}