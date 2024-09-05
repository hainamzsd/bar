import {Home, Expand, UsersRound, Bookmark, icons, LayoutList, ImagePlus} from 'lucide-react'

export const sidebarLinks = [
    {
      route: "/",
      label: "Home",
      icon: Home
    },
    {
      route: "/dashboard/explore",
      label: "Explore",
      icon: LayoutList
    },
    {
      route: "/all-users",
      label: "People",
      icon: UsersRound
    },
    {
      route: "/saved",
      label: "Saved",
      icon: Bookmark
    },
    {
      route: "/dashboard/post",
      label: "Create Post",
      icon: ImagePlus
    },
  ];
  
  export const bottombarLinks = [
    {
      imgURL: "/assets/icons/home.svg",
      route: "/",
      label: "Home",
    },
    {
      imgURL: "/assets/icons/wallpaper.svg",
      route: "/explore",
      label: "Explore",
    },
    {
      imgURL: "/assets/icons/bookmark.svg",
      route: "/saved",
      label: "Saved",
    },
    {
      imgURL: "/assets/icons/gallery-add.svg",
      route: "/create-post",
      label: "Create",
    },
  ];