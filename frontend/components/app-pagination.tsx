"use client"

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "@/components/ui/pagination"

interface ShadCNPaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    siblingCount?: number // default 1
}

export default function AppPagination({
    currentPage,
    totalPages,
    onPageChange,
    siblingCount = 1,
}: ShadCNPaginationProps) {
    const DOTS = "..."

    const getPageNumbers = () => {
        const pages: (number | string)[] = []

        const startPage = Math.max(2, currentPage - siblingCount)
        const endPage = Math.min(totalPages - 1, currentPage + siblingCount)

        pages.push(1)
        if (startPage > 2) pages.push(DOTS)

        for (let i = startPage; i <= endPage; i++) pages.push(i)

        if (endPage < totalPages - 1) pages.push(DOTS)
        if (totalPages > 1) pages.push(totalPages)

        return pages
    }

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault()
                            if (currentPage > 1) onPageChange(currentPage - 1)
                        }}
                    />
                </PaginationItem>

                {getPageNumbers().map((page, idx) => (
                    <PaginationItem key={idx}>
                        {page === DOTS ? (
                            <PaginationEllipsis />
                        ) : (
                            <PaginationLink
                                isActive={page === currentPage}
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault()
                                    onPageChange(Number(page))
                                }}
                            >
                                {page}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault()
                            if (currentPage < totalPages) onPageChange(currentPage + 1)
                        }}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}