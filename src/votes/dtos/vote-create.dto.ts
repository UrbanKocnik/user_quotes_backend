import { IsNotEmpty } from "class-validator"

export class VoteCreateDto{
    @IsNotEmpty()
    rating: boolean
    user_id: number
    quote_id: number
}