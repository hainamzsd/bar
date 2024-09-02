import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';

const SignInDialog = () => {
  const router = useRouter();

  return (
      <div className="sm:max-w-[425px]">
        <div className="">
          {/* Error Message Template */}
          <div id="error-message" className="text-red-500 text-sm">
            {/* Error messages will be displayed here */}
          </div>
          {/* Common Fields */}
          <div className="items-center">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="col-span-3"
            />
          </div>

          <div className="items-center">
            <Label htmlFor="password" className="text-right">
              Mật khẩu
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              className="col-span-3"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-3">
          <Button
            type="submit"
            className="mb-3 w-full"
            onClick={() => router.push('/home')}
          >
            Đăng nhập
          </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center"
            >
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
            </Button>
        </div>
      </div>
  );
};

export default SignInDialog;
