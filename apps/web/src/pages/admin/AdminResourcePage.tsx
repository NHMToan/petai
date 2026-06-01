import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { DataTable } from "../../components/ui/DataTable";
import { GlassCard } from "../../components/ui/GlassCard";
import { Icon } from "../../components/ui/Icon";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatePanel } from "../../components/ui/StatePanel";
import { useI18n } from "../../features/i18n/i18n-context";
import {
  createAdminPet,
  createAdminDevice,
  createAdminVoice,
  fetchAdminVoicePreview,
  deleteAdminVoice,
  deleteAdminPet,
  fetchAdminDevices,
  fetchAdminPets,
  fetchAdminUsers,
  fetchAdminVoices,
  updateAdminDevice,
  updateAdminPet,
  updateAdminVoice,
} from "../../lib/api/admin";
import { getApiErrorMessage } from "../../lib/api/errors";
import { getPetAvatar } from "../../lib/pet-visuals";
import { uploadPetImage } from "../../lib/api/user";
import type { AdminUser, Device, Pet, TableColumn, Voice } from "../../types";

type ResourceName = "devices" | "pets" | "users" | "voices";

type Row = Record<string, string> & { id: string };

type ActionMenuState = {
  id: string;
  top: number;
  left: number;
} | null;

const resourceConfig: Record<ResourceName, { title: string; description: string }> = {
  devices: {
    title: "Device Inventory",
    description: "Hardware assignment, inventory status, and firmware visibility from the exported admin devices screen.",
  },
  pets: {
    title: "Pet Management",
    description: "Operational list of active pets, owners, and linked voice profiles.",
  },
  users: {
    title: "Users Management",
    description: "Platform users, plans, and lifecycle metadata.",
  },
  voices: {
    title: "Voice Management",
    description: "AI-generated vocal profiles for translation and emotional resonance layers.",
  },
};

type PetFormState = {
  name: string;
  species: string;
  breed: string;
  notes: string;
  userId: string;
  voiceId: string;
  deviceId: string;
};

const emptyPetForm: PetFormState = {
  name: "",
  species: "Companion",
  breed: "",
  notes: "",
  userId: "",
  voiceId: "",
  deviceId: "",
};

type DeviceFormState = {
  name: string;
  serialNumber: string;
  productCode: string;
  status: string;
};

const emptyDeviceForm: DeviceFormState = {
  name: "",
  serialNumber: "",
  productCode: "",
  status: "AVAILABLE",
};

type VoiceFormState = {
  name: string;
  description: string;
  tone: string;
  locale: string;
  version: string;
  isActive: boolean;
};

const emptyVoiceForm: VoiceFormState = {
  name: "",
  description: "",
  tone: "Warm",
  locale: "vi-VN",
  version: "v1",
  isActive: true,
};

const supportedRealtimeVoiceOptions = [
  { value: "marin", label: "marin", helper: "Best quality" },
  { value: "cedar", label: "cedar", helper: "Best quality" },
  { value: "alloy", label: "alloy", helper: "Balanced" },
  { value: "ash", label: "ash", helper: "Clear" },
  { value: "ballad", label: "ballad", helper: "Soft" },
  { value: "coral", label: "coral", helper: "Bright" },
  { value: "echo", label: "echo", helper: "Neutral" },
  { value: "sage", label: "sage", helper: "Calm" },
  { value: "shimmer", label: "shimmer", helper: "Light" },
  { value: "verse", label: "verse", helper: "Expressive" },
] as const;

const toneOptions = [
  "Warm",
  "Playful",
  "Calm",
  "Gentle",
  "Bright",
  "Confident",
  "Cheerful",
  "Soothing",
] as const;

const localeOptions = [
  "vi-VN",
  "en-US",
  "en-GB",
  "ja-JP",
  "ko-KR",
  "zh-CN",
] as const;

const versionOptions = ["v1", "v2", "v3"] as const;

function PetModal({
  availableDevices,
  devices,
  form,
  imagePreview,
  onChange,
  onImageChange,
  onClose,
  onSubmit,
  owners,
  saving,
  selectedImageName,
  title,
  voices,
}: {
  availableDevices: Device[];
  devices: Device[];
  form: PetFormState;
  imagePreview?: string | null;
  onChange: (key: keyof PetFormState, value: string) => void;
  onImageChange: (file: File | null) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void;
  owners: AdminUser[];
  saving: boolean;
  selectedImageName?: string | null;
  title: string;
  voices: Voice[];
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-[28px] border border-white/10 bg-[#1f1e1f]/95 p-8 shadow-[0_25px_100px_rgba(0,0,0,0.45)]">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h3 className="text-3xl font-bold text-on-surface">{title}</h3>
            <p className="mt-2 text-sm text-on-surface-variant">Provision pet defaults before the device is claimed by an end user.</p>
          </div>
          <button className="icon-button" onClick={onClose} type="button">
            <Icon name="close" />
          </button>
        </div>

        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="flex items-center gap-5 rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <img
              alt="Pet preview"
              className="h-24 w-24 rounded-2xl border border-white/10 object-cover"
              src={imagePreview ?? "https://placehold.co/240x240/1f1e1f/e5e2e1?text=Pet"}
            />
            <div className="flex-1">
              <p className="mb-2 font-semibold text-on-surface">Pet Image</p>
              <p className="mb-3 text-sm text-on-surface-variant">Upload the default pet portrait that users will see after claiming.</p>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/15">
                <Icon name="upload" />
                Choose Image
                <input
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => onImageChange(event.target.files?.[0] ?? null)}
                  type="file"
                />
              </label>
              <p className="mt-3 text-xs text-on-surface-variant">{selectedImageName ?? "No new image selected"}</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mono-label mb-2 block text-on-surface-variant">PET NAME</span>
              <input className="field" onChange={(event) => onChange("name", event.target.value)} required value={form.name} />
            </label>
            <label className="block">
              <span className="mono-label mb-2 block text-on-surface-variant">SPECIES</span>
              <input className="field" onChange={(event) => onChange("species", event.target.value)} required value={form.species} />
            </label>
            <label className="block">
              <span className="mono-label mb-2 block text-on-surface-variant">BREED</span>
              <input className="field" onChange={(event) => onChange("breed", event.target.value)} value={form.breed} />
            </label>
            <label className="block">
              <span className="mono-label mb-2 block text-on-surface-variant">OWNER</span>
              <select className="field" onChange={(event) => onChange("userId", event.target.value)} value={form.userId}>
                <option value="">Unassigned</option>
                {owners.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name} · {owner.email}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mono-label mb-2 block text-on-surface-variant">VOICE</span>
              <select className="field" onChange={(event) => onChange("voiceId", event.target.value)} value={form.voiceId}>
                <option value="">Unassigned</option>
                {voices.map((voice) => (
                  <option key={voice.id} value={voice.id}>
                    {voice.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mono-label mb-2 block text-on-surface-variant">DEVICE</span>
              <select className="field" onChange={(event) => onChange("deviceId", event.target.value)} value={form.deviceId}>
                <option value="">Not linked</option>
                {availableDevices.map((device) => (
                  <option key={device.id} value={device.id}>
                    {device.serialNumber} · {device.name}
                  </option>
                ))}
              </select>
              <span className="mt-2 block text-xs text-on-surface-variant">
                Only devices without another provisioned pet are selectable.
              </span>
            </label>
            <label className="block md:col-span-2">
              <span className="mono-label mb-2 block text-on-surface-variant">NOTES</span>
              <textarea className="field min-h-32 resize-none" onChange={(event) => onChange("notes", event.target.value)} value={form.notes} />
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button className="btn-secondary" onClick={onClose} type="button">
              Cancel
            </button>
            <button className="btn-primary" disabled={saving} type="submit">
              <Icon name="save" />
              {saving ? "Saving..." : "Save Pet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeviceModal({
  form,
  onChange,
  onClose,
  onSubmit,
  saving,
  title,
}: {
  form: DeviceFormState;
  onChange: (key: keyof DeviceFormState, value: string) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void;
  saving: boolean;
  title: string;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[28px] border border-white/10 bg-[#1f1e1f]/95 p-8 shadow-[0_25px_100px_rgba(0,0,0,0.45)]">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h3 className="text-3xl font-bold text-on-surface">{title}</h3>
            <p className="mt-2 text-sm text-on-surface-variant">Register new hardware units before provisioning pets to them.</p>
          </div>
          <button className="icon-button" onClick={onClose} type="button">
            <Icon name="close" />
          </button>
        </div>

        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="mono-label mb-2 block text-on-surface-variant">DEVICE NAME</span>
              <input className="field" onChange={(event) => onChange("name", event.target.value)} required value={form.name} />
            </label>
            <label className="block">
              <span className="mono-label mb-2 block text-on-surface-variant">SERIAL NUMBER</span>
              <input className="field" onChange={(event) => onChange("serialNumber", event.target.value.toUpperCase())} required value={form.serialNumber} />
            </label>
            <label className="block">
              <span className="mono-label mb-2 block text-on-surface-variant">PRODUCT CODE</span>
              <input className="field" onChange={(event) => onChange("productCode", event.target.value.toUpperCase())} required value={form.productCode} />
            </label>
            <label className="block md:col-span-2">
              <span className="mono-label mb-2 block text-on-surface-variant">STATUS</span>
              <select className="field" onChange={(event) => onChange("status", event.target.value)} value={form.status}>
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="CLAIMED">CLAIMED</option>
                <option value="DISABLED">DISABLED</option>
              </select>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button className="btn-secondary" onClick={onClose} type="button">
              Cancel
            </button>
            <button className="btn-primary" disabled={saving} type="submit">
              <Icon name="save" />
              {saving ? "Saving..." : "Save Device"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function VoiceModal({
  form,
  onChange,
  onClose,
  onSubmit,
  saving,
  title,
}: {
  form: VoiceFormState;
  onChange: (key: keyof VoiceFormState, value: string | boolean) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void;
  saving: boolean;
  title: string;
}) {
  const hasLegacyVoice = !!form.name && !supportedRealtimeVoiceOptions.some((option) => option.value === form.name);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[28px] border border-white/10 bg-[#1f1e1f]/95 p-8 shadow-[0_25px_100px_rgba(0,0,0,0.45)]">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h3 className="text-3xl font-bold text-on-surface">{title}</h3>
            <p className="mt-2 text-sm text-on-surface-variant">Manage the voice profiles that end users can assign to their pets.</p>
          </div>
          <button className="icon-button" onClick={onClose} type="button">
            <Icon name="close" />
          </button>
        </div>

        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mono-label mb-2 block text-on-surface-variant">VOICE NAME</span>
              <select className="field" onChange={(event) => onChange("name", event.target.value)} required value={form.name}>
                <option value="">Select a voice</option>
                {hasLegacyVoice ? <option value={form.name}>{form.name} (legacy)</option> : null}
                {supportedRealtimeVoiceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} · {option.helper}
                  </option>
                ))}
              </select>
              <span className="mt-2 block text-xs text-on-surface-variant">
                Use a built-in OpenAI realtime voice so preview and voice chat stay aligned.
              </span>
            </label>
            <label className="block">
              <span className="mono-label mb-2 block text-on-surface-variant">TONE</span>
              <select className="field" onChange={(event) => onChange("tone", event.target.value)} required value={form.tone}>
                {toneOptions.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mono-label mb-2 block text-on-surface-variant">LOCALE</span>
              <select className="field" onChange={(event) => onChange("locale", event.target.value)} required value={form.locale}>
                {localeOptions.map((locale) => (
                  <option key={locale} value={locale}>
                    {locale}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mono-label mb-2 block text-on-surface-variant">VERSION</span>
              <select className="field" onChange={(event) => onChange("version", event.target.value)} required value={form.version}>
                {versionOptions.map((version) => (
                  <option key={version} value={version}>
                    {version}
                  </option>
                ))}
              </select>
            </label>
            <label className="block md:col-span-2">
              <span className="mono-label mb-2 block text-on-surface-variant">DESCRIPTION</span>
              <textarea className="field min-h-28 resize-none" onChange={(event) => onChange("description", event.target.value)} placeholder="Optional note shown to admins and users, for example: Calm Vietnamese bedside companion voice." value={form.description} />
            </label>
            <label className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-4 md:col-span-2">
              <div>
                <p className="font-semibold text-on-surface">Enabled For Users</p>
                <p className="mt-1 text-sm text-on-surface-variant">Only enabled voices appear in the pet voice selector.</p>
              </div>
              <button
                aria-pressed={form.isActive}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${form.isActive ? "bg-primary text-surface" : "bg-white/8 text-on-surface-variant"}`}
                onClick={() => onChange("isActive", !form.isActive)}
                type="button"
              >
                {form.isActive ? "Enabled" : "Disabled"}
              </button>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button className="btn-secondary" onClick={onClose} type="button">
              Cancel
            </button>
            <button className="btn-primary" disabled={saving} type="submit">
              <Icon name="save" />
              {saving ? "Saving..." : "Save Voice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PetDetailsModal({
  onClose,
  pet,
}: {
  onClose: () => void;
  pet: Pet;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[28px] border border-white/10 bg-[#1f1e1f]/95 p-8 shadow-[0_25px_100px_rgba(0,0,0,0.45)]">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h3 className="text-3xl font-bold text-on-surface">Pet Details</h3>
            <p className="mt-2 text-sm text-on-surface-variant">Provisioned profile snapshot for this pet.</p>
          </div>
          <button className="icon-button" onClick={onClose} type="button">
            <Icon name="close" />
          </button>
        </div>

        <div className="grid gap-8 md:grid-cols-[120px_1fr]">
          <img
            alt={pet.name}
            className="h-[120px] w-[120px] rounded-2xl border border-white/10 object-cover"
            src={getPetAvatar(pet)}
          />
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Name", pet.name],
              ["Species", pet.species],
              ["Breed", pet.breed ?? "Unassigned"],
              ["Owner", pet.owner?.name ?? "Unassigned"],
              ["Voice", pet.voice?.name ?? "Unassigned"],
              ["Device", pet.device?.serialNumber ?? "None"],
            ].map(([label, value]) => (
              <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4" key={label}>
                <p className="mono-label mb-2 text-on-surface-variant">{label}</p>
                <p className="font-semibold text-on-surface">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/8 bg-white/[0.02] p-4">
          <p className="mono-label mb-2 text-on-surface-variant">Notes</p>
          <p className="text-sm leading-7 text-on-surface-variant">{pet.notes || "No notes provided."}</p>
        </div>
      </div>
    </div>
  );
}

export function AdminResourcePage({ resource }: { resource: ResourceName }) {
  const { t } = useI18n();
  const [rows, setRows] = useState<Row[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [editingVoice, setEditingVoice] = useState<Voice | null>(null);
  const [detailPet, setDetailPet] = useState<Pet | null>(null);
  const [actionMenu, setActionMenu] = useState<ActionMenuState>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<PetFormState>(emptyPetForm);
  const [deviceForm, setDeviceForm] = useState<DeviceFormState>(emptyDeviceForm);
  const [voiceForm, setVoiceForm] = useState<VoiceFormState>(emptyVoiceForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const previewObjectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const fetcher = {
      devices: async () =>
        (await fetchAdminDevices()).map((device) => ({
          id: device.id,
          name: device.name,
          serialNumber: device.serialNumber,
          productCode: device.productCode,
          status: device.status,
          claimedBy: device.claimedBy?.name ?? "Unassigned",
          pets: device.pets?.map((pet) => pet.name).join(", ") || "None",
        })),
      pets: async () =>
        (await fetchAdminPets()).map((pet) => ({
          id: pet.id,
          name: pet.name,
          species: pet.species,
          owner: pet.owner?.name ?? "Unassigned",
          voice: pet.voice?.name ?? "Unassigned",
          device: pet.device?.serialNumber ?? "None",
        })),
      users: async () =>
        (await fetchAdminUsers()).map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          pets: String(user._count?.pets ?? 0),
          devices: String(user._count?.devices ?? 0),
        })),
      voices: async () =>
        fetchAdminVoices().then((voiceData) => {
          setVoices(voiceData);
          return voiceData.map((voice) => ({
            id: voice.id,
            name: voice.name,
            tone: voice.tone,
            locale: voice.locale,
            version: voice.version,
            status: voice.isActive ? "Enabled" : "Disabled",
            pets: String(voice._count?.pets ?? 0),
          }));
        }),
    }[resource];

    setLoading(true);
    setError(null);

    (resource === "pets"
      ? Promise.all([fetchAdminPets(), fetchAdminDevices(), fetchAdminVoices(), fetchAdminUsers()]).then(([petData, deviceData, voiceData, userData]) => {
          setPets(petData);
          setDevices(deviceData);
          setVoices(voiceData);
          setUsers(userData);
          return petData.map((pet) => ({
            id: pet.id,
            name: pet.name,
            species: pet.species,
            owner: pet.owner?.name ?? "Unassigned",
            voice: pet.voice?.name ?? "Unassigned",
            device: pet.device?.serialNumber ?? "None",
          }));
        })
      : fetcher())
      .then(setRows)
      .catch((nextError) => setError(getApiErrorMessage(nextError, t(`Unable to load ${resource}.`))))
      .finally(() => setLoading(false));
  }, [resource]);

  useEffect(() => {
    return () => {
      previewAudioRef.current?.pause();
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
      }
    };
  }, []);

  const columns = useMemo<TableColumn<Row>[]>(() => {
    if (!rows.length) return [];
    return Object.keys(rows[0]).filter((key) => key !== "id").map((key) => ({
      key,
      header: key.toUpperCase().replace(/_/g, " "),
    }));
  }, [rows]);

  const config = resourceConfig[resource];

  function openCreateModal() {
    if (resource === "pets") {
      setEditingPet(null);
      setForm(emptyPetForm);
      setImageFile(null);
      setImagePreview(null);
    }
    if (resource === "devices") {
      setEditingDevice(null);
      setDeviceForm(emptyDeviceForm);
    }
    if (resource === "voices") {
      setEditingVoice(null);
      setVoiceForm(emptyVoiceForm);
    }
    setModalOpen(true);
  }

  function openEditModal(pet: Pet) {
    setActionMenu(null);
    setEditingPet(pet);
    setForm({
      name: pet.name,
      species: pet.species,
      breed: pet.breed ?? "",
      notes: pet.notes ?? "",
      userId: pet.owner?.id ?? "",
      voiceId: pet.voice?.id ?? "",
      deviceId: pet.device?.id ?? "",
    });
    setImageFile(null);
    setImagePreview(getPetAvatar(pet));
    setModalOpen(true);
  }

  function openEditDeviceModal(device: Device) {
    setActionMenu(null);
    setEditingDevice(device);
    setDeviceForm({
      name: device.name,
      serialNumber: device.serialNumber,
      productCode: device.productCode,
      status: device.status,
    });
    setModalOpen(true);
  }

  function openEditVoiceModal(voice: Voice) {
    setEditingVoice(voice);
    setVoiceForm({
      name: voice.name,
      description: voice.description ?? "",
      tone: voice.tone,
      locale: voice.locale,
      version: voice.version,
      isActive: voice.isActive,
    });
    setModalOpen(true);
  }

  async function handleDeletePet(pet: Pet) {
    setActionMenu(null);
    const confirmed = window.confirm(`Delete pet "${pet.name}"?`);
    if (!confirmed) return;

    setError(null);
    try {
      await deleteAdminPet(pet.id);
      const nextPets = pets.filter((entry) => entry.id !== pet.id);
      syncPetRows(nextPets);
    } catch (nextError) {
      setError(getApiErrorMessage(nextError, "Unable to delete pet."));
    }
  }

  function toggleActionMenu(petId: string, event: React.MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setActionMenu((current) =>
      current?.id === petId
        ? null
        : {
            id: petId,
            top: rect.bottom + 10,
            left: rect.right - 160,
          },
    );
  }

  useEffect(() => {
    if (!actionMenu) return;

    function closeMenu() {
      setActionMenu(null);
    }

    window.addEventListener("scroll", closeMenu, true);
    window.addEventListener("resize", closeMenu);

    return () => {
      window.removeEventListener("scroll", closeMenu, true);
      window.removeEventListener("resize", closeMenu);
    };
  }, [actionMenu]);

  function syncPetRows(nextPets: Pet[]) {
    setPets(nextPets);
    setRows(
      nextPets.map((pet) => ({
        id: pet.id,
        name: pet.name,
        species: pet.species,
        owner: pet.owner?.name ?? "Unassigned",
        voice: pet.voice?.name ?? "Unassigned",
        device: pet.device?.serialNumber ?? "None",
      })),
    );
  }

  function syncVoiceRows(nextVoices: Voice[]) {
    setVoices(nextVoices);
    setRows(
      nextVoices.map((voice) => ({
        id: voice.id,
        name: voice.name,
        tone: voice.tone,
        locale: voice.locale,
        version: voice.version,
        status: voice.isActive ? "Enabled" : "Disabled",
        pets: String(voice._count?.pets ?? 0),
      })),
    );
  }

  async function onSubmitPet(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name: form.name,
      species: form.species,
      breed: form.breed || undefined,
      notes: form.notes || undefined,
      userId: form.userId || undefined,
      voiceId: form.voiceId || undefined,
      deviceId: form.deviceId || undefined,
    };

    try {
      let updatedPet = editingPet ? await updateAdminPet(editingPet.id, payload) : await createAdminPet(payload);
      if (imageFile) {
        updatedPet = await uploadPetImage(updatedPet.id, imageFile);
      }
      const nextPets = editingPet ? pets.map((pet) => (pet.id === updatedPet.id ? updatedPet : pet)) : [updatedPet, ...pets];
      syncPetRows(nextPets);
      setModalOpen(false);
    } catch (nextError) {
      setError(getApiErrorMessage(nextError, `Unable to ${editingPet ? "update" : "create"} pet.`));
    } finally {
      setSaving(false);
    }
  }

  async function onSubmitDevice(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        name: deviceForm.name,
        serialNumber: deviceForm.serialNumber,
        productCode: deviceForm.productCode,
        status: deviceForm.status,
      };
      const updatedDevice = editingDevice ? await updateAdminDevice(editingDevice.id, payload) : await createAdminDevice(payload);
      const nextDevices = editingDevice ? devices.map((device) => (device.id === updatedDevice.id ? updatedDevice : device)) : [updatedDevice, ...devices];
      setDevices(nextDevices);
      setRows(
        nextDevices.map((device) => ({
          id: device.id,
          name: device.name,
          serialNumber: device.serialNumber,
          productCode: device.productCode,
          status: device.status,
          claimedBy: device.claimedBy?.name ?? "Unassigned",
          pets: device.pets?.map((pet) => pet.name).join(", ") || "None",
        })),
      );
      setModalOpen(false);
    } catch (nextError) {
      setError(getApiErrorMessage(nextError, `Unable to ${editingDevice ? "update" : "create"} device.`));
    } finally {
      setSaving(false);
    }
  }

  async function onSubmitVoice(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name: voiceForm.name,
      description: voiceForm.description || undefined,
      tone: voiceForm.tone,
      locale: voiceForm.locale,
      version: voiceForm.version,
      isActive: voiceForm.isActive,
    };

    try {
      const updatedVoice = editingVoice ? await updateAdminVoice(editingVoice.id, payload) : await createAdminVoice(payload);
      const nextVoices = editingVoice ? voices.map((voice) => (voice.id === updatedVoice.id ? updatedVoice : voice)) : [updatedVoice, ...voices];
      syncVoiceRows(nextVoices);
      setModalOpen(false);
    } catch (nextError) {
      setError(getApiErrorMessage(nextError, `Unable to ${editingVoice ? "update" : "create"} voice.`));
    } finally {
      setSaving(false);
    }
  }

  async function toggleVoiceActive(voice: Voice) {
    setError(null);
    try {
      const updatedVoice = await updateAdminVoice(voice.id, { isActive: !voice.isActive });
      syncVoiceRows(voices.map((entry) => (entry.id === updatedVoice.id ? updatedVoice : entry)));
    } catch (nextError) {
      setError(getApiErrorMessage(nextError, "Unable to update voice status."));
    }
  }

  async function handleDeleteVoice(voice: Voice) {
    const confirmed = window.confirm(`Delete voice "${voice.name}"?`);
    if (!confirmed) return;

    setError(null);
    try {
      await deleteAdminVoice(voice.id);
      syncVoiceRows(voices.filter((entry) => entry.id !== voice.id));
    } catch (nextError) {
      setError(getApiErrorMessage(nextError, "Unable to delete voice."));
    }
  }

  async function playVoicePreview(voice: Voice) {
    setError(null);
    setPreviewingVoiceId(voice.id);

    try {
      previewAudioRef.current?.pause();
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
        previewObjectUrlRef.current = null;
      }

      const blob = await fetchAdminVoicePreview(voice.id);
      const objectUrl = URL.createObjectURL(blob);
      const audio = new Audio(objectUrl);
      previewObjectUrlRef.current = objectUrl;
      previewAudioRef.current = audio;
      audio.onended = () => setPreviewingVoiceId(null);
      audio.onerror = () => {
        setPreviewingVoiceId(null);
        setError("Unable to play voice preview.");
      };

      await audio.play();
    } catch (nextError) {
      setPreviewingVoiceId(null);
      setError(getApiErrorMessage(nextError, "Unable to play voice preview."));
    }
  }

  const petColumns = useMemo<TableColumn<Pet & { owner?: AdminUser | null; voice?: Voice | null; device?: Device | null }>[]>(() => {
    if (resource !== "pets") return [];
    return [
      { key: "name", header: "NAME" },
      { key: "species", header: "SPECIES" },
      {
        key: "owner",
        header: t("OWNER"),
        render: (row) => row.owner?.name ?? t("Unassigned"),
      },
      {
        key: "voice",
        header: t("VOICE"),
        render: (row) => row.voice?.name ?? t("Unassigned"),
      },
      {
        key: "device",
        header: t("DEVICE"),
        render: (row) => row.device?.serialNumber ?? t("None"),
      },
      {
        key: "actions",
        header: t("ACTIONS"),
        render: (row) => (
          <button
            className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/15"
            onClick={(event) => toggleActionMenu(row.id, event)}
            type="button"
          >
            {t("ACTIONS")}
          </button>
        ),
      },
    ];
  }, [resource, pets, t]);

  const deviceColumns = useMemo<TableColumn<Device>[]>(() => {
    if (resource !== "devices") return [];
    return [
      { key: "name", header: "NAME" },
      { key: "serialNumber", header: "SERIAL NUMBER" },
      { key: "productCode", header: "PRODUCT CODE" },
      { key: "status", header: t("STATUS") },
      {
        key: "claimedBy",
        header: t("CLAIMED BY"),
        render: (row) => row.claimedBy?.name ?? t("Unassigned"),
      },
      {
        key: "pets",
        header: t("PROVISIONED PET"),
        render: (row) => row.pets?.map((pet) => pet.name).join(", ") || t("Missing"),
      },
      {
        key: "actions",
        header: t("ACTIONS"),
        render: (row) => (
          <button className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/15" onClick={() => openEditDeviceModal(row)} type="button">
            {t("Edit")}
          </button>
        ),
      },
    ];
  }, [resource, devices, t]);

  const voiceColumns = useMemo<TableColumn<Voice>[]>(() => {
    if (resource !== "voices") return [];
    return [
      { key: "name", header: "NAME" },
      { key: "tone", header: "TONE" },
      { key: "locale", header: "LOCALE" },
      { key: "version", header: "VERSION" },
      {
        key: "isActive",
        header: t("STATUS"),
        render: (row) => (
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${row.isActive ? "bg-primary/15 text-primary" : "bg-white/8 text-on-surface-variant"}`}>
            {row.isActive ? t("Enabled") : t("Disabled")}
          </span>
        ),
      },
      {
        key: "_count",
        header: t("PETS"),
        render: (row) => String(row._count?.pets ?? 0),
      },
      {
        key: "actions",
        header: t("ACTIONS"),
        render: (row) => (
          <div className="flex flex-wrap gap-2">
            <button className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/15" onClick={() => openEditVoiceModal(row)} type="button">
              {t("Edit")}
            </button>
            <button className="rounded-xl border border-secondary/20 bg-secondary/10 px-3 py-2 text-xs font-semibold text-secondary transition hover:bg-secondary/15" onClick={() => void playVoicePreview(row)} type="button">
              {previewingVoiceId === row.id ? t("Playing...") : t("Preview")}
            </button>
            <button className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-on-surface transition hover:bg-white/[0.06]" onClick={() => void toggleVoiceActive(row)} type="button">
              {row.isActive ? t("Disable") : t("Enable")}
            </button>
            <button className="rounded-xl border border-error/20 bg-error/10 px-3 py-2 text-xs font-semibold text-error transition hover:bg-error/15" onClick={() => void handleDeleteVoice(row)} type="button">
              {t("Delete")}
            </button>
          </div>
        ),
      },
    ];
  }, [previewingVoiceId, resource, t, voices]);

  const availablePetDevices = useMemo(() => {
    if (resource !== "pets") return devices;
    return devices.filter((device) => {
      const linkedPet = pets.find((pet) => pet.device?.id === device.id);
      return !linkedPet || linkedPet.id === editingPet?.id;
    });
  }, [devices, editingPet, pets, resource]);

  return (
    <div>
      <PageHeader
        actions={
          resource === "pets" || resource === "devices" || resource === "voices" ? (
            <button className="btn-primary" onClick={openCreateModal} type="button">
              {resource === "pets" ? t("Add Pet") : resource === "devices" ? t("Add Device") : t("Add Voice")}
            </button>
          ) : (
            <button className="btn-primary">{t("Add")} {config.title.split(" ")[0]}</button>
          )
        }
        description={config.description}
        title={t(config.title)}
      />
      {loading ? <div className="mb-6"><StatePanel message={t(`Loading ${config.title.toLowerCase()} from the API.`)} title={t("Loading data")} /></div> : null}
      {error ? <div className="mb-6"><StatePanel message={error} title={t("Could not load table")} tone="error" /></div> : null}
      <GlassCard className="p-6">
        {!loading && !error && rows.length === 0 ? (
          <StatePanel message={t("No records were returned by the backend yet.")} title={t("No data")} />
        ) : resource === "pets" ? (
          <DataTable columns={petColumns} rows={pets as Array<Pet & { owner?: AdminUser | null; voice?: Voice | null; device?: Device | null }>} />
        ) : resource === "devices" ? (
          <DataTable columns={deviceColumns} rows={devices} />
        ) : resource === "voices" ? (
          <DataTable columns={voiceColumns} rows={voices} />
        ) : (
          <DataTable columns={columns} rows={rows} />
        )}
      </GlassCard>

      {resource === "pets" && modalOpen ? (
        <PetModal
          availableDevices={availablePetDevices}
          devices={devices}
          form={form}
          onChange={(key, value) => setForm((current) => ({ ...current, [key]: value }))}
          imagePreview={imagePreview}
          onImageChange={(file) => {
            setImageFile(file);
            if (!file) {
              setImagePreview(editingPet ? getPetAvatar(editingPet) : null);
              return;
            }
            setImagePreview(URL.createObjectURL(file));
          }}
          onClose={() => setModalOpen(false)}
          onSubmit={onSubmitPet}
          owners={users}
          saving={saving}
          selectedImageName={imageFile?.name ?? null}
          title={editingPet ? t("Edit Pet") : t("Add Pet")}
          voices={voices}
        />
      ) : null}

      {resource === "devices" && modalOpen ? (
        <DeviceModal
          form={deviceForm}
          onChange={(key, value) => setDeviceForm((current) => ({ ...current, [key]: value }))}
          onClose={() => setModalOpen(false)}
          onSubmit={onSubmitDevice}
          saving={saving}
          title={editingDevice ? t("Edit Device") : t("Add Device")}
        />
      ) : null}

      {resource === "voices" && modalOpen ? (
        <VoiceModal
          form={voiceForm}
          onChange={(key, value) => setVoiceForm((current) => ({ ...current, [key]: value }))}
          onClose={() => setModalOpen(false)}
          onSubmit={onSubmitVoice}
          saving={saving}
          title={editingVoice ? t("Edit Voice") : t("Add Voice")}
        />
      ) : null}

      {resource === "pets" && actionMenu ? (
        <>
          <button
            aria-label="Close actions menu"
            className="fixed inset-0 z-40 cursor-default bg-transparent"
            onClick={() => setActionMenu(null)}
            type="button"
          />
          <div
            className="fixed z-50 w-40 rounded-2xl border border-white/10 bg-[#1d1c1d] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
            style={{ left: actionMenu.left, top: actionMenu.top }}
          >
            {(() => {
              const selectedPet = pets.find((pet) => pet.id === actionMenu.id);
              if (!selectedPet) return null;

              return (
                <>
                  <button
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-on-surface transition hover:bg-white/[0.04]"
                    onClick={() => {
                      setDetailPet(selectedPet);
                      setActionMenu(null);
                    }}
                    type="button"
                  >
                    <Icon className="text-base" name="visibility" />
                    {t("Details")}
                  </button>
                  <button
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-on-surface transition hover:bg-white/[0.04]"
                    onClick={() => openEditModal(selectedPet)}
                    type="button"
                  >
                    <Icon className="text-base" name="edit" />
                    {t("Edit")}
                  </button>
                  <button
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-error transition hover:bg-white/[0.04]"
                    onClick={() => void handleDeletePet(selectedPet)}
                    type="button"
                  >
                    <Icon className="text-base" name="delete" />
                    {t("Delete")}
                  </button>
                </>
              );
            })()}
          </div>
        </>
      ) : null}

      {resource === "pets" && detailPet ? <PetDetailsModal onClose={() => setDetailPet(null)} pet={detailPet} /> : null}
    </div>
  );
}
