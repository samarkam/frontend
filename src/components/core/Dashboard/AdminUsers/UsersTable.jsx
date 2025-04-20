import { useSelector } from "react-redux";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { RiDeleteBin6Line, RiForbidLine } from "react-icons/ri";
import { deleteUser, fetchUsers, blockUser } from "../../../../services/operations/courseDetailsAPI";
import { ACCOUNT_TYPE } from "../../../../utils/constants";
import ConfirmationModal from "../../../common/ConfirmationModal";
import toast from "react-hot-toast";

export default function UsersTable({ Users, setUsers, loading, setLoading }) {
  const { token } = useSelector((state) => state.auth);
  const [confirmationModal, setConfirmationModal] = useState(null);

  // Delete User
  const handleUserDelete = async (UserId) => {
    setLoading(true);
    const toastId = toast.loading("Deleting...");
    await deleteUser({ UserId }, token);
    const result = await fetchUsers(token);
    if (result) setUsers(result);
    setConfirmationModal(null);
    setLoading(false);
    toast.dismiss(toastId);
  };

  // Block/Activate User
  const handleUserBlock = async (id, blocked) => {
    setLoading(true);
    const toastId = toast.loading(blocked ? "Activating..." : "Blocking...");
    await blockUser({id: id, blocked: blocked }, token);
    const result = await fetchUsers(token);
    if (result) setUsers(result);
    setConfirmationModal(null);
    setLoading(false);
    toast.dismiss(toastId);
  };

  // Compact Skeleton Loader
  const skItem = () => (
    <div className="flex border-b border-richblack-800 px-4 py-4 w-full">
      <div className="flex flex-1 gap-x-2">
        <div className="h-4 w-[40%] rounded-md skeleton" />
        <div className="h-4 w-[20%] rounded-md skeleton" />
      </div>
    </div>
  );

  return (
    <>
      <Table className="rounded-xl border border-richblack-800">
        {/* Table Header */}
        <Thead>
          <Tr className="flex gap-x-6 rounded-t-xl border-b border-richblack-800 px-4 py-2">
            <Th className="flex-1 text-left text-xs font-medium uppercase text-richblack-100">
              User
            </Th>
            <Th className="w-[25%] text-left text-xs font-medium uppercase text-richblack-100">
              Type
            </Th>
            <Th className="w-[25%] text-left text-xs font-medium uppercase text-richblack-100">
              Status
            </Th>
            <Th className="w-[15%] text-left text-xs font-medium uppercase text-richblack-100">
              Actions
            </Th>
          </Tr>
        </Thead>

        {/* Loading Skeleton */}
        {loading && (
          <div>
            {skItem()}
            {skItem()}
            {skItem()}
          </div>
        )}

        {/* Table Body */}
        <Tbody>
          {!loading && Users?.length === 0 ? (
            <Tr>
              <Td className="py-8 text-center text-lg font-medium text-richblack-100">
                No Users Found
              </Td>
            </Tr>
          ) : (
            Users?.map((User) => (
              <Tr
                key={User.id}
                className="flex gap-x-6 border-b border-richblack-800 px-4 py-3"
              >
                {/* User Name */}
                <Td className="flex-1 text-sm font-medium text-richblack-5 capitalize">
                  {User.prenom} {User.nom}
                </Td>

                {/* Account Type */}
                <Td className="w-[25%] text-sm text-richblack-100">
                  {User?.accountType === ACCOUNT_TYPE.INSTRUCTOR ? (
                    <span className="flex items-center gap-1 rounded-full bg-richblack-700 px-2 py-1 text-xs text-blue-100">
                      Instructor
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-richblack-700 px-2 py-1 text-xs text-white-150">
                      Student
                    </span>
                  )}
                </Td>

                {/* Blocked Status */}
                <Td className="w-[25%] text-sm text-richblack-100">
                  {User.blocked ? (
                    <span className="flex items-center gap-1 rounded-full bg-richblack-700 px-2 py-1 text-xs text-pink-100">
                      Blocked
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-richblack-700 px-2 py-1 text-xs text-yellow-100">
                      <FaCheck size={8} />
                      Active
                    </span>
                  )}
                </Td>

                {/* Actions */}
                <Td className="w-[15%] flex gap-x-2 text-sm text-richblack-100">
                  <button
                    disabled={loading}
                    onClick={() =>
                      setConfirmationModal({
                        text1: `Do you want to ${User.blocked ? "activate" : "block"} this user?`,
                        text2: User.blocked
                          ? "User will be able to access their data."
                          : "User will lose access to their data.",
                        btn1Text: !loading ? (User.blocked ? "Activate" : "Block") : "Loading...",
                        btn2Text: "Cancel",
                        btn1Handler: !loading
                          ? () => handleUserBlock(User.id, User.blocked)
                          : () => {},
                        btn2Handler: !loading ? () => setConfirmationModal(null) : () => {},
                      })
                    }
                    title={User.blocked ? "Activate" : "Block"}
                    className="transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300"
                  >
                    <RiForbidLine size={16} />
                  </button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>

      {/* Confirmation Modal */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}