import { toast } from "react-hot-toast"

import { setLoading } from "../../slices/authSlice"
import { resetCart } from "../../slices/cartSlice"
import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiConnector"
import { endpoints } from "../apis"
import { ACCOUNT_TYPE } from "../../utils/constants"

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints

// ================ send Otp ================
export function sendOtp(email, navigate) {
  return async (dispatch) => {

    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      })
      //// console.log("SENDOTP API RESPONSE ---> ", response)

      //// console.log(response.data.success)
      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      navigate("/verify-email");
      toast.success("OTP Sent Successfully");
    } catch (error) {
     // console.log("SENDOTP API ERROR --> ", error);
      toast.error(error.response.data?.message);
      // toast.error("Could Not Send OTP")
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  }
}

// ================ sign Up ================
export function signUp(accountType, firstName, lastName, email, password, confirmPassword, otp, navigate) {
  return async (dispatch) => {

    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      })

      //// console.log("SIGNUP API RESPONSE --> ", response);
      if (!response.data.success) {
        toast.error(response.data.message);
        throw new Error(response.data.message);
      }

      toast.success("Signup Successful");
      navigate("/login");
    } catch (error) {
     // console.log("SIGNUP API ERROR --> ", error);
      // toast.error(error.response.data.message);
      toast.error("Invalid OTP");
      // navigate("/signup")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}


// ================ Login ================
export function login(email, password, navigate) {
  return async (dispatch) => {

    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      })

     // console.log("LOGIN API RESPONSE............", response.data);

      // if (!response.data.success) {
      //   throw new Error(response.data.message)
      // }

      toast.success("Login Successful")
      // dispatch(setToken("whatever"))
      const user = response.data ; 
     
      const userImage = user?.image
        ? user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${user.nom} ${user.prenom}`
        const etudiantData = {
          id: user.id,
          accountType: user.accountType,
          nom: user.nom,
          prenom: user.prenom,
          telephone: user.telephone,
          image: userImage,
          dateDeNaissance: user.dateDeNaissance,
          password:user.password,
          email: user.email,
          details:user.details,
          niveauEtude: user.niveauEtude
        }; 
      dispatch(setUser(etudiantData));
     // console.log('User data - ',etudiantData);
    //  localStorage.setItem("token", JSON.stringify("whatever"));

      localStorage.setItem("user", JSON.stringify(etudiantData));

    if(user?.accountType === ACCOUNT_TYPE.STUDENT){
      navigate("/dashboard/enrolled-courses" );

    }else if (user?.accountType === ACCOUNT_TYPE.INSTRUCTOR){
      navigate("/dashboard/instructor" );


    }else if (user?.accountType === ACCOUNT_TYPE.ADMIN){
      navigate("/dashboard/admin");

    }
    } catch (error) {
     // console.log("LOGIN API ERROR.......", error)
      toast.error(error.response?.data?.message)
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}



// ================ reset Password ================
export function resetPassword(password, confirmPassword, token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))

    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      })

     // console.log("RESETPASSWORD RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Password Reset Successfully")
      navigate("/login")
    } catch (error) {
     // console.log("RESETPASSWORD ERROR............", error)
      toast.error(error.response?.data?.message)
      // toast.error("Failed To Reset Password");
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}


// ================ Logout ================
export function logout(navigate) {
  return (dispatch) => {
    // dispatch(setToken(null))
    dispatch(setUser(null))
    dispatch(resetCart())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged Out")
    navigate("/")
  }
}