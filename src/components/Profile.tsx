"use client"
import React, { useState } from 'react'
import { SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from './ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

export default function Profile() {
    const [image, setImage] = useState<string | null>(null);
  const [role, setRole] = useState<string>('Customer');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Edit Profile</SheetTitle>
        <SheetDescription>
          Make changes to your profile here. Click save when you're done.
        </SheetDescription>
      </SheetHeader>
      <div className="grid gap-4 py-4">
        <div className="flex flex-col items-center gap-4">
          <div className="relative group">
            <input
              type="file"
              id="avatar-upload"
              className="hidden"
              onChange={handleImageChange}
            />
            <label htmlFor="avatar-upload" className="cursor-pointer">
              <Avatar className="w-24 h-24 border-4 border-gray-300
               group-hover:border-blue-500 transition-all ">
                {image ? (
                  <AvatarImage src={image} alt="Profile Image" className='object-cover' />
                ) : (
                  <AvatarFallback>CN</AvatarFallback>
                )}
              </Avatar>
            </label>
          </div>
          <Badge >{role}</Badge>

        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input id="name" defaultValue="Pedro Duarte" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">
            Username
          </Label>
          <Input id="username" defaultValue="@peduarte" className="col-span-3" />
        </div>
      </div>
      <SheetFooter>
        <SheetClose asChild>
          <Button type="submit">Save changes</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  )
}

