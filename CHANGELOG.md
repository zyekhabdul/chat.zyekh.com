# CHANGELOG: chat.zyekh.com

All notable changes to this project will be documented in this file.

## [1.2.0] - 2026-09-13
### Fixed
- Prioritize Docker Swarm internal service DNS (`http://zyekh-ai-core-nblqvy:3000`) in `CANDIDATE_TARGETS`.
- Implement `activeUpstream` dynamic caching to eliminate per-request DNS failover retry latency.
