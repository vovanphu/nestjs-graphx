# nestjs-graphx

A code-first GraphQL + Microservice library for NestJS, built for small to medium systems with full entity-centric automation and opinionated relationship management.

> ⚠️ This is a personal learning project and not intended for production use.  
> While it demonstrates working microservice architecture and automation patterns, it is primarily a proof-of-concept for experimentation and internal use.

## Features

- Code-first Entity Definition: Define your entity once, use it across ORM, Microservice APIs, and GraphQL.
- Automatic CRUD and Relationship Handling: Factory-based generation for service, controller, resolver.
- GraphQL Resolver Generation: Automatic ObjectType, InputType creation and resolver wiring from entity metadata.
- Advanced Querying: Nested AND/OR filtering, offset pagination, dataloader-backed relation queries.
- Docker-ready: Quickstart with GraphQL Gateway + RabbitMQ + MySQL + Sample Cat Management Service.

## Quick start with Docker Compose

```bash
git clone https://github.com/vovanphu/nestjs-graphx
cd nestjs-graphx
yarn
yarn docker-up:dev -d
```

Access the GraphQL playground at <http://localhost:4000>

Explore the prebuilt services:

- `cat-management`: Manages Cat Boundary Context.
- `graphql-gateway`: API Gateway.

> Note:
> For development convenience, local folders (including node_modules) are bind-mounted into containers.
> This approach simplifies debugging but is not recommended for production, especially if using native bindings (e.g. `argon2`).
> Consider using a clean container setup when needed and for production environments.

## Technologies

- Framework: NestJS.
- Database: TypeORM (MySQL).
- API Layer: GraphQL (Code-first).
- Transport layer: RabbitMQ (Microservices).
- Container: Docker Compose.

## Design Philosophy

### Asymmetric Relation Ownership Pattern (AROP)

In distributed systems, especially microservice architectures with independent persistent layers, modeling relationships between entities can quickly become ambiguous and messy.

- Where should relation data be stored?
- Which service is responsible for updating it?
- What happens if multiple services try to change it?

The **Asymmetric Relation Ownership Pattern** is an attempt to offer a simple yet consistent answer:

> Only one side of a relationship should be allowed to own and mutate it - the side that is more semantically dependent.

#### Core concepts

In any business-domain relationship between two entities:

- The entity more dependent on the relationship should be the owning side.
- The **owning side** should be the side:
  - Holding the foreign key or pivot metadata in storage.
  - Totally controlling any associated command logic (e.g. relation creation, deletion).
- The **non-owning side**:
  - May read the relationship via queries (mostly through gateway orchestration).
  - May acknowledge information about the relationship update via events (in choreography pattern).
  - **Must not** perform any mutations related to that relationship.

This pattern is enforced across all layers:

- **Database**: Join column live on the owner side.
- **Service**: Only the owner's service exposes mutation APIs.
- **Gateway**: Only proxies commands to the owner's service, others read-only.

#### Goals

- **Reduce cross-service coupling**: Only the service that understands the relation's business meaning can mutate it.
- **Reduce the need for distributed transactions**: No need for orchestrator or two-phase commits for relation mutations.
- **Clarifies API ownership**: Easy to reason about who exposes what and why.
- **Enables better tooling**: Relation ownership can be inferred, used to auto-generate resolvers/controllers/service schemas correctly.

#### Examples

| Relationship                  | Owner                                              | Why                                                    |
|-------------------------------|----------------------------------------------------|--------------------------------------------------------|
| `UserProfile` – `User` (1–1)  | `UserProfile`                                      | Exists only in the context of a `User`                 |
| `Task` – `User` (N–N)         | `Task` (`TaskAssignee` In `TaskManagementService`) | A `Task` depends on who is assigned, not vice versa    |
| `Address` – `Order` (1–N)     | `Address`                                          | `Address` exists solely under an `Order`               |

> AROP is not a widely adopted standard or formal pattern — it's simply a naming and enforcement convention used in this project to reduce ambiguity and guide automation logic.

## Roadmap

- Add optional support for monolithic architecture (non-microservice mode)
- Support more database (NoSQL).
- Support REST API.
- Support Role Based Access Control.

## Limitations

- gRPC is not supported due to incompatibility with code-first philosophy.
- Not intended for large-scale, high-load production systems — this is a proof-of-concept for experimentation and learning.
- Not published on npm (yet), use via local path or internal git repository.

## License

MIT -- See LICENSE file.
