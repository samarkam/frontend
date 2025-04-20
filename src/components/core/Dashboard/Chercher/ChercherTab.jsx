import { useDispatch, useSelector } from "react-redux";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import { RiDeleteBin6Line, RiForbidLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { deleteCourse, fetchCourses, blockCourse } from "../../../../services/operations/courseDetailsAPI";
import ConfirmationModal from "../../../common/ConfirmationModal";
import Img from "../../../common/Img";
import toast from "react-hot-toast";
import { ACCOUNT_TYPE, COURSE_STATUS } from "../../../../utils/constants";
import { HiClock } from "react-icons/hi";
import axios from "axios";

export default function ChercherTab({ courses, setCourses, loading, setLoading }) {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [filters, setFilters] = useState({
    course: "",
    discipline: "",
    specialite: "",
    instructor: "",
    status: "",
  });
  const [disciplines, setDisciplines] = useState([]);
  const [specialites, setSpecialites] = useState([]);

  // Fetch disciplines and specialites on component mount
  useEffect(() => {
    const fetchDisciplines = async () => {
      try {
        const response = await axios.get("http://localhost:9090/api/dicipline");
        setDisciplines(response.data);
      } catch (error) {
        console.error("Error fetching disciplines:", error);
        toast.error("Failed to load disciplines");
      }
    };

    const fetchSpecialites = async () => {
      try {
        const response = await axios.get("http://localhost:9090/api/specialite");
        setSpecialites(response.data);
      } catch (error) {
        console.error("Error fetching specialites:", error);
        toast.error("Failed to load specialites");
      }
    };

    fetchDisciplines();
    fetchSpecialites();
  }, []);

  const handleCourseDelete = async (courseId) => {
    setLoading(true);
    const toastId = toast.loading("Deleting...");
    await deleteCourse({ courseId }, token);
    const result = await fetchCourses(token);
    if (result) setCourses(result);
    setConfirmationModal(null);
    setLoading(false);
    toast.dismiss(toastId);
  };

  const handleCourseBlock = async (courseId, blocked) => {
    setLoading(true);
    const toastId = toast.loading("Blocking...");
    await blockCourse({ courseId, blocked });
    const result = await fetchCourses(token);
    if (result) setCourses(result);
    setConfirmationModal(null);
    setLoading(false);
    toast.dismiss(toastId);
  };

  const handleFilterChange = (e, key) => {
    setFilters({ ...filters, [key]: e.target.value });
  };

  const filteredCourses = courses?.filter((course) =>
    course.titre.toLowerCase().includes(filters.course.toLowerCase()) &&
    course.specialite.dicipline.titre.toLowerCase().includes(filters.discipline.toLowerCase()) &&
    course.specialite.labelle.toLowerCase().includes(filters.specialite.toLowerCase()) &&
    `${course.enseignant.prenom} ${course.enseignant.nom}`.toLowerCase().includes(filters.instructor.toLowerCase()) &&
    (filters.status === "" ||
      (course.active && filters.status === "active") ||
      (!course.active && filters.status === "blocked"))
  );

  const skItem = () => (
    <div className="flex border-b border-richblack-800 px-6 py-8 w-full">
      <div className="flex flex-1 gap-x-4">
        <div className="h-[80px] min-w-[150px] rounded-xl skeleton"></div>
        <div className="flex flex-col w-[40%]">
          <p className="h-5 w-[50%] rounded-xl skeleton"></p>
          <p className="h-10 w-[60%] rounded-xl mt-3 skeleton"></p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Table className="rounded-2xl border border-richblack-800 w-full">
        <Thead>
          <Tr className="flex rounded-t-3xl border-b border-b-richblack-800 px-6 py-4 bg-richblack-900 gap-4">
            <Th className="w-[40%] text-left text-sm font-semibold uppercase text-richblack-100 py-2">
              Courses
              <input
                type="text"
                placeholder="Filter Courses"
                value={filters.course}
                onChange={(e) => handleFilterChange(e, "course")}
                className="mt-2 w-full rounded-md border border-richblack-600 bg-richblack-700 p-2 text-sm text-richblack-5"
              />
            </Th>
            <Th className="w-[18%] text-left text-sm font-semibold uppercase text-richblack-100 py-2">
              Discipline
              <select
                value={filters.discipline}
                onChange={(e) => handleFilterChange(e, "discipline")}
                className="mt-2 w-full rounded-md border border-richblack-600 bg-richblack-700 p-2 text-sm text-richblack-5"
              >
                <option value="">All Disciplines</option>
                {disciplines.map((discipline) => (
                  <option key={discipline.id} value={discipline.titre}>
                    {discipline.titre}
                  </option>
                ))}
              </select>
            </Th>
            <Th className="w-[18%] text-left text-sm font-semibold uppercase text-richblack-100 py-2">
              Specialite
              <select
                value={filters.specialite}
                onChange={(e) => handleFilterChange(e, "specialite")}
                className="mt-2 w-full rounded-md border border-richblack-600 bg-richblack-700 p-2 text-sm text-richblack-5"
              >
                <option value="">All Specialites</option>
                {specialites.map((specialite) => (
                  <option key={specialite.id} value={specialite.labelle}>
                    {specialite.labelle}
                  </option>
                ))}
              </select>
            </Th>
            <Th className="w-[15%] text-left text-sm font-semibold uppercase text-richblack-100 py-2">
              Instructor
              <input
                type="text"
                placeholder="Filter Instructor"
                value={filters.instructor}
                onChange={(e) => handleFilterChange(e, "instructor")}
                className="mt-2 w-full rounded-md border border-richblack-600 bg-richblack-700 p-2 text-sm text-richblack-5"
              />
            </Th>
            {user.accountType === ACCOUNT_TYPE.ADMIN ? (
              <Th className="w-[9%] text-left text-sm font-semibold uppercase text-richblack-100 py-2">
                Actions
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange(e, "status")}
                  className="mt-2 w-full rounded-md border border-richblack-600 bg-richblack-700 p-2 text-sm text-richblack-5"
                >
                  <option value="">All</option>
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                </select>
              </Th>
            ) : null}
          </Tr>
        </Thead>

        {loading && (
          <div>
            {skItem()}
            {skItem()}
          </div>
        )}
        <Tbody>
          {!loading && filteredCourses?.length === 0 ? (
            <Tr>
              <Td className="py-10 text-center text-2xl font-medium text-richblack-100" colSpan={5}>
                No courses found
              </Td>
            </Tr>
          ) : (
            filteredCourses?.map((course) => (
              <Tr key={course.id} className="flex border-b border-richblack-800 px-6 py-6 gap-4">
                <Td className="w-[40%] flex gap-x-4 items-center" onClick={() => navigate(`/courses/view/${course.id}`)}>
                  <Img
                    src={course?.image}
                    alt={course?.titre}
                    className="h-[80px] min-w-[150px] rounded-lg object-cover"
                  />
                  <div className="flex flex-col">
                    <p className="text-lg font-semibold text-richblack-5 capitalize">{course.titre}</p>
                    <p className="text-xs text-richblack-300" hidden>
                      {course.description.length > 20
                        ? course.description.slice(0, 20) + "..."
                        : course.description}
                    </p>
                  </div>
                </Td>
                <Td className="w-[18%] text-sm font-medium text-richblack-100">
                  {course.specialite.dicipline.titre}
                </Td>
                <Td className="w-[18%] text-sm font-medium text-richblack-100">
                  {course.specialite.labelle}
                </Td>
                <Td className="w-[15%] text-sm font-medium text-richblack-100">
                  {course.enseignant.prenom} {course.enseignant.nom}
                </Td>
                {user.accountType === ACCOUNT_TYPE.ADMIN ? (
                  <Td className="w-[9%] text-sm font-medium text-richblack-100">
                    <p
                      className={`flex w-fit flex-row items-center rounded-full bg-richblack-700 px-1 py-[1px] text-[12px] font-medium ${
                        course.active ? "text-yellow-100" : "text-pink-100"
                      }`}
                    >
                      {course.active ? "Active " : "Blocked "}
                      <button
                        disabled={loading}
                        onClick={() => {
                          setConfirmationModal({
                            text1: course.active ? "Do you want to block this course?" : "Do you want to activate this course?",
                            text2: course.active
                              ? "No one can access the data related to this course"
                              : "Everyone will be able to access the data related to this course",
                            btn1Text: !loading ? (course.active ? "Block" : "Activate") : "Loading...",
                            btn2Text: "Cancel",
                            btn1Handler: !loading ? () => handleCourseBlock(course.id, course.active) : () => {},
                            btn2Handler: !loading ? () => setConfirmationModal(null) : () => {},
                          });
                        }}
                        title={course.active ? "Block " : "Activate "}
                        className="transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300"
                      >
                        <RiForbidLine size={15} />
                      </button>
                    </p>
                  </Td>
                ) : null}
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}