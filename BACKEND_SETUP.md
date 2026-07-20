# CureNest Backend Setup

## 1. Install Python packages

```bash
cd server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## 2. Start the backend

```bash
python app.py
```

The API runs at:

```text
http://localhost:5000
```

Your HTML/JS files already use this URL in `js/app.js`.

## 3. Test quickly

Open:

```text
http://localhost:5000/products
```

You should see medicine JSON. Then open `index.html` or run a simple static server from the project root:

```bash
python3 -m http.server 8000
```

Visit:

```text
http://localhost:8000  
```

## API key note

This backend does not require an API key for the current shopping, cart, orders, and prescription upload features. If you later add AI/chat features, create an OpenAI API key from the OpenAI dashboard and place it in `server/.env` as `OPENAI_API_KEY`.
