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
import { SignUpValidation } from '@/lib/validation';
import * as z from "zod"
import { useToast } from '@/hooks/use-toast';
import { useCreateUserAccount } from '@/lib/react-query/queriesAndMutations';
import { useUserContext } from '@/context/AuthContext';
import { PuffLoader } from 'react-spinners';

const SignUpDialog = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { checkAuthUser } = useUserContext();
  const { mutateAsync: createUserAccount, isPending: isCreatingUser } = useCreateUserAccount();

  const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      repassword: "",
    }
  })

  async function onSubmit(values: z.infer<typeof SignUpValidation>) {
    try {
      const newUser = await createUserAccount(values);
      if (!newUser) {
        throw new Error("Failed to create account");
      }

      // Add a delay before checking auth to allow for database updates
      await new Promise(resolve => setTimeout(resolve, 1000));

      const isLoggedIn = await checkAuthUser();
      if (isLoggedIn) {
        form.reset();
        router.push('/home');
      } else {
        throw new Error("Failed to authenticate");
      }
    } catch (error) {
      console.error('Sign up error:', error);
      toast({
        title: "Đăng ký không thành công",
        description: error instanceof Error ? error.message : "Vui lòng thử lại sau.",
        variant: "destructive"
      });
    }
  }

  return (
    <div className="sm:max-w-[425px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="username">Tên người dùng</FormLabel>
                <FormControl>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Nhập tên người dùng"
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
              <FormItem>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
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
              <FormItem>
                <FormLabel htmlFor="password">Mật khẩu</FormLabel>
                <FormControl>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
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
              <FormItem>
                <FormLabel htmlFor="repassword">Nhập lại mật khẩu</FormLabel>
                <FormControl>
                  <Input
                    id="repassword"
                    type="password"
                    placeholder="********"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type='submit'
            className="w-full"
            disabled={isCreatingUser}
          >
            {isCreatingUser ? (
              <PuffLoader size={24} />
            ) : "Đăng ký"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignUpDialog;