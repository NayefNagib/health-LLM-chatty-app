import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useRef, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Path, Svg } from "react-native-svg";
import { StatusBar } from "expo-status-bar";
import uuid from "react-native-uuid";

const Index = () => {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const { chatId } = useLocalSearchParams();

  const [question, setquestion] = useState<string>("");
  const [LoadAnswer, setLoadAnswer] = useState<boolean>(false);
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [isFocused, setisFocused] = useState<boolean>(false);
  const [QuestionError, setQuestionError] = useState<boolean>(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  // Load existing chat if opened from history
  useEffect(() => {
    if (chatId) {
      AsyncStorage.getItem("chats").then((res) => {
        if (res) {
          const chats = JSON.parse(res);
          const found = chats.find((c: any) => c.id === chatId);
          if (found) {
            setMessages(found.messages);
            setCurrentChatId(found.id);
          }
        }
      });
    }
  }, [chatId]);

  // Save/update chat session
  const saveChatSession = async (msgs: { role: string; text: string }[]) => {
    try {
      const existing = await AsyncStorage.getItem("chats");
      let chats = existing ? JSON.parse(existing) : [];

      if (currentChatId) {
        // Update existing chat
        chats = chats.map((c: any) =>
          c.id === currentChatId ? { ...c, messages: msgs } : c
        );
      } else {
        const firstUserMessage =
          msgs.find((m) => m.role === "user")?.text || "New Chat";
        const title =
          firstUserMessage.split(" ").slice(0, 4).join(" ") + "...";

        const newChat = {
          id: uuid.v4(),
          title,
          messages: msgs,
          createdAt: Date.now(),
        };
        chats.push(newChat);
        setCurrentChatId(newChat.id as string);
      }

      await AsyncStorage.setItem("chats", JSON.stringify(chats));
    } catch (e) {
      console.error("Error saving chat:", e);
    }
  };

  const onSubmit = async () => {
    Keyboard.dismiss();

    if (!question.trim()) {
      setQuestionError(true);
      return;
    }

    setLoadAnswer(true);

    const userInput = question;
    setMessages((prev) => [...prev, { role: "user", text: userInput }]);
    setquestion("");

    try {
      const response = await fetch("http://192.168.1.2:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await response.json();
      const text = data.reply || "No response";

      setMessages((prev) => {
        const updated = [...prev, { role: "bot", text }];
        saveChatSession(updated);
        return updated;
      });
    } catch (err) {
      console.error("Error fetching API:", err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Error: Unable to fetch response" },
      ]);
    } finally {
      setLoadAnswer(false);
    }
  };

  // New Chat → clears chat window but keeps history intact
  const handleNewChat = () => {
    setMessages([]);
    setquestion("");
    setLoadAnswer(false);
    setCurrentChatId(null); // forces creation of a new chat on next save
  };

  // Auto scroll down
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <>
      <SafeAreaView className="flex-1 bg-primary">
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <Animated.View entering={FadeIn} exiting={FadeOut} className="flex-1">
            {/* Chat area */}
            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={{ padding: 12 }}
            >
              {messages.map((msg, idx) => (
                <View
                  key={idx}
                  className={`my-1 max-w-[80%] px-4 py-2 rounded-2xl ${
                    msg.role === "user"
                      ? "self-end bg-green-600"
                      : "self-start bg-gray-700"
                  }`}
                >
                  <Text className="text-white">{msg.text}</Text>
                </View>
              ))}
            </ScrollView>

            {/* Input */}
            <View className="flex flex-row items-center p-2 border-t border-gray-600">
              <TextInput
                className="flex-1 rounded-3xl p-2 text-white bg-gray-800"
                style={{
                  height: 50,
                  paddingLeft: 20,
                  paddingRight: 50,
                  borderWidth: 1,
                  borderColor: QuestionError
                    ? "#D32F2F"
                    : isFocused
                    ? "rgba(255,255,255,1)"
                    : "rgba(255,255,255,0.2)",
                }}
                placeholderTextColor={
                  QuestionError ? "#D32F2F" : "rgba(255,255,255,0.5)"
                }
                onChangeText={(e) => {
                  setquestion(e);
                  setQuestionError(e.length < 1);
                }}
                value={question}
                placeholder="Type a message..."
                keyboardType="default"
                onFocus={() => setisFocused(true)}
                onSubmitEditing={onSubmit}
              />

              <View
                className="absolute flex flex-row items-center px-2 z-10"
                style={{ right: 10 }}
              >
                {LoadAnswer ? (
                  <ActivityIndicator
                    className="mx-2"
                    animating={true}
                    color={"white"}
                  />
                ) : (
                  <Pressable className="mx-2" onPress={onSubmit}>
                    <Svg width={25} height={25} viewBox="0 0 24 24">
                      <Path
                        d="M11.162 12.838 2.114 9.822a1.264 1.264 0 0 1 .012-2.401l18.973-6.11a1.265 1.265 0 0 1 1.59 1.59l-6.11 18.973a1.263 1.263 0 0 1-2.401.012zM3.273 8.627l8.719 2.907c.224.074.4.25.474.474l2.907 8.719L21.12 2.88z"
                        fill={"white"}
                      />
                    </Svg>
                  </Pressable>
                )}
              </View>
            </View>

            {/* New Chat button */}
            <View className="p-2">
              <Pressable
                onPress={handleNewChat}
                className="bg-blue-600 py-2 px-4 rounded-2xl self-center"
              >
                <Text className="text-white font-semibold">New Chat</Text>
              </Pressable>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <StatusBar animated={true} style="light" />
    </>
  );
};

export default Index;
