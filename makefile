migrations/litellm/pull:
	@prisma db pull --schema .prisma/litellm.schema.prisma

migrations/nearai-cloud/dev:
	@prisma migrate dev --schema .prisma/nearai-cloud.schema.prisma --skip-generate

migrations/nearai-cloud/deploy:
	@prisma migrate deploy --schema .prisma/nearai-cloud.schema.prisma


phala/create:
	@rm -rf .phala && env-cmd -f .env-phala tsx phala-cloud-scripts/create

phala/replicate:
	@env-cmd -f .env-phala tsx phala-cloud-scripts/replicate

phala/upgrade:
	@env-cmd -f .env-phala tsx phala-cloud-scripts/upgrade
