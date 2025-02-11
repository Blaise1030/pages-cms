"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "lucide-react";

export function UnpublishedChanges() {
  const param = useParams();
  const [numberOfUnsavedChanges, setNumberOfUnsavedChanges] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  const fetchUnfetchPublish = useCallback(async () => {
    try {
      const res = await fetch(`/api/${param.owner}/${param.repo}/${param.branch}/unsave`);
      const jsonResponse = await res.json();
      setNumberOfUnsavedChanges(jsonResponse?.data?.unsavedChanges);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }, [param]);

  const handlePublishChanges = async () => {
    try {
      setIsPublishing(true);
      const res = await fetch(`/api/${param.owner}/${param.repo}/${param.branch}/publish`, {
        method: 'POST',
      });
      const jsonResponse = await res.json();
      if (jsonResponse.status === "success") {
        setNumberOfUnsavedChanges(0);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsPublishing(false);
    }
  };

  useEffect(() => {
    fetchUnfetchPublish();
  }, [fetchUnfetchPublish]);

  if (isLoading) {
    return (
      <Card className="flex flex-col gap-2 items-center p-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-9 w-full" />
      </Card>
    );
  }

  if (numberOfUnsavedChanges === 0) return null;

  return (
    <Card className="flex flex-col gap-2 items-center p-2">
      <p className="text-muted-foreground text-sm">You have {numberOfUnsavedChanges} unpublished changes</p>
      <Button className="w-full" onClick={handlePublishChanges} disabled={isPublishing}>
        {isPublishing ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Publishing...
          </>
        ) : (
          "Publish changes"
        )}
      </Button>
    </Card>
  );
}