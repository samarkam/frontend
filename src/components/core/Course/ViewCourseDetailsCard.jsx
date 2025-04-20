import React, { useEffect, useState } from "react"
import copy from "copy-to-clipboard"
import { toast } from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { BsFillCaretRightFill } from "react-icons/bs"
import { FaShareSquare } from "react-icons/fa"

import { ACCOUNT_TYPE } from "../../../utils/constants"
import Img from './../../common/Img';
import { apiConnector } from "../../../services/apiConnector"


function ViewCourseDetailsCard({ course, setConfirmationModal }) {
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
      if (user ) {
  
        try {
          const res = await apiConnector(
            "GET",
            `http://localhost:9090/api/cours/my-courses?email=${user.email}`
          );
  
         // console.log("course details res for this user: ", res?.data);
  
          if (res?.data) {
            const courses = res.data;
            const enrolled = courses.some((c) => c.id === course.id); 
            setEnrolled(enrolled);
           // console.log(" isEnrolled = ", enrolled); 
          }
        } catch (error) {
          console.error(" Could not fetch Course Details", error);
        }
      }
    };
  
    fectchCourseDetailsData();
  }, [user, course]);
  
    
  const handleBuyCourse = async() => {
     if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't buy a course.")
      return
    }
    if (user) {
      const toastId = toast.loading("Loading...");
      try {
        const res = await apiConnector("GET", `http://localhost:9090/api/cours/inscription?etudiantId=${user.id}&coursId=${courseId}`);
       // console.log("tttttttttttttttttttttttt")
       // console.log(res)
       
          navigate("/dashboard/enrolled-courses");
       
      } catch (error) {
        console.error("Enrollment failed", error);
        toast.error("Something went wrong");
      } finally {
        toast.dismiss(toastId);
        return;
      }
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to Purchase Course.",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
    return;
  }
  
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

  //// console.log("Student already enrolled ", course?.studentsEnroled, user?.id)

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
          {/* <div className="flex flex-col gap-4">
         { user && isEnrolled ?
                <button  className="yellowButton outline-none"
                onClick={
                    () => navigate("/dashboard/enrolled-courses")
                    }
                  >Go To Course</button>
              
            :
              <button onClick={handleBuyCourse} className="blackButton outline-none">
                Enroll Corse 
              </button>
            }
          </div> */}

      

         

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

export default ViewCourseDetailsCard