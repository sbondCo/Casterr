import { shell } from "electron";
import http from "http";
import { type AddressInfo } from "net";
import axios from "axios";
import crypto from "crypto";
import { store } from "@/app/store";
import { youtubeConnected } from "./uploadersSlice";

// Should be able to split most of this out to a helper method if we use oauth to connect to other services too.

const OAUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const OAUTH_SCOPE = "https://www.googleapis.com/auth/youtube.upload";
const OAUTH_CLIENT_ID = "";
const OAUTH_CLIENT_SECRET = "";

export default async function connect() {
  const verifier = Buffer.from(crypto.randomBytes(32)).toString("base64url");
  const challenge = Buffer.from(crypto.createHash("sha256").update(verifier).digest()).toString("base64url");

  const server = http.createServer(async (req, res) => {
    if (req.method === "GET") {
      if (req.url && req.headers && req.headers.host) {
        console.log("serv");
        console.log(req.url);
        console.log("redirect_uri:", `http://${req.headers.host}`);
        const url = new URL(req.url, `http://${req.headers.host}`);
        const params = url.searchParams;
        console.log(params.get("code"), params.get("scope"));
        const authCode = params.get("code");
        if (authCode) {
          try {
            const params = new URLSearchParams();
            params.append("client_id", OAUTH_CLIENT_ID);
            params.append("client_secret", OAUTH_CLIENT_SECRET);
            params.append("code", authCode);
            params.append("code_verifier", verifier);
            params.append("grant_type", "authorization_code");
            params.append("redirect_uri", `http://${req.headers.host}`);
            const aRes = await axios.post("https://oauth2.googleapis.com/token", params);
            console.log(aRes);
            if (aRes?.data) {
              store.dispatch(youtubeConnected(aRes.data));
            } else {
              console.error("No data returned in exchange request for auth token!");
            }
          } catch (err) {
            console.error("Failed to exchange auth code for token:", err);
          }
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("<h1>You can close this tab now.</h1>");
        server.close();
      } else {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("No request headers.");
      }
    }
  });
  server.listen(0); // Listening on port 0, the OS should assign us to an available port.

  // Pretty sure .address() will always be of type AddressInfo in our use case
  const redirectUri = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  console.log(`Auth listener server started on: ${redirectUri}`);
  console.log(`Redirecting user to Google auth..`);

  await shell.openExternal(
    encodeURI(
      `${OAUTH_ENDPOINT}?client_id=${OAUTH_CLIENT_ID}&scope=${OAUTH_SCOPE}&redirect_uri=${redirectUri}&response_type=code&code_challenge_method=S256&code_challenge=${challenge}`
    )
  );
}
