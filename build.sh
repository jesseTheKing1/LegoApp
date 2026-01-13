#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate --fake-initial

python manage.py dbshell
DROP TABLE IF EXISTS parts_color CASCADE;