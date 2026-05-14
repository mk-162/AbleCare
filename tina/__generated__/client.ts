import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ url: 'http://localhost:3001/graphql', token: 'dbf4c8db5f424d68b1abc0fa344d3c415740798e', queries,  });
export default client;
  