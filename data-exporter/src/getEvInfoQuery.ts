import { Matches } from "class-validator";

export class GetEvInfoQuery {
    @Matches(/[a-zA-Z]+\d+/)
    vin: string;
}
