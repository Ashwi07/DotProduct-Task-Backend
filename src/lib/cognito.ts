import { createHmac } from "crypto";
import config from "../config/config";

//cognito setups
// calculate secret hash
export async function calculateSecretHash(username: string): Promise<string> {
  const message = username + config.userPool.ClientId;
  const hash = createHmac("sha256", config.clientSecret)
    .update(message)
    .digest("base64");
  return hash;
}
