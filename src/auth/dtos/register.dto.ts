import { IsEmail, IsNotEmpty } from "class-validator"

export class RegisterDto{
    @IsNotEmpty()
    first_name: string
    @IsNotEmpty()
    last_name: string
    @IsNotEmpty()
    username: string
    @IsNotEmpty()
    @IsEmail()
    email: string
    image: string
    @IsNotEmpty()
    password: string
    @IsNotEmpty()
    password_confirm: string
}