'use client';

import { z } from 'zod';
import { toast } from 'sonner';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserRoleFormSchema } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { setRole } from '@/lib/users';

type Inputs = z.infer<typeof UserRoleFormSchema>;

interface UserRoleFormProps {
  userId: string;
  defaultRole: 'admin' | 'moderator';
}

export default function UserRoleForm({ userId, defaultRole }: UserRoleFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(UserRoleFormSchema),
    defaultValues: {
      id: userId,
      role: defaultRole,
    },
  });

  const processForm: SubmitHandler<Inputs> = async (data) => {
    const formData = new FormData();
    formData.append('id', data.id);
    formData.append('role', data.role);
    const result = await setRole(formData);
    if (result.message === 'Not Authorized') {
      toast.error('You are not authorized to perform this action.');
      return;
    }
    toast.success('Role updated successfully!');
    reset();
  };

  return (
    <form onSubmit={handleSubmit(processForm)} noValidate className="space-y-4">
      <input type="hidden" {...register('id')} />
      <input type="hidden" {...register('role')} />
      <Button
        type='submit'
        disabled={isSubmitting}
        className='w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800'
      >
        {isSubmitting ? 'Submitting...' : `Make ${defaultRole.charAt(0).toUpperCase() + defaultRole.slice(1)}`}
      </Button>
      {errors.role && (
        <p className='ml-1 mt-2 text-sm text-rose-400 dark:text-rose-500'>
          {errors.role.message}
        </p>
      )}
    </form>
  );
}