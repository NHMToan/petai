import { createRealtimeSession, syncVoiceTurn } from "@/api/chat";
import { parseMusicIntent } from "@/features/music/musicIntent";
import { getMyPets, getVoicePreviewUrl, getVoices } from "@/api/pets";
import { GradientCard } from "@/components/GradientCard";
import { Screen } from "@/components/Screen";
import { StatusBadge } from "@/components/StatusBadge";
import { WaveformMock } from "@/components/WaveformMock";
import { useI18n } from "@/i18n/useI18n";
import type { HomeStackParamList } from "@/navigation/types";
import {
  getAppleMusicNowPlaying,
  pauseAppleMusic,
  resumeAppleMusic,
  searchAndPlayAppleMusic,
  stopAppleMusic,
  type AppleMusicTrack,
} from "@/native/appleMusic";
import { theme } from "@/theme/theme";
import type { Pet, Voice } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Audio, InterruptionModeIOS } from "expo-av";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  NativeModules,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  mediaDevices,
  MediaStream as RTCMediaStream,
  RTCPeerConnection,
} from "react-native-webrtc";

type Props = NativeStackScreenProps<HomeStackParamList, "VoiceChat">;

type VoiceStatus =
  | "idle"
  | "connecting"
  | "listening"
  | "thinking"
  | "speaking"
  | "error";

type RealtimeEvent = {
  type?: string;
  transcript?: string;
};

