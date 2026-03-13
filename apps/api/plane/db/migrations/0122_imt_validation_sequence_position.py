# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

from django.db import migrations
from django.db.models import Q


def migrate_validation_sequence_position(apps, schema_editor):
    State = apps.get_model("db", "State")

    (
        State.objects.filter(group="backlog", default=True, deleted_at__isnull=True)
        .filter(Q(sequence__isnull=True) | Q(sequence__lt=40000))
        .update(sequence=40000)
    )


class Migration(migrations.Migration):

    dependencies = [
        ("db", "0121_imt_validation_backlog_state"),
    ]

    operations = [
        migrations.RunPython(migrate_validation_sequence_position, migrations.RunPython.noop),
    ]
