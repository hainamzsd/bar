import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useGetAllPosts } from '@/lib/react-query/postQueriesAndMutations';
import PostSkeleton from '../skeleton/post-skeleton';
import { PostCard } from './post-card';

export default function InfiniteScrollPosts() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useGetAllPosts();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (status === 'pending') return <PostSkeleton />;
  if (status === 'error') return <p className="text-red-500">Error loading posts</p>;

  return (
    <div className="space-y-6">
      {data?.pages.map((group, i) => (
        <React.Fragment key={i}>
          {group.map((post: any) => (
            <PostCard key={post.$id} post={post} />
          ))}
        </React.Fragment>
      ))}
      <div ref={ref}>
        {isFetchingNextPage && <PostSkeleton />}
      </div>
    </div>
  );
}