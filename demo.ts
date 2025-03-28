import { create } from "domain"

type response = {
    success: boolean,
    message: string,
    data: any,
    errors: { path: string, message: string }[],
    timestamp: string
}



// read = 1
// create = 2
// update = 3
// delete = 4
// no assces = 0

// read and delete = 14
// read and create = 12
// read and update = 13
// read and create, update = 123
// read and create, update, delete = 1234

// type access = {
//     name:string,
//     slug:string,
//     access:number,
// }