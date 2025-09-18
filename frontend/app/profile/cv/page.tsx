"use client"

import { Button } from "@/components/ui/button"
import { FileUser, Edit, Eye, Download } from "lucide-react"
import Link from "next/link"

export default function CvPage() {
    return (
        <div className="rounded-2xl bg-white shadow-sm px-8 py-6 relative overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-2">
                <div className="flex space-x-2 items-center">
                    <FileUser className="w-5 h-5" />
                    <h2 className="text-lg font-semibold">CV & Portofolio</h2>
                </div>
                <Edit className="w-5 h-5" />
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
                <div>
                    <span className="font-medium block mb-1">Curriculum Vitae</span>
                    <span className="text-black italic ">
                        CV_TaufiqAhmadi_August_2025.pdf
                    </span>
                    <div className="flex items-center space-x-1 mt-2">
                        <button className="px-1 py-1 shadow-sm border rounded-md hover:bg-gray-50">
                            <Eye className="h-4 w-4" />
                        </button>
                        <button className="px-1 py-1 shadow-sm border rounded-md hover:bg-gray-50">
                            <Download className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                <div>
                    <span className="font-medium block mb-1">Portfolio (Optional)</span>
                    <span className="text-black italic">
                        Portfolio_TaufiqAhmadi_2025.pdf
                    </span>
                    <div className="flex items-center space-x-1 mt-2">
                        <button className="px-1 py-1 shadow-sm border rounded-md hover:bg-gray-50">
                            <Eye className="h-4 w-4" />
                        </button>
                        <button className="px-1 py-1 shadow-sm border rounded-md hover:bg-gray-50">
                            <Download className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
