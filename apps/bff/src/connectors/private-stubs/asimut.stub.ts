export type Booking = {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
};

export async function fetchBookings(): Promise<Booking[]> {
  return [];
}
