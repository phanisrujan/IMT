/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { observer } from "mobx-react";
import { MoveLeft } from "lucide-react";
import { WEB_BASE_URL } from "@plane/constants";
// plane internal packages
import { NewTabIcon } from "@plane/propel/icons";
import { Tooltip } from "@plane/propel/tooltip";
import { cn } from "@plane/utils";
// hooks
import { useInstance, useTheme } from "@/hooks/store";

export const AdminSidebarHelpSection = observer(function AdminSidebarHelpSection() {
  // store
  const { instance } = useInstance();
  const { isSidebarCollapsed, toggleSidebar } = useTheme();

  const redirectionLink = encodeURI(WEB_BASE_URL + "/");

  return (
    <div
      className={cn(
        "flex h-14 w-full flex-shrink-0 items-center justify-between gap-1 self-baseline border-t border-subtle bg-surface-1 px-4",
        {
          "h-auto flex-col py-1.5": isSidebarCollapsed,
        }
      )}
    >
      <div className={`flex items-center gap-1 ${isSidebarCollapsed ? "flex-col justify-center" : "w-full"}`}>
        <Tooltip tooltipContent="Open IMT app" position="right" className="ml-4" disabled={!isSidebarCollapsed}>
          <a
            href={redirectionLink}
            className={`relative flex items-center gap-1 rounded-sm bg-layer-1 px-2 py-1 text-body-xs-medium whitespace-nowrap text-secondary`}
          >
            <NewTabIcon width={14} height={14} />
            {!isSidebarCollapsed && "Open IMT app"}
          </a>
        </Tooltip>
        <div
          className={cn("ml-auto rounded-sm px-2 py-1 text-10 whitespace-nowrap text-secondary", {
            "ml-0 w-full text-center": isSidebarCollapsed,
          })}
        >
          Version: v{instance?.current_version}
        </div>
        <Tooltip tooltipContent="Toggle sidebar" position={isSidebarCollapsed ? "right" : "top"} className="ml-4">
          <button
            type="button"
            className={`grid place-items-center rounded-md p-1.5 text-secondary outline-none hover:bg-layer-1-hover hover:text-primary ${
              isSidebarCollapsed ? "w-full" : ""
            }`}
            onClick={() => toggleSidebar(!isSidebarCollapsed)}
          >
            <MoveLeft className={`size-4 duration-300 ${isSidebarCollapsed ? "rotate-180" : ""}`} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
});
