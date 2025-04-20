import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { updateProfile } from "../../../../services/operations/SettingsAPI"
import IconBtn from "../../../common/IconBtn"


export default function EditProfile() {
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { register, handleSubmit, formState: { errors } } = useForm()

  const submitProfileForm = async (data) => {
    //// console.log("Form Data - ", data)
    try {
      dispatch(updateProfile(user, data,navigate))
    } catch (error) {
     // console.log("ERROR MESSAGE - ", error.message)
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit(submitProfileForm)}>
        {/* Profile Information */}
        <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-6 sm:px-12">
          <h2 className="text-lg font-semibold text-richblack-5">
            Profile Information
          </h2>
          <input hidden
                type="number"
                name="id"
                id="id"
                className="form-style"
                {...register("id", { required: true })}
                defaultValue={user?.id}
              />
          <div className="flex flex-col gap-5 lg:flex-row">
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="prenom" className="lable-style">
                First Name
              </label>
              
              <input
                type="text"
                name="prenom"
                id="prenom"
                placeholder="Enter first name"
                className="form-style"
                {...register("firstName", { required: true })}
                defaultValue={user?.prenom}
              />
              {errors.prenom && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your first name.
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="nom" className="lable-style">
                Last Name
              </label>
              <input
                type="text"
                name="nom"
                id="nom"
                placeholder="Enter first name"
                className="form-style"
                {...register("nom", { required: true })}
                defaultValue={user?.nom}
              />
              {errors.nom && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your last name.
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-5 lg:flex-row">
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="dateDeNaissance" className="lable-style">
                Date of Birth
              </label>
              <input
                  type="date"
                  name="dateDeNaissance"
                  id="dateDeNaissance"
                  className="form-style"
                  {...register("dateDeNaissance", {
                    required: {
                      value: true,
                      message: "Please enter your Date of Birth.",
                    },
                    max: {
                      value: new Date().toISOString().split("T")[0],
                      message: "Date of Birth cannot be in the future.",
                    },
                  })}
                  defaultValue={
                    user?.dateDeNaissance
                      ? new Date(user.dateDeNaissance).toISOString().split("T")[0]
                      : ""
                  }
                />

              {errors.dateDeNaissance && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  {errors.dateDeNaissance.message}
                </span>
              )}
            </div>

           
          </div>

          <div className="flex flex-col gap-5 lg:flex-row">
          <div className="flex flex-col gap-2 w-1/2">
            <label htmlFor="telephone" className="lable-style">
                Contact Number
              </label>
              <input
                type="tel"
                name="telephone"
                id="telephone"
                placeholder="Enter Contact Number"
                className="form-style"
                {...register("telephone", {
                  required: {
                    value: true,
                    message: "Please enter your Contact Number.",
                  },
                  maxLength: { value: 12, message: "Invalid Contact Number" },
                  minLength: { value: 8, message: "Invalid Contact Number" },
                })}
                defaultValue={user?.telephone}
              />
              {errors.telephone && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  {errors.telephone.message}
                </span>
              )}
            </div>
          { user?.niveauEtude ? 
            
            <div className="flex flex-col gap-2 w-1/2">
            <label htmlFor="niveauEtude" className="lable-style">
              niveau Etude
              </label>
              <input
                type="text"
                name="niveauEtude"
                id="niveauEtude"
                placeholder="Enter your grade"
                className="form-style"
                {...register("niveauEtude", { required: true })}
                defaultValue={user?.niveauEtude}
              />
              {errors.niveauEtude && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your Grade.
                </span>
              )}
            </div> : <div></div>}

            </div>
            <div className="flex flex-col gap-5 lg:flex-row">

            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="details" className="lable-style">
                About
              </label>
              <input
                type="text"
                name="details"
                id="details"
                placeholder="Enter your About"
                className="form-style"
                {...register("details", { required: true })}
                defaultValue={user?.details}
              />
              {errors.details && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your About.
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => { navigate("/dashboard/my-profile") }}
            className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
          >
            Cancel
          </button>
          <IconBtn type="submit" text="Save" />
        </div>

      </form>
    </>
  )
}