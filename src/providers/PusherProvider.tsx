"use client";

import React, {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from "react";
import Pusher from "pusher-js";
import { useSettings } from "@/hooks/useSettings";
import { useUser } from "@/hooks/useUser";

export interface PusherContextProps {
  pusher?: Pusher;
}

export const PusherContext = createContext<PusherContextProps | undefined>(
  undefined
);

export const PusherProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { pusherConfig } = useSettings();
  const { user } = useUser();
  const [pusherInstance, setPusherInstance] = useState<Pusher>();

  useEffect(() => {
    if (pusherConfig && user && !pusherInstance) {
      const instance = new Pusher(pusherConfig.key, {
        cluster: pusherConfig.cluster,
      });
      setPusherInstance(instance);
    }

    return () => {
      if (pusherInstance) {
        pusherInstance.disconnect();
        setPusherInstance(undefined);
      }
    };
  }, [pusherConfig, user, pusherInstance]);

  return (
    <PusherContext.Provider value={{ pusher: pusherInstance }}>
      {children}
    </PusherContext.Provider>
  );
};

export const usePusher = () => {
  const context = useContext(PusherContext);
  if (!context) {
    throw new Error("usePusher must be used within a PusherProvider");
  }
  return context;
};
