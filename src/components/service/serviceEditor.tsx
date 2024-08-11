'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { LinkItem } from '@/lib/types/link';
import { ServicesRecord } from '@/lib/xata/xata';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Plus, Trash2, Save, X } from 'lucide-react';

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
    <div className="p-6 bg-white shadow-lg rounded-xl max-w-3xl mx-auto">
      <div className="space-y-6">
        <Input
          name="name"
          value={editedService.name || ''}
          onChange={handleInputChange}
          placeholder="Service Name"
          className="text-xl font-semibold"
        />

        <Textarea
          name="description"
          value={editedService.description || ''}
          onChange={handleInputChange}
          placeholder="Description"
          className="min-h-[100px]"
        />

        <Tabs defaultValue="topLinks" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="topLinks">Top Links</TabsTrigger>
            <TabsTrigger value="headLinks">Head Links</TabsTrigger>
            <TabsTrigger value="forbidContents">Forbidden</TabsTrigger>
            <TabsTrigger value="auth">Auth</TabsTrigger>
          </TabsList>

          <TabsContent value="topLinks">
            <Card>
              <CardContent className="pt-6">
                <LinkEditor
                  links={editedService.topLinks || []}
                  onLinksChange={(links) => handleLinkChange(links, 'topLinks')}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="headLinks">
            <Card>
              <CardContent className="pt-6">
                <LinkEditor
                  links={editedService.headLinks || []}
                  onLinksChange={(links) =>
                    handleLinkChange(links, 'headLinks')
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forbidContents">
            <Card>
              <CardContent className="pt-6">
                <ForbidContentsEditor
                  contents={editedService.forbidContents || []}
                  onContentsChange={handleForbidContentsChange}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="auth">
            <Card>
              <CardContent className="pt-6">
                <Textarea
                  name="auth"
                  value={JSON.stringify(editedService.auth, null, 2) || ''}
                  onChange={(e) =>
                    setEditedService({
                      ...editedService,
                      auth: JSON.parse(e.target.value),
                    })
                  }
                  className="min-h-[200px] font-mono text-sm"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center mt-8">
          <Button onClick={handleDelete} variant="destructive" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button onClick={handleSave} size="icon">
            <Save className="h-4 w-4" />
          </Button>
        </div>
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
    <div className="space-y-4">
      {localLinks.map((link, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input
            value={link.name}
            onChange={(e) => handleLinkChange(index, 'name', e.target.value)}
            placeholder="Link Name"
            className="flex-1"
          />
          <Input
            value={link.url}
            onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
            placeholder="Link URL"
            className="flex-1"
          />
          <Button
            onClick={() => handleRemoveLink(index)}
            size="icon"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button onClick={handleAddLink} variant="outline" className="w-full">
        <Plus className="h-4 w-4 mr-2" /> Add Link
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
    <div className="space-y-4">
      {localContents.map((content, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input
            value={content}
            onChange={(e) => handleContentChange(index, e.target.value)}
            placeholder="Forbidden Content"
            className="flex-1"
          />
          <Button
            onClick={() => handleRemoveContent(index)}
            size="icon"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button onClick={handleAddContent} variant="outline" className="w-full">
        <Plus className="h-4 w-4 mr-2" /> Add Forbidden Content
      </Button>
    </div>
  );
};

export default ServiceEditor;
