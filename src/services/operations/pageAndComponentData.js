import React from 'react'
// import { toast } from "react-hot-toast"
import { apiConnector } from '../apiConnector';
import { catalogData } from '../apis';


// ================ get Catalog Page Data  ================
export const getCatalogPageData = async (categoryId) => {
  console.log("ttttttttttttttttttttttttttttttt")
  console.log(categoryId)
  // const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector("GET", /*catalogData.CATALOGPAGEDATA_API*/ `http://localhost:9090/api/specialite/${categoryId}`);

    if (!response?.data)
      throw new Error("Could not Fetch Category page data");

    result = response?.data;
    console.log("CATALOG PAGE DATA API RESPONSE ............/" + categoryId, response.data )

  }
  catch (error) {
    console.log("CATALOG PAGE DATA API ERROR....", error);
    // toast.error(error.response?.data.message);
    result = error.response?.data.data;
  }
  // toast.dismiss(toastId);
  return result;
}

