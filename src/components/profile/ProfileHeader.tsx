"use client"

import { useState, ChangeEvent } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '@/components/ui/button';
import { Camera, Check, X, Edit2 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { getCroppedImg } from '@/lib/cropImage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { deleteFile, updateUser, uploadMedia } from '@/lib/appwrite/api';
import { useUserContext } from '@/context/AuthContext';
import { IUser } from '@/types';

interface ProfileHeaderProps {
  user: {
    accountId: string;
    imageUrl: string;
    username: string;
    backgroundUrl: string | undefined;
  }
}

import { PuffLoader } from 'react-spinners';

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(user.backgroundUrl || null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [repositionMode, setRepositionMode] = useState(false);
  const [avatarImage, setAvatarImage] = useState<string>(user.imageUrl);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { updateUserInfo, user: currentUser } = useUserContext();
  console.log(user.accountId)
  const handleBackgroundUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size < 200000) {
        toast({
          title: 'Lỗi',
          variant: 'destructive',
          description: 'Ảnh quá nhỏ, vui lòng tải lên ảnh lớn hơn',
        });
        return;
      }
      try {
        const result = await uploadMedia(file);
        if (result) {
          setOriginalImage(result.imageUrl.toString());
          setImageToCrop(result.imageUrl.toString());
        }
      } catch (error) {
        toast({
          title: 'Lỗi',
          variant: 'destructive',
          description: 'Không thể tải lên ảnh nền',
        });
      }
    }
  };

  const handleCropComplete = async (croppedArea: any, croppedAreaPixels: any) => {
    const croppedImage = await getCroppedImg(originalImage!, croppedAreaPixels);
    setCroppedImage(croppedImage);
  };

  const handleSave = async () => {
    if (croppedImage) {
      setIsUploading(true);
      let result;
      try {
        const file = await fetch(croppedImage).then(r => r.blob()).then(blobFile => new File([blobFile], "background.png", { type: "image/png" }));
        result = await uploadMedia(file);
        if (result) {
          const updatedUser = await updateUser(user.accountId, { backgroundUrl: result.imageUrl.toString() });
          setBackgroundImage(result.imageUrl.toString());
          updateUserInfo(updatedUser as unknown as IUser);
          setImageToCrop(null);
          setRepositionMode(false);
          toast({
            title: 'Thành công',
            description: 'Ảnh nền đã được cập nhật thành công',
          });
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật ảnh nền:", error);
        if (result?.imageId) {
          await deleteFile(result.imageId);
        }
        toast({
          title: 'Lỗi',
          variant: 'destructive',
          description: 'Không thể cập nhật ảnh nền',
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleCancel = () => {
    setImageToCrop(null);
    setRepositionMode(false);
  };

  const handleReposition = () => {
    if (originalImage) {
      setImageToCrop(originalImage);
      setRepositionMode(true);
    }
  };

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    let result;
    if (file) {
      try {
        result = await uploadMedia(file);
        if (result && result.imageUrl) {
          const updatedUser = await updateUser(user.accountId, {
            imageUrl: result.imageUrl.toString(),
            imageId: result.imageId,
          });
          setAvatarImage(result.imageUrl.toString());
          updateUserInfo(updatedUser as unknown as IUser);
          toast({
            title: 'Thành công',
            description: 'Ảnh đại diện đã được cập nhật thành công',
          });
        } else {
          if (result?.imageId) {
            await deleteFile(result.imageId);
          }
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật ảnh đại diện:", error);
        if (result?.imageId) {
          await deleteFile(result.imageId);
        }
        toast({
          title: 'Lỗi',
          description: 'Không thể cập nhật ảnh đại diện',
          variant: 'destructive',
        });
      }
    }
  }

  return (
    <div className="relative h-80">
      <div
        className={`w-full h-full ${backgroundImage || user.backgroundUrl ? 'relative' : 'bg-gradient-to-r from-purple-400 via-pink-500 to-red-500'}`}
      >
        {imageToCrop ? (
          <div className="relative w-full h-full">
            <div className="absolute top-2 left-2 z-20 flex space-x-2">
              {isUploading ? (
                <PuffLoader color="hsl(var(--secondary))" size={20} />
              ) : (
                <>
                  <Button variant="outline" onClick={handleSave}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            <div className="relative w-full h-full z-10">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
                showGrid={false}
                aspect={16 / 9}
              />
            </div>
          </div>
        ) : (
          <>
            {backgroundImage || user.backgroundUrl ? (
              <>
                <img
                  src={backgroundImage || user.backgroundUrl}
                  alt="Ảnh nền hồ sơ"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 z-20">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Camera className="mr-2 h-4 w-4" /> Thay đổi ảnh nền
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => document.getElementById('background-upload')?.click()}>
                        Tải ảnh mới
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleReposition}>
                        Đặt lại vị trí
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button variant="outline" onClick={() => document.getElementById('background-upload')?.click()}>
                  <Camera className="mr-2 h-4 w-4" /> Tải lên ảnh nền
                </Button>
              </div>
            )}
            <input
              id="background-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBackgroundUpload}
            />
          </>
        )}
      </div>
      <div className="absolute bottom-0 left-8 transform translate-y-1/2 z-30">
        <div className="relative group">
          <Avatar className="w-40 h-40 border-4 border-background shadow-lg">
            <AvatarImage 
              src={avatarImage || currentUser.imageUrl} 
              alt={user.username} 
              className='object-cover'
            />
            <AvatarFallback>
              {user.username.split(' ').map((n) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 flex items-center justify-center">
            <label htmlFor="avatar-upload" className="cursor-pointer">
              <div className="absolute bottom-1 right-4 bg-primary text-primary-foreground rounded-full p-2">
                <Edit2 className="h-4 w-4" />
              </div>
            </label>
          </div>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
