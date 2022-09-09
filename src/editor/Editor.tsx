import Button from "@/common/Button";
import { useLocation } from "react-router-dom";

export default function VideoEditor() {
  const location = useLocation();
  const videoPath = location.state;

  if (!videoPath) console.error("TODO: No Video Path in state, return to home or show error");

  return (
    <div>
      <div className="flex gap-5 m-5">
        <Button text="im a boutin" />
        <Button icon="play" />
      </div>
    </div>
  );
}
