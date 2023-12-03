/*
The `usePresence` hook is designed for real-time presence tracking in collaborative applications. It allows a user to join a room, update their presence data, and periodically send pulse signals to indicate they are active.

Key Features:
- Maintains presence data: Manages user data such as current activity or status within a specific room.
- Pulse mechanism: Regularly updates the user's 'last seen' timestamp to reflect real-time activity.
- Filters out self-presence: Excludes the current user's data from the presence list to focus on other users in the room.

Working Mechanism:
- Upon initialization, the hook updates the user's presence in the specified room with initial data.
- It sets up an interval based on `pulsePeriod` (defaulting to 10 seconds) to continuously signal the user's active presence.
- A callback function, `updateData`, allows for updating the user's presence data, which is then reflected across the application.
- The hook determines if a user is considered 'online' based on their last update timestamp, using an 'old' threshold of 18 seconds.


Known Issues:
- Online status needs to be debugged
- The hook does not have a way to clear presence data


*/

import { api } from "../convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { Value } from "convex/values";
import { useCallback, useEffect, useState } from "react";
import useSingleFlight from "./useSingleFlight";

export type PresenceData<D> = {
  created: number;
  updated: number;
  user: string;
  data: D;
};

const PULSE_PERIOD = 10000;
const OLD_MS = 18000;

export const usePresence = <T extends { [key: string]: Value }>(
  room: string,
  user: string,
  initialData: T,
  pulsePeriod = PULSE_PERIOD,
) => {
  const [data, setData] = useState(initialData);
  let presence: PresenceData<T>[] | undefined = useQuery(api.presence.list, {
    room,
  });
  if (presence) {
    presence = presence.filter((p) => p.user !== user);
  }
  const updatePresence = useSingleFlight(useMutation(api.presence.update));
  const pulse = useSingleFlight(useMutation(api.presence.pulse));

  useEffect(() => {
    void updatePresence({ room, user, data });
    const intervalId = setInterval(() => {
      void pulse({ room, user });
    }, pulsePeriod);

    return () => clearInterval(intervalId);
  }, [updatePresence, pulse, room, user, data, pulsePeriod]);

  const updateData = useCallback((patch: Partial<T>) => {
    setData((prevState) => {
      return { ...prevState, ...patch };
    });
  }, []);

  return [data, presence, updateData] as const;
};

export const isOnline = <D>(presence: PresenceData<D>) => {
  return Date.now() - presence.updated < OLD_MS;
};

export default usePresence;
