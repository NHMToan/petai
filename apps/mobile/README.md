# PetAI Mobile

React Native mobile app for PetAI, built with:

- Expo + React Native
- TypeScript
- React Navigation
- StyleSheet
- Axios
- Zustand

The UI direction follows the Stitch mobile references in:

- `apps/mobile/stitch-mobile/petai_onboarding`
- `apps/mobile/stitch-mobile/petai_home_dashboard`
- `apps/mobile/stitch-mobile/petai_pet_identity_setup`
- `apps/mobile/stitch-mobile/petai_voice_interaction`

## Included Screens

- Onboarding
- Login
- Register
- Home
- ClaimDevice
- PetIdentitySetup
- VoiceSelection
- Talk
- DeviceSettings
- PetProfile
- Settings
- Shop

## Navigation Structure

- `AuthStack`
  - `Onboarding`
  - `Login`
  - `Register`
- `AppTabs`
  - `HomeTab`
    - `Home`
    - `ClaimDevice`
    - `PetIdentitySetup`
    - `VoiceSelection`
    - `Talk`
    - `DeviceSettings`
    - `PetProfile`
  - `ShopTab`
    - `Shop`
  - `SettingsTab`
    - `Settings`

## Mock-first Setup

The app starts with mock data enabled in:

- `src/api/client.ts`

Change:

```ts
export const USE_MOCK_API = true;
```

to `false` when you want to point the app to the real backend.

## Prepared API Methods

Located in:

- `src/api/auth.ts`
- `src/api/pets.ts`

Included methods:

- `login`
- `register`
- `getMyPets`
- `claimDevice`
- `updatePet`
- `getVoices`

JWT auth is attached automatically through the Axios request interceptor in `src/api/client.ts`.

## Run Locally

From the repo root:

```bash
npm install
npm run mobile:dev
```

Or from inside `apps/mobile`:

```bash
npm install
npm run start
```

Then:

- press `i` for iOS simulator
- press `a` for Android emulator
- or scan the Expo QR code with Expo Go

## Useful Commands

From the repo root:

```bash
npm run mobile:dev
npm run mobile:android
npm run mobile:ios
```

## Notes

- The app currently uses remote mock imagery to stay close to the Stitch look quickly.
- The `Talk` screen is a UI mock of the voice interaction experience, ready to be connected to the existing PetAI realtime chat backend later.
- Design tokens are centralized in `src/theme/theme.ts`.
