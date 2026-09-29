import test from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_APPROACH_COPY, EDITOR_SECTIONS as APPROACH_SECTIONS } from "../lib/approach-copy.ts";
import { ApproachCopySchema, mergeApproachCopy } from "../lib/approach-copy-schema.ts";
import { DEFAULT_IMPACT_COPY, EDITOR_SECTIONS as IMPACT_SECTIONS } from "../lib/impact-copy.ts";
import { ImpactCopySchema, mergeImpactCopy } from "../lib/impact-copy-schema.ts";
import { DEFAULT_INSIGHTS_COPY, EDITOR_SECTIONS as INSIGHTS_SECTIONS, INSIGHTS_RESOURCE_FILES } from "../lib/insights-copy.ts";
import { InsightsCopySchema, mergeInsightsCopy } from "../lib/insights-copy-schema.ts";
import { getAtPath, setAtPath } from "../lib/page-copy/fields.ts";
import { services } from "../lib/services.ts";
import { applyServiceCopy, DEFAULT_SERVICE_PAGES_COPY, sectionsFor } from "../lib/service-pages-copy.ts";
import { mergeServicePagesCopy, serviceCopySchemaFor } from "../lib/service-pages-copy-schema.ts";

test("new editors have valid defaults, unique fields and working anchors", () => {
  for (const [defaults, schema, sections] of [
    [DEFAULT_APPROACH_COPY, ApproachCopySchema, APPROACH_SECTIONS],
    [DEFAULT_IMPACT_COPY, ImpactCopySchema, IMPACT_SECTIONS],
    [DEFAULT_INSIGHTS_COPY, InsightsCopySchema, INSIGHTS_SECTIONS],
  ] as const) {
    assert.ok(schema.safeParse(defaults).success);
    const paths = sections.flatMap((section) => section.fields.map((field) => field.path));
    assert.equal(new Set(paths).size, paths.length);
    for (const section of sections) {
      assert.ok(section.anchor.startsWith("/"));
      for (const field of section.fields) {
        const value = getAtPath(defaults, field.path);
        assert.ok(value !== undefined, field.path);
        assert.equal(Array.isArray(value), field.kind === "lines" || field.kind === "paragraphs", field.path);
      }
    }
  }
});

test("approach edits reach the carousel and FAQs without replacing the other cards", () => {
  const edited = setAtPath(DEFAULT_APPROACH_COPY, "fiveH.faculties.0.description", "Edited Head description");
  const withFaq = setAtPath(edited, "faq.items.0.answer", "Edited answer");
  const merged = mergeApproachCopy(withFaq);
  assert.equal(merged.fiveH.faculties[0].description, "Edited Head description");
  assert.equal(merged.faq.items[0].answer, "Edited answer");
  assert.deepEqual(merged.fiveH.faculties[1], DEFAULT_APPROACH_COPY.fiveH.faculties[1]);
  const empty = setAtPath(merged, "faq.items.0.answer", "");
  assert.equal(mergeApproachCopy(empty).faq.items[0].answer, DEFAULT_APPROACH_COPY.faq.items[0].answer);
});

test("fixed card positions reject missing faculties and resources", () => {
  assert.equal(ApproachCopySchema.safeParse({ ...DEFAULT_APPROACH_COPY, fiveH: { ...DEFAULT_APPROACH_COPY.fiveH, faculties: [] } }).success, false);
  assert.equal(InsightsCopySchema.safeParse({ ...DEFAULT_INSIGHTS_COPY, thoughtLeadership: { ...DEFAULT_INSIGHTS_COPY.thoughtLeadership, resources: [] } }).success, false);
});

test("impact and insights have independent copy and retain PDF destinations", () => {
  assert.equal(mergeImpactCopy({ hero: { title: "New impact" } }).hero.title, "New impact");
  assert.equal(mergeInsightsCopy({ hero: { title: "New insights" } }).hero.title, "New insights");
  assert.equal(DEFAULT_IMPACT_COPY.hero.title, "People. Planet. Lasting Impact.");
  assert.equal(INSIGHTS_RESOURCE_FILES.length, DEFAULT_INSIGHTS_COPY.thoughtLeadership.resources.length);
  assert.ok(INSIGHTS_RESOURCE_FILES.every((file) => file.endsWith(".pdf")));
});

test("each service exposes only its own layout and preserves images and icons", () => {
  for (const service of services) {
    const schema = serviceCopySchemaFor(service.slug)!;
    const copy = schema.parse(DEFAULT_SERVICE_PAGES_COPY.bySlug[service.slug]);
    const fields = sectionsFor(service.slug).flatMap((section) => section.fields);
    assert.ok(fields.every((field) => field.path.startsWith(`bySlug.${service.slug}.`)));
    assert.ok(fields.every((field) => !/\.(image|icon|src|caseSlug|diagram)$/.test(field.path)));
    const applied = applyServiceCopy(service, copy);
    assert.equal(applied.heroImage, service.heroImage);
    assert.deepEqual(applied.formats?.map((format) => format.image), service.formats?.map((format) => format.image));
    assert.deepEqual(applied.steps?.map((step) => step.icon), service.steps?.map((step) => step.icon));
  }
});

test("layout edits apply to the relevant service without changing another service", () => {
  const slug = "culture-transformation";
  const edited = setAtPath(DEFAULT_SERVICE_PAGES_COPY, `bySlug.${slug}.layout.ecosystem.headline`, "New ecosystem headline");
  const merged = mergeServicePagesCopy(edited);
  const service = services.find((item) => item.slug === slug)!;
  assert.equal(applyServiceCopy(service, merged.bySlug[slug]).ecosystem?.headline, "New ecosystem headline");
  assert.deepEqual(merged.bySlug["executive-coaching"], DEFAULT_SERVICE_PAGES_COPY.bySlug["executive-coaching"]);
  assert.ok(!sectionsFor(slug).some((section) => ["how-we-work", "pillars"].includes(section.id)));
  const family = sectionsFor("family-business-consulting");
  assert.ok(family.some((section) => section.id === "layout-twoSystems"));
  assert.ok(!family.some((section) => section.id === "layout-ecosystem"));
});
