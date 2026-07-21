import { Tabs } from "expo-router";

import { CustomTabBar } from "@/components/CustomTabBar";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: "Projects" }} />
      <Tabs.Screen name="about" options={{ title: "About" }} />
      <Tabs.Screen name="contact" options={{ title: "Contact" }} />
      <Tabs.Screen name="playground" options={{ title: "Playground" }} />
    </Tabs>
  );
}