export function VoiceChatScreen({ navigation, route }: Props) {
  const { t } = useI18n();
  const webRTCModule = NativeModules.WebRTCModule as {
    forceSpeakerOutput?: (
      enabled: boolean,
    ) => { success?: boolean; error?: string } | void;
  };
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<any>(null);
  const mediaStreamRef = useRef<RTCMediaStream | null>(null);
  const pendingUserTranscriptRef = useRef<string | null>(null);
  const lastSyncedPairRef = useRef<string | null>(null);
  const lastHandledMusicCommandRef = useRef<string | null>(null);
  const previewSoundRef = useRef<Audio.Sound | null>(null);
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const orbitAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const [pet, setPet] = useState<Pet | null>(null);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null);
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [userTranscript, setUserTranscript] = useState<string | null>(null);
  const [assistantTranscript, setAssistantTranscript] = useState<string | null>(
    null,
  );
  const [syncedAt, setSyncedAt] = useState<string | null>(null);
  const [activeRealtimeVoice, setActiveRealtimeVoice] = useState<string | null>(
    null,
  );
  const [musicBusy, setMusicBusy] = useState(false);
  const [musicTrack, setMusicTrack] = useState<AppleMusicTrack | null>(null);
  const [musicNote, setMusicNote] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const [pets, availableVoices] = await Promise.all([
          getMyPets(),
          getVoices(),
        ]);
        if (!mounted) return;

        const selectedPet =
          pets.find((entry) => entry.id === route.params?.petId) ??
          pets[0] ??
          null;
        setPet(selectedPet);
        setVoices(availableVoices);
        setSelectedVoiceId(
          selectedPet?.voiceId ?? availableVoices[0]?.id ?? null,
        );
        try {
          const nowPlaying = await getAppleMusicNowPlaying();
          if (!mounted) return;
          if (!nowPlaying?.isEmpty) {
            setMusicTrack(nowPlaying);
          }
        } catch {
          // Apple Music may not be configured on this device yet.
        }
        setError(
          selectedPet
            ? null
            : "Could not find a PetAI companion for voice chat.",
        );
      } catch {
        if (!mounted) return;
        setError("Could not load the companion for voice chat.");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    void load();

    return () => {
      mounted = false;
      void stopVoicePreview();
      void stopVoiceChat();
    };
  }, [route.params?.petId]);

  useEffect(() => {
    const isActive =
      voiceStatus === "listening" ||
      voiceStatus === "thinking" ||
      voiceStatus === "speaking";

    if (!isActive) {
      pulseAnim.stopAnimation();
      orbitAnim.stopAnimation();
      glowAnim.stopAnimation();
      pulseAnim.setValue(0);
      orbitAnim.setValue(0);
      glowAnim.setValue(0);
      return;
    }

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    const orbitLoop = Animated.loop(
      Animated.timing(orbitAnim, {
        toValue: 1,
        duration: 5400,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    pulseLoop.start();
    orbitLoop.start();
    glowLoop.start();

    return () => {
      pulseLoop.stop();
      orbitLoop.stop();
      glowLoop.stop();
    };
  }, [glowAnim, orbitAnim, pulseAnim, voiceStatus]);

  async function configureAudioSession() {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      staysActiveInBackground: false,
      shouldDuckAndroid: false,
      playThroughEarpieceAndroid: false,
    });
    webRTCModule.forceSpeakerOutput?.(true);
  }

  async function resetAudioSession() {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      staysActiveInBackground: false,
      shouldDuckAndroid: false,
      playThroughEarpieceAndroid: false,
    });
    webRTCModule.forceSpeakerOutput?.(false);
  }

  async function ensurePermissions() {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        setError("Microphone permission is required for realtime voice chat.");
        return false;
      }
      return true;
    } catch {
      setError("Could not request microphone permission.");
      return false;
    }
  }

  function resolveRequestedVoice() {
    if (!selectedVoiceId) return undefined;
    const selectedVoice = voices.find((entry) => entry.id === selectedVoiceId);
    return selectedVoice?.name;
  }

  async function stopVoicePreview() {
    setPreviewingVoiceId(null);
    if (!previewSoundRef.current) return;
    try {
      await previewSoundRef.current.stopAsync();
      await previewSoundRef.current.unloadAsync();
    } catch {
      // Best-effort cleanup only.
    } finally {
      previewSoundRef.current = null;
    }
  }

  async function playVoicePreview(voice: Voice) {
    if (busy || peerConnectionRef.current) return;

    if (previewingVoiceId === voice.id) {
      await stopVoicePreview();
      return;
    }

    try {
      setError(null);
      await stopVoicePreview();
      setPreviewingVoiceId(voice.id);
      const { sound } = await Audio.Sound.createAsync(
        { uri: getVoicePreviewUrl(voice.id) },
        { shouldPlay: true },
      );
      previewSoundRef.current = sound;
      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;
        if (status.didJustFinish) {
          void stopVoicePreview();
        }
      });
    } catch {
      setPreviewingVoiceId(null);
      setError("Could not play that voice preview.");
    }
  }

  async function startVoiceChat() {
    if (!pet || peerConnectionRef.current || busy) return;

    const hasPermission = await ensurePermissions();
    if (!hasPermission) return;

    setBusy(true);
    setVoiceStatus("connecting");
    setError(null);
    pendingUserTranscriptRef.current = null;
    lastSyncedPairRef.current = null;
    setUserTranscript(null);
    setAssistantTranscript(null);

    try {
      await stopVoicePreview();
      await configureAudioSession();

      const clientSession = await createRealtimeSession(pet.id, {
        voice: resolveRequestedVoice(),
      });
      const mediaStream = await mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      const peerConnection = new RTCPeerConnection();
      const dataChannel = peerConnection.createDataChannel("oai-events");

      mediaStreamRef.current = mediaStream;
      peerConnectionRef.current = peerConnection;
      dataChannelRef.current = dataChannel;
      setActiveRealtimeVoice(clientSession.voice);

      mediaStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, mediaStream);
      });

      peerConnection.addEventListener("track", () => {
        setVoiceStatus("speaking");
      });

      peerConnection.addEventListener("connectionstatechange", () => {
        const state = peerConnection.connectionState;
        if (state === "connected") {
          setVoiceStatus("listening");
          return;
        }
        if (
          state === "failed" ||
          state === "disconnected" ||
          state === "closed"
        ) {
          setVoiceStatus("idle");
        }
      });

      dataChannel.addEventListener("open", () => {
        setVoiceStatus("listening");
      });

      dataChannel.addEventListener("message", (event: { data: unknown }) => {
        if (typeof event.data !== "string") return;
        handleRealtimeEvent(event.data);
      });

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      const response = await fetch("https://api.openai.com/v1/realtime/calls", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${clientSession.value}`,
          "Content-Type": "application/sdp",
        },
        body: offer.sdp ?? "",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const answer = await response.text();
      await peerConnection.setRemoteDescription({
        type: "answer",
        sdp: answer,
      });

      webRTCModule.forceSpeakerOutput?.(true);
      setVoiceStatus("listening");
      setError(null);
    } catch {
      await stopVoiceChat();
      setVoiceStatus("error");
      setError("Could not start realtime voice chat.");
    } finally {
      setBusy(false);
    }
  }

  async function stopVoiceChat() {
    dataChannelRef.current?.close();
    dataChannelRef.current = null;
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    pendingUserTranscriptRef.current = null;
    lastSyncedPairRef.current = null;
    lastHandledMusicCommandRef.current = null;
    setActiveRealtimeVoice(null);
    setVoiceStatus("idle");

    try {
      await resetAudioSession();
    } catch {
      // Best-effort cleanup only.
    }
  }

  function sendRealtimeEvent(event: Record<string, unknown>) {
    const channel = dataChannelRef.current;
    if (!channel || channel.readyState !== "open") return;

    channel.send(
      JSON.stringify({
        event_id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        ...event,
      }),
    );
  }

  function handleRealtimeEvent(rawEvent: string) {
    try {
      const event = JSON.parse(rawEvent) as RealtimeEvent;

      switch (event.type) {
        case "input_audio_buffer.speech_started":
          if (voiceStatus === "speaking" || voiceStatus === "thinking") {
            sendRealtimeEvent({ type: "response.cancel" });
            sendRealtimeEvent({ type: "output_audio_buffer.clear" });
          }
          setVoiceStatus("listening");
          break;
        case "input_audio_buffer.speech_stopped":
        case "response.created":
          setVoiceStatus("thinking");
          break;
        case "response.output_audio.delta":
          setVoiceStatus("speaking");
          break;
        case "output_audio_buffer.cleared":
          setVoiceStatus("listening");
          break;
        case "conversation.item.input_audio_transcription.completed":
          if (event.transcript?.trim()) {
            const transcript = event.transcript.trim();
            pendingUserTranscriptRef.current = transcript;
            setUserTranscript(transcript);
            void handleMusicIntent(transcript);
          }
          break;
        case "response.output_audio_transcript.done":
          if (event.transcript?.trim()) {
            const transcript = event.transcript.trim();
            setAssistantTranscript(transcript);
            void syncTranscriptPair(transcript);
          }
          break;
        case "response.done":
          setVoiceStatus("listening");
          break;
        default:
          break;
      }
    } catch {
      // Ignore transport noise from the data channel.
    }
  }

  async function handleMusicIntent(transcript: string) {
    const intent = parseMusicIntent(transcript);
    if (!intent) return;

    const commandKey = `${intent.action}:${intent.action === "play" ? intent.query ?? "" : ""}`;
    if (lastHandledMusicCommandRef.current === commandKey) return;
    lastHandledMusicCommandRef.current = commandKey;

    setMusicBusy(true);

    try {
      if (intent.action === "play") {
        if (!intent.query) {
          setMusicNote(t("Tell PetAI what song, artist, or mood you want to hear."));
          return;
        }

        const track = await searchAndPlayAppleMusic(intent.query);
        setMusicTrack(track);
        setMusicNote(t("Now Playing"));
        return;
      }

      if (intent.action === "pause") {
        const track = await pauseAppleMusic();
        setMusicTrack(track);
        setMusicNote(t("Music paused."));
        return;
      }

      if (intent.action === "resume") {
        const track = await resumeAppleMusic();
        setMusicTrack(track);
        setMusicNote(t("Music resumed."));
        return;
      }

      await stopAppleMusic();
      setMusicTrack(null);
      setMusicNote(t("Music stopped."));
    } catch (nextError) {
      const message =
        nextError instanceof Error
          ? t(nextError.message)
          : t("Could not control Apple Music right now.");
      setMusicNote(message);
    } finally {
      setMusicBusy(false);
    }
  }

  async function syncTranscriptPair(assistantText: string) {
    if (!pet) return;

    const userText = pendingUserTranscriptRef.current?.trim();
    if (!userText) return;

    const pairKey = `${userText}\n---\n${assistantText}`;
    if (lastSyncedPairRef.current === pairKey) return;

    lastSyncedPairRef.current = pairKey;
    pendingUserTranscriptRef.current = null;

    try {
      await syncVoiceTurn(pet.id, {
        userTranscript: userText,
        assistantTranscript: assistantText,
      });
      setSyncedAt(new Date().toLocaleTimeString());
      setError(null);
    } catch {
      setError(
        "Voice memory sync failed, but the live session is still active.",
      );
    }
  }

  async function handlePrimaryAction() {
    if (peerConnectionRef.current) {
      await stopVoiceChat();
      return;
    }

    await startVoiceChat();
  }

  const statusLabel =
    voiceStatus === "connecting"
      ? "Connecting"
      : voiceStatus === "listening"
        ? "Listening"
        : voiceStatus === "thinking"
          ? "Thinking"
          : voiceStatus === "speaking"
            ? "Speaking"
            : voiceStatus === "error"
              ? "Voice Error"
              : "Voice Standby";

  const selectedVoice =
    voices.find((voice) => voice.id === selectedVoiceId) ?? null;
  const selectedVoiceLabel =
    activeRealtimeVoice ?? selectedVoice?.name ?? "marin";
  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });
  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.5],
  });
  const orbitRotate = orbitAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.85],
  });
  const visualHint =
    voiceStatus === "connecting"
      ? "Connecting…"
      : peerConnectionRef.current
        ? "Tap to end voice session"
        : "Tap to start voice session";

  return (
    <Screen
      right={
        <View style={styles.headerActions}>
          <Pressable
            onPress={() => navigation.navigate("Talk", { petId: pet?.id })}
            style={styles.chatButton}
          >
            <MaterialIcons
              color={theme.colors.primary}
              name="chat-bubble-outline"
              size={20}
            />
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("PetProfile", { petId: pet?.id })}
            style={styles.chatButton}
          >
            <MaterialIcons
              color={theme.colors.primary}
              name="pets"
              size={20}
            />
          </Pressable>
        </View>
      }
      subtitle="Low-latency GPT Realtime voice mode."
      title={pet?.name ?? "Voice Chat"}
    >
      {loading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={styles.helper}>Loading realtime voice…</Text>
        </View>
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {!loading ? (
        <>
          <GradientCard
            glow={voiceStatus === "error" ? "secondary" : "primary"}
          >
            <View style={styles.heroCard}>
              <View style={styles.heroTop}>
                <StatusBadge label={statusLabel} />
                <Text style={styles.heroVoice}>
                  {selectedVoiceLabel.toUpperCase()}
                </Text>
              </View>

              <Pressable
                disabled={loading || busy || !pet}
                onPress={() => {
                  void handlePrimaryAction();
                }}
                style={({ pressed }) => [
                  styles.visualAreaButton,
                  pressed && styles.visualAreaPressed,
                ]}
              >
                <View style={styles.visualArea}>
                  <Animated.View
                    pointerEvents="none"
                    style={[
                      styles.glowOrb,
                      {
                        opacity: glowOpacity,
                        transform: [{ scale: pulseScale }],
                      },
                    ]}
                  />
                  <Animated.View
                    pointerEvents="none"
                    style={[
                      styles.ringOuter,
                      {
                        opacity: pulseOpacity,
                        transform: [{ scale: pulseScale }],
                      },
                    ]}
                  />
                  <Animated.View
                    pointerEvents="none"
                    style={[
                      styles.ringOrbit,
                      {
                        transform: [{ rotate: orbitRotate }],
                      },
                    ]}
                  />
                  <View pointerEvents="none" style={styles.avatarPlate}>
                    {pet?.imageUrl ? (
                      <Image
                        source={{ uri: pet.imageUrl }}
                        style={styles.avatar}
                      />
                    ) : null}
                  </View>
                  <View pointerEvents="none" style={styles.waveWrap}>
                    <WaveformMock
                      active={
                        voiceStatus === "listening" ||
                        voiceStatus === "thinking" ||
                        voiceStatus === "speaking"
                      }
                      bars={18}
                    />
                  </View>
                </View>
                <Text style={styles.visualHint}>{visualHint}</Text>
              </Pressable>
            </View>
          </GradientCard>

          {userTranscript || assistantTranscript ? (
            <GradientCard glow="secondary">
              <Text style={styles.panelLabel}>LIVE TRANSCRIPTS</Text>
              {userTranscript ? (
                <Text style={styles.transcriptUser}>You: {userTranscript}</Text>
              ) : null}
              {assistantTranscript ? (
                <Text style={styles.transcriptAssistant}>
                  PetAI: {assistantTranscript}
                </Text>
              ) : null}
            </GradientCard>
          ) : null}

          <GradientCard glow="secondary">
            <Text style={styles.panelLabel}>{t("IN-APP MUSIC")}</Text>
            <Text style={styles.musicBody}>
              {t("Ask PetAI to play, pause, or resume Apple Music inside the app.")}
            </Text>

            {musicTrack?.title ? (
              <View style={styles.musicRow}>
                {musicTrack.artworkUrl ? (
                  <Image
                    source={{ uri: musicTrack.artworkUrl }}
                    style={styles.musicArtwork}
                  />
                ) : (
                  <View style={styles.musicArtworkPlaceholder}>
                    <MaterialIcons
                      color={theme.colors.primary}
                      name="music-note"
                      size={22}
                    />
                  </View>
                )}

                <View style={styles.musicMeta}>
                  <Text style={styles.musicLabel}>{t("Now Playing")}</Text>
                  <Text style={styles.musicTitle}>{musicTrack.title}</Text>
                  <Text style={styles.musicArtist}>
                    {musicTrack.artistName || "Apple Music"}
                  </Text>
                </View>
              </View>
            ) : (
              <Text style={styles.musicEmpty}>{t("No music playing yet.")}</Text>
            )}

            {musicNote ? <Text style={styles.musicNote}>{musicNote}</Text> : null}

            <View style={styles.musicActions}>
              <Pressable
                disabled={musicBusy}
                onPress={() => {
                  void handleMusicIntent("pause music");
                }}
                style={({ pressed }) => [
                  styles.musicButton,
                  pressed && styles.visualAreaPressed,
                ]}
              >
                {musicBusy ? (
                  <ActivityIndicator color={theme.colors.primary} />
                ) : (
                  <Text style={styles.musicButtonLabel}>{t("Pause")}</Text>
                )}
              </Pressable>
              <Pressable
                disabled={musicBusy}
                onPress={() => {
                  void handleMusicIntent("resume music");
                }}
                style={({ pressed }) => [
                  styles.musicButton,
                  pressed && styles.visualAreaPressed,
                ]}
              >
                {musicBusy ? (
                  <ActivityIndicator color={theme.colors.primary} />
                ) : (
                  <Text style={styles.musicButtonLabel}>{t("Resume")}</Text>
                )}
              </Pressable>
            </View>
          </GradientCard>
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  chatButton: {
    width: 42,
    height: 42,
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
  heroCard: {
    gap: theme.spacing.lg,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  heroVoice: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2.6,
  },
  visualAreaButton: {
    alignItems: "center",
    alignSelf: "stretch",
    width: "100%",
  },
  visualAreaPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.988 }],
  },
  visualArea: {
    width: "100%",
    height: 420,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  glowOrb: {
    position: "absolute",
    width: 248,
    height: 248,
    borderRadius: theme.radii.full,
    backgroundColor: "rgba(165,231,255,0.08)",
  },
  ringOuter: {
    position: "absolute",
    width: 324,
    height: 324,
    borderRadius: theme.radii.full,
    borderWidth: 1,
    borderColor: "rgba(165,231,255,0.18)",
  },
  ringOrbit: {
    position: "absolute",
    width: 352,
    height: 352,
    borderRadius: theme.radii.full,
    borderTopWidth: 2,
    borderTopColor: "rgba(217,185,255,0.45)",
    borderRightWidth: 2,
    borderRightColor: "transparent",
    borderBottomWidth: 2,
    borderBottomColor: "rgba(165,231,255,0.2)",
    borderLeftWidth: 2,
    borderLeftColor: "transparent",
    opacity: 0.55,
  },
  avatarPlate: {
    width: 160,
    height: 160,
    borderRadius: theme.radii.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    zIndex: 2,
  },
  avatar: {
    width: 136,
    height: 136,
    borderRadius: theme.radii.full,
  },
  waveWrap: {
    position: "absolute",
    bottom: 56,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  visualHint: {
    marginTop: theme.spacing.sm,
    color: theme.colors.onSurfaceVariant,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  heroTitle: {
    color: theme.colors.onSurface,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "700",
  },
  heroBody: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 15,
    lineHeight: 22,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  sectionLabel: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.8,
  },
  sectionMeta: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.4,
  },
  voiceRail: {
    gap: theme.spacing.md,
    paddingRight: theme.spacing.lg,
  },
  panelLabel: {
    color: theme.colors.secondary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2.1,
    marginBottom: theme.spacing.sm,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  statusHeadline: {
    color: theme.colors.onSurface,
    fontSize: 22,
    fontWeight: "700",
  },
  statusTime: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  statusBody: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 14,
    lineHeight: 21,
    marginTop: theme.spacing.sm,
  },
  transcriptUser: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 14,
    lineHeight: 21,
  },
  transcriptAssistant: {
    color: theme.colors.onSurface,
    fontSize: 16,
    lineHeight: 23,
    marginTop: theme.spacing.sm,
    fontWeight: "600",
  },
  musicBody: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: theme.spacing.md,
  },
  musicRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  musicArtwork: {
    width: 68,
    height: 68,
    borderRadius: 18,
    backgroundColor: theme.colors.surfaceContainerHigh,
  },
  musicArtworkPlaceholder: {
    width: 68,
    height: 68,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  musicMeta: {
    flex: 1,
    gap: 4,
  },
  musicLabel: {
    color: theme.colors.secondary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.8,
  },
  musicTitle: {
    color: theme.colors.onSurface,
    fontSize: 18,
    fontWeight: "700",
  },
  musicArtist: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 14,
  },
  musicEmpty: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 14,
    lineHeight: 21,
  },
  musicNote: {
    color: theme.colors.primary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: theme.spacing.md,
  },
  musicActions: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  musicButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: theme.radii.full,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.03)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  musicButtonLabel: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: "700",
  },
  footer: {
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  helper: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  error: {
    color: theme.colors.error,
    fontSize: 14,
  },
});
