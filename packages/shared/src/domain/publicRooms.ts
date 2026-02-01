import { z } from "zod";
import { RoomSchema } from "./public";

export const PublicRoomSchema = RoomSchema;
export type PublicRoom = z.infer<typeof PublicRoomSchema>;

export const PublicRoomsSchema = z.array(PublicRoomSchema);
export type PublicRooms = z.infer<typeof PublicRoomsSchema>;
