import { test } from "node:test";
import assert from "node:assert/strict";
import { inquirySchema, productSchema } from "../lib/validation.ts";
const valid = {
  name: "Test User",
  email: "test@example.com",
  company: "Test",
  message: "Request a product sample",
  consent: true,
  token: "valid-token",
  website: "",
};
test("accept valid inquiry", () =>
  assert.equal(inquirySchema.safeParse(valid).success, true));
for (const [key, value] of Object.entries({
  email: "bad",
  consent: false,
  token: "",
  website: "spam",
  message: "x",
  name: "x",
}))
  test(`reject invalid ${key}`, () =>
    assert.equal(
      inquirySchema.safeParse({ ...valid, [key]: value }).success,
      false,
    ));
test("reject oversized message", () =>
  assert.equal(
    inquirySchema.safeParse({ ...valid, message: "x".repeat(4001) }).success,
    false,
  ));
test("valid product and draft", () =>
  assert.equal(
    productSchema.safeParse({
      name: "Mica",
      series: "Natural",
      description: "Description of mineral",
      published: false,
    }).success,
    true,
  ));
test("reject invalid publication flag", () =>
  assert.equal(
    productSchema.safeParse({
      name: "Mica",
      series: "Natural",
      description: "Description of mineral",
      published: "true",
    }).success,
    false,
  ));
