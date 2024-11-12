'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { Download, X } from 'lucide-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { storage, appwriteConfig } from '@/lib/appwrite/config';
import { Models } from 'appwrite';

interface ImageItem {
  id: string;
  url: string;
  name: string;
}

async function fetchImages({ pageParam = '' }) {
  const response = await storage.listFiles(
    appwriteConfig.storageId as string,
    [],
  );

  const images: ImageItem[] = response.files.map((file: Models.File) => ({
    id: file.$id,
    url: storage.getFilePreview(appwriteConfig.storageId as string, file.$id).toString(),
    name: file.name,
  }));

  return {
    images,
    nextCursor: response.files.length === 100 ? response.files[response.files.length - 1].$id : null,
  };
}

function AppwriteInfiniteGallery() {
  const [selected, setSelected] = useState<ImageItem | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['images'],
    queryFn: ({ pageParam = '' }) => fetchImages({ pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: '',
  });

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const loadMoreInView = useInView(loadMoreRef);

  useEffect(() => {
    if (loadMoreInView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [loadMoreInView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === 'pending') return <div className="text-center py-8">Loading...</div>;
  if (status === 'error') return <div className="text-center py-8 text-red-500">Error loading images</div>;

  const allImages = data?.pages.flatMap((page) => page.images) || [];

  return (
    <>
      <div className='container mx-auto sm:p-4 px-0'>
        <div className='columns-2 sm:columns-3 lg:columns-4 gap-4'>
          {allImages.map((item, index) => (
            <ImageItem
              key={item.id}
              item={item}
              index={index}
              setSelected={setSelected}
            />
          ))}
        </div>
        <div ref={loadMoreRef} className="text-center py-4">
          {isFetchingNextPage && <div>Loading more...</div>}
        </div>
      </div>
      <Modal selected={selected} setSelected={setSelected} />
    </>
  );
}

interface ImageItemProps {
  item: ImageItem;
  index: number;
  setSelected: React.Dispatch<React.SetStateAction<ImageItem | null>>;
}

function ImageItem({ item, index, setSelected }: ImageItemProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.figure
      initial='hidden'
      animate={isInView ? 'visible' : 'hidden'}
      ref={ref}
      className="inline-block group w-full rounded-md relative mb-4 overflow-hidden cursor-pointer"
      onClick={() => setSelected(item)}
    >
      <motion.img
        layoutId={`card-${item.id}`}
        whileHover={{ scale: 1.025 }}
        transition={{ duration: 0.3 }}
        src={item.url}
        alt={item.name}
        className='w-full bg-base-100 shadow-xl image-full cursor-pointer'
      />
      <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
        <div className='absolute bottom-0 left-0 p-4'>
          <h1 className='text-white font-semibold text-sm sm:text-base truncate'>{item.name}</h1>
        </div>
      </div>
    </motion.figure>
  );
}

interface ModalProps {
  selected: ImageItem | null;
  setSelected: React.Dispatch<React.SetStateAction<ImageItem | null>>;
}

function Modal({ selected, setSelected }: ModalProps) {
  const itemVariants = {
    initial: {
      opacity: 0,
      y: 10,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
    },
  };

  useEffect(() => {
    if (selected) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelected(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selected, setSelected]);

  if (!selected) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelected(null)}
        className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 cursor-pointer overflow-y-auto'
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          layoutId={`card-${selected.id}`}
          className='w-full max-w-[1000px] mx-auto my-4 sm:my-8 cursor-default bg-white dark:bg-[#202020] overflow-hidden'
        >
          <div className='relative'>
            <button
              className='absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors'
              onClick={() => setSelected(null)}
            >
              <X size={20} />
            </button>
            <div className='p-2 h-[50vh] sm:h-[60vh] md:h-[70vh] rounded-md'>
              <img
                width={1000}
                height={1000}
                src={selected.url}
                alt={selected.name}
                className='w-full h-full object-contain rounded-md'
              />
            </div>
          </div>
          <motion.div
            variants={itemVariants}
            initial='initial'
            animate='animate'
            exit='exit'
            className='bg-white dark:bg-black dark:text-white text-black p-4 rounded-md px-8'
          >
            <motion.h3
              variants={itemVariants}
              className='text-xl sm:text-2xl font-bold mb-2'
            >
              {selected.name}
            </motion.h3>
            <motion.a
              variants={itemVariants}
              className='inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-blue-700 transition-colors text-sm sm:text-base'
              href={selected.url}
              download
            >
              Tải xuống
              <Download className="ml-2" size={18} />
            </motion.a>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AppwriteInfiniteGallery;