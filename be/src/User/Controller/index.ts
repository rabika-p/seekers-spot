import {Request, Response } from "express";
import * as UserService from "../Service";

//Code for user onboarding process

export const createAuthenticatedUser = async (req: Request, res: Response) => {
  try {
    res.status(201).json(await UserService.createAuthenticatedUser({ ...req.body }));
  } 
  catch (e) {
    res.status(400).json(e);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = await UserService.login({ ...req.body })
    res.status(200).json(data);
  } 
  catch (e) {
    res.status(401).json(e);
  }
};

export const forgotPsw = async (req: Request, res: Response) => {
  try {

    const result = await UserService.forgotPsw({ ...req.body });
    res.status(200).json(result);
    
  } 
  catch (e) {
    res.status(500).json(e);
  }
}


export const resetPsw = async (req: Request, res: Response) => {
  const { password } = req.body;
  try {
    const result = await UserService.resetPsw(password, req.user);
    res.status(200).json(result);
  } 
  catch (e) {
    res.status(500).json(e);
  }
}