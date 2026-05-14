import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ cacheDir: 'C:/Users/matty/AbleCare/AbleCare-Repo/tina/__generated__/.cache/1778754663237', url: 'http://localhost:4001/graphql', token: 'undefined', queries,  });
export default client;
  