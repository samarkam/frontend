import { toast } from "react-hot-toast"

import { updateCompletedLectures } from "../../slices/viewCourseSlice"
// import { setLoading } from "../../slices/profileSlice";
import { apiConnector } from "../apiConnector"
import { courseEndpoints } from "../apis"
import { ACCOUNT_TYPE } from "../../utils/constants"
import { useNavigate } from "react-router-dom"


const {
  COURSE_DETAILS_API,
  COURSE_CATEGORIES_API,
  GET_ALL_COURSE_API,
  CREATE_COURSE_API,
  EDIT_COURSE_API,
  CREATE_SECTION_API,
  CREATE_SUBSECTION_API,
  UPDATE_SECTION_API,
  UPDATE_SUBSECTION_API,
  DELETE_SECTION_API,
  DELETE_SUBSECTION_API,
  GET_ALL_INSTRUCTOR_COURSES_API,

  GET_ALL_COURSES_API,
  GET_ALL_STU_API,
  GET_ALL_ENS_API,

  DELETE_COURSE_API,
  GET_FULL_COURSE_DETAILS_AUTHENTICATED,
  CREATE_RATING_API,
  LECTURE_COMPLETION_API,
} = courseEndpoints



export const toggleCoursePublished = async (courseId, isPublished, navigate) => {

  try {
    const response = await fetch(
      `http://localhost:9090/api/cours/${courseId}/toggle-published?isPublished=${isPublished}`,
      {
        method: "PUT",
       
      }
    );
    if (!response.ok) throw new Error("Failed to toggle published status");
      navigate("/dashboard/my-courses");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// ================ get All Courses ================
export const getAllCourses = async () => {
  const toastId = toast.loading("Loading...")
  let result = []

  try {
    const response = await apiConnector("GET", GET_ALL_COURSE_API)
    if (!response?.data) {
      throw new Error("Could Not Fetch Course Categories")
    }
    result = response?.data?.data
  } catch (error) {
   // console.log("GET_ALL_COURSE_API API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}


// ================ fetch Course Details ================
export const fetchCourseDetails = async (courseId) => {
  // const toastId = toast.loading('Loading')
  //   dispatch(setLoading(true));
  let result = null;

  try {
    const response = await apiConnector("Get", /* COURSE_DETAILS_API, { courseId, } */  `http://localhost:9090/api/cours/${courseId}`)
   // console.log("COURSE_DETAILS_API API RESPONSE............", response.data)

    if (!response.data) {
      throw new Error(response.data.message)
    }
    result = response.data
  } catch (error) {
   // console.log("COURSE_DETAILS_API API ERROR............", error)
    result = error.response.data
    // toast.error(error.response.data.message);
  }
  // toast.dismiss(toastId)
  //   dispatch(setLoading(false));
  return result
}

// ================ fetch Course Categories ================
export const fetchCourseCategories = async () => {
  let result = []

  try {
    const response = await apiConnector("GET", COURSE_CATEGORIES_API)
   // console.log("COURSE_CATEGORIES_API RESPONSE............", response)
    if (!response?.data) {
      throw new Error("Could Not Fetch Course Categories")
    }
    result = response?.data
  } catch (error) {
   // console.log("COURSE_CATEGORY_API API ERROR............", error)
    toast.error(error.message)
  }
  return result
}


// ================ add Course Details ================
export const addCourseDetails = async (data, token) => {
  const toastId = toast.loading("Loading...")
  let result = null;

  try {
    const response = await apiConnector("POST", "http://localhost:9090/api/cours/cours/new", data)
   // console.log("CREATE COURSE API RESPONSE............", response)

    if (!response?.data) {
      throw new Error("Could Not Add Course Details")
    }

    result = response?.data
    toast.success("Course Details Added Successfully")
  } catch (error) {
   // console.log("CREATE COURSE API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}


// ================ edit Course Details ================
export const editCourseDetails = async (courseId, data, token) => {
  try {
    const response = await apiConnector("PUT" , `http://localhost:9090/api/cours/cours/${courseId}`, data);
    if (!response.data) throw new Error("Failed to update course");
    return  response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};



// ================ create Chapitre ================
export const createSection = async (data) => {
  let result = null
  const toastId = toast.loading("Loading...")

  try {
    const response = await apiConnector("POST","http://localhost:9090/api/cours/chapitre/new", data)
   // console.log("CREATE SECTION API RESPONSE............", response.data)

    if (!response?.data) {
      throw new Error("Could Not Create Section")
    }

    result = response?.data
    toast.success("Course Chapter Created")
  } catch (error) {
   // console.log("CREATE SECTION API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}


// ================ create resource ================
export const createSubSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")

  try {
    const response = await apiConnector("POST", "http://localhost:9090/api/cours/resource/new", data)
   // console.log("CREATE SUB-SECTION API RESPONSE............", response)

    if (!response?.data) {
      throw new Error("Could Not Add Lecture")
    }

    result = response?.data
    toast.success("Lecture Added")
  } catch (error) {
   // console.log("CREATE SUB-SECTION API ERROR............", error)
    toast.error(error.response)
  }
  toast.dismiss(toastId)
  return result
}


// ================ Update Chapitre ================
export const updateSection = async (data) => {
  let result = null
  const toastId = toast.loading("Loading...")

  try {
    const response = await apiConnector("PUT", `http://localhost:9090/api/cours/chapitre/${data.id}`, data, )
   // console.log("UPDATE SECTION API RESPONSE............", response)

    if (!response?.data) {
      throw new Error("Could Not Update Section")
    }

    result = response?.data
    toast.success("Course Chapter Updated")
  } catch (error) {
   // console.log("UPDATE SECTION API ERROR............", error)
    // toast.error(error.response)
    toast.error(error.response?.data || "Failed to update chapter");

  }
  toast.dismiss(toastId)
  return result
}


// ================ Update SubSection ================
export const updateSubSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")

  try {
    const response = await apiConnector("PUT", `http://localhost:9090/api/cours/resource/${data.id}`, data,)
   // console.log("UPDATE SUB-SECTION API RESPONSE............", response)

    if (!response?.data) {
      throw new Error("Could Not Update Lecture")
    }

    result = response?.data?.data
    toast.success("Lecture Updated")
  } catch (error) {
   // console.log("UPDATE SUB-SECTION API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}


// ================ delete Section ================
export const deleteSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")

  try {
    const response = await apiConnector("POST", DELETE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
   // console.log("DELETE SECTION API RESPONSE............", response)

    if (!response?.data?.success) {
      throw new Error("Could Not Delete Section")
    }

    result = response?.data?.data
    toast.success("Course Section Deleted")
  } catch (error) {
   // console.log("DELETE SECTION API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}


// ================ delete SubSection ================
export const deleteSubSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", DELETE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
   // console.log("DELETE SUB-SECTION API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Lecture")
    }
    result = response?.data?.data
    toast.success("Lecture Deleted")
  } catch (error) {
   // console.log("DELETE SUB-SECTION API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

// ================ fetch Instructor Courses ================
export const fetchInstructorCourses = async (user) => {
  let result = []
  // const toastId = toast.loading("Loading...")
  try {
    if (user) {
    const response  = await apiConnector(
      "GET",
      `http://localhost:9090/api/cours/my-courses?email=${user.email}`
    );


   // console.log("INSTRUCTOR COURSES API RESPONSE", response?.data)
    result = response?.data

    }

    console.log("INSTRUCTOR COURSES API RESPONSE", response)
    if (!response?.data) {
      throw new Error("Could Not Fetch Instructor Courses")
    }

  } catch (error) {
   // console.log("INSTRUCTOR COURSES API ERROR............", error)
    toast.error(error.response)
  }
  return result
}

export const fetchCourses = async (token) => {
  let result = []
  // const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_COURSES_API,
    )
    console.log("COURSES API RESPONSE", response)
    if (!response?.data) {
      throw new Error("Could Not Fetch Instructor Courses")
    }
    result = response?.data
  } catch (error) {
    console.log("COURSES API ERROR............", error)
    toast.error(error.message)
  }
  return result
}


export const fetchUsers = async (token) => {
  let result = [];
  try {
    const etudiants = await apiConnector("GET", GET_ALL_STU_API);
    console.log("COURSES API etudiants", etudiants);
    if (!etudiants?.data) {
      throw new Error("Could Not Fetch Students");
    }
    // Add accountType to each student
    const studentsWithType = etudiants.data.map((student) => ({
      ...student,
      accountType: ACCOUNT_TYPE.STUDENT,
    }));
    result = [...studentsWithType];
  } catch (error) {
    console.log("STUDENTS API ERROR............", error);
    toast.error(error.message);
  }

  try {
    const teachers = await apiConnector("GET", GET_ALL_ENS_API);
    console.log("COURSES API teachers", teachers);
    if (!teachers?.data) {
      throw new Error("Could Not Fetch Teachers");
    }
    // Add accountType to each teacher
    const teachersWithType = teachers.data.map((teacher) => ({
      ...teacher,
      accountType: ACCOUNT_TYPE.INSTRUCTOR,
    }));
    result = [...result, ...teachersWithType];
  } catch (error) {
    console.log("TEACHERS API ERROR............", error);
    toast.error(error.message);
  }

  return result;
};


// ================ delete Course ================
export const deleteCourse = async (data, token) => {
  // const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("DELETE", DELETE_COURSE_API, data, {
      Authorization: `Bearer ${token}`,
    })
   // console.log("DELETE COURSE API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Course")
    }
    toast.success("Course Deleted")
  } catch (error) {
   // console.log("DELETE COURSE API ERROR............", error)
    toast.error(error.message)
  }
  // toast.dismiss(toastId)
}

export const deleteUser = async (data, token) => {
  // const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("DELETE", "", data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("DELETE User API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Delete User")
    }
    toast.success("User Deleted")
  } catch (error) {
    console.log("DELETE User API ERROR............", error)
    toast.error(error.message)
  }
  // toast.dismiss(toastId)
}

export const blockCourse = async (data) => {
  // const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("PUT", `http://localhost:9090/api/cours/${data.courseId}/toggle-active?isActive=${!data.blocked}`)
    console.log("Block COURSE API RESPONSE............", response)
    if (!response?.data) {
      throw new Error("Could Not Block Course")
    }
    const blockStatus = data.blocked ? 'Blocked' : 'Active';
    toast.success("Course "+blockStatus)
  } catch (error) {
    console.log("Block COURSE API ERROR............", error)
    toast.error(error.message)
  }
  // toast.dismiss(toastId)
}

export const blockUser = async (data) => {
  // const toastId = toast.loading("Loading...")/5/block?isBlocked=true'
  try {
    const response = await apiConnector("PUT", `http://localhost:9090/api/users/${data.id}/block?isBlocked=${!data.blocked}`)
    console.log("Block USER API RESPONSE............", response)
    if (!response?.data) {
      throw new Error("Could Not Block User")
    }
    const blockStatus = !data.blocked ? 'Blocked' : 'Active';
    toast.success("User "+blockStatus)
  } catch (error) {
    console.log("Block User API ERROR............", error)
    toast.error(error.message)
  }
  // toast.dismiss(toastId)
}

// ================ get Full Details Of Course ================
export const getFullDetailsOfCourse = async (courseId, token) => {
  // const toastId = toast.loading("Loading...")
  //   dispatch(setLoading(true));
  let result = null
  try {
    const response = await apiConnector(
      "GEt",
      `http://localhost:9090/api/cours/${courseId}`)
   // console.log("getFullDetailsOfCourse API RESPONSE............", response)

    if (!response.data) {
      throw new Error(response.data.message)
    }
    result = response?.data
  } catch (error) {
   // console.log("getFullDetailsOfCourse API ERROR............", error)
    result = error.response.data
    // toast.error(error.response.data.message);
  }
  // toast.dismiss(toastId)
  //   dispatch(setLoading(false));
  return result
}


// ================ mark Lecture As Complete ================
export const markLectureAsComplete = async (data) => {
  let result = null
  //// console.log("mark complete data", data)
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", LECTURE_COMPLETION_API, data)
   // console.log("MARK_LECTURE_AS_COMPLETE_API API RESPONSE............", response)

    if (!response.data.message) {
      throw new Error(response.data.error)
    }
    toast.success("Lecture Completed")
    result = true
  } catch (error) {
   // console.log("MARK_LECTURE_AS_COMPLETE_API API ERROR............", error)
    toast.error(error.message)
    result = false
  }
  toast.dismiss(toastId)
  return result
}


// ================ create Course Rating  ================
export const createRating = async (data) => {
  const toastId = toast.loading("Loading...")
  let success = false
  try {
    // const response = await apiConnector("POST", CREATE_RATING_API, data, {
    //   Authorization: `Bearer ${token}`,
    // })
    //// console.log("CREATE RATING API RESPONSE............", response)
    // if (!response?.data?.success) {
    //   throw new Error("Could Not Create Rating")
    // }
    toast.success("Rating Created")
    success = true
  } catch (error) {
    success = false
   // console.log("CREATE RATING API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return success
}