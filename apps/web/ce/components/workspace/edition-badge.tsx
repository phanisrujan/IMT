/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { observer } from "mobx-react";
import packageJson from "package.json";
import { Button } from "@plane/propel/button";

export const WorkspaceEditionBadge = observer(function WorkspaceEditionBadge() {
  return (
    <Button variant="tertiary" size="lg" aria-label={`Version: v${packageJson.version}`}>
      {`Version: v${packageJson.version}`}
    </Button>
  );
});
