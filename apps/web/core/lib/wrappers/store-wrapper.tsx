/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { observer } from "mobx-react";
import { useParams } from "next/navigation";
import { useTheme } from "next-themes";
import type { TLanguage } from "@plane/i18n";
import { FALLBACK_LANGUAGE, SUPPORTED_LANGUAGES, useTranslation } from "@plane/i18n";
// helpers
import { applyCustomTheme, clearCustomTheme } from "@plane/utils";
// hooks
import { useAppTheme } from "@/hooks/store/use-app-theme";
import { useRouterParams } from "@/hooks/store/use-router-params";
import { useUser, useUserProfile } from "@/hooks/store/user";

type TStoreWrapper = {
  children: ReactNode;
};

const SYSTEM_PREFERENCES_BOOTSTRAP_KEY = "imt_system_preferences_bootstrapped_v1";

const normalizeLanguageCode = (rawLanguage: string): TLanguage | undefined => {
  const normalizedLanguage = rawLanguage.trim().toLowerCase();
  if (!normalizedLanguage) return undefined;

  const exactMatch = SUPPORTED_LANGUAGES.find((language) => language.value.toLowerCase() === normalizedLanguage);
  if (exactMatch) return exactMatch.value;

  const languageBase = normalizedLanguage.split("-")[0];
  if (!languageBase) return undefined;

  // Browser locale for Ukrainian is usually "uk", while IMT locale uses "ua".
  if (languageBase === "uk") return "ua";

  const baseMatch = SUPPORTED_LANGUAGES.find((language) => {
    const supportedValue = language.value.toLowerCase();
    return supportedValue === languageBase || supportedValue.startsWith(`${languageBase}-`);
  });

  return baseMatch?.value;
};

const getSystemLanguage = (): TLanguage | undefined => {
  if (typeof navigator === "undefined") return undefined;

  const languageCandidates = [...(navigator.languages ?? []), navigator.language].filter(Boolean);
  for (const candidate of languageCandidates) {
    const language = normalizeLanguageCode(candidate);
    if (language) return language;
  }
  return undefined;
};

const getSystemTimezone = (): string | undefined => {
  if (typeof Intl === "undefined" || typeof Intl.DateTimeFormat !== "function") return undefined;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return timezone?.trim() || undefined;
};

