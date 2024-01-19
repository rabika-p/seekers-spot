import { useState, useEffect } from "react";
import axios from "axios";

import Loading from "../components/Loading";
import ProtectedRoute from "../components/ProtectedRoute";
import TitleSection from "../components/TitleSection";
import DashboardCard from "../components/DashboardCard";

import { TbReportAnalytics, TbReportSearch } from "react-icons/tb";
import {TbMailUp, TbMailDown} from "react-icons/tb";

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
  matchId: string;
  matchStatus: string;
  itemData: IItem;
  lostItemId: string;
  foundItemId: string;
}

const Dashboard = () => {
  const accessToken = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");

  const [lostItems, setLostItems] = useState<IItem[]>([]);
  const [foundItems, setFoundItems] = useState<IItem[]>([]);
  const [lostMatches, setLostMatches] = useState<IMatch[] | null>(null);
  const [foundMatches, setFoundMatches] = useState<IMatch[] | null>(null);
  const [loading, setLoading] = useState(true);

  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/lost-items/user?userId=${userId}`, config)
      .then((response) => {
        setLostItems(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get(
        `http://localhost:8080/api/found-items/user?userId=${userId}`,
        config
      )
      .then((response) => {
        setFoundItems(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get(
        `http://localhost:8080/api/matches/user?itemType=lost&userId=${userId}`,
        config
      )
      .then((response) => {
        setLostMatches(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

      axios
      .get(
        `http://localhost:8080/api/matches/user?itemType=found&userId=${userId}`,
        config
      )
      .then((response) => {
        setFoundMatches(response.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [accessToken]);

  const cardItems = [
    {
      color: "bg-[#F17971]",
      link: "/my-lost-items",
      count: lostItems.length,
      cardName: "My Lost Items",
      icon: <TbReportAnalytics />,
    },
    {
      color: "bg-[#0094C1]",
      link: "/my-found-items",
      count: foundItems.length,
      cardName: "My Found Items",
      icon: <TbReportSearch />,
    },
    {
      color: "bg-[#FDAA5C]",
      link: "/my-lost-item-claims",
      count: lostMatches?.length ?? 0,
      cardName: "Sent Claims",
      icon: <TbMailDown />,
    },
    {
      color: "bg-[#28afb0]",
      link: "/my-found-item-claims",
      count: foundMatches?.length ?? 0,
      cardName: "Received Claims",
      icon: <TbMailUp />,
    },
  ];

  return (
    <ProtectedRoute isAuthenticated={!!accessToken}>
      <div className="bg-gray-50 h-screen">
        <TitleSection title="Dashboard" />
        <div className="w-full overflow-x-auto">
          {loading ? (
            <Loading />
          ) : (
            <div className="grid lg:grid-cols-4 gap-3 p-4 md:grid-cols-2 sm:grid-cols-2">
              {cardItems?.map((cardItem, i) => (
                <div key={i}>
                  <DashboardCard
                    color={cardItem.color}
                    cardName={cardItem.cardName}
                    count={cardItem.count}
                    link={cardItem.link}
                    icon={cardItem.icon}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;