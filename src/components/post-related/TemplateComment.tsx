import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useFetchTopLevelComments } from '@/lib/react-query/commentQueriesAndMutations'
import { CommentFromAPI } from '@/types/comment'
import Comment from '../comment-related/Comments';
import RealtimeListener from '../comment-related/RealtimeListener';

export default function CommentList({ postId }: { postId: string }) {
  const [comments, setComments] = useState<CommentFromAPI[]>([]);
  const { 
    data, 
    isLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useFetchTopLevelComments(postId);

  useEffect(() => {
    if (data) {
      const allComments = data.pages.flatMap(page => page.comments);
      setComments(allComments);
    }
  }, [data]);

  const loadMoreComments = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return <div className="text-center">Loading comments...</div>;
  }

  return (
    <div className="space-y-4 w-full">
      <RealtimeListener postId={postId} setComments={setComments} />
      {comments.map((comment) => (
        <Comment key={comment.$id} comment={comment} />
      ))}
      {hasNextPage && (
        <div className="text-center mt-4">
          <Button 
            onClick={loadMoreComments} 
            variant="outline"
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Đang tải...' : 'Xem thêm bình luận'}
          </Button>
        </div>
      )}
    </div>
  );
}
