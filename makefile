migrations/litellm/pull:
	@prisma db pull --schema .prisma/litellm.schema.prisma

migrations/nearai-cloud/dev:
	@prisma migrate dev --schema .prisma/nearai-cloud.schema.prisma --skip-generate

migrations/nearai-cloud/deploy:
	@prisma migrate deploy --schema .prisma/nearai-cloud.schema.prisma


phala/create:
	@rm -rf .phala && env-cmd -f .env-phala sh -c 'phala deploy --api-key $$PHALA_CLOUD_API_KEY --name $$PHALA_CVM_NAME --vcpu $$PHALA_VCPU --memory $$PHALA_MEMORY --disk-size $$PHALA_DISK_SIZE --env-file $$PHALA_COMPOSE_ENV_PATH --compose $$PHALA_COMPOSE_FILE_PATH'

phala/replicate:
	@env-cmd -f .env-phala sh -c 'phala cvms replicate $$PHALA_MAIN_CVM_ID'

phala/upgrade/main:
	@env-cmd -f .env-phala sh -c 'phala deploy --api-key $$PHALA_CLOUD_API_KEY --uuid $$PHALA_MAIN_CVM_ID --compose $$PHALA_COMPOSE_FILE_PATH'

phala/upgrade/replica:
	@env-cmd -f .env-phala sh -c 'phala deploy --api-key $$PHALA_CLOUD_API_KEY --uuid $$PHALA_REPLICA_CVM_ID --compose $$PHALA_COMPOSE_FILE_PATH'
