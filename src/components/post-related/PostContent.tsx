import { Button } from '@/components/ui/button'
import { HeartIcon, MessageCircleIcon, SendIcon, BookmarkIcon } from 'lucide-react'
import { CardContent } from '../ui/card'
import { useGetAllPosts } from '@/lib/react-query/postQueriesAndMutations';
import { IPost } from '@/types';
import { highlightHashtags } from '@/lib/utils';


type PostProps = {
  title: string;
  imageUrl?: string;
  content?: string;
  tags?: string[];
};
export default function PostContent({ title, imageUrl, content, tags }: PostProps) {
  console.log(tags)
  return (
    <>
      <CardContent className="space-y-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <img
          src={imageUrl}
          alt="Post image"
          className="md:max-w-lg h-auto rounded-md"
        />
       <p className="text-sm" dangerouslySetInnerHTML={{ __html: highlightHashtags(content ?? '', tags ?? []) }} />
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm">
            <HeartIcon className="h-4 w-4 mr-2" />
            1.5k
          </Button>
          <Button variant="ghost" size="sm">
            <MessageCircleIcon className="h-4 w-4 mr-2" />
            234
          </Button>
          <Button variant="ghost" size="sm">
            <SendIcon className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="ghost" size="sm" className="ml-auto">
            <BookmarkIcon className="h-4 w-4" />
            <span className="sr-only">Save post</span>
          </Button>
        </div>
      </CardContent>
    </>
  )
}
