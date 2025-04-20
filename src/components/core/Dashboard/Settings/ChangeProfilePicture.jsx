// import { useEffect, useRef, useState } from "react"
// import { FiUpload } from "react-icons/fi"
// import { useDispatch, useSelector } from "react-redux"

// import { updateUserProfileImage } from "../../../../services/operations/SettingsAPI"
// import IconBtn from "../../../common/IconBtn"
// import Img from './../../../common/Img';



// export default function ChangeProfilePicture() {
//   const { token } = useSelector((state) => state.auth)
//   const { user } = useSelector((state) => state.profile)
//   const dispatch = useDispatch()

//   const [loading, setLoading] = useState(false)
//   const [profileImage, setProfileImage] = useState(null)
//   const [previewSource, setPreviewSource] = useState(null)

//   const fileInputRef = useRef(null)

//   const handleClick = () => {
//     fileInputRef.current.click()
//   }

//   const handleFileChange = (e) => {
//     const file = e.target.files[0]
//     //// console.log(file)
//     if (file) {
//       setProfileImage(file)
//       previewFile(file)
//     }
//   }

//   const previewFile = (file) => {
//     const reader = new FileReader()
//     reader.readAsDataURL(file)
//     reader.onloadend = () => {
//       setPreviewSource(reader.result)
//     }
//   }

//   const handleFileUpload = () => {
//     try {
//       //// console.log("uploading...")
//       setLoading(true)
//       const formData = new FormData()
//       formData.append("profileImage", profileImage)

//       dispatch(updateUserProfileImage(token, formData)).then(() => {
//         setLoading(false)
//       })
//     } catch (error) {
//      // console.log("ERROR MESSAGE - ", error.message)
//     }
//   }

//   useEffect(() => {
//     if (profileImage) {
//       previewFile(profileImage)
//     }
//   }, [profileImage])


//   return (
//     <>
//       <div className="flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-3 sm:px-12 text-richblack-5">
//         <div className="flex items-center gap-x-4">
//           <Img
//             src={previewSource || user?.image}
//             alt={`profile-${user?.firstName}`}
//             className="aspect-square w-[78px] rounded-full object-cover"
//           />

//           <div className="space-y-2">
//             <p className="font-medium">Change Profile Picture</p>
//             <div className="flex flex-col sm:flex-row gap-3">
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handleFileChange}
//                 className="hidden"
//                 accept="image/png, image/gif, image/jpeg, image/jpg"
//               />

//               <button
//                 onClick={handleClick}
//                 disabled={loading}
//                 className="cursor-pointer rounded-md py-2 px-5 font-semibold bg-richblack-200 text-richblack-900 hover:bg-richblack-900 hover:text-richblack-200 duration-300"
//               >
//                 Select
//               </button>

//               <IconBtn
//                 text={loading ? "Uploading..." : "Upload"}
//                 onclick={handleFileUpload}
//               >
//                 {!loading && (
//                   <FiUpload className="text-lg" />
//                 )}
//               </IconBtn>
              
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateProfile } from "../../../../services/operations/SettingsAPI"
import Img from "../../../common/Img"
import { useNavigate } from "react-router-dom"

export default function ChangeProfilePicture() {
  const { user } = useSelector((state) => state.profile)
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const [previewSource, setPreviewSource] = useState(user?.image || "")
  const [errors, setErrors] = useState({})

  const handleClick = () => {
    if (!previewSource.trim()) {
      setErrors({ image: "Please enter your image." })
      return
    }

    setErrors({}) // Clear errors

    const formData = new FormData()
    formData.append("image", previewSource)

    dispatch(updateProfile(user, formData,navigate))
  }

  return (
    <>
      <div className="flex items-center justify-between rounded-md border border-richblack-700 bg-richblack-800 p-8 px-3 sm:px-12 text-richblack-5">
        <div className="flex items-center gap-x-4 w-full">
          <Img
            src={previewSource}
            alt={`profile-${user?.prenom}`}
            className="aspect-square w-[78px] rounded-full object-cover"
          />
  
          <div className="space-y-2 w-full">
            <p className="font-medium">Change Profile Picture</p>
  
            <div className="flex flex-col sm:flex-row gap-3 w-full items-stretch">
              {/* Input field */}
              <div className="flex flex-col gap-2 ">
                <label htmlFor="image" className="lable-style">
                  Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  id="image"
                  defaultValue={user?.image}

                  placeholder="Enter your image URL or path"
                  className="form-style w-full h-[42px]" // Adjust height here if needed
                  value={previewSource}
                  onChange={(e) => setPreviewSource(e.target.value)}
                />
                {errors.image && (
                  <span className="-mt-1 text-[12px] text-yellow-100">
                    {errors.image}
                  </span>
                )}
              </div>
  
              {/* Button with same height as input */}
              <div className="flex items-end">
                <button
                  onClick={handleClick}
                  className="h-[42px] px-5 font-semibold bg-richblack-200 text-richblack-900 hover:bg-richblack-900 hover:text-richblack-200 rounded-md duration-300"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
  
}

