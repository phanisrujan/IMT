/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useState } from "react";
import { observer } from "mobx-react";
import Link from "next/link";
// plane imports
import { useTranslation } from "@plane/i18n";
import { Button, getButtonStyling } from "@plane/propel/button";
import { PlaneLogo } from "@plane/propel/icons";
import type { IWorkspace } from "@plane/types";
// assets
import WorkspaceCreationDisabled from "@/app/assets/workspace/workspace-creation-disabled.png?url";
// components
import { CreateWorkspaceForm } from "@/components/workspace/create-workspace-form";
// hooks
import { useUser, useUserProfile } from "@/hooks/store/user";
import { useInstance } from "@/hooks/store/use-instance";
import { useAppRouter } from "@/hooks/use-app-router";
// wrappers
import { AuthenticationWrapper } from "@/lib/wrappers/authentication-wrapper";

const CreateWorkspacePage = observer(function CreateWorkspacePage() {
  const { t } = useTranslation();
  // router
  const router = useAppRouter();
  // store hooks
  const { config } = useInstance();
  const { data: currentUser } = useUser();
  const { updateUserProfile } = useUserProfile();
  // states
  const [defaultValues, setDefaultValues] = useState<Pick<IWorkspace, "name" | "slug" | "organization_size">>({
    name: "",
    slug: "",
    organization_size: "",
  });
  // derived values
  const isWorkspaceCreationDisabled = config?.is_workspace_creation_disabled ?? false;

  // methods
  const getMailtoHref = () => {
    const subject = t("workspace_creation.request_email.subject");
    const body = t("workspace_creation.request_email.body", {
      firstName: currentUser?.first_name || "",
      lastName: currentUser?.last_name || "",
      email: currentUser?.email || "",
    });

    return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const onSubmit = async (workspace: IWorkspace) => {
    await updateUserProfile({ last_workspace_id: workspace.id }).then(() => router.push(`/${workspace.slug}`));
  };

  return (
    <AuthenticationWrapper>
      <div className="flex h-full flex-col gap-y-2 overflow-hidden bg-surface-1 sm:flex-row sm:gap-y-0 relative">
        <Link
          className="absolute z-10 top-5 left-5 sm:fixed sm:top-12 sm:left-16"
          href="/"
        >
          <PlaneLogo className="h-9 w-auto text-primary" />
        </Link>
        <div className="absolute z-10 top-5 right-5 text-13 text-primary sm:fixed sm:top-12 sm:right-16">
          {currentUser?.email}
        </div>
        <div className="relative flex h-full w-full justify-center items-center px-8 pb-8 pt-24 sm:p-0">
          {isWorkspaceCreationDisabled ? (
            <div className="flex h-full w-full max-w-2xl sm:w-3/4 md:w-2/5 flex-col items-center justify-center gap-1 text-16 font-medium">
              <img
                src={WorkspaceCreationDisabled}
                className="mb-4 h-full w-full object-contain"
                alt="Workspace creation disabled"
              />
              <div className="text-center text-16 font-medium">
                {t("workspace_creation.errors.creation_disabled.title")}
              </div>
              <p className="text-center text-13 break-words text-tertiary">
                {t("workspace_creation.errors.creation_disabled.description")}
              </p>
              <div className="mt-6 flex gap-4">
                <Button variant="primary" onClick={() => router.back()}>
                  {t("common.go_back")}
                </Button>
                <a href={getMailtoHref()} className={getButtonStyling("secondary", "base")}>
                  {t("workspace_creation.errors.creation_disabled.request_button")}
                </a>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-2xl sm:w-3/4 md:w-2/5 space-y-7 sm:space-y-10">
              <h4 className="text-20 font-semibold">{t("workspace_creation.heading")}</h4>
              <div className="sm:w-3/4 md:w-2/5">
                <CreateWorkspaceForm
                  onSubmit={onSubmit}
                  defaultValues={defaultValues}
                  setDefaultValues={setDefaultValues}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthenticationWrapper>
  );
});

export default CreateWorkspacePage;
