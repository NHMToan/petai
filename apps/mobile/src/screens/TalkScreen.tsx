import { MaterialIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { getConversationState, postChatMessage } from "@/api/chat";
import { getMyPets } from "@/api/pets";
import { GradientCard } from "@/components/GradientCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { StatusBadge } from "@/components/StatusBadge";
import type { HomeStackParamList } from "@/navigation/types";
import { theme } from "@/theme/theme";
import type { ChatConversationState, Pet } from "@/types";

type Props = NativeStackScreenProps<HomeStackParamList, "Talk">;

export function TalkScreen({ navigation, route }: Props) {
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [pet, setPet] = useState<Pet | null>(null);
  const [conversation, setConversation] = useState<ChatConversationState | null>(null);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const pets = await getMyPets();
        const selectedPet = pets.find((entry) => entry.id === route.params?.petId) ?? pets[0] ?? null;

        if (!mounted) return;
        setPet(selectedPet);

        if (!selectedPet) {
          setConversation(null);
          return;
        }

        const state = await getConversationState(selectedPet.id);
        if (!mounted) return;
        setConversation(state.conversation);
        setError(null);
      } catch {
        if (!mounted) return;
        setError("Could not load the conversation from the backend.");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [route.params?.petId]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 120);

    return () => clearTimeout(timeoutId);
  }, [conversation?.messages.length, loading]);

  async function handleSend() {
    if (!pet || !draft.trim()) return;

    try {
      setSending(true);
      const response = await postChatMessage(pet.id, {
        message: draft.trim(),
        title: conversation?.title ?? pet.name,
      });

      setDraft("");
      setConversation((current) => ({
        id: response.conversationId,
        title: current?.title ?? pet.name,
        summary: response.summary,
        lastMessageAt: response.assistantMessage.createdAt,
        messages: [...(current?.messages ?? []), response.userMessage, response.assistantMessage],
      }));
      setError(null);
    } catch {
      setError("Could not send the message to PetAI.");
    } finally {
      setSending(false);
    }
  }

  return (
    <Screen scroll={false} subtitle="Text chat with your companion." title={pet?.name ?? "Talk"}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <StatusBadge label="Chat Live" />
          <View style={styles.topActions}>
            <Pressable onPress={() => navigation.navigate("VoiceChat", { petId: pet?.id })} style={styles.iconButton}>
              <MaterialIcons color={theme.colors.primary} name="graphic-eq" size={22} />
            </Pressable>
            <Pressable onPress={() => navigation.navigate("PetProfile", { petId: pet?.id })} style={styles.iconButton}>
              <MaterialIcons color={theme.colors.primary} name="sensors" size={22} />
            </Pressable>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator color={theme.colors.primary} />
            <Text style={styles.helper}>Connecting to your pet conversation…</Text>
          </View>
        ) : null}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.transcriptStack}>
          {(conversation?.messages.length ?? 0) > 0 ? (
            conversation?.messages.map((message) =>
              message.role === "assistant" ? (
                <GradientCard key={message.id}>
                  <Text style={styles.bubbleAssistant}>{message.content}</Text>
                </GradientCard>
              ) : (
                <View key={message.id} style={styles.userBubble}>
                  <Text style={styles.userText}>{message.content}</Text>
                </View>
              ),
            )
          ) : (
            <GradientCard>
              <Text style={styles.bubbleAssistant}>
                {pet ? `Hi, I'm ${pet.name}. Tell me what's on your mind.` : "No pet is connected yet."}
              </Text>
            </GradientCard>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.helper}>Message your pet</Text>
          <TextInput
            multiline
            onChangeText={setDraft}
            placeholder="Ask for comfort, memories, routines, or product help…"
            placeholderTextColor="rgba(187,201,207,0.35)"
            style={styles.composer}
            value={draft}
          />
          <View style={styles.buttonRow}>
            <View style={styles.buttonSlot}>
              <PrimaryButton disabled={!draft.trim()} label="Send" loading={sending} onPress={handleSend} />
            </View>
            <View style={styles.buttonSlot}>
              <PrimaryButton label="Voice Chat" onPress={() => navigation.navigate("VoiceChat", { petId: pet?.id })} secondary />
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: 140,
    gap: theme.spacing.lg,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: theme.radii.full,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.03)",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingState: {
    alignItems: "center",
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.xl,
  },
  transcriptStack: {
    gap: theme.spacing.md,
  },
  bubbleAssistant: {
    color: theme.colors.onSurface,
    fontSize: 15,
    lineHeight: 22,
  },
  userBubble: {
    alignSelf: "flex-end",
    maxWidth: "82%",
    borderRadius: theme.radii.lg,
    backgroundColor: "rgba(165,231,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(165,231,255,0.24)",
    padding: theme.spacing.md,
  },
  userText: {
    color: theme.colors.primary,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
  },
  error: {
    color: theme.colors.error,
    fontSize: 14,
  },
  footer: {
    gap: theme.spacing.md,
  },
  composer: {
    minHeight: 120,
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.black,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    color: theme.colors.onSurface,
    fontSize: 15,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  buttonSlot: {
    flex: 1,
  },
  helper: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.8,
    textTransform: "uppercase",
  },
});
