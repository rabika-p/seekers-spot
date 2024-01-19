import { Request, Response } from "express";

import * as MatchService from "../Service";

// Add a new match
export const addMatch = async (req: Request, res: Response) => {
  try {
    const matchData = req.body;
    const match = await MatchService.addMatch(matchData);

    res.status(201).json(match);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create a new match" });
  }
};

// Get match requests of a logged-in user for their lost/found items
export const getMatchesByUser = async (req: Request, res: Response) => {
  try {
    const itemType = req.query.itemType as string; 
    const userId = req.query.userId as string;
    const matches = await MatchService.getMatchesByUser(itemType, userId);
    res.status(200).json(matches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve matches" });
  }
};

// Get all matches
export const getMatches = async (req: Request, res: Response) => {
  try {
    const itemType = req.query.itemType as string; 
    const itemId = req.query.itemId as string;
    const matches = await MatchService.getMatches(itemType, itemId);
    res.status(200).json(matches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve matches" });
  }
};


// Delete a match
export const deleteMatch = async (req: Request, res: Response) => {
  try {
    const matchId = req.params.matchId;
    const matches = await MatchService.deleteMatch(matchId);
    res.status(200).json(matches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete match" });
  }
};

// Update status of a match
export const updateStatus = async (req: Request, res: Response) => {
  try {
    const matchId = req.params.matchId;
    const status = req.body.status;

    const match = await MatchService.updateStatus(matchId, status);
    res.status(200).json(match);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update match" });
  }
};