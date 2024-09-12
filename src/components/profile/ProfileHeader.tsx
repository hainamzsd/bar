import { useState, ChangeEvent } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { getCroppedImg } from '@/lib/cropImage';

const ProfileHeader: React.FC<{ user: { imageUrl: string; username: string; imgBackground:string|undefined } }> = ({ user }) => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const { toast } = useToast();

  const handleBackgroundUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (file.size < 200000) { // Check if file size is less than 200KB
          toast({
            title: 'Lỗi',
            variant: 'destructive',
            description: 'Ảnh quá nhỏ, vui lòng chọn ảnh lớn hơn',
          });
          return;
        }
        setImageToCrop(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (croppedArea: any, croppedAreaPixels: any) => {
    const croppedImage = await getCroppedImg(imageToCrop!, croppedAreaPixels);
    setCroppedImage(croppedImage);
  };

  const handleSave = () => {
    if (croppedImage) {
      setBackgroundImage(croppedImage);
      setImageToCrop(null);
    }
  };

  const handleCancel = () => {
    setImageToCrop(null);
  };

  return (
    <div className="relative h-80">
      <div
        className={`w-full h-full ${backgroundImage ? 'relative' : 'bg-gradient-to-r from-purple-400 via-pink-500 to-red-500'}`}
      >
        {imageToCrop ? (
          <div className="relative w-full h-full">
            <div className="absolute top-2 left-2 z-20 flex space-x-2">
              <Button variant="outline" onClick={handleSave}>
                Lưu
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Huỷ
              </Button>
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
                aspect={16/9}
              />
            </div>
          </div>
        ) : (
          <>
            {backgroundImage ? (
              <>
                <img
                  src={backgroundImage}
                  alt="Profile Background"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 z-20">
                  <Button variant="outline" onClick={() => document.getElementById('background-upload')?.click()}>
                    <Camera className="mr-2 h-4 w-4" /> Cập nhật ảnh bìa
                  </Button>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button variant="outline" onClick={() => document.getElementById('background-upload')?.click()}>
                  <Camera className="mr-2 h-4 w-4" /> Tải ảnh bìa lên
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
        <Avatar className="w-40 h-40 border-4 border-background shadow-lg">
          <AvatarImage src={user.imageUrl} alt={user.username} />
          <AvatarFallback>{user.username.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default ProfileHeader;
