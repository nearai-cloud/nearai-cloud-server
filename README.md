# nearai-cloud-server
NEAR AI Cloud Server


## Create Docker Image

### Build

From the root folder

```bash
docker buildx build --load --platform linux/amd64 -t nearai-cloud-server:latest -f Dockerfile .
```

## Push

```bash
export OWNER=robortyan
# add tag to build
docker tag nearai-cloud-server:latest ${OWNER}/nearai-cloud-server:latest
# push image
docker push ${OWNER}/nearai-cloud-server:latest
```

## Run Locally

```bash
export HOST_PORT=3000
export ENV=prd
export PORT=3000
export LITELLM_API_URL=http://localhost:4000
export LITELLM_MASTER_KEY=your_litellm_master_key
export LITELLM_SALT_KEY=your_litellm_salt_key
export LITELLM_DATABASE_URL=postgresql://user:password@localhost:5432/litellm_db
export SUPABASE_API_URL=https://your-project.supabase.co
export SUPABASE_ANON_KEY=your_supabase_anon_key
export SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your/webhook/url

docker run --platform linux/amd64 \
    -p ${HOST_PORT}:3000 \
    -e ENV=${ENV} \
    -e PORT=${PORT} \
    -e LITELLM_API_URL=${LITELLM_API_URL} \
    -e LITELLM_MASTER_KEY=${LITELLM_MASTER_KEY} \
    -e LITELLM_SALT_KEY=${LITELLM_SALT_KEY} \
    -e LITELLM_DATABASE_URL=${LITELLM_DATABASE_URL} \
    -e SUPABASE_API_URL=${SUPABASE_API_URL} \
    -e SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY} \
    -e SLACK_WEBHOOK_URL=${SLACK_WEBHOOK_URL} \
    nearai-cloud-server:latest
```
