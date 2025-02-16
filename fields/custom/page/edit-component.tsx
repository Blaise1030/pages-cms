'use client'

import { forwardRef, useEffect, useState } from "react";
import grapesjs, { Editor, Frame } from 'grapesjs';
import plugin from "grapesjs-blocks-basic";
import GjsEditor from '@grapesjs/react';
// @ts-ignore
import gtm from "grapesjs-ga"
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

const EditComponent = forwardRef((props: any, ref) => {
  const [open, setIsOpen] = useState(false);
  const [editor, setEditor] = useState<Editor>()

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open])

  const onEditor = (editor: Editor) => {
    setEditor(editor)
    if (props.value.length > 0) {
      editor.loadProjectData(JSON.parse(props.value ?? "{}")?.projectData ?? {});
    }
    editor.Canvas.getModel()['on']('change:frames', (m, frames) => {
      frames.forEach((frame: Frame) => frame.once('loaded', () => {
        const cssStyle = document.createElement('style');
        cssStyle.setAttribute('type', 'text/tailwindcss');
        cssStyle.innerHTML = '@theme { --color-clifford: red; }'
        frame.view?.getEl().contentDocument?.head.appendChild(cssStyle)
      }));
    });
  };

  const onConfirm = (editor: Editor) => {
    props.onChange(JSON.stringify({
      projectData: editor.getProjectData(),
      html: editor.getHtml(),
      css: editor.getCss(),
    }))
    setIsOpen(false)
  }


  return <div onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}>
    <Button type="button" variant={'secondary'} size={'sm'} onClick={() => setIsOpen(true)}>
      Open in visual editor
    </Button>
    {
      open && <div className="fixed top-0 left-0 z-50 w-full h-full">
        <div className="bg-background h-9 flex items-center justify-between">
          <p className="text-xl font-bold px-2">UI Editor</p>
          <div className="flex items-center">
            <Button
              className="gap-2" variant={'secondary'}
              onClick={() => setIsOpen(false)}
              disabled={!Boolean(editor)}
              type="button"
              size={'xs'}
            >
              Cancel
            </Button>
            <Button
              className="gap-2" variant={'default'}
              onClick={() => onConfirm(editor!)}
              disabled={!Boolean(editor)}
              type="button"
              size={'xs'}
            >
              <Save className="size-4" />
              Save
            </Button>
          </div>
        </div>
        <div className="h-[calc(100dvh-36px)]">
          <GjsEditor
            grapesjsCss="/css/grapesjs.css"
            plugins={[plugin, gtm]}
            defaultValue={props.value}
            className="border-t"
            grapesjs={grapesjs}
            onEditor={onEditor}
            options={{
              height: '100%',
              selectorManager: {},
              storageManager: false,
              canvas: {
                scripts: ['https://unpkg.com/@tailwindcss/browser@4', 'https://cdn.jsdelivr.net/npm/@tailwindcss/typography@0.5.16/src/index.min.js'],
              }
            }}
          />
        </div>
      </div>
    }
  </div>
})

EditComponent.displayName = "EditComponent"

export { EditComponent }