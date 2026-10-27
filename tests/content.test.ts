import { test } from "node:test";
import assert from "node:assert/strict";
import { contentSchema } from "../lib/content-schema.ts";
const valid = {
  page: "index",
  title: "Judul Baru",
  description: "Deskripsi",
  publish: false,
};
test("valid draft accepted", () =>
  assert.equal(contentSchema.safeParse(valid).success, true));
test("valid publish accepted", () =>
  assert.equal(
    contentSchema.safeParse({ ...valid, publish: true }).success,
    true,
  ));
test("unknown page rejected", () =>
  assert.equal(
    contentSchema.safeParse({ ...valid, page: "../../admin" }).success,
    false,
  ));
test("empty heading rejected", () =>
  assert.equal(
    contentSchema.safeParse({ ...valid, title: "  " }).success,
    false,
  ));
test("oversized description rejected", () =>
  assert.equal(
    contentSchema.safeParse({ ...valid, description: "a".repeat(2001) })
      .success,
    false,
  ));
test("publish requires boolean", () =>
  assert.equal(
    contentSchema.safeParse({ ...valid, publish: "true" }).success,
    false,
  ));
