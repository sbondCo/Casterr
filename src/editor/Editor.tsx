import Button from "@/common/Button";
import Slider from "@/common/Slider";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function VideoEditor() {
  const location = useLocation();
  const videoPath = location.state;

  if (!videoPath) console.error("TODO: No Video Path in state, return to home or show error");

  const [volume, setVolume] = useState<number>(0.8);

  return (
    <div>
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
