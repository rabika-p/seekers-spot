import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { RiDeleteBin7Line } from "react-icons/ri";
import Loading from "../components/Loading";
import ProtectedRoute from "../components/ProtectedRoute";
import Card from "./Card";
import TitleSection from "../components/TitleSection";
import { AiOutlineClose, AiOutlineInfoCircle } from "react-icons/ai";
import { TiTick } from "react-icons/ti";
import { FaSearch } from "react-icons/fa";

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
    email: string;
    _id: string;
  };
}

interface IMatch {
  _id: string;
  status: string;
  lostItemId: IItem;
  foundItemId: IItem;
}

type ItemsType = "lost" | "found";

const UserMatches = ({ itemType }: { itemType: ItemsType }) => {
  const [matches, setMatches] = useState<IMatch[] | null>(null);

  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");

  const [searchName, setSearchName] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("recent");

  // const [filteredItems, setFilteredItems] = useState<IItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filteredMatches, setFilteredMatches] = useState<IMatch[] | null>(null);

  const location = useLocation();
  const pathname = location.pathname;
  // const viewEndpoint = itemType === "found" ? "lost" : "found";
  const itemData = itemType === "found" ? "lostItemId" : "foundItemId";
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
  // useEffect(()=>{
  //   setLoading(true);
  // }, [type]);
  useEffect(() => {
    getMatchData();
  }, [accessToken, itemType]);

  const getMatchData = () => {
    setLoading(true);
    axios
      .get(
        `http://localhost:8080/api/matches/user?itemType=${type}&userId=${userId}`,
        config
      )
      .then((response) => {
        //lostItemId{itemName...}, foundItemId{itemName...}, reqBy, reqTo...
        setMatches(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (matches) {
      let filteredMatches = [...matches]; // Create a copy of the original data
      if (selectedFilter === "recent") {
        filteredMatches = filteredMatches.sort(
          (matchA, matchB) =>
            new Date(matchB[itemData].date).getTime() -
            new Date(matchA[itemData].date).getTime()
        );
      } else if (selectedFilter === "oldest") {
        filteredMatches = filteredMatches.sort(
          (matchA, matchB) =>
            new Date(matchA[itemData].date).getTime() -
            new Date(matchB[itemData].date).getTime()
        );
      }

      if (searchName.trim() !== "") {
        filteredMatches = filteredMatches.filter((match) =>
          match[itemData].itemName
            .toLowerCase()
            .includes(searchName.toLowerCase())
        );
      }

      if (selectedCategory) {
        filteredMatches = filteredMatches.filter(
          (item) => item[itemData].category === selectedCategory
        );
      }

      if (selectedStatus) {
        filteredMatches = filteredMatches.filter(
          (match) => match.status === selectedStatus
        );
      }
      setFilteredMatches(filteredMatches); // Update the filteredMatches state
    }
  }, [selectedFilter, searchName, selectedCategory, selectedStatus, matches]);

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
      updateLostItemStatus(match.lostItemId._id, "Matched");
      updateFoundItemStatus(match.foundItemId._id, "Matched");
    }

    axios
      .patch(
        `http://localhost:8080/api/matches/${match._id}`,
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

  if (!matches) {
    return <Loading />;
  }

  return (
    <ProtectedRoute isAuthenticated={!!accessToken}>
      <TitleSection
        title={`${
          itemType === "lost" ? "Claims Requested" : "Claims Received"
        }`}
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
              <table
                className="min-w-full divide-y divide-gray-200"
                style={{ tableLayout: "fixed" }}
              >
                <colgroup>
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "10%" }} />
                </colgroup>
                <thead className="bg-[#F3F4F6] text-gray-600">
                  <tr className="text-xs font-semibold h-10 text-left">
                    {/* <th className="pl-4">SN</th> */}
                    <th className="pl-4">Item Name</th>
                    <th>Category</th>
                    <th>{`${itemType === "found" ? "Lost" : "Found"} Date`}</th>
                    <th>{`${
                      itemType === "found" ? "Lost" : "Found"
                    } Location`}</th>
                    <th>Posted By</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredMatches && filteredMatches.length > 0 ? (
                    filteredMatches.map((match: IMatch, i) => (
                      <tr key={i} className={`${i % 2 === 1 && "bg-gray-50"}`}>
                        {/* <td className="pl-4">
          <span>code {i + 1}</span>
        </td> */}
                        <td>
                          <Link
                            to={`/${
                              itemType === "lost" ? "found" : "lost"
                            }-item/${match[itemData]._id}`}
                            className="hover:underline pl-4"
                          >
                            {match[itemData].itemName}
                          </Link>
                        </td>
                        <td>
                          <span>{match[itemData].category}</span>
                        </td>
                        <td>
                          {new Date(match[itemData].date).toLocaleDateString()}
                        </td>
                        <td>{match[itemData].location}</td>
                        <td>{match[itemData].postedBy.fullname}</td>
                        <td>{match[itemData].postedBy.email}</td>
                        <td>{match.status}</td>
                        <td className="space-x-2 py-2">
                          <div className="flex space-x-2">
                            {/* to update status to matched/acknowledged based on lost/found item */}
                            {((match.status === "Pending" &&
                              itemType === "found") ||
                              (match.status === "Acknowledged" &&
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

                            {itemType == "lost" &&
                              match.status !== "Matched" &&
                              match.status !== "Rejected" && (
                                <button
                                  className="bg-[#e66b7a] hover.bg-[#e35969] text-white px-2 py-1.5 rounded-md"
                                  onClick={() => {
                                    match.status === "Acknowledged"
                                      ? handleMatchStatusUpdate(
                                          match,
                                          "Rejected"
                                        )
                                      : handleMatchDeletion(match._id);
                                  }}
                                >
                                  {match.status === "Acknowledged" ? (
                                    <AiOutlineClose className="text-base" />
                                  ) : (
                                    <RiDeleteBin7Line className="text-base" />
                                  )}
                                </button>
                              )}
                            <Link
                              to={`/${itemType}-item/${
                                itemType === "lost"
                                  ? match.lostItemId._id
                                  : match.foundItemId._id
                              }`}
                            >
                              <button className="bg-[#4d82d1] text-white hover.bg-[#3371ce] px-2 py-1.5 rounded-md">
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
        )}
      </div>
      <ToastContainer />
    </ProtectedRoute>
  );
};

export default UserMatches;
