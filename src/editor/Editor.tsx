import Button from "@/common/Button";
import Slider from "@/common/Slider";
import TextBox from "@/common/TextBox";
import PathHelper from "@/libs/helpers/pathHelper";
import { useEffect, useState, useTransition } from "react";
import { useLocation } from "react-router-dom";

export default function VideoEditor() {
  const location = useLocation();
  const videoPath = location.state as string;

  if (!videoPath) console.error("TODO: No Video Path in state, return to home or show error");

  const [isPending, startTransition] = useTransition();
  const [videoExists, setVideoExists] = useState<"exists" | "notexists" | "checking">("checking");
  const [volume, setVolume] = useState<number>(0.8);

  useEffect(() => {
    PathHelper.exists(videoPath).then((v) => {
      console.log("exists?", v);
      setTimeout(() => {
        if (!v) setVideoExists("notexists");
      }, 2000);
    });
  });

  if (videoExists === "checking") return null;

  if (videoExists === "exists") return <div>video doesnt exist</div>;

  return (
    <div className="flex flex-col">
      <div className="flex gap-1.5 m-1.5">
        <Button icon="arrow" iconDirection="left" />
        <TextBox value="" placeholder="name" className="w-full" onChange={() => {}} />
        <Button icon="close" />
      </div>

      <video src={"secfile://" + videoPath}></video>

      <div className="flex gap-5 m-5">
        <Button text="im a boutin" />
        <Button icon="play" onClick={() => console.log("this logs also we play now 4 u")} />
        <Button icon="play" text="I disable" disabled={true} onClick={() => console.log("this wont log")} />
        <Button
          icon="volumeMax"
          slider={{
            value: volume,
            min: 0,
            max: 1,
            step: 0.01,
            onChange: (ev) => {
              setVolume(Number(ev.target.value));
            }
          }}
        />
      </div>
    </div>
  );
}
