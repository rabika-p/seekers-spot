import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import TitleSection from "../components/TitleSection";
import Card from "./Card";
import ProtectedRoute from "../components/ProtectedRoute";

interface ILostItems {
  itemName: string;
  category: string;
  // date: string;
  location: string;
  description: string;
  keywords: string;
  // images: string[];
}

const EditLostItem = () => {
  const { itemId } = useParams();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ILostItems>();

  // const [files, setFiles] = useState<Array<File>>([]);
  // const [existingImages, setExistingImages] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const accessToken = localStorage.getItem("accessToken");

  const navigate = useNavigate();

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    axios
      .get(`http://localhost:8080/api/lost-items/${itemId}`, config)
      .then((response) => {
        const itemData = response.data;
        // const formattedDate = new Date(itemData.date)
        //   .toISOString()
        //   .substring(0, 10);
        setSelectedCategory(itemData.category);

        reset({
          itemName: itemData.itemName,
          category: itemData.category,
          // date: formattedDate,
          location: itemData.location,
          description: itemData.description,
          keywords: itemData.keywords,
        });

        // setExistingImages(
        //   itemData.images.map(
        //     (imageFilename: string) =>
        //       `http://localhost:8080/images/${imageFilename}`
        //   )
        // );
      })
      .catch((error) => {
        console.error(error);
      });
  }, [itemId, accessToken]);

  const onSubmit: SubmitHandler<ILostItems> = (data) => {
    const userId = localStorage.getItem("userId");

    const formData = new FormData();
    formData.append("itemName", data.itemName);
    formData.append("category", selectedCategory);
    // formData.append("date", data.date);
    formData.append("location", data.location);
    formData.append("description", data.description);
    formData.append("keywords", data.keywords);
    if (userId) {
      formData.append("postedBy", userId);
    }

    // for (let i = 0; i < existingImages.length; i++) {
    //   formData.append("existingImages", existingImages[i]);
    // }

    // for (let i = 0; i < files.length; i++) {
    //   formData.append("images", files[i]);
    //   console.log(formData.getAll("images"));
    // }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    axios
      .put(`http://localhost:8080/api/lost-items/${itemId}`, formData, config)
      .then((res) => {
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
        setTimeout(() => {
          navigate(-1);
        }, 1000);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCategory(event.target.value);
  };

  // const handleFile = (event: any) => {
  //   const newFiles = event.target.files;
  //   const updatedFiles = [...files, ...newFiles];
  //   setFiles(updatedFiles);
  // };

  // const handleRemoveImage = (indexToRemove: number) => {
  //   const updatedImages = [...existingImages];
  //   updatedImages.splice(indexToRemove, 1);
  //   setExistingImages(updatedImages);
  // };

  return (
    <ProtectedRoute isAuthenticated={!!accessToken}>
      <>
        <div className="text-center">
          <ToastContainer />
        </div>
        <div className="w-full overflow-hidden">
          <TitleSection title="Edit Lost Item" />
          <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex justify-center">
                <label className="text-lg w-1/3">Item Name</label>
                <div className="w-1/2">
                  <input
                    {...register("itemName", {
                      required: "The item name field is required",
                    })}
                    className={`border rounded-lg w-full py-2 px-3 mb-3 mt-2 text-gray-700 shadow-sm  ${
                      errors.itemName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Item name"
                  />
                  {errors.itemName && (
                    <p className="text-red-500 text-base">
                      {`${errors.itemName.message}`}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-center">
                <label className="text-lg w-1/3">Category</label>
                <select
                  id="categories"
                  className="border rounded-lg w-1/2 py-2 px-3 mb-3 mt-2 text-gray-700 shadow-sm"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="" disabled>
                    Choose a category
                  </option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Jewelery">Jewelery</option>
                  <option value="Wallet">Wallet</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {/* <div className="flex justify-center">
                <label className="text-lg w-1/3">Lost Date</label>
                <div className="w-1/2">
                  <input
                    {...register("date", {
                      required: "The lost date field is required",
                    })}
                    className={`border rounded-lg w-full py-2 px-3 mb-3 mt-2 text-gray-700 shadow-sm  ${
                      errors.date ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder=""
                    type="date"
                    value={new Date().toISOString().split("T")[0]}
                  />
                  {errors.date && (
                    <p className="text-red-500 text-base">
                      {`${errors.date.message}`}
                    </p>
                  )}
                </div>
              </div> */}
              <div className="flex justify-center ">
                <label className="text-lg w-1/3">Lost Location</label>
                <div className="w-1/2">
                  <input
                    {...register("location", {
                      required: "The lost location field is required",
                    })}
                    className={`border rounded-lg w-full py-2 px-3 mb-3 mt-2 text-gray-700 shadow-sm  ${
                      errors.location ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Lost Location"
                  />
                  {errors.location && (
                    <p className="text-red-500 text-base">
                      {`${errors.location.message}`}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-center">
                <label className="text-lg w-1/3 mt-1">Description</label>
                <div className="w-1/2">
                  <textarea
                    {...register("description", {
                      required: "The description field is required",
                    })}
                    className={`border rounded-lg w-full py-2 px-3 mb-3 mt-2 text-gray-700 shadow-sm  ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Description"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-base">
                      {`${errors.description.message}`}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-center">
                <label className="text-lg w-1/3">Keywords</label>
                <div className="w-1/2">
                  <input
                    {...register("keywords", {
                      required: "The keywords field is required",
                    })}
                    className={`flex flex-col border rounded-lg w-full py-2 px-3 mb-3 mt-2 text-gray-700 shadow-sm  ${
                      errors.keywords ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Separate tags with a comma"
                  />
                  {errors.keywords && (
                    <p className="text-red-500 text-base">
                      {`${errors.keywords.message}`}
                    </p>
                  )}
                </div>
              </div>
              {/* <div className="flex justify-center">
                <label className="text-lg w-1/3">Images</label>
                <div className="w-1/2 flex flex-col">
                  <input
                    name="images"
                    accept="image/jpg, image/png"
                    multiple
                    onChange={handleFile}
                    className={`border rounded-lg w-full py-2 px-3 mb-3 mt-2 text-gray-700 shadow-sm`}
                    type="file"
                  />
                  <div className="flex w-full overflow-auto space-x-1 scrollbar-thinscrollbar-thumb-[#6c92ea] scrollbar-track-[#92B2FC]">
                    {existingImages.map((image, idx) => (
                      <div key={idx} className="relative">
                        <img
                          className="object-cover h-28 aspect-square"
                          src={image}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-0 right-0 p-1 rounded-full cursor-pointer"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                    {[...files].map((file: File, idx: number) => (
                      <img
                        key={idx}
                        className="object-cover h-28 aspect-square"
                        src={URL.createObjectURL(file)}
                      />
                    ))}
                  </div>
                </div>
              </div> */}

              <div className="flex justify-center mt-5">
                <div className="w-1/3"></div>
                <div className="w-1/2">
                  <input
                    type="submit"
                    value="Update"
                    className="bg-[#9988DD] hover:bg-[#8566ff] hover:cursor-pointer text-white font-semibold py-2 px-4 rounded"
                  />
                </div>
              </div>
            </form>
          </Card>
        </div>
      </>
    </ProtectedRoute>
  );
};

export default EditLostItem;
