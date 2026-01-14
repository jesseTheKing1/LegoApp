#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input

echo "=== ABOUT TO RUN MIGRATIONS ==="
python manage.py showmigrations parts --plan || true
echo "=== RUNNING: migrate --fake-initial ==="
python manage.py migrate --fake-initial --noinput

python manage.py bootstrap_superuser
