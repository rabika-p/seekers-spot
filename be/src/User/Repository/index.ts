import { ObjectId } from "mongodb";
import { IUser } from "./User.types";
import bcrypt from 'bcrypt';

const User = require('../Model/');

//Code for user onboarding process   

export async function createAuthenticatedUser(user: IUser) {
  try {
    const result = await User.create(user);
    return {message: "User created successfully", result};
  } catch (error) {
    console.log(error);
  }
}

export async function login(user: IUser) {
  try {
    const { username, password } = user;

    const userData = await User.findOne({ username });
    //compare plain text password with hashed password
    const passwordMatch = await bcrypt.compare(password, userData.password);
    
    if (userData && userData.username === username && passwordMatch) {      
          return {
            message: "User logged in successfully",
            success: true,
            username: username,
            userId: userData._id
          };
      } 

    else {
      // return { message: "Unauthorized login.", success: false };
      return {success: false };
    }
  } catch (e) {
    console.error(e);
  }
}

export async function forgotPsw(user: IUser) {
  try{
    const {email} = user;
    const userData = await User.findOne({email});
    if (userData && userData.email === email){
      return { message: "User account exists", success: true };
    }
    else{
      return { message: "User account does not exist", success: false };
    }
    
  }
  catch(e){
    console.log(e);
  }
};

export async function resetPsw(email:string, password:string) {
  try{
    const userData = await User.findOne({email});
    if (userData){

      await User.updateOne({ email }, { $set: { password: password } });
      return { message: "Password reset successful", success: true };
    }
    else{
      return { message: "User not found!", success: false };
    }
    
  }
  catch(e){
    console.log(e);
  }
};

export async function getUserByEmail(email:string) {
  const userData = await User.findOne({email});
  return userData;
}