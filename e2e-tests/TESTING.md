# Testing Guide

## T069: Performance Tests

Performance tests ensure API endpoints respond within 200ms.

### Running Performance Tests

```bash
# Install Apache Bench or similar tool
sudo apt-get install apache2-utils

# Test API endpoints
ab -n 1000 -c 10 http://localhost:3000/api/wedding/config
ab -n 1000 -c 10 http://localhost:3000/api/auth/session
```

### Performance Benchmarks

- **API Response Time**: < 200ms (p95)
- **Database Queries**: < 50ms (p95)
- **File Uploads**: < 2s for 4MB files
- **Page Load**: < 1s (First Contentful Paint)

## T072: Security Testing

Security tests for file uploads and authentication.

### File Upload Security

```bash
# Test file size limits
curl -X POST http://localhost:3000/api/wedding/gallery/upload \
  -F "file=@large-file.jpg" \
  -H "Cookie: session=..."

# Test invalid file types
curl -X POST http://localhost:3000/api/wedding/gallery/upload \
  -F "file=@malicious.exe" \
  -H "Cookie: session=..."
```

### Authentication Security

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ HTTP-only session cookies
- ✅ CSRF protection (SameSite cookies)
- ✅ Email validation
- ✅ SQL injection prevention (parameterized queries)

### Security Checklist

- [ ] All API routes require authentication
- [ ] File uploads validate MIME types
- [ ] File uploads enforce size limits (4MB)
- [ ] Passwords are hashed with bcrypt
- [ ] Session cookies are HTTP-only and secure
- [ ] No sensitive data in error messages
- [ ] Rate limiting on auth endpoints
- [ ] Input validation on all endpoints

## T073: Load Testing

Load testing for multi-tenant scenarios.

### Running Load Tests

```bash
# Install k6 load testing tool
# https://k6.io/docs/getting-started/installation/

# Run load test
k6 run tests/load/wedding-site.js
```

### Load Test Scenarios

1. **Concurrent Users**: 100 simultaneous visitors
2. **API Throughput**: 1000 requests/second
3. **Database Connections**: 50 concurrent connections
4. **File Uploads**: 10 concurrent uploads

### Multi-Tenant Load Test

```javascript
// tests/load/wedding-site.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 50 }, // Ramp up
    { duration: '1m', target: 100 }, // Stay at 100 users
    { duration: '30s', target: 0 }, // Ramp down
  ],
};

export default function () {
  // Test different subdomains (multi-tenancy)
  const subdomains = ['wedding1', 'wedding2', 'wedding3'];
  const subdomain = subdomains[Math.floor(Math.random() * subdomains.length)];

  const res = http.get(`http://${subdomain}.localhost:3000`);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });

  sleep(1);
}
```

## T074: Quickstart Validation

Execute validation scenarios from quickstart.md.

### Manual Validation Steps

1. **User Registration**

   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123","groomName":"John","brideName":"Jane"}'
   ```

2. **Login**

   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}' \
     -c cookies.txt
   ```

3. **Update Configuration**

   ```bash
   curl -X PUT http://localhost:3000/api/wedding/config \
     -H "Content-Type: application/json" \
     -b cookies.txt \
     -d '{"weddingDate":"2024-12-25T00:00:00.000Z"}'
   ```

4. **Upload Photo**

   ```bash
   curl -X POST http://localhost:3000/api/wedding/gallery/upload \
     -b cookies.txt \
     -F "file=@photo.jpg" \
     -F "alt=Wedding photo"
   ```

5. **Publish Wedding**

   ```bash
   curl -X POST http://localhost:3000/api/wedding/publish \
     -b cookies.txt
   ```

6. **Verify Public Access**
   ```bash
   curl http://subdomain.localhost:3000
   ```

## Running All Tests

```bash
# Unit tests
yarn test

# E2E tests (requires running server)
yarn dev &
yarn test:e2e

# Performance tests
./tests/performance/run-benchmarks.sh

# Security audit
yarn audit

# Coverage report
yarn test --coverage
```

## Test Coverage Goals

- **Unit Tests**: 70% code coverage minimum
- **Integration Tests**: All API endpoints covered
- **E2E Tests**: Critical user journeys covered
- **Performance**: All endpoints < 200ms
- **Security**: OWASP Top 10 addressed
