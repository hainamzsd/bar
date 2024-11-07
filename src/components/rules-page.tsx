'use client'

import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { RandomizedTextEffect } from '@/lib/text-randomizer'
import { Card } from "@/components/ui/card"

export function RulesPageComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background Image with Cat SVG Mask */}
      <figure className='absolute inset-0 z-0'>
        <img
          src='https://images.unsplash.com/photo-1535968881874-0c39f1503640?w=1500&auto=format&fit=crop'
          alt=''
          className='w-full h-full object-cover'
          style={{
            maskImage: "url('https://www.ui-layout.com/cat.svg')",
            maskSize: 'contain',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
          }}
        />
      </figure>

      <Card className="relative z-10 bg-background/50 p-8 rounded-lg shadow-lg max-w-4xl w-full">
        <div className='py-10 rounded-md'>
          <h1 className='font-departure text-4xl relative z-10 text-center h-[120px] md:h-auto leading-tight'>
            <RandomizedTextEffect text='Nội Quy Quán Bar Otaku' />
          </h1>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {[
            { title: "1. Quy Tắc Ứng Xử Chung", content: [
              "Tôn trọng mọi thành viên, không phân biệt đối xử.",
              "Không sử dụng ngôn ngữ xúc phạm, quấy rối hoặc đe dọa.",
              "Giữ gìn không khí thân thiện và hòa đồng trong cộng đồng.",
              "Tránh tranh cãi và xung đột cá nhân trên diễn đàn."
            ]},
            { title: "2. Nội Dung Đăng Tải", content: [
              "Nghiêm cấm đăng tải nội dung NSFW (không phù hợp với nơi làm việc).",
              "Không chia sẻ nội dung bạo lực cực đoan hoặc gây sốc.",
              "Tránh spam và quảng cáo không được phép.",
              "Đảm bảo nội dung đăng tải liên quan đến anime, manga và văn hóa otaku."
            ]},
            { title: "3. Bảo Vệ Thông Tin Cá Nhân", content: [
              "Không chia sẻ thông tin cá nhân của bản thân hoặc người khác.",
              "Tránh tiết lộ địa chỉ, số điện thoại hoặc thông tin nhận dạng khác.",
              "Sử dụng biệt danh thay vì tên thật trong các cuộc thảo luận.",
              "Báo cáo ngay cho quản trị viên nếu phát hiện vi phạm bảo mật thông tin."
            ]},
            { title: "4. Quy Định về Spoiler", content: [
              "Sử dụng thẻ spoiler khi thảo luận về nội dung mới của anime hoặc manga.",
              "Không tiết lộ các tình tiết quan trọng của cốt truyện trong tiêu đề bài viết.",
              "Tôn trọng trải nghiệm xem/đọc của những người khác.",
              "Đánh dấu rõ ràng khi bài viết chứa spoiler từ nguồn gốc (light novel, manga) chưa được chuyển thể."
            ]},
            { title: "5. Bản Quyền và Sử Dụng Hợp Lý", content: [
              "Tôn trọng quyền sở hữu trí tuệ và bản quyền của tác giả.",
              "Không chia sẻ liên kết đến các trang stream hoặc download bất hợp pháp.",
              "Chỉ sử dụng hình ảnh hoặc đoạn trích ngắn cho mục đích thảo luận, phê bình.",
              "Ghi rõ nguồn khi sử dụng nội dung từ bên ngoài."
            ]},
            { title: "6. Hoạt Động Cộng Đồng", content: [
              "Tham gia tích cực vào các sự kiện và thảo luận của cộng đồng.",
              "Tuân thủ quy định cụ thể cho từng sự kiện (ví dụ: cuộc thi, xem phim cùng nhau).",
              "Khuyến khích và hỗ trợ các thành viên mới.",
              "Đóng góp ý kiến xây dựng để cải thiện cộng đồng."
            ]},
            { title: "7. Ngôn Ngữ và Văn Hóa", content: [
              "Sử dụng tiếng Việt trong giao tiếp chính thức trên diễn đàn.",
              "Hạn chế sử dụng tiếng lóng hoặc từ ngữ khó hiểu.",
              "Tôn trọng sự đa dạng văn hóa và quan điểm của các thành viên.",
              "Giải thích các thuật ngữ anime/manga khi cần thiết để mọi người đều có thể hiểu."
            ]},
            { title: "8. Tranh Luận và Phê Bình", content: [
              "Giữ thái độ lịch sự và tôn trọng khi tranh luận.",
              "Tập trung vào ý tưởng, không tấn công cá nhân.",
              "Chấp nhận ý kiến khác biệt và học hỏi từ người khác.",
              "Sử dụng lập luận và bằng chứng để hỗ trợ quan điểm của mình."
            ]},
            { title: "9. Báo Cáo và Xử Lý Vi Phạm", content: [
              "Báo cáo ngay lập tức các hành vi vi phạm nội quy cho quản trị viên.",
              "Không tự ý xử lý hoặc trả đũa các hành vi vi phạm.",
              "Cung cấp bằng chứng cụ thể khi báo cáo vi phạm.",
              "Tôn trọng quyết định của đội ngũ quản trị."
            ]},
            { title: "10. Cập Nhật và Tuân Thủ Nội Quy", content: [
              "Thường xuyên cập nhật và đọc kỹ nội quy của diễn đàn.",
              "Tuân thủ mọi thay đổi và bổ sung trong nội quy.",
              "Hỏi quản trị viên nếu có bất kỳ thắc mắc nào về nội quy.",
              "Góp ý để cải thiện và hoàn thiện nội quy."
            ]}
          ].map((item, index) => (
            <AccordionItem value={`item-${index + 1}`} key={index} className="border-b border-border/50">
              <AccordionTrigger className="text-lg font-semibold hover:text-primary transition-colors">
                {item.title}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-2">
                  {item.content.map((rule, ruleIndex) => (
                    <li key={ruleIndex} className="">{rule}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </div>
  )
}