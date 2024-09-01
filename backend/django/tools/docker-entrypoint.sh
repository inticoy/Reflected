#! /bin/bash


python manage.py makemigrations

# if django column does not exist error raises
# python manage.py migrate [app name] zero

python manage.py migrate

if [ "$DJANGO_SUPERUSER_EMAIL" ]
then
    python manage.py createsuperuser \
        --noinput \
        --email $DJANGO_SUPERUSER_EMAIL
fi

exec "$@"
