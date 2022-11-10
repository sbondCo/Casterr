import { PopupOptions } from "@/libs/helpers/notifications";
import Loader from "./Loader";
import Progress from "./Progress";

interface PopupProps extends PopupOptions {
  tickBoxesChecked?: string[];
}

export default function Popup(props: PopupProps) {
  const {
    title = "Give us a second",
    percentage,
    loader,
    showCancel = false,
    buttons,
    tickBoxes,
    tickBoxesChecked
  } = props;

  return (
    <div className="flex flex-col justify-center items-center absolute h-screen w-screen z-50 bg-quaternary-100 bg-opacity-50">
      <div className="flex flex-col gap-5 justify-center items-center relative min-w-[500px] min-h-[150px] px-4 py-5 bg-quaternary-100 rounded-xl">
        <span className="p-1.5 text-xl font-bold capitalize">{title}</span>

        {loader && <Loader />}
        {percentage && <Progress p={percentage} />}
      </div>
    </div>
  );
}
