#! /bin/bash

sed -i "s/'HOST': 'localhost'/'HOST': '2345-postgres'/g" ft_transcendence/settings.py

python3 manage.py makemigrations
python3 manage.py migrate

exec "$@"
