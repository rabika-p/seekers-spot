import * as UserRepository from "../Repository";
import { IUser } from "../Repository/User.types";
import nodemailer from "nodemailer";
import bcrypt from 'bcrypt';

//to import JSON web token for authentication
const jwt = require("jsonwebtoken");

//Code for user onboarding process
export const createAuthenticatedUser = async (user: IUser) => {
  try {
    const saltRounds = 10;
    //generate a salt
    const salt = bcrypt.genSaltSync(saltRounds);
    //take password and salt to produce a hashed password
    const hashedPassword = bcrypt.hashSync(user.password, salt);

    const userWithPswHash = {
      ...user,
      password: hashedPassword,
    };
    return await UserRepository.createAuthenticatedUser(userWithPswHash);
  } catch (error) {
    console.log(error);
  }
};

export const login = async (user: IUser) => {
  try {
    //checkAuth returns login message, accessToken and role of the user that is trying to log in
    const checkAuth = await UserRepository.login(user);
    if (checkAuth?.success) {
      //sign token with payload and secret key
      const accessToken = jwt.sign(checkAuth, process.env.ACCESS_TOKEN_SECRET);
      const response = {
        message: checkAuth.message,
        accessToken: accessToken,
        username: checkAuth.username,
        userId: checkAuth.userId
      };

      return response;  
    } 
    else {
      const err = {
        message: "Login not successful",
        status: 401,
      };
      return { err };
    }
  } catch (error) {
    console.log(error);
  }
};

export const forgotPsw = async (user: IUser) => {
  try {
    const { email } = user;
    const checkUser = await UserRepository.forgotPsw(user);
    if (checkUser?.success) {
      //generate token with user's email as payload  
      const resetToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '1h' });
      // const resetToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET);

      const resetTokenLink = `http://localhost:5173/reset-password?token=${resetToken}`;

      if (email) {
        await sendResetEmail(email, resetTokenLink);
      }

      return { message: "Password reset email sent.", success: true };
    } else {
      const err = {
        message: "User account does not exist",
        status: 401,
      };
      return { err };
    }
  } catch (e) {
    console.error(e);
  }
};

export const resetPsw = async (password: string, decoded: any) => {
  try {
    //extract email from decoded JWT
    const userEmail = decoded.email;

    const checkUser = await UserRepository.getUserByEmail(userEmail);

    if (checkUser) {
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
  
      const hashedPassword = bcrypt.hashSync(password, salt);
  
      const result = await UserRepository.resetPsw(userEmail, hashedPassword);
      return { message: "Password has been reset successfuly", success: true };
    } 
    else {
      const err = {
        message: "Password reset unsucessful!",
        status: 401,
      };
      return { err };
    }
  } catch (e) {
    console.error(e);
  }
};

//send email with link to reset password
async function sendResetEmail(email: string, resetTokenLink: string) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PSW,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Password Reset",
    text: `Click the following link to reset your password: ${resetTokenLink}`,
  };

  await transporter.sendMail(mailOptions);
}
