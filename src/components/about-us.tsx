'use client'

import React from 'react'

export function AboutUsComponent() {
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

      {/* Content */}
      <div className="relative z-10 bg-background/50 p-8 rounded-lg shadow-lg max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Về Quán Bar Otaku</h1>
        <div className="space-y-4">
          <p>
            Quán Bar Otaku là một cộng đồng trực tuyến độc đáo, được thành lập vào năm 2016 với nguồn gốc từ một nhóm Facebook. Chúng tôi là nơi tụ họp của những người yêu thích văn hóa Nhật Bản, anime, manga và các sở thích liên quan.
          </p>
          <p>
            Là một trang web phi lợi nhuận, mục tiêu của chúng tôi là tạo ra một không gian an toàn và thú vị cho cộng đồng otaku Việt Nam. Chúng tôi cung cấp một nền tảng để chia sẻ đam mê, trao đổi ý kiến, và kết nối với những người có cùng sở thích.
          </p>
          <p>
            Tại Quán Bar Otaku, chúng tôi tổ chức các cuộc thảo luận sôi nổi, chia sẻ tin tức mới nhất về anime và manga, tổ chức các sự kiện trực tuyến, và cung cấp một nơi để các thành viên có thể thể hiện sự sáng tạo của mình thông qua fanart, cosplay, và nhiều hơn nữa.
          </p>
        </div>
      </div>
    </div>
  )
}