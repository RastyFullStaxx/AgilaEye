# ADR-0001: Naming Policy

## Status

Accepted

## Context

The repository path and research system use AgilaEye, while the existing Tauri
app product name and UI copy use HaribonEye. Without a policy, future docs,
packages, diagrams, and screenshots can drift.

## Decision

Use AgilaEye for repository, system, architecture, dataset, ML, and research
documentation. Use HaribonEye for the current app/prototype product name and
existing Tauri UI branding.

## Consequences

- Future docs should refer to "AgilaEye" unless specifically discussing the app
  shell or UI product name.
- Renaming HaribonEye UI strings is a separate future decision.
- Dataset and Python package naming should use AgilaEye.

