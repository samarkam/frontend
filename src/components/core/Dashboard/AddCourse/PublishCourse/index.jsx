import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toggleCoursePublished } from "../../../../../services/operations/courseDetailsAPI";
import { resetCourseState, setStep } from "../../../../../slices/courseSlice";
import IconBtn from "../../../../common/IconBtn";

export default function PublishCourse() {
  const { register, handleSubmit, setValue } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { course } = useSelector((state) => state.course);

  // Pre-fill the published status
  useEffect(() => {
    setValue("isPublished", course.published);
  }, [course.published, setValue]);

  // Navigate back
  const goBack = () => {
    dispatch(setStep(2));
  };

  // Navigate to courses
  const goToCourses = () => {
    dispatch(resetCourseState());
    navigate("/dashboard/my-courses");
  };

  // Handle publishing
  const handlePublish = async (data) => {
    if (course.published === data.isPublished) {
      goToCourses();
      return;
    }

    const result = await toggleCoursePublished(course.id, data.isPublished, token);
    if (result) {
      dispatch(setCourse(result));
      goToCourses();
    }
  };

  // Form submission
  const onSubmit = (data) => {
    handlePublish(data);
  };

  return (
    <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Publish Settings</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Checkbox */}
        <div className="my-6 mb-8">
          <label htmlFor="isPublished" className="inline-flex items-center text-lg">
            <input
              type="checkbox"
              id="isPublished"
              {...register("isPublished")}
              className="border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5"
            />
            <span className="ml-2 text-richblack-400">
              Make this course public
            </span>
          </label>
        </div>

        {/* Navigation Buttons */}
        <div className="ml-auto flex max-w-max items-center gap-x-4">
          <button
            type="button"
            onClick={goBack}
            className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
          >
            Back
          </button>
          <IconBtn text="Save Changes" />
        </div>
      </form>
    </div>
  );
}