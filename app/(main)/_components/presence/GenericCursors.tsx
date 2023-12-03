import { useRef, useEffect } from "react";
import { PresenceData, isOnline } from "@/hooks/usePresence";
import { useUser } from "@clerk/clerk-react";

type Data = {
  text: string;
  emoji: string;
  x: number;
  y: number;
  typing: boolean;
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
    const handlePointerMove = (e) => {
      const boundingRect = ref.current.getBoundingClientRect();
      updatePresence({
        x: e.clientX - boundingRect.left,
        y: e.clientY - boundingRect.top,
      });
    };

    const currentRef = ref.current;
    currentRef.addEventListener("pointermove", handlePointerMove);

    return () => {
      currentRef.removeEventListener("pointermove", handlePointerMove);
    };
  }, [updatePresence]);

  return (
    <div ref={ref} className="relative">
      {children}
      <span
        className="absolute cursor-none pointer-events-none"
        style={{
          left: myPresenceData.x - 20,
          top: myPresenceData.y - 10,
          transform: "translate(-50%, -50%)",
        }}
      >
        {myPresenceData.emoji + " " + myPresenceData.text}
      </span>
      {othersPresence?.filter(isOnline).map((presence) => (
        <span
          className="absolute transition-all duration-200"
          key={presence.created}
          style={{
            left: presence.data.x,
            top: presence.data.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          {user.user?.firstName}
        </span>
      ))}
    </div>
  );
}
