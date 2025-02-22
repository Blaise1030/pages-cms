import {useEditorMaybe} from "@grapesjs/react";
import {
  Paintbrush,
  Layers,
  Box,
  Eye,
  Grid,
  Redo,
  Save,
  Undo,
  FolderTree,
  Plus,
  Edit,
  Trash,
} from "lucide-react";
import {useState, useEffect} from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../ui/tabs";
import {ScrollArea} from "../ui/scroll-area";
import {Button} from "../ui/button";
import {Editor, Page} from "grapesjs";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";
import {Input} from "../ui/input";
import {Textarea} from "../ui/textarea";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

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

const pageFormSchema = z.object({
  name: z.string().min(1, "Page name is required"),
  slug: z
    .string()
    .min(1, "URL slug is required")
    .startsWith("/", "Slug must start with /"),
  seoTitle: z.string(),
  seoDescription: z.string(),
  seoKeywords: z.string(),
});

type PageFormValues = z.infer<typeof pageFormSchema>;

type PageFormProps = {
  onSubmit: (data: PageFormValues) => void;
  defaultValues?: PageFormValues;
  submitLabel?: string;
};

function PageForm({
  onSubmit,
  defaultValues,
  submitLabel = "Update Page",
  onDelete,
  showDelete = false,
}: PageFormProps & {
  onDelete?: () => void;
  showDelete?: boolean;
}) {
  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageFormSchema),
    defaultValues: defaultValues || {
      name: "",
      slug: "/",
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({field}) => (
            <FormItem>
              <FormLabel>Page Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter page name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({field}) => (
            <FormItem>
              <FormLabel>URL Slug</FormLabel>
              <FormControl>
                <Input placeholder="/page-url" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="seoTitle"
          render={({field}) => (
            <FormItem>
              <FormLabel>SEO Title</FormLabel>
              <FormControl>
                <Input placeholder="SEO title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="seoDescription"
          render={({field}) => (
            <FormItem>
              <FormLabel>SEO Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter SEO description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="seoKeywords"
          render={({field}) => (
            <FormItem>
              <FormLabel>SEO Keywords</FormLabel>
              <FormControl>
                <Input placeholder="keyword1, keyword2, keyword3" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button type="submit" className="flex-1">
            {submitLabel}
          </Button>
          {showDelete && (
            <Button
              type="button"
              size={"icon"}
              variant="destructive"
              onClick={onDelete}
            >
              <Trash className="size-4" />
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}

function Pages() {
  const editor = useEditorMaybe() as Editor;
  const [pages, setPages] = useState<Page[]>([]);

  useEffect(() => {
    if (editor) {
      setPages(editor.Pages.getAll());
      editor.on("page", () => {
        setPages(editor.Pages.getAll());
      });
    }
  }, [editor]);

  const handleSelectPage = (pageId: string) => {
    const page = editor?.Pages.get(pageId);
    if (page) {
      editor.Pages.select(page);
    }
  };

  const handleDeletePage = (pageId: string) => {
    const page = editor?.Pages.get(pageId);
    if (page && editor?.Pages.getAll().length > 1) {
      editor.Pages.remove(page);
    }
  };

  const updatePageEntry = (page: Page, data: PageFormValues) => {
    page.setName(data.name);
    page.attributes = {
      ...page.attributes,
      customAttributes: {
        slug: data.slug,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        seoKeywords: data.seoKeywords,
      },
    };
  };

  const onSubmit = (data: PageFormValues) => {
    const newPage = editor?.Pages.add({
      name: data.name,
      component: "<div>New Page</div>",
      customAttributes: {
        slug: data.slug,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        seoKeywords: data.seoKeywords,
      },
    });
  };

  return (
    <ScrollArea className="h-full">
      <div className="">
        <div className="flex items-center justify-between p-0.5">
          <Popover>
            <Button size="xs" variant="outline" asChild className="w-full">
              <PopoverTrigger>
                <Plus className="size-4 me-2" />
                New page
              </PopoverTrigger>
            </Button>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Add Page</h4>
                <PageForm onSubmit={(data) => onSubmit(data)} />
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-0">
          {pages.map((page) => (
            <div
              key={page.getId()}
              className={`flex items-center justify-between py-0.5 ps-3 pe-2 text-sm cursor-pointer hover:bg-accent ${
                page.getId() === editor?.Pages.getSelected()?.getId()
                  ? "bg-accent"
                  : ""
              }`}
            >
              <span
                onClick={() => handleSelectPage(page.getId())}
                className="flex-1"
              >
                {page.getName()?.length > 0 ? page.getName() : "Main"}
              </span>
              <Popover>
                <Button size="icon-xxs" variant="outline" asChild>
                  <PopoverTrigger>
                    <Edit className="size-4" />
                  </PopoverTrigger>
                </Button>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h4 className="font-medium">Edit Page</h4>
                    <PageForm
                      onSubmit={(data) => updatePageEntry(page, data)}
                      onDelete={() => handleDeletePage(page.getId())}
                      showDelete={pages.length > 1}
                      defaultValues={(() => {
                        const attributes = page?.attributes
                          ?.customAttributes as {
                          seoDescription: string;
                          seoKeywords: string;
                          seoTitle: string;
                          slug: string;
                        };
                        return {
                          name: page?.getName() ?? "",
                          slug: attributes?.slug ?? "/",
                          seoTitle: attributes?.seoTitle ?? "",
                          seoDescription: attributes?.seoDescription ?? "",
                          seoKeywords: attributes?.seoKeywords ?? "",
                        };
                      })()}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}

export function Sidebar() {
  const editor = useEditorMaybe();
  const [tabs, setTabs] = useState<string>("1");

  return (
    <div className="w-[280px] h-dvh border-s overflow-auto relative">
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
            </TabsTrigger>
            <TabsTrigger value="2" className="w-full">
              <Box className="size-4 me-1" />
            </TabsTrigger>
            <TabsTrigger value="3" className="w-full">
              <Layers className="size-4 me-1" />
            </TabsTrigger>
            <TabsTrigger value="4" className="w-full">
              <FolderTree className="size-4 me-1" />
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="h-[calc(100dvh-61px)]">
          <TabsContent
            value="1"
            forceMount
            className={`${tabs === "1" ? "visible" : "hidden"} mt-0 h-full`}
          >
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
          </TabsContent>
          <TabsContent
            value="2"
            forceMount
            className={`${tabs === "2" ? "visible" : "hidden"} mt-0 h-full`}
          >
            <ScrollArea className="h-full">
              <div id="blocks" />
            </ScrollArea>
          </TabsContent>
          <TabsContent
            value="3"
            forceMount
            className={`${tabs === "3" ? "visible" : "hidden"} mt-0 h-full`}
          >
            <ScrollArea className="h-full">
              <div id="layers" />
            </ScrollArea>
          </TabsContent>
          <TabsContent
            value="4"
            forceMount
            className={`${tabs === "4" ? "visible" : "hidden"} mt-0 h-full`}
          >
            <Pages />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
