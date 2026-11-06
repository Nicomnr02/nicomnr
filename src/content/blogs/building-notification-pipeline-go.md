---
title: Building a High-Throughput Notification Pipeline in Go
date: 2026-03-15
readTime: 4 min read
tags: [Go, Kafka, Redis, Distributed Systems]
slug: building-notification-pipeline-go
excerpt: How we designed a multi-channel batch actor notification engine capable of delivering millions of events with dynamic template parameterization and JWT blockers.
---

# Building a High-Throughput Notification Pipeline in Go

Designing notification pipelines for financial systems requires high throughput, strict ordering, and zero tolerance for missed alerts. Here is an architectural breakdown of how we approached the problem.

## 1. The Core Bottleneck

When dispatching critical transactions, MFA codes, or loan approval alerts, traditional notification services frequently bottleneck around template evaluation and cross-service actor dispatching.

```go
type NotificationEvent struct {
    ID          string            `json:"id"`
    RecipientID string            `json:"recipient_id"`
    Channel     string            `json:"channel"` // SMS, Push, WhatsApp, Email
    Payload     map[string]string `json:"payload"`
    Priority    int               `json:"priority"`
    CreatedAt   time.Time         `json:"created_at"`
}
```

If templates are evaluated on-the-fly without compilation caching, or if HTTP dispatchers are spawned synchronously per message, CPU cycles spike and worker goroutines stall waiting on third-party aggregators.

## 2. Partitioned Kafka & Batch Actor Pool

Instead of processing incoming events synchronously, we decoupled intake from dispatching using partitioned Kafka topics and an in-memory batch actor pool:

- **Partition by Recipient**: Ensures strict in-order delivery per user while scaling horizontally across partitions.
- **Dynamic Template Parameterization**: Templates are compiled once and stored in Redis with atomic invalidation.
- **Batch Actor Dispatch**: Workers consume chunks of events, group them by provider, and pipeline HTTP/2 connection reuse.

## 3. Resilience & Rate Limiting

To prevent provider throttling during promotional surges:

1. **Sliding-window Rate Limiter**: Implemented via Redis sorted sets (`ZADD` / `ZREMRANGEBYSCORE`).
2. **Dead Letter Queue (DLQ)**: Failed deliveries after 3 exponential backoff retries land in a dead-letter topic for inspection.
3. **JWT Blocker**: Safeguards session termination, OTP, and password reset endpoints against replay attacks.

## Takeaway

By decoupling the pipeline into asynchronous actor stages and caching template parsing in Redis, system throughput increased by **3.8x** while reducing end-to-end delivery latency below 120ms.

