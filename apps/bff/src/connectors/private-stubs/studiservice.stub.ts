export type Room = {
  id: string;
  name: string;
  campusId: string;
};

export async function fetchRooms(): Promise<Room[]> {
  return [];
}
