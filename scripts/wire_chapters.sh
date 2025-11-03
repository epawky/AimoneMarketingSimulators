#!/usr/bin/env bash
# Git Bash–safe: avoid `set -u` (unbound PS1 vars can crash the prompt)
set -e -o pipefail

# Standardized lowercase apps
apps=(portal chapterone chaptertwo chapterthree chapterfour chapterfive)

echo ">> Verifying app folders exist..."
for app in "${apps[@]}"; do
  if [ ! -d "apps/$app" ]; then
    echo "!! Missing apps/$app — create it (npm create next-app ...) then re-run."
    exit 1
  fi
done

echo ">> Writing tsconfig.json to each app"
for app in "${apps[@]}"; do
  printf '{ "extends": "../../tsconfig.base.json" }\n' > "apps/$app/tsconfig.json"
done

echo ">> Setting unique dev ports"
set_port () {
  local app="$1" port="$2"
  node -e "const fs=require('fs');const p='apps/$app/package.json';const j=JSON.parse(fs.readFileSync(p,'utf8'));j.scripts=j.scripts||{};j.scripts.dev='next dev -p $port';fs.writeFileSync(p,JSON.stringify(j,null,2));"
}
set_port portal       3000
set_port chapterone   3001
set_port chaptertwo   3002
set_port chapterthree 3003
set_port chapterfour  3004
set_port chapterfive  3005

echo ">> Adding @aimone workspace deps to all apps"
add_ws_deps () {
  local app="$1"
  node -e "const fs=require('fs');const p='apps/$app/package.json';const j=JSON.parse(fs.readFileSync(p,'utf8'));j.dependencies=j.dependencies||{};['@aimone/types','@aimone/chapter-sdk','@aimone/shared-ui','@aimone/prompts'].forEach(d=>j.dependencies[d]='*');fs.writeFileSync(p,JSON.stringify(j,null,2));"
}
for app in "${apps[@]}"; do add_ws_deps "$app"; done

echo ">> Creating minimal smoke-test page in each chapter"
mk_page () {
  local app="$1" title="$2" slug="$3"
  cat > "apps/$app/app/page.tsx" <<TSX
"use client";
import { useState } from "react";
import { PrimaryButton } from "@aimone/shared-ui";
import { startSession } from "@aimone/chapter-sdk";

export default function Page() {
  const [sid, setSid] = useState<string | null>(null);
  const onStart = async () => {
    const res = await startSession("$slug");
    setSid(res.sessionId);
  };
  return (
    <main className="p-6">
      <h1>$title</h1>
      {!sid ? <PrimaryButton onClick={onStart}>Start</PrimaryButton> : <div>Session: {sid}</div>}
    </main>
  );
}
TSX
}
mk_page chapterone   "Chapter One"   "chapterone"
mk_page chaptertwo   "Chapter Two"   "chaptertwo"
mk_page chapterthree "Chapter Three" "chapterthree"
mk_page chapterfour  "Chapter Four"  "chapterfour"
mk_page chapterfive  "Chapter Five"  "chapterfive"

echo ">> Installing deps at repo root"
npm install

echo ">> Building all workspaces"
npm run build

cat <<EOF

✅ Done.

Start dev servers:  npm run dev

Apps:
  portal:        http://localhost:3000
  chapterone:    http://localhost:3001
  chaptertwo:    http://localhost:3002
  chapterthree:  http://localhost:3003
  chapterfour:   http://localhost:3004
  chapterfive:   http://localhost:3005

Note: Next.js 16 requires Node >= 20.9. If you see EBADENGINE warnings:
  nvm install 20.11.1 && nvm use 20.11.1

EOF


