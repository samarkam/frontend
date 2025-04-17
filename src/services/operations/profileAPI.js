import { toast } from "react-hot-toast"

import { setLoading, setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiConnector"
import { profileEndpoints } from "../apis"
import { logout } from "./authAPI"
import { ACCOUNT_TYPE } from "../../utils/constants"

const { GET_USER_DETAILS_API, GET_USER_ENROLLED_COURSES_API, GET_INSTRUCTOR_DATA_API } = profileEndpoints


// ================ get User Details  ================
export function getUserDetails(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("GET", GET_USER_DETAILS_API, null)
      console.log("GET_USER_DETAILS API RESPONSE............", response)

      if (!response.data) {
        throw new Error(response.data.message)
      }
      const userImage = response.data?.image
        ? response.data.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.nom} ${response.data.prenom}`
        response.data.image = userImage ; 
      dispatch(setUser(response.data));

      } catch (error) {
      dispatch(logout(navigate))
      console.log("GET_USER_DETAILS API ERROR............", error)
      toast.error("Could Not Get User Details")
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}

// ================ get User Enrolled Courses  ================
export async function getUserEnrolledCourses(user) {
   
      if (user && user.accountType === ACCOUNT_TYPE.STUDENT) {
        console.log("calling my courses");
  
        try {
          const res = await apiConnector(
            "GET",
            `http://localhost:9090/api/cours/my-courses?email=${user.email}`
          );
  
          console.log("course details res for this user: ", res);
  
          
          return res?.data

        } catch (error) {
          console.error(" Could not fetch Course Details", error);

        }

      }
  
 
  return []
}

// ================ get Instructor Data  ================
export async function getInstructorData(token) {
  // const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, {
      Authorization: `Bearer ${token}`,
    })
    console.log("GET_INSTRUCTOR_DATA_API API RESPONSE............", response)
    result = response?.data?.courses
  } catch (error) {
    console.log("GET_INSTRUCTOR_DATA_API API ERROR............", error)
    toast.error("Could Not Get Instructor Data")
  }
  // toast.dismiss(toastId)
  return result
}
