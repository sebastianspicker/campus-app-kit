import { Link } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import { Card } from "./Card";

export type ResourceListItemProps<T> = {
  item: T;
  href: (item: T) => { pathname: string; params: Record<string, string> };
  renderCard: (item: T) => { title: string; subtitle?: string };
  accessibilityLabel: (item: T) => string;
};

function ResourceListItemInner<T>({
  item,
  href,
  renderCard,
  accessibilityLabel
}: ResourceListItemProps<T>): JSX.Element {
  const card = renderCard(item);
  const linkHref = href(item);
  const label = accessibilityLabel(item);
  return (
    <Link href={linkHref} asChild>
      <Pressable accessibilityRole="link" accessibilityLabel={label}>
        <Card title={card.title} subtitle={card.subtitle} />
      </Pressable>
    </Link>
  );
}

export const ResourceListItem = React.memo(
  ResourceListItemInner
) as typeof ResourceListItemInner;
