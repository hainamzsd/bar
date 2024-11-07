import {
  Home, Expand, UsersRound, Bookmark, icons, LayoutList, ImagePlus, Newspaper,
  Coffee, Scale, CircleHelp, Rabbit, Images
} from 'lucide-react'

export const mainNavigate = [
  {
    route: "/home",
    label: "Vào quán",
    icon: Coffee
  },
  {
    route: "/dashboard/explore",
    label: "Bảng tin quán bar",
    icon: LayoutList
  },
  {
    route: "/dashboard/anime-list",
    label: "Bảng tin anime",
    icon: Newspaper
  },
  {
    route: "/dashboard/people",
    label: "Mọi người",
    icon: UsersRound
  },
];


export const actions = [
  {
    route: "/dashboard/create-post",
    label: "Tạo bài viết",
    icon: ImagePlus
  },
  {
    route: "/dashboard/saved",
    label: "Bài viết đã lưu",
    icon: Images
  },
];

export const references = [
  {
    route: "/dashboard/aboutus",
    label: "Giới thiệu",
    icon: Rabbit
  },
  {
    route: "/dashboard/rules",
    label: "Hỗ trợ và luật lệ",
    icon: CircleHelp
  },
  {
    route: "/",
    label: "Các chính sách",
    icon: Scale
  },
];

