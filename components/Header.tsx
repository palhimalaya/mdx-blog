import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Button } from './ui/button';
import NavMenu from './NavMenu';
import { checkRole } from '@/utils/roles';

export default async function Header() {
  const isAdmin = await checkRole('admin');

  return (
    <header className='fixed inset-x-0 top-0 z-50 bg-background/75 py-6 backdrop-blur-sm'>
      <nav className='container flex max-w-3xl items-center justify-between'>
        <NavMenu isAdmin={isAdmin} />
        <div className='flex items-center justify-center gap-5 ml-10'>
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
  );
}