/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { TIssueActivity } from "@plane/types";

export const getRelationActivityContent = (activity: TIssueActivity | undefined): string | undefined => {
  if (!activity) return;

  switch (activity.field) {
    case "blocking":
      return activity.old_value === ""
        ? `marked this ticket is blocking ticket `
        : `removed the blocking ticket `;
    case "blocked_by":
      return activity.old_value === ""
        ? `marked this ticket is being blocked by `
        : `removed this ticket being blocked by ticket `;
    case "duplicate":
      return activity.old_value === ""
        ? `marked this ticket as duplicate of `
        : `removed this ticket as a duplicate of `;
    case "relates_to":
      return activity.old_value === "" ? `marked that this ticket relates to ` : `removed the relation from `;
  }

  return;
};
