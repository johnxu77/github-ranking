/* eslint-disable @typescript-eslint/naming-convention */
import { Octokit } from 'octokit';

const octokit = new Octokit({
  auth: process.env.REACT_APP_GITHUB_ACCESS_TOKEN,
});

export interface Repo {
  id: string;
  rank: number;
  name: string;
  url: string;
  owner: {
    avatarUrl: string;
    url: string;
  };
  stars: number;
  forks: number;
  description: string;
  language: string;
}

export const getTopReposAsync = async (
  category: string,
  language: string
): Promise<Repo[]> => {
  // TODO: Data would be unstable if we filter stars with a small number
  let q = `${category}:>100`;

  if (language.trim() !== '') {
    q += ` language:${language}`;
  }

  const res = await octokit.request('GET /search/repositories{?q}', {
    q,
    sort: category,
    per_page: 10,
  });

  if (res.status !== 200) {
    return [];
  }

  return res.data.items.map((repo: any, index: number) => {
    const {
      id,
      name,
      html_url,
      owner,
      stargazers_count,
      forks,
      description,
      language,
    } = repo;

    return {
      id,
      rank: index + 1,
      name,
      url: html_url,
      owner: {
        avatarUrl: owner.avatar_url,
        url: owner.html_url,
      },
      stars: stargazers_count,
      forks,
      description,
      language,
    };
  });
};
