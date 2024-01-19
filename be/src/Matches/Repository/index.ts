import { IMatch } from "./Match.types";

const Match = require("../Model/");
const FoundItem = require("../../FoundItems/Model/");
const LostItem = require("../../LostItems/Model/");

// Add a new match
export async function addMatch(match: IMatch) {
  try {
    const { foundItemId, lostItemId } = match;
    //get user who posted the foundItem
    const foundItemIdString = foundItemId.toString();
    const requestedTo = await getFoundItemPostedBy(foundItemIdString);
    match.requestedTo = requestedTo;

    //check if matching record already exists with the lostItemId and foundItemId
    const existingRecord = await Match.find({ lostItemId, foundItemId });

    //cannot send claim request for the same item twice 
    if (existingRecord.length > 0) {
      const err = {
        message: "Claim already exists to selected item",
      };
      return { err };
    } else {
      const result = await Match.create(match);
      // console.log(result);
      return { message: "Match request sent successfully", result };
    }
  } catch (error) {
    console.log(error);
  }
}

// Get match requests of a logged-in user for their lost/found items
export const getMatchesByUser = async (itemType: string, userId: string) => {
  try {
    let matches = [];
    
    if (itemType === "lost") {
      // Look for matching found items requested by user
      matches= await Match.find({ requestedBy: userId }).populate({
      //populate found and lost item id 
      path: 'foundItemId',
      populate: {
        //path = field in original document (ref users)
        path: 'postedBy',
        //specify which fields to include in query result
        select: 'fullname email'
      }
    }).populate({
      path: 'lostItemId',
      populate: {
        path: 'postedBy',
        select: 'fullname email'
      }
    })
    } else if (itemType === "found") {
       matches= await Match.find({ requestedTo: userId }) .populate({
        path: 'lostItemId',
        populate: {
          path: 'postedBy',
          select: 'fullname email'
        }
      }).populate({
        path: 'foundItemId',
        populate: {
          path: 'postedBy',
          select: 'fullname email'
        }
      })
    } else {
      console.log("Invalid itemType");
    }
    return matches;
  } catch (e) {
    console.log(e);
  }
};

// Get all matches
export const getMatches = async (itemType: string, itemId: string) => {
  try {
    let matchedItems = [];

    if (itemType === "lost") {
      // Look for matching found items
      const matches = await Match.find({ lostItemId: itemId });

      if (matches) {
        //iterate through matches
        for (const match of matches) {
          //retrieve info about found item associated with the match
          const itemData = await FoundItem.findOne({
            _id: match.foundItemId,
            //fullname of user that posted the item
          }).populate("postedBy", "fullname");
          //push data into matchedItems array
          matchedItems.push({
            matchId: match._id,
            matchStatus: match.status,
            lostItemId: match.lostItemId,
            foundItemId: match.foundItemId,
            //foundItemId, fullname
            itemData,
          });
        }
      }
    } else if (itemType === "found") {
      // Look for matching lost items.
      const matches = await Match.find({ foundItemId: itemId });

      if (matches) {
        for (const match of matches) {
          const itemData = await LostItem.findOne({
            _id: match.lostItemId,
          }).populate("postedBy", "fullname");
          matchedItems.push({
            matchId: match._id,
            matchStatus: match.status,
            lostItemId: match.lostItemId,
            foundItemId: match.foundItemId,
            itemData,
          });
        }
      }
    } else {
      console.log("Invalid itemType");
    }

    return matchedItems;
  } catch (e) {
    console.log(e);
  }
};

// Get id of the user that posted an item they found
export const getFoundItemPostedBy = async (foundItemId: string) => {
  try {
    const foundItem = await FoundItem.findById(foundItemId).select("postedBy");
    return foundItem.postedBy._id;
  } catch (e) {
    console.log(e);
  }
};

// Delete a match
export const deleteMatch = async (matchId: string) => {
  try {
    const result = Match.findByIdAndRemove(matchId).exec();
    return { message: "Match request cancelled successfully", result };
  } catch (e) {
    console.log(e);
  }
};

// Update status of a match
export const updateStatus = async (matchId: string, status: string) => {
  try {
    const updatedMatch = await Match.findOneAndUpdate(
      { _id: matchId },
      { status },
      { new: true }
    );

    if (status === "Matched") {
      const getMatch = await Match.findOne({ _id: matchId });

      if (getMatch) {
        //get associated lost and found item ids from the match
        const lostItemId = getMatch.lostItemId;
        const foundItemId = getMatch.foundItemId;

        // update the status of all related matches to rejected after approval
        await Match.updateMany(
          {
            //ne matched = pending matches
            $or: [
              { lostItemId, status: { $ne: "Matched" } },
              { foundItemId, status: { $ne: "Matched" } }
            ]
          },
          { $set: { status: "Rejected" } }
        );
      }
    }

    return {
      message: "Match request status updated successfully",
      updatedMatch,
    };
  } catch (e) {
    console.log(e);
  }
};