import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { SignUpValidation } from '../lib/validation';
import * as z from "zod"
import Loader from './shared/Loader';
import { useState } from 'react';
import { createUserAccount } from '@/lib/appwrite/api';
import { useToast } from '@/hooks/use-toast'; 
import { title } from 'process';
import { Toast } from './ui/toast';
import { useCreateUserAccount, useSignInAccount } from '@/lib/react-query/queriesAndMutations';
import { useUserContext } from '@/context/AuthContext';
const SignUpDialog = () => {
  const router = useRouter();
  const toast = useToast();
  const {checkAuthUser, isLoading: isUserLoading} = useUserContext();
  const { mutateAsync: createUserAccount, isPending: isCreatingUser } = useCreateUserAccount();
  const { mutateAsync: signInAccount, isPending: isSigningIn} = useSignInAccount();

  const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      repassword: ""
    }
  })

  async function onSubmit(values: z.infer<typeof SignUpValidation>) {
    try {
      const newUser = await createUserAccount(values);
      if(!newUser){
        return toast.toast({title:"Tạo tài khoản không thành công",variant:"destructive"})
      }

      const session = await signInAccount({
        email: values.email,
        password: values.password
      })
      if(!session){
        return toast.toast({title:"Đăng nhập không thành công, thử lại sau.",variant:"destructive"})
      }

      const isLoggedIn = await checkAuthUser();
      if(isLoggedIn){
        form.reset();
        router.push('/home')
      }else{
        return toast.toast({title:"Đăng nhập không thành công, thử lại sau.",variant:"destructive"})
      }
    }
    catch (exception) {
      return toast.toast({title:"Tạo tài khoản không thành công",variant:"destructive"})
    }
  }

  return (
    <div className="sm:max-w-[425px]">
      {/* Error Message Template */}
      <div id="error-message" className="text-red-500 text-sm">
        {/* Error messages will be displayed here */}
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className='items-center'>
                <FormLabel htmlFor="username" className="text-right">
                  Tên người dùng
                </FormLabel>
                <FormControl>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Nhập tên người dùng"
                    className="col-span-3"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="items-center">
                <FormLabel htmlFor="email" className="text-right">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="col-span-3"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="items-center">
                <FormLabel htmlFor="password" className="text-right">
                  Mật khẩu
                </FormLabel>
                <FormControl>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    className="col-span-3"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="repassword"
            render={({ field }) => (
              <FormItem className="items-center">
                <FormLabel htmlFor="password" className="text-right">
                  Nhập lại mật khẩu
                </FormLabel>
                <FormControl>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    className="col-span-3"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type='submit'
            className="mb-3 w-full mt-3"
          >
            {isCreatingUser ? (
              <div className='flex gap-2 '>
                Đang tải
              </div>
            ) : "Đăng ký"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignUpDialog;
