'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from '@/components/ui/select'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useUpdateUser } from '@/lib/react-query/queriesAndMutations'
import { useToast } from '@/hooks/use-toast'
import { useUserContext } from '@/context/AuthContext'
import { PuffLoader } from 'react-spinners'
import { IUser } from '@/types'
import { cn } from "@/lib/utils"
import { useRouter } from 'next/navigation'
import { DatePicker } from '../ui/smart-date-time'

const formSchema = z.object({
  username: z.string().min(3, 'Tên người dùng phải có ít nhất 3 ký tự').max(50, 'Tên người dùng phải ít hơn 50 ký tự'),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  dob: z.date().optional(),
  email: z.string().optional(),
  facebookLink: z.string().url('URL Facebook không hợp lệ').optional(),
  twitterLink: z.string().url('URL Twitter không hợp lệ').optional(),
})

type FormData = z.infer<typeof formSchema>

interface ProfileEditFormProps {
  onClose?: () => void
}

export default function ProfileEditForm({ onClose }: ProfileEditFormProps) {
  const { mutate: updateUser, isPending } = useUpdateUser()
  const { toast } = useToast()
  const { setUser, updateUserInfo, user } = useUserContext()
  const router = useRouter()

  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...user,
      gender: user.gender === true ? 'Male' : user.gender === false ? 'Female' : 'Other' // Map boolean to string
    } as any,
  });
  
  const onSubmit = async (data: FormData) => {
    if (!user) return

    try {
      const updatedUser = await updateUserInfo(data as any)
      if (updatedUser) {
        toast({
          title: 'Thành công',
          description: 'Cập nhật hồ sơ thành công',
        })
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
        <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên người dùng</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giới tính</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Male">Nam</SelectItem>
                    <SelectItem value="Female">Nữ</SelectItem>
                    <SelectItem value="Other">Khác</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Ngày sinh</FormLabel>
                <DatePicker
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Nhập ngày"
                  // aria-invalid={errors.dob ? "true" : "false"}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="facebookLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facebook</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="twitterLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Twitter</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            {isPending ? (
              <PuffLoader size={24} color="hsl(var(--secondary))" />
            ) : (
              <Button type="submit" disabled={isPending}>
                Lưu thay đổi
              </Button>
            )}
          </div>
        </form>
      </Form>
    </DialogContent>
  )
}