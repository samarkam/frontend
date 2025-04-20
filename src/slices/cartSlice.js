// cartSlice.js
import { createSlice } from "@reduxjs/toolkit"
import { toast } from "react-hot-toast"
import { apiConnector } from "../services/apiConnector"

const initialState = {
  cart: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [],
  total: localStorage.getItem("total")
    ? JSON.parse(localStorage.getItem("total"))
    : 0,
  totalItems: localStorage.getItem("totalItems")
    ? JSON.parse(localStorage.getItem("totalItems"))
    : 0,
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    removeFromCart: (state, action) => {
      const courseId = action.payload
      const index = state.cart.findIndex((item) => item.id === courseId)

      if (index >= 0) {
        state.totalItems--
        state.total -= state.cart[index].price
        state.cart.splice(index, 1)
        localStorage.setItem("cart", JSON.stringify(state.cart))
        localStorage.setItem("total", JSON.stringify(state.total))
        localStorage.setItem("totalItems", JSON.stringify(state.totalItems))
        toast.success("Course removed from cart")
      }
    },

    resetCart: (state) => {
      state.cart = []
      state.total = 0
      state.totalItems = 0
      localStorage.removeItem("cart")
      localStorage.removeItem("total")
      localStorage.removeItem("totalItems")
    },
  },
})

// // ✅ Move this function OUTSIDE createSlice:
// export const handleBuyCourse = async ({
//   user,
//   courseId,
//   token,
//   navigate,
//   dispatch,
//   setConfirmationModal,
// }) => {
//   if (user) {
//     const toastId = toast.loading("Loading...")
//     try {
//       await apiConnector(
//         "GET",
//         `http://localhost:9090/api/cours/inscription?etudiantId=${user.id}&coursId=${courseId}`
//       )
//       toast.success("Course added to cart")
//     } catch (err) {
//       toast.error("Failed to add course")
//     } finally {
//       toast.dismiss(toastId)
//     }
//   } else {
//     setConfirmationModal({
//       text1: "You are not logged in!",
//       text2: "Please login to Purchase Course.",
//       btn1Text: "Login",
//       btn2Text: "Cancel",
//       btn1Handler: () => navigate("/login"),
//       btn2Handler: () => setConfirmationModal(null),
//     })
//     toast.success("Course added to cart")
//   }
// }

export const { removeFromCart, resetCart } = cartSlice.actions
export default cartSlice.reducer
