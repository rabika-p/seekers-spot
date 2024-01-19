import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import { FaSearch } from "react-icons/fa";

import TitleSection from "../components/TitleSection";
import ItemCard from "../components/ItemCard";
import Loading from "../components/Loading";
import ProtectedRoute from "../components/ProtectedRoute";

interface IItem {
  _id: string;
  itemName: string;
  category: string;
  confirmPassword: string;
  date: Date;
  location: string;
  description: string;
  keywords: string;
  images: Array<string>;
  status: string;
  postedBy: {
    username: string;
    _id: string;
  };
}
type ItemsType = "lost" | "found";

const ItemsListing = ({ itemType }: { itemType: ItemsType }) => {
  const [items, setItems] = useState<IItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("recent");
  const [filteredItems, setFilteredItems] = useState<IItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const accessToken = localStorage.getItem("accessToken");

  const endpoint = itemType === "lost" ? "lost-items" : "found-items";

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/${endpoint}`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then((res) => {
        setItems(res.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        // setLoading(false);
      });
  }, [accessToken, endpoint]);

  useEffect(() => {
    //create a copy of array so original data is not modified
    let filteredItems = [...items];
    //only display items that have matching category as the selected
    if (selectedCategory) {
      filteredItems = filteredItems.filter(
        (item) => item.category === selectedCategory
      );
    }
    if (selectedFilter === "recent") {
      filteredItems = filteredItems.sort(
        (itemA, itemB) =>
          new Date(itemB.date).getTime() - new Date(itemA.date).getTime()
      );
    } else if (selectedFilter === "oldest") {
      filteredItems = filteredItems.sort(
        (itemA, itemB) =>
          new Date(itemA.date).getTime() - new Date(itemB.date).getTime()
      );
    }

    if (searchName.trim() !== "") {
      filteredItems = filteredItems.filter((item) =>
        item.itemName.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (selectedTags.length > 0) {
      filteredItems = filteredItems.filter((item) => {
        //keywords are separated by , in database 
        //trim trailing/leading spaces
        const individualTags = item.keywords
          .toLowerCase()
          .split(",")
          .map((tag) => tag.trim());
          //return items that include all selected tags
        return selectedTags
          .map((tag) => tag.toLowerCase())
          .every((tag) => individualTags.includes(tag));
      });
    }

    setFilteredItems(filteredItems);
  }, [selectedFilter, searchName, items, selectedCategory, selectedTags]);

  const handleTagClick = (tag: string) => {
    //check if tag is already included in selected tags
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((selectedTag) => selectedTag !== tag));
  };

  return (
    <ProtectedRoute isAuthenticated={!!accessToken}>
      <>
        <TitleSection
          title={`${itemType === "lost" ? "Lost" : "Found"} Items Listing`}
        />
        {loading ? (
          <div>
            <Loading />
          </div>
        ) : (
          <div className="py-1 px-5">
            <div className="flex justify-between lg:flex-row md:flex-col lg:space-x-4 md:space-x-2 py-2">
              <div className="flex items-center space-x-2 md:mb-2 ">
                <label>Filter by:</label>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="rounded-md p-2 border border-gray-300"
                >
                  <option value="recent">Most Recent</option>
                  <option value="oldest">Oldest First</option>
                </select>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-md p-2 border border-gray-300"
                >
                  <option value="">All Categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Jewelery">Jewelery</option>
                  <option value="Wallet">Wallet</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex items-center lg:space-x-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="rounded-md p-2 lg:w-96 md:w-full border border-gray-300 pl-10"
                  />
                  <div className="absolute left-3 top-3 text-[#917be8]">
                    <FaSearch />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-2 py-2">
              <div className="flex space-x-2">
                {selectedTags.map((tag, index) => (
                  <div
                    key={index}
                    className={`bg-[#9988DD] text-white rounded-xl py-1 px-3 text-xs mt-2 cursor-pointer items-center`}
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag}
                    <span className="ml-1 text-[#ff6b6b] cursor-pointer">
                      x
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-4 md:grid-cols-1 sm:grid-cols-1">
              {filteredItems
                .filter((item) => item.status !== "Matched")
                .map((item: IItem, idx: number) => (
                  <ItemCard
                    key={idx}
                    item={item}
                    tags={item.keywords}
                    itemType={itemType}
                    onTagClick={handleTagClick}
                  />
                ))}
            </div>
          </div>
        )}
      </>
    </ProtectedRoute>
  );
};

export default ItemsListing;
