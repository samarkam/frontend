import { useEffect, useState } from "react"
import { VscAdd } from "react-icons/vsc"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { fetchUsers} from "../../../services/operations/courseDetailsAPI"
import IconBtn from "../../common/IconBtn"
import UsersTable from "./AdminUsers/UsersTable"



export default function AdminUsers() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [Users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchAllUsers = async () => {
      setLoading(true);
      const result = await fetchUsers(token)
      console.log('all Users  ', result);
      setLoading(false);
      if (result) {
        setUsers(result)
      }
    }
    fetchAllUsers()
  }, [])


  // Scroll to the top of the page when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  return (
    <div>
      <div className="mb-14 flex justify-between">
        {/* <div className="mb-14 flex items-center justify-between"> */}
        <h1 className="text-4xl font-medium text-richblack-5 font-boogaloo text-center lg:text-left">Platform Users</h1>
      </div>

      {/* course Table */}
      {Users && <UsersTable Users={Users} setUsers={setUsers} loading={loading} setLoading={setLoading} />}
    </div>
  )
}