"use client"

import { useState, useEffect } from "react"
import { FileUser, Edit, Eye, Download } from "lucide-react"
import Link from "next/link"
import CvPortfolioModal from "@/components/modals/CvPortofolioModal"

type PortfolioField =
    | { type: "pdf"; filename: string; url: string }
    | { type: "link"; url: string; filename?: string }

type DocumentField = {
    filename: string
    url: string
}

export default function CvPage() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    const [cv, setCv] = useState<DocumentField | null>(null)
    const [portfolio, setPortfolio] = useState<PortfolioField | null>(null)

    // Simulasi fetch API
    useEffect(() => {
        setLoading(true)
        const timer = setTimeout(() => {
            setCv({
                filename: "CV_TaufiqAhmadi_August_2025.pdf",
                url: "/dummy/CV_TaufiqAhmadi_August_2025.pdf",
            })
            setPortfolio({
                type: "pdf",
                filename: "Portfolio_TaufiqAhmadi_2025.pdf",
                url: "/dummy/Portfolio_TaufiqAhmadi_2025.pdf",
            })
            setLoading(false)
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    return (
        <>
            <div className="relative rounded-2xl shadow-md overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/bg_pattern.png')] bg-cover bg-center opacity-70" />
                <div className="relative px-8 py-6">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b pb-2">
                        <div className="flex space-x-2 items-center">
                            <FileUser className="w-6 h-6" />
                            <h2 className="text-lg font-semibold">CV & Portofolio</h2>
                        </div>
                        <Edit
                            className="w-6 h-6 cursor-pointer hover:text-gray-600"
                            onClick={() => setOpen(true)}
                        />
                    </div>

                    {/* Deskripsi */}
                    <p className="mt-4 text-sm text-black">
                        <strong>Why we need your CV?</strong>
                        <br />
                        Your CV is the key to showcasing your skills and experience. In our
                        data-driven recruitment platform, it’s not just a document — it’s the
                        foundation for smarter job matching, fairer evaluation, and helping you
                        connect with the right opportunities faster.
                    </p>

                    {/* Files */}
                    <div className="grid grid-cols-2 gap-6 mt-6 text-sm">
                        {/* CV */}
                        <div>
                            <span className="font-medium block mb-1">Curriculum Vitae</span>
                            {loading ? (
                                <span className="text-gray-400 italic">Loading...</span>
                            ) : cv ? (
                                <>
                                    <span className="text-black italic">{cv.filename}</span>
                                    <div className="flex items-center space-x-1 mt-2">
                                        <Link
                                            href={cv.url}
                                            target="_blank"
                                            className="px-1 py-1 shadow-sm border rounded-md hover:bg-gray-50"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                        <a
                                            href={cv.url}
                                            download={cv.filename}
                                            className="px-1 py-1 shadow-sm border rounded-md hover:bg-gray-50"
                                        >
                                            <Download className="h-4 w-4" />
                                        </a>
                                    </div>
                                </>
                            ) : (
                                <span className="text-red-500 italic">Not uploaded</span>
                            )}
                        </div>

                        {/* Portfolio */}
                        <div>
                            <span className="font-medium block mb-1">Portfolio (Optional)</span>
                            {loading ? (
                                <span className="text-gray-400 italic">Loading...</span>
                            ) : portfolio ? (
                                <>
                                    {portfolio.type === "pdf" ? (
                                        <>
                                            <span className="text-black italic">{portfolio.filename}</span>
                                            <div className="flex items-center space-x-1 mt-2">
                                                <Link
                                                    href={portfolio.url}
                                                    target="_blank"
                                                    className="px-1 py-1 shadow-sm border rounded-md hover:bg-gray-50"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <a
                                                    href={portfolio.url}
                                                    download={portfolio.filename}
                                                    className="px-1 py-1 shadow-sm border rounded-md hover:bg-gray-50"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </a>
                                            </div>
                                        </>
                                    ) : portfolio.type === "link" ? (
                                        <Link
                                            href={portfolio.url}
                                            target="_blank"
                                            className="text-blue-600 underline"
                                        >
                                            {portfolio.url}
                                        </Link>
                                    ) : null}
                                </>
                            ) : (
                                <span className="text-gray-400 italic">Not uploaded</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <CvPortfolioModal
                open={open}
                onOpenChange={setOpen}
                initialData={{ cv: cv || undefined, portfolio: portfolio || undefined }}
                onSuccess={(data) => {
                    if (data?.cv && data.cv instanceof File) {
                        setCv({
                            filename: data.cv.name,
                            url: "#",
                        })
                    }
                    if (data?.portfolio && data.portfolio instanceof File) {
                        setPortfolio({
                            type: "pdf",
                            filename: data.portfolio.name,
                            url: "#",
                        })
                    }
                    if (typeof data?.portfolio === "string") {
                        setPortfolio({
                            type: "link",
                            url: data.portfolio,
                        })
                    }
                }}
            />
        </>
    )
}
