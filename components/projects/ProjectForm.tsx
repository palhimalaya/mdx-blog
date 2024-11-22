// 'use client';

// import React, { useEffect, useState } from 'react';
// import { z } from 'zod';
// import { SubmitHandler, useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { postSchema } from '@/lib/schemas';
// import { Button } from '../ui/button';
// import { useUser } from '@clerk/nextjs';
// import { toast } from 'sonner';
// import { imageUpload } from '@/utils/ImageUpload';
// import { Post } from '@/types/posts';
// import Image from 'next/image';
// import { createProject, updateProject } from '@/lib/projectSupabase';


// type PostFormValues = z.infer<typeof postSchema>;

// export default function ProjectForm({project}: {project?: Post}) {
//   const { user } = useUser();
//   const [uploading, setUploading] = useState(false);
//   const {
//     register,
//     handleSubmit,
//     reset,
//     watch,
//     setValue,
//     formState: { errors, isSubmitting },
//   } = useForm<PostFormValues>({
//     resolver: zodResolver(postSchema),
//     defaultValues: {
//       title: project?.title || '',
//       slug: project?.slug || '',
//       summary: project?.summary || '',
//       image: project?.image || '',
//       content: project?.content || '',
//     },
//   });

//   const title = watch('title');
//   useEffect(() => {
//     if (project) {
//       reset({
//         title: project.title,
//         slug: project.slug,
//         summary: project.summary,
//         image: project.image,
//         content: project.content,
//       });
//     }
//   }, [project, reset, user]);

//   useEffect(() => {
//     const slug = generateSlug(title);
//     setValue('slug', slug);
//   }, [title, setValue]);

//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
  
//     setUploading(true);
//     try {
//       const imageUrl = await imageUpload(file);
//       toast.success('Image uploaded successfully');
//       setValue('image', imageUrl);
//     } catch (error) {
//       toast.error('Failed to upload image');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const processForm: SubmitHandler<PostFormValues> = async data => {
//     try {
//       if (project) {
//         if (!project.id) {
//           throw new Error('Post ID is required');
//         }
//         await updateProject({ ...data, id: project.id });
//         toast.success('Post updated successfully');
//         return;
//       }
//       if(user){
//         await createProject({ ...data, author: user.fullName || ''});
//       }
//       reset();
//       toast.success('Post created successfully');
//       return;
//     } catch (error) {
//       toast.error('Failed to create post');
//       console.error(error);
//     }
//   };

//   return (
//     <div className="space-y-8 p-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm max-w-full mx-auto">
//       <form onSubmit={handleSubmit(processForm)} className="space-y-4 w-full" noValidate>
//         <div>
//           <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
//           <input
//             id="title"
//             autoComplete='title'
//             {...register('title')}
//             className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 dark:bg-gray-800 dark:text-gray-300"
//           />
//           {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
//         </div>

//         {/* Slug */}
//         <div>
//           <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Slug</label>
//           <input
//             id="slug"
//             {...register('slug')}
//             className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 dark:bg-gray-800 dark:text-gray-300"
//             onChange={(e) => {
//               const value = e.target.value
//                 .toLowerCase()
//                 .replace(/\s+/g, '-')
//                 .replace(/[^a-z0-9-]/g, '');
//               setValue('slug', value);
//             }}
//           />
//           {errors.slug && <p className="text-red-500 text-sm">{errors.slug.message}</p>}
//         </div>

//         {/* Summary */}
//         <div>
//           <label htmlFor="summary" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Summary</label>
//           <textarea
//             id="summary"
//             {...register('summary')}
//             rows={3}
//             className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 dark:bg-gray-800 dark:text-gray-300"
//           />
//           {errors.summary && <p className="text-red-500 text-sm">{errors.summary.message}</p>}
//         </div>

//         {/* Image Upload */}
//         <div>
//           <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image Upload</label>
//           {/* {post && (
//             <div className="mt-2 w-32 h-32 relative">
//               <Image src={post.image} alt="Uploaded" layout="fill" objectFit="cover" className="rounded-md" />
//             </div>
//           )} */}
//           <input
//             type="file"
//             id="image"
//             onChange={handleImageUpload}
//             className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 dark:bg-gray-800 dark:text-gray-300"
//           />
//           {uploading && <p className="text-blue-500 text-sm">Uploading...</p>}
//           {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
//         </div>

//         {/* Content */}
//         <div>
//           <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content (MDX)</label>
//           <textarea
//             id="content"
//             {...register('content')}
//             rows={6}
//             className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 dark:bg-gray-800 dark:text-gray-300"
//           />
//           {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
//         </div>

//         {/* Submit Button */}
//         <div>
//           <Button
//             type='submit'
//             disabled={isSubmitting}
//             className='w-full disabled:opacity-50'
//           >
//             {isSubmitting ? 'Submitting...' : 'Submit'}
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }

// function generateSlug(title: string): string {
//   return title
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9]+/g, '-')
//     .replace(/^-+|-+$/g, '');
// }