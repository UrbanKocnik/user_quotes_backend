import { IsNotEmpty } from "class-validator"

export class VoteCreateDto{
    @IsNotEmpty()
    rating: boolean
}