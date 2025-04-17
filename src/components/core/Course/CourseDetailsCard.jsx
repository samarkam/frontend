import React, { useEffect, useState } from "react"
import copy from "copy-to-clipboard"
import { toast } from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { BsFillCaretRightFill } from "react-icons/bs"
import { FaShareSquare } from "react-icons/fa"

import { addToCart } from "../../../slices/cartSlice"
import { ACCOUNT_TYPE } from "../../../utils/constants"
import Img from './../../common/Img';
import { apiConnector } from "../../../services/apiConnector"


function CourseDetailsCard({ course, setConfirmationModal, handleBuyCourse }) {
  const user = useSelector((state) => state.profile.user);

  // const { userjson } = localStorage.getItem('user') ? JSON.parse( localStorage.getItem('user')) : null

 
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isEnrolled, setEnrolled] = useState(false)
  const {
    image: ThumbnailImage,
    id: courseId,
  } = course
  useEffect(() => {
  
    const fectchCourseDetailsData = async () => {
      if (user && user.accountType === ACCOUNT_TYPE.STUDENT) {
  
        try {
          const res = await apiConnector(
            "GET",
            `http://localhost:9090/api/cours/my-courses?email=${user.email}`
          );
  
          console.log("course details res for this user: ", res?.data);
  
          if (res?.data) {
            const courses = res.data;
            const enrolled = courses.some((c) => c.id === course.id); 
            setEnrolled(enrolled);
            console.log(" isEnrolled = ", enrolled); 
          }
        } catch (error) {
          console.error(" Could not fetch Course Details", error);
        }
      }
    };
  
    fectchCourseDetailsData();
  }, [user, course]);
  
    

  const handleShare = () => {
    copy(window.location.href)
    toast.success("Link copied to clipboard")
  }

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't buy a course.")
      return
    }
    if (user) {
      dispatch(addToCart(course))
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to add To Cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  // console.log("Student already enrolled ", course?.studentsEnroled, user?._id)

  return (
    <>
      <div
        className={`flex flex-col gap-4 rounded-2xl bg-richblack-700 p-4 text-richblack-5 `}
      >
        {/* Course Image */}
        <Img
          src={course?.image}
          alt={course?.titre}
          className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
        />

        <div className="px-4">
          <div className="space-x-3 pb-4 text-3xl font-semibold">
          {course?.titre}
          </div>
          <div className="flex flex-col gap-4">
            <button
              className="yellowButton outline-none"
              onClick={
                user && isEnrolled
                  ? () => navigate("/dashboard/enrolled-courses")
                  : handleBuyCourse
              }
            >
              {user && isEnrolled
                ? "Go To Course"
                : "Buy Now"}
            </button>
            {(!user || !isEnrolled) && (
              <button onClick={handleAddToCart} className="blackButton outline-none">
                Add to Cart
              </button>
            )}
          </div>

      

         

          <div className="text-center">
            <button
              className="mx-auto flex items-center gap-2 py-6 text-yellow-100 "
              onClick={handleShare}
            >
              <FaShareSquare size={15} /> Share
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseDetailsCard