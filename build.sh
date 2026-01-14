#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input

# --- Repair migration mismatch (no shell needed) ---
python - <<'PY'
import os
import django
from django.core.management import call_command
from django.db import connection

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")  # <-- change if yours differs
django.setup()

MIGRATION_NAME = "0002_color_remove_partcolor_uniq_part_color_variant_and_more"

def table_exists(table):
    with connection.cursor() as c:
        c.execute("SELECT to_regclass(%s);", [f"public.{table}"])
        return c.fetchone()[0] is not None

def migration_applied(app, name):
    with connection.cursor() as c:
        c.execute(
            "SELECT 1 FROM django_migrations WHERE app=%s AND name=%s LIMIT 1;",
            [app, name],
        )
        return c.fetchone() is not None

exists = table_exists("parts_color")
applied = migration_applied("parts", MIGRATION_NAME)

print(f"[repair] parts_color exists? {exists}")
print(f"[repair] parts.{MIGRATION_NAME} applied? {applied}")

if exists and not applied:
    print(f"[repair] Faking parts {MIGRATION_NAME} (table already exists)")
    call_command("migrate", "parts", MIGRATION_NAME, fake=True, interactive=False)

PY

# Now run normal migrations
python manage.py migrate --no-input

python manage.py bootstrap_superuser
