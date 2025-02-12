"use client";

import { EntryEditor } from "@/components/entry/entry-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useConfig } from "@/contexts/config-context";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const { setConfig, config } = useConfig();
  const [buildHookUrl, setBuildHookUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchBuildHook = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/${config?.owner}/${config?.repo}/${config?.branch}/build-hook`);
        if (!response.ok) throw new Error('Failed to fetch build hook');
        const data = await response.json();
        if (data.buildHook) setBuildHookUrl(data.buildHook);
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        console.error('Error fetching build hook:', error);
      }
    };

    if (config?.owner && config?.repo && config?.branch) {
      fetchBuildHook();
    }
  }, [config?.owner, config?.repo, config?.branch]);

  const handleSave = async (data: Record<string, any>) => {
    setConfig(data.config);
    await handleBuildHookSave()
  };

  const handleBuildHookSave = async () => {
    if (!buildHookUrl) return;
    setIsSaving(true);
    try {
      const response = await fetch(`/api/${config?.owner}/${config?.repo}/${config?.branch}/build-hook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buildHook: buildHookUrl })
      });
      if (!response.ok) throw new Error('Failed to save build hook');
      toast.success('Build hook URL saved successfully');
    } catch (error) {
      toast.error('Failed to save build hook URL');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <EntryEditor path=".pages.yml" onSave={handleSave} title="Settings" />
      <div className="flex flex-col gap-1 pe-72">
        <Card>
          <CardHeader>
            <CardTitle>Build Hook</CardTitle>
            <CardDescription>
              This is the endpoint that will be invoked when the user presses on the publish button, triggering CI/CD deployment.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {
              isLoading ?
                <Skeleton className="h-10 w-full" /> :
                <Input
                  placeholder="https://post-endpoint-to-trigger-build"
                  value={buildHookUrl}
                  onChange={(e) => setBuildHookUrl(e.target.value)}
                />
            }
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleBuildHookSave}
              disabled={!buildHookUrl || isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}