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
      //toast.error(error.response.data?.message);
      // toast.error("Could Not Send OTP")
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  }
}

export function signUp(form, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        nom: form.lastName,
        prenom: form.firstName,
        telephone: "23232323",              // blank
        dateDeNaissance: "2025-04-20T22:08:26.665Z",       // blank
        password : form.password,
        email: form.email,
        details: "details",               // blank
        matricule: form.lastName,             // blank
        specialite: "specialite",            // blank
        niveauEtude: "niveauEtude",           // blank
        image: "https://img.freepik.com/vecteurs-libre/cercle-bleu-utilisateur-blanc_78370-4707.jpg?ga=GA1.1.261463445.1733307803&semt=ais_hybrid&w=740",                 // blank
      });

      if (!response.data) {
        throw new Error("No response from server.");
      }

      toast.success("Signup Successful");
      navigate("/login");
    } catch (error) {
      console.error("SIGNUP API ERROR --> ", error);
      toast.error(error?.response?.data?.message || "Signup failed");
    }

    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
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

      // console.log("LOGIN API RESPONSE............", response);

      if (response.status === 200) {
        const user = response.data;

        // Now fetch the block status
        const blockCheckResponse = await apiConnector("GET", `http://localhost:9090/api/users/${user.id}`);

        if (blockCheckResponse?.data?.isBlocked) {
          toast.error("Your account is blocked. Please contact support.");
          dispatch(setLoading(false));
          toast.dismiss(toastId);
          return;
        }


      }

      toast.success("Login Successful")
      // dispatch(setToken("whatever"))
      const user = response.data ; 
     
      const userImage = user?.image
        ? user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${user.nom} ${user.prenom}`
        const userData = {
          id: user.id,
          accountType: user?.accountType,
          nom: user.nom,
          prenom: user.prenom,
          telephone: user.telephone,
          image: userImage,
          dateDeNaissance: user.dateDeNaissance,
          password:user.password,
          email: user.email,
          details:user.details,
          niveauEtude: user?.niveauEtude,
          matricule: user?.matricule,
          specialite:user?.specialite

        }; 
      dispatch(setUser(userData));
     // console.log('User data - ',userData);
    //  localStorage.setItem("token", JSON.stringify("whatever"));

      localStorage.setItem("user", JSON.stringify(userData));

    if(user?.accountType === ACCOUNT_TYPE.STUDENT){
      navigate("/dashboard/enrolled-courses" );

    }else if (user?.accountType === ACCOUNT_TYPE.INSTRUCTOR){
      navigate("/dashboard/instructor" );


    }else if (user?.accountType === ACCOUNT_TYPE.ADMIN){
      navigate("/dashboard/admin");

    }
    } catch (error) {
     // console.log("LOGIN API ERROR.......", error)
      //toast.error
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
      //toast.error(error.response?.data?.message)
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