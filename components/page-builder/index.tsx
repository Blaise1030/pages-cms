'use client'

import grapesjs, { Editor, ProjectData } from 'grapesjs';
import GjsEditor from '@grapesjs/react';
import plugin from "grapesjs-blocks-basic"
// @ts-ignore
import tailwind from "grapesjs-tailwind"
// @ts-ignore
import gtm from "grapesjs-ga"
import { client } from '@/lib/rpc';
import { useParams } from 'next/navigation';

const sessionStoragePlugin = (editor: Editor) => {
  editor.Storage.add('session', {
    async load({ owner, repo, branch }: { owner: string, repo: string, branch: string }) {
      const res = await client.api.v2.page[':owner'][':repo'][':branch'].$get({ param: { owner, repo, branch } })
      const results = await res.json() as { data: ProjectData }
      return results!.data
    },
    async store(data: ProjectData, { owner, repo, branch }: { owner: string, repo: string, branch: string }) {
      const res = await client.api.v2.page[':owner'][':repo'][':branch'].$post({
        param: { owner, repo, branch },
        json: { projectData: data }
      })
      return data;
    }
  });
};

export function PageEditor() {
  const params = useParams()
  const { owner, repo, branch } = params as { owner: string, repo: string, branch: string }
  const onEditor = async (editor: Editor) => {
    //   const res = await client.api.v2.page[':owner'][':repo'][':branch'].$get({ param: { owner, repo, branch } })
    //   const results = await res.json() as { data: ProjectData }
    //   editor.loadProjectData(results!.data)
  };

  return (
    <div>
      <GjsEditor
        grapesjs={grapesjs}
        grapesjsCss="/css/grapesjs.css"
        plugins={[plugin, tailwind, gtm, sessionStoragePlugin]}
        onEditor={onEditor}
        options={{
          height: '100vh',
          storageManager: {
            type: 'session',
            stepsBeforeSave: 3,
            options: {
              session: { owner, repo, branch }
            }
          }
        }}
      />
    </div>

  );
}