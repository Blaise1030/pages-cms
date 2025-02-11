import { createOctokitInstance } from "@/lib/utils/octokit";
import { getAuth } from "@/lib/auth";
import { getToken } from "@/lib/token";

export async function GET(
  request: Request,
  { params }: { params: { owner: string; repo: string; branch: string } }
) {
  try {
    const { user, session } = await getAuth();
    if (!session) return new Response(null, { status: 401 });

    const token = await getToken(user, params.owner, params.repo);
    if (!token) throw new Error("Token not found");

    const octokit = createOctokitInstance(token);

    const { data: tags } = await octokit.rest.repos.listTags({
      owner: params.owner,
      repo: params.repo,
      page: 0,
      per_page: 1,
    });

    const item = tags[0]?.name

    if (!item) {
      const { data: commits } = await octokit.rest.repos.listCommits({
        owner: params.owner,
        repo: params.repo,
        sha: params.branch
      });
      return Response.json({
        status: "success",
        data: { unsavedChanges: commits.length },
      });
    }

    const { data: compareData } = await octokit.rest.repos.compareCommits({
      owner: params.owner,
      repo: params.repo,
      base: item,
      head: params.branch
    });


    return Response.json({
      status: "success",
      data: { unsavedChanges: compareData?.ahead_by },
    });
  } catch (error: any) {
    console.error(error);
    return Response.json({
      status: "error",
      message: error.message,
    });
  }
}