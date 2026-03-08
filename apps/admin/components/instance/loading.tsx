/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { PlaneLoader } from "@plane/propel/icons";

export function InstanceLoading() {
  return (
    <div className="flex items-center justify-center">
      <PlaneLoader className="h-6 w-auto text-primary sm:h-11" />
    </div>
  );
}
