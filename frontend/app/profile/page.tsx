"use client"

import { FileUser, Edit, User } from "lucide-react"
import { useEffect, useState } from "react"
import type { GeneralInformation } from "@/types/general_information"

export default function GeneralInformationPage() {
    const [data, setData] = useState<GeneralInformation | null>(null)

    useEffect(() => {
        // Simulasi fetch dari API backend
        const dummy: GeneralInformation = {
            profile_picture: "/images/profile_dummy2.png",
            first_name: "Taufiq",
            mid_name: null,
            last_name: "Ahmadi",
            phone_number: "+62828919030102",
            birth_date: "29/02/1999",
            country: "Indonesia",
            province: "Jawa Barat",
            city: "Bogor",
            short_description:
                "Lorem ipsum cursus sed urna volutpat est tincidunt dignissim sed accumsan sed eu odio pretium nisl eget mi amet in id cras magna nunc faucibus nibh lacus porttitor aliquet sed fusce risus in at quis id suspendisse et accumsan vulputate neque leo porttitor enim nisl sollicitudin consequat amet massa et volutpat nullam auctor lacinia venenatis lacus elit commodo ultricies odio arcu vitae enim pulvinar purus pharetra blandit quam sed molestie mi elit eget leo amet orci sed sed integer gravida sit dictum enim ullamcorper orci et vitae volutpat ultrices consequat sed sed sed at sodales nullam justo egestas auctor posuere nisi odio ornare scelerisque amet aliquet nisl blandit mauris ipsum aliquam in condimentum sed arcu magna leo et risus venenatis ut a ut dolor risus justo sem tristique senectus ligula tempor sed eu eget enim risus venenatis sit odio."
        }
        setData(dummy)
    }, [])

    const getValue = (val: string | null) => {
        if (val && val.trim() !== "") {
            return <span>{val}</span>
        }
        return <span className="text-gray-400 italic">Not Set.</span>
    }

    return (
        <div className="relative rounded-2xl shadow-md overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[url('/images/bg_pattern.png')] bg-cover bg-center opacity-70" />
            {/* Overlay putih tipis biar teks jelas */}
           

            {/* Content */}
            <div className="relative px-8 py-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex space-x-2 items-center">
                        <User className="w-5 h-5" />
                        <h2 className="text-lg font-semibold">General Information</h2>
                    </div>
                    <Edit className="w-5 h-5" />
                </div>

                {/* Body */}
                {data ? (
                    <div className="flex flex-col gap-4 mt-6">
                        {/* Row 1: Foto + Grid Info */}
                        <div className="flex items-start gap-6">
                            {/* Profile Picture */}
                            <div className="w-28 aspect-[3/4] rounded-md overflow-hidden border">
                                {data.profile_picture ? (
                                    <img
                                        src={data.profile_picture}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                        <FileUser className="w-10 h-10 text-gray-400" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 grid grid-cols-3 gap-x-8 gap-y-3 text-sm">
                                <div className="flex flex-col">
                                    <span className="font-semibold">First Name</span>
                                    <span>{getValue(data.first_name)}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold">Mid Name</span>
                                    <span>{getValue(data.mid_name)}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold">Last Name</span>
                                    <span>{getValue(data.last_name)}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold">Phone Number</span>
                                    <span>{getValue(data.phone_number)}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold">Birth Date</span>
                                    <span>{getValue(data.birth_date)}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold">Country</span>
                                    <span>{getValue(data.country)}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold">Province</span>
                                    <span>{getValue(data.province)}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold">City</span>
                                    <span>{getValue(data.city)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Short Description */}
                        <div className="text-sm">
                            <span className="font-semibold block mb-1">Short Description</span>
                            <p className="text-justify">{getValue(data.short_description)}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-400 text-sm mt-6">Loading...</p>
                )}

            </div>
        </div>
    )
}
