process.env.ENV = 'dev';

// Supabase
process.env.SUPABASE_API_URL='dontcare';
process.env.SUPABASE_ANON_KEY='dontcare';

// Light LLM
process.env.LITELLM_API_URL='http://localhost:4000';
process.env.LITELLM_ADMIN_KEY='sk-master';
process.env.LITELLM_SIGNING_KEY='sk-salt';
process.env.LITELLM_DB_URL='postgresql://litellm_gateway_user:litellm_gateway_password@localhost:5433/litellm-gateway';

// NEAR AI Cloud
process.env.NEAR_AI_CLOUD_DB_URL='postgresql://nearai_cloud_user:nearai_cloud_password@localhost:5433/nearai-cloud';
process.env.NEAR_AI_CLOUD_DB_DIRECT_URL=process.env.NEAR_AI_CLOUD_DB_URL

// Server
process.env.PORT='3001'
