"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
import { FileUser, Upload } from "lucide-react"

// ✅ Benerin schema: portfolioType wajib
const formSchema = z.object({
    cv: z.any(),
    portfolioType: z.enum(["pdf", "link"]),
    portfolio: z.any().optional(),
})

type FormValues = z.infer<typeof formSchema>

type PortfolioField =
    | { type: "pdf"; filename: string; url: string }
    | { type: "link"; url: string; filename?: string }

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: (data: FormValues) => void
    initialData?: {
        cv?: { filename: string; url: string }
        portfolio?: PortfolioField // ✅ langsung pakai union type
    }
}

export default function CvPortfolioModal({
    open,
    onOpenChange,
    onSuccess,
    initialData,
}: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        control,
        reset,
        watch,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            portfolioType: initialData?.portfolio?.type || "pdf",
        },
    })

    const portfolioType = watch("portfolioType")

    useEffect(() => {
        if (open && initialData) {
            reset({
                cv: initialData.cv?.filename,
                portfolioType: initialData.portfolio?.type || "pdf",
                portfolio:
                    initialData.portfolio?.type === "link"
                        ? initialData.portfolio.url
                        : undefined, // jangan isi filename kalau type = pdf
            })
        }
    }, [open, initialData, reset])


    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setIsSubmitting(true)
        try {
            console.log("Submitted CV/Portfolio:", data)
            await new Promise((r) => setTimeout(r, 700))
            toast.success("CV & Portfolio saved!")
            onSuccess?.(data)
            onOpenChange(false)
        } catch {
            toast.error("Failed to save")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg p-0">
                <div className="flex flex-col max-h-[85vh] overflow-hidden">
                    {/* Header */}
                    <DialogHeader className="px-6 pt-6 pb-3 border-b">
                        <DialogTitle className="flex items-center gap-2 text-lg">
                            <FileUser className="w-5 h-5" />
                            CV & Portofolio
                        </DialogTitle>
                    </DialogHeader>

                    {/* Form */}
                    <form
                        id="cv-portfolio-form"
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col px-6 py-4 space-y-2"
                    >
                        {/* CV */}
                        <div>
                            <Label>Curriculum Vitae</Label>
                            <div className="mt-2">
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    className="hidden"
                                    id="cv-upload"
                                    {...register("cv")}
                                />
                                <label
                                    htmlFor="cv-upload"
                                    className="flex items-center justify-between px-3 py-1.5 rounded-md bg-[#1e2238] text-white cursor-pointer"
                                >
                                    {typeof initialData?.cv?.filename === "string"
                                        ? initialData.cv.filename
                                        : "Choose File"}
                                    <Upload className="w-4 h-4" />
                                </label>
                            </div>
                            <p className="text-xs italic text-gray-500 mt-1">
                                *Please upload your most recent CV in PDF format (max. 2MB)
                            </p>
                            {errors.cv && (
                                <p className="text-xs text-red-500">{errors.cv.message?.toString()}</p>
                            )}
                        </div>

                        {/* Portfolio */}
                        <div>
                            <Label>Portfolio (Optional)</Label>
                            <div className="mt-2 space-y-2">
                                {/* Select PDF or Link */}
                                <Controller
                                    name="portfolioType"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-fit min-w-[140px]">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pdf">PDF Files</SelectItem>
                                                <SelectItem value="link">Link</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />

                                {/* Conditional input */}
                                {portfolioType === "pdf" ? (
                                    <Controller
                                        name="portfolio"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <input
                                                    type="file"
                                                    accept="application/pdf"
                                                    className="hidden"
                                                    id="portfolio-upload"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0]
                                                        field.onChange(file ?? null) // simpan File, bukan FileList
                                                    }}
                                                />
                                                <label
                                                    htmlFor="portfolio-upload"
                                                    className="flex items-center justify-between px-3 py-1.5 rounded-md bg-[#1e2238] text-white cursor-pointer"
                                                >
                                                    {field.value instanceof File
                                                        ? field.value.name
                                                        : initialData?.portfolio?.type === "pdf"
                                                            ? initialData.portfolio?.filename
                                                            : "Choose File"}
                                                    <Upload className="w-4 h-4" />
                                                </label>
                                                <p className="text-xs italic text-gray-500 mt-1">
                                                    *Please upload your most recent Portfolio in PDF format (max. 2MB)
                                                </p>
                                            </>
                                        )}
                                    />
                                ) : (
                                    <Controller
                                        name="portfolio"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                type="url"
                                                placeholder="https://example.com/portfolio"
                                                {...field}
                                                value={
                                                    typeof field.value === "string"
                                                        ? field.value
                                                        : initialData?.portfolio?.type === "link"
                                                            ? initialData.portfolio?.url
                                                            : ""
                                                }
                                            />
                                        )}
                                    />
                                )}
                            </div>
                        </div>
                    </form>

                    {/* Footer */}
                    <DialogFooter className="px-6 py-3 border-t bg-white">
                        <div className="flex w-full justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                form="cv-portfolio-form"
                                className="bg-green-700 hover:bg-green-600"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}
