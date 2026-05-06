declare namespace NodeJS {
  interface ProcessEnv {
    TOKEN: string;
    DATABASE_URL: string;
    GUILD: string;
    APP_ID: string;
  }
}