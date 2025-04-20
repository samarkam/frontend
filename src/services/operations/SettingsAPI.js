import { toast } from "react-hot-toast"

import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiConnector"
import { etudiantAPI } from "../apis"
import { logout } from "./authAPI"

const {
  
  UPDATE_PROFILE_API
  
} = etudiantAPI




// ================ update Profile  ================
export function updateProfile(user, formData,navigate) {
  return async (dispatch) => {
  // console.log('This is formData for updated profile -> ', formData)
    const toastId = toast.loading("Loading...")
    try {

      const etudiantData = {
        id: user.id,
        accountType : user.accountType,
        nom: formData.nom,
        prenom: formData.prenom,
        telephone: formData.telephone,
        image: formData.image,
        dateDeNaissance: formData.dateDeNaissance,
        password:formData.password,
        email: formData.email,
        details:formData.details,
        niveauEtude: formData.niveauEtude
      };
      const response = await apiConnector("PUT", UPDATE_PROFILE_API, etudiantData)
     // console.log("UPDATE_PROFILE_API API RESPONSE............", response)

      if (!response.data) {
        throw new Error(response.data.message)
      }
      const userImage = response.data?.image
        ? response.data?.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.prenom} ${response.data.nom}`
        response.data.image=userImage
      dispatch(setUser(response.data))

   
      //// console.log('DATA = ', data)
      localStorage.setItem("user", JSON.stringify({ ...response.data.updatedUserDetails, image: userImage }));
      toast.success("Profile Updated Successfully")
      navigate("/dashboard/my-profile");

    } catch (error) {
     // console.log("UPDATE_PROFILE_API API ERROR............", error)
      toast.error("Could Not Update Profile")
    }
    toast.dismiss(toastId)
  }
}


// ================ change Password  ================
export async function changePassword(user, formData) {
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData)
   // console.log("CHANGE_PASSWORD_API API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success("Password Changed Successfully")
  } catch (error) {
   // console.log("CHANGE_PASSWORD_API API ERROR............", error)
    toast.error(error.response.data.message)
  }
  toast.dismiss(toastId)
}

// ================ delete Profile ================
export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
        Authorization: `Bearer ${token}`,
      })
     // console.log("DELETE_PROFILE_API API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Profile Deleted Successfully")
      dispatch(logout(navigate))
    } catch (error) {
     // console.log("DELETE_PROFILE_API API ERROR............", error)
      toast.error("Could Not Delete Profile")
    }
    toast.dismiss(toastId)
  }
}