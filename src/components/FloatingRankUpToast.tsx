import { useEffect, useState } from "react";

export default function FloatingRankUpToast() {
  const [visible, setVisible] = useState(false);

  // TEMPORARY: simulate a rank-up event after 2 seconds
  // Later this will be triggered by real logic
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000);
    const hide = setTimeout(() => setVisible(false), 4500);
    return () => {
      clearTimeout(timer);
      clearTimeout(hide);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="
        fixed bottom-24 left-1/2 -translate-x-1/2
        bg-purple-600 text-white px-4 py-2 rounded-xl shadow-lg
        flex items-center gap-2
        animate-rankup-slide
      "
    >
      <span className="text-lg">⬆</span>
      <span className="font-semibold">You Ranked Up!</span>
    </div>
  );
}