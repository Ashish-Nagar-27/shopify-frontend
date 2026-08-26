import { SparkleIcon } from "../icons/Icon";

export function AssistFab() {
  return (
    <button
      title="Pumalyze AI"
      className="fixed bottom-5 right-5 z-10 grid h-11 w-11 place-items-center rounded-[14px] bg-gradient-to-br from-cyan to-magenta text-[oklch(0.10_0.018_240)] shadow-[0_12px_30px_-8px_oklch(0.72_0.20_340/0.5)]"
    >
      <SparkleIcon width={20} height={20} />
    </button>
  );
}
