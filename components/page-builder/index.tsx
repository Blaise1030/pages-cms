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
    //   const res = await client.api.v2.page[':owner'][':repo'][':branch'].$get({ param: { owner, repo, branch } })
    //   const results = await res.json() as { data: ProjectData }
    //   editor.loadProjectData(results!.data)
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
            appendTo: "#page",
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

function SidebarHeader() {
  const editor = useEditorMaybe();
  return (
    <div className="flex items-center w-full justify-between border-b">
      <div className="flex">
        <Button
          size={"icon-xxs"}
          variant={"secondary"}
          className="size-7"
          onClick={() => editor?.UndoManager.undo()}
        >
          <Undo className="size-4" />
        </Button>
        <Button
          size={"icon-xxs"}
          variant={"secondary"}
          className="size-7"
          onClick={() => editor?.UndoManager.redo()}
        >
          <Redo className="size-4" />
        </Button>
      </div>
      <Button
        variant={"secondary"}
        className="size-7"
        size={"icon-xxs"}
        onClick={() =>
          editor?.Commands.isActive("core:component-outline")
            ? editor?.stopCommand("core:component-outline")
            : editor?.runCommand("core:component-outline")
        }
      >
        <Grid className="size-4" />
      </Button>
      <div className="flex">
        <Button
          size={"xxs"}
          variant={"secondary"}
          onClick={() => {
            editor?.Commands.isActive("core:preview")
              ? editor?.stopCommand("core:preview")
              : editor?.runCommand("core:preview");
          }}
        >
          <Eye className="size-4 mr-1" />
          Preview
        </Button>
        <Button size={"xxs"}>
          <Save className="size-4 mr-1" />
          Save
        </Button>
      </div>
    </div>
  );
}

function Sidebar() {
  const editor = useEditorMaybe();
  const [tabs, setTabs] = useState<string>("1");

  useEffect(() => {}, []);

  return (
    <div className="w-[300px] h-dvh border-s overflow-auto relative">
      <Tabs
        defaultValue="1"
        onValueChange={setTabs}
        value={tabs}
        className="h-full"
      >
        <div className="top-0 sticky bg-card z-50">
          <SidebarHeader />
          <TabsList className="w-full p-0 h-auto">
            <TabsTrigger value="1" className="w-full">
              <Paintbrush className="size-4 me-1" />
              Styles
            </TabsTrigger>
            <TabsTrigger value="2" className="w-full">
              <Box className="size-4 me-1" />
              Blocks
            </TabsTrigger>
            <TabsTrigger value="3" className="w-full">
              <Layers className="size-4 me-1" />
              Pages
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent
          value="1"
          forceMount
          className={`${
            tabs === "1" ? "visible" : "hidden"
          } mt-0 h-[calc(100dvh-61px)]`}
        >
          <ResizablePanelGroup direction={"vertical"} className="h-full">
            <ResizablePanel className="h-full">
              <ScrollArea className="h-full">
                <div id="selector" />
                <div id="styles" />
                <details className="[&_svg]:open:rotate-0 [&_svg]:-rotate-90 ">
                  <summary className="p-2 font-semibold [list-style-type:none] flex gap-1 items-center cursor-pointer select-none px-[20px] bg-muted text-muted-foreground">
                    <svg viewBox="0 0 24 24" className="size-4">
                      <path fill="currentColor" d="M7,10L12,15L17,10H7Z"></path>
                    </svg>
                    Component attributes
                  </summary>
                  <div id="traits" className="text-sm" />
                </details>
              </ScrollArea>
            </ResizablePanel>
            <ResizableHandle withHandle className="z-50" />
            <ResizablePanel className="h-full min-h-10">
              <ScrollArea className="h-full relative">
                <div className="flex py-2 px-4 sticky top-0 left-0 z-40 bg-background items-center font-medium text-sm text-muted-foreground">
                  <Layers2 className="size-4 me-2" /> Layers
                </div>
                <div id="layers" />
              </ScrollArea>
            </ResizablePanel>
          </ResizablePanelGroup>
        </TabsContent>
        <TabsContent
          value="2"
          forceMount
          className={`${tabs === "2" ? "visible" : "hidden"} mt-0`}
        >
          <ScrollArea>
            <div id="blocks" />
          </ScrollArea>
        </TabsContent>
        <TabsContent
          value="3"
          forceMount
          className={`${tabs === "3" ? "visible" : "hidden"} mt-0`}
        >
          <ScrollArea>
            <div id="layers" />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
