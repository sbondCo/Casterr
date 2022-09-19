import { RootState } from "@/app/store";
import Icon from "@/common/Icon";
import PageLayout from "@/common/PageLayout";
import SubNav, { SubNavItem } from "@/common/SubNav";
import { useSelector } from "react-redux";
import { Routes, Route, Link, Navigate } from "react-router-dom";

export default function Videos() {
  const state = useSelector((store: RootState) => store.videos);

  const VideosGrid = ({ type }: { type: "recordings" | "clips" }) => {
    const videos = type === "clips" ? state.clips : state.recordings;

    if (!videos || videos.length <= 0) {
      return <div className="flex justify-center mt-8 font-bold text-xl capitalize">You have no {type} yet!</div>;
    }

    return (
      <div className="flex flex-wrap gap-3">
        {videos.map((v) => {
          return (
            <Link
              // to={{
              //   pathname: `/editor`,
              //   state: v.videoPath
              // }}
              to="/editor"
              state={v.videoPath}
              key={v.videoPath}
              className="group flex-grow basis-[100%] md:basis-[40%] lg:basis-[30%] w-3/12 h-64 relative rounded-md overflow-hidden cursor-pointer"
            >
              <div className="h-full">
                <img className="w-full h-full object-cover" src={"secfile://" + v.thumbPath} alt="" />

                <div className="group-hover:opacity-100 opacity-0 absolute top-2/4 left-2/4 drop-shadow transition-opacity">
                  <Icon i="edit" />
                </div>

                <p className="absolute right-3 top-2 italic font-bold [text_shadow:_1px_1px_black]">{v.fps} FPS</p>

                <div className="flex items-center absolute bottom-0 w-full px-3 py-2 bg-quaternary-100/60">
                  {/* TODO: test this with very long names - clip them */}
                  <span className="font-bold">{v.name}</span>
                  <span className="ml-auto mr-3 text-sm">{v.duration?.toReadableTimeFromSeconds()}</span>
                  <span className="text-sm">{v.fileSize?.toReadableFileSize()}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <PageLayout smPageWidth={false}>
      <SubNav>
        <SubNavItem text="Recordings" />
        <SubNavItem text="Clips" />
      </SubNav>

      <Routes>
        <Route path="" element={<Navigate replace to="recordings" />} />
        <Route path="recordings" element={<VideosGrid type="recordings" />} />
        <Route path="clips" element={<VideosGrid type="clips" />} />
      </Routes>
    </PageLayout>
  );
}
