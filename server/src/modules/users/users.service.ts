import { Injectable } from "@nestjs/common";
import { createUserDto } from "src/common/dto/users.dto";
import { UserRepository } from "./users.repository";

@Injectable()
export class UserService{
    constructor(
        private userRepository: UserRepository
    ){}

    async createUser(body: createUserDto){
        console.log('Creating user : ', body);

    }

    async getUser(userId){
        console.log(`Getting user ${userId}`);
    }
}