# API Testing Checklist

## Pre-Testing Setup

- [ ] API documentation reviewed
- [ ] Base URL configured in `cypress.config.js`
- [ ] Authentication tokens/keys set up
- [ ] Test environment is accessible
- [ ] Database is seeded with test data

## Functional Testing

### Request Validation

- [ ] Valid request returns expected response
- [ ] Request with required parameters works
- [ ] Request with optional parameters works
- [ ] Request with all parameters works
- [ ] Request headers are correctly handled

### Response Validation

- [ ] Response status code is correct
- [ ] Response time is within acceptable range
- [ ] Response body structure matches schema
- [ ] Response contains all required fields
- [ ] Data types are correct
- [ ] Response headers are correct

### HTTP Methods

- [ ] GET - Retrieve data
- [ ] POST - Create new resource
- [ ] PUT - Update entire resource
- [ ] PATCH - Partial update
- [ ] DELETE - Remove resource
- [ ] OPTIONS - Supported methods
- [ ] HEAD - Headers only

## Error Handling

### Client Errors (4xx)

- [ ] 400 - Bad Request (invalid syntax)
- [ ] 401 - Unauthorized (missing auth)
- [ ] 403 - Forbidden (no permission)
- [ ] 404 - Not Found (resource doesn't exist)
- [ ] 405 - Method Not Allowed
- [ ] 409 - Conflict (duplicate resource)
- [ ] 422 - Unprocessable Entity (validation error)
- [ ] 429 - Too Many Requests (rate limit)

### Server Errors (5xx)

- [ ] 500 - Internal Server Error
- [ ] 502 - Bad Gateway
- [ ] 503 - Service Unavailable
- [ ] 504 - Gateway Timeout

## Security Testing

- [ ] Authentication required for protected endpoints
- [ ] Authorization checks for different user roles
- [ ] SQL injection attempts handled
- [ ] XSS attempts sanitized
- [ ] API keys not exposed in responses
- [ ] HTTPS enforced
- [ ] CORS policy configured correctly
- [ ] Rate limiting implemented
- [ ] Input validation on all fields
- [ ] Sensitive data masked/encrypted

## Data Validation

- [ ] Required fields validation
- [ ] Optional fields validation
- [ ] Data type validation
- [ ] String length limits
- [ ] Number range limits
- [ ] Email format validation
- [ ] Date format validation
- [ ] Enum values validation
- [ ] Array length limits
- [ ] Nested object validation

## Edge Cases

- [ ] Empty request body
- [ ] Null values
- [ ] Empty strings
- [ ] Very long strings (boundary)
- [ ] Special characters
- [ ] Unicode characters
- [ ] Large numbers
- [ ] Negative numbers
- [ ] Float vs Integer
- [ ] Boolean edge cases

## Performance Testing

- [ ] Response time < 2 seconds
- [ ] Concurrent requests handled
- [ ] Large payload handling
- [ ] Pagination works correctly
- [ ] Caching implemented
- [ ] Load testing completed
- [ ] Stress testing completed

## Integration Testing

- [ ] Database changes persisted
- [ ] Third-party API calls successful
- [ ] Message queue integration
- [ ] Cache invalidation
- [ ] Transaction rollback on error
- [ ] Webhook triggers

## Idempotency

- [ ] POST creates only once
- [ ] PUT is idempotent
- [ ] DELETE is idempotent
- [ ] GET doesn't modify data

## Documentation

- [ ] API endpoints documented
- [ ] Request examples provided
- [ ] Response examples provided
- [ ] Error codes documented
- [ ] Authentication flow documented
- [ ] Rate limits documented

## Cleanup

- [ ] Test data cleaned up
- [ ] Database reset to initial state
- [ ] Generated files removed
- [ ] Cache cleared
- [ ] Sessions terminated

## Reporting

- [ ] Test results documented
- [ ] Failed tests have bug tickets
- [ ] Performance metrics recorded
- [ ] Coverage report generated
- [ ] Test artifacts saved
