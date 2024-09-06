import {
  Home, Expand, UsersRound, Bookmark, icons, LayoutList, ImagePlus,
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
    label: "Bảng tin",
    icon: LayoutList
  },
  {
    route: "/all-users",
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
    route: "/",
    label: "Bài viết của tôi",
    icon: Images
  },
];

export const references = [
  {
    route: "/",
    label: "Giới thiệu",
    icon: Rabbit
  },
  {
    route: "/",
    label: "Hỗ trợ",
    icon: CircleHelp
  },
  {
    route: "/",
    label: "Các chính sách",
    icon: Scale
  },
];

