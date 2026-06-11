#!/usr/bin/env bash
set -euo pipefail

# Upgrades QuantLectures in place without deleting existing PocketBase data.
# Steps:
# 1) backup pb_data + .env
# 2) pull latest main
# 3) rebuild/restart containers
# 4) apply non-destructive PocketBase setup/migrations
# 5) show short health output

PROJECT_DIR="${PROJECT_DIR:-$PWD}"
BRANCH="${BRANCH:-main}"
REMOTE="${REMOTE:-origin}"

cd "$PROJECT_DIR"

if [[ ! -f "docker-compose.yml" ]]; then
  echo "Error: docker-compose.yml not found in $PROJECT_DIR"
  exit 1
fi

if [[ ! -d ".git" ]]; then
  echo "Error: $PROJECT_DIR is not a git repository"
  exit 1
fi

TS="$(date +%F_%H%M%S)"
BACKUP_DIR="backups/$TS"

echo "==> Creating backup in $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

if [[ -d "pb_data" ]]; then
  tar -czf "$BACKUP_DIR/pb_data.tgz" pb_data
  echo "  - Saved pb_data to $BACKUP_DIR/pb_data.tgz"
else
  echo "  - pb_data directory not found (skipping data archive)"
fi

if [[ -f ".env" ]]; then
  cp .env "$BACKUP_DIR/.env.backup"
  echo "  - Saved .env to $BACKUP_DIR/.env.backup"
else
  echo "  - .env not found (skipping env backup)"
fi

echo "==> Pulling latest code from $REMOTE/$BRANCH"
git fetch "$REMOTE"
git checkout "$BRANCH"
git pull --ff-only "$REMOTE" "$BRANCH"

echo "==> Rebuilding and restarting containers"
docker compose up -d --build

echo "==> Ensuring PocketBase superuser exists"
if [[ -n "${PB_ADMIN_EMAIL:-}" && -n "${PB_ADMIN_PASSWORD:-}" ]]; then
  docker compose exec -T pocketbase pocketbase superuser upsert "$PB_ADMIN_EMAIL" "$PB_ADMIN_PASSWORD"
else
  echo "  - Skipping superuser upsert (PB_ADMIN_EMAIL/PB_ADMIN_PASSWORD not set)."
fi

echo "==> Running PocketBase setup"
if command -v npm >/dev/null 2>&1; then
  npm ci
  npm run setup
else
  docker run --rm \
    --network host \
    -v "$PWD":/app \
    -w /app \
    --env-file .env \
    node:20 \
    sh -lc "npm ci && npm run setup"
fi

echo "==> Service status"
docker compose ps

echo "==> Recent logs (pocketbase)"
docker compose logs --tail=80 pocketbase || true

echo "==> Recent logs (quantlectures)"
docker compose logs --tail=80 quantlectures || true

echo "\nUpgrade completed successfully."
echo "Backup created at: $BACKUP_DIR"
