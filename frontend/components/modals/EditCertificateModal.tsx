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
import { Award, Calendar } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// Schema
const certSchema = z.object({
    name: z.string().min(1, "Name is required"),
    issuer: z.string().min(1, "Issuer is required"),
    credential_id: z.string().min(1, "Credential ID is required"),
    url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    issue_date: z.string().optional(),
    expired_date: z.string().optional(),
})

export type CertificateForm = z.infer<typeof certSchema>

type Props = {
    open: boolean
    onClose: () => void
    certificate: CertificateForm | null
}

export default function EditCertificateModal({ open, onClose, certificate }: Props) {
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CertificateForm>({
        resolver: zodResolver(certSchema),
        defaultValues: {
            name: "",
            issuer: "",
            credential_id: "",
            url: "",
            issue_date: "",
            expired_date: "",
        },
    })

    // Auto isi form saat certificate berubah
    useEffect(() => {
        if (certificate) {
            reset(certificate)
        }
    }, [certificate, reset])

    const onSubmit = (data: CertificateForm) => {
        setLoading(true)
        setTimeout(() => {
            console.log("Update Certificate ✅", data)
            setLoading(false)
            onClose()
        }, 1500)
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-xl">
                {/* Header custom */}
                <div>
                    <div className="flex items-center gap-2">
                        <Award className="w-6 h-6" />
                        <DialogTitle asChild>
                            <h2 className="text-xl font-semibold">Edit Certification</h2>
                        </DialogTitle>
                    </div>

                    <div className="border-b my-3" />

                    <DialogDescription className="text-sm">
                        Update the details of your certification.
                    </DialogDescription>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-0.5">
                    <div>
                        <Label>
                            Certificate Name<span className="text-red-500">*</span>
                        </Label>
                        <Input placeholder="Certification name" {...register("name")} />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                        <Label>
                            Issuing organisation<span className="text-red-500">*</span>
                        </Label>
                        <Input placeholder="Organisation name" {...register("issuer")} />
                        {errors.issuer && <p className="text-xs text-red-500 mt-1">{errors.issuer.message}</p>}
                    </div>

                    <div>
                        <Label>
                            Credential ID<span className="text-red-500">*</span>
                        </Label>
                        <Input placeholder="e.g., ABC12345" {...register("credential_id")} />
                        {errors.credential_id && (
                            <p className="text-xs text-red-500 mt-1">{errors.credential_id.message}</p>
                        )}
                    </div>

                    <div>
                        <Label>URL</Label>
                        <Input placeholder="https://..." {...register("url")} />
                        {errors.url && <p className="text-xs text-red-500 mt-1">{errors.url.message}</p>}
                    </div>

                    {/* Dates */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Label>Issue date</Label>
                            <div className="relative">
                                <Input type="date" className="pr-10" {...register("issue_date")} />
                                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            </div>
                        </div>

                        <div className="flex-1">
                            <Label>Expired date</Label>
                            <div className="relative">
                                <Input type="date" className="pr-10" {...register("expired_date")} />
                                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-green-700 hover:bg-green-600" disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
