import React from "react";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";

export default function TabLayout() {
    return (
        <>
            <StatusBar style="auto" />
            <Tabs
                screenOptions={{
                    headerStyle: {
                        backgroundColor: "#25292e",
                    },
                    headerShadowVisible: false,
                    headerTintColor: "#fff",
                    tabBarStyle: {
                        backgroundColor: "#25292e",
                        height: 55,
                    },
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Home",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons name={focused ? "home-sharp" : "home-outline"} color={color} size={24} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="history"
                    options={{
                        title: "History",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons name={focused ? "information-circle-sharp" : "information-circle-outline"} color={color} size={24} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="settings"
                    options={{
                        title: "Settings",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons name={focused ? "settings-sharp" : "settings-outline"} color={color} size={24} />
                        ),
                    }}
                />
            </Tabs>
        </>
    );
}
