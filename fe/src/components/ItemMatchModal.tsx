import axios from "axios";
import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";

interface ILostItem {
  _id: string;
  itemName: string;
  postedBy: {
    _id: string;
  };
}

interface IItemMatchModalProps {
  foundItemName: string;
  foundItemId: string;
  status: string;
}

const ItemMatchModal: React.FC<IItemMatchModalProps> = (props) => {
  const { status } = props;
  const [isPopUpVisible, setPopUpVisible] = useState(false);
  const [lostItems, setLostItems] = useState<ILostItem[]>([]);

  const accessToken = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");

  const [selectedLostItemId, setSelectedLostItemId] = useState<string>("");

  //     const res = await axios.get(`http://localhost:8080/api/lost-items/${lostItemId}`, {
  //       headers: {
  //         Authorization: "Bearer " + accessToken,
  //       },
  //     });

  //     const postedById = res.data.postedBy._id;
  //     setRequestedTo(postedById);
  //     setSelectedLostItemId(lostItemId);

  //   } catch (error) {
  //     console.error("Error fetching postedBy information:", error);
  //   }
  // };

  const handleFormSubmit = (e: React.FormEvent) => {
    if (selectedLostItemId) {
      const matchData = {
        lostItemId: selectedLostItemId,
        foundItemId: props.foundItemId,
        requestedBy: userId,
      };

      axios
        .post("http://localhost:8080/api/matches", matchData, {
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.data.err) {
            const errorMessage = res.data.err.message || "An error occurred";
            toast.error(errorMessage);
          }
          else {
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
        }
        })
        .catch((e) => {
          console.log(e);
        });
      e.preventDefault();
      setPopUpVisible(false);
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/lost-items/user?userId=${userId}`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then((res) => {
        setLostItems(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
    console.log(selectedLostItemId);
  }, []);

  return (
    <div>
      <div className="text-center">
        <ToastContainer />
      </div>
      {isPopUpVisible && (
        <div>
          <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 text-gray-700 text-lg">
            <div className="modal w-96 p-2 px-5 bg-white rounded-lg shadow-lg opacity-100 relative">
              <p className="text-2xl mb-2">{props.foundItemName}</p>
              <button
                className="cursor-pointer absolute top-2 right-2"
                onClick={() => setPopUpVisible(false)}
              >
                <AiOutlineClose />
              </button>
              <form className="flex flex-col gap-2" onSubmit={handleFormSubmit}>
                <label>Select a Lost Item:</label>
                <select
                  id="item_id"
                  value={selectedLostItemId}
                  className="border-2 border-gray rounded"
                  onChange={(e) => setSelectedLostItemId(e.target.value)}
                >
                  <option value="">Select a name</option>
                  {lostItems?.map((lostItem, i) => (
                    <option key={i} value={lostItem._id}>
                      {lostItem.itemName}
                    </option>
                  ))}
                </select>
                <div className="mx-auto mt-1">
                  <input
                    type="submit"
                    value="Submit"
                    className="bg-[#8c86e8] text-white hover:bg-[#7a66d3] px-2 py-2 rounded-md hover:cursor-pointer"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {status!=="Matched" &&
      <button
        className="bg-[#8c86e8] text-white hover:bg-[#7a66d3] px-2 py-2 rounded-md"
        onClick={() => setPopUpVisible(true)}
      >
        Claim
      </button>
      }
    </div>
  );
};

export default ItemMatchModal;
