import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* <h1 className="mb-6 text-2xl font-bold">Sign in to your account</h1> */}
      <SignIn />
    </div>
  );
}