FROM python:3.12-alpine
COPY ./src /app
WORKDIR /app
ENV VIRTUAL_ENV = /app/venv
RUN python -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
RUN export FLASK_APP=app.py
RUN pip3 install -r requirements.txt

EXPOSE 5000
