import { RootState } from "@/app/store";
import FilterBar from "@/common/FilterBar";
import Icon from "@/common/Icon";
import Loader from "@/common/Loader";
import PageLayout from "@/common/PageLayout";
import TextBox from "@/common/TextBox";
import useDragAndDrop from "@/hooks/useDragAndDrop";
import RecordingsManager from "@/libs/recorder/recordingsManager";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Video } from "./types";
import VideosGrid from "./VideosGrid";

export default function Videos() {
  const pageRef = useRef<HTMLDivElement>(null);
  const { dropZoneShown, dropZoneFLen } = useDragAndDrop(pageRef, (f: File) => {
    if (f.type.includes("video")) {
      // TODO when on `clips` sub page, add dropped videos as clips
      RecordingsManager.add(f.path).catch((e) => {
        console.error("Drag&Drop handler failed to add recording via RecordsManager.", e);
      });
    }
  });

  const state = useSelector((store: RootState) => store.videos);
  const [allFilteredVideos, setFilteredAllVideos] = useState<Video[]>();
  const [videos, setVideos] = useState<Video[]>();
  const [searchQuery, setSearchQuery] = useState<string>();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);

  useEffect(() => {
    setVideosLoading(true);
    const allVideos = [...state.recordings, ...state.clips].sort((a, b) => (a.time && b.time ? b.time - a.time : -1));
    let filteredVids = allVideos;

    // Apply filters
    if (activeFilters.length <= 0 || (activeFilters.includes("Recordings") && activeFilters.includes("Clips"))) {
      filteredVids = allVideos;
    } else if (activeFilters.includes("Clips")) {
      filteredVids = allVideos.filter((v) => v.isClip);
    } else if (activeFilters.includes("Recordings")) {
      filteredVids = allVideos.filter((v) => !v.isClip);
    }

    // Apply search query
    if (searchQuery) {
      filteredVids = filteredVids.filter((v) => v.name.toLowerCase().includes(searchQuery.toLocaleLowerCase()));
    }

    setFilteredAllVideos(filteredVids);
    setVideos(filteredVids.slice(0, 15));
    setVideosLoading(false);
  }, [activeFilters, searchQuery]);

  const infiniteLoadHandler = (ev: Event) => {
    const el = ev.target as HTMLDivElement;
    // If scrolled to bottom load more videos
    if (allFilteredVideos && videos && el?.scrollHeight - el?.scrollTop - 200 <= el?.clientHeight) {
      console.log("Loading 30 more videos.");
      setVideos([...videos, ...allFilteredVideos.slice(videos.length, videos.length + 30)]);
    }
  };

  useEffect(() => {
    pageRef.current?.addEventListener("scroll", infiniteLoadHandler);

    return () => {
      pageRef.current?.removeEventListener("scroll", infiniteLoadHandler);
    };
  });

  return (
    <PageLayout smPageWidth={false} ref={pageRef}>
      {dropZoneShown && (
        <div className="flex gap-1 flex-col items-center translate-x-[-50%] left-[50%] top-1/2 fixed px-5 py-3 bg-quaternary-200 bg-opacity-80 text-xl font-bold rounded border-4 border-white-100 border-dashed z-50">
          <div className="flex gap-5 flex-row items-center ">
            <Icon i="add" wh={36} />
            <span>Add Video{dropZoneFLen && dropZoneFLen > 1 ? "s" : ""}</span>
          </div>
          {dropZoneFLen && (
            <span className="text-sm">
              Drop to add {dropZoneFLen} video{dropZoneFLen && dropZoneFLen > 1 ? "s" : ""}.
            </span>
          )}
        </div>
      )}

      <div className="flex flex-row mb-3.5">
        <FilterBar
          options={["Recordings", "Clips"]}
          activeOptions={activeFilters}
          optionClicked={(opt) => {
            if (!activeFilters.includes(opt)) setActiveFilters([...activeFilters, opt]);
            else setActiveFilters(activeFilters.filter((f) => f !== opt));
          }}
        />

        <TextBox
          className="h-full ml-auto"
          type="text"
          value=""
          placeholder="Search All Videos"
          icon="search"
          debounce={250}
          onChange={(e) => setSearchQuery(e)}
        />
      </div>

      {videosLoading ? <Loader /> : <VideosGrid videos={videos} />}
    </PageLayout>
  );
}
