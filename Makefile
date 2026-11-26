PORT ?= 8000
HOST ?= 127.0.0.1

.PHONY: serve

# Preview at http://127.0.0.1:8000; override with make serve PORT=8080.
serve:
	python3 -m http.server $(PORT) --bind $(HOST) --directory site
