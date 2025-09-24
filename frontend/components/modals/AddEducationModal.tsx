"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { GraduationCap, Calendar } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Checkbox } from "@/components/ui/checkbox"

// Schema validasi Education
const eduSchema = z
    .object({
        qualification: z.string().min(1, "Qualification is required"),
        school_name: z.string().min(1, "School / University is required"),
        degree: z.string().min(1, "Degree / Major is required"),
        start_year: z.string().min(4, "Start year is required"),
        end_year: z.string().min(4, "Finish year is required").optional(),
        ongoing: z.boolean(),
        description: z.string().min(30, "Description must be at least 30 characters"),
    })
    .refine(
        (data) => {
            if (!data.ongoing && data.end_year) {
                return parseInt(data.end_year) >= parseInt(data.start_year)
            }
            return true
        },
        {
            message: "Finish year must be later than start year",
            path: ["end_year"],
        }
    )

type EducationForm = z.infer<typeof eduSchema>

type Props = {
    open: boolean
    onClose: () => void
}

export default function AddEducationModal({ open, onClose }: Props) {
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors },
    } = useForm<EducationForm>({
        resolver: zodResolver(eduSchema),
        defaultValues: {
            qualification: "",
            school_name: "",
            degree: "",
            start_year: "",
            end_year: "",
            ongoing: false,
            description: "",
        },
    })

    const ongoing = watch("ongoing")

    const onSubmit = (data: EducationForm) => {
        setLoading(true)
        setTimeout(() => {
            console.log("Dummy API call success ✅", data)
            setLoading(false)
            onClose()
        }, 1500)
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl">
                {/* Header */}
                <div>
                    <div className="flex items-center gap-2">
                        <GraduationCap className="w-6 h-6" />
                        <DialogTitle asChild>
                            <h2 className="text-xl font-semibold">Add Education</h2>
                        </DialogTitle>
                    </div>
                    <div className="border-b my-3" />
                    <DialogDescription className="text-sm">
                        Share your education history with school, degree, and study period.
                    </DialogDescription>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 max-h-[44vh] overflow-y-auto px-0.5 pr-4"
                >
                    {/* Qualification */}
                    <div>
                        <Label>
                            Qualification <span className="text-red-500">*</span>
                        </Label>
                        <Controller
                            name="qualification"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={loading}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select qualification" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="highschool">High School</SelectItem>
                                        <SelectItem value="diploma">Diploma</SelectItem>
                                        <SelectItem value="bachelor">Bachelor</SelectItem>
                                        <SelectItem value="master">Master</SelectItem>
                                        <SelectItem value="doctorate">Doctorate</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.qualification && (
                            <p className="text-xs text-red-500 mt-1">
                                {errors.qualification.message}
                            </p>
                        )}
                    </div>
                    {/* School / University */}
                    <div>
                        <Label>
                            School / University <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            placeholder="e.g., University of Indonesia"
                            {...register("school_name")}
                            disabled={loading}
                        />
                        {errors.school_name && (
                            <p className="text-xs text-red-500 mt-1">{errors.school_name.message}</p>
                        )}
                    </div>

                    {/* Degree / Major */}
                    <div>
                        <Label>
                            Degree / Major <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            placeholder="e.g., Bachelor of Computer Science"
                            {...register("degree")}
                            disabled={loading}
                        />
                        {errors.degree && (
                            <p className="text-xs text-red-500 mt-1">{errors.degree.message}</p>
                        )}
                    </div>
                    {/* Checkbox Ongoing */}
                    <Controller
                        name="ongoing"
                        control={control}
                        render={({ field }) => (
                            <div className="flex items-center gap-2">
                                <Checkbox id="ongoing" checked={field.value} onCheckedChange={field.onChange} />
                                <Label htmlFor="ongoing">Ongoing (still studying)</Label>
                            </div>
                        )}
                    />
                    <div className="flex gap-2">
                        {/* Start Year */}
                        <div className="flex-1">
                            <Label>
                                Start Year <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="e.g., 2018"
                                    {...register("start_year")}
                                    disabled={loading}
                                    maxLength={4}
                                    onInput={(e) => {
                                        const target = e.target as HTMLInputElement
                                        // Hanya boleh angka
                                        target.value = target.value.replace(/[^0-9]/g, "")
                                    }}
                                />

                            </div>
                            {errors.start_year && (
                                <p className="text-xs text-red-500 mt-1">{errors.start_year.message}</p>
                            )}
                        </div>



                        {/* End / Expected Finish Year */}
                        <div className="flex-1">
                            <Label>{ongoing ? "Expected Finish Year" : "Finish Year"}</Label>
                            <div className="relative">
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="e.g., 2018"
                                    {...register("end_year")}
                                    disabled={loading}
                                    maxLength={4}
                                    onInput={(e) => {
                                        const target = e.target as HTMLInputElement
                                        // Hanya boleh angka
                                        target.value = target.value.replace(/[^0-9]/g, "")
                                    }}
                                />

                            </div>
                            {errors.end_year && (
                                <p className="text-xs text-red-500 mt-1">{errors.end_year.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <Label>
                            Description <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            placeholder="Enter short description"
                            rows={8}
                            {...register("description")}
                            disabled={loading}
                        />
                        {errors.description && (
                            <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
                        )}
                    </div>

                </form>
                {/* Footer */}
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="bg-teal-800 hover:bg-teal-700"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
