import test from "node:test";
import assert from "node:assert/strict";
import { isReviewedCaseHref, isReviewedCaseSlug } from "../lib/reviewed-cases.ts";

test("only cases approved in the Reviewed column can be published", () => {
  for (const slug of ["bt", "dp-world", "dyson", "frasers-property-leadership", "frasers-property-hrlt", "gsk", "maaden", "morgan-stanley", "vodafone", "shunkhlai"]) {
    assert.equal(isReviewedCaseSlug(slug), true, slug);
  }
  for (const slug of ["shell-women-leaders", "dubai-holding-leadership-accountability", "heineken-inner-outer-game", "shell", "aviva", "coca-cola", "levis", "unilever"]) {
    assert.equal(isReviewedCaseSlug(slug), false, slug);
  }
});

test("links to unreviewed case pages are hidden", () => {
  assert.equal(isReviewedCaseHref("/cases/gsk"), true);
  assert.equal(isReviewedCaseHref("/cases/shell"), false);
  assert.equal(isReviewedCaseHref("/cases"), false);
});
