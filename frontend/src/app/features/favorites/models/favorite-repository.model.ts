export interface FavoriteRepository {
  readonly id: string;
  readonly repositoryId: number;
  readonly name: string;
  readonly fullName: string;
  readonly description: string | null;
  readonly language: string | null;
  readonly stars: number;
  readonly forks: number;
  readonly openIssues: number;
  readonly repositoryUrl: string;
  readonly ownerUsername: string;
  readonly ownerAvatarUrl: string;
  readonly createdAt: string;
}
