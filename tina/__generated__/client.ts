import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ cacheDir: 'C:/ai/AbleCare/tina/__generated__/.cache/1779963289707', url: 'http://localhost:4001/graphql', token: 'undefined', queries,  });
export default client;
  