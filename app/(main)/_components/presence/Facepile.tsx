/*The Facepile component is used to display a list of user avatars ("faces")
to represent active users' presence in an application. It accepts an array of
presence data, each containing an emoji, name, and profile URL. This component
updates every 1000 milliseconds (UPDATE_MS) to ensure the presence data is current.
It displays up to five avatars sorted by their online status and the time they were created.
If the user is online, their avatar is shown with their name and "Online" status;
otherwise, it shows their name and the last seen date.*/

import classNames from "classnames";
import { useEffect, useState } from "react";
import { isOnline, PresenceData } from "@/hooks/usePresence";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UPDATE_MS = 1000;

type FacePileProps = {
  othersPresence?: PresenceData<{
    emoji: string;
    name: string;
    profileUrl: string;
  }>[];
};
export const Facepile = ({ othersPresence }: FacePileProps) => {
  const [, setNow] = useState(Date.now());
  useEffect(() => {
    const intervalId = setInterval(() => setNow(Date.now()), UPDATE_MS);
    return () => clearInterval(intervalId);
  }, [setNow]);
  return (
    <div className="isolate flex space-x-1 ">
      {othersPresence
        ?.slice(0, 5)
        .map((presence) => ({
          ...presence,
          online: !isOnline(presence),
        }))
        .sort((presence1, presence2) =>
          presence1.online === presence2.online
            ? presence1.created - presence2.created
            : Number(presence1.online) - Number(presence2.online),
        )
        .map((presence) => (
          <span
            className={classNames(
              "relative inline-block rounded-full bg-white ring-2 ring-white",
            )}
            key={presence.created}
            title={
              presence.online
                ? `${presence.data.name} Online`
                : `${presence.data.name} Last seen ` +
                  new Date(presence.updated).toDateString()
            }
          >
            <Avatar>
              <AvatarImage
                className="rounded-full h-8 w-8"
                src={`${presence.data.profileUrl}`}
              />
              <AvatarFallback> {presence.data.name[0]}</AvatarFallback>
            </Avatar>
          </span>
        ))}
    </div>
  );
};
