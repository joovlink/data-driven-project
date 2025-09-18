"use client"

import { FileUser, Edit, User, Blocks, Award } from "lucide-react"
import Link from "next/link"

export default function CvPage() {
    return (
        <div className="flex flex-col space-y-4">
            <div className="rounded-2xl bg-white shadow-sm px-8 py-6 relative overflow-hidden">
                <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex space-x-2 items-center">
                        <Blocks className="w-5 h-5" />
                        <h2 className="text-lg font-semibold">Skills</h2>
                    </div>
                    <Edit className="w-5 h-5" />
                </div>
            </div>

            <div className="rounded-2xl bg-white shadow-sm px-8 py-6 relative overflow-hidden">
                <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex space-x-2 items-center">
                        <Award className="w-5 h-5" />
                        <h2 className="text-lg font-semibold">Certification</h2>
                    </div>
                    <Edit className="w-5 h-5" />
                </div>
            </div>
        </div>
    )
}
