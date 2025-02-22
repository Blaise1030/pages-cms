"use client";

import grapesjs, {Editor, ProjectData} from "grapesjs";
import GjsEditor, {Canvas, useEditorMaybe} from "@grapesjs/react";
import plugin from "grapesjs-blocks-basic";
// @ts-ignore
import tailwind from "grapesjs-tailwind";
// @ts-ignore
import gtm from "grapesjs-ga";
import {client} from "@/lib/rpc";
import {useParams} from "next/navigation";
import {Button} from "../ui/button";
import {
  Box,
  Eye,
  Grid,
  Layers,
  Layers2,
  Paintbrush,
  Plus,
  Redo,
  Save,
  Undo,
} from "lucide-react";
import {Tabs, TabsList, TabsTrigger, TabsContent} from "../ui/tabs";
import {useEffect, useState} from "react";
import {ScrollArea} from "../ui/scroll-area";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import {Sidebar} from "./sidebar";

const sessionStoragePlugin = (editor: Editor) => {
  editor.Storage.add("session", {
    async load({
      owner,
      repo,
      branch,
    }: {
      owner: string;
      repo: string;
      branch: string;
    }) {
      const res = await client.api.v2.page[":owner"][":repo"][":branch"].$get({
        param: {owner, repo, branch},
      });
      const results = (await res.json()) as {data: ProjectData};
      return results!.data;
    },
    async store(
      data: ProjectData,
      {owner, repo, branch}: {owner: string; repo: string; branch: string}
    ) {
      await client.api.v2.page[":owner"][":repo"][":branch"].$post({
        param: {owner, repo, branch},
        json: {projectData: data},
      });
      return data;
    },
  });
};

export function PageEditor() {
  const params = useParams();
  const {owner, repo, branch} = params as {
    owner: string;
    repo: string;
    branch: string;
  };
  const [editor, setEditor] = useState<Editor | null>(null);
  const onEditor = async (editor: Editor) => {
    setEditor(editor);
    editor.Pages.add({
      name: 'index',
      component: '<div>New Page</div>',
    });
  };

  return (
    <div className="flex">
      <GjsEditor
        grapesjs={grapesjs}
        grapesjsCss="/css/grapesjs.css"
        plugins={[plugin, tailwind, gtm, sessionStoragePlugin]}
        onEditor={onEditor}
        className="flex"
        options={{
          height: "100vh",
          selectorManager: {
            appendTo: "#selector",
          },
          undoManager: {
            maximumStackLength: 100,
          },
          layerManager: {
            appendTo: "#layers",
          },
          styleManager: {
            appendTo: "#styles",
          },
          traitManager: {
            appendTo: "#traits",
          },
          pageManager: {
            appendTo: "#pages",
          },
          blockManager: {
            appendTo: "#blocks",
          },
          panels: {defaults: []},
          storageManager: {
            type: "session",
            stepsBeforeSave: 3,
            options: {
              session: {owner, repo, branch},
            },
          },
        }}
      >
        <Canvas />
        <Sidebar />
      </GjsEditor>
    </div>
  );
}
