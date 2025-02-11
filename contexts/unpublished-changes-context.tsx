"use client";

import { createContext, useContext, useCallback, useState, ReactNode, useEffect } from "react";
import { useParams } from "next/navigation";

type UnpublishedChangesContextType = {
  numberOfUnsavedChanges: number;
  isLoading: boolean;
  isPublishing: boolean;
  fetchUnpublishedChanges: () => Promise<void>;
  publishChanges: () => Promise<void>;
};

const UnpublishedChangesContext = createContext<UnpublishedChangesContextType | undefined>(undefined);

export function UnpublishedChangesProvider({ children }: { children: ReactNode }) {
  const param = useParams();
  const [numberOfUnsavedChanges, setNumberOfUnsavedChanges] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  const fetchUnpublishedChanges = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/${param.owner}/${param.repo}/${param.branch}/unsave`);
      const jsonResponse = await res.json();
      setNumberOfUnsavedChanges(jsonResponse?.data?.unsavedChanges);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }, [param]);

  const publishChanges = useCallback(async () => {
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
  }, [param]);

  useEffect(() => {
    if (param.owner && param.repo && param.branch)
      fetchUnpublishedChanges()
  }, [param, fetchUnpublishedChanges])

  return (
    <UnpublishedChangesContext.Provider
      value={{
        numberOfUnsavedChanges,
        isLoading,
        isPublishing,
        fetchUnpublishedChanges,
        publishChanges,
      }}
    >
      {children}
    </UnpublishedChangesContext.Provider>
  );
}

export function useUnpublishedChanges() {
  const context = useContext(UnpublishedChangesContext);
  if (context === undefined) {
    throw new Error('useUnpublishedChanges must be used within a UnpublishedChangesProvider');
  }
  return context;
}