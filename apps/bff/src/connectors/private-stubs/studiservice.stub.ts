import { log } from "../../utils/logger";

export type Room = {
  id: string;
  name: string;
  campusId: string;
};

export async function fetchRooms(): Promise<Room[]> {
  return [];
}

export type StudentStatus = {
  enrolled: boolean;
};

export type StudiserviceResult = {
  data: StudentStatus;
  _isStub: boolean;
};

export async function fetchStatus(): Promise<StudiserviceResult> {
  log("warn", "stub_called", { connector: "studiservice" });
  return { data: { enrolled: false }, _isStub: true };
}
