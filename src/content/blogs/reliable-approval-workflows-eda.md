---
title: Designing Reliable Approval Workflows with Event-Driven Architecture
date: 2026-01-20
readTime: 5 min read
tags: [Architecture, Microservices, PostgreSQL, QuestDB]
slug: reliable-approval-workflows-eda
excerpt: Architectural notes on building multi-tier staff approval flows, handling state transitions, and tracking audit logs with timeseries data.
---

# Designing Reliable Approval Workflows with Event-Driven Architecture

Multi-tier approval workflows—like Business Travel Requests (BTR) and employee Time Off curation—pose unique challenges when managing concurrent decisions, cancellations, and real-time state sync across teams.

## 1. State Machine Modeling

Every approval entity traverses a deterministic finite state machine (FSM):

- `DRAFT`: Request created by employee, pending initial validation.
- `SUBMITTED`: Dispatched to primary supervisor.
- `IN_REVIEW`: Escalated to department head or HR division.
- `APPROVED` / `REJECTED`: Terminal states requiring notification triggers.
- `REVISED`: Returned to requester for budget or itinerary adjustment.

```sql
CREATE TABLE approval_state_transitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id VARCHAR(64) NOT NULL,
    actor_id VARCHAR(64) NOT NULL,
    from_state VARCHAR(32) NOT NULL,
    to_state VARCHAR(32) NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 2. Timeseries Auditing with QuestDB

In high-volume enterprise systems, logging every granular action in the operational PostgreSQL database degrades query performance over time.

We stream all state change events via Kafka topics directly into QuestDB for real-time audit queries:

```sql
SELECT timestamp, request_id, actor_id, from_state, to_state 
FROM approval_state_transitions 
WHERE request_id = 'BTR-2026-091' 
ORDER BY timestamp DESC;
```

This offloads analytical dashboard queries and compliance reports from the primary relational database.

## 3. Transactional Outbox Pattern

To guarantee that state transitions and message broadcasts never drift out of sync:

1. Update entity state and append to an `outbox` table in a single local database transaction.
2. A lightweight change data capture (CDC) poller streams outbox records to Kafka with at-least-once delivery semantics.
3. Consumers acknowledge messages idempotently using the unique transaction ID.

## Conclusion

Combining explicit state machine transitions with an event-driven outbox pattern ensures data consistency across services while QuestDB keeps audit access instantaneous.

