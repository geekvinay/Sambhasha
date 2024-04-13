import { IsEmail, isNotEmpty, IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    userName: string;

    @IsNotEmpty()
    @IsString()
    password: string;
    
    @IsNotEmpty()
    @IsString()
    phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;
}

export class UpdateUserDto {
    @IsNotEmpty()
    @IsString()
    userName: string;
    
    @IsNotEmpty()
    @IsString()
    phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;
}

export class FetchUserDto {
    @IsNotEmpty()
    @IsString()
    userId: Types.ObjectId
}