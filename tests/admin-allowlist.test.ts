import { test } from "node:test";
import assert from "node:assert/strict";
import { allowedAdmin } from "../lib/admin-allowlist.ts";
test("allows any confirmed listed administrator", () =>
  assert.equal(
    allowedAdmin(
      "Second@Example.com",
      true,
      "first@example.com, second@example.com",
      "legacy@example.com",
    ),
    true,
  ));
test("normalizes whitespace and case", () =>
  assert.equal(
    allowedAdmin("ADMIN@example.com", true, " admin@EXAMPLE.com ", undefined),
    true,
  ));
test("supports legacy single admin", () =>
  assert.equal(
    allowedAdmin("legacy@example.com", true, undefined, "legacy@example.com"),
    true,
  ));
test("unconfirmed users denied", () =>
  assert.equal(
    allowedAdmin("admin@example.com", false, "admin@example.com", undefined),
    false,
  ));
test("unlisted users denied", () =>
  assert.equal(
    allowedAdmin("other@example.com", true, "admin@example.com", undefined),
    false,
  ));
test("missing configuration denies access", () =>
  assert.equal(
    allowedAdmin("admin@example.com", true, undefined, undefined),
    false,
  ));
