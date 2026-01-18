import type { PublicEvent } from "../connectors/public/hfmtWebEvents";

export type EventCard = {
  id: string;
  title: string;
  startsAt: string;
  sourceUrl: string;
};

export function mapPublicEventsToCards(
  events: PublicEvent[]
): EventCard[] {
  return events.map((event) => ({
    id: event.id,
    title: event.title,
    startsAt: event.date,
    sourceUrl: event.sourceUrl
  }));
}
