"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, ChevronDown, Blocks } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type Skill = {
    name: string
    level: "Beginner" | "Intermediate" | "Advanced" | "Native"
}

const skillLevels: Skill["level"][] = ["Beginner", "Intermediate", "Advanced"]
const languageLevels: Skill["level"][] = ["Beginner", "Intermediate", "Advanced", "Native"]

type Props = {
    open: boolean
    onClose: () => void
    initialSkills: Skill[]
    initialLanguages: Skill[]
    onSave: (skills: Skill[], languages: Skill[]) => void
}

const levels: Skill["level"][] = ["Beginner", "Intermediate", "Advanced", "Native"]

const levelColors: Record<string, string> = {
    Beginner: "bg-[#56DACA] text-black",
    Intermediate: "bg-[#007C84] text-white",
    Advanced: "bg-[#004A5F] text-white",
    Native: "bg-[#00253F] text-white",
}

export default function EditSkillsModal({
    open,
    onClose,
    initialSkills,
    initialLanguages,
    onSave,
}: Props) {
    const [skills, setSkills] = useState<Skill[]>(initialSkills)
    const [languages, setLanguages] = useState<Skill[]>(initialLanguages)

    const handleChange = (
        list: Skill[],
        setList: (val: Skill[]) => void,
        idx: number,
        field: keyof Skill,
        value: string
    ) => {
        const updated = [...list]
        updated[idx] = { ...updated[idx], [field]: value as any }
        setList(updated)
    }

    const handleAdd = (list: Skill[], setList: (val: Skill[]) => void) => {
        setList([...list, { name: "", level: "Beginner" }])
    }

    const handleRemove = (list: Skill[], setList: (val: Skill[]) => void, idx: number) => {
        const updated = list.filter((_, i) => i !== idx)
        setList(updated)
    }

    const saveChanges = () => {
        onSave(skills, languages)
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[70vh] flex flex-col">
                {/* Header custom */}
                <div>
                    <div className="flex items-center gap-2">
                        <Blocks className="w-6 h-6" />
                        <DialogTitle asChild>
                            <h2 className="text-xl font-semibold">Skills</h2>
                        </DialogTitle>
                    </div>

                    <div className="border-b my-3" />

                    <DialogDescription className="text-sm">
                        Showcase your hard skills or soft skills and languages to highlight your strengths.
                    </DialogDescription>
                </div>
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto pr-1 space-y-6">
                    {/* Skills */}
                    <div className="space-y-3 border-[2px] rounded-xl p-4">
                        <Label className="font-semibold">Skills</Label>
                        {skills.map((s, idx) => (
                            <div
                                key={idx}
                                className="flex gap-3 items-center"
                            >
                                {/* Nomor bulat */}
                                <span className="flex items-center font-semibold justify-center w-7 h-7 rounded-full border-[2px] text-[12px]">
                                    {idx + 1}
                                </span>

                                {/* Input skill */}
                                <Input
                                    className="w-[420px] "
                                    placeholder="Skill Name"
                                    value={s.name}
                                    onChange={(e) => handleChange(skills, setSkills, idx, "name", e.target.value)}
                                />

                                {/* Select level */}
                             
                                <div className="relative w-40">
                                    <Select
                                        value={s.level}
                                        onValueChange={(val) => handleChange(skills, setSkills, idx, "level", val)}
                                    >
                                        <SelectTrigger className={`w-full border-[2px] ${levelColors[s.level]}`}>
                                            <SelectValue placeholder="Choose level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {skillLevels.map((lv) => (
                                                <SelectItem key={lv} value={lv} className="cursor-pointer">
                                                    {lv}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Remove button */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemove(skills, setSkills, idx)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAdd(skills, setSkills)}
                            className="flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Add more
                        </Button>
                    </div>

                    {/* Languages */}
                    <div className="space-y-3 border-[2px] rounded-xl p-4">
                        <Label className="font-semibold">Languages</Label>
                        {languages.map((l, idx) => (
                            <div key={idx} className="flex gap-3 items-center">
                                {/* Nomor bulat */}
                                <span className="flex items-center justify-center w-6 h-6 rounded-full border-4 text-xs">
                                    {idx + 1}
                                </span>

                                {/* Input language */}
                                <Input
                                    className="w-[420px] "
                                    placeholder="Language"
                                    value={l.name}
                                    onChange={(e) =>
                                        handleChange(languages, setLanguages, idx, "name", e.target.value)
                                    }
                                />

                                {/* Languages Select level */}
                                <div className="relative w-40">
                                    <Select
                                        value={l.level}
                                        onValueChange={(val) => handleChange(languages, setLanguages, idx, "level", val)}
                                    >
                                        <SelectTrigger className={`w-full border-[2px] ${levelColors[l.level]}`}>
                                            <SelectValue placeholder="Choose level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {languageLevels.map((lv) => (
                                                <SelectItem key={lv} value={lv} className="cursor-pointer">
                                                    {lv}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Remove button */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemove(languages, setLanguages, idx)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAdd(languages, setLanguages)}
                            className="flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Add more
                        </Button>
                    </div>
                </div>

                {/* Footer fixed */}
                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button className="bg-green-700 hover:bg-green-600" onClick={saveChanges}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
