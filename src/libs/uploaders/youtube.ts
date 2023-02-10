import { shell } from "electron";
import { type AddressInfo } from "net";
import axios from "axios";
import crypto from "crypto";
import { store } from "@/app/store";
import { youtubeConnected, youtubeDisconnected, youtubeUserFetched } from "./uploadersSlice";
import Notifications from "../helpers/notifications";
import { logger } from "../logger";
import fs from "fs";
import http from "http";
import type { Video } from "@/videos/types";

// Should be able to split most of this out to a helper method if we use oauth to connect to other services too.

const OAUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
// youtube.upload for uploading
// youtube.readonly for getting the channel name, so we can display which account is connected
const OAUTH_SCOPE = "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly";
const OAUTH_CLIENT_ID = "";
const OAUTH_CLIENT_SECRET = "";

export default async function connect() {
  const popupId = "CONNECTYOUTUBE";
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
              const aResData = aRes.data;
              store.dispatch(
                youtubeConnected({
                  access_token: aResData.access_token,
                  expires: Date.now() + aResData.expires_in * 1000,
                  refresh_token: aResData.refresh_token,
                  scope: aResData.scope
                })
              );
              // get username
              const uRes = await axios.get("https://youtube.googleapis.com/youtube/v3/channels", {
                params: {
                  part: "snippet",
                  fields: "items(snippet.title)",
                  mine: true
                },
                headers: {
                  Authorization: `Bearer ${aResData.access_token as string}`
                }
              });
              store.dispatch(youtubeUserFetched(uRes.data?.items[0]?.snippet?.title));
              console.log(uRes);
            } else {
              console.error("No data returned in exchange request for auth token!");
            }
            Notifications.rmPopup(popupId);
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

  Notifications.popup({
    id: popupId,
    title: "Waiting for YouTube Authorization",
    loader: true,
    showCancel: true
  })
    .then(async (popup) => {
      if (popup.action === "cancel") {
        logger.error("CONNECT-YT", "Cancelled by user, closing server.");
        Notifications.rmPopup(popupId);
        server.close();
      }
    })
    .catch((e) => {
      logger.error("CONNECT-YT", `Failed to update ${popupId} popup with progress.`, e);
    });

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

export async function disconnect() {
  const ytState = store.getState().uploaders.youtube;
  if (ytState) {
    if (ytState.access_token) {
      axios.post(`https://oauth2.googleapis.com/revoke?token=${ytState.access_token}`).catch((err) => {
        logger.error("CONNECT-YT", "Failed to revoke youtube access token.", err);
      });
    }
    store.dispatch(youtubeDisconnected());
  } else {
    logger.info("CONNECT-YT", "disconnect called, but state doesn't include youtube.. ignoring");
  }
}

export async function upload(video: Video) {
  const token = await getAccessToken();
  if (token) {
    const performUpload = (location: string) => {
      axios
        .put(
          location,
          // fs.createReadStream(video.videoPath),
          fs.readFileSync(video.videoPath),
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "video/*",
              "Content-Length": video.fileSize
            }
          }
        )
        .catch((err) => {
          console.error("YouTube upload request failed:", err);
        });
    };

    const resumableUriReq = await axios
      .post(
        "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
        {
          snippet: { title: "I came from Casterr", description: "i am a description... i think??" },
          status: { privacyStatus: "private" }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json; charset=UTF-8",
            "X-Upload-Content-Length": video.fileSize,
            "X-Upload-Content-Type": "video/*"
          }
        }
      )
      .catch((err) => {
        console.error("YouTube resumable upload request failed:", err);
      });
    console.log(resumableUriReq);
    if (resumableUriReq?.headers) {
      const location = resumableUriReq.headers.location;
      if (location) {
        console.log("LOCATION", location);
        performUpload(location);
      }
    }
  } else {
    console.error("No token");
  }
}

async function getAccessToken(): Promise<string | undefined> {
  const uploader = store.getState().uploaders.youtube;
  if (uploader) {
    if (uploader.expires <= Date.now() - 60000) {
      logger.info("OAUTH", "Token expiring soon or expired, refreshing...");
      const params = new URLSearchParams();
      params.append("client_id", OAUTH_CLIENT_ID);
      params.append("client_secret", OAUTH_CLIENT_SECRET);
      params.append("grant_type", "refresh_token");
      params.append("refresh_token", uploader.refresh_token);
      const refreshRes = await axios.post(`https://oauth2.googleapis.com/token`, params).catch((err) => {
        logger.error("CONNECT-YT", "Failed to refresh youtube access token.", err);
      });
      if (refreshRes?.data) {
        const newToken = refreshRes.data;
        store.dispatch(
          youtubeConnected({
            access_token: newToken.access_token,
            expires: Date.now() + newToken.expires_in * 1000,
            refresh_token: newToken.refresh_token,
            scope: newToken.scope
          })
        );
        return newToken.access_token as string;
      }
    } else {
      return uploader.access_token;
    }
  } else {
    logger.error("CONNECT-YT", "Cant refresh token, without a token to refresh!");
    return undefined;
  }
}
