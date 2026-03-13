# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

from django.db import migrations


def migrate_cancelled_state_color_to_red(apps, schema_editor):
    State = apps.get_model("db", "State")

    (
        State.objects.filter(
            group="cancelled",
            name__in=["Cancelled", "Canceled"],
            deleted_at__isnull=True,
            color__in=["#9AA4BC", "#dc2626", "#DC2626"],
        )
        .exclude(external_source__isnull=False)
        .update(color="#EF4444")
    )


class Migration(migrations.Migration):

    dependencies = [
        ("db", "0122_imt_validation_sequence_position"),
    ]

    operations = [
        migrations.RunPython(migrate_cancelled_state_color_to_red, migrations.RunPython.noop),
    ]
