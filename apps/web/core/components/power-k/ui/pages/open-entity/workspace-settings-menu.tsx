/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { observer } from "mobx-react";
// plane types
import { EUserPermissionsLevel, GROUPED_WORKSPACE_SETTINGS, WORKSPACE_SETTINGS } from "@plane/constants";
// components
import { useTranslation } from "@plane/i18n";
import type { TPowerKContext } from "@/components/power-k/core/types";
import { PowerKSettingsMenu } from "@/components/power-k/menus/settings";
import { WORKSPACE_SETTINGS_ICONS } from "@/components/settings/workspace/sidebar/item-icon";
// hooks
import { useUserPermissions } from "@/hooks/store/user";

type Props = {
  context: TPowerKContext;
  handleSelect: (href: string) => void;
};

export const PowerKOpenWorkspaceSettingsMenu = observer(function PowerKOpenWorkspaceSettingsMenu(props: Props) {
  const { context, handleSelect } = props;
  // plane hooks
  const { t } = useTranslation();
  // store hooks
  const { allowPermissions } = useUserPermissions();
  const visibleSettingKeys = new Set(Object.values(GROUPED_WORKSPACE_SETTINGS).flat().map((setting) => setting.key));
  // derived values
  const settingsList = Object.values(WORKSPACE_SETTINGS).filter(
    (setting) =>
      visibleSettingKeys.has(setting.key) &&
      context.params.workspaceSlug &&
      allowPermissions(setting.access, EUserPermissionsLevel.WORKSPACE, context.params.workspaceSlug?.toString())
  );
  const settingsListWithIcons = settingsList.map((setting) => ({
    ...setting,
    label: t(setting.i18n_label),
    icon: WORKSPACE_SETTINGS_ICONS[setting.key],
  }));

  return <PowerKSettingsMenu settings={settingsListWithIcons} onSelect={(setting) => handleSelect(setting.href)} />;
});
