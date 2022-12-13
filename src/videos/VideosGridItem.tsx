import Icon from "@/common/Icon";
import { toReadableFileSize, toReadableTimeFromSeconds } from "@/libs/helpers/extensions/number";
import PathHelper from "@/libs/helpers/pathHelper";
import { useEffect, useState } from "react";
import { Video } from "./types";

export default function VideosGridItem({ video }: { video: Video }) {
  const { name, duration, fileSize, fps, thumbPath } = video;
  const [img, setImg] = useState<string>();

  useEffect(() => {
    if (!thumbPath) return;
    PathHelper.exists(thumbPath)
      .then((exists) => {
        if (exists) setImg(thumbPath);
      })
      .catch((e) => {
        console.error(`Unable to verify existence of thumbnail (${thumbPath}).`, e);
      });
  });

  return (
    <div className="h-full">
      {img && thumbPath ? (
        <img className="w-full h-full object-cover" src={`secfile://${thumbPath}`} alt="" />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-secondary-100 text-2xl">
          No Thumbnail Found
        </div>
      )}

      <div className="group-hover:opacity-100 opacity-0 absolute top-2/4 left-2/4 drop-shadow transition-opacity">
        <Icon i="edit" />
      </div>

      <p className="absolute right-3 top-2 italic font-bold [text_shadow:_1px_1px_black]">{fps} FPS</p>

      <div className="flex gap-2 items-center absolute bottom-0 w-full px-3 py-2 bg-quaternary-100/60">
        <span className="font-bold flex-1 overflow-hidden whitespace-nowrap text-ellipsis" title={name}>
          {name}
        </span>
        <span className="ml-auto text-sm">{duration ? toReadableTimeFromSeconds(duration) : ""}</span>
        <span className="text-sm">{fileSize ? toReadableFileSize(fileSize) : ""}</span>
      </div>
    </div>
  );
}
