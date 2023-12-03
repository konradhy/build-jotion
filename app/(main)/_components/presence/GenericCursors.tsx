import { useRef, useEffect } from "react";
import { PresenceData, isOnline } from "@/hooks/usePresence";
import { useUser } from "@clerk/clerk-react";

type Data = {
  text: string;
  emoji: string;
  x: number;
  y: number;
  typing: boolean;
  name: string;
};

type GenericSharedCursorsProps = {
  myPresenceData: Data;
  othersPresence?: PresenceData<Data>[];
  updatePresence: (p: Partial<Data>) => void;
  children: React.ReactNode;
};

export default function GenericSharedCursors({
  myPresenceData,
  othersPresence,
  updatePresence,
  children,
}: GenericSharedCursorsProps) {
  const user = useUser();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerMove = (e: any) => {
      if (!ref.current) return;
      const boundingRect = ref.current.getBoundingClientRect();
      updatePresence({
        x: e.clientX - boundingRect.left,
        y: e.clientY - boundingRect.top,
      });
    };

    const currentRef = ref.current;
    currentRef?.addEventListener("pointermove", handlePointerMove);

    return () => {
      currentRef?.removeEventListener("pointermove", handlePointerMove);
    };
  }, [updatePresence]);

  return (
    <div ref={ref} className="relative">
      {children}

      {othersPresence?.filter(isOnline).map((presence) => (
        <span
          className="absolute bg-blue-500 text-white text-xs font-semibold py-1 px-2 rounded-full transition-all duration-200"
          key={presence.created}
          style={{
            left: presence.data.x,
            top: presence.data.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          {presence.data.name}
          {presence.data.typing && " ..."}
        </span>
      ))}
    </div>
  );
}
