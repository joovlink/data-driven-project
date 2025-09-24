"use client"

import { Briefcase, GraduationCap, Plus, Edit } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import AddExperienceModal from "@/components/modals/AddExperienceModal"
import AddEducationModal from "@/components/modals/AddEducationModal"
import EditExperienceModal from "@/components/modals/EditExperienceModal"
import EditEducationModal, { EducationForm } from "@/components/modals/EditEducationModal"

// ===== Types =====
type ExperienceApiItem = {
    id: string
    job_name: string
    company_name: string
    start_date: string
    end_date?: string
    currently_working: boolean
    description: string
}

type EducationApiItem = {
    id: string
    qualification: string
    school_name: string
    degree: string
    start_year: string
    end_year: string
    ongoing: boolean
    description: string
}

type TimelineItem = {
    id: string
    qualification?: string 
    title: string
    subtitle: string
    start_date: string
    end_date: string
    description: string
}

// ===== Mapper helpers =====
function mapExperience(item: ExperienceApiItem): TimelineItem {
    return {
        id: item.id,
        title: item.job_name,
        subtitle: item.company_name,
        start_date: item.start_date,
        end_date: item.currently_working ? "Now" : item.end_date || "",
        description: item.description,
    }
}

function mapEducation(item: EducationApiItem): TimelineItem {
    return {
        id: item.id,
        qualification: item.qualification,
        title: item.degree,
        subtitle: item.school_name,
        start_date: item.start_year,
        end_date: item.ongoing ? "Expected" : item.end_year,
        description: item.description,
    }
}

// ===== Form types (buat edit modal) =====
type ExperienceForm = {
    job_name: string
    company_name: string
    start_date: string
    end_date?: string
    currently_working: boolean
    description: string
}

