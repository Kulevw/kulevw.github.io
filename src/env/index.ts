export interface IEnv {
  readonly REPO_NAME: string;
}

const mapEnv = (rawEnv: ImportMetaEnv): IEnv => {
  return {
    REPO_NAME: rawEnv.VITE_REPO_NAME,
  }
}

export const env = mapEnv(import.meta.env);
