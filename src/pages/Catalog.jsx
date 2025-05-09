import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

// import CourseCard from "../components/Catalog/CourseCard"
// import CourseSlider from "../components/Catalog/CourseSlider"
import Footer from "../components/common/Footer"
import Course_Card from '../components/core/Catalog/Course_Card'
import Course_Slider from "../components/core/Catalog/Course_Slider"
import Loading from './../components/common/Loading';

import { getCatalogPageData } from '../services/operations/pageAndComponentData'
import { fetchCourseCategories } from './../services/operations/courseDetailsAPI';




function Catalog() {

    const { catalogId } = useParams()
    const [active, setActive] = useState(1)
    const [catalogPageData, setCatalogPageData] = useState(null)
    const [categoryId, setCategoryId] = useState("")
    const [loading, setLoading] = useState(false);




    useEffect(() => {
        if (catalogId) {
            ; (async () => {
                setLoading(true)
                try {
                    const res = await getCatalogPageData(catalogId)
                   // console.log("tttttttttt")
                   // console.log(res)
                    setCatalogPageData(res)
                } catch (error) {
                   // console.log(error)
                }
                setLoading(false)
            })()
        }
    }, [catalogId])

     console.log('======================================= ', catalogPageData)
   console.log('categoryId ==================================== ', categoryId)

    if (loading) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <Loading />
            </div>
        )
    }
    if (!loading && !catalogPageData) {
        return (
            <div className="text-white text-4xl flex justify-center items-center mt-[20%]">
                No Courses found for selected Category
            </div>)
    }



    return (
        <>
            {/* Hero Section */}
            <div className="box-content bg-richblack-800 px-4">
                <div className="mx-auto flex min-h-[200px] max-w-maxContentTab flex-col lg:flex-row lg:items-start lg:justify-start lg:gap-10 lg:max-w-maxContent py-6">

                    {catalogPageData?.image && (
                    <div className="lg:w-[180px] flex justify-start">
                        <img
                        src={catalogPageData.image}
                        alt="Category"
                        className="w-[160px] h-auto rounded-lg"
                        />
                    </div>
                    )}

                    <div className="flex flex-col gap-4 mt-4 lg:mt-0">
                    <p className="text-sm text-richblack-300">
                        {`Home / Catalog / `}
                        <span className="text-yellow-25">{catalogPageData?.labelle}</span>
                    </p>
                    <p className="text-3xl text-richblack-5">
                        {catalogPageData?.dicipline?.titre}
                    </p>
                    <p className="max-w-[870px] text-richblack-200">
                        {catalogPageData?.dicipline?.description}
                    </p>
                    </div>

                </div>
            </div>



            {/* Section 1 */}
            <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div className="section_heading">Courses to get you started</div>
                <div className="my-4 flex border-b border-b-richblack-600 text-sm">
                    <p
                        className={`px-4 py-2 ${active === 1
                            ? "border-b border-b-yellow-25 text-yellow-25"
                            : "text-richblack-50"
                            } cursor-pointer`}
                        onClick={() => setActive(1)}
                    >
                        Most Populer
                    </p>
                    {/* <p
                        className={`px-4 py-2 ${active === 2
                            ? "border-b border-b-yellow-25 text-yellow-25"
                            : "text-richblack-50"
                            } cursor-pointer`}
                        onClick={() => setActive(2)}
                    >
                        New
                    </p> */}
                </div>
                <div>
                    <Course_Slider
                        Courses={catalogPageData?.courses}
                    />
                </div>
            </div>

            {/* Section 2
            <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div className="section_heading">
                    Top courses in {catalogPageData?.differentCategory?.name}
                </div>
                <div>
                    <Course_Slider
                        Courses={catalogPageData?.differentCategory?.courses}
                    />
                </div>
            </div>
 */}
            {/* Section 3 
            <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div className="section_heading">Frequently Bought</div>
                <div className="py-8">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {catalogPageData?.mostSellingCourses
                            ?.slice(0, 4)
                            .map((course, i) => (
                                <Course_Card course={course} key={i} Height={"h-[300px]"} />
                            ))}
                    </div>
                </div>
            </div>*/}

            <Footer />
        </>
    )
}

export default Catalog
