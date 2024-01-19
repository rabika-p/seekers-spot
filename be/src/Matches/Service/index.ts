import * as MatchRepository from "../Repository";
import { IMatch } from "../Repository/Match.types";

// Add a new match
export const addMatch = async (match: IMatch) => {
  try {
    return await MatchRepository.addMatch(match);
  } catch (error) {
    console.log(error);
  }
};

// Get match requests of a logged-in user for lost/found items
export const getMatchesByUser = async (itemType: string, userId: string) => {
  try {
    const matches = await MatchRepository.getMatchesByUser(itemType, userId);
    return matches;
  } catch (error) {
    console.log(error);
  }
};

// Get all matches
export const getMatches = async (itemType: string, itemId: string) => {
  try {
    const matches = await MatchRepository.getMatches(itemType, itemId);
    return matches;
  } catch (error) {
    console.log(error);
  }
};


// Delete a match
export const deleteMatch = async (matchId: string) => {
  try {
    const deletedMatch = await MatchRepository.deleteMatch(matchId);
    return deletedMatch;
  } catch (error) {
    console.log(error);
  }
};

// Update status of a match 
export const updateStatus = async (matchId: string, status: string) => {
  try {
    const updatedMatch = await MatchRepository.updateStatus(matchId, status);
    return updatedMatch;
  } catch (error) {
    console.log(error);
  }
};

