'use client'

import grapesjs, { Editor } from 'grapesjs';
import GjsEditor from '@grapesjs/react';
import plugin from "grapesjs-blocks-basic"
// @ts-ignore
import tailwind from "grapesjs-tailwind"
// @ts-ignore
import gtm from "grapesjs-ga"

export function PageEditor() {
  const onEditor = (editor: Editor) => {
    console.log('Editor loaded', { editor });
  };

  return (
    <div>
      <GjsEditor
        grapesjs={grapesjs}
        grapesjsCss="/css/grapesjs.css"
        plugins={[plugin, tailwind, gtm]}
        options={{
          height: '100vh',
          storageManager: false,
        }}
        onEditor={onEditor}
      />
    </div>

  );
}