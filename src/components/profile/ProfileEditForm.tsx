import { useState, ChangeEvent } from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from '@/components/ui/select';
import { IUser } from '@/types';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea'; // Assuming you have a Textarea component
import { DatePicker } from '../shared/DatePicker';

interface ProfileEditFormProps {
  user: IUser;
  onSave?: (user: IUser) => void;
  onClose?: () => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState<IUser>(user);
  const [date, setDate] = useState<Date | undefined>(user.dob ? new Date(user.dob) : undefined);

  const handleInfoChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleGenderChange = (value: string) => {
    setFormData({
      ...formData,
      gender: value === 'Male' ? true : value === 'Female' ? false : undefined
    });
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData({
      ...formData,
      dob: date?.toISOString().split('T')[0] // Example format: YYYY-MM-DD
    });
  };

  const handleSave = () => {
    // onSave(formData);
    // onClose();
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Sửa thông tin</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">
            Tên người dùng
          </Label>
          <Input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInfoChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="gender" className="text-right">
            Giới tính
          </Label>
          <Select
            onValueChange={handleGenderChange}
            value={formData.gender === undefined ? '' : formData.gender ? 'Male' : 'Female'}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder={formData.gender === undefined ? 'Chọn giới tính' : (formData.gender ? 'Nam' : 'Nữ')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Nam</SelectItem>
              <SelectItem value="Female">Nữ</SelectItem>
              <SelectItem value="Other">Khác</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="dob" className="text-right">
            Ngày sinh
          </Label>
          <DatePicker
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="bio" className="text-right">
            Tiểu sử
          </Label>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio || ''}
            onChange={handleInfoChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInfoChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="facebook" className="text-right">
            Facebook
          </Label>
          <Input
            id="facebook"
            name="facebook"
            value={formData.facebook || ''}
            onChange={handleInfoChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="twitter" className="text-right">
            Twitter
          </Label>
          <Input
            id="twitter"
            name="twitter"
            value={formData.twitter || ''}
            onChange={handleInfoChange}
            className="col-span-3"
          />
        </div>
      </div>
      <Button onClick={handleSave}>Lưu thay đổi</Button>
    </DialogContent>
  );
};

export default ProfileEditForm;