function StoreWrapper(props: TStoreWrapper) {
  const { children } = props;
  // theme
  const { setTheme } = useTheme();
  // router
  const params = useParams();
  // store hooks
  const { setQuery } = useRouterParams();
  const { sidebarCollapsed, toggleSidebar } = useAppTheme();
  const { data: currentUser, updateCurrentUser } = useUser();
  const { data: userProfile, updateUserProfile } = useUserProfile();
  const { changeLanguage } = useTranslation();

  // Track if we've initialized theme from server (one-time only)
  const hasInitializedThemeRef = useRef(false);
  // Track current user to reset on logout/login
  const currentUserIdRef = useRef<string | undefined>(undefined);
  // Track previous theme to detect transitions from custom theme
  const previousThemeRef = useRef<string | undefined>(undefined);
  // Prevent duplicate bootstrap requests while current one is in flight.
  const isSystemPreferenceBootstrapInProgressRef = useRef(false);

  /**
   * Sidebar collapsed fetching from local storage
   */
  useEffect(() => {
    const localValue = localStorage && localStorage.getItem("app_sidebar_collapsed");
    const localBoolValue = localValue ? (localValue === "true" ? true : false) : false;
    if (localValue && sidebarCollapsed === undefined) toggleSidebar(localBoolValue);
  }, [sidebarCollapsed, setTheme, toggleSidebar]);

  /**
   * Effect 1: Initial theme sync from server (one-time only)
   *
   * This effect runs ONCE per user session to load theme from server.
   * After initial load, all theme changes are localStorage-driven (next-themes).
   * This prevents a feedback loop where server updates trigger UI updates in a cycle.
   */
  useEffect(() => {
    const userId = userProfile?.id;

    // Reset initialization flag when user changes (logout/login)
    // This handles both logout (userId becomes undefined) and login (userId changes)
    if (userId !== currentUserIdRef.current) {
      hasInitializedThemeRef.current = false;
      previousThemeRef.current = undefined;
      currentUserIdRef.current = userId;
    }

    // Only initialize theme from server on FIRST load for this user
    if (!userProfile?.theme?.theme || hasInitializedThemeRef.current) {
      return; // Skip if already initialized or no profile data
    }

    // Apply theme from server profile (one-time only)
    setTheme(userProfile?.theme?.theme || "system");

    // Mark as initialized - prevents future syncs from server
    hasInitializedThemeRef.current = true;
  }, [userProfile?.theme?.theme, setTheme]);

  /**
   * Effect 2: Custom theme CSS application (runs on every change)
   *
   * This effect applies or clears custom theme CSS variables whenever
   * the theme changes. It runs independently of the initial sync effect.
   */
  useEffect(() => {
    if (!userProfile?.theme?.theme) return;

    const currentTheme = userProfile?.theme?.theme;
    const previousTheme = previousThemeRef.current;
    const themeData = userProfile?.theme;

    // Apply custom theme if current theme is custom
    if (currentTheme === "custom" && themeData.primary && themeData.background && themeData.darkPalette !== undefined) {
      applyCustomTheme(themeData.primary, themeData.background, themeData.darkPalette ? "dark" : "light");
    }
    // Clear custom theme CSS when switching away from custom
    else if (previousTheme === "custom" && currentTheme !== "custom") {
      clearCustomTheme();
      // No reload needed - let CSS cascade handle it naturally
    }

    // Update previous theme for next comparison
    previousThemeRef.current = currentTheme;
  }, [userProfile?.theme]);

  useEffect(() => {
    if (!userProfile?.language) return;
    changeLanguage(userProfile?.language as TLanguage);
  }, [userProfile?.language, changeLanguage]);

  useEffect(() => {
    if (typeof window === "undefined" || !currentUser?.id || !userProfile?.id) return;
    if (isSystemPreferenceBootstrapInProgressRef.current) return;

    const bootstrapKey = `${SYSTEM_PREFERENCES_BOOTSTRAP_KEY}:${currentUser.id}`;
    if (localStorage.getItem(bootstrapKey) === "done") return;

    const systemTimezone = getSystemTimezone();
    const systemLanguage = getSystemLanguage();

    const shouldUpdateTimezone =
      (!!systemTimezone &&
        systemTimezone !== "UTC" &&
        (!currentUser.user_timezone || currentUser.user_timezone === "UTC")) ||
      false;
    const shouldUpdateLanguage =
      (!!systemLanguage &&
        systemLanguage !== FALLBACK_LANGUAGE &&
        (!userProfile.language || userProfile.language === FALLBACK_LANGUAGE)) ||
      false;

    if (!shouldUpdateTimezone && !shouldUpdateLanguage) {
      localStorage.setItem(bootstrapKey, "done");
      return;
    }

    const updates: Promise<unknown>[] = [];
    if (shouldUpdateTimezone && systemTimezone) {
      updates.push(updateCurrentUser({ user_timezone: systemTimezone }));
    }
    if (shouldUpdateLanguage && systemLanguage) {
      updates.push(updateUserProfile({ language: systemLanguage }));
    }

    if (!updates.length) {
      localStorage.setItem(bootstrapKey, "done");
      return;
    }

    isSystemPreferenceBootstrapInProgressRef.current = true;
    Promise.all(updates)
      .then(() => {
        localStorage.setItem(bootstrapKey, "done");
      })
      .catch(() => {
        // Keep retry enabled for a future session if bootstrap update fails.
      })
      .finally(() => {
        isSystemPreferenceBootstrapInProgressRef.current = false;
      });
  }, [
    currentUser?.id,
    currentUser?.user_timezone,
    userProfile?.id,
    userProfile?.language,
    updateCurrentUser,
    updateUserProfile,
  ]);

  useEffect(() => {
    if (!params) return;
    setQuery(params);
  }, [params, setQuery]);

  return <>{children}</>;
}

export default observer(StoreWrapper);
