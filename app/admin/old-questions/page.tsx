import React from 'react';
import ClientComponent from './ClientComponent';
import { getFaculties } from '@/lib/oldQuestionSupabase';
const Page = async() => {
  const faculties = await getFaculties();
  return (
    <section className=''>
          <div className=''>
            <ClientComponent faculties={faculties} />
          </div>
        </section>
  );
  };

export default Page;