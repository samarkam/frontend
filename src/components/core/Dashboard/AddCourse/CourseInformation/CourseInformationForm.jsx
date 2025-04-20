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
  const [specialties, setSpecialties] = useState([]);

  // Fetch specialties (replacing course categories)
  useEffect(() => {
    const fetchSpecialties = async () => {
      setLoading(true);
      // Assume fetchCourseCategories returns specialties with id and labelle
      const response = await fetchCourseCategories(); // Adjust API call if needed
      if (response?.length > 0) {
        setSpecialties(response);
      }
      setLoading(false);
    };

    // Pre-fill form fields when editing
    if (editCourse && course) {
      setValue("courseTitle", course.titre);
      setValue("courseDescription", course.description);
      setValue("courseImage", course.image);
      setValue("enseignantEmail", course.enseignant?.email || user.email);
      setValue("specialiteId", course.specialite?.id);
    }

    fetchSpecialties();
  }, [editCourse, course, user.email, setValue]);

  // Check if form has been updated
  const isFormUpdated = () => {
    const currentValues = getValues();
    return (
      currentValues.courseTitle !== course.titre ||
      currentValues.courseDescription !== course.description ||
      currentValues.courseImage !== course.image ||
      currentValues.enseignantEmail !== course.enseignant?.email ||
      currentValues.specialiteId !== course.specialite?.id
    );
  };

  // Handle form submission
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
    ];
    const missingFields = requiredFields.filter((field) => {
      return !data[field] || (typeof data[field] === "string" && data[field].trim() === "");
    });
  
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
      specialiteId:  Number(data.specialiteId),
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
        >
           <option value="" disabled>
              Choose a Specialty
            </option>
          {!loading &&
            specialties.map((specialty) => (
              <option key={specialty.id} value={specialty.id}>
                {specialty.labelle}
              </option>
            ))}
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
        {/* <button
         type="submit"
          disabled={loading}
          onClick={() => dispatch(setStep(2))}
          className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900 hover:bg-richblack-900 hover:text-richblack-300 duration-300"
        >{editCourse ? "Save Changes" : "Next"}
          <MdNavigateNext />
        </button> */}

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
  );
}