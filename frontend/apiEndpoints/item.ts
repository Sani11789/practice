import { axiosInstance, axiosInstanceToken } from "../utils/axiosInstance";
import { toast } from "react-toastify";
import dotenv from "dotenv";
import { CreateItemForm } from "@/types/interfaces";
dotenv.config();

export const CreateItemsApi = (data: any) => {
  return axiosInstanceToken
    .post("/app/v1/item/create-item", data)
    .then((response) => {
      console.log("response", response.data.data);
      toast.success(response.data.message);
      return response.data.data;
    })
    .catch((error) => {
      toast.error(error.response.data.message);
      console.log(error);
    });
};

export const GetAllItemsApi = async (
  searchQuery: string,
  limit?: number | undefined,
  page?: number | undefined,
  sortParam?: string | undefined
) => {
  try {
    // Create an object to hold the query parameters
    const queryParams: { [key: string]: string | number | undefined } = {
      search: searchQuery,
    };

    // Add limit and page to the queryParams if they are defined
    if (limit !== undefined) {
      queryParams.limit = limit.toString();
    }

    // Add page and sortParam to the queryParams if they are defined
    if (page !== undefined) {
      queryParams.page = page.toString();
    }

    if (sortParam !== undefined) {
      queryParams.sortParam = sortParam;
    }

    // Create the query string by filtering out undefined values
    const queryString = Object.entries(queryParams)
      .filter(([key, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    // Make the API call with the constructed query string
    const response = await axiosInstance(
      `/app/v1/item/get-all-items?${queryString}`
    );
    const data = response.data;
    console.log("items", data.data.items);

    if (data.success === false) {
      console.log("Error: ", data.message);
    }

    return data.data;
  } catch (error: any) {
    console.error(
      error.message || "An unknown error occurred during fetching data"
    );
  }
};

export const GetItemsByCategoryIDApi = async (id: string) => {
  try {
    const response = await axiosInstance(
      `/app/v1/item/get-items-by-category/${id}`
    );
    const data = response.data;

    if (data.success === false) {
      console.log("Error: ", data.message);
    }
    console.log("items", data.data);
    return data.data;
  } catch (error: any) {
    console.error(
      error.message || "An unknown error occurred during fetching data"
    );
  }
};

export const GetItemByIdApi = async (id: string) => {
  try {
    const response = await axiosInstance(`/app/v1/item/get-item-by-id/${id}`);
    const data = response.data;

    if (data.success === false) {
      console.log("Error: ", data.message);
    }
    console.log("items", data.data);
    return data.data;
  } catch (error: any) {
    console.error(
      error.message || "An unknown error occurred during fetching data"
    );
  }
};

export const DeleteItemApi = (id: string) => {
  return axiosInstanceToken
    .delete(`/app/v1/item/delete-item/${id}`)
    .then((response) => {
      console.log("response", response.data.data);
      toast.success(response.data.message);
      return response.data.data;
    })
    .catch((error) => {
      toast.error(error.response.data.message);
      console.log(error);
    });
};
