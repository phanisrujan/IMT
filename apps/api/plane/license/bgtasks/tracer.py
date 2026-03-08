# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

from celery import shared_task


@shared_task
def instance_traces():
    # Telemetry export is intentionally disabled in IMT.
    return
