import { useState } from "react"

export function useImageUpload(maxSizeMB = 2) {
    const [preview, setPreview] = useState<string | null>(null)
    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0]
        if (!selected) return

        if (!selected.type.startsWith("image/")) {
            setError("Only image files are allowed.")
            setMessage(null)
            setPreview(null)
            return
        }

        if (selected.size > maxSizeMB * 1024 * 1024) {
            setError(`Max file size is ${maxSizeMB}MB.`)
            setMessage(null)
            setPreview(null)
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
            setPreview(reader.result as string)
            setMessage("Image uploaded.")
            setError(null)
        }
        reader.readAsDataURL(selected)

        setFile(selected)
    }

    return {
        file,
        preview,
        error,
        message,
        handleChange,
    }
}
