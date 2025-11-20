# AkoRangi Lambda Functions

Python-based AWS Lambda functions exported from the AkoRangi Express backend. These functions can be deployed independently to AWS Lambda for serverless operation.

## Structure

```
lambda_functions/
├── shared/              # Shared utilities
│   ├── database.py      # PostgreSQL database connections
│   ├── auth.py          # Auth0 JWT validation
│   ├── openai_client.py # OpenAI API integration
│   └── responses.py     # HTTP response helpers
├── auth/                # Authentication endpoints
│   └── get_user.py      # GET /auth/user
├── practice/            # Practice session endpoints
│   ├── create_session.py    # POST /practice-sessions
│   └── complete_session.py  # POST /practice-sessions/{id}/complete
├── questions/           # Question generation endpoints
│   ├── generate.py      # POST /questions/generate
│   └── validate.py      # POST /questions/validate
├── achievements/        # Achievement endpoints
│   └── get_user_achievements.py  # GET /achievements/user
├── pets/                # Virtual pet endpoints
│   ├── get_pet.py       # GET /pets
│   └── create_pet.py    # POST /pets
└── serverless.yml       # Deployment configuration
```

## Prerequisites

1. **AWS Account**: Sign up at https://aws.amazon.com/
2. **AWS CLI**: Install and configure
   ```bash
   aws configure
   ```
3. **Serverless Framework**: Install globally
   ```bash
   npm install -g serverless
   ```
4. **Python 3.12**: Ensure Python is installed
5. **Environment Variables**: Copy `.env.example` to `.env` and fill in values

## Installation

1. Navigate to the lambda_functions directory:
   ```bash
   cd lambda_functions
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Install Serverless plugins:
   ```bash
   npm install --save-dev serverless-python-requirements
   ```

## Deployment

### Deploy All Functions

```bash
serverless deploy
```

This will:
- Package all Lambda functions
- Create API Gateway endpoints
- Set up IAM roles
- Configure CORS

### Deploy Single Function

```bash
serverless deploy function -f generateQuestion
```

### View Deployment Info

```bash
serverless info
```

### View Logs

```bash
# Live tail logs
serverless logs -f generateQuestion -t

# View recent logs
serverless logs -f generateQuestion
```

## Environment Variables

Set these in AWS Lambda Console → Configuration → Environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `AUTH0_DOMAIN`: Your Auth0 tenant domain
- `AUTH0_CLIENT_ID`: Auth0 application client ID
- `OPENAI_API_KEY`: OpenAI API key

## Authentication

Lambda functions use **Auth0 JWT tokens** instead of Express sessions:

### Frontend Integration

```javascript
// Add JWT token to requests
const token = "your-auth0-jwt-token";

fetch('https://your-api-gateway-url/auth/user', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Getting JWT Tokens

In your Auth0 callback, extract the JWT token and use it for API requests instead of relying on cookies.

## API Endpoints

After deployment, you'll get an API Gateway URL like:
```
https://abc123xyz.execute-api.us-east-1.amazonaws.com/dev
```

### Endpoints

| Method | Path | Function | Description |
|--------|------|----------|-------------|
| GET | `/auth/user` | getUser | Get authenticated user |
| POST | `/practice-sessions` | createSession | Create practice session |
| POST | `/practice-sessions/{id}/complete` | completeSession | Complete session |
| POST | `/questions/generate` | generateQuestion | Generate AI question |
| POST | `/questions/validate` | validateAnswer | Validate user answer |
| GET | `/achievements/user` | getUserAchievements | Get user achievements |
| GET | `/pets` | getPet | Get user's pet |
| POST | `/pets` | createPet | Create/adopt pet |

## Local Testing

Test individual functions locally:

```bash
# Install serverless-offline plugin
npm install --save-dev serverless-offline

# Run locally
serverless offline
```

Or test directly with Python:

```python
# In lambda_functions directory
python auth/get_user.py
```

## Database Connection

Lambda functions use **psycopg2** for PostgreSQL connections. For production:

1. **Use RDS Proxy** to handle connection pooling
2. **Set up VPC** if your database is not publicly accessible
3. **Configure Security Groups** to allow Lambda access

## Cost Optimization

- **Memory**: Start with 512MB, adjust based on monitoring
- **Timeout**: 30s for most functions, 60s for OpenAI calls
- **Concurrency**: Set reserved concurrency to prevent runaway costs
- **Free Tier**: First 1M requests/month are free

## Monitoring

View metrics in AWS CloudWatch:
- Lambda → Your Function → Monitor tab
- Set up alarms for errors and duration

## Troubleshooting

### Import Errors

If you get module import errors, ensure `sys.path.append('../shared')` is at the top of each function.

### Database Connection Errors

- Check `DATABASE_URL` is set correctly
- Ensure Lambda has network access to your database
- Consider using RDS Proxy for connection pooling

### Auth0 Errors

- Verify `AUTH0_DOMAIN` and `AUTH0_CLIENT_ID`
- Check JWT token is valid
- Ensure token audience matches CLIENT_ID

### OpenAI Errors

- Verify `OPENAI_API_KEY` is set
- Check you have sufficient API credits
- Monitor rate limits

## Differences from Express Backend

| Feature | Express | Lambda |
|---------|---------|--------|
| Authentication | Session cookies | JWT tokens |
| Database | Drizzle ORM | psycopg2 |
| Connection Pooling | Built-in | Need RDS Proxy |
| State | Stateful | Stateless |
| Deployment | Single server | Individual functions |
| Cold Starts | None | 1-3 seconds |
| Scaling | Manual | Automatic |

## Migration Path

To migrate from Express to Lambda:

1. **Phase 1**: Deploy Lambda functions alongside Express
2. **Phase 2**: Update frontend to use JWT auth
3. **Phase 3**: Gradually switch API calls to Lambda
4. **Phase 4**: Retire Express backend once all calls migrated

## Coverage

All major Express backend endpoints have been exported to Lambda:

✅ **Authentication**: GET /auth/user
✅ **Practice Sessions**: Create, complete, get recent, get all
✅ **Questions**: Generate (OpenAI), validate (OpenAI)
✅ **Achievements**: Get user achievements
✅ **Pets**: Get pet, create pet, feed pet
✅ **Student Links**: Create student-teacher/parent links

**Not Yet Implemented:**
- Story-related endpoints (can be added following the same pattern)
- Advanced achievement unlocking logic
- Pet level-up calculations

Add additional endpoints as needed following the established pattern in this codebase.

## Support

For issues or questions:
1. Check CloudWatch logs
2. Review serverless.yml configuration
3. Verify environment variables
4. Test locally with serverless-offline

## License

Same as parent AkoRangi project.
