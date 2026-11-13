interface ImportMetaEnv {
  /** "owner/repo". When set, Keystatic stores content in GitHub instead of local files. */
  readonly PUBLIC_KEYSTATIC_GITHUB_REPO?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
