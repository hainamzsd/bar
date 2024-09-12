import { useState, ChangeEvent } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '@/components/ui/button';
import { Camera, Check, X } from 'lucide-react';
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

const ProfileHeader: React.FC<{ user: { imageUrl: string; username: string; imgBackground: string | undefined } }> = ({ user }) => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(user.imgBackground || null);
  const [originalImage, setOriginalImage] = useState<string | null>(null); // Store original image
  const [imageToCrop, setImageToCrop] = useState<string | null>(null); // Image being cropped
  const [croppedImage, setCroppedImage] = useState<string | null>(null); // Final cropped image
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [repositionMode, setRepositionMode] = useState(false); // Toggle reposition mode
  const { toast } = useToast();

  // Handle image upload
  const handleBackgroundUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (file.size < 200000) {
          toast({
            title: 'Error',
            variant: 'destructive',
            description: 'Image is too small, please upload a larger one',
          });
          return;
        }
        setOriginalImage(reader.result as string); // Store the original image
        setImageToCrop(reader.result as string); // Use the same image for cropping
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle cropping completion
  const handleCropComplete = async (croppedArea: any, croppedAreaPixels: any) => {
    const croppedImage = await getCroppedImg(originalImage!, croppedAreaPixels); // Use original image for cropping
    setCroppedImage(croppedImage);
  };

  // Save the cropped image
  const handleSave = () => {
    if (croppedImage) {
      setBackgroundImage(croppedImage);
      setImageToCrop(null);
      setRepositionMode(false); // Exit reposition mode after saving
    }
  };

  // Cancel cropping
  const handleCancel = () => {
    setImageToCrop(null);
    setRepositionMode(false); // Exit reposition mode
  };

  // Reposition the image (use the original for cropping)
  const handleReposition = () => {
    if (originalImage) {
      setImageToCrop(originalImage); // Reuse the original image for repositioning
      setRepositionMode(true); // Enter reposition mode
    }
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
                <Check></Check>
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X></X>
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
                aspect={16 / 9}
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
                  <Camera className="mr-2 h-4 w-4" /> Upload Background Image
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
          <AvatarFallback>{user.username.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default ProfileHeader;
