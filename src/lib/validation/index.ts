import * as z from "zod"

export const SignUpValidation = z.object({
    username: z
      .string()
      .min(2, { message: "Tên người dùng quá ngắn" })
      .max(50, { message: "Tên người dùng quá dài" }),
    email: z.string().email({ message: "Email không hợp lệ" }),
    password: z
      .string()
      .min(8, { message: "Mật khẩu phải có ít nhất 8 kí tự" }),
    repassword: z
      .string()
      .min(8, { message: "Mật khẩu phải có ít nhất 8 kí tự" }),
  }).refine((data) => data.password === data.repassword, {
    message: "Mật khẩu không khớp",
    path: ["repassword"], 
  });

  export const SignInValidation = z.object({
    username: z.string().min(2).max(50),
  })

  
  
  