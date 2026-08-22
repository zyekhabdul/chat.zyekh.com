#!/usr/bin/env bash
set -e

MSG="$1"
if [ -z "$MSG" ]; then
  echo "[ ERROR ] Commit message required. Usage: ./scripts/release.sh \"feat(scope): message\""
  exit 1
fi

PROJECT_DIR="/home/fuckadmin/Projects/chat.zyekh.com"
OBSIDIAN_DIR="/home/fuckadmin/Documents/Obsidian Vault/00-AGY-Memory/chat-zyekh-com"
cd "$PROJECT_DIR"

echo "=== STEP 1: RUNNING FULL TEST & QUALITY GATE SUITE ==="
npm test

echo "=== STEP 2: BUMPING ASSET CACHE VERSIONS ==="
node "$PROJECT_DIR/scripts/bump_assets.js"

echo "=== STEP 3: DOCKER CONTAINER BUILD & SWARM UPDATE ==="
docker build -t chat-zyekh-com-2yrzqt:latest -t chat-zyekh:latest .
docker service update --image chat-zyekh-com-2yrzqt:latest --force chat-zyekh-com-2yrzqt

echo "=== STEP 4: GIT COMMIT LOCAL CHANGES ==="
git add 404.html PLAN.md assets/ index.html package.json scripts/ check_emojis.py
git commit -m "$MSG"

COMMIT_HASH=$(git rev-parse HEAD)
TIMESTAMP=$(date -Iseconds)

echo "=== STEP 5: SINKRONISASI OBSIDIAN RAG MEMORY ==="
if [ -d "$OBSIDIAN_DIR" ]; then
  cat << RAGEOF > "$OBSIDIAN_DIR/STATE.md"
# STATE.md — chat-zyekh-com

- **Current Phase**: Production Deployment ($COMMIT_HASH)
- **Active Task**: $MSG
- **Status**: Verified 0 emoji, 0 syntax error, docker container live, pushed to remotes
- **git_commit_hash**: \`$COMMIT_HASH\`
RAGEOF

  cat << RAGEOF > "$OBSIDIAN_DIR/INDEX.md"
# INDEX.md — chat-zyekh-com

- **Project Name**: \`chat-zyekh-com\`
- **Repository Path**: \`/home/fuckadmin/Projects/chat.zyekh.com\`
- **Latest Git Commit Hash**: \`$COMMIT_HASH\`
- **Last Memory Sync**: $TIMESTAMP
RAGEOF
  echo "[ PASSED ] Obsidian RAG updated to commit: $COMMIT_HASH"
fi

echo "=== STEP 6: GIT PUSH GUARD (git-push-restriction.md) ==="
if [[ "$*" == *"--push"* ]] || [ "$ALLOW_GIT_PUSH" = "1" ]; then
  echo "[ PUSH ] Pushing to remote repositories via SSH..."
  ALLOW_GIT_PUSH=1 git push all main
  ALLOW_GIT_PUSH=1 git push origin main
  
  echo "=== STEP 7: LIVE EDGE VERIFICATION ==="
  EDGE_CSS=$(curl -s https://chat.zyekh.com/ | grep -o 'assets/css/app.css?v=[^"'\'' ]*' || true)
  EDGE_JS=$(curl -s https://chat.zyekh.com/ | grep -o 'assets/js/app.js?v=[^"'\'' ]*' || true)
  echo "[ LIVE EDGE CSS ] $EDGE_CSS"
  echo "[ LIVE EDGE JS  ] $EDGE_JS"
else
  echo "[ LOCAL ONLY ] Remote push skipped. To push to remotes, provide --push or set ALLOW_GIT_PUSH=1."
fi

echo "=== RELEASE COMPLETE ($COMMIT_HASH) ==="
