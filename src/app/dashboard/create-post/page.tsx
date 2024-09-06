import { Button } from '@/components/ui/button'
import React from 'react'

const page = () => {
  return (
    <div className='flex flex-col md:flex-row md:items-start md:justify-center p-4'>
    <div className='flex-1 md:w-1/2 lg:w-1/3'>
      <h1 className='text-2xl font-bold mb-6'>Create a New Post</h1>
      <div className='p-6 rounded-lg '>
        <form className='space-y-4'>
          <div>
            <label htmlFor='title' className='block text-sm font-medium '>Title</label>
            <input
              type='text'
              id='title'
              className='mt-1 block w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Enter post title'
            />
          </div>
          <div>
            <label htmlFor='content' className='block text-sm font-medium '>Content</label>
            <textarea
              id='content'
              className='mt-1 block w-full p-3 border  rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Enter post content'
              rows={6}
            />
          </div>
          <Button
            type='submit'
            className='w-full py-3 px-4   font-bold rounded-md '
          >
            Create Post
          </Button>
        </form>
      </div>
    </div>
  </div>
  )
}

export default page