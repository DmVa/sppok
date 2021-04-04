import { UserModel } from "./userModel";

export interface RoomState {
  topic: string;
  isvoting: boolean;
  users: UserModel[]
}
