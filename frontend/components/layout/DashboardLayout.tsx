"use client"

import {
    Sidebar,
    SidebarContent,
    useSidebar,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/admin/app-sidebar"
import { AppNavbar } from "@/components/admin/app-navbar"
import { AnimatePresence, motion } from "framer-motion"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import { useEffect } from "react"
import { setSidebarOpen } from "@/store/slices/sidebarSlice"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { open, setOpen } = useSidebar()
    const dispatch = useDispatch()
    const reduxOpen = useSelector((state: RootState) => state.sidebar.isOpen)

    useEffect(() => {
        setOpen(reduxOpen)
    }, [])

    useEffect(() => {
        dispatch(setSidebarOpen(open))
    }, [open, dispatch])

    return (
        <div className="flex w-full min-h-screen relative">
            <Sidebar>
                <SidebarContent>
                    <AppSidebar />
                </SidebarContent>
            </Sidebar>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.7, x: "-50%" }}
                        animate={{ opacity: 1, scale: 1, x: "-50%" }}
                        transition={{ duration: 0.2, delay: 0.2 }}
                        className="absolute top-5 left-[230px] z-50"
                    >
                        <SidebarTrigger
                            onClick={() => setOpen(false)}
                            className="bg-[#261D1D] text-white rounded-lg w-6 h-6 flex items-center justify-center hover:shadow-2xl hover:shadow-white  transition"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col w-full max-h-screen">
                {!open ? <AppNavbar /> : <div className="h-6" />}

                <main className="w-full flex-1 overflow-auto custom-scroll">
                    {children}
                </main>
                
                <footer className="flex justify-center items-end py-3 bg-[#F7F7F7]">
                    <span className="text-xs font-light text-center text-black/90">
                        ©2025 Arthatel / SCBD Data Center. All right reserved.
                    </span>
                </footer>
            </div>
        </div>
    )
}
