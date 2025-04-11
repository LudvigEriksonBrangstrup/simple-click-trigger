
# Supabase Edge Functions

This directory contains Edge Functions that can be deployed to Supabase.

## Available Functions

- `urdf-parser`: Extracts metadata from URDF files using OpenAI
- `create-animation`: Generates animations for URDF models based on user instructions

## Deployment Instructions

### Prerequisites

1. Install Supabase CLI:
   ```
   npm install -g supabase
   ```

2. Login to Supabase:
   ```
   npx supabase login
   ```

3. Set your Supabase project ID:
   ```
   npx supabase link --project-ref mizajlqhooderueazvnp
   ```

### Deploy a Function

To deploy a function, run:

```
node deploy-function.js urdf-parser
```

Or use the Supabase CLI directly:

```
npx supabase functions deploy urdf-parser
```

### Environment Variables

The edge functions require environment variables to be set in your Supabase project:

1. `OPENAI_API_KEY`: Your OpenAI API key for the AI functionality

To set these variables, use:

```
npx supabase secrets set OPENAI_API_KEY=your-api-key
```

### Testing Deployed Functions

After deployment, you can test your function with:

```
curl -X POST 'https://mizajlqhooderueazvnp.supabase.co/functions/v1/urdf-parser' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pemFqbHFob29kZXJ1ZWF6dm5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NzU1MTgsImV4cCI6MjA1NzQ1MTUxOH0.iTbP3KqPr4Fl48YQnlwplyPF3OCTjU5g62WmmygjSbA' \
  -H 'Content-Type: application/json' \
  --data '{"urdfContent":"<robot name=\"test\">...</robot>"}'
```
