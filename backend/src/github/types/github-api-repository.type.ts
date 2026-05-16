export type GitHubApiRepositoryOwner = {
  login: string;
  avatar_url: string;
};

export type GitHubApiRepositoryLicense = {
  name: string;
} | null;

export type GitHubApiRepository = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  fork: boolean;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  default_branch: string;
  html_url: string;
  clone_url: string;
  ssh_url: string;
  homepage: string | null;
  license: GitHubApiRepositoryLicense;
  topics?: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  owner: GitHubApiRepositoryOwner;
};
