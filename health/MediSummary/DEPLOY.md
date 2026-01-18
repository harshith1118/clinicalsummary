# Deploying MediSummary to Google Cloud Platform (GCP)

This guide assumes you have the [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed and initialized.

## 1. Login and Set Project
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

## 2. Enable Services
Ensure Cloud Run and Container Registry/Artifact Registry APIs are enabled:
```bash
gcloud services enable run.googleapis.com containerregistry.googleapis.com
```

## 3. Build and Deploy
Run the following single command to build the container and deploy it to Cloud Run. 
Replace `YOUR_API_KEY` with your actual Gemini API key.

```bash
gcloud run deploy medisummary \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=YOUR_API_KEY,PORT=8080
```

## 4. Done!
The command will output a Service URL (e.g., `https://medisummary-xyz-uc.a.run.app`). Open that link to use your app.
