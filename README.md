# Document Management System

## Overview

This is a Document Management System built with NestJS, following Hexagonal Architecture (Ports & Adapters) with CQRS. It allows users to upload documents (e.g., invoices, receipts, contracts), which are then processed asynchronously via a Redis queue, including OCR extraction and persistence to a PostgreSQL database.

## Features
- Upload and store documents
- Asynchronous document processing using Redis queue
- OCR processing (simulated for now)
- PostgreSQL database for document metadata storage
- Containerized development environment

## Architecture
````
src/
├── app/              # Application layer (HTTP controllers, DTOs)
├── domain/           # Business logic and models
├── infrastructure/   # External services implementation
└── config/ 
````

## Prerequisites
- Docker and Docker Compose
- Node.js 20+
- Yarn package manager


## Quick Start
- Clone the repository
- Create .env file:
````
PORT=3000
REDIS_URL=redis://redis:6379
POSTGRES_URL=postgresql://postgres:password@postgres:5432/document_management
POSTGRES_DATABASE=document_management
````
- Start the services:
```bash
docker-compose up
```

## API Endpoints
POST /documents/upload - Upload new document
GET / - Health check

## Design Decisions

### Database Choice: PostgreSQL
PostgreSQL was chosen for its:
- Strong relational data support
- Smooth transition from Proof of Concept (PoC) to MVP
- Reliability in development and production environments

### Queuing Strategy
- Decoupled, scalable document processing
- Retry and delay capabilities
- Real-time buffer simulation for OCR and file uploads

### Testing Strategy
The project uses a combination of:
- Unit tests for business logic
- Factory pattern for test data generation
- Ready-to-extend structure for integration and E2E tests


## Future Improvements

### Infrastructure
- Migrate to Kubernetes for better orchestration
- Store files in cloud object storage (S3, GCS, etc.)
- Replace simulated OCR with real OCR engine (Tesseract, AWS Textract)
- Run Redis worker as a separate process from API

### Security
- Implement authentication and role-based authorization
- Add rate limiting and abuse protection

### Monitoring
- Add OpenTelemetry integration
- Use AWS CloudWatch or DataDog for monitoring
- Set up alerts for:
1. High error rates
2. Queue processing delays
3. High latency

### Documentation
- Add OpenAPI/Swagger documentation
- Introduce API versioning

### Testing
- Increase test coverage