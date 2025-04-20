import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import {
  createSubSection,
  updateSubSection,
} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import IconBtn from "../../../../common/IconBtn";

export default function SubSectionModal({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const { course } = useSelector((state) => state.course);

  // Pre-fill form for view or edit modes
  useEffect(() => {
    if (view || edit) {
      setValue("resourceTitle", modalData.titre);
      setValue("resourceDescription", modalData.description);
      setValue("resourceUrl", modalData.url);
      setValue("resourceType", modalData.typeRessource);
    }
  }, [view, edit, modalData, setValue]);

  // Check if form is updated
  const isFormUpdated = () => {
    const currentValues = getValues();
    return (
      currentValues.resourceTitle !== modalData.titre ||
      currentValues.resourceDescription !== modalData.description ||
      currentValues.resourceUrl !== modalData.url ||
      currentValues.resourceType !== modalData.typeRessource
    );
  };

  // Handle editing a resource
  const handleEditResource = async () => {
    const currentValues = getValues();
    const resourceData = {
      chapitreId: modalData.chapterId,
      titre: currentValues.resourceTitle,
      description: currentValues.resourceDescription,
      url: currentValues.resourceUrl,
      typeRessource: currentValues.resourceType,
    };

    setLoading(true);
    const result = await updateSubSection(
      { id: modalData.id, ...resourceData },
      token
    );
    if (result) {
      const updatedChapters = course.chapitres.map((chapter) =>
        chapter.id === modalData.chapterId ? result : chapter
      );
      dispatch(setCourse({ ...course, chapitres: updatedChapters }));
    }
    setModalData(null);
    setLoading(false);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    if (view) return;

    if (edit) {
      if (!isFormUpdated()) {
        toast.error("No changes made to the form");
        return;
      }
      await handleEditResource();
      return;
    }

    // Create new resource
    const resourceData = {
      chapitreId: modalData,
      titre: data.resourceTitle,
      description: data.resourceDescription,
      url: data.resourceUrl,
      typeRessource: data.resourceType,
    };

    setLoading(true);
    const result = await createSubSection(resourceData, token);
    if (result) {
      const updatedChapters = course.chapitres.map((chapter) =>
        chapter.id === modalData ? result : chapter
      );
      dispatch(setCourse({ ...course, chapitres: updatedChapters }));
    }
    else{
      setLoading(false);

    }
    setModalData(null);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Resource
          </p>
          <button onClick={() => (!loading ? setModalData(null) : {})}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>
        {/* Modal Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 px-8 py-10">
          {/* Resource Title */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="resourceTitle">
              Resource Title {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <input
              disabled={view || loading}
              id="resourceTitle"
              placeholder="Enter Resource Title"
              {...register("resourceTitle", { required: true })}
              className="form-style w-full"
            />
            {errors.resourceTitle && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Resource title is required
              </span>
            )}
          </div>

          {/* Resource Description */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="resourceDescription">
              Resource Description {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <textarea
              disabled={view || loading}
              id="resourceDescription"
              placeholder="Enter Resource Description"
              {...register("resourceDescription", { required: true })}
              className="form-style resize-x-none min-h-[130px] w-full"
            />
            {errors.resourceDescription && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Resource description is required
              </span>
            )}
          </div>

          {/* Resource URL */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="resourceUrl">
              Resource URL {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <input
              disabled={view || loading}
              id="resourceUrl"
              placeholder="Enter Resource URL"
              {...register("resourceUrl", {
                required: true,
                pattern: { value: /^https?:\/\/.+$/, message: "Invalid URL" },
              })}
              className="form-style w-full"
            />
            {errors.resourceUrl && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                {errors.resourceUrl.message || "Resource URL is required"}
              </span>
            )}
          </div>

          {/* Resource Type */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="resourceType">
              Resource Type {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <select
              disabled={view || loading}
              id="resourceType"
              {...register("resourceType", { required: true })}
              className="form-style w-full cursor-pointer"
              defaultValue=""
            >
              <option value="" disabled>
                Choose a Resource Type
              </option>
              <option value="VIDEO">Video</option>
              <option value="PDF">PDF</option>
              <option value="IMAGE">Image</option>
            </select>
            {errors.resourceType && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Resource type is required
              </span>
            )}
          </div>

          {!view && (
            <div className="flex justify-end">
              <IconBtn
                disabled={loading}
                text={loading ? "Loading..." : edit ? "Save Changes" : "Save"}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}