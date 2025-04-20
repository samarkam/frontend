import { useEffect, useState } from "react"
import { VscAdd } from "react-icons/vsc"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { fetchCourses} from "../../../services/operations/courseDetailsAPI"
import IconBtn from "../../common/IconBtn"
import ChercherTab from "./Chercher/ChercherTab"



export default function Chercher() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchAllCourses = async () => {
      setLoading(true);
      const result = await fetchCourses(token)
      console.log('all courses  ', result);
      setLoading(false);
      if (result) {
        setCourses(result)
      }
    }
    fetchAllCourses()
  }, [])


  // Scroll to the top of the page when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  return (
    <div>
      <div className="mb-14 flex justify-between">
        {/* <div className="mb-14 flex items-center justify-between"> */}
        <h1 className="text-4xl font-medium text-richblack-5 font-boogaloo text-center lg:text-left">Platform Courses</h1>
      </div>

      {/* course Table */}
      {courses && <ChercherTab courses={courses} setCourses={setCourses} loading={loading} setLoading={setLoading} />}
    </div>
  )
}