# Quick Deployment Guide for AkoRangi Lambda Functions

This guide will help you deploy the Lambda functions to AWS in under 10 minutes.

## Prerequisites Checklist

- [ ] AWS account (sign up at https://aws.amazon.com if you don't have one)
- [ ] AWS CLI installed and configured
- [ ] Node.js and npm installed (for Serverless Framework)
- [ ] Python 3.12 installed

## Step 1: Configure AWS CLI (2 minutes)

```bash
aws configure
```

Enter:
- AWS Access Key ID: `[Your access key]`
- AWS Secret Access Key: `[Your secret key]`
- Default region: `us-east-1` (or your preferred region)
- Default output format: `json`

## Step 2: Install Serverless Framework (1 minute)

```bash
npm install -g serverless
cd lambda_functions
npm install
```

## Step 3: Set Environment Variables (2 minutes)

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your values:
```
DATABASE_URL=postgresql://user:password@your-host:5432/database
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your_client_id
OPENAI_API_KEY=sk-your_openai_key
```

## Step 4: Deploy! (3-5 minutes)

```bash
serverless deploy
```

This will:
- Package all 12 Lambda functions
- Create API Gateway endpoints
- Set up IAM roles
- Configure CORS
- Deploy to AWS

## Step 5: Test Your API (2 minutes)

After deployment, you'll see output like:

```
endpoints:
  GET - https://abc123xyz.execute-api.us-east-1.amazonaws.com/dev/auth/user
  POST - https://abc123xyz.execute-api.us-east-1.amazonaws.com/dev/questions/generate
  ...
```

Test an endpoint:

```bash
# Get a JWT token from Auth0 first
TOKEN="your-auth0-jwt-token"

# Test the user endpoint
curl -H "Authorization: Bearer $TOKEN" \
  https://your-api-gateway-url/dev/auth/user
```

## Step 6: Update Frontend (Optional)

To use Lambda instead of Express, update your API base URL:

```typescript
// In your frontend config
const API_BASE_URL = "https://your-api-gateway-url.amazonaws.com/dev";
```

## Monitoring

View logs in real-time:

```bash
serverless logs -f generateQuestion -t
```

View all function info:

```bash
serverless info
```

## Cost Estimate

With AWS Free Tier:
- First 1M requests/month: **FREE**
- First 400,000 GB-seconds compute: **FREE**

For a small educational app with 1,000 students:
- ~100,000 requests/month
- **Cost: $0/month** (within free tier)

## Troubleshooting

### "Module not found" errors

Make sure you're in the `lambda_functions` directory before deploying.

### Database connection errors

- Verify your `DATABASE_URL` in `.env`
- If using private RDS, set up VPC configuration in `serverless.yml`

### Auth errors

- Ensure `AUTH0_DOMAIN` and `AUTH0_CLIENT_ID` are correct
- JWT tokens must be valid and not expired

## Next Steps

1. **Set up custom domain**: Use API Gateway custom domains
2. **Enable CloudWatch alarms**: Get notified of errors
3. **Optimize costs**: Adjust memory/timeout based on metrics
4. **Add monitoring**: Use AWS X-Ray for tracing

## Getting Help

- AWS Lambda docs: https://docs.aws.amazon.com/lambda/
- Serverless Framework docs: https://www.serverless.com/framework/docs
- Check CloudWatch logs for detailed error messages

## Rollback

To remove all Lambda functions:

```bash
serverless remove
```

## Production Checklist

Before going to production:

- [ ] Use RDS Proxy for database connection pooling
- [ ] Set up VPC if database is private
- [ ] Enable AWS X-Ray tracing
- [ ] Configure CloudWatch alarms
- [ ] Set up custom domain with SSL
- [ ] Review IAM permissions (principle of least privilege)
- [ ] Enable API Gateway caching
- [ ] Set up WAF for DDoS protection
- [ ] Test all endpoints thoroughly
- [ ] Load test with realistic traffic patterns

---

**Total deployment time: ~10 minutes**

You now have 12 serverless Lambda functions running your AkoRangi API! 🎉
