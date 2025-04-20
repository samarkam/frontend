// This will prevent authenticated users from accessing this route
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { ACCOUNT_TYPE } from "../../../utils/constants";

function OpenRoute({ children }) {
  const { user } =  useSelector((state) => state.profile);

  if (user === undefined) {
    // wait for the redux store to hydrate (or show a loading spinner)
    return children // or <Loader />
  }else   if (user === null) {
    return children
  } else {

    if(user?.accountType === ACCOUNT_TYPE.STUDENT){
          return <Navigate to="/dashboard/enrolled-courses" />

    }else if (user?.accountType === ACCOUNT_TYPE.INSTRUCTOR){
      return <Navigate to="/dashboard/instructor" />


    }else if (user?.accountType === ACCOUNT_TYPE.ADMIN){
      return <Navigate to="/dashboard/admin" />

    }






  }
}

export default OpenRoute