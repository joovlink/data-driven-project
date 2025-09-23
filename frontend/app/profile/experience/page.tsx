"use client"

import { Briefcase, GraduationCap, Plus, Edit } from "lucide-react"
import { useEffect, useRef, useState } from "react"

type TimelineItem = {
    id: string
    title: string
    subtitle: string
    start_date: string
    end_date: string
    description: string // sekarang string, bukan array
}

export default function ProfileTimeline() {
    const [experience, setExperience] = useState<TimelineItem[]>([])
    const [education, setEducation] = useState<TimelineItem[]>([])
    const [expanded, setExpanded] = useState(false)
    const scrollRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        setExperience([
            {
                id: "1",
                title: "Data Scientist",
                subtitle: "Direktorat Jenderal Pajak dan Bea Cukai",
                start_date: "1 November 2025",
                end_date: "Now",
                description:
                    "Collect, clean, and preprocess data to ensure accuracy and reliability. Build and apply machine learning models to identify patterns and predictions. Translate complex data insights into recommendations for stakeholders. Design dashboards for decision support.",
            },
            {
                id: "2",
                title: "Data Scientist",
                subtitle: "PT Artha Telekomindo",
                start_date: "20 August 2023",
                end_date: "27 September 2025",
                description:
                    "Collect, clean, and preprocess messy Excel data from HR. Build ML models to predict candidate outcomes. Translate insights into recommendations (often ignored by directors). Collaborate with teams for integration of data-driven solutions.",
            },
            {
                id: "3",
                title: "Junior Data Scientist",
                subtitle: "Startup XYZ",
                start_date: "2021",
                end_date: "2023",
                description:
                    "Developed NLP pipelines for sentiment analysis. Built ETL data pipelines for analytics.",
            },
        ])

        setEducation([
            {
                id: "1",
                title: "Bachelor Degree of Engineering",
                subtitle: "Harvard University",
                start_date: "2010",
                end_date: "2014",
                description:
                    "Specialized in Computer Engineering. Active in AI & Robotics Club.",
            },
        ])
    }, [])

    const visibleExp = expanded ? experience : experience.slice(0, 2)

    const TimelineSection = ({ items }: { items: TimelineItem[] }) => (
        <div className="relative ml-8">
            {/* vertical line */}
            <div className="absolute left-1.5 top-2 bottom-2 rounded-lg w-[5px] bg-[#17255A]" />

            <div className="space-y-8">
                {items.map((item, idx) => (
                    <div
                        key={item.id}
                        className="relative pl-10"
                        ref={idx === items.length - 1 ? scrollRef : null}
                    >
                        {/* bullet */}
                        <span className="absolute left-[3px] top-[1.7rem] w-3 h-3 rounded-full bg-teal-600" />

                        {/* content */}
                        <div className="flex flex-col">
                            <div className="flex justify-between items-center ">
                                <div className="flex flex-col -space-y-1">
                                    <span className="text-sm text-gray-500">
                                        {item.start_date} – {item.end_date}
                                    </span>
                                    <h3 className="font-bold text-2xl text-gray-900">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm font-semibold text-gray-800">
                                        {item.subtitle}
                                    </p>
                                </div>
                                {/* Edit button */}
                                <button
                                    className="text-gray-800 hover:text-gray-600"
                                    onClick={() => alert(`Edit ${item.title}`)}
                                >
                                    <Edit className="w-5 h-5" />
                                </button>
                            </div>

                            {/* description */}
                            <p className="mt-2 text-justify text-sm text-gray-700 max-w-[800px]">
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

    const handleSeeMore = () => {
        setExpanded(true)
        // auto scroll ke bawah
        setTimeout(() => {
            scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
        }, 200)
    }

    const expCardRef = useRef<HTMLDivElement | null>(null)

    const handleSeeLess = () => {
        setExpanded(false)
        if (expCardRef.current) {
            const offsetTop =
                expCardRef.current.getBoundingClientRect().top + window.scrollY - 100 
            window.scrollTo({ top: offsetTop, behavior: "smooth" })
        }
    }

    return (
        <div className="space-y-6">
            {/* EXPERIENCE CARD */}
            <div ref={expCardRef} className="rounded-2xl bg-white shadow-sm px-8 py-6 relative overflow-hidden">
                <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex space-x-2 items-center">
                        <Briefcase className="w-6 h-6" />
                        <h2 className="text-lg font-semibold">Experience</h2>
                    </div>
                    <Plus className="w-6 h-6 cursor-pointer" />
                </div>
                <div className="py-4">
                    <span>
                        Add your work experiences to showcase your career journey and
                        achievements.
                    </span>
                </div>

                <TimelineSection items={visibleExp} />

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

            {/* EDUCATION CARD */}
            <div className="rounded-2xl bg-white shadow-sm px-8 py-6 relative overflow-hidden">
                <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex space-x-2 items-center">
                        <GraduationCap className="w-6 h-6" />
                        <h2 className="text-lg font-semibold">Education</h2>
                    </div>
                    <Plus className="w-6 h-6 cursor-pointer" />
                </div>
                <div className="py-4">
                    <span>
                        Add your academic background to complete your career story.
                    </span>
                </div>

                <TimelineSection items={education} />
            </div>
        </div>
    )
}
