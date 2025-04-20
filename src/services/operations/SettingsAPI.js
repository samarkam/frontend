import { toast } from "react-hot-toast"

import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiConnector"
import { etudiantAPI } from "../apis"
import { logout } from "./authAPI"

const {
  
  UPDATE_PROFILE_API_ETUDIANT,
  UPDATE_PROFILE_API_ENSEIGNANT,
  UPDATE_PROFILE_API_ADMIN
} = etudiantAPI




// ================ update Profile  ================
export function updateProfileEtudiant(user, formData,navigate) {
  return async (dispatch) => {
//  console.log('This is calling for updated profile  etudiant ')
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
        password:user.password,
        email: user.email,
        details:formData.details,
        niveauEtude: formData.niveauEtude
      };
      const response = await apiConnector("PUT", UPDATE_PROFILE_API_ETUDIANT, etudiantData)
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
      localStorage.setItem("user", JSON.stringify(response.data));
      toast.success("Profile Updated Successfully")
      navigate("/dashboard/my-profile");

    } catch (error) {
     // console.log("UPDATE_PROFILE_API API ERROR............", error)
      toast.error("Could Not Update Profile")
    }
    toast.dismiss(toastId)
  }
}


// ================ update Profile  ================
export function updateProfileAdmin(user, formData,navigate) {
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
        password:user.password,
        email: user.email,
        
      };
      const response = await apiConnector("PUT", UPDATE_PROFILE_API_ADMIN, etudiantData)
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
      localStorage.setItem("user", JSON.stringify(response.data));
      toast.success("Profile Updated Successfully")
      navigate("/dashboard/my-profile");

    } catch (error) {
     // console.log("UPDATE_PROFILE_API API ERROR............", error)
      toast.error("Could Not Update Profile")
    }
    toast.dismiss(toastId)
  }
}



// ================ update Profile  ================
export function updateProfileEnseignant(user, formData,navigate) {
  return async (dispatch) => {
  // console.log('This is formData for updated profile -> ', formData)
    const toastId = toast.loading("Loading...")
    try {
    
      const EnseignantData = {
        id: user.id,
        accountType : user.accountType,
        nom: formData.nom,
        prenom: formData.prenom,
        telephone: formData.telephone,
        dateDeNaissance: formData.dateDeNaissance,
        password:user.password,
        email: user.email,
        details:formData.details,
        matricule: formData.matricule,
        specialite:formData.specialite
      };
      const response = await apiConnector("PUT", UPDATE_PROFILE_API_ENSEIGNANT, EnseignantData)
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
      localStorage.setItem("user", JSON.stringify(response.data));
      toast.success("Profile Updated Successfully")
      navigate("/dashboard/my-profile");

    } catch (error) {
     // console.log("UPDATE_PROFILE_API API ERROR............", error)
      toast.error("Could Not Update Profile")
    }
    toast.dismiss(toastId)
  }
}
