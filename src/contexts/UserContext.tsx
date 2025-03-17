import { createContext } from "react";
import { UserAPI } from "@/models/UserModel";

interface UserContextProps {
  user: UserAPI | null;
  initialLoading: boolean;
  loading: boolean;
  refreshUser: () => void;
  awaitRefreshUser: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  logout: (infoMessage?: string) => Promise<void>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export default UserContext;
