import { SearchUsers } from '@/components/SearchUsers';
import React from 'react';
import { clerkClient } from '@clerk/nextjs/server';
import UserRoleForm from '@/components/UserRoleForm';

export default async function page(params: { searchParams: { search?: string } }) {
  const query = params.searchParams.search;

  const users = query ? (await clerkClient().users.getUserList({ query })).data : [];

  return (
    <section className='pb-24 pt-40 bg-gray-50 dark:bg-gray-900'>
      <div className='container max-w-3xl'>
        <h1 className='title mb-12 text-gray-900 dark:text-gray-100'>Posts</h1>
        <SearchUsers />
        <div className='grid grid-cols-1 gap-6'>
          {users.map((user) => (
            <div key={user.id} className='p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md'>
              <div className='mb-4'>
                <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
                  {user.firstName} {user.lastName}
                </h2>
                <p className='text-gray-600 dark:text-gray-400'>
                  {user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)?.emailAddress}
                </p>
                <p className='text-gray-600 dark:text-gray-400'>{user.publicMetadata.role as string}</p>
              </div>
              <div className='flex space-x-4'>
                <UserRoleForm userId={user.id} defaultRole="admin" />
                <UserRoleForm userId={user.id} defaultRole="moderator" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}