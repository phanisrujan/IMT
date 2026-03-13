/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useState } from "react";
import { observer } from "mobx-react";
import { LoaderCircle } from "lucide-react";

// plane internal packages
import { WEB_BASE_URL } from "@plane/constants";
import { NewTabIcon } from "@plane/propel/icons";
import { Button, getButtonStyling } from "@plane/propel/button";
import { TOAST_TYPE, setToast } from "@plane/propel/toast";
import { Tooltip } from "@plane/propel/tooltip";
import { getFileURL } from "@plane/utils";
// hooks
import { useWorkspace } from "@/hooks/store";

type TWorkspaceListItemProps = {
  workspaceId: string;
};

export const WorkspaceListItem = observer(function WorkspaceListItem({ workspaceId }: TWorkspaceListItemProps) {
  const [isGrantingAccess, setIsGrantingAccess] = useState(false);
  // store hooks
  const { getWorkspaceById, grantWorkspaceAdminAccess } = useWorkspace();
  // derived values
  const workspace = getWorkspaceById(workspaceId);
  const workspaceRole = workspace?.role;
  const canOpenWorkspace = typeof workspaceRole === "number" && workspaceRole >= 5;
  const accessLabel =
    workspaceRole === 20 ? "Admin access" : workspaceRole === 15 ? "Member access" : workspaceRole === 5 ? "Guest access" : "No access yet";
  const workspaceURL = workspace ? `${WEB_BASE_URL}/${encodeURIComponent(workspace.slug)}` : "";

  if (!workspace) return null;

  const handleGrantAccess = async () => {
    try {
      setIsGrantingAccess(true);
      await grantWorkspaceAdminAccess(workspaceId);
      setToast({
        type: TOAST_TYPE.SUCCESS,
        title: "Access updated",
        message: "You now have admin access for this workspace.",
      });
    } catch (error) {
      console.error(error);
      setToast({
        type: TOAST_TYPE.ERROR,
        title: "Access update failed",
        message: "Unable to grant workspace admin access.",
      });
    } finally {
      setIsGrantingAccess(false);
    }
  };

  return (
    <div className="group flex items-center justify-between gap-4 truncate rounded-lg border border-subtle bg-layer-1 p-3 hover:border-subtle-1 hover:bg-layer-1-hover hover:shadow-raised-100">
      <div className="flex items-start gap-4">
        <span
          className={`relative mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center p-2 text-11 uppercase ${
            !workspace?.logo_url && "rounded-lg bg-accent-primary text-on-color"
          }`}
        >
          {workspace?.logo_url && workspace.logo_url !== "" ? (
            <img
              src={getFileURL(workspace.logo_url)}
              className="absolute top-0 left-0 h-full w-full rounded-sm object-cover"
              alt="Workspace Logo"
            />
          ) : (
            (workspace?.name?.[0] ?? "...")
          )}
        </span>
        <div className="flex flex-col items-start gap-1">
          <div className="flex w-full flex-wrap items-center gap-2.5">
            <h3 className={`text-14 font-medium capitalize`}>{workspace.name}</h3>/
            <Tooltip tooltipContent="The unique URL of your workspace">
              <h4 className="text-13 text-tertiary">[{workspace.slug}]</h4>
            </Tooltip>
            <span className="rounded-full border border-subtle px-2 py-0.5 text-11 text-tertiary">{accessLabel}</span>
          </div>
          {workspace.owner.email && (
            <div className="flex items-center gap-1 text-11">
              <h3 className="font-medium text-secondary">Owned by:</h3>
              <h4 className="text-tertiary">{workspace.owner.email}</h4>
            </div>
          )}
          <div className="flex items-center gap-2.5 text-11">
            {workspace.total_projects !== null && (
              <span className="flex items-center gap-1">
                <h3 className="font-medium text-secondary">Total projects:</h3>
                <h4 className="text-tertiary">{workspace.total_projects}</h4>
              </span>
            )}
            {workspace.total_members !== null && (
              <>
                •
                <span className="flex items-center gap-1">
                  <h3 className="font-medium text-secondary">Total members:</h3>
                  <h4 className="text-tertiary">{workspace.total_members}</h4>
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-shrink-0 items-center gap-2">
        {canOpenWorkspace ? (
          <a href={workspaceURL} target="_blank" rel="noreferrer" className={getButtonStyling("secondary", "sm")}>
            Open workspace
            <NewTabIcon width={13} height={13} className="ml-1" />
          </a>
        ) : (
          <Button variant="primary" size="sm" onClick={handleGrantAccess} disabled={isGrantingAccess}>
            {isGrantingAccess ? (
              <span className="flex items-center gap-1.5">
                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                Granting access
              </span>
            ) : (
              "Grant me admin access"
            )}
          </Button>
        )}
      </div>
    </div>
  );
});
