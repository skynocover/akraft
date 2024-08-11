'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { LinkItem } from '@/lib/types/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ServicesRecord } from '@/lib/xata/xata';
import { useRouter } from 'next/navigation';

interface ServiceEditorProps {
  serviceId: string;
  service: ServicesRecord;
}

const ServiceEditor: React.FC<ServiceEditorProps> = ({
  serviceId,
  service,
}) => {
  const router = useRouter();

  const [editedService, setEditedService] = useState<ServicesRecord>(service);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEditedService({ ...editedService, [name]: value });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setEditedService({ ...editedService, visible: checked });
  };

  const handleLinkChange = (links: LinkItem[], key: keyof ServicesRecord) => {
    setEditedService({ ...editedService, [key]: links });
  };

  const handleForbidContentsChange = (contents: string[]) => {
    setEditedService({ ...editedService, forbidContents: contents });
  };

  const handleSave = async () => {
    const service: ServicesRecord = {
      ...editedService,
      forbidContents: editedService.forbidContents?.filter((item) => !!item),
    };
    await axios.put('/api/service', { serviceId, ...service });
    router.refresh();
  };

  const handleDelete = async () => {
    await axios.delete('/api/service?serviceId=' + serviceId);
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg max-w-2xl mx-auto">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Service Name
        </label>
        <Input
          name="name"
          value={editedService.name || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <Textarea
          name="description"
          value={editedService.description || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full"
        />
      </div>

      <Tabs defaultValue="topLinks">
        <TabsList>
          <TabsTrigger value="topLinks">Top Links</TabsTrigger>
          <TabsTrigger value="headLinks">Head Links</TabsTrigger>
          <TabsTrigger value="forbidContents">Forbidden Contents</TabsTrigger>
          <TabsTrigger value="auth">Auth</TabsTrigger>
        </TabsList>

        <TabsContent value="topLinks">
          <Card className="mt-4">
            <CardContent>
              <h2 className="text-lg font-medium mb-2">Top Links</h2>
              <LinkEditor
                links={editedService.topLinks || []}
                onLinksChange={(links) => handleLinkChange(links, 'topLinks')}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="headLinks">
          <Card className="mt-4">
            <CardContent>
              <h2 className="text-lg font-medium mb-2">Head Links</h2>
              <LinkEditor
                links={editedService.headLinks || []}
                onLinksChange={(links) => handleLinkChange(links, 'headLinks')}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forbidContents">
          <Card className="mt-4">
            <CardContent>
              <h2 className="text-lg font-medium mb-2">Forbidden Contents</h2>
              <ForbidContentsEditor
                contents={editedService.forbidContents || []}
                onContentsChange={handleForbidContentsChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auth">
          <Card className="mt-4">
            <CardContent>
              <h2 className="text-lg font-medium mb-2">Auth Configuration</h2>
              <Textarea
                name="auth"
                value={JSON.stringify(editedService.auth, null, 2) || ''}
                onChange={(e) =>
                  setEditedService({
                    ...editedService,
                    auth: JSON.parse(e.target.value),
                  })
                }
                className="mt-1 block w-full"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex items-center space-x-4 mt-4">
        {/* <label className="block text-sm font-medium text-gray-700">
          Public Visible
        </label>
        <Checkbox
          name="visible"
          checked={isVisible}
          onCheckedChange={(checked) =>
            handleCheckboxChange(checked as boolean)
          }
        /> */}
        <Button onClick={handleDelete} className="bg-red-500 text-white">
          Delete
        </Button>
        <div className="flex-1" />
        <Button onClick={handleSave} className="bg-blue-500 text-white">
          Save
        </Button>
      </div>
    </div>
  );
};

interface LinkEditorProps {
  links: LinkItem[];
  onLinksChange: (links: LinkItem[]) => void;
}

const LinkEditor: React.FC<LinkEditorProps> = ({ links, onLinksChange }) => {
  const [localLinks, setLocalLinks] = useState<LinkItem[]>(links);

  const handleLinkChange = (
    index: number,
    field: keyof LinkItem,
    value: string,
  ) => {
    const newLinks = [...localLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setLocalLinks(newLinks);
    onLinksChange(newLinks);
  };

  const handleAddLink = () => {
    const newLinks = [...localLinks, { name: '', url: '' }];
    setLocalLinks(newLinks);
    onLinksChange(newLinks);
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = localLinks.filter((_, i) => i !== index);
    setLocalLinks(newLinks);
    onLinksChange(newLinks);
  };

  return (
    <div>
      {localLinks.map((link, index) => (
        <div key={index} className="mb-2 flex space-x-2">
          <Input
            value={link.name}
            onChange={(e) => handleLinkChange(index, 'name', e.target.value)}
            placeholder="Link Name"
          />
          <Input
            value={link.url}
            onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
            placeholder="Link URL"
          />
          <Button
            onClick={() => handleRemoveLink(index)}
            className="bg-red-500 text-white"
          >
            Remove
          </Button>
        </div>
      ))}
      <Button onClick={handleAddLink} className="bg-green-500 text-white">
        Add Link
      </Button>
    </div>
  );
};

interface ForbidContentsEditorProps {
  contents: string[];
  onContentsChange: (contents: string[]) => void;
}

const ForbidContentsEditor: React.FC<ForbidContentsEditorProps> = ({
  contents,
  onContentsChange,
}) => {
  const [localContents, setLocalContents] = useState<string[]>(contents);

  const handleContentChange = (index: number, value: string) => {
    const newContents = [...localContents];
    newContents[index] = value;
    setLocalContents(newContents);
    onContentsChange(newContents);
  };

  const handleAddContent = () => {
    const newContents = [...localContents, ''];
    setLocalContents(newContents);
    onContentsChange(newContents);
  };

  const handleRemoveContent = (index: number) => {
    const newContents = localContents.filter((_, i) => i !== index);
    setLocalContents(newContents);
    onContentsChange(newContents);
  };

  return (
    <div>
      {localContents.map((content, index) => (
        <div key={index} className="mb-2 flex space-x-2">
          <Input
            value={content}
            onChange={(e) => handleContentChange(index, e.target.value)}
            placeholder="Forbidden Content"
          />
          <Button
            onClick={() => handleRemoveContent(index)}
            className="bg-red-500 text-white"
          >
            Remove
          </Button>
        </div>
      ))}
      <Button onClick={handleAddContent} className="bg-green-500 text-white">
        Add Forbidden Content
      </Button>
    </div>
  );
};

export default ServiceEditor;
