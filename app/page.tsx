import Intro from '@/components/Intro'
import NewsletterForm from '@/components/NewsLetterForm'
import RecentPosts from '@/components/posts/RecentPost'
import RecentProjects from '@/components/projects/RecentProjects'
import React from 'react'

export default function Home() {
  return (
    <section className="pb-24 pt-40">
      <div className="container max-w-3xl">
        <Intro />

        <RecentPosts />
        <RecentProjects/>
        
        <NewsletterForm/>
      </div>
    </section>
  )
}
