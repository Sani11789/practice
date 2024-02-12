"use client";

import Search from "@/components/elements/search";
import { useState, useEffect, useCallback } from "react";
import { CreateItemsApi, GetAllItemsApi } from "@/apiEndpoints/item";
import {
  CategoryResponse,
  CreateItemForm,
  ItemResponse,
} from "@/types/interfaces";
import { RiFileEditFill } from "react-icons/ri";
import { AiFillDelete } from "react-icons/ai";
import { useForm, Controller } from "react-hook-form";
import Modal from "react-modal";
import { CgCloseR } from "react-icons/cg";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { updateContentState } from "@/types/interfaces";
import { saveContentLength } from "@/redux/slices/ContentSlice";
import { DeleteItemApi } from "@/apiEndpoints/item";
import { GetCategoriesApi } from "@/apiEndpoints/category";
import "./index.scss";

const ManageItems = () => {
  const dispatch = useDispatch();
  const contentLength = useSelector(
    (state: updateContentState) => state.content.contentLength
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [itemID, setItemID] = useState<string>("");
  const [file, setFile] = useState<File[]>([]);
  const [imageIndex, setImageIndex] = useState<number>(0);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      price: "",
      categoryID: "",
      files: [] as unknown as File[],
      banner: "" as unknown as number,
    },
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openDeleteModal = (itemID: string) => {
    setItemID(itemID);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  //   const openEditModal = (categoryId: string, banner: string) => {
  //     GetCategoryByIdApi(categoryId).then((response) => {
  //       setValue("categoryName", response?.categoryName || "");
  //       setValue("file", response?.file || "");
  //       setEditModalCategory(response);
  //     });
  //     setIsEditModalOpen(true);
  //   };

  //   const closeEditModal = () => {
  //     setIsEditModalOpen(false);
  //     setValue("categoryName", "");
  //     setValue("file", "" as unknown as File);
  //   };

  const onSubmit = async (data: CreateItemForm) => {
    const formData = new FormData();
    formData.append("title", data.title || "");
    formData.append("description", data.description || "");
    formData.append("price", data.price.toString() || "");
    formData.append("categoryID", data.categoryID || "");
    formData.append("banner", imageIndex.toString()||"0");
    file.forEach((file, index) => {
      formData.append("files", file);
    });
  

    await CreateItemsApi(formData);
    const response = await GetAllItemsApi(searchQuery);
    setItems(response?.items);
    console.log("response after submit", response);

    dispatch(
      saveContentLength({ contentLength: response?.items?.length || 0 })
    );

    setValue("title", "");
    setValue("description", "");
    setValue("price", "");
    setValue("categoryID", "");

    setFile([]);
    console.log("form after", file[0]);

    setIsModalOpen(false);
  };

  const onDrop = useCallback((acceptedFiles: any) => {
    setFile(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    GetAllItemsApi(searchQuery)
      .then((response) => {
        setItems(response.items);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
        setItems([]);
      });
  }, [searchQuery]);

  useEffect(() => {
    GetCategoriesApi()
      .then((response) => {
        setCategories(response);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setCategories([]);
      });
  }, []);

  useEffect(() => {
    fetchItems();
  }, [contentLength]);

  const fetchItems = async () => {
    const response = await GetAllItemsApi(searchQuery);
    setItems(response?.items);
    dispatch(
      saveContentLength({ contentLength: response?.items?.length || 0 })
    );
  };

  const deleteItem = async (itemID: string) => {
    await DeleteItemApi(itemID);
    const updatedItems = items.filter((item) => item._id !== itemID);
    setItems(updatedItems);
    dispatch(saveContentLength({ contentLength: updatedItems.length || 0 }));
  };

  console.log("index", imageIndex)

  return (
    <div className="manage-items-container">
      <div className="manage-items-header">
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          ariaHideApp={false}
          contentLabel="Example Modal"
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            },
            content: {
              width: "45%",
              height: "55%",
              margin: "auto",
              borderRadius: "10px",
              overflow: "auto",
            },
          }}
        >
          <div className="create-item-form-container">
            <h3>Create Item</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="create-item-form">
              <div className="create-item-form-item">
                <label className="create-item-form-label">
                  Item Name:{" "}
                </label>
                <Controller
                  name="title"
                  control={control}
                  rules={{
                    required: "Item name is required",
                  }}
                  render={({ field }) => (
                    <input
                      placeholder="Enter item name"
                      {...field}
                      className="create-item-form-input"
                    />
                  )}
                />
                {errors.title && <h5>{errors.title.message}</h5>}
              </div>

              <div className="create-item-form-item">
                <label className="create-item-form-label">Description: </label>
                <Controller
                  name="description"
                  control={control}
                  rules={{
                    required: "Item description is required",
                  }}
                  render={({ field }) => (
                    <input
                      placeholder="Enter item description"
                      {...field}
                      className="create-item-form-input"
                    />
                  )}
                />
                {errors.description && <h5>{errors.description.message}</h5>}
              </div>

              <div className="create-item-form-item">
                <label className="create-item-form-label">Item Price: </label>
                <Controller
                  name="price"
                  control={control}
                  rules={{
                    required: "Item price is required",
                  }}
                  render={({ field }) => (
                    <input
                      placeholder="Enter item price"
                      {...field}
                      className="create-item-form-input"
                    />
                  )}
                />
                {errors.price && <h5>{errors.price.message}</h5>}
              </div>

              <div className="create-item-form-item">
                <label className="create-item-form-label">Category: </label>
                <Controller
                  name="categoryID"
                  control={control}
                  rules={{
                    required: "Item category is required",
                  }}
                  render={({ field }) => (
                    <select {...field} className="create-item-form-input">
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.categoryName}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.description && <h5>{errors.description.message}</h5>}
              </div>

              <div className="create-item-form-upload">
                <div className="upload">
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <p>Drop the files here ...</p>
                    ) : (
                      <img src="/upload.png" className="upload-icon" />
                    )}
                  </div>
                  <label>Upload a Banner Image for the Item</label>
                </div>
                <div className="upload-image-container">
                  {file.length > 0
                    ? file.map((f: any, index) => {
                      return (
                        <img key={index}
                          src={URL.createObjectURL(f)}
                          alt="image"
                          className={`upload-image ${imageIndex === index ? "active" : ""}`}
                          onClick={() => { setImageIndex(file.indexOf(f))
                          // set an active classname
                            
                          }}
                        />
                      );
                    })
                    : <div></div>
                  }
                </div>
              </div>

              <div>
                <button className="submit-button">Submit</button>
              </div>
            </form>
          </div>
          <CgCloseR className="close-button" onClick={closeModal} />
        </Modal>
        <h3 className="manage-items-title">Manage Items</h3>
        <Search
          type="text"
          placeholder="Search Items"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="create-items-button" onClick={openModal}>
          Create Item
        </button>
      </div>
      <div className="manage-items-body">
        {items &&
          items.length > 0 &&
          items.map((item) => {
            return (
              <div key={item._id} className="manage-items-card">
                <div className="manage-items-image-title">
                  <img
                    src={`http://localhost:3000/uploads/${item.banner}`}
                    className="manage-items-image"
                  />
                  <div className="manage-items-details">
                    <p className="manage-items-name">{item.title}</p>
                    <p className="manage-items-category">
                      {item.categoryID?.categoryName}
                    </p>
                    <p className="manage-items-price">Price: ${item.price}</p>
                  </div>
                </div>
                <div className="manage-items-button">
                  <RiFileEditFill
                    className="edit-button"
                    onClick={() => {
                      // openEditModal(category._id, category.file);
                    }}
                  />
                  <Modal
                    isOpen={isDeleteModalOpen}
                    onRequestClose={closeDeleteModal}
                    ariaHideApp={false}
                    contentLabel="Example Modal"
                    style={{
                      overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                      },
                      content: {
                        width: "50%",
                        height: "50%",
                        margin: "auto",
                        borderRadius: "10px",
                        overflow: "auto",
                      },
                    }}
                  >
                    <div>
                      <h2>Delete Item</h2>
                      <p>
                        Are you sure you want to delete this item?
                      </p>
                      <div className="delete-modal-button">
                        <button
                          className="yes-button"
                          onClick={() => {
                            deleteItem(itemID);
                            closeDeleteModal();
                          }}
                        >
                          Yes
                        </button>
                        <button
                          className="no-button"
                          onClick={closeDeleteModal}
                        >
                          No
                        </button>
                      </div>
                    </div>
                    <CgCloseR
                      className="close-button"
                      onClick={closeDeleteModal}
                    />
                  </Modal>
                  <AiFillDelete
                    className="delete-button"
                    onClick={() => {
                      openDeleteModal(item?._id ?? "");
                    }}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ManageItems;
