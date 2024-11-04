"use client"

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useUpdateUser } from '@/lib/react-query/queriesAndMutations'
import { useToast } from '@/hooks/use-toast'
import { useUserContext } from '@/context/AuthContext'
import { PuffLoader } from 'react-spinners'
import DatePicker from '@/components/shared/DatePicker'
import { IUser } from '@/types'

// Define the schema for form validation
const formSchema = z.object({
  username: z.string().min(3, 'Tên người dùng phải có ít nhất 3 ký tự').max(50, 'Tên người dùng phải ít hơn 50 ký tự'),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  dob: z.date().optional(),
  email: z.string().email('Địa chỉ email không hợp lệ'),
  facebookLink: z.string().url('URL Facebook không hợp lệ').optional().or(z.literal('')),
  twitterLink: z.string().url('URL Twitter không hợp lệ').optional().or(z.literal('')),
  bio: z.string().max(500, 'Tiểu sử phải ít hơn 500 ký tự').optional(),
})

type FormData = z.infer<typeof formSchema>

interface ProfileEditFormProps {
  user: IUser
  onClose?: () => void
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ user, onClose }) => {
  const { mutate: updateUser, isPending } = useUpdateUser()
  const { toast } = useToast()
  const { setUser,updateUserInfo } = useUserContext()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: user as any,
  })

  const onSubmit = async (data: FormData) => {
    if (!user) return

    try {
      const updatedUser = await updateUserInfo(data as any)
      if (updatedUser) {
        toast({
          title: 'Thành công',
          description: 'Cập nhật hồ sơ thành công',
        })
        onClose?.()
      } else {
        throw new Error('Không thể cập nhật hồ sơ')
      }
    } catch (error) {
      console.error(error)
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật hồ sơ',
        variant: 'destructive',
      })
    }
  }
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit Profile</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">
            Username
          </Label>
          <div className="col-span-3">
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <Input id="username" {...field} aria-invalid={errors.username ? "true" : "false"} />
              )}
            />
            {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="gender" className="text-right">
            Gender
          </Label>
          <div className="col-span-3">
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="gender" aria-invalid={errors.gender ? "true" : "false"}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.gender && <p className="text-sm text-red-500">{errors.gender.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="dob" className="text-right">
            Date of Birth
          </Label>
          <div className="col-span-3">
            <Controller
              name="dob"
              control={control}
              render={({ field }) => (
                <DatePicker
                  date={field.value}
                  onDateChange={field.onChange}
                  aria-invalid={errors.dob ? "true" : "false"}
                />
              )}
            />
            {errors.dob && <p className="text-sm text-red-500">{errors.dob.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            Email
          </Label>
          <div className="col-span-3">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input id="email" type="email" {...field} aria-invalid={errors.email ? "true" : "false"} />
              )}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="facebookLink" className="text-right">
            Facebook
          </Label>
          <div className="col-span-3">
            <Controller
              name="facebookLink"
              control={control}
              render={({ field }) => (
                <Input id="facebookLink" {...field} aria-invalid={errors.facebookLink ? "true" : "false"} />
              )}
            />
            {errors.facebookLink && <p className="text-sm text-red-500">{errors.facebookLink.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="twitterLink" className="text-right">
            Twitter
          </Label>
          <div className="col-span-3">
            <Controller
              name="twitterLink"
              control={control}
              render={({ field }) => (
                <Input id="twitterLink" {...field} aria-invalid={errors.twitterLink ? "true" : "false"} />
              )}
            />
            {errors.twitterLink && <p className="text-sm text-red-500">{errors.twitterLink.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="bio" className="text-right">
            Bio
          </Label>
          <div className="col-span-3">
            <Controller
              name="bio"
              control={control}
              render={({ field }) => (
                <Textarea id="bio" {...field} aria-invalid={errors.bio ? "true" : "false"} />
              )}
            />
            {errors.bio && <p className="text-sm text-red-500">{errors.bio.message}</p>}
          </div>
        </div>

        <div className="flex justify-end">
          {isPending ? (
            <PuffLoader size={24} color="hsl(var(--secondary))" />
          ) : (
            <Button type="submit" disabled={isPending}>
              Save Changes
            </Button>
          )}
        </div>
      </form>
    </DialogContent>
  )
}

export default ProfileEditForm