# Audio Analysis POC
Just a proof of concept with noise reduction function for .wav files only. 2 channel audio has been taken into account.
24-bit audio implementation missing.

## Dockerfile
Create docker image in backend/ directory.
```bash
docker build -t poc-backend .
```
Run docker container.
```bash
docker run -p 5000:5000 poc-backend
```

## Frontend
Run frontend using npm. Before running, install npm_modules using `npm install` in `frontend/poc/` directory.
```bash
npm run dev
```