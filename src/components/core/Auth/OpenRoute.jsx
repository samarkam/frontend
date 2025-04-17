// This will prevent authenticated users from accessing this route
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

function OpenRoute({ children }) {
  const { user } =  useSelector((state) => state.profile);

  if (user === undefined) {
    // wait for the redux store to hydrate (or show a loading spinner)
    return children // or <Loader />
  }else   if (user === null) {
    return children
  } else {
    return <Navigate to="/dashboard/my-profile" />
  }
}

export default OpenRoute