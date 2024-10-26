## Create/Start virtual environment

### For windows user (Powershell)

1. Create virtual environment

```
python -m venv env
```

2. Start virtual environment

```
.\env\Scripts\activate
```

3. Install python packages

```
pip install -r requirements.txt
```

### For MacOS/Linux user

1. Create virtual environment

```
python3 -m venv env
```

2. Start virtual environment

```
source env/bin/activate
```

3. Install python packages

```
pip install -r requirements.txt
```

## Startup database by Docker

## Start uvicorn server

```
python main.py
```

## After starting server , to open swagger

```
http://127.0.0.1:8080/docs  (open it on browser)
```
