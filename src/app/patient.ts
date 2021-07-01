import { Byte } from "@angular/compiler/src/util";
import { Comment } from "./comment";

export interface Patient{
    id : number,
    firstName : string,
    lastName : string,
    dateOfBirth : Date,
    sex : string,
    country : string,
    state : string,
    address : string,
    years : Byte,
    comments : Array<Comment>
}