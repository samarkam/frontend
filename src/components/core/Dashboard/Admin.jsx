import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Img from "./../../common/Img";
import AdminChart from "./InstructorDashboard/AdminChart";

export default function Admin() {
  const { user } = useSelector((state) => state.profile);

  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);

  // Fetch data from APIs without authentication
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const studentsResponse = await fetch("http://localhost:9090/api/etudiant/list");
        const studentsData = await studentsResponse.json();
        setStudents(studentsData);

        const instructorsResponse = await fetch("http://localhost:9090/api/enseignant/list");
        const instructorsData = await instructorsResponse.json();
        setInstructors(instructorsData);

        const coursesResponse = await fetch("http://localhost:9090/api/cours/list");
        const coursesData = await coursesResponse.json();
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
      setLoading(false);
    })();
  }, []);

  // Calculate statistics
  const totalCourses = courses.length;
  const totalStudents = students.length;
  const totalInstructors = instructors.length;

  // Skeleton loading component
  const skItem = () => {
    return (
      <div className="mt-5 w-full flex flex-col justify-between rounded-xl">
        <div className="flex border p-4 border-richblack-600">
          <div className="w-full">
            <p className="w-[100px] h-4 rounded-xl skeleton"></p>
            <div className="mt-3 flex gap-x-5">
              <p className="w-[200px] h-4 rounded-xl skeleton"></p>
              <p className="w-[100px] h-4 rounded-xl skeleton"></p>
            </div>
            <div className="flex justify-center items-center flex-col">
              <div className="w-[80%] h-24 rounded-xl mt-5 skeleton"></div>
              <div className="w-60 h-60 rounded-full mt-4 grid place-items-center skeleton"></div>
            </div>
          </div>
          <div className="sm:flex hidden min-w-[250px] flex-col rounded-xl p-6 skeleton"></div>
        </div>
        <div className="flex flex-col gap-y-6 mt-5">
          <div className="flex justify-between">
            <p className="text-lg font-bold text-richblack-5 pl-5">Courses</p>
            <Link to="/dashboard/courses">
              <p className="text-xs font-semibold text-yellow-50 hover:underline pr-5">View All</p>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row gap-6">
            <p className="h-[201px] w-full rounded-xl skeleton"></p>
            <p className="h-[201px] w-full rounded-xl skeleton"></p>
            <p className="h-[201px] w-full rounded-xl skeleton"></p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-richblack-5 text-center sm:text-left">
          Hi {user?.prenom} 👋
        </h1>
        <p className="font-medium text-richblack-200 text-center sm:text-left">
          Let's manage your platform
        </p>
      </div>

      {loading ? (
        <div>{skItem()}</div>
      ) : totalCourses > 0 || totalStudents > 0 || totalInstructors > 0 ? (
        <div>
          <div className="my-4 flex h-[450px] space-x-4">
            {/* Chart Section */}
            {totalCourses > 0 ? (
              <AdminChart courses={courses} />
            ) : (
              <div className="flex-1 rounded-md bg-richblack-800 p-6">
                <p className="text-lg font-bold text-richblack-5">Visualize</p>
                <p className="mt-4 text-xl font-medium text-richblack-50">
                  Not Enough Data To Visualize
                </p>
              </div>
            )}

            {/* Statistics */}
            <div className="flex min-w-[250px] flex-col rounded-md bg-richblack-800 p-6">
              <p className="text-lg font-bold text-richblack-5">Statistics</p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-lg text-richblack-200">Total Courses</p>
                  <p className="text-3xl font-semibold text-richblack-50">{totalCourses}</p>
                </div>
                <div>
                  <p className="text-lg text-richblack-200">Total Students</p>
                  <p className="text-3xl font-semibold text-richblack-50">{totalStudents}</p>
                </div>
                <div>
                  <p className="text-lg text-richblack-200">Total Instructors</p>
                  <p className="text-3xl font-semibold text-richblack-50">{totalInstructors}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Courses Section */}
          <div className="rounded-md bg-richblack-800 p-6">
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-richblack-5">Courses</p>
              <Link to="/dashboard/courses">
                <p className="text-xs font-semibold text-yellow-50 hover:underline">View All</p>
              </Link>
            </div>

            <div className="my-4 flex flex-col sm:flex-row sm:space-x-6 space-y-6 sm:space-y-0">
              {courses.slice(0, 3).map((course) => (
                <div key={course.id} className="sm:w-1/3 flex flex-col items-center justify-center">
                  <Img
                    src={course.image}
                    alt={course.titre}
                    className="h-[201px] w-full rounded-2xl object-cover"
                  />
                  <div className="mt-3 w-full">
                    <p className="text-sm font-medium text-richblack-50">{course.titre}</p>
                    <div className="mt-1 flex items-center space-x-2">
                      <p className="text-xs font-medium text-richblack-300">
                        {course.enseignant?.prenom} {course.enseignant?.nom}
                      </p>
                      <p className="text-xs font-medium text-richblack-300">|</p>
                      <p className="text-xs font-medium text-richblack-300">
                        {course.chapitres?.length || 0} chapters
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-20 rounded-md bg-richblack-800 p-6 py-20">
          <p className="text-center text-2xl font-bold text-richblack-5">
            No data available yet
          </p>
          <Link to="/dashboard/add-course">
            <p className="mt-1 text-center text-lg font-semibold text-yellow-50">
              Create a course
            </p>
          </Link>
        </div>
      )}
    </div>
  );
}