export interface RepositoryDetails {
  readonly id: number;
  readonly name: string;
  readonly fullName: string;
  readonly description: string | null;
  readonly private: boolean;
  readonly fork: boolean;
  readonly language: string | null;
  readonly stars: number;
  readonly forks: number;
  readonly openIssues: number;
  readonly watchers: number;
  readonly defaultBranch: string;
  readonly repositoryUrl: string;
  readonly cloneUrl: string;
  readonly sshUrl: string;
  readonly homepage: string | null;
  readonly licenseName: string | null;
  readonly topics: readonly string[];
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly pushedAt: string;
  readonly ownerUsername: string;
  readonly ownerAvatarUrl: string;
}
