import { ObjectId } from "mongodb";

export interface IUser {
  _id: string;
  fullname: string;
  email: string;
  username: string;
  password: string;
  // phone_number: string;
  // profile_picture:string
}

