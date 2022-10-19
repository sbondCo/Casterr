import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import VideosGridItem from "./VideosGridItem";

export default function VideosGrid({ type }: { type: "recordings" | "clips" }) {
  const state = useSelector((store: RootState) => store.videos);
  const videos = type === "clips" ? state.clips : state.recordings;
  videos.sort((a, b) => (a.time && b.time ? b.time - a.time : -1));

  // TODO only render videos being looked at / infinity scroll not loading all at once but when scrolled to bottom

  if (!videos || videos.length <= 0) {
    return <div className="flex justify-center mt-8 font-bold text-xl capitalize">You have no {type} yet!</div>;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {videos.map((v) => {
        return (
          <Link
            to="/editor"
            state={v}
            key={v.videoPath}
            className="group flex-grow basis-[100%] md:basis-[40%] lg:basis-[30%] w-3/12 h-64 relative rounded-md overflow-hidden cursor-pointer"
          >
            <VideosGridItem video={v} />
          </Link>
        );
      })}
    </div>
  );
}
