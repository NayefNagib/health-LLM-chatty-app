import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Path, Svg } from "react-native-svg";
import { StatusBar } from "expo-status-bar";

type ChatHistoryT = {
  id: string;
  title: string;
  messages: { role: string; text: string }[];
  createdAt: number;
};

const History = () => {
  const [chats, setChats] = useState<ChatHistoryT[]>([]);
  const router = useRouter();

  const fetchChats = async () => {
    const res = await AsyncStorage.getItem("chats");
    if (res) setChats(JSON.parse(res));
  };

  const deleteChat = async (id: string) => {
    const res = await AsyncStorage.getItem("chats");
    if (res) {
      let chats = JSON.parse(res);
      chats = chats.filter((c: ChatHistoryT) => c.id !== id);
      await AsyncStorage.setItem("chats", JSON.stringify(chats));
      setChats(chats);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchChats();
    }, [])
  );

  return (
    <>
      <SafeAreaView className="flex-1 p-4 bg-primary">
        {chats.length > 0 ? (
          <ScrollView>
            {chats.map((chat) => (
              <Animated.View
                key={chat.id}
                entering={FadeIn}
                exiting={FadeOut}
                style={styles.card}
              >
                <Pressable
  onPress={() =>
    router.push({
      pathname: "/",
      params: { chatId: chat.id },
    })
  }
  style={{ flex: 1 }}
>
  <Text style={styles.title}>{chat.title}</Text>
  <Text style={styles.time}>{moment(chat.createdAt).fromNow()}</Text>
</Pressable>

                {/* Delete Button */}
                <Pressable onPress={() => deleteChat(chat.id)}>
                  <Svg width={25} height={25} viewBox="0 0 24 24">
                    <Path
                      d="M15 4H9a1 1 0 0 1 0-2h6a1 1 0 0 1 0 2zM15 22H9a4 4 0 0 1-4-4V6h14v12a4 4 0 0 1-4 4z"
                      fill={"#e63946"}
                    />
                    <Path
                      d="M20 8H4a1 1 0 0 1 0-2h16a1 1 0 0 1 0 2z"
                      fill={"#c9273a"}
                    />
                    <Path
                      d="M10 18a1 1 0 0 1-1-1v-6a1 1 0 0 1 2 0v6a1 1 0 0 1-1 1zM14 18a1 1 0 0 1-1-1v-6a1 1 0 0 1 2 0v6a1 1 0 0 1-1 1z"
                      fill="#edebea"
                    />
                  </Svg>
                </Pressable>
              </Animated.View>
            ))}
          </ScrollView>
        ) : (
          <Image
            style={{
              width: "70%",
              opacity: 0.7,
              height: "100%",
              objectFit: "contain",
              alignSelf: "center",
            }}
            source={require("./../../assets/hand-drawn-no-data-illustration.png")}
          />
        )}
      </SafeAreaView>
      <StatusBar animated={true} style="light" />
    </>
  );
};

export default History;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 15,
    borderRadius: 20,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  time: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    marginTop: 4,
  },
});
