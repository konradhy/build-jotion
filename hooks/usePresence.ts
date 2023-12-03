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
