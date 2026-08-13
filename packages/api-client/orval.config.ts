import { defineConfig } from "orval";

export default defineConfig({
  bogaap: {
    input: {
      target: "../../apps/api/openapi.json"
    },
    output: {
      mode: "single",
      target: "src/generated/bogaap-api.ts",
      client: "fetch",
      prettier: true,
      clean: false,
      override: {
        mutator: {
          path: "./src/fetch-client.ts",
          name: "bogaapFetch"
        }
      }
    }
  }
});
