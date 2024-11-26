"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { SignInValidation } from '@/lib/validation';
import * as z from "zod"
import { useToast } from '@/hooks/use-toast';
import { useSignInAccount, useSignInFacebook } from '@/lib/react-query/queriesAndMutations';
import { useUserContext } from '@/context/AuthContext';
import { PuffLoader } from 'react-spinners';

const SignInDialog = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccount();
  const { mutateAsync: signInFacebook, isPending: isSigningInFacebook } = useSignInFacebook();

  const form = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      email: "",
      password: "",
    }
  })

  async function onSubmit(values: z.infer<typeof SignInValidation>) {
    try {
      const session = await signInAccount({
        email: values.email,
        password: values.password
      })
      
      if (session) {
        const isLoggedIn = await checkAuthUser();
        if (isLoggedIn) {
          form.reset();
          router.push('/home');
        } else {
          toast({
            title: "Đăng nhập không thành công",
            description: "Vui lòng thử lại sau.",
            variant: "destructive"
          });
        }
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      if (error.message.includes('Invalid id')) {
        toast({
          title: "Đăng nhập không thành công",
          description: "ID không hợp lệ.",
          variant: "destructive"
        });
      } else if (error.message.includes('Invalid credentials')) {
        toast({
          title: "Đăng nhập không thành công",
          description: "Mật khẩu không chính xác. Vui lòng thử lại.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Đăng nhập không thành công",
          description: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
          variant: "destructive"
        });
      }
    }
  }

  const handleFacebookLogin = async () => {
    try {
      await signInFacebook();
      const isLoggedIn = await checkAuthUser();
      if (isLoggedIn) {
        router.push('/home');
      } else {
        toast({
          title: "Đăng nhập với Facebook không thành công",
          description: "Vui lòng thử lại sau.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Facebook sign in error:', error);
      toast({
        title: "Đăng nhập với Facebook không thành công",
        description: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="sm:max-w-[425px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
          <Button
            type='submit'
            className="mb-3 w-full mt-3"
            disabled={isSigningIn}
          >
            {isSigningIn ? (
              <div className='flex gap-2'>
                <PuffLoader size={24}/>
              </div>
            ) : "Đăng nhập"}
          </Button>
        </form>
      </Form>
      {/* <Button
        onClick={handleFacebookLogin}
        variant="outline"
        className="w-full flex items-center justify-center"
        disabled={isSigningInFacebook}
      >
        {isSigningInFacebook ? (
          <PuffLoader size={24} />
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5 mr-2"
            >
              <path
                d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.35C0 23.407.593 24 1.325 24h11.49v-9.294H9.41V11.07h3.405V8.414c0-3.368 2.05-5.201 5.049-5.201 1.437 0 2.671.107 3.031.155v3.515h-2.08c-1.629 0-1.944.774-1.944 1.91v2.502h3.878l-.506 3.635h-3.372V24h6.617c.732 0 1.325-.593 1.325-1.325V1.325C24 .593 23.407 0 22.675 0z"
              />
            </svg>
            Đăng nhập bằng Facebook
          </>
        )}
      </Button> */}
    </div>
  );
};

export default SignInDialog;