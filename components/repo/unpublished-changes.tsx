"use client";

import { useUnpublishedChanges } from "@/contexts/unpublished-changes-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "lucide-react";
import { toast } from "sonner";

export function UnpublishedChanges() {
  const { numberOfUnsavedChanges, isLoading, isPublishing, publishChanges } = useUnpublishedChanges();

  const handlePublish = async () => {
    try {
      await publishChanges();
      toast.success("Changes published successfully");
    } catch (error) {
      toast.error("Failed to publish changes");
    }
  };

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
      <Button className="w-full" onClick={handlePublish} disabled={isPublishing}>
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