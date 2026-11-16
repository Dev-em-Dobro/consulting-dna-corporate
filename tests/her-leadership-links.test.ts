import test from "node:test";
import assert from "node:assert/strict";
import { events, herLeadershipInfoLink, herLeadershipLinks, herLeadershipProspectusHref } from "../lib/events.ts";

const apply = { label: "Apply for the inaugural cohort", href: "https://www.surveymonkey.com/r/DM3FXP5" };
const prospectus = { label: "Programme prospectus", href: "https://docs.google.com/presentation/d/example/edit" };

test("Her Leadership DNA coloca o pedido de informação antes de Apply e Prospectus", () => {
  const links = herLeadershipLinks([apply, prospectus]);
  assert.deepEqual(links, [
    herLeadershipInfoLink,
    apply,
    { label: "Programme prospectus", href: herLeadershipProspectusHref },
  ]);
});

test("o fallback estático deste evento usa a mesma ordem e não altera os outros", () => {
  const event = events.find((item) => item.slug === "her-leadership-dna-2027");
  assert.deepEqual(event?.links, herLeadershipLinks([apply, { ...prospectus, href: herLeadershipProspectusHref }]));
  assert.equal(
    events.filter((item) => item.links?.some((link) => link.href === herLeadershipInfoLink.href)).length,
    1,
  );
});
