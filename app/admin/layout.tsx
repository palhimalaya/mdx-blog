import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Home,
  LineChart,
  Rss,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  Users2,
  FolderOpenDot,
  FolderOpen,
  LayoutGrid
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export const description =
  "An orders dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. The main area has a list of recent orders with a filter and export button. The main area also has a detailed view of a single order with order details, shipping information, billing information, customer information, and payment information."


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="pb-14 pt-20 flex min-h-screen w-full flex-col bg-muted/40">
    <aside className="pt-20 fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
        <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/admin/dashboard"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Home className="h-5 w-5" />
              <span className="sr-only">Dashboard</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Dashboard</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/admin/posts"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Rss className="h-5 w-5" />
              <span className="sr-only">Posts</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Posts</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/admin/projects"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <FolderOpenDot className="h-5 w-5" />
              <span className="sr-only">Projects</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Projects</TooltipContent>
        </Tooltip>
        {/* for categories */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
            href="/admin/categories"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground
            transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <LayoutGrid className="h-5 w-5" />
              <span className="sr-only">Categories</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Categories</TooltipContent>
        </Tooltip>
        {/* <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/admin/users"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Users2 className="h-5 w-5" />
              <span className="sr-only">Users</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Users</TooltipContent>
        </Tooltip> */}
        {/* <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <LineChart className="h-5 w-5" />
              <span className="sr-only">Analytics</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Analytics</TooltipContent>
        </Tooltip> */}
        </TooltipProvider>

      </nav>
    </aside>
    <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-4 px-2.5 text-foreground"
              >
                <Home className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/admin/posts"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Rss className="h-5 w-5" />
                Posts
              </Link>
              <Link
                href="/admin/projects"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <FolderOpenDot className="h-5 w-5" />
                Projects
              </Link>
              <Link
                href="/admin/categories"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <LayoutGrid className="h-5 w-5" />
                Categories
              </Link>
              {/* <Link
                href="#"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <LineChart className="h-5 w-5" />
                Analytics
              </Link> */}
            </nav>
          </SheetContent>
        </Sheet>
      </header>
      <main className="container">
        {children}
      </main>
    </div>
  </div>
  )
}