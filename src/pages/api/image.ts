import { NextApiRequest, NextApiResponse } from 'next';
import { Client, Storage } from 'appwrite';
import { appwriteConfig } from '@/lib/appwrite/config';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
  .setProject(appwriteConfig.projectId as string); // Replace with your project ID

const storage = new Storage(client);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { cursor = '' } = req.query;

  try {
    const response = await storage.listFiles(appwriteConfig.storageId as string, [cursor as string]);

    const images = response.files.map((file) => ({
      id: file.$id,
      url: storage.getFileView(appwriteConfig.storageId as string, file.$id),
      title: file.name,
    //   tags: file.tags || [],
    //   description: file.description || '',
    }));

    res.status(200).json({
      images,
      nextCursor: response.files.length === 20 ? response.files[response.files.length - 1].$id : null,
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Error fetching images' });
  }
}