// ===== Main Component =====
export default function ProfileTimeline() {
    const [experience, setExperience] = useState<TimelineItem[]>([])
    const [education, setEducation] = useState<TimelineItem[]>([])
    const [expanded, setExpanded] = useState(false)

    const [openAddExperienceModal, setOpenAddExperienceModal] = useState(false)
    const [openAddEducationModal, setOpenAddEducationModal] = useState(false)
    const [openEditExpModal, setOpenEditExpModal] = useState(false)
    const [openEditEduModal, setOpenEditEduModal] = useState(false)

    const [selectedExp, setSelectedExp] = useState<ExperienceForm | null>(null)
    const [selectedExpId, setSelectedExpId] = useState<string | null>(null)

    const [selectedEdu, setSelectedEdu] = useState<EducationForm | null>(null)
    const [selectedEduId, setSelectedEduId] = useState<string | null>(null)

    const scrollRef = useRef<HTMLDivElement | null>(null)
    const expCardRef = useRef<HTMLDivElement | null>(null)

    // Dummy API data
    useEffect(() => {
        const expApi: ExperienceApiItem[] = [
            {
                id: "1",
                job_name: "Data Scientist",
                company_name: "Direktorat Jenderal Pajak dan Bea Cukai",
                start_date: "2025-11-01",
                end_date: "",
                currently_working: true,
                description:
                    "Collect, clean, and preprocess data to ensure accuracy and reliability. Build and apply machine learning models to identify patterns and predictions. Translate complex data insights into recommendations for stakeholders. Design dashboards for decision support.",
            },
            {
                id: "2",
                job_name: "Data Scientist",
                company_name: "PT Artha Telekomindo",
                start_date: "2023-08-20",
                end_date: "2025-09-27",
                currently_working: false,
                description:
                    "Collect, clean, and preprocess messy Excel data from HR. Build ML models to predict candidate outcomes. Translate insights into recommendations (often ignored by directors). Collaborate with teams for integration of data-driven solutions.",
            },
            {
                id: "3",
                job_name: "Junior Data Scientist",
                company_name: "Startup XYZ",
                start_date: "2021-01-01",
                end_date: "2023-01-01",
                currently_working: false,
                description:
                    "Developed NLP pipelines for sentiment analysis. Built ETL data pipelines for analytics.",
            },
        ]

        const eduApi: EducationApiItem[] = [
            {
                id: "1",
                qualification: "Bachelor",
                school_name: "Harvard University",
                degree: "Bachelor Degree of Engineering",
                start_year: "2010",
                end_year: "2014",
                ongoing: false,
                description:
                    "Specialized in Computer Engineering. Active in AI & Robotics Club.",
            },
        ]

        setExperience(expApi.map(mapExperience))
        setEducation(eduApi.map(mapEducation))
    }, [])

    const visibleExp = expanded ? experience : experience.slice(0, 2)

    // Timeline UI
    const TimelineSection = ({
        items,
        type,
    }: {
        items: TimelineItem[]
        type: "exp" | "edu"
    }) => (
        <div className="relative ml-8">
            <div className="absolute left-1.5 top-2 bottom-2 rounded-lg w-[5px] bg-[#17255A]" />
            <div className="space-y-8">
                {items.map((item, idx) => (
                    <div
                        key={item.id}
                        className="relative pl-10"
                        ref={idx === items.length - 1 ? scrollRef : null}
                    >
                        <span className="absolute left-[3px] top-[1.7rem] w-3 h-3 rounded-full bg-teal-600" />
                        <div className="flex flex-col">
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col -space-y-1">
                                    <span className="text-sm text-gray-500">
                                        {item.start_date} – {item.end_date}
                                    </span>
                                    <h3 className="font-bold text-2xl text-gray-900">{item.title}</h3>
                                    <p className="text-sm font-semibold text-gray-800">
                                        {item.subtitle}
                                    </p>
                                </div>
                                <button
                                    className="text-gray-800 hover:text-gray-600"
                                    onClick={() => {
                                        if (type === "exp") {
                                            setSelectedExpId(item.id)
                                            setSelectedExp({
                                                job_name: item.title,
                                                company_name: item.subtitle,
                                                start_date: item.start_date,
                                                end_date: item.end_date === "Now" ? "" : item.end_date,
                                                currently_working: item.end_date === "Now",
                                                description: item.description,
                                            })
                                            setOpenEditExpModal(true)
                                        } else {
                                            setSelectedEduId(item.id)
                                            setSelectedEdu({
                                                qualification: item.qualification || "", 
                                                school_name: item.subtitle,
                                                degree: item.title,
                                                start_year: item.start_date,
                                                end_year: item.end_date === "Expected" ? "" : item.end_date,
                                                ongoing: item.end_date === "Expected",
                                                description: item.description,
                                            })
                                            setOpenEditEduModal(true)
                                        }
                                    }}
                                >
                                    <Edit className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="mt-2 text-justify text-sm text-gray-700 max-w-[800px]">
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

    // Expand/Collapse
    const handleSeeMore = () => {
        setExpanded(true)
        setTimeout(() => {
            scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
        }, 200)
    }

    const handleSeeLess = () => {
        setExpanded(false)
        if (expCardRef.current) {
            const offsetTop =
                expCardRef.current.getBoundingClientRect().top + window.scrollY - 100
            window.scrollTo({ top: offsetTop, behavior: "smooth" })
        }
    }

    // Render
    return (
        <div className="space-y-6">
            {/* EXPERIENCE CARD */}
            <div
                ref={expCardRef}
                className="relative rounded-2xl shadow-md overflow-hidden"
            >
                <div className="absolute inset-0 bg-[url('/images/bg_pattern.png')] bg-cover bg-center opacity-70" />
                <div className="relative px-8 py-6">
                    <div className="flex items-center justify-between border-b pb-2">
                        <div className="flex space-x-2 items-center">
                            <Briefcase className="w-6 h-6" />
                            <h2 className="text-lg font-semibold">Experience</h2>
                        </div>
                        <Plus
                            className="w-6 h-6 cursor-pointer"
                            onClick={() => setOpenAddExperienceModal(true)}
                        />
                    </div>

                    <div className="py-4">
                        <span>
                            Add your work experiences to showcase your career journey and
                            achievements.
                        </span>
                    </div>

                    <TimelineSection items={visibleExp} type="exp" />

                    {experience.length > 2 && (
                        <div className="mt-4">
                            {!expanded ? (
                                <button
                                    onClick={handleSeeMore}
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    See More...
                                </button>
                            ) : (
                                <button
                                    onClick={handleSeeLess}
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    See Less
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* EDUCATION CARD */}
            <div className="relative rounded-2xl shadow-md overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/bg_pattern.png')] bg-cover bg-center opacity-70" />
                <div className="relative px-8 py-6">
                    <div className="flex items-center justify-between border-b pb-2">
                        <div className="flex space-x-2 items-center">
                            <GraduationCap className="w-6 h-6" />
                            <h2 className="text-lg font-semibold">Education</h2>
                        </div>
                        <Plus
                            className="w-6 h-6 cursor-pointer"
                            onClick={() => setOpenAddEducationModal(true)}
                        />
                    </div>
                    <div className="py-4">
                        <span>
                            Add your academic background to complete your career story.
                        </span>
                    </div>
                    <TimelineSection items={education} type="edu" />
                </div>
            </div>

            {/* Modals */}
            <AddExperienceModal
                open={openAddExperienceModal}
                onClose={() => setOpenAddExperienceModal(false)}
            />
            <AddEducationModal
                open={openAddEducationModal}
                onClose={() => setOpenAddEducationModal(false)}
            />
            <EditExperienceModal
                open={openEditExpModal}
                onClose={() => setOpenEditExpModal(false)}
                initialData={selectedExp || undefined}
                recordId={selectedExpId || undefined}
            />
            <EditEducationModal
                open={openEditEduModal}
                onClose={() => setOpenEditEduModal(false)}
                initialData={selectedEdu || undefined}
                recordId={selectedEduId || undefined}
            />
        </div>
    )
}
