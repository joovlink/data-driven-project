"use client"

import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Briefcase, Calendar } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Checkbox } from "@/components/ui/checkbox"

// ✅ Schema validasi
const expSchema = z
    .object({
        job_name: z.string().min(1, "Job name is required"),
        company_name: z.string().min(1, "Company name is required"),
        start_date: z.string().min(1, "Start date is required"),
        end_date: z.string().optional(),
        currently_working: z.boolean(),
        description: z.string().min(100, "Description must be at least 100 characters"),
    })
    .refine(
        (data) => {
            if (!data.currently_working && data.end_date) {
                return new Date(data.end_date) >= new Date(data.start_date)
            }
            return true
        },
        {
            message: "End date must be later than start date",
            path: ["end_date"],
        }
    )

type ExperienceForm = z.infer<typeof expSchema>

type Props = {
    open: boolean
    onClose: () => void
    initialData?: ExperienceForm
    recordId?: string // 🆔 ID dari backend
}

export default function EditExperienceModal({ open, onClose, initialData, recordId }: Props) {
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        control,
        formState: { errors },
    } = useForm<ExperienceForm>({
        resolver: zodResolver(expSchema),
        defaultValues: {
            job_name: "",
            company_name: "",
            start_date: "",
            end_date: "",
            currently_working: false,
            description: "",
        },
    })

    const currentlyWorking = watch("currently_working")

    // 🔄 isi ulang form ketika initialData berubah
    useEffect(() => {
        if (initialData) {
            reset(initialData)
        }
    }, [initialData, reset])

    const onSubmit = (data: ExperienceForm) => {
        setLoading(true)
        setTimeout(() => {
            // 🆔 ID backend ikut dikirim
            console.log("Update Experience ✅", { id: recordId, ...data })
            setLoading(false)
            onClose()
        }, 1500)
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl">
                {/* Header */}
                <div>
                    <div className="flex items-center gap-3">
                        <Briefcase className="w-6 h-6" />
                        <DialogTitle asChild>
                            <h2 className="text-xl font-semibold">Edit Experience</h2>
                        </DialogTitle>
                    </div>
                    <div className="border-b my-3" />
                    <DialogDescription className="text-sm">
                        Update your professional experience with job title, company, and responsibilities.
                    </DialogDescription>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 max-h-[44vh] overflow-y-auto px-0.5 pr-4"
                >
                    {/* Job Name */}
                    <div>
                        <Label>
                            Job Name <span className="text-red-500">*</span>
                        </Label>
                        <Input {...register("job_name")} disabled={loading} />
                        {errors.job_name && (
                            <p className="text-xs text-red-500 mt-1">{errors.job_name.message}</p>
                        )}
                    </div>

                    {/* Company Name */}
                    <div>
                        <Label>
                            Company Name <span className="text-red-500">*</span>
                        </Label>
                        <Input {...register("company_name")} disabled={loading} />
                        {errors.company_name && (
                            <p className="text-xs text-red-500 mt-1">{errors.company_name.message}</p>
                        )}
                    </div>
                    {/* Checkbox */}
                    <Controller
                        name="currently_working"
                        control={control}
                        render={({ field }) => (
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="currently"
                                    checked={field.value}
                                    onCheckedChange={(val) => {
                                        field.onChange(val)
                                        if (val) {
                                            setValue("end_date", "Now")
                                        } else {
                                            setValue("end_date", "")
                                        }
                                    }}
                                />
                                <Label htmlFor="currently">Currently working here</Label>
                            </div>
                        )}
                    />

                    <div className="flex gap-2">
                        {/* Start Date */}
                        <div className="flex-1">
                            <Label>
                                Start Date <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <Input type="date" className="pr-10" {...register("start_date")} disabled={loading} />
                                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            </div>
                            {errors.start_date && (
                                <p className="text-xs text-red-500 mt-1">{errors.start_date.message}</p>
                            )}
                        </div>


                        {/* End Date */}
                        {!currentlyWorking && (
                            <div className="flex-1">
                                <Label>End Date</Label>
                                <div className="relative">
                                    <Input type="date" className="pr-10" {...register("end_date")} disabled={loading} />
                                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                </div>
                                {errors.end_date && (
                                    <p className="text-xs text-red-500 mt-1">{errors.end_date.message}</p>
                                )}
                            </div>
                        )}
                    </div>


                    {/* Short Description */}
                    <div>
                        <Label>
                            Short Description <span className="text-red-500">*</span>
                        </Label>
                        <Textarea rows={8} {...register("description")} disabled={loading} />
                        {errors.description && (
                            <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Footer */}
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-green-700 hover:bg-green-600"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
