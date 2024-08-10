'use client';
import React, { useState } from 'react';
import { Upload, Link, Eye, EyeOff } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface PostCardProps {
  description: string;
  serviceId: string;
}

export default function PostCard({ description, serviceId }: PostCardProps) {
  const [markdownInfo, setMarkdownInfo] = useState('');
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownInfo(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const contentFilled = markdownInfo.trim() !== '';

    if (!youtubeLink?.trim() && !file && !contentFilled) {
      alert(
        'YouTube Link, Image, and Content cannot all be empty. Please fill at least one.',
      );
      return;
    }

    if (youtubeLink?.trim() && file) {
      alert('You can only fill either YouTube Link or Image, not both.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('name', name);
    formData.append('content', markdownInfo);
    formData.append('serviceId', serviceId);

    if (youtubeLink?.trim()) {
      formData.append('youtubeID', youtubeLink.trim());
    }

    if (file) {
      formData.append('image', file);
    }

    try {
      const response = await axios.post('/api/thread', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Submitted Data:', response.data);
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <Card className="mb-4 shadow-md">
      <CardContent className="p-4 relative">
        <form className="space-y-2" onSubmit={handleSubmit}>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Post</h2>
          </div>

          <Input
            placeholder="Title"
            className="text-base"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="Name"
            className="text-base"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsPreview((prev) => !prev)}
              className="absolute top-2 right-2 z-10 flex items-center"
            >
              {isPreview ? (
                <EyeOff className="w-4 h-4 m-2" />
              ) : (
                <Eye className="w-4 h-4 m-2" />
              )}
            </Button>

            {isPreview ? (
              <Markdown
                className="text-sm p-3 whitespace-pre-wrap border"
                remarkPlugins={[remarkGfm]}
              >
                {markdownInfo}
              </Markdown>
            ) : (
              <Textarea
                placeholder="Content"
                className="h-40 text-sm border"
                value={markdownInfo}
                onChange={handleContentChange}
              />
            )}
          </div>

          <Tabs defaultValue="image">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="image">Upload</TabsTrigger>
              <TabsTrigger value="youtube">YouTube</TabsTrigger>
            </TabsList>
            <TabsContent value="youtube">
              <div className="flex items-center">
                <Link className="mr-2" />
                <Input
                  placeholder="YouTube Link"
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                />
              </div>
            </TabsContent>
            <TabsContent value="image">
              <div className="flex items-center justify-center w-full h-40 border-2 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-full"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-xs text-gray-500">
                    {file ? file.name : 'Click or drag to upload'}
                  </p>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </TabsContent>
          </Tabs>

          <Markdown
            className="text-sm text-gray-500 whitespace-pre-wrap"
            remarkPlugins={[remarkGfm]}
          >
            {description}
          </Markdown>
          <Button
            type="submit"
            className="w-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
          >
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
