import {
  type ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { GlassCard } from "../../components/ui/GlassCard";
import { Icon } from "../../components/ui/Icon";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatePanel } from "../../components/ui/StatePanel";
import { WaveBars } from "../../components/ui/WaveBars";
import { localizePetSpecies } from "../../features/i18n/pet-localization";
import { useI18n } from "../../features/i18n/i18n-context";
import { getApiErrorMessage } from "../../lib/api/errors";
import {
  createPetVoiceClientSecret,
  fetchPet,
  fetchPetChat,
  fetchPets,
  fetchVoicePreview,
  fetchVoices,
  sendPetChatMessage,
  syncPetVoiceTurn,
  updatePet,
  uploadPetImage,
} from "../../lib/api/user";
import { getPetAvatar } from "../../lib/pet-visuals";
import type {
  Pet,
  PetChatReply,
  PetChatState,
  PetMemory,
  Voice,
} from "../../types";

type ChatMode = "text" | "voice";
type VoiceStatus =
  | "idle"
  | "connecting"
  | "listening"
  | "thinking"
  | "speaking"
  | "error";

export function SettingsPage() {
  const { locale, t } = useI18n();
  const { petId } = useParams();
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [form, setForm] = useState({
    name: "",
    species: "",
    breed: "",
    notes: "",
    voiceId: "",
  });
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [chatState, setChatState] = useState<PetChatState | null>(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatSending, setChatSending] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatError, setChatError] = useState<string | null>(null);
  const [chatMode, setChatMode] = useState<ChatMode>("text");
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>("idle");
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [voiceSyncedAt, setVoiceSyncedAt] = useState<string | null>(null);
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(
    null,
  );
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const pendingUserTranscriptRef = useRef<string | null>(null);
  const lastSyncedPairRef = useRef<string | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const previewObjectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    Promise.all([fetchPets(), fetchVoices()])
      .then(async ([data, activeVoices]) => {
        setVoices(activeVoices);
        setPets(data);
        const pet = petId
          ? ((await fetchPet(petId).catch(() => null)) ??
            data.find((entry) => entry.id === petId) ??
            null)
          : (data[0] ?? null);
        setSelectedPet(pet);
        if (pet) {
          setForm({
            name: pet.name,
            species: pet.species,
            breed: pet.breed ?? "",
            notes: pet.notes ?? "",
            voiceId: pet.voiceId ?? "",
          });
        }
      })
      .catch((nextError) =>
        setError(
          getApiErrorMessage(nextError, t("Unable to load pet settings.")),
        ),
      )
      .finally(() => setLoading(false));
  }, [petId]);

  useEffect(() => {
    setVoiceSupported(
      typeof window !== "undefined" &&
        typeof window.RTCPeerConnection !== "undefined" &&
        typeof navigator !== "undefined" &&
        !!navigator.mediaDevices?.getUserMedia,
    );
  }, []);

  useEffect(() => {
    if (!selectedPet) {
      setChatState(null);
      return;
    }

    setChatLoading(true);
    setChatError(null);

    fetchPetChat(selectedPet.id)
      .then(setChatState)
      .catch((nextError) =>
        setChatError(
          getApiErrorMessage(nextError, t("Unable to load pet conversation.")),
        ),
      )
      .finally(() => setChatLoading(false));
  }, [selectedPet?.id]);

  useEffect(
    () => () => {
      void stopVoiceChat();
      stopVoicePreview();
    },
    [],
  );

  function stopVoicePreview() {
    previewAudioRef.current?.pause();
    previewAudioRef.current = null;
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
      previewObjectUrlRef.current = null;
    }
    setPreviewingVoiceId(null);
  }

  function selectPet(petId: string) {
    const pet = pets.find((entry) => entry.id === petId) ?? null;
    setSelectedPet(pet);
    if (pet) {
      setForm({
        name: pet.name,
        species: pet.species,
        breed: pet.breed ?? "",
        notes: pet.notes ?? "",
        voiceId: pet.voiceId ?? "",
      });
    }
  }

  function applyChatReply(reply: PetChatReply) {
    setChatState((current) => {
      if (!current) return current;
      return {
        ...current,
        conversation: {
          ...current.conversation,
          id: reply.conversationId,
          summary: reply.summary,
          messages: [
            ...current.conversation.messages,
            reply.userMessage,
            reply.assistantMessage,
          ],
        },
        memories: reply.memories,
      };
    });
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!selectedPet) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updated = await updatePet(selectedPet.id, form);
      setSelectedPet(updated);
      setPets((current) =>
        current.map((pet) => (pet.id === updated.id ? updated : pet)),
      );
      setSuccess(t("Pet identity updated."));
    } catch (nextError) {
      setError(
        getApiErrorMessage(nextError, t("Unable to save pet settings.")),
      );
    } finally {
      setSaving(false);
    }
  }

  async function onUploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !selectedPet) return;

    setUploadingImage(true);
    setError(null);
    setSuccess(null);

    try {
      const updated = await uploadPetImage(selectedPet.id, file);
      setSelectedPet(updated);
      setPets((current) =>
        current.map((pet) => (pet.id === updated.id ? updated : pet)),
      );
      setSuccess(t("Pet image uploaded."));
    } catch (nextError) {
      setError(getApiErrorMessage(nextError, t("Unable to upload pet image.")));
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  }

  async function onSendChat(event: FormEvent) {
    event.preventDefault();
    if (!selectedPet || !chatInput.trim()) return;

    const message = chatInput.trim();
    setChatSending(true);
    setChatError(null);

    try {
      const reply = await sendPetChatMessage(selectedPet.id, { message });
      setChatInput("");
      applyChatReply(reply);
    } catch (nextError) {
      setChatError(
        getApiErrorMessage(nextError, t("Unable to send chat message.")),
      );
    } finally {
      setChatSending(false);
    }
  }

  async function playVoicePreview(voiceId: string) {
    if (!voiceId) return;

    setChatError(null);

    try {
      stopVoicePreview();
      setForm((current) => ({
        ...current,
        voiceId,
      }));
      setPreviewingVoiceId(voiceId);

      const blob = await fetchVoicePreview(voiceId);
      const objectUrl = URL.createObjectURL(blob);
      const audio = new Audio(objectUrl);

      previewObjectUrlRef.current = objectUrl;
      previewAudioRef.current = audio;
      audio.onended = () => {
        setPreviewingVoiceId(null);
      };
      audio.onerror = () => {
        setPreviewingVoiceId(null);
        setChatError(t("Unable to play voice preview."));
      };

      await audio.play();
    } catch (nextError) {
      stopVoicePreview();
      setChatError(
        getApiErrorMessage(nextError, t("Unable to play voice preview.")),
      );
    }
  }

  async function startVoiceChat() {
    if (!selectedPet || !voiceSupported || peerConnectionRef.current) return;

    setChatMode("voice");
    setVoiceStatus("connecting");
    setChatError(null);
    pendingUserTranscriptRef.current = null;
    lastSyncedPairRef.current = null;

    try {
      const selectedVoiceName =
        voices.find((voice) => voice.id === form.voiceId)?.name ??
        selectedPet.voice?.name ??
        undefined;
      const clientSecret = await createPetVoiceClientSecret(selectedPet.id, {
        voice: selectedVoiceName,
      });
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const peerConnection = new RTCPeerConnection();
      const remoteAudio = new Audio();
      remoteAudio.autoplay = true;
      remoteAudioRef.current = remoteAudio;
      mediaStreamRef.current = mediaStream;
      peerConnectionRef.current = peerConnection;

      mediaStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, mediaStream);
      });

      peerConnection.ontrack = (event) => {
        remoteAudio.srcObject = event.streams[0];
        setVoiceStatus("speaking");
      };

      peerConnection.onconnectionstatechange = () => {
        if (peerConnection.connectionState === "connected") {
          setVoiceStatus("listening");
        }
        if (
          peerConnection.connectionState === "failed" ||
          peerConnection.connectionState === "disconnected" ||
          peerConnection.connectionState === "closed"
        ) {
          setVoiceStatus("idle");
        }
      };

      const dataChannel = peerConnection.createDataChannel("oai-events");
      dataChannelRef.current = dataChannel;
      dataChannel.onmessage = (event) => {
        handleRealtimeEvent(event.data);
      };

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      const response = await fetch("https://api.openai.com/v1/realtime/calls", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${clientSecret.value}`,
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

      setVoiceStatus("listening");
    } catch (nextError) {
      await stopVoiceChat();
      setVoiceStatus("error");
      setChatError(
        getApiErrorMessage(nextError, t("Unable to start voice chat.")),
      );
    }
  }

  async function stopVoiceChat() {
    dataChannelRef.current?.close();
    dataChannelRef.current = null;
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    if (remoteAudioRef.current) {
      remoteAudioRef.current.pause();
      remoteAudioRef.current.srcObject = null;
      remoteAudioRef.current = null;
    }
    pendingUserTranscriptRef.current = null;
    lastSyncedPairRef.current = null;
    setVoiceStatus("idle");
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
      const event = JSON.parse(rawEvent) as {
        type?: string;
        transcript?: string;
      };

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
            pendingUserTranscriptRef.current = event.transcript.trim();
          }
          break;
        case "response.output_audio_transcript.done":
          if (event.transcript?.trim()) {
            void syncVoiceTranscript(event.transcript.trim());
          }
          break;
        case "response.done":
          setVoiceStatus("listening");
          break;
        default:
          break;
      }
    } catch {
      // Ignore non-JSON channel messages from the realtime transport.
    }
  }

  async function syncVoiceTranscript(assistantTranscript: string) {
    if (!selectedPet) return;

    const userTranscript = pendingUserTranscriptRef.current?.trim();
    if (!userTranscript) return;

    const pairKey = `${userTranscript}\n---\n${assistantTranscript}`;
    if (lastSyncedPairRef.current === pairKey) return;

    lastSyncedPairRef.current = pairKey;
    pendingUserTranscriptRef.current = null;

    try {
      const reply = await syncPetVoiceTurn(selectedPet.id, {
        userTranscript,
        assistantTranscript,
      });
      applyChatReply(reply);
      setVoiceSyncedAt(new Date().toLocaleTimeString());
    } catch (nextError) {
      setChatError(
        getApiErrorMessage(nextError, t("Unable to sync voice memory.")),
      );
    }
  }

  function getMemoryTone(memory: PetMemory["kind"]) {
    switch (memory) {
      case "PREFERENCE":
        return "bg-primary/10 text-primary";
      case "RELATIONSHIP":
        return "bg-secondary/15 text-secondary";
      case "ROUTINE":
        return "bg-primary-container/20 text-on-surface";
      case "PROFILE":
        return "bg-surface-container text-on-surface";
      default:
        return "bg-white/8 text-on-surface-variant";
    }
  }

  const voiceStatusLabel =
    voiceStatus === "connecting"
      ? t("Connecting...")
      : voiceStatus === "listening"
        ? t("Listening")
        : voiceStatus === "thinking"
          ? t("Thinking")
          : voiceStatus === "speaking"
            ? t("Speaking")
            : voiceStatus === "error"
              ? t("Voice unavailable")
              : t("Voice ready");

  return (
    <div>
      <PageHeader
        description="Pet identity and voice tuning from the Stitch settings views, now consolidated into reusable setting panels."
        title={t("Pet Identity")}
      />
      {loading ? (
        <StatePanel
          message={t("Loading your pet profile.")}
          title={t("Loading settings")}
        />
      ) : null}
      {error ? (
        <div className="mb-6">
          <StatePanel
            message={error}
            title={t("Could not load settings")}
            tone="error"
          />
        </div>
      ) : null}
      {!loading && !selectedPet ? (
        <StatePanel
          message={t(
            "Create a pet profile first to manage identity settings here.",
          )}
          title={t("No pet selected")}
        />
      ) : null}
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-4">
          <GlassCard className="p-8 text-center">
            <img
              alt="Pet avatar"
              className="mx-auto h-40 w-40 rounded-full border-2 border-primary/30 object-cover"
              src={selectedPet ? getPetAvatar(selectedPet) : undefined}
            />
            <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/15">
              <Icon name="upload" />
              {uploadingImage ? t("Uploading...") : t("Upload Pet Image")}
              <input
                accept="image/*"
                className="hidden"
                disabled={!selectedPet || uploadingImage}
                onChange={onUploadImage}
                type="file"
              />
            </label>
            <h2 className="mt-6 text-3xl font-bold">
              {selectedPet?.name ?? "No pet"}
            </h2>
            <p className="mono-label mt-1 text-primary">
              {selectedPet?.id ?? "Unassigned"}
            </p>
            <div className="mt-8 space-y-4 border-t border-white/8 pt-8 text-left">
              {[
                ["Species", localizePetSpecies(selectedPet?.species ?? "Unknown", locale)],
                [
                  "Emotional Resonance",
                  selectedPet?.notes ? "Configured" : "Learning",
                ],
                [
                  "Primary Voice",
                  voices.find((voice) => voice.id === form.voiceId)?.name ??
                    selectedPet?.voice?.name ??
                    "Unassigned",
                ],
              ].map(([label, value]) => (
                <div className="flex items-center justify-between" key={label}>
                  <span className="text-on-surface-variant">{label}</span>
                  <span className="font-semibold">{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-4 border-t border-white/8 pt-8 text-left">
              {pets.length > 1 ? (
                <div className="mb-6">
                  <label className="block">
                    <span className="mono-label mb-2 block text-on-surface-variant">
                      Active Pet
                    </span>
                    <select
                      className="field"
                      onChange={(e) => selectPet(e.target.value)}
                      value={selectedPet?.id ?? ""}
                    >
                      {pets.map((pet) => (
                        <option key={pet.id} value={pet.id}>
                          {pet.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              ) : null}
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon name="pets" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{t("Pet Identity")}</h3>
                  <p className="text-sm text-on-surface-variant">
                    Core identity settings for this companion profile.
                  </p>
                </div>
              </div>
              <form className="space-y-5" onSubmit={onSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mono-label mb-2 block text-on-surface-variant">
                      Pet Name
                    </span>
                    <input
                      className="field"
                      onChange={(e) =>
                        setForm((current) => ({
                          ...current,
                          name: e.target.value,
                        }))
                      }
                      value={form.name}
                    />
                  </label>
                  <label className="block">
                    <span className="mono-label mb-2 block text-on-surface-variant">
                      Species
                    </span>
                    <input
                      className="field"
                      onChange={(e) =>
                        setForm((current) => ({
                          ...current,
                          species: e.target.value,
                        }))
                      }
                      value={form.species}
                    />
                  </label>
                  <div className="block md:col-span-2">
                    <span className="mono-label mb-2 block text-on-surface-variant">
                      Assigned Voice
                    </span>
                    <div className="rounded-[28px] md:col-span-2">
                      <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
                        {voices.map((voice) => {
                          const isSelected = form.voiceId === voice.id;
                          const isPreviewing = previewingVoiceId === voice.id;

                          return (
                            <div
                              className={`relative min-w-[220px] flex-1 rounded-[30px] border p-5 text-left transition ${
                                isSelected
                                  ? "border-primary/60 bg-[#1e2529] shadow-[0_0_0_1px_rgba(146,217,255,0.2)]"
                                  : "border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                              }`}
                              key={voice.id}
                              onClick={() => {
                                stopVoicePreview();
                                setForm((current) => ({
                                  ...current,
                                  voiceId: voice.id,
                                }));
                              }}
                              role="button"
                              tabIndex={0}
                            >
                              {isSelected ? (
                                <span className="absolute right-4 top-4 h-3 w-3 rounded-full bg-primary shadow-[0_0_16px_rgba(146,217,255,0.9)]" />
                              ) : null}
                              <div className="flex justify-center pt-2">
                                <button
                                  className={`flex h-20 w-20 items-center justify-center rounded-full border transition ${
                                    isSelected
                                      ? "border-primary/30 bg-primary/15 text-primary"
                                      : "border-white/10 bg-black/20 text-on-surface"
                                  }`}
                                  disabled={isPreviewing}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    void playVoicePreview(voice.id);
                                  }}
                                  type="button"
                                >
                                  <Icon
                                    className="text-[42px]"
                                    name={
                                      isPreviewing
                                        ? "pause_circle"
                                        : "play_circle"
                                    }
                                  />
                                </button>
                              </div>
                              <div className="mt-6 text-center">
                                <p
                                  className={`text-3xl font-semibold tracking-tight ${
                                    isSelected
                                      ? "text-primary"
                                      : "text-on-surface"
                                  }`}
                                >
                                  {voice.name}
                                </p>
                                <p className="mt-3 text-sm uppercase tracking-[0.35em] text-on-surface-variant">
                                  {voice.tone}
                                </p>
                                <p className="mt-2 text-xs text-on-surface-variant/80">
                                  {voice.locale}
                                </p>
                              </div>
                              <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/8">
                                <div
                                  className={`h-full rounded-full bg-gradient-to-r from-primary via-primary to-secondary transition-all ${
                                    isSelected ? "w-full" : "w-2/3 opacity-70"
                                  }`}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <label className="block md:col-span-2">
                    <span className="mono-label mb-2 block text-on-surface-variant">
                      Breed
                    </span>
                    <input
                      className="field"
                      onChange={(e) =>
                        setForm((current) => ({
                          ...current,
                          breed: e.target.value,
                        }))
                      }
                      value={form.breed}
                    />
                  </label>
                  <label className="block md:col-span-2">
                    <span className="mono-label mb-2 block text-on-surface-variant">
                      Notes
                    </span>
                    <textarea
                      className="field min-h-28 resize-none"
                      onChange={(e) =>
                        setForm((current) => ({
                          ...current,
                          notes: e.target.value,
                        }))
                      }
                      value={form.notes}
                    />
                  </label>
                </div>
                {success ? (
                  <StatePanel message={success} title="Saved" />
                ) : null}
                <button
                  className="btn-primary w-full"
                  disabled={!selectedPet || saving}
                  type="submit"
                >
                  <Icon name="save" />
                  {saving ? t("Saving...") : t("Save Identity")}
                </button>
              </form>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-8 lg:col-span-8">
          <GlassCard className="p-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">{t("Pet Conversation")}</h3>
                <p className="text-sm text-on-surface-variant">
                  Persistent per-pet memory powered by{" "}
                  {chatState?.config.textModel ?? "gpt-5.4-mini"} and{" "}
                  {chatState?.config.memoryModel ?? "gpt-5.4-nano"}.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${chatMode === "text" ? "bg-primary text-surface" : "bg-white/6 text-on-surface-variant"}`}
                  onClick={() => setChatMode("text")}
                  type="button"
                >
                  {t("Text Chat")}
                </button>
                <button
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${chatMode === "voice" ? "bg-primary text-surface" : "bg-white/6 text-on-surface-variant"}`}
                  onClick={() => setChatMode("voice")}
                  type="button"
                >
                  {t("Voice Chat")}
                </button>
              </div>
            </div>

            {chatLoading ? (
              <StatePanel
                message={t("Loading conversation memory for this pet.")}
                title={t("Loading chat")}
              />
            ) : null}
            {chatError ? (
              <div className="mb-4">
                <StatePanel
                  message={chatError}
                  title={t("Chat issue")}
                  tone="error"
                />
              </div>
            ) : null}

            {!chatLoading && chatState ? (
              <div className="space-y-6">
                <div className="rounded-[28px] border border-white/8 bg-black/10 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="mono-label text-[10px] text-on-surface-variant">
                        {t("Relationship Memory")}
                      </p>
                      <p className="mt-1 text-sm text-on-surface-variant">
                        {chatState.conversation.summary ||
                          t(
                            "No summary yet. Start talking to shape this pet's memory.",
                          )}
                      </p>
                    </div>
                    <span className="mono-label text-primary">
                      {chatState.conversation.messages.length} msgs
                    </span>
                  </div>

                  <div className="max-h-[320px] space-y-3 overflow-y-auto pr-1">
                    {chatState.conversation.messages.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-center text-sm text-on-surface-variant">
                        {t("This pet is ready for its first conversation.")}
                      </div>
                    ) : (
                      chatState.conversation.messages.map((message) => (
                        <div
                          className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                            message.role === "user"
                              ? "ml-auto bg-primary text-surface"
                              : message.role === "assistant"
                                ? "bg-white/8 text-on-surface"
                                : "bg-surface-container text-on-surface-variant"
                          }`}
                          key={message.id}
                        >
                          <div className="mb-1 flex items-center justify-between gap-4">
                            <span className="mono-label text-[10px] uppercase opacity-80">
                              {message.role}
                            </span>
                            {message.model ? (
                              <span className="mono-label text-[10px] opacity-60">
                                {message.model}
                              </span>
                            ) : null}
                          </div>
                          <p className="whitespace-pre-wrap">
                            {message.content}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {chatMode === "text" ? (
                  <form className="space-y-4" onSubmit={onSendChat}>
                    <label className="block">
                      <span className="mono-label mb-2 block text-on-surface-variant">
                        {t("Message your pet")}
                      </span>
                      <textarea
                        className="field min-h-28 resize-none"
                        disabled={!selectedPet || chatSending}
                        onChange={(event) => setChatInput(event.target.value)}
                        placeholder={t(
                          "Share a thought, ask a question, or check in with your pet...",
                        )}
                        value={chatInput}
                      />
                    </label>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-wrap gap-2">
                        {chatState.memories.slice(0, 4).map((memory) => (
                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-semibold ${getMemoryTone(memory.kind)}`}
                            key={memory.id}
                          >
                            {memory.kind}: {memory.content}
                          </span>
                        ))}
                      </div>
                      <button
                        className="btn-primary shrink-0"
                        disabled={
                          !selectedPet || chatSending || !chatInput.trim()
                        }
                        type="submit"
                      >
                        <Icon name="send" />
                        {chatSending ? t("Sending...") : t("Send")}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-5">
                    <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <p className="mono-label text-[10px] text-on-surface-variant">
                            {t("Realtime Voice")}
                          </p>
                          <h4 className="mt-1 text-lg font-bold text-on-surface">
                            {chatState.config.realtimeModel}
                          </h4>
                        </div>
                        <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          {voiceStatusLabel}
                        </span>
                      </div>
                      <WaveBars
                        className={`h-12 ${voiceStatus === "speaking" || voiceStatus === "listening" ? "opacity-100" : "opacity-40"}`}
                      />
                      <p className="mt-4 text-sm text-on-surface-variant">
                        {voiceSupported
                          ? t(
                              "Start a low-latency voice session. Transcript turns are synced back into this pet's long-term memory.",
                            )
                          : t(
                              "Your browser does not support the realtime voice flow needed here.",
                            )}
                      </p>
                      {voiceSyncedAt ? (
                        <p className="mt-2 text-xs text-primary">
                          {t("Latest voice memory synced at")} {voiceSyncedAt}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex gap-3">
                      <button
                        className="btn-primary"
                        disabled={
                          !selectedPet ||
                          !voiceSupported ||
                          voiceStatus === "connecting" ||
                          !!peerConnectionRef.current
                        }
                        onClick={() => void startVoiceChat()}
                        type="button"
                      >
                        <Icon name="mic" />
                        {voiceStatus === "connecting"
                          ? t("Connecting...")
                          : t("Start Voice Chat")}
                      </button>
                      <button
                        className="btn-secondary rounded-2xl border border-white/10 px-5 py-3 font-semibold text-on-surface transition hover:bg-white/6 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={!peerConnectionRef.current}
                        onClick={() => void stopVoiceChat()}
                        type="button"
                      >
                        <Icon name="call_end" />
                        {t("End Voice Chat")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
