'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Upload, Link } from 'lucide-react';

interface PostCardProps {
  markdownInfo: string;
}

export default function PostCard({ markdownInfo }: PostCardProps) {
  return (
    <Card className="mb-4 shadow-md">
      <CardContent className="p-4">
        <form className="space-y-2">
          <Input placeholder="Title" className="text-base" />
          <Input placeholder="Name" className="text-base" />
          <Textarea placeholder="Content" className="h-24 text-sm" />

          <Tabs defaultValue="image">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="image">Upload</TabsTrigger>
              <TabsTrigger value="youtube">YouTube</TabsTrigger>
            </TabsList>
            <TabsContent value="youtube">
              <div className="flex items-center">
                <Link className="mr-2" />
                <Input placeholder="YouTube Link" />
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
                    Click or drag to upload
                  </p>
                  <input id="dropzone-file" type="file" className="hidden" />
                </label>
              </div>
            </TabsContent>
          </Tabs>

          <div className="text-sm text-gray-500 whitespace-pre-wrap">
            {markdownInfo}
          </div>

          <Button type="submit" className="w-full bg-blue-500 text-white">
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
