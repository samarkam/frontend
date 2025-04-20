import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import { useNavigate, useParams } from "react-router-dom"

import "video-react/dist/video-react.css"
import { BigPlayButton } from "video-react"
import ReactPlayer from 'react-player'

import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"
import { setCourseViewSidebar } from "../../../slices/sidebarSlice"

import IconBtn from "../../common/IconBtn"

import { HiMenuAlt1 } from 'react-icons/hi'
import { apiConnector } from "../../../services/apiConnector"


const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams()

  const navigate = useNavigate()
  const location = useLocation()
  const playerRef = useRef(null)
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.profile)

  const { token } = useSelector((state) => state.auth)
  const { courseSectionData, courseEntireData, completedLectures } = useSelector((state) => state.viewCourse)

  const [videoData, setVideoData] = useState([])
  const [previewSource, setPreviewSource] = useState("")
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ; (async () => {
      if (!courseSectionData.length) return
      
      if (!courseId && !sectionId && !subSectionId) {
        navigate(`/dashboard/enrolled-courses`)
      } else {

       // console.log("courseSectionData subSectionId", subSectionId) // ressource Id 
       // console.log("courseSectionData sectionId", sectionId) // chapitre id 
       // console.log("courseSectionData courseId", courseId) // course Id 
       // console.log("courseSectionData ", courseSectionData) // contains les chapitres
        const filteredData = courseSectionData.filter(
          (course) => String(course.id) === String(sectionId)
        )
       // console.log("filteredData", filteredData)
        
        const filteredVideoData = filteredData?.[0]?.resourceList?.filter(
          (data) => String(data.id) === String(subSectionId)
        )
       // console.log("resource = ", filteredVideoData)
        
        if (filteredVideoData?.length) setVideoData(filteredVideoData[0])
        setPreviewSource(courseEntireData.image)
        setVideoEnded(false)
      }
    })()
  }, [courseSectionData, courseEntireData, location.pathname])

  // check if the lecture is the first video of the course
  const isFirstVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex((data) => data.id == sectionId)

    const currentSubSectionIndx = courseSectionData[currentSectionIndx]?.resourceList.findIndex((data) => data.id == subSectionId)

    if (currentSectionIndx == 0 && currentSubSectionIndx == 0) {
      return true
    } else {
      return false
    }
  }

  // go to the next video
  const goToNextVideo = () => {
  // console.log(courseSectionData)

    const currentSectionIndx = courseSectionData.findIndex((data) => data.id == sectionId)
    const noOfSubsections = courseSectionData[currentSectionIndx]?.resourceList.length
   // console.log("no of subsections", noOfSubsections)

    const currentSubSectionIndx = courseSectionData[currentSectionIndx]?.resourceList.findIndex(
      (data) => data.id == subSectionId)



    // console.log("currentSectionIndx", currentSectionIndx)

    if (currentSubSectionIndx !== noOfSubsections - 1) {
      const nextSubSectionId = courseSectionData[currentSectionIndx].resourceList[currentSubSectionIndx + 1].id

      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`)
    } else {
      const nextSectionId = courseSectionData[currentSectionIndx + 1].id
      const nextSubSectionId = courseSectionData[currentSectionIndx + 1].resourceList[0].id
      navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`)
    }
  }

  // check if the lecture is the last video of the course
  const isLastVideo = () => {
   // console.log(courseSectionData)
   // console.log("sectionId:", sectionId.class)
    const currentSectionIndx = courseSectionData.findIndex((data) => data.id == sectionId)

    const noOfSubsections = courseSectionData[currentSectionIndx]?.resourceList.length
   // console.log("courseSectionData[currentSectionIndx]?.resourceList", courseSectionData[currentSectionIndx]?.resourceList)
   // console.log("no of subsections", noOfSubsections)

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ]?.resourceList.findIndex((data) => data.id == subSectionId)

   // console.log("currentSectionIndx", currentSectionIndx)

    if (
      currentSectionIndx == courseSectionData.length - 1 &&
      currentSubSectionIndx == noOfSubsections - 1
    ) {
      return true
    } else {
      return false
    }
  }

  // go to the previous video
  const goToPrevVideo = () => {
    //// console.log(courseSectionData)

    const currentSectionIndx = courseSectionData.findIndex((data) => data.id == sectionId)

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data.id == subSectionId)

    if (currentSubSectionIndx !== 0) {
      const prevSubSectionId = courseSectionData[currentSectionIndx].resourceList[currentSubSectionIndx - 1].id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
      )
    } else {
      const prevSectionId = courseSectionData[currentSectionIndx - 1].id
      const prevSubSectionLength = courseSectionData[currentSectionIndx - 1].resourceList.length
      const prevSubSectionId = courseSectionData[currentSectionIndx - 1].resourceList[prevSubSectionLength - 1].id
      navigate(
        `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
      )
    }
  }

  // handle Lecture Completion
  const handleLectureCompletion = async () => {
    setLoading(true)
    const res =  apiConnector("GET",   `http://localhost:9090/api/cours/inscription?etudiantId=${user.id}&coursId=${courseId}`)
    
   
    setLoading(false)
  }

  const { courseViewSidebar } = useSelector(state => state.sidebar)

  // this will hide course video , title , desc, if sidebar is open in small device
  // for good looking i have try this 
  if (courseViewSidebar && window.innerWidth <= 640) return;

  return (
    <div className="flex flex-col gap-5 text-white">

      {/* open - close side bar icons */}
      <div className="sm:hidden text-white absolute left-7 top-3 cursor-pointer " onClick={() => dispatch(setCourseViewSidebar(!courseViewSidebar))}>
        {
          !courseViewSidebar && <HiMenuAlt1 size={33} />
        }
      </div>


      {!videoData ? (
        <img
          src={previewSource}
          alt="Preview"
          className="h-full w-full rounded-md object-cover"
        />
      ) : (
        // <Player
        //   ref={playerRef}
        //   aspectRatio="16:9"
        //   playsInline
        //   autoPlay
        //   onEnded={() => setVideoEnded(true)}
        //   src={videoData?.videoUrl}
        // >

        <div  style={{
          height: '80vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>

        <ReactPlayer
        ref={playerRef}
        url={videoData?.url}
        controls
        playing
        onEnded={() => setVideoEnded(true)}
        width="100%"
        height="100%"
      />
        


          {/* Render When Video Ends */}
          {videoEnded && (
            <div
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
              }}
              className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter"
            >
              {!completedLectures?.includes(subSectionId) && (
                <IconBtn
                  disabled={loading}
                  onclick={() => handleLectureCompletion()}
                  text={!loading ? "Mark As Completed" : "Loading..."}
                  customClasses="text-xl max-w-max px-4 mx-auto"
                />
              )}
              <IconBtn
                disabled={loading}
                onclick={() => {
                  if (playerRef?.current) {
                    // set the current time of the video to 0
                    playerRef?.current?.seekTo(0)
                    setVideoEnded(false)
                  }
                }}
                text="Rewatch"
                customClasses="text-xl max-w-max px-4 mx-auto mt-2"
              />

              <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                {!isFirstVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToPrevVideo}
                    className="blackButton"
                  >
                    Prev
                  </button>
                )}
                {!isLastVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToNextVideo}
                    className="blackButton"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
           </div>
      )}

      <h1 className="mt-4 text-3xl font-semibold">{videoData?.titre}</h1>
      <p className="pt-2 pb-6">{videoData?.description}</p>
    </div>
  )
}

export default VideoDetails
