import { type RootState } from "@/app/store";
import connect, { disconnect } from "@/libs/uploaders/youtube";
import { useSelector } from "react-redux";
import Connection from "./Connection";

export default function Connections() {
  const state = useSelector((store: RootState) => store.uploaders);

  return (
    <div className="flex flex-col gap-4">
      <Connection
        icon="youtube"
        name="YouTube"
        connected={state.youtube?.username ? state.youtube.username : state.youtube !== undefined ? true : undefined}
        onConnectClick={() => {
          connect().catch((err) => {
            console.error(err);
          });
        }}
        onDisconnectClick={() => {
          disconnect().catch((err) => {
            console.error(err);
          });
        }}
      />
    </div>
  );
}
