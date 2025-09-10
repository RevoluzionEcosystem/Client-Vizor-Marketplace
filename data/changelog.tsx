// Changelog data structure
export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  description: string;
  commitHash?: string; 
  changes: {
    type: "feature" | "improvement" | "bugfix" | "security" | "other";
    description: string;
  }[];
}

// Organized by version, latest first
export const changelogData: ChangelogEntry[] = [
  {
    version: "1.0.001",
    date: "2025-05-20",
    title: "Initial Commit",
    description:
      "Optimized package dependencies, removed unnecessary packages, and added essential development tools for code quality and performance.",
    commitHash: "",
    changes: [
      {
        type: "improvement",
        description: "Added sharp for image optimization"
      },
      {
        type: "improvement",
        description: "Added lodash for utility functions"
      },
      {
        type: "improvement",
        description: "Added ESLint and Prettier for code quality"
      },
      {
        type: "other",
        description: "Migrated previous data from previous dapp to current V3 dapp"
      },
    ]
  },
];
