import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatDate, genderToString } from '@/lib/utils'
import { IUser} from '@/types'
import { Mail, MapPin, Calendar, User, Facebook, Twitter, Linkedin, Github, Lock } from 'lucide-react'



const UserInfoCard: React.FC<{ userInfo: IUser }> = ({ userInfo }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin cá nhân</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* <div className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <span>{userInfo.email}</span>
            <Lock className="h-3 w-3 text-muted-foreground" ></Lock>
          </div> */}
          {userInfo.dob && (
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>Ngày sinh: {formatDate(userInfo.dob)}</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span>Tham gia vào {formatDate(userInfo.joinDate)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <span>Giới tính: {genderToString(userInfo.gender)}</span>
          </div>
        </div>
        {(userInfo.facebookLink && userInfo.twitterLink) && <>
            <Separator />
        <div>
          <h3 className="font-semibold mb-2">Mạng xã hội</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <Facebook className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1 overflow-hidden text-ellipsis">
                  <a href={userInfo.facebookLink} className="text-blue-500 hover:underline">
                    {userInfo.facebookLink}
                  </a>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <Twitter className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1 overflow-hidden text-ellipsis">
                  <a href={userInfo.twitterLink} className="text-blue-500 hover:underline">
                    {userInfo.twitterLink}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        </>}
       
      </CardContent>
    </Card>
  )
}

export default UserInfoCard
