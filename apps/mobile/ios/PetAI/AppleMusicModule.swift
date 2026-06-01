import Foundation
import MusicKit

@objc(AppleMusicModule)
class AppleMusicModule: NSObject, RCTBridgeModule {
  static func moduleName() -> String! {
    "AppleMusicModule"
  }

  static func requiresMainQueueSetup() -> Bool {
    false
  }

  @objc(getAuthorizationStatus:rejecter:)
  func getAuthorizationStatus(
    _ resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    guard #available(iOS 15.0, *) else {
      reject("E_UNAVAILABLE", "Apple Music playback requires iOS 15 or newer.", nil)
      return
    }

    resolve(authorizationStatusString(MusicAuthorization.currentStatus))
  }

  @objc(requestAuthorization:rejecter:)
  func requestAuthorization(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    guard #available(iOS 15.0, *) else {
      reject("E_UNAVAILABLE", "Apple Music playback requires iOS 15 or newer.", nil)
      return
    }

    Task {
      let status = await MusicAuthorization.request()
      resolve(self.authorizationStatusString(status))
    }
  }

  @objc(searchAndPlay:resolver:rejecter:)
  func searchAndPlay(
    _ query: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    guard #available(iOS 15.0, *) else {
      reject("E_UNAVAILABLE", "Apple Music playback requires iOS 15 or newer.", nil)
      return
    }

    Task { @MainActor in
      do {
        try await self.ensurePlaybackAccess()

        let trimmedQuery = query.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmedQuery.isEmpty {
          throw AppleMusicError.noQuery
        }

        var request = MusicCatalogSearchRequest(term: trimmedQuery, types: [Song.self])
        request.limit = 1
        request.includeTopResults = true

        let response = try await request.response()
        guard let song = response.songs.first else {
          throw AppleMusicError.noResults
        }

        let player = ApplicationMusicPlayer.shared
        player.queue = [song]
        try await player.play()

        resolve(self.serialize(song: song, playbackStatus: "playing"))
      } catch {
        self.reject(error, with: reject)
      }
    }
  }

  @objc(resume:rejecter:)
  func resume(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    guard #available(iOS 15.0, *) else {
      reject("E_UNAVAILABLE", "Apple Music playback requires iOS 15 or newer.", nil)
      return
    }

    Task { @MainActor in
      do {
        try await self.ensurePlaybackAccess()
        try await ApplicationMusicPlayer.shared.play()
        resolve(self.serializeCurrentPlayback(statusOverride: "playing"))
      } catch {
        self.reject(error, with: reject)
      }
    }
  }

  @objc(pause:rejecter:)
  func pause(
    _ resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    guard #available(iOS 15.0, *) else {
      reject("E_UNAVAILABLE", "Apple Music playback requires iOS 15 or newer.", nil)
      return
    }

    Task { @MainActor in
      ApplicationMusicPlayer.shared.pause()
      resolve(self.serializeCurrentPlayback(statusOverride: "paused"))
    }
  }

  @objc(stop:rejecter:)
  func stop(
    _ resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    guard #available(iOS 15.0, *) else {
      reject("E_UNAVAILABLE", "Apple Music playback requires iOS 15 or newer.", nil)
      return
    }

    Task { @MainActor in
      ApplicationMusicPlayer.shared.stop()
      resolve(["playbackStatus": "stopped"])
    }
  }

  @objc(getNowPlaying:rejecter:)
  func getNowPlaying(
    _ resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    guard #available(iOS 15.0, *) else {
      reject("E_UNAVAILABLE", "Apple Music playback requires iOS 15 or newer.", nil)
      return
    }

    Task { @MainActor in
      resolve(self.serializeCurrentPlayback(statusOverride: nil))
    }
  }

  @available(iOS 15.0, *)
  private func ensurePlaybackAccess() async throws {
    var status = MusicAuthorization.currentStatus
    if status == .notDetermined {
      status = await MusicAuthorization.request()
    }

    guard status == .authorized else {
      throw AppleMusicError.permissionDenied
    }

    let subscription = MusicSubscription.current
    guard subscription.canPlayCatalogContent else {
      throw AppleMusicError.subscriptionRequired
    }
  }

  @available(iOS 15.0, *)
  private func serializeCurrentPlayback(statusOverride: String?) -> [String: Any] {
    let player = ApplicationMusicPlayer.shared
    let playbackStatus = statusOverride ?? playbackStatusString(player.state.playbackStatus)

    guard let currentEntry = player.queue.currentEntry else {
      return [
        "playbackStatus": playbackStatus,
        "isEmpty": true,
      ]
    }

    switch currentEntry.item {
    case .song(let song):
      return serialize(song: song, playbackStatus: playbackStatus)
    default:
      return [
        "playbackStatus": playbackStatus,
        "isEmpty": false,
      ]
    }
  }

  @available(iOS 15.0, *)
  private func serialize(song: Song, playbackStatus: String) -> [String: Any] {
    [
      "id": String(describing: song.id),
      "title": song.title,
      "artistName": song.artistName,
      "albumTitle": song.albumTitle ?? "",
      "artworkUrl": song.artwork?.url(width: 320, height: 320)?.absoluteString ?? "",
      "playbackStatus": playbackStatus,
    ]
  }

  @available(iOS 15.0, *)
  private func playbackStatusString(_ status: MusicPlayer.PlaybackStatus) -> String {
    switch status {
    case .stopped:
      return "stopped"
    case .paused:
      return "paused"
    case .playing:
      return "playing"
    case .interrupted:
      return "interrupted"
    case .seekingBackward:
      return "seekingBackward"
    case .seekingForward:
      return "seekingForward"
    case .waiting:
      return "waiting"
    @unknown default:
      return "unknown"
    }
  }

  private func authorizationStatusString(_ status: MusicAuthorization.Status) -> String {
    switch status {
    case .authorized:
      return "authorized"
    case .denied:
      return "denied"
    case .notDetermined:
      return "notDetermined"
    case .restricted:
      return "restricted"
    @unknown default:
      return "unknown"
    }
  }

  private func reject(_ error: Error, with reject: RCTPromiseRejectBlock) {
    if let appleMusicError = error as? AppleMusicError {
      reject(appleMusicError.code, appleMusicError.localizedDescription, error)
      return
    }

    reject("E_APPLE_MUSIC", error.localizedDescription, error)
  }
}

private enum AppleMusicError: LocalizedError {
  case noQuery
  case noResults
  case permissionDenied
  case subscriptionRequired

  var code: String {
    switch self {
    case .noQuery:
      return "E_NO_QUERY"
    case .noResults:
      return "E_NO_RESULTS"
    case .permissionDenied:
      return "E_PERMISSION_DENIED"
    case .subscriptionRequired:
      return "E_SUBSCRIPTION_REQUIRED"
    }
  }

  var errorDescription: String? {
    switch self {
    case .noQuery:
      return "Tell PetAI what song, artist, or mood you want to hear."
    case .noResults:
      return "Couldn't find a matching song on Apple Music."
    case .permissionDenied:
      return "Apple Music permission is required for in-app playback."
    case .subscriptionRequired:
      return "An active Apple Music subscription is required for in-app playback."
    }
  }
}
