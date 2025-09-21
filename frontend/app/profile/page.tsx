"use client"

import { FileUser, Edit, User } from "lucide-react"
import { useEffect, useState } from "react"
import type { GeneralInformation } from "@/types/general_information"
import GeneralInfoModal from "@/components/modals/GeneralInfoModal"

export default function GeneralInformationPage() {
  const [data, setData] = useState<GeneralInformation | null>(null)
  const [open, setOpen] = useState(false)

  const [provinceName, setProvinceName] = useState("")
  const [cityName, setCityName] = useState("")

  useEffect(() => {
    // Simulasi fetch dari API backend (pakai ID, bukan nama langsung)
    const dummy: GeneralInformation = {
      profile_picture: "/images/profile_dummy2.png",
      first_name: "Taufiq",
      mid_name: null,
      last_name: "Ahmadi",
      phone_number: "+62828919030102",
      birth_date: "1999-01-29",
      country: "Indonesia",
      province_id: "32", // Jawa Barat ID
      city_id: "3271",   // Bogor ID
      short_description:
        "I am a passionate Data Scientist with a strong background in turning complex data into meaningful insights that drive business growth. Skilled in data collection, cleaning, and analysis, I enjoy working with large datasets to uncover patterns and build predictive models. I have hands-on experience with Python, SQL, and machine learning frameworks, as well as visualization tools that help communicate results clearly to both technical and non-technical audiences. My focus is not only on building accurate models but also on ensuring the solutions I develop are practical and impactful for decision-making. I am motivated by curiosity and problem-solving, always eager to learn new methods and technologies to improve my work. With a collaborative mindset, I value teamwork and knowledge sharing, believing that great results come from combining diverse perspectives. I aim to contribute to innovative projects where data plays a key role in shaping the future."
    }
    setData(dummy)
  }, [])

  // Formatter IDN names
  const formatName = (str: string) => {
    const raw = str.toLowerCase()
    if (raw.startsWith("dki")) return "DKI Jakarta"
    if (raw.startsWith("di y")) return "DI Yogyakarta"
    return raw
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  }

  // Resolve province/city names dari ID
  useEffect(() => {
    if (!data) return
    if (data.country === "Indonesia" && data.province_id && data.city_id) {
      fetch("/data/provinces.json")
        .then((res) => res.json())
        .then((provinces: Array<{ id: string; name: string }>) => {
          const found = provinces.find((p) => p.id === data.province_id)
          setProvinceName(found ? formatName(found.name) : "")
        })
        .catch(() => setProvinceName(""))

      fetch(`/data/regencies/regencies_${data.province_id}.json`)
        .then((res) => res.json())
        .then((cities: Array<{ id: string; name: string }>) => {
          const found = cities.find((c) => c.id === data.city_id)
          setCityName(found ? formatName(found.name) : "")
        })
        .catch(() => setCityName(""))
    } else {
      setProvinceName("")
      setCityName("")
    }
  }, [data])

  const getValue = (val: string | null | undefined) => {
    if (val && val.trim() !== "") {
      return <span>{val}</span>
    }
    return <span className="text-gray-400 italic">Not Set.</span>
  }

  return (
    <>
      <div className="relative rounded-2xl shadow-md overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/bg_pattern.png')] bg-cover bg-center opacity-70" />
        <div className="relative px-8 py-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex space-x-2 items-center">
              <User className="w-6 h-6" />
              <h2 className="text-lg font-semibold">General Information</h2>
            </div>
            <button type="button" onClick={() => setOpen(true)}>
              <Edit className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          {data ? (
            <div className="flex flex-col gap-4 mt-6">
              <div className="flex items-start gap-6">
                {/* Profile Picture */}
                <div className="w-32 aspect-[3/4] rounded-md overflow-hidden border">
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
                    {getValue(data.first_name)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">Mid Name</span>
                    {getValue(data.mid_name)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">Last Name</span>
                    {getValue(data.last_name)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">Phone Number</span>
                    {getValue(data.phone_number)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">Birth Date</span>
                    {getValue(data.birth_date)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">Country</span>
                    {getValue(data.country)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">Province</span>
                    {getValue(provinceName)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">City</span>
                    {getValue(cityName)}
                  </div>
                </div>
              </div>

              {/* Description */}
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

      {/* Modal */}
      <GeneralInfoModal
        open={open}
        onOpenChange={setOpen}
        initialData={{
          profile_picture: data?.profile_picture || undefined,
          first_name: data?.first_name || "",
          mid_name: data?.mid_name ?? "",
          last_name: data?.last_name || "",
          phone_number: data?.phone_number || "",
          birth_date: data?.birth_date || "",
          country: data?.country || "Indonesia",
          province_id: data?.province_id || "",
          city_id: data?.city_id || "",
          description: data?.short_description || "",
        }}
        onSuccess={(updated) => {
          setData((prev) => (prev ? { ...prev, ...updated } : prev))
        }}
      />
    </>
  )
}
