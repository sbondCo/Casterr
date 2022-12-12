import { Link } from "react-router-dom";
import { Video } from "./types";
import VideosGridItem from "./VideosGridItem";

export default function VideosGrid({ videos }: { videos?: Video[] }) {
  if (!videos || videos.length <= 0) {
    return <div className="flex justify-center mt-8 font-bold text-xl capitalize">No Videos Found!</div>;
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
