migrations/litellm/sync:
	@prisma db pull --schema schema.litellm.prisma

migrations/nearai-cloud/dev:
	@prisma migrate dev --schema schema.nearai-cloud.prisma

migrations/nearai-cloud/prd:
	@prisma migrate deploy --schema schema.nearai-cloud.prisma
