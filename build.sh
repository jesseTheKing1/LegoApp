#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input

# ✅ sync migration history with existing tables
python manage.py migrate --fake-initial

python manage.py bootstrap_superuser
