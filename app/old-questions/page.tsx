import React from 'react';
import ClientComponent from './ClientComponent';
import { getFaculties } from '@/lib/oldQuestionSupabase';
const Page = async() => {
  const faculties = await getFaculties();
  return (
    <section className='pb-24 mt-24'>
          <div className='p-4'>
            <ClientComponent faculties={faculties} />
          </div>
        </section>
  );
  };

export default Page;