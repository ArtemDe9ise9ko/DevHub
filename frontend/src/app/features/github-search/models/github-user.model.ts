export interface GitHubUser {
  readonly username: string;
  readonly name: string | null;
  readonly avatarUrl: string;
  readonly bio: string | null;
  readonly company: string | null;
  readonly location: string | null;
  readonly blog: string | null;
  readonly twitterUsername: string | null;
  readonly publicRepos: number;
  readonly followers: number;
  readonly following: number;
  readonly profileUrl: string;
  readonly createdAt: string;
}
