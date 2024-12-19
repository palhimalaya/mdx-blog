import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Button } from './ui/button'
import { checkRole } from '@/utils/roles'

export default function Header() {
  return (
    <header className='fixed inset-x-0 top-0 z-50 bg-background/75 py-6 backdrop-blur-sm'>
      <nav className='container flex max-w-3xl items-center justify-between'>
        <div>
          <Link href='/' className='font-serif text-2xl font-bold'>
            palhimalaya
          </Link>
        </div>

        <ul className='flex items-center gap-6 text-sm font-light text-muted-foreground sm:gap-10'>
          <li className='transition-colors hover:text-foreground'>
            <Link href='/posts'>Posts</Link>
          </li>
          <li className='transition-colors hover:text-foreground'>
            <Link href='/projects'>Projects</Link>
          </li>
          <li className='transition-colors hover:text-foreground'>
            <Link href='/old-questions'>Generate Old Questions</Link>
          </li>
          {/* <li className='transition-colors hover:text-foreground'>
            <Link href='/contact'>Contact</Link>
          </li> */}
          {checkRole('admin') ? (
            <li className='transition-colors hover:text-foreground'>
              <Link href='/admin/dashboard'>Dashboard</Link>
            </li>
          ) : null}
        </ul>

        <div className='flex items-center justify-center gap-5'>
          <ThemeToggle />
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Link href={'/sign-in'}>
              <Button variant={'outline'}>Sign In</Button>
            </Link>
          </SignedOut>
        </div>
      </nav>
    </header>
  )
}
