#! /bin/bash

python manage.py makemigrations
python manage.py migrate

if [ "$DJANGO_SUPERUSER_EMAIL" ]
then
    python manage.py createsuperuser \
        --noinput \
        --email $DJANGO_SUPERUSER_EMAIL
fi

exec "$@"
