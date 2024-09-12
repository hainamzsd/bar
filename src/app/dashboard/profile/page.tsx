"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Trophy, Edit, Mail, MapPin, Calendar, Github, Linkedin, Twitter, User, Users, Facebook, Lock, Edit3 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { PostCard } from '@/components/post-card'
import UserInfoCard from '@/components/profile/InfoCard'
import { IUser } from '@/types'
import { useUserContext } from '@/context/AuthContext'
import { genderToString } from '@/lib/utils'
import { DatePicker } from '@/components/DatePicker'
import { Textarea } from '@/components/ui/textarea'
import ProfileHeader from '@/components/profile/ProfileHeader'
import ProfileEditForm from '@/components/profile/ProfileEditForm'
import FollowersModal from '@/components/profile/FollowerModal'
import FollowingModal from '@/components/profile/FollowingModal'
import ChangePasswordForm from '@/components/profile/ChangePasswordForm'
import AchievementsCard from '@/components/profile/AchievementsCard'

export default function ProfileLayout() {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showFollowersModal, setShowFollowersModal] = useState(false)
  const [showFollowingModal, setShowFollowingModal] = useState(false)
  const { user } = useUserContext();

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState(user.bio || '');

  const handleSaveBio = () => {
    // Implement saving logic here
    setIsEditingBio(false);
  };
  return (
    <div className="py-8 ">
      <Card className="w-full max-w-7xl mx-auto overflow-hidden">
        <ProfileHeader user={{
          imageUrl: user.imageUrl,
          username: user.username,
          imgBackground: undefined
        }}

        ></ProfileHeader>
        <CardContent className="pt-24">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold">{user.username}</h1>
              {/* <p className="text-xl text-muted-foreground">{userInfo.username}</p> */}
              <Badge className="mt-2" >Khách hàng</Badge>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" /> Sửa thông tin
                </Button>
              </DialogTrigger>
              <ProfileEditForm user={user}
              ></ProfileEditForm>
            </Dialog>
          </div>
          {!user.bio ? (
            <div className="flex items-center space-x-2">
              <Edit3 className="h-5 w-5 text-muted-foreground" />
              <span className="cursor-pointer" onClick={() => setIsEditingBio(true)}>Tiểu sử</span>
            </div>
          ) : (
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">Tiểu sử:</span>
                <p>{user.bio}</p>
                <Edit3 className="h-5 w-5 text-muted-foreground cursor-pointer" onClick={() => setIsEditingBio(true)} />
              </div>
            </div>
          )}
          {isEditingBio && (
            <div className="mt-4">
              <Textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                value={user.bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Thêm tiểu sử..."
              />
              <Button
                variant={'ghost'}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                onClick={handleSaveBio}
              >
                Lưu
              </Button>
            </div>
          )}
          {/* <p className="text-muted-foreground mb-4">{user.bio}</p> */}
          <div className="flex flex-col md:flex-row md:space-x-4 mb-6 mt-2 space-y-4 md:space-y-0">
            <FollowersModal
              showFollowersModal={showFollowersModal}
              setShowFollowersModal={setShowFollowersModal}
              followers={user.followers}
            />
            <FollowingModal
              showFollowingModal={showFollowingModal}
              setShowFollowingModal={setShowFollowingModal}
              following={user.following}
       // Ensure it takes available space
            />
          </div>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="personal"
                className="flex items-center justify-center space-x-2 md:space-x-0 md:justify-center"
              >
                <div className="hidden md:block">Thông tin cá nhân</div>
                <div className="block md:hidden">
                  <User className="h-5 w-5" />
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="password"
                className="flex items-center justify-center space-x-2 md:space-x-0 md:justify-center"
              >
                <div className="hidden md:block">Đổi mật khẩu</div>
                <div className="block md:hidden">
                  <Lock className="h-5 w-5" />
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="achievements"
                className="flex items-center justify-center space-x-2 md:space-x-0 md:justify-center"
              >
                <div className="hidden md:block">Thành tựu</div>
                <div className="block md:hidden">
                  <Trophy className="h-5 w-5" />
                </div>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="personal">
              <UserInfoCard userInfo={user} />
            </TabsContent>
            <TabsContent value="password">
              <ChangePasswordForm></ChangePasswordForm>
            </TabsContent>
            <TabsContent value="achievements">
              <AchievementsCard></AchievementsCard>
            </TabsContent>
          </Tabs>
          <Separator className="my-8" />
          <div>
            <h2 className="text-2xl font-bold mb-4">Posts</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((post) => (
                <PostCard key={post} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}