'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface NavMenuProps {
  isAdmin: boolean;
}

export default function NavMenu({ isAdmin }: NavMenuProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <div className='flex items-center justify-between md:hidden'>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <button
              onClick={toggleMobileMenu}
              className='text-muted-foreground focus:outline-none mr-4'
            >
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M4 6h16M4 12h16m-7 6h7'
                ></path>
              </svg>
            </button>
          </SheetTrigger>
          <SheetContent side='left' className='bg-background'>
            <SheetTitle hidden className='p-4 text-xl font-bold'>Menu</SheetTitle>
            <SheetDescription hidden className='p-4 text-sm font-light'> Navigation Menu </SheetDescription>
            <div className='flex flex-col items-start gap-6 p-4'>
              <SheetClose asChild>
                <Link href='/' className='font-serif text-2xl font-bold'>
                  palhimalaya
                </Link>
              </SheetClose>
              <ul className='flex flex-col items-start gap-6 text-sm font-light text-muted-foreground'>
                <li className='transition-colors hover:text-foreground'>
                  <Link href='/posts'>Posts</Link>
                </li>
                <li className='transition-colors hover:text-foreground'>
                  <Link href='/projects'>Projects</Link>
                </li>
                <li className='transition-colors hover:text-foreground'>
                  <Link href='/old-questions'>Old Questions</Link>
                </li>
                {isAdmin && (
                  <li className='transition-colors hover:text-foreground'>
                    <Link href='/admin/dashboard'>Dashboard</Link>
                  </li>
                )}
              </ul>
            </div>
          </SheetContent>
        </Sheet>
        <Link href='/' className='font-serif text-2xl font-bold'>
          palhimalaya
        </Link>
      </div>

      <ul className='hidden md:flex flex-row items-center gap-6 text-sm font-light text-muted-foreground sm:gap-10'>
        <li className='transition-colors hover:text-foreground'>
          <Link href='/posts'>Posts</Link>
        </li>
        <li className='transition-colors hover:text-foreground'>
          <Link href='/projects'>Projects</Link>
        </li>
        <li className='transition-colors hover:text-foreground'>
          <Link href='/old-questions'>Old Questions</Link>
        </li>
        {isAdmin && (
          <li className='transition-colors hover:text-foreground'>
            <Link href='/admin/dashboard'>Dashboard</Link>
          </li>
        )}
      </ul>
    </>
  );
}