"use client"

import { FileUser, Edit, User } from "lucide-react"
import Link from "next/link"

export default function CvPage() {
    return (
        <div className="rounded-2xl bg-white shadow-sm px-8 py-6 relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-2">
                <div className="flex space-x-2 items-center">
                    <User className="w-5 h-5" />
                    <h2 className="text-lg font-semibold">General Information</h2>
                </div>
                <Edit className="w-5 h-5" />
            </div>
        </div>
    )
}
