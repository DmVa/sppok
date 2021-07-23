import { UserModel } from "./userModel";

export interface RoomState {
  topic: string;
  isVoting: boolean;
  users: UserModel[]
}
