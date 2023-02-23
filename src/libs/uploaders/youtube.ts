import { shell } from "electron";
import { type AddressInfo } from "net";
import axios from "axios";
import crypto from "crypto";
import { store } from "@/app/store";
import { youtubeConnected, youtubeDisconnected, youtubeTokenRefreshed, youtubeUserFetched } from "./uploadersSlice";
import Notifications from "../helpers/notifications";
import { logger } from "../logger";
import fs from "fs";
import http from "http";
import https from "https";
import type { Video } from "@/videos/types";
import PathHelper from "../helpers/pathHelper";
import { OAUTH_RETURN_HTML } from "./common";

// Should be able to split most of this out to a helper method if we use oauth to connect to other services too.

const OAUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
// youtube.upload for uploading
// youtube.readonly for getting the channel name, so we can display which account is connected
const OAUTH_SCOPE = "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly";
const OAUTH_CLIENT_ID = "288071942568-msuhjt27pm7hiq408ig1ipr9hdrr8g0o.apps.googleusercontent.com";
const OAUTH_CLIENT_SECRET = "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";

export default async function connect() {
  const popupId = "CONNECTYOUTUBE";
  const verifier = Buffer.from(crypto.randomBytes(32)).toString("base64url");
  const challenge = Buffer.from(crypto.createHash("sha256").update(verifier).digest()).toString("base64url");

  const server = http.createServer(async (req, res) => {
    if (req.method === "GET") {
      if (req.url && req.headers && req.headers.host) {
        logger.info("CONNECT-YT", "redirect_uri:", `http://${req.headers.host}`);
        const url = new URL(req.url, `http://${req.headers.host}`);
        const params = url.searchParams;
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
            } else {
              logger.error("CONNECT-YT", "No data returned in exchange request for auth token!");
            }
            Notifications.rmPopup(popupId);
          } catch (err) {
            logger.error("CONNECT-YT", "Failed to exchange auth code for token:", err);
          }
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(OAUTH_RETURN_HTML);
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
        server.close();
      }
    })
    .catch((e) => {
      logger.error("CONNECT-YT", `Failed to update ${popupId} popup with progress.`, e);
    });

  // Pretty sure .address() will always be of type AddressInfo in our use case
  const redirectUri = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  logger.info("CONNECT-YT", `Auth listener server started on: ${redirectUri}`);
  logger.info("CONNECT-YT", `Redirecting user to Google auth..`);

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
  const popupId = "YOUTUBE-UPLOAD";
  const token = await getAccessToken();
  if (token) {
    Notifications.popup({ id: popupId, title: "Initializing Upload", loader: true }).catch((err) => {
      logger.error(`POPUP ${popupId}`, err);
    });

    const performUpload = (location: string) => {
      // axios didnt work with read stream dont know why but not spending another 72.53 years on it
      const req = https.request(
        location,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "video/*",
            "Content-Length": video.fileSize
          }
        },
        (res) => {
          if (res.statusCode === 200) {
            let data = "";
            res.setEncoding("utf8");
            res.on("data", (chunk: string) => {
              data += chunk;
            });
            res.on("end", () => {
              logger.info("CONNECT-YT", JSON.parse(data));
            });
          }
        }
      );

      req.on("error", (e) => {
        logger.error("CONNECT-YT", `problem with upload request: ${e.message}`);
        Notifications.popup({
          id: popupId,
          title: "Failed To Upload Video",
          showCancel: true
        }).catch((err) => {
          logger.error(`POPUP ${popupId}`, err);
        });
      });

      // Write data to request body
      const rs = fs.createReadStream(video.videoPath);
      let bytesRead = 0;
      rs.pipe(req);
      rs.on("data", (data) => {
        bytesRead += data.length;
        Notifications.popup({
          id: popupId,
          title: "Uploading Video",
          loader: false,
          percentage: video.fileSize ? Number(((100.0 * bytesRead) / video.fileSize).toFixed(0)) : undefined
        }).catch((err) => {
          logger.error(`POPUP ${popupId}`, err);
        });
      });
      rs.on("end", () => {
        logger.info("CONNECT-YT", "ending request.. file reading done");
        req.end();
        Notifications.rmPopup(popupId);
      });
    };

    const resumableUriReq = await axios
      .post(
        "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
        {
          snippet: { title: PathHelper.fileNameNoExt(video.videoPath), description: "" },
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
        logger.error("CONNECT-YT", "YouTube resumable upload request failed:", err);
        Notifications.popup({
          id: popupId,
          title: "Failed To Initialize Upload",
          showCancel: true
        }).catch((err) => {
          logger.error(`POPUP ${popupId}`, err);
        });
      });
    if (resumableUriReq?.headers) {
      const location = resumableUriReq.headers.location;
      if (location) {
        performUpload(location);
      }
    }
  } else {
    logger.error("CONNECT-YT", "No token");
    Notifications.popup({
      id: popupId,
      title: "YouTube Token Not Found. Try Reconnecting.",
      showCancel: true
    }).catch((err) => {
      logger.error(`POPUP ${popupId}`, err);
    });
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
          youtubeTokenRefreshed({
            access_token: newToken.access_token,
            expires: Date.now() + newToken.expires_in * 1000,
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
