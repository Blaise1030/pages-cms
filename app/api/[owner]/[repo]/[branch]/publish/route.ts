import { createOctokitInstance } from "@/lib/utils/octokit";
import { getAuth } from "@/lib/auth";
import { getToken } from "@/lib/token";

export async function POST(
  request: Request,
  { params }: { params: { owner: string, repo: string, branch: string } }
) {
  try {
    const { user, session } = await getAuth();
    if (!session) return new Response(null, { status: 401 });

    const token = await getToken(user, params.owner, params.repo);
    if (!token) throw new Error("Token not found");

    const octokit = createOctokitInstance(token);

    // Get the SHA of the current branch
    const { data: refData } = await octokit.rest.git.getRef({
      owner: params.owner,
      repo: params.repo,
      ref: `heads/${params.branch}`,
    });
    const sha = refData.object.sha;

    // Format the tag name with timestamp
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
    const tagName = `${formattedDate}-${user?.id}`;

    // Create a new tag with the current branch's SHA
    const response = await octokit.rest.git.createRef({
      owner: params.owner,
      repo: params.repo,
      ref: `refs/tags/${tagName}`,
      sha,
    });

    return Response.json({
      status: "success",
      message: `Tag "${tagName}" created successfully from branch "${params.branch}".`,
      data: response.data,
    });
  } catch (error: any) {
    console.error(error);
    return Response.json({
      status: "error",
      message: error.message,
    });
  }
}