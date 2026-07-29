/**
 * Praise for the book — recovered from the legacy /book-endorsements page
 * (Wayback snapshot 2015-08-16), which now redirects to the home `#book`
 * section. Quotes are reproduced verbatim from that page, including the
 * original "crucible earning moments" wording.
 *
 * Rendered inside the dark book card so it reads as part of that block rather
 * than as a section of its own — hence the on-ink colour treatment.
 */

type Endorsement = {
  quote: string;
  name: string;
  title: string;
};

const endorsements: Endorsement[] = [
  {
    quote:
      "There is a true leader in all of us and Rhea Duttagupta insightfully reminds us that our own unique qualities combined with crucible earning moments and some humility can unlock the inner compass for a meaningful and rewarding life.",
    name: "Paul Polman",
    title: "Group CEO, Unilever",
  },
  {
    quote:
      "Whoever we are each one of us faces a moment which calls on us to lead. This book prepares us for those moments.",
    name: "Dr Han Seung-soo",
    title: "35th Prime Minister of South Korea, UN Special Envoy for Climate Change",
  },
  {
    quote:
      "Origins and roots are important. If you can't remember and respect where you have come from, it's hard to drive where you are going.",
    name: "Stuart Gulliver",
    title: "Group CEO, HSBC",
  },
  {
    quote:
      "Attitude, Belief, Creativity and Instincts, being ingredients we are born with, create closer human connections releasing the natural leadership in us all.",
    name: "Angela Ahrendts",
    title: "CEO, Burberry",
  },
];

export default function BookEndorsements() {
  return (
    <div className="mt-10 border-t border-white/15 px-6 pb-10 pt-10 md:mt-12 md:px-0 md:pb-0 md:pt-12">
      <ul className="grid grid-cols-1 gap-x-14 gap-y-9 md:grid-cols-2">
        {endorsements.map((e) => (
          <li key={e.name}>
            <blockquote>
              <p className="text-[15.5px] leading-[1.6] text-white/75">
                &ldquo;{e.quote}&rdquo;
              </p>
            </blockquote>
            <footer className="mt-3.5 flex items-baseline gap-2.5">
              <span aria-hidden="true" className="mt-2 h-0.5 w-5 flex-none bg-brand" />
              <div>
                <cite className="block text-[14px] font-bold not-italic tracking-[-0.1px] text-white">
                  {e.name}
                </cite>
                <span className="mt-0.5 block text-[12.5px] leading-[1.45] text-white/50">
                  {e.title}
                </span>
              </div>
            </footer>
          </li>
        ))}
      </ul>
    </div>
  );
}
