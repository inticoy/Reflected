FROM python:3.12-bullseye

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY ping-pang-pong .
COPY tools/init_docker.sh /tmp/

RUN pip3 install -r requirements.txt

ENTRYPOINT [ "/bin/sh", "/tmp/init_docker.sh" ]

CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
