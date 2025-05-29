"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
type PaginationProps = React.ComponentProps<"nav"> & {
  total: number
  pageSize: number
  currentPage: number
  onPageChange: (page: number) => void
}

type ButtonVariantProps = VariantProps<typeof buttonVariants>

const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  ({ className, total, pageSize, currentPage, onPageChange, ...props }, ref) => {
    const totalPages = Math.ceil(total / pageSize);
    
    // Calculer les pages à afficher
    const renderPageNumbers = () => {
      const pages = [];
      const showEllipsisBefore = currentPage > 3;
      const showEllipsisAfter = currentPage < totalPages - 2;

      // Toujours afficher la première page
      if (totalPages > 0) {
        pages.push(
          <PaginationItem key={1}>
            <PaginationLink 
              onClick={() => onPageChange(1)} 
              isActive={currentPage === 1}
              size="icon"
            >
              1
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Afficher l'ellipsis avant
      if (showEllipsisBefore) {
        pages.push(
          <PaginationItem key="ellipsis-before">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Pages autour de la page courante
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        // Ne pas dupliquer la première ou dernière page
        if (i === 1 || i === totalPages) continue;

        pages.push(
          <PaginationItem key={i}>
            <PaginationLink 
              onClick={() => onPageChange(i)} 
              isActive={currentPage === i}
              size="icon"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Afficher l'ellipsis après
      if (showEllipsisAfter) {
        pages.push(
          <PaginationItem key="ellipsis-after">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Toujours afficher la dernière page si elle existe
      if (totalPages > 1) {
        pages.push(
          <PaginationItem key={totalPages}>
            <PaginationLink 
              onClick={() => onPageChange(totalPages)} 
              isActive={currentPage === totalPages}
              size="icon"
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }

      return pages;
    };

    return (
      <nav
        ref={ref}
        className={cn("mx-auto flex w-full justify-center", className)}
        {...props}
      >
        <ul className="flex flex-row items-center gap-1">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            />
          </PaginationItem>
          {renderPageNumbers()}
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            />
          </PaginationItem>
        </ul>
      </nav>
    )
  }
)
Pagination.displayName = "Pagination"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("list-none", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
  size?: ButtonVariantProps["size"]
  disabled?: boolean
} & React.ComponentProps<"a">

const PaginationLink = React.forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  ({ className, isActive, size = "icon", ...props }, ref) => (
    <a
      ref={ref}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      )}
      {...props}
    />
  )
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = React.forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  ({ className, ...props }, ref) => (
    <PaginationLink
      ref={ref}
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 pl-2.5", className)}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span>Précédent</span>
    </PaginationLink>
  )
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = React.forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  ({ className, ...props }, ref) => (
    <PaginationLink
      ref={ref}
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 pr-2.5", className)}
      {...props}
    >
      <span>Suivant</span>
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  )
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
}
