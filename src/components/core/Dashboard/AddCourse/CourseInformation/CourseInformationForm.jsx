import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { MdNavigateNext } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { addCourseDetails, editCourseDetails, fetchCourseCategories } from "../../../../../services/operations/courseDetailsAPI";
import { setCourse, setStep } from "../../../../../slices/courseSlice";
import IconBtn from "../../../../common/IconBtn";

export default function CourseInformationForm() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.profile.user);
  const { course, editCourse } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);
  const [disciplines, setDisciplines] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [selectedDisciplineId, setSelectedDisciplineId] = useState(null);
  const [showDisciplineModal, setShowDisciplineModal] = useState(false);
  const [showSpecialtyModal, setShowSpecialtyModal] = useState(false);

  // Discipline creation form
  const {
    register: registerDiscipline,
    handleSubmit: handleDisciplineSubmit,
    formState: { errors: disciplineErrors },
    reset: resetDiscipline,
  } = useForm();

  // Specialty creation form
  const {
    register: registerSpecialty,
    handleSubmit: handleSpecialtySubmit,
    formState: { errors: specialtyErrors },
    reset: resetSpecialty,
  } = useForm();

  // Fetch disciplines
  const fetchDisciplines = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:9090/api/dicipline", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data?.length > 0) {
        setDisciplines(data);
      }
    } catch (error) {
      console.error("Error fetching disciplines:", error);
      toast.error("Failed to fetch disciplines.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch specialties
  const fetchSpecialties = async () => {
    if (selectedDisciplineId) {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:9090/api/dicipline");
        const data = await response.json();
        const discipline = data.find((d) => d.id === Number(selectedDisciplineId));
        if (discipline?.specialiteList?.length > 0) {
          setSpecialties(discipline.specialiteList);
        } else {
          setSpecialties([]);
        }
      } catch (error) {
        console.error("Error fetching specialties:", error);
        toast.error("Failed to fetch specialties.");
      } finally {
        setLoading(false);
      }
    } else {
      setSpecialties([]);
    }
  };

  // Initial data fetch and form pre-fill
  useEffect(() => {
    // Pre-fill form fields when editing
    if (editCourse && course) {
      setValue("courseTitle", course.titre);
      setValue("courseDescription", course.description);
      setValue("courseImage", course.image);
      setValue("enseignantEmail", course.enseignant?.email || user.email);
      setValue("specialiteId", course.specialite?.id);
      setValue("disciplineId", course.specialite?.dicipline?.id);
      setSelectedDisciplineId(course.specialite?.dicipline?.id);
    }

    fetchDisciplines();
    fetchSpecialties();
  }, [editCourse, course, user.email, setValue, token, selectedDisciplineId]);

  // Check if form has been updated
  const isFormUpdated = () => {
    const currentValues = getValues();
    return (
      currentValues.courseTitle !== course.titre ||
      currentValues.courseDescription !== course.description ||
      currentValues.courseImage !== course.image ||
      currentValues.enseignantEmail !== course.enseignant?.email ||
      currentValues.specialiteId !== course.specialite?.id ||
      currentValues.disciplineId !== course.specialite?.dicipline?.id
    );
  };

  // Handle discipline creation
  const onDisciplineSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:9090/api/dicipline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titre: data.titre,
          description: data.description,
          image: data.image,
        }),
      });
      if (response.ok) {
        toast.success("Discipline created successfully!");
        await fetchDisciplines();
        setShowDisciplineModal(false);
        resetDiscipline();
      } else {
        throw new Error("Failed to create discipline");
      }
    } catch (error) {
      console.error("Error creating discipline:", error);
      toast.error("Failed to create discipline.");
    } finally {
      setLoading(false);
    }
  };

  // Handle specialty creation
  const onSpecialtySubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:9090/api/specialite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          diciplineId: Number(selectedDisciplineId),
          labelle: data.labelle,
          image: data.image,
        }),
      });
      if (response.ok) {
        toast.success("Specialty created successfully!");
        await fetchSpecialties();
        setShowSpecialtyModal(false);
        resetSpecialty();
      } else {
        throw new Error("Failed to create specialty");
      }
    } catch (error) {
      console.error("Error creating specialty:", error);
      toast.error("Failed to create specialty.");
    } finally {
      setLoading(false);
    }
  };

  // Handle main form submission
  const onSubmit = async (data) => {
    // No changes in edit mode
    if (editCourse && !isFormUpdated()) {
      toast.error("No changes made to the form");
      return;
    }

    // Required field check
    const requiredFields = [
      "courseTitle",
      "courseDescription",
      "courseImage",
      "disciplineId",
      "specialiteId",
    ];
    const missingFields = requiredFields.filter(
      (field) =>
        !data[field] ||
        (typeof data[field] === "string" && data[field].trim() === "") ||
        data[field] === undefined
    );

    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields.`);
      return;
    }

    // Validate image URL format
    const imageUrlRegex = /^https?:\/\/.+$/;
    if (!imageUrlRegex.test(data.courseImage)) {
      toast.error("Please provide a valid course image URL.");
      return;
    }

    const courseData = {
      titre: data.courseTitle,
      description: data.courseDescription,
      image: data.courseImage,
      enseignantEmail: data.enseignantEmail,
      specialiteId: Number(data.specialiteId),
      disciplineId: Number(data.disciplineId),
    };

    setLoading(true);
    try {
      let result = null;
      if (editCourse) {
        result = await editCourseDetails(course.id, courseData, token);
      } else {
        result = await addCourseDetails(courseData, token);
      }

      if (result) {
        dispatch(setCourse(result));
        dispatch(setStep(2)); // go to next step
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
      >
        {/* Course Title */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="courseTitle">
            Course Title <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="courseTitle"
            placeholder="Enter Course Title"
            {...register("courseTitle", { required: true })}
            className="form-style w-full"
          />
          {errors.courseTitle && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Course title is required
            </span>
          )}
        </div>

        {/* Course Description */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="courseDescription">
            Course Description <sup className="text-pink-200">*</sup>
          </label>
          <textarea
            id="courseDescription"
            placeholder="Enter Description"
            {...register("courseDescription", { required: true })}
            className="form-style resize-x-none min-h-[130px] w-full"
          />
          {errors.courseDescription && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Course description is required
            </span>
          )}
        </div>

        {/* Course Image URL */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="courseImage">
            Course Image URL <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="courseImage"
            placeholder="Enter Image URL"
            {...register("courseImage", {
              required: true,
              pattern: { value: /^https?:\/\/.+$/, message: "Invalid URL" },
            })}
            className="form-style w-full"
          />
          {errors.courseImage && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              {errors.courseImage.message || "Course image URL is required"}
            </span>
          )}
        </div>

        {/* Teacher Email */}
        <input
          type="hidden"
          {...register("enseignantEmail", { required: true })}
          defaultValue={user.email}
        />

        {/* Discipline */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="disciplineId">
            Discipline <sup className="text-pink-200">*</sup>
          </label>
          <select
            id="disciplineId"
            {...register("disciplineId", { required: true, valueAsNumber: true })}
            className="form-style w-full cursor-pointer"
            defaultValue=""
            onChange={(e) => {
              const value = e.target.value;
              if (value === "create") {
                setShowDisciplineModal(true);
              } else {
                setSelectedDisciplineId(Number(value));
              }
            }}
          >
            <option value="" disabled>
              Choose a Discipline
            </option>
            {!loading &&
              disciplines.map((discipline) => (
                <option key={discipline.id} value={discipline.id}>
                  {discipline.titre}
                </option>
              ))}
            <option value="create">Create New Discipline</option>
          </select>
          {errors.disciplineId && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Discipline is required
            </span>
          )}
        </div>

        {/* Specialty */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="specialiteId">
            Specialty <sup className="text-pink-200">*</sup>
          </label>
          <select
            id="specialiteId"
            {...register("specialiteId", { required: true, valueAsNumber: true })}
            className="form-style w-full cursor-pointer"
            defaultValue=""
            disabled={!selectedDisciplineId || specialties.length === 0}
            onChange={(e) => {
              if (e.target.value === "create") {
                setShowSpecialtyModal(true);
              }
            }}
          >
            <option value="" disabled>
              {specialties.length === 0 && selectedDisciplineId
                ? "No specialties available"
                : "Choose a Specialty"}
            </option>
            {!loading &&
              specialties.map((specialty) => (
                <option key={specialty.id} value={specialty.id}>
                  {specialty.labelle}
                </option>
              ))}
            {selectedDisciplineId && (
              <option value="create">Create New Specialty</option>
            )}
          </select>
          {errors.specialiteId && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Specialty is required
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-x-2">
          {editCourse && (
            <button
              type="button"
              onClick={() => dispatch(setStep(2))}
              disabled={loading}
              className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900 hover:bg-richblack-900 hover:text-richblack-300 duration-300"
            >
              Continue Without Saving
            </button>
          )}
          <IconBtn
            type="submit"
            disabled={loading}
            className="rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
            text={editCourse ? "Save Changes" : "Next"}
          >
            <MdNavigateNext />
          </IconBtn>
        </div>
      </form>

      {/* Discipline Creation Modal */}
      {showDisciplineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-richblack-800 p-6 rounded-md border border-richblack-700 w-full max-w-md">
            <h2 className="text-lg font-semibold text-richblack-5 mb-4">
              Create New Discipline
            </h2>
            <form onSubmit={handleDisciplineSubmit(onDisciplineSubmit)} className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="disciplineTitre">
                  Discipline Title <sup className="text-pink-200">*</sup>
                </label>
                <input
                  id="disciplineTitre"
                  placeholder="Enter Discipline Title"
                  {...registerDiscipline("titre", { required: true })}
                  className="form-style w-full"
                />
                {disciplineErrors.titre && (
                  <span className="ml-2 text-xs tracking-wide text-pink-200">
                    Discipline title is required
                  </span>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="disciplineDescription">
                  Description <sup className="text-pink-200">*</sup>
                </label>
                <textarea
                  id="disciplineDescription"
                  placeholder="Enter Description"
                  {...registerDiscipline("description", { required: true })}
                  className="form-style resize-x-none min-h-[100px] w-full"
                />
                {disciplineErrors.description && (
                  <span className="ml-2 text-xs tracking-wide text-pink-200">
                    Description is required
                  </span>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="disciplineImage">
                  Image URL <sup className="text-pink-200">*</sup>
                </label>
                <input
                  id="disciplineImage"
                  placeholder="Enter Image URL"
                  {...registerDiscipline("image", {
                    required: true,
                    pattern: { value: /^https?:\/\/.+$/, message: "Invalid URL" },
                  })}
                  className="form-style w-full"
                />
                {disciplineErrors.image && (
                  <span className="ml-2 text-xs tracking-wide text-pink-200">
                    {disciplineErrors.image.message || "Image URL is required"}
                  </span>
                )}
              </div>
              <div className="flex justify-end gap-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowDisciplineModal(false);
                    resetDiscipline();
                  }}
                  className="px-4 py-2 bg-richblack-300 text-richblack-900 rounded-md hover:bg-richblack-900 hover:text-richblack-300 duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-yellow-50 text-richblack-900 rounded-md hover:bg-yellow-100 duration-300"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Specialty Creation Modal */}
      {showSpecialtyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-richblack-800 p-6 rounded-md border border-richblack-700 w-full max-w-md">
            <h2 className="text-lg font-semibold text-richblack-5 mb-4">
              Create New Specialty
            </h2>
            <form onSubmit={handleSpecialtySubmit(onSpecialtySubmit)} className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="specialtyLabelle">
                  Specialty Name <sup className="text-pink-200">*</sup>
                </label>
                <input
                  id="specialtyLabelle"
                  placeholder="Enter Specialty Name"
                  {...registerSpecialty("labelle", { required: true })}
                  className="form-style w-full"
                />
                {specialtyErrors.labelle && (
                  <span className="ml-2 text-xs tracking-wide text-pink-200">
                    Specialty name is required
                  </span>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="specialtyImage">
                  Image URL <sup className="text-pink-200">*</sup>
                </label>
                <input
                  id="specialtyImage"
                  placeholder="Enter Image URL"
                  {...registerSpecialty("image", {
                    required: true,
                    pattern: { value: /^https?:\/\/.+$/, message: "Invalid URL" },
                  })}
                  className="form-style w-full"
                />
                {specialtyErrors.image && (
                  <span className="ml-2 text-xs tracking-wide text-pink-200">
                    {specialtyErrors.image.message || "Image URL is required"}
                  </span>
                )}
              </div>
              <div className="flex justify-end gap-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowSpecialtyModal(false);
                    resetSpecialty();
                  }}
                  className="px-4 py-2 bg-richblack-300 text-richblack-900 rounded-md hover:bg-richblack-900 hover:text-richblack-300 duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-yellow-50 text-richblack-900 rounded-md hover:bg-yellow-100 duration-300"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}