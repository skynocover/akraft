'use client';
import React, { useState } from 'react';
import { Upload, Link, Eye, EyeOff, Loader, X } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { validatePostInput, PostInput } from '@/lib/utils/threads';
import { useSession } from 'next-auth/react';

interface PostCardProps {
  description?: string;
  serviceId: string;
  threadId?: string;
  isReply?: boolean;
  onClose?: () => void;
  serviceOwnerId: string;
}

export default function PostCard({
  description,
  serviceId,
  threadId,
  isReply = false,
  onClose,
  serviceOwnerId,
}: PostCardProps) {
  const session = useSession();
  const fileInputID = `dropzone-file-${isReply ? `${threadId}-reply` : 'page'}`;
  const [markdownInfo, setMarkdownInfo] = useState('');
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSage, setIsSage] = useState(false);
  const router = useRouter();

  const isOwner = session.data?.user?.id === serviceOwnerId;

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownInfo(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('content', markdownInfo);

      if (isReply) {
        if (!threadId) throw new Error('Thread ID is required for replies');
        const replyInput: PostInput = {
          threadId,
          name,
          content: markdownInfo,
          youtubeLink,
          image: file,
        };
        validatePostInput(replyInput);
        formData.append('threadId', threadId);
        formData.append('sage', isSage.toString());
      } else {
        const postInput: PostInput = {
          title,
          name,
          content: markdownInfo,
          youtubeLink,
          image: file,
        };
        validatePostInput(postInput);
        formData.append('title', title);
      }

      if (youtubeLink?.trim()) {
        formData.append('youtubeLink', youtubeLink.trim());
      }

      if (file) {
        formData.append('image', file);
      }

      await axios.post(
        isReply
          ? `/api/service/${serviceId}/reply`
          : `/api/service/${serviceId}/thread`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );

      // Reset form fields
      setTitle('');
      setName('');
      setMarkdownInfo('');
      setYoutubeLink('');
      setFile(null);

      // Close modal if it's a reply, otherwise refresh the page
      if (isReply && onClose) {
        onClose();
      }
      router.refresh();
    } catch (error) {
      console.error('Submission error:', error);
      console.log(error instanceof AxiosError);
      const message =
        error instanceof AxiosError
          ? error.response?.data.error
          : error instanceof Error
          ? error.message
          : 'An unexpected error occurred';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      className={`mb-4 shadow-md ${
        isReply ? 'w-full max-w-md mx-auto' : 'mx-auto max-w-3xl'
      }`}
    >
      <CardContent className="p-3 relative">
        {isReply && onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-2 right-2"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <form className="space-y-2" onSubmit={handleSubmit}>
          <div className="flex space-x-2">
            {!isReply && (
              <Input
                placeholder="Title"
                className="text-base"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
              />
            )}
            <Input
              placeholder="Name"
              className="text-base"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsPreview((prev) => !prev)}
              className="absolute top-2 right-2 z-10 flex items-center"
              disabled={isLoading}
            >
              {isPreview ? (
                <EyeOff className="w-4 h-4 m-2" />
              ) : (
                <Eye className="w-4 h-4 m-2" />
              )}
            </Button>

            {isPreview ? (
              <Markdown
                className="text-sm p-3 whitespace-pre-wrap border min-h-40"
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
                disabled={isLoading}
              />
            )}
          </div>

          <Tabs defaultValue="image">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="image" disabled={isLoading}>
                Upload
              </TabsTrigger>
              <TabsTrigger value="youtube" disabled={isLoading}>
                YouTube
              </TabsTrigger>
            </TabsList>
            <TabsContent value="youtube">
              <div className="flex items-center">
                <Link className="mr-2" />
                <Input
                  placeholder="YouTube Link"
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </TabsContent>
            <TabsContent value="image">
              <div className="flex items-center justify-center w-full h-28 border-2 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer">
                <label
                  htmlFor={fileInputID}
                  className="flex flex-col items-center justify-center w-full h-full"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-xs text-gray-500">
                    {file ? file.name : 'Click or drag to upload image'}
                  </p>
                  <input
                    id={fileInputID}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isLoading}
                    accept="image/*"
                  />
                </label>
              </div>
            </TabsContent>
          </Tabs>

          {!isReply && description && (
            <Markdown
              className="text-sm text-gray-500 whitespace-pre-wrap"
              remarkPlugins={[remarkGfm]}
            >
              {description}
            </Markdown>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex">
            <Button
              type="submit"
              className="w-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : isReply ? (
                'Submit reply' + (isOwner ? ' as admin' : '')
              ) : (
                'Submit' + (isOwner ? ' as admin' : '')
              )}
            </Button>
            {isReply && (
              <div className="flex items-center space-x-2 ml-2">
                <Checkbox
                  id="sage"
                  checked={isSage}
                  onCheckedChange={(checked) => setIsSage(checked as boolean)}
                />
                <label
                  htmlFor="sage"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Sage
                </label>
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
