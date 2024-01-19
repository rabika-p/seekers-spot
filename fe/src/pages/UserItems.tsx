import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { AiOutlineInfoCircle } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import { RiDeleteBin7Line } from "react-icons/ri";
import { HiPencil } from "react-icons/hi";
import { FaSearch } from "react-icons/fa";
import Loading from "../components/Loading";

import ProtectedRoute from "../components/ProtectedRoute";
import Card from "./Card";
import TitleSection from "../components/TitleSection";

interface IItem {
  _id: string;
  itemName: string;
  date: Date;
  description: string;
  location: string;
  category: string;
  keywords: string;
  status: string;
}

type ItemType = "lost" | "found";

const UserItems = ({ itemType }: { itemType: ItemType }) => {
  const accessToken = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");

  const [items, setItems] = useState<IItem[]>([]);
  const [searchName, setSearchName] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("recent");
  const [filteredItems, setFilteredItems] = useState<IItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const endpoint = itemType === "lost" ? "lost-items" : "found-items";

  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/api/${endpoint}/user?userId=${userId}`,
        config
      )
      .then((response) => {
        setItems(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [accessToken, items]);

  const handleItemDeletion = (itemId: string) => {
    axios
      .delete(`http://localhost:8080/api/${endpoint}/${itemId}`, config)
      .then((res) => {
        setItems((prevItems) =>
          prevItems.filter((item) => item._id !== itemId)
        );

        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    // Create a copy of the array so the original data is not modified
    let filteredItems = [...items];

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

    if (selectedCategory) {
      filteredItems = filteredItems.filter(
        (item) => item.category === selectedCategory
      );
    }

    setFilteredItems(filteredItems);
  }, [selectedFilter, searchName, items, selectedCategory]);

  return (
    <ProtectedRoute isAuthenticated={!!accessToken}>
      <TitleSection
        title={`My ${itemType === "lost" ? "Lost" : "Found"} Items`}
      />
      <div className="w-full overflow-x-auto">
        {loading ? (
          <Loading />
        ) : (
          <Card>
            <div className="flex justify-between space-x-4 px-4 pb-4">
              <div className="flex items-center space-x-2">
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

              <div className="flex items-center space-x-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="rounded-md p-2 w-96 border border-gray-300 pl-10"
                  />
                  <div className="absolute left-3 top-3 text-[#917be8]">
                    <FaSearch />
                  </div>
                </div>
              </div>
            </div>
            <div className="px-3">
              <table className="min-w-full divide-y divide-gray-200 ">
                <thead className="bg-[#F3F4F6] text-gray-600 ">
                  <tr className="text-xs font-semibold h-10 text-left">
                    {/* <th className="pl-4">SN</th> */}
                    <th className="pl-4"> Item Name</th>
                    <th> Category</th>
                    <th> {`${itemType === "lost" ? "Lost" : "Found"} Date`}</th>
                    <th>
                      {`${itemType === "lost" ? "Lost" : "Found"} Location`}
                    </th>
                    <th> Keywords</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className={`bg-white `}>
                  {filteredItems.map((item: IItem, i) => (
                    <tr key={i} className={`${i % 2 === 1 && "bg-gray-50"}`}>
                      {/* <td className=" pl-4">
                        <span>code {i + 1}</span>
                      </td> */}

                      <td>
                        <Link
                          to={`/${itemType}-item/${item._id}`}
                          className=" hover:underline pl-4"
                        >
                          {item.itemName}
                        </Link>
                      </td>
                      <td>
                        <span>{item.category}</span>
                      </td>
                      <td>{new Date(item.date).toLocaleDateString()}</td>
                      <td>{item.location}</td>
                      <td>{item.keywords}</td>

                      <td className="space-x-2 py-2 ">
                        {item.status !== "Matched" && (
                          <>
                            <Link to={`/edit-${itemType}-item/${item._id}`}>
                              <button className="bg-[#8c86e8] text-white hover:bg-[#7a66d3] px-2 py-1.5 rounded-md">
                                <HiPencil className="text-base" />
                                {/* <span className="opacity text-black bg-white text-xs absolute rounded-md py-1 px-2 group-hover:opacity-100 group-hover:translate-y-0 ease-in-out">
                              Edit
                            </span> */}
                              </button>
                            </Link>
                            <button
                              className="bg-[#e66b7a] hover:bg-[#e35969] text-white px-2 py-1.5 rounded-md"
                              onClick={() => handleItemDeletion(item._id)}
                            >
                              <RiDeleteBin7Line className="text-base" />
                            </button>
                          </>
                        )}
                        <Link to={`/${itemType}-item/${item._id}`}>
                          <button className="bg-[#8c86e8] text-white hover:bg-[#7a66d3] px-2 py-1.5 rounded-md">
                            <AiOutlineInfoCircle className="text-base" />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
      <ToastContainer />
    </ProtectedRoute>
  );
};

export default UserItems;
