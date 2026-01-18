import { Tabs } from "expo-router";
import React from "react";

export default function TabsLayout(): JSX.Element {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Today" }} />
      <Tabs.Screen name="rooms" options={{ title: "Rooms" }} />
      <Tabs.Screen name="events" options={{ title: "Stage" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
