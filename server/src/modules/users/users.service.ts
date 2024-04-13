import { Injectable } from "@nestjs/common";
import { UserRepository } from "./users.repository";
import { CreateUserDto, FetchUserDto, UpdateUserDto } from "./dto/users.dto";
import { UsersMapper } from "./users.mapper";
import { Types } from "mongoose";

@Injectable()
export class UserService {
    constructor(
        private userRepository: UserRepository,
        private userMapper: UsersMapper,
    ) { }

    async createUser(body: CreateUserDto) {
        const userPresent = await this.userRepository.fetchOne({ searchParams: { phoneNumber: body.phoneNumber, email: body.email } });
        console.log('userPresent: ', userPresent);
        if (userPresent) {
            throw new Error("User Already present with email or phone");
        }

        const data = this.userMapper.createUser(body);
        console.log('data: ', data);
        const dbData = await this.userRepository.create(body);

        console.log('Creating user : ', body, dbData);
        return dbData;
    }

    async getUser(params: FetchUserDto) {
        const dbData = await this.userRepository.fetchOne({ searchParams: { _id: params.userId } });
        if (!dbData) {
            throw new Error("User not found!!!");
        }
        return dbData;
    }

    // async updateUser(params: UpdateUserDto){
    //     const dbDa
    // }


    // Delete user
}