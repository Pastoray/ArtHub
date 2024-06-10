'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  AssignRoleSchema,
  TAssignRoleSchema,
} from '@/lib/validators/product-creations-validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { trpc } from '@/trpc/client'
import { toast } from 'sonner'
import { RedirectToSignIn, useUser } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import { redirect } from 'next/navigation'

const Page = () => {
  const { user, isLoaded } = useUser()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TAssignRoleSchema>({
    resolver: zodResolver(AssignRoleSchema),
  })
  if (!isLoaded) {
    return
  }
  if (!user) {
    return <RedirectToSignIn />
  }
  const { data: userData, isLoading } = trpc.user.getUser.useQuery({
    user_clerk_id: user.id,
  })

  if (userData?.user?.role === 'MEMBER') {
    toast.error('Not Authorized')
    return redirect('/')
  }
  if (isLoading) {
    return (
      <div className='w-full h-32 flex justify-center items-center'>
        <Loader2 className='animate-spin' />
      </div>
    )
  }

  const { mutate: updateRole, isLoading: isLoading1 } =
    trpc.user.updateUserRole.useMutation({
      onSuccess: () => {
        toast.success('Role changed successfully')
      },
      onError: () => {
        toast.error('Something went wrong..')
      },
    })
  const { mutate: removeUser, isLoading: isLoading2 } =
    trpc.user.removeUser.useMutation({
      onSuccess: () => {
        toast.success('User removed successfully')
      },
      onError: () => {
        toast.error('Something went wrong..')
      },
    })

  const onSubmit = ({ email, role }: TAssignRoleSchema, event: any) => {
    const buttonName = event.nativeEvent.submitter.name
    if (buttonName === 'remove') {
      removeUser({ email, role })
    } else {
      updateRole({ email, role })
    }
  }
  return (
    <div>
      <Card className='mx-auto max-w-md w-full mt-16'>
        <CardHeader>
          <CardTitle className='text-xl'>Assign Role</CardTitle>
          <CardDescription>
            Enter your some information to assign a role to a specified user
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className='grid gap-4' onSubmit={handleSubmit(onSubmit)}>
            <div className='grid grid-cols-1'>
              <div className='grid gap-2'>
                <Label htmlFor='product-title'>
                  Email<span className='text-red-600'>*</span>
                </Label>
                <Input
                  {...register('email')}
                  id='email'
                  placeholder='example@gmail.com'
                  className='w-full'
                  spellCheck='false'
                  required
                />
                {errors?.email && (
                  <p className='text-sm text-red-500'>{errors.email.message}</p>
                )}
              </div>
            </div>
            <div className='grid grid-cols-1'>
              <div className='grid gap-2'>
                <Controller
                  name='role'
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Select a role' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem
                            value='User'
                            className=' font-semibold text-stone-700'
                          >
                            User
                          </SelectItem>
                          <SelectItem
                            value='Admin'
                            className=' font-semibold text-red-700'
                          >
                            Admin
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors?.role && (
                  <p className='text-sm text-red-500'>{errors.role.message}</p>
                )}
              </div>
            </div>
            <div className='grid grid-cols-2 gap-2'>
              <Button
                disabled={isLoading1 || isLoading2}
                name='remove'
                type='submit'
                className='w-full'
                variant='destructive'
              >
                Remove User
              </Button>
              <Button
                disabled={isLoading1 || isLoading2}
                name='assign'
                type='submit'
                className='w-full'
                variant='outline'
              >
                Assign Role
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Page
