'use client';

import { usePathname, useRouter } from 'next/navigation';

export const SearchUsers = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="my-4">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const formData = new FormData(form);
          const queryTerm = formData.get('search') as string;
          router.push(pathname + '?search=' + queryTerm);
        }}
        className="flex flex-col sm:flex-row items-center"
      >
        <label htmlFor="search" className="mb-2 sm:mb-0 sm:mr-4 text-gray-700 dark:text-gray-300">
          Search for Users
        </label>
        <input
          id="search"
          name="search"
          type="text"
          className="flex-grow p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
        />
        <button
          type="submit"
          className="mt-2 sm:mt-0 sm:ml-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          Submit
        </button>
      </form>
    </div>
  );
};