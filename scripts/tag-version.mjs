import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8")
);
const v = pkg.version;

if (!/^\d+\.\d+\.\d+(-.+)?$/.test(v)) {
  console.error(`package.json version "${v}" is not semver`);
  process.exit(1);
}

console.log(`Tagging v${v}`);
execSync(`git tag v${v}`, { stdio: "inherit" });
execSync(`git push origin v${v}`, { stdio: "inherit" });
