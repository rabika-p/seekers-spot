import { useEffect, useState } from "react";
import { useLocation, useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import { RiDeleteBin7Line } from "react-icons/ri";
import { HiPencil } from "react-icons/hi";
import { AiOutlineClose, AiOutlineInfoCircle } from "react-icons/ai";
import { TiTick } from "react-icons/ti";
import { FaSearch } from "react-icons/fa";

import Loading from "../components/Loading";
import ProtectedRoute from "../components/ProtectedRoute";
import Card from "./Card";
import TitleSection from "../components/TitleSection";
import Tags from "../components/Tags";
import ItemMatchModal from "../components/ItemMatchModal";

interface IItem {
  _id: string;
  itemName: string;
  date: Date;
  description: string;
  category: string;
  location: string;
  keywords: string;
  images: string[];
  postedBy: {
    fullname: string;
    _id: string;
  };
  status: string;
}

interface IMatch {
  matchId: string;
  matchStatus: string;
  itemData: IItem;
  lostItemId: string;
  foundItemId: string;
}

type ItemsType = "lost" | "found";

const ItemDetails = ({ itemType }: { itemType: ItemsType }) => {
  const [item, setItem] = useState<IItem | null>(null);
  const [matches, setMatches] = useState<IMatch[] | null>(null);

  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");
  const endpoint = itemType === "lost" ? "lost-items" : "found-items";

  const [searchName, setSearchName] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("recent");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filteredMatches, setFilteredMatches] = useState<IMatch[] | null>(null);

  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const viewEndpoint = itemType === "found" ? "lost" : "found";

  let type: string = "";
  let itemId: string = "";

  if (pathname.includes("found-item")) {
    type = "found";
    itemId = pathname.split("/found-item/")[1];
  } else if (pathname.includes("lost-item")) {
    type = "lost";
    itemId = pathname.split("/lost-item/")[1];
  }

  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/${endpoint}/${id}`, config)
      .then((res) => {
        setItem(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [id]);

  useEffect(() => {
    getMatchData();
  }, [accessToken, type, itemId]);

  const getMatchData = () => {
    setLoading(true);
    axios
      .get(
        `http://localhost:8080/api/matches/?itemType=${type}&itemId=${itemId}`,
        config
      )
      .then((response) => {
        setMatches(response.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (matches) {
      let filteredMatches = [...matches];

      if (selectedFilter === "recent") {
        filteredMatches = filteredMatches.sort(
          (matchA, matchB) =>
            new Date(matchB.itemData.date).getTime() -
            new Date(matchA.itemData.date).getTime()
        );
      } else if (selectedFilter === "oldest") {
        filteredMatches = filteredMatches.sort(
          (matchA, matchB) =>
            new Date(matchA.itemData.date).getTime() -
            new Date(matchB.itemData.date).getTime()
        );
      }

      if (searchName.trim() !== "") {
        filteredMatches = filteredMatches.filter((match) =>
          match.itemData.itemName
            .toLowerCase()
            .includes(searchName.toLowerCase())
        );
      }

      if (selectedCategory) {
        filteredMatches = filteredMatches.filter(
          (item) => item.itemData.category === selectedCategory
        );
      }

      if (selectedStatus) {
        filteredMatches = filteredMatches.filter(
          (match) => match.matchStatus === selectedStatus
        );
      }

      setFilteredMatches(filteredMatches);
    }
  }, [selectedFilter, searchName, selectedCategory, selectedStatus, matches]);

  // Function to delete a lost item
  const handleItemDeletion = () => {
    axios
      .delete(`http://localhost:8080/api/${endpoint}/${id}`, config)
      .then((res) => {
        //   setItem((prevItems) =>
        //   prevItems?.filter((item:any) => item._id !== itemId)
        // );
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
        navigate(-1);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Function to delete a match request
  const handleMatchDeletion = (matchId: string) => {
    axios
      .delete(`http://localhost:8080/api/matches/${matchId}`, config)
      .then((res) => {
        //   setMatches((prevMatches) =>
        //   prevMatches.filter((match) => match.matchId !== matchId)
        // );
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

  // Function to update a match request status
  const handleMatchStatusUpdate = (match: IMatch, status: string) => {
    const requestBody = { status };

    if (status === "Matched") {
      updateLostItemStatus(match.lostItemId, "Matched");
      updateFoundItemStatus(match.foundItemId, "Matched");
    }

    axios
      .patch(
        `http://localhost:8080/api/matches/${match.matchId}`,
        requestBody,
        config
      )
      .then((res) => {
        getMatchData();
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

  const updateLostItemStatus = (lostItemId: string, status: string) => {
    const url = `http://localhost:8080/api/lost-items/${lostItemId}`;
    const requestBody = { status };

    axios.patch(url, requestBody, config).catch((error) => {
      console.error(error);
    });
  };

  const updateFoundItemStatus = (foundItemId: string, status: string) => {
    const url = `http://localhost:8080/api/found-items/${foundItemId}`;
    const requestBody = { status };
    console.log(foundItemId);

    axios.patch(url, requestBody, config).catch((error) => {
      console.error(error);
    });
  };

  if (!item) {
    return <Loading />;
  }
  const imageCount = item.images.length;
  return (
    <ProtectedRoute isAuthenticated={!!accessToken}>
      <TitleSection
        title={`${itemType === "lost" ? "Lost" : "Found"} Item Details`}
      />
      <Card>
        <div className="flex px-5 justify-between w-ful">
          <div className="w-3/5">
            {imageCount > 0 ? (
              <div
                className={`${
                  imageCount === 1
                    ? "w-full"
                    : imageCount === 2
                    ? "flex gap-4"
                    : "grid grid-cols-1 md:grid-cols-3 gap-4"
                }`}
              >
                {item.images.map((image, idx) => (
                  <img
                    key={idx}
                    src={`http://localhost:8080/images/${image}`}
                    alt={`Item Image ${idx}`}
                    className={`w-full rounded-lg ${
                      imageCount > 6 ? "h-40" : "h-auto"
                    }`}
                  />
                ))}
              </div>
            ) : (
              <div className="flex justify-center bg-gray-100">
                <img
                  src="../src/assets/images/noimage.jpg"
                  alt={`Item Image `}
                  className="max-w-full rounded-lg h-[400px]"
                />
              </div>
            )}
          </div>
          <div className="pl-5 flex flex-col gap-4 w-2/5">
            <div className="flex justify-between w-full">
              <div>
                <h1 className="text-3xl font-bold">{item.itemName}</h1>
                <div className=" text-gray-500">
                  <p>Lost on {new Date(item.date).toDateString()}</p>
                </div>
              </div>

              <div>
                {item.postedBy._id === userId && item.status !== "Matched" && (
                  <div className="flex items-center gap-2">
                    {itemType === "lost" ? (
                      <Link to={`/edit-lost-item/${id}`}>
                        <button className="bg-[#8c86e8] text-white hover:bg-[#7a66d3] px-2 py-2 rounded-md">
                          <HiPencil className="text-xl" />
                        </button>
                      </Link>
                    ) : (
                      <Link to={`/edit-found-item/${id}`}>
                        <button className="bg-[#8c86e8] text-white hover-bg-[#7a66d3] px-2 py-2 rounded-md">
                          <HiPencil className="text-xl" />
                        </button>
                      </Link>
                    )}
                    <button
                      className="bg-[#e66b7a] hover:bg-[#e35969] text-white px-2 py-2 rounded-md"
                      onClick={handleItemDeletion}
                    >
                      <RiDeleteBin7Line className="text-xl" />
                    </button>
                  </div>
                )}
                {itemType === "found" && item.postedBy._id !== userId && (
                  <ItemMatchModal
                    foundItemName={item.itemName}
                    foundItemId={item._id}
                    status={item.status}
                  ></ItemMatchModal>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold">Description</h2>
              <p>{item.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold">Lost Location</h2>
              <p>{item.location}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold">Keywords</h2>
              <Tags tags={item.keywords} hoverEffect={false} />
            </div>

            <div>
              <h2 className="text-xl font-semibold">Posted By</h2>
              {item.postedBy.fullname}
            </div>
          </div>
        </div>
      </Card>
      {
        // if item has matches and user logged in
      }
      {loading ? (
        <Loading />
      ) : (
        <>
          {item.postedBy._id === userId && matches && (
            <>
              <TitleSection
                title={`${
                  itemType === "lost" ? "Claims Requested" : "Claims Received"
                }`}
              />
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
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="rounded-md p-2 border border-gray-300"
                    >
                      <option value="">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Acknowledged">Acknowledged</option>
                      <option value="Matched">Matched</option>
                      <option value="Rejected">Rejected</option>
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
                        <th className="pl-4"> Item Name</th>
                        <th> Category</th>
                        <th>
                          {`${itemType === "found" ? "Lost" : "Found"} Date`}
                        </th>
                        <th>{`${
                          itemType === "found" ? "Lost" : "Found"
                        } Location`}</th>
                        <th> Name</th>
                        <th> Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`bg-white `}>
                      {filteredMatches && filteredMatches.length > 0 ? (
                        filteredMatches.map((match: IMatch, i) => (
                          <tr
                            key={match.matchId}
                            className={`${i % 2 === 1 && "bg-gray-50"}`}
                          >
                            <td>
                              <Link
                                to={`/${
                                  itemType === "lost" ? "found" : "lost"
                                }-item/${match.itemData._id}`}
                                className=" hover:underline pl-4"
                              >
                                {match.itemData.itemName}
                              </Link>
                            </td>
                            <td>
                              <span>{match.itemData.category}</span>
                            </td>
                            <td>
                              {new Date(
                                match.itemData.date
                              ).toLocaleDateString()}
                            </td>
                            <td>{match.itemData.location}</td>
                            <td>{match.itemData.postedBy.fullname}</td>
                            <td>{match.matchStatus}</td>
                            <td className="space-x-2 py-2">
                              <div className="flex space-x-2">
                                {/* Match action button */}
                                {/* status = pending & itemType = found -> Acknowledge */}
                                {/* status = acknowledged & itemType = found -> Matched */}
                                {/* update status of related lost/found items to matched */}

                                {((match.matchStatus === "Pending" &&
                                  itemType === "found") ||
                                  (match.matchStatus === "Acknowledged" &&
                                    itemType === "lost")) && (
                                  <button
                                    className="bg-[#59e7ae] hover:bg-[#15e994] text-white px-2 py-1.5 rounded-md"
                                    onClick={() => {
                                      handleMatchStatusUpdate(
                                        match,
                                        itemType === "found"
                                          ? "Acknowledged"
                                          : "Matched"
                                      );
                                    }}
                                  >
                                    <TiTick className="text-base" />
                                  </button>
                                )}

                                {/* Cancel match action button (specific to lost items) */}
                                {/* status = acknowledged, user can reject the match -> Rejected */}
                                {/* status != matched/rejected, user can delete the match-> Deleted from matches */}
                                {itemType == "lost" &&
                                  match.matchStatus !== "Matched" &&
                                  match.matchStatus !== "Rejected" && (
                                    <button
                                      className="bg-[#e66b7a] hover:bg-[#e35969] text-white px-2 py-1.5 rounded-md"
                                      onClick={() => {
                                        match.matchStatus === "Acknowledged"
                                          ? handleMatchStatusUpdate(
                                              match,
                                              "Rejected"
                                            )
                                          : handleMatchDeletion(match.matchId);
                                      }}
                                    >
                                      {match.matchStatus === "Acknowledged" ? (
                                        <AiOutlineClose className="text-base" />
                                      ) : (
                                        <RiDeleteBin7Line className="text-base" />
                                      )}
                                    </button>
                                  )}
                                <Link
                                  to={`/${viewEndpoint}-item/${match.itemData._id}`}
                                >
                                  <button className="bg-[#4d82d1] text-white hover:bg-[#3371ce] px-2 py-1.5 rounded-md">
                                    <AiOutlineInfoCircle className="text-base" />
                                  </button>
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={8}
                            className="text-center pt-3 text-gray-400"
                          >
                            ---No Claims yet---
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}
        </>
      )}

      <ToastContainer />
    </ProtectedRoute>
  );
};

export default ItemDetails;
