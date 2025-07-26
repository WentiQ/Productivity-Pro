import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertDistractionSiteSchema, type DistractionSite } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  Plus, 
  Globe, 
  Smartphone, 
  Monitor, 
  Clock, 
  TrendingDown,
  Eye,
  EyeOff,
  Trash2 
} from "lucide-react";
import { z } from "zod";

const siteFormSchema = insertDistractionSiteSchema;
type SiteFormData = z.infer<typeof siteFormSchema>;

export default function Blocker() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [blockingEnabled, setBlockingEnabled] = useState(false);
  const { toast } = useToast();

  const { data: sites = [], isLoading } = useQuery<DistractionSite[]>({
    queryKey: ['/api/distraction-sites'],
  });

  const createSiteMutation = useMutation({
    mutationFn: async (data: SiteFormData) => {
      const response = await apiRequest('POST', '/api/distraction-sites', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/distraction-sites'] });
      setDialogOpen(false);
      toast({
        title: "Success",
        description: "Site added to block list",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add site",
        variant: "destructive",
      });
    },
  });

  const updateSiteMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<DistractionSite> }) => {
      const response = await apiRequest('PUT', `/api/distraction-sites/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/distraction-sites'] });
      toast({
        title: "Updated",
        description: "Site status updated",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update site",
        variant: "destructive",
      });
    },
  });

  const deleteSiteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/distraction-sites/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/distraction-sites'] });
      toast({
        title: "Success",
        description: "Site removed from block list",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove site",
        variant: "destructive",
      });
    },
  });

  const form = useForm<SiteFormData>({
    resolver: zodResolver(siteFormSchema),
    defaultValues: {
      url: "",
      name: "",
      isBlocked: true,
    },
  });

  const onSubmit = (data: SiteFormData) => {
    createSiteMutation.mutate(data);
  };

  const toggleSiteBlocking = (site: DistractionSite) => {
    updateSiteMutation.mutate({
      id: site.id,
      data: { isBlocked: !site.isBlocked }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this site from the block list?")) {
      deleteSiteMutation.mutate(id);
    }
  };

  // Mock data for demonstration
  const blockedSites = sites.filter(site => site.isBlocked);
  const allowedSites = sites.filter(site => !site.isBlocked);
  const mockStats = {
    blockedToday: 47,
    timeSaved: 128, // minutes
    mostBlocked: "social-media.com",
    streak: 5
  };

  // Common distraction sites for quick add
  const commonSites = [
    { name: "Facebook", url: "facebook.com" },
    { name: "Twitter", url: "twitter.com" },
    { name: "Instagram", url: "instagram.com" },
    { name: "YouTube", url: "youtube.com" },
    { name: "TikTok", url: "tiktok.com" },
    { name: "Reddit", url: "reddit.com" },
    { name: "Netflix", url: "netflix.com" },
    { name: "LinkedIn", url: "linkedin.com" },
  ];

  const handleQuickAdd = (site: { name: string; url: string }) => {
    createSiteMutation.mutate({
      name: site.name,
      url: site.url,
      userId: "user-1", // Mock user ID for demo
      isBlocked: true,
    });
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Distraction Blocker</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Block distracting websites and apps to maintain focus</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={blockingEnabled}
                onCheckedChange={setBlockingEnabled}
                className="data-[state=checked]:bg-green-600"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {blockingEnabled ? "Blocking Active" : "Blocking Disabled"}
              </span>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Site
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add Website to Block List</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Facebook" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., facebook.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createSiteMutation.isPending}>
                        Add Site
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Blocked Today</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockStats.blockedToday}</p>
                </div>
                <Shield className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Time Saved</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockStats.timeSaved}m</p>
                </div>
                <Clock className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Focus Streak</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockStats.streak} days</p>
                </div>
                <TrendingDown className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sites Blocked</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{blockedSites.length}</p>
                </div>
                <Globe className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Add Common Sites */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Add Common Distractions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {commonSites.map((site) => (
                <Button
                  key={site.url}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdd(site)}
                  disabled={sites.some(s => s.url === site.url)}
                  className="flex items-center justify-center p-3 h-auto"
                >
                  <div className="text-center">
                    <Globe className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs">{site.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Site Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Blocked Sites */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2 text-red-500" />
                Blocked Sites ({blockedSites.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : blockedSites.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No sites blocked yet. Add some distracting websites to improve your focus!
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {blockedSites.map((site) => (
                    <div key={site.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-4 h-4 text-red-500" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{site.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{site.url}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSiteBlocking(site)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <EyeOff className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(site.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Allowed Sites */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <EyeOff className="w-5 h-5 mr-2 text-green-500" />
                Allowed Sites ({allowedSites.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {allowedSites.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  All sites in your list are currently blocked.
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {allowedSites.map((site) => (
                    <div key={site.id} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center space-x-3">
                        <Globe className="w-4 h-4 text-green-500" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{site.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{site.url}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSiteBlocking(site)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(site.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Platform Support Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Platform Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <Monitor className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900 dark:text-white">Windows</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Browser extension blocks websites system-wide
                </p>
                <Badge variant="secondary" className="mt-2">Coming Soon</Badge>
              </div>
              
              <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <Smartphone className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900 dark:text-white">Android</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  App blocking for mobile productivity
                </p>
                <Badge variant="secondary" className="mt-2">Coming Soon</Badge>
              </div>
              
              <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <Smartphone className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900 dark:text-white">iOS</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Screen Time integration for app limits
                </p>
                <Badge variant="secondary" className="mt-2">Coming Soon</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
