'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { Plus, Trash2, Save, X } from 'lucide-react';

import { LinkItem } from '@/lib/types/link';
import { ServicesRecord } from '@/lib/xata/xata';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import LoadingOverlay from '../common/LoadingOverlay';

interface ServiceEditorProps {
  service: ServicesRecord;
  serviceId: string;
}

const ServiceEditor: React.FC<ServiceEditorProps> = ({
  service,
  serviceId,
}) => {
  const router = useRouter();
  const [editedService, setEditedService] = useState<ServicesRecord>(service);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleBlockedIPsChange = (ips: string[]) => {
    setEditedService({ ...editedService, blockedIPs: ips });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const serviceToSave: ServicesRecord = {
        ...editedService,
        forbidContents: editedService.forbidContents?.filter((item) => !!item),
        blockedIPs: editedService.blockedIPs?.filter((ip) => validateIP(ip)),
      };
      await axios.put(`/api/service/${serviceId}`, serviceToSave);
      router.refresh();
    } catch (error) {
      console.error('Error saving service:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`/api/service/${service.id}`);
      router.push('/services');
    } catch (error) {
      console.error('Error deleting service:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoadingOverlay isLoading={isLoading}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            <Input
              name="name"
              value={editedService.name || ''}
              onChange={handleInputChange}
              placeholder="Service Name"
              className="text-2xl font-bold"
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Textarea
            name="description"
            value={editedService.description || ''}
            onChange={handleInputChange}
            placeholder="Description"
            className="min-h-[100px]"
          />

          <Tabs defaultValue="topLinks" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="topLinks">Top Links</TabsTrigger>
              <TabsTrigger value="headLinks">Head Links</TabsTrigger>
              <TabsTrigger value="forbidContents">Forbidden</TabsTrigger>
              <TabsTrigger value="blockedIPs">Blocked IPs</TabsTrigger>
              <TabsTrigger value="auth">Auth</TabsTrigger>
            </TabsList>

            <TabsContent value="topLinks">
              <Card>
                <CardContent className="pt-6">
                  <LinkEditor
                    links={editedService.topLinks || []}
                    onLinksChange={(links) =>
                      handleLinkChange(links, 'topLinks')
                    }
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

            <TabsContent value="blockedIPs">
              <Card>
                <CardContent className="pt-6">
                  <BlockedIPsEditor
                    ips={editedService.blockedIPs || []}
                    onIPsChange={handleBlockedIPsChange}
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to delete this service?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the service and all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button onClick={handleSave} size="icon">
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </LoadingOverlay>
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

interface BlockedIPsEditorProps {
  ips: string[];
  onIPsChange: (ips: string[]) => void;
}

const BlockedIPsEditor: React.FC<BlockedIPsEditorProps> = ({
  ips,
  onIPsChange,
}) => {
  const [localIPs, setLocalIPs] = useState<string[]>(ips);

  const handleIPChange = (index: number, value: string) => {
    const newIPs = [...localIPs];
    newIPs[index] = value;
    setLocalIPs(newIPs);
    onIPsChange(newIPs);
  };

  const handleAddIP = () => {
    const newIPs = [...localIPs, ''];
    setLocalIPs(newIPs);
    onIPsChange(newIPs);
  };

  const handleRemoveIP = (index: number) => {
    const newIPs = localIPs.filter((_, i) => i !== index);
    setLocalIPs(newIPs);
    onIPsChange(newIPs);
  };

  return (
    <div className="space-y-4">
      {localIPs.map((ip, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input
            value={ip}
            onChange={(e) => handleIPChange(index, e.target.value)}
            placeholder="IP Address or Range"
            className="flex-1"
          />
          <Button
            onClick={() => handleRemoveIP(index)}
            size="icon"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button onClick={handleAddIP} variant="outline" className="w-full">
        <Plus className="h-4 w-4 mr-2" /> Add IP Address
      </Button>
    </div>
  );
};

const validateIP = (ip: string): boolean => {
  // Allow partial IP inputs (e.g., "192.168")
  const parts = ip.split('.');
  if (parts.length > 4) return false;

  for (let part of parts) {
    if (part === '') continue;
    const num = parseInt(part, 10);
    if (isNaN(num) || num < 0 || num > 255) return false;
  }

  return true;
};

export default ServiceEditor;
