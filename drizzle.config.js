/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://ai-interview-mocker_owner:n7yaIjwsHBr3@ep-purple-queen-a5rurekc.us-east-2.aws.neon.tech/ai-interview-mocker?sslmode=require',
    }
  };