// src/app/api/users/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Missing query parameter" }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.github.com/search/users?q=${query}&per_page=5`, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "GitHub API error" }, { status: response.status });
    }

    const data = await response.json();
    const users = data.items.map((user: any) => ({
      login: user.login,
      avatar_url: user.avatar_url,
      html_url: user.html_url,
      id: user.id,
    }));

    return NextResponse.json({ users });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
