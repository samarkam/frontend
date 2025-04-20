import { useState } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RxDropdownMenu } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { deleteSection } from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import ConfirmationModal from "../../../../common/ConfirmationModal";
import SubSectionModal from "./SubSectionModal";

export default function NestedView({ handleChangeEditChapter }) {
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // States for modal modes
  const [addResource, setAddResource] = useState(null);
  const [viewResource, setViewResource] = useState(null);
  const [editResource, setEditResource] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);

  // Delete a chapter
  const handleDeleteChapter = async (chapterId) => {
    const result = await deleteSection({ chapterId, courseId: course.id }, token);
    if (result) {
      dispatch(setCourse(result));
    }
    setConfirmationModal(null);
  };

  // Placeholder for deleting a resource (API not provided)
  const handleDeleteResource = async (resourceId, chapterId) => {
    // Assume a deleteResource API
    const result = await deleteResource({ resourceId, chapterId }, token);
    if (result) {
      const updatedChapters = course.chapitres.map((chapter) =>
        chapter.id === chapterId ? result : chapter
      );
      dispatch(setCourse({ ...course, chapitres: updatedChapters }));
    }
    setConfirmationModal(null);
  };

  return (
    <div className="rounded-2xl bg-richblack-700 p-6 px-8" id="nestedViewContainer">
      {course?.chapitres?.map((chapter) => (
        <details key={chapter.id} open>
          {/* Chapter Header */}
          <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2">
            <div className="flex items-center gap-x-3">
              <RxDropdownMenu className="text-2xl text-richblack-50" />
              <p className="font-semibold text-richblack-50">{chapter.titre}</p>
            </div>
            <div className="flex items-center gap-x-3">
              <button
                onClick={() => handleChangeEditChapter(chapter.id, chapter)}
              >
                <MdEdit className="text-xl text-richblack-300" />
              </button>
              {/* <button
                onClick={() =>
                  setConfirmationModal({
                    text1: "Delete this Chapter?",
                    text2: "All resources in this chapter will be deleted",
                    btn1Text: "Delete",
                    btn2Text: "Cancel",
                    btn1Handler: () => handleDeleteChapter(chapter.id),
                    btn2Handler: () => setConfirmationModal(null),
                  })
                }
              > 
                <RiDeleteBin6Line className="text-xl text-richblack-300" />
              </button>*/}
              <span className="font-medium text-richblack-300">|</span>
              <AiFillCaretDown className="text-xl text-richblack-300" />
            </div>
          </summary>
          <div className="px-6 pb-4">
            {/* Resources */}
            {chapter?.resourceList?.map((resource) => (
              <div
                key={resource.id}
                onClick={() => setViewResource(resource)}
                className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2"
              >
                <div className="flex items-center gap-x-3 py-2">
                  <RxDropdownMenu className="text-2xl text-richblack-50" />
                  <p className="font-semibold text-richblack-50">{resource.titre}</p>
                </div>
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-x-3"
                >
                  <button
                    onClick={() =>
                      setEditResource({ ...resource, chapterId: chapter.id })
                    }
                  >
                    <MdEdit className="text-xl text-richblack-300" />
                  </button>
                  {/* <button
                    onClick={() =>
                      setConfirmationModal({
                        text1: "Delete this Resource?",
                        text2: "This resource will be deleted",
                        btn1Text: "Delete",
                        btn2Text: "Cancel",
                        btn1Handler: () =>
                          handleDeleteResource(resource.id, chapter.id),
                        btn2Handler: () => setConfirmationModal(null),
                      })
                    }
                  >
                    <RiDeleteBin6Line className="text-xl text-richblack-300" />
                  </button> */}
                </div>
              </div>
            ))}
            {/* Add Resource Button */}
            <button
              onClick={() => setAddResource(chapter.id)}
              className="mt-3 flex items-center gap-x-1 text-yellow-50"
            >
              <FaPlus className="text-lg" />
              <p>Add Resource</p>
            </button>
          </div>
        </details>
      ))}

      {/* Modals */}
      {addResource && (
        <SubSectionModal
          modalData={addResource}
          setModalData={setAddResource}
          add={true}
        />
      )}
      {viewResource && (
        <SubSectionModal
          modalData={viewResource}
          setModalData={setViewResource}
          view={true}
        />
      )}
      {editResource && (
        <SubSectionModal
          modalData={editResource}
          setModalData={setEditResource}
          edit={true}
        />
      )}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
}