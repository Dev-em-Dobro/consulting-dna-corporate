import test from "node:test";
import assert from "node:assert/strict";
import { isSiteEditingEnabled, isSiteEditingRoute } from "../lib/edit-access.ts";

test("editor pages and every page-copy API are classified as private", () => {
  for (const path of [
    "/edit", "/edit-home", "/edit-about", "/edit-team", "/edit-services",
    "/edit-services/culture-transformation", "/edit-clients", "/edit-impact",
    "/edit-approach", "/edit-insights", "/edit-events",
    "/api/home-copy", "/api/about-copy", "/api/team-copy",
    "/api/services-index-copy", "/api/service-pages-copy",
    "/api/service-pages-copy/culture-transformation", "/api/clients-copy",
    "/api/impact-copy", "/api/approach-copy", "/api/insights-copy",
    "/api/events-copy",
  ]) {
    assert.equal(isSiteEditingRoute(path), true, path);
  }
});

test("public pages and the signed CMS webhook stay available", () => {
  for (const path of ["/", "/services", "/our-impact", "/insights", "/api/revalidate"]) {
    assert.equal(isSiteEditingRoute(path), false, path);
  }
});

test("editing is disabled unless the server flag is exactly true", () => {
  const previous = process.env.SITE_EDITING_ENABLED;
  try {
    delete process.env.SITE_EDITING_ENABLED;
    assert.equal(isSiteEditingEnabled(), false);
    process.env.SITE_EDITING_ENABLED = "false";
    assert.equal(isSiteEditingEnabled(), false);
    process.env.SITE_EDITING_ENABLED = "true";
    assert.equal(isSiteEditingEnabled(), true);
  } finally {
    if (previous === undefined) delete process.env.SITE_EDITING_ENABLED;
    else process.env.SITE_EDITING_ENABLED = previous;
  }
});
