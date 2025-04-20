import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdNavigateNext } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  createSection,
  updateSection,
} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse, setEditCourse, setStep } from "../../../../../slices/courseSlice";
import IconBtn from "../../../../common/IconBtn";
import NestedView from "./NestedView";

export default function CourseBuilderForm() {

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [editChapterId, setEditChapterId] = useState(null);

  // Handle form submission for creating or updating a chapter
  const onSubmit = async (data) => {
    setLoading(true);
    let result;

    const chapterData = {
      titre: data.chapterTitle,
      description: data.chapterDescription,
      maxScore: parseInt(data.maxScore, 10),
      ordre: parseInt(data.ordre, 10),
      coursId: course.id,
    };

    if (editChapterId) {
      // Update existing chapter
      result = await updateSection(
        { id: editChapterId, ...chapterData }
      );
    } else {
      // Create new chapter
      result = await createSection(chapterData);
    }

    if (result) {
      dispatch(setCourse(result));
      setEditChapterId(null);
      setValue("chapterTitle", "");
      setValue("chapterDescription", "");
      setValue("maxScore", "");
      setValue("ordre", "");
    }
    setLoading(false);
  };



  useEffect(() => {
    if (!editChapterId) {
      setValue("maxScore", 100);
      setValue("ordre", (course?.chapitres?.length  ? course?.chapitres?.length  : 0) + 1);
    }
  }, [editChapterId, course?.chapitres?.length, setValue]);



  // Cancel editing a chapter
  const cancelEdit = () => {
    setEditChapterId(null);
    setValue("chapterTitle", "");
    setValue("chapterDescription", "");
    setValue("maxScore", "");
    setValue("ordre", "");
  };

  // Start editing a chapter
  const handleChangeEditChapter = (chapterId, chapter) => {
    if (editChapterId === chapterId) {
      cancelEdit();
      return;
    }
    setEditChapterId(chapterId);
    setValue("chapterTitle", chapter.titre);
    setValue("chapterDescription", chapter.description);
    setValue("maxScore", chapter.maxScore);
    setValue("ordre", chapter.ordre);
  };

  // Navigate to the next step
  const goToNext = () => {
    if (course?.chapitres?.length === 0) {
      toast.error("Please add at least one chapter");
      return;
    }
    if (course?.chapitres.some((chapter) => chapter.resourceList?.length === 0)) {
      toast.error("Please add at least one resource in each chapter");
      return;
    }
    dispatch(setStep(3));
  };

  // Navigate back to the previous step
  const goBack = () => {
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  };

  return (
    <div className="space-y-8 rounded-2xl border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Chapter Title */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="chapterTitle">
            Chapter Title <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="chapterTitle"
            disabled={loading}
            placeholder="Enter Chapter Title"
            {...register("chapterTitle", { required: true })}
            className="form-style w-full"
          />
          {errors.chapterTitle && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Chapter title is required
            </span>
          )}
        </div>

        {/* Chapter Description */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="chapterDescription">
            Chapter Description <sup className="text-pink-200">*</sup>
          </label>
          <textarea
            id="chapterDescription"
            disabled={loading}
            placeholder="Enter Chapter Description"
            {...register("chapterDescription", { required: true })}
            className="form-style resize-x-none min-h-[130px] w-full"
          />
          {errors.chapterDescription && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Chapter description is required
            </span>
          )}
        </div>

        <div className="flex gap-4">
  {/* Max Score */}
  <div className="flex flex-col w-1/2 space-y-2">
    <label className="text-sm text-richblack-5" htmlFor="maxScore">
      Max Score <sup className="text-pink-200">*</sup>
    </label>
    <input
      id="maxScore"
      type="number"
      placeholder="Enter Max Score"
      disabled
      value={editChapterId ? undefined : 100}
      {...register("maxScore", {
        required: true,
        valueAsNumber: true,
        min: { value: 1, message: "Max score must be at least 1" },
      })}
      className={`form-style w-full ${!editChapterId ? "bg-richblack-700 text-richblack-300" : ""}`}
    />
    {errors.maxScore && (
      <span className="ml-2 text-xs tracking-wide text-pink-200">
        {errors.maxScore.message || "Max score is required"}
      </span>
    )}
  </div>

  {/* Order */}
  <div className="flex flex-col w-1/2 space-y-2">
    <label className="text-sm text-richblack-5" htmlFor="ordre">
      Order <sup className="text-pink-200">*</sup>
    </label>
    <input
      id="ordre"
      type="number"
      placeholder="Enter Order"
      disabled
      value={editChapterId ? undefined : (course?.chapitres?.length  ? course?.chapitres?.length  : 0)  + 1}
      {...register("ordre", {
        required: true,
        valueAsNumber: true,
        min: { value: 1, message: "Order must be at least 1" },
      })}
      className={`form-style w-full ${!editChapterId ? "bg-richblack-700 text-richblack-300" : ""}`}
    />
    {errors.ordre && (
      <span className="ml-2 text-xs tracking-wide text-pink-200">
        {errors.ordre.message || "Order is required"}
      </span>
    )}
  </div>
</div>


        {/* Create/Update Chapter Button */}
        <div className="flex items-end gap-x-4">
          <IconBtn
            type="submit"
            disabled={loading}
            text={editChapterId ? "Edit Chapter" : "Create Chapter"}
            outline={true}
          >
            <IoAddCircleOutline size={20} className="text-yellow-50" />
          </IconBtn>
          {editChapterId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm text-richblack-300 underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Display Chapters and Resources */}
      {course?.chapitres?.length > 0 && (
        <NestedView handleChangeEditChapter={handleChangeEditChapter} />
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-end gap-x-3">
        <button
          onClick={goBack}
          className="rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
        >
          Back
        </button>
        <IconBtn disabled={loading} text="Next" onclick={goToNext}>
          <MdNavigateNext />
        </IconBtn>
      </div>
    </div>
  );
}