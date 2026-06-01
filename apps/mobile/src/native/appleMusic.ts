import { NativeModules, Platform } from "react-native";

type NativeNowPlaying = {
  id?: string;
  title?: string;
  artistName?: string;
  albumTitle?: string;
  artworkUrl?: string;
  playbackStatus?: string;
  isEmpty?: boolean;
};

type AppleMusicNativeModule = {
  getAuthorizationStatus(): Promise<string>;
  requestAuthorization(): Promise<string>;
  searchAndPlay(query: string): Promise<NativeNowPlaying>;
  resume(): Promise<NativeNowPlaying>;
  pause(): Promise<NativeNowPlaying>;
  stop(): Promise<{ playbackStatus?: string }>;
  getNowPlaying(): Promise<NativeNowPlaying>;
};

export type AppleMusicTrack = {
  id?: string;
  title?: string;
  artistName?: string;
  albumTitle?: string;
  artworkUrl?: string;
  playbackStatus?: string;
  isEmpty?: boolean;
};

const nativeModule = NativeModules.AppleMusicModule as
  | AppleMusicNativeModule
  | undefined;

function ensureModule() {
  if (Platform.OS !== "ios" || !nativeModule) {
    throw new Error("Apple Music playback is only available on iPhone builds.");
  }

  return nativeModule;
}

export async function getAppleMusicAuthorizationStatus() {
  return ensureModule().getAuthorizationStatus();
}

export async function requestAppleMusicAuthorization() {
  return ensureModule().requestAuthorization();
}

export async function searchAndPlayAppleMusic(query: string) {
  return ensureModule().searchAndPlay(query);
}

export async function resumeAppleMusic() {
  return ensureModule().resume();
}

export async function pauseAppleMusic() {
  return ensureModule().pause();
}

export async function stopAppleMusic() {
  return ensureModule().stop();
}

export async function getAppleMusicNowPlaying() {
  return ensureModule().getNowPlaying();
}
