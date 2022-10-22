import { IsEmail, IsNotEmpty } from "class-validator"

export class RegisterDto{
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