import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Props {
  setShowChat: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PopChat({ setShowChat }: Props) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  const handleSend = () => {
    if (message.trim()) {
      setMessages([...messages, message]);
      setMessage(''); // Clear input field after sending
    }
  };

  return (
    <div className="fixed bottom-0 right-0 m-4 w-full max-w-md bg-gray-900 p-4 rounded-lg shadow-lg z-50
    max-h-[600px] overflow-y-auto
    ">
      <button
        onClick={() => setShowChat(false)}
        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full"
      >
        Close
      </button>
      
      {/* Character Sprite */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full max-w-xs mb-4"
      >
        <Image
          src="/pop.jpg"
          alt="Character"
          width={400}
          height={400}
          className="object-contain"
        />
      </motion.div>

      {/* Chat Messages */}
      <div className="flex flex-col gap-4 mb-4 max-h-60 ">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className={`p-2 rounded-md ${
              index % 2 === 0 ? 'bg-white bg-opacity-90 text-black' : 'bg-blue-500 text-white self-end'
            }`}
          >
            {msg}
          </motion.div>
        ))}
      </div>

      {/* User Input Box */}
      <div className="flex items-center bg-white bg-opacity-90 text-black p-2 rounded-md">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow bg-transparent outline-none p-2"
        />
        <button
          onClick={handleSend}
          className="ml-2 p-2 bg-blue-500 text-white rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
}
