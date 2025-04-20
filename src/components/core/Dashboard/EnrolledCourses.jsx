import { useEffect, useState } from "react"
import ProgressBar from "@ramonak/react-progress-bar"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"
import Img from './../../common/Img';



export default function EnrolledCourses() {
  const { user } = useSelector((state) => state.profile)

  const navigate = useNavigate()

  const [enrolledCourses, setEnrolledCourses] = useState(null)

  // fetch all users enrolled courses
  const getEnrolledCourses = async () => {
    try {
      const res = await getUserEnrolledCourses(user);
      setEnrolledCourses(res);
     // console.log("ttttttttttttttttttttttttttttttttttttttttttttttttttt")
     // console.log(res)
    } catch (error) {
     // console.log("Could not fetch enrolled courses.", error);
    }
  };

  useEffect(() => {
    getEnrolledCourses();
  }, [])

  // Loading Skeleton
  const sklItem = () => {
    return (
      <div className="flex border border-richblack-700 px-5 py-3 w-full">
        <div className="flex flex-1 gap-x-4 ">
          <div className='h-14 w-14 rounded-lg skeleton '></div>

          <div className="flex flex-col w-[40%] ">
            <p className="h-2 w-[50%] rounded-xl  skeleton"></p>
            <p className="h-2 w-[70%] rounded-xl mt-3 skeleton"></p>
          </div>
        </div>

        <div className="flex flex-[0.4] flex-col ">
          <p className="h-2 w-[20%] rounded-xl skeleton mt-2"></p>
          <p className="h-2 w-[40%] rounded-xl skeleton mt-3"></p>
        </div>
      </div>
    )
  }

  // return if data is null
  if (enrolledCourses?.length == 0) {
    return (
      <p className="grid h-[50vh] w-full place-content-center text-center text-richblack-5 text-3xl">
        You have not enrolled in any course yet.
      </p>)
  }



  return (
    <>
      <div className="text-4xl text-richblack-5 font-boogaloo text-center sm:text-left">Enrolled Courses</div>
      {
        <div className="my-8 text-richblack-5">
          {/* Headings */}
          <div className="flex rounded-t-2xl bg-richblack-800 ">
            <p className="w-[38%] px-5 py-3">Course Name</p>
            <p className="w-1/3 px-2 py-3">description</p>
            <p className="flex-1 px-2 py-3">Progress</p>
          </div>


          {/* loading Skeleton */}
          {!enrolledCourses && <div >
            {sklItem()}
            {sklItem()}
            {sklItem()}
            {sklItem()}
            {sklItem()}
          </div>}

          {/* Course Names */}
          {
            enrolledCourses?.map((course, i, arr) => (
              course.active && course.published &&   (
              
              <div
                className={`flex flex-col sm:flex-row sm:items-center border border-richblack-700 ${i === arr.length - 1 ? "rounded-b-2xl" : "rounded-none"}`}
                key={i}
              >
                <div
                  className="flex sm:w-[38%] cursor-pointer items-center gap-4 px-5 py-3"
                  onClick={() => {
                    navigate(
                      `/view-course/${course?.id}/section/${course.chapitres?.[0]?.id}/sub-section/${course.chapitres?.[0]?.resourceList?.[0]?.id}`
                    )
                  }}
                >
                  <Img
                    src={course.image}
                    alt="course_img"
                    className="h-14 w-14 rounded-lg object-cover"
                  />

                  <div className="flex max-w-xs flex-col gap-2">
                    <p className="font-semibold">{course.titre}</p>
                   
                  </div>
                </div>

                {/* only for smaller devices */}
                {/* duration -  progress */}
                <div className='sm:hidden'>
                  <div className=" px-2 py-3">{course.description.length > 50
                        ? `${course.description.slice(0, 50)}...`
                        : course.description}</div>

                  <div className="flex sm:w-1/3 flex-col gap-2 px-2 py-3">
                    {/* {console.log('Course ============== ', course.progressPercentage)} */}

                    <p>Progress: {course.maxScore || 0}%</p>
                    <ProgressBar
                      completed={course.maxScore || 0}
                      height="8px"
                      isLabelVisible={false}
                    />
                  </div>
                </div>

                {/* only for larger devices */}
                {/* duration -  progress */}
                <div className="hidden w-1/3 sm:flex px-2 py-3">{course.description.length > 50
                        ? `${course.description.slice(0, 50)}...`
                        : course.description}</div>
                <div className="hidden sm:flex w-1/4 flex-col gap-2 px-2 py-3">
                  <p>Progress: {course.maxScore || 0}%</p>
                  <ProgressBar
                    completed={course.maxScore || 0}
                    height="8px"
                    isLabelVisible={false}
                  />
                </div>
              </div>
            )))
          }
        </div>
      }
    </>
  )
}