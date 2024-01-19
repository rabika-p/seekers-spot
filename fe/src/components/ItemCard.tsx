import { Link } from "react-router-dom";

import { BiUser, BiTimeFive } from "react-icons/bi";

import Tags from "./Tags";
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

interface IItem {
  _id: string;
  itemName: string;
  confirmPassword: string;
  date: Date;
  location: string;
  description: string;
  keywords: string;
  images: Array<String>;
  postedBy: {
    username: string;
  };
}

interface IItemCardProps {
  item: IItem;
  tags: string;
  itemType: string;
  onTagClick: (tag: string) => void;
}

const ItemCard = (props: IItemCardProps) => {

  const { item, tags, itemType, onTagClick } = props;

  const lostTime: Date = new Date(item.date);
  const currentTime: Date = new Date();

  //calculate time difference in milliseconds
  const timeDifference = currentTime.getTime() - lostTime.getTime();
  // convert milliseconds to minutes
  const minutesAgo = Math.floor(timeDifference / (1000 * 60));
  // convert to hours and days respectively
  const hoursAgo = Math.floor(minutesAgo / 60);
  const daysAgo = Math.floor(hoursAgo / 24);

  const imageCount = item.images.length ;

  //assign appropriate time unit (mins/hrs/days) based on calculation
  let timeAgo = "";
  if (daysAgo >= 2) {
    timeAgo = `${daysAgo} days ago`;
  } else if (daysAgo === 1) {
    timeAgo = `1 day ago`;
  } else if (daysAgo < 1) {
    timeAgo = `Today`;
  }

  return (
    <div className="flex flex-col justify-between p-4 shadow-md overflow-hidden bg-white w-full h-[420px]">
      <div className="flex flex-col h-full w-full">
      <div className="w-full h-[200px]">
          {imageCount > 0 ? (
            <div
              className={`w-full bg-gray-50 flex h-full overflow-auto
             ${
               item.images.length === 1
                 ? "overflow-hidden justify-center items-center"
                 : ""
             } overflow-y-hidden 
             scrollbar-thin scrollbar-thumb-[#6c92ea] scrollbar-track-[#92B2FC]`}
            >
              {item.images.map((image, idx) => (
                // <a
                //   data-lightbox={`image ${item._id}`}
                //   href={`http://localhost:8080/images/${image}`}
                //   className=""
                // >
                <img
                  key={idx}
                  src={`http://localhost:8080/images/${image}`}
                  alt="Item Image"
                  className={`object-cover h-full aspect-w-1 aspect-h-1 hover:scale-105 p-1`}
                />
                // </a>
              ))}
            </div>
          ) : (
            <div className="h-full w-full flex justify-center bg-gray-50">
              <img
                src="../src/assets/images/noimage.jpg"
                alt="Company Logo"
                className="object-cover h-full aspect-w-1 aspect-h-1"
              />
            </div>
          )} 
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <h3 className="text-2xl">{item.itemName}</h3>
          <h6 className="text-sm overflow-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-[#9988DD] scrollbar-track-[#92B2FC]`">
            <Tags tags={tags} onTagClick={onTagClick} />
          </h6>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-500">
              <BiUser />
              <p> {item.postedBy.username}</p>
            </div>

            <div className="flex items-center text-gray-500">
              <BiTimeFive />
              <p className="ml-1"> {timeAgo} </p>
            </div>
          </div>

          <p className="">{item.description}</p>
        </div>
      </div>
      <div
        className={`flex justify-end 
        }`}
      >
        <Link
          to={`/${itemType}-item/${item._id}`}
          className="flex items-center text-sm bg-[#9988DD] hover:bg-[#8566ff] text-white rounded p-2"
        >
          View Details
        </Link>
      </div> 
    </div>
  );
};

export default ItemCard;