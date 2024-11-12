'use client'

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Shield, Mail, Phone, FileText, Lock, AlertTriangle, RefreshCw, Send } from "lucide-react"

export function PrivacyPolicyComponent() {
  return (
    <div className=" rounded-md border p-8 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold mb-2">Chính sách bảo mật</h1>
          <p className="text-muted-foreground">Cập nhật lần cuối: Ngày 07 tháng 11 năm 2024</p>
        </header>

        <section>
          <p className="mb-4">
            Chính sách bảo mật này mô tả các chính sách và thủ tục của chúng tôi về việc thu thập, sử dụng và tiết lộ thông tin của bạn khi bạn sử dụng Dịch vụ và cho bạn biết về quyền riêng tư của bạn và cách luật pháp bảo vệ bạn.
          </p>
          <p className="mb-4">
            Chúng tôi sử dụng dữ liệu cá nhân của bạn để cung cấp và cải thiện Dịch vụ. Bằng cách sử dụng Dịch vụ, bạn đồng ý với việc thu thập và sử dụng thông tin theo Chính sách bảo mật này.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center"><FileText className="mr-2" /> Giải thích và Định nghĩa</h2>
          <div className="pl-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Giải thích</h3>
              <p>
                Các từ có chữ cái đầu tiên viết hoa có ý nghĩa được định nghĩa trong các điều kiện sau đây. Các định nghĩa sau đây sẽ có cùng ý nghĩa bất kể chúng xuất hiện ở số ít hay số nhiều.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Định nghĩa</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Tài khoản</strong>: Tài khoản duy nhất được tạo cho Bạn để truy cập Dịch vụ của chúng tôi.</li>
                <li><strong>Công ty</strong>: Bar Of Otaku (được gọi là &quot;Công ty&quot;, &quot;Chúng tôi&quot;, &quot;Chúng ta&quot; hoặc &quot;Của chúng tôi&quot; trong Thỏa thuận này).</li>
                <li><strong>Cookie</strong>: Tệp nhỏ được đặt trên thiết bị của Bạn bởi một trang web.</li>
                <li><strong>Quốc gia</strong>: Việt Nam</li>
                <li><strong>Thiết bị</strong>: Bất kỳ thiết bị nào có thể truy cập Dịch vụ.</li>
                <li><strong>Dữ liệu cá nhân</strong>: Bất kỳ thông tin nào liên quan đến một cá nhân được xác định.</li>
                <li><strong>Dịch vụ</strong>: Trang web.</li>
                <li><strong>Dữ liệu sử dụng</strong>: Dữ liệu được thu thập tự động từ việc sử dụng Dịch vụ.</li>
                <li><strong>Trang web</strong>: Bar Of Otaku, truy cập từ <a href="https://bar-git-main-hainamzsds-projects.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://bar-git-main-hainamzsds-projects.vercel.app/</a></li>
              </ul>
            </div>
          </div>
        </section>

        <Separator />

        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center"><Lock className="mr-2" /> Thu thập và Sử dụng Dữ liệu Cá nhân của Bạn</h2>
          <div className="pl-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Các loại Dữ liệu được Thu thập</h3>
              <h4 className="text-md font-semibold mb-2">Dữ liệu Cá nhân</h4>
              <p className="mb-2">
                Khi sử dụng Dịch vụ của Chúng tôi, Chúng tôi có thể yêu cầu Bạn cung cấp một số thông tin nhận dạng cá nhân, bao gồm nhưng không giới hạn ở:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Địa chỉ email</li>
                <li>Họ và tên</li>
                <li>Số điện thoại</li>
                <li>Dữ liệu sử dụng</li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-2">Dữ liệu Sử dụng</h4>
              <p>
                Dữ liệu Sử dụng được thu thập tự động khi sử dụng Dịch vụ. Nó có thể bao gồm thông tin như địa chỉ IP của Thiết bị, loại trình duyệt, phiên bản, trang truy cập, thời gian và ngày truy cập, thời gian dành cho mỗi trang, và dữ liệu chẩn đoán khác.
              </p>
            </div>
          </div>
        </section>

        <Separator />

        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center"><Send className="mr-2" /> Sử dụng Dữ liệu Cá nhân của Bạn</h2>
          <p className="mb-2">Công ty có thể sử dụng Dữ liệu Cá nhân cho các mục đích sau:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Cung cấp và duy trì Dịch vụ</strong>: Bao gồm việc giám sát việc sử dụng Dịch vụ của chúng tôi.</li>
            <li><strong>Quản lý Tài khoản</strong>: Quản lý việc đăng ký của Bạn như một người dùng của Dịch vụ.</li>
            <li><strong>Liên hệ</strong>: Liên hệ với Bạn qua email, cuộc gọi điện thoại, SMS, hoặc các hình thức liên lạc điện tử tương đương khác.</li>
            <li><strong>Cung cấp thông tin</strong>: Tin tức, ưu đãi đặc biệt và thông tin chung về các hàng hóa, dịch vụ và sự kiện khác.</li>
            <li><strong>Quản lý yêu cầu</strong>: Tham dự và quản lý các yêu cầu của Bạn đối với Chúng tôi.</li>
          </ul>
        </section>

        <Separator />

        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center"><RefreshCw className="mr-2" /> Lưu giữ và Chuyển giao Dữ liệu</h2>
          <p className="mb-4">
            Công ty sẽ chỉ lưu giữ Dữ liệu Cá nhân của Bạn trong thời gian cần thiết. Chúng tôi có thể chuyển dữ liệu của Bạn đến các máy tính đặt bên ngoài khu vực tài phán của Bạn để xử lý và lưu trữ.
          </p>
          <p>
            Sự đồng ý của Bạn đối với Chính sách Bảo mật này sau đó là việc Bạn gửi thông tin như vậy đại diện cho sự đồng ý của Bạn đối với việc chuyển giao đó.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center"><AlertTriangle className="mr-2" /> Xóa Dữ liệu và Bảo mật</h2>
          <p className="mb-4">
            Bạn có quyền yêu cầu xóa Dữ liệu Cá nhân của mình. Chúng tôi thực hiện các biện pháp bảo mật hợp lý để bảo vệ dữ liệu của Bạn, nhưng không có phương thức truyền tải hoặc lưu trữ điện tử nào là 100% an toàn.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-2xl font-semibold mb-4">Liên hệ với Chúng tôi</h2>
          <p className="mb-2">
            Nếu bạn có bất kỳ câu hỏi nào về Chính sách Bảo mật này, Bạn có thể liên hệ với chúng tôi:
          </p>
          <ul className="list-none pl-5 space-y-2">
            <li className="flex items-center"><Mail className="mr-2" /> Email: machaidangms@gmail.com</li>
          </ul>
        </section>
      </div>
    </div>
  )
}