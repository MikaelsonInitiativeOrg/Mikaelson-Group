import type {
  CorrespondenceDesk,
  Dispatch,
  Framework,
  Monograph,
  RecordEntry,
  ResearchSeries,
  SchoolClubOverview,
} from "./types";

/*
  Single source of site copy. Facts that have not been confirmed are marked
  `pending` (or listed in PENDING below) and rendered as such — never invent
  registration numbers, names, dates or publications here.
*/

export const ORG = {
  group: "Mikaelson Group",
  initiative: "The Mikaelson Initiative",
  registeredName: "The Incorporated Trustees of Mikaelson Community Development and Tech Initiative",
  registrationNumber: null as string | null, // CAC "IT" number — to be supplied
  seat: "Lagos, Nigeria",
  email: "hello@mikaelsoninitiative.org",
  instituteUrl: "https://institute.mikaelsoninitiative.org",
  clubsUrl: "https://club.mikaelsoninitiative.org",
  initiativeUrl: "https://www.mikaelsoninitiative.org",
} as const;

export const REGISTRATION_LABEL = ORG.registrationNumber ?? "IT — to be published";

export const FRAMEWORKS: Framework[] = [
  {
    slug: "epistemic-agency",
    ref: "MG/FW-01",
    order: 1,
    title: "Epistemic Agency",
    summary: "The capacity to form, test and revise one’s own beliefs, and to know how one knows.",
    definition:
      "Epistemic agency is a person’s standing as the author of their own understanding: the ability to weigh evidence, to locate a claim’s source and interest, and to hold a belief for reasons they can state and would revise.",
    governingQuestion: "Who decides what is true for you, and by what method?",
    unitOfAnalysis: "The individual mind",
    components: [
      {
        name: "Source discernment",
        description:
          "Identifying where a claim comes from, who benefits from its being believed, and what it would take to check it.",
      },
      {
        name: "Reasoned dissent",
        description:
          "Disagreeing with authority, consensus or tradition on stated grounds, in a form others can examine.",
      },
      {
        name: "Revision under evidence",
        description:
          "Changing one’s mind when the evidence changes, and being able to say what would cause it to change.",
      },
      {
        name: "Intellectual self-trust",
        description:
          "Enough confidence in one’s own reasoning to use it in public, without mistaking confidence for proof.",
      },
    ],
    notToBeConfusedWith:
      "Contrarianism or the rejection of expertise. An agent may defer to an expert; what matters is that the deference is chosen and can be justified.",
  },
  {
    slug: "intellectual-infrastructure",
    ref: "MG/FW-02",
    order: 2,
    title: "Intellectual Infrastructure",
    summary: "The archives, vocabularies, venues and habits that let a community think across generations.",
    definition:
      "Intellectual infrastructure is the set of institutions and shared resources through which a community records what it knows, argues about it, and passes it on, so that thought accumulates instead of restarting with each generation.",
    governingQuestion: "What must exist for ideas to outlive the people who had them?",
    unitOfAnalysis: "The community and its institutions",
    components: [
      {
        name: "Archives and records",
        description:
          "Durable, accessible memory: the documents, oral histories and data a community can return to and contest.",
      },
      {
        name: "Shared vocabularies",
        description:
          "Concepts precise enough to argue with, including concepts drawn from a community’s own languages and traditions.",
      },
      {
        name: "Venues of argument",
        description:
          "Journals, seminars, clubs and public forums where claims are put forward, criticised and refined.",
      },
      {
        name: "Transmission",
        description:
          "Teaching, mentorship and editorial practice that carry methods, not only conclusions, to the next cohort of thinkers.",
      },
    ],
    notToBeConfusedWith:
      "Physical or digital infrastructure alone. Buildings and bandwidth are necessary; they are not sufficient without the practices that give them use.",
  },
  {
    slug: "applied-human-capability",
    ref: "MG/FW-03",
    order: 3,
    title: "Applied Human Capability",
    summary: "The conversion of understanding into reliable competence under real conditions.",
    definition:
      "Applied human capability is what a person can actually do, repeatedly and well, in the settings where it matters: knowledge that has been turned by practice and habit into dependable performance and sound judgement.",
    governingQuestion: "Can it be done, again and again, where it counts?",
    unitOfAnalysis: "The practitioner in context",
    components: [
      {
        name: "Deliberate practice",
        description:
          "Structured repetition aimed at the edge of present ability, with a clear standard of what better looks like.",
      },
      {
        name: "Feedback",
        description:
          "Honest, timely information about results, from people and from the work itself, used to correct course.",
      },
      {
        name: "Habit and discipline",
        description:
          "The routines that make good performance the default rather than the exception.",
      },
      {
        name: "Judgement in context",
        description:
          "Knowing which rule applies, when none does, and how to act well when the situation is new.",
      },
    ],
    notToBeConfusedWith:
      "Credentials. A certificate records that something was studied; capability is shown in what is reliably done.",
  },
  {
    slug: "generative-capacity",
    ref: "MG/FW-04",
    order: 4,
    title: "Generative Capacity",
    summary: "The ability of people and institutions to originate, not only to adopt.",
    definition:
      "Generative capacity is the ability of a person, institution or society to bring into being knowledge, forms and organisations that did not exist before, grounded in what it has inherited and answerable to its own needs.",
    governingQuestion: "What can this society make that did not exist before?",
    unitOfAnalysis: "The society across a generation",
    components: [
      {
        name: "Grounded originality",
        description:
          "New work that knows its inheritance: building from a tradition rather than in ignorance of one.",
      },
      {
        name: "Synthesis",
        description:
          "Combining ideas from different fields, languages and histories into something usable and new.",
      },
      {
        name: "Institution-building",
        description:
          "Turning a good idea into an organisation, a method or a body of work that can run without its founder.",
      },
      {
        name: "Stewardship",
        description:
          "Maintaining, correcting and handing on what has been made, so that each generation starts further along.",
      },
    ],
    notToBeConfusedWith:
      "Novelty for its own sake, or the import of solutions designed elsewhere. Generation answers local questions with work that can stand anywhere.",
  },
];

export const RESEARCH_SERIES: ResearchSeries[] = [
  {
    ref: "MI/RS-01",
    title: "Pre-colonial African history",
    description:
      "The states, cities, trade, law, science and thought of African societies before sustained European colonial rule, studied on their own terms and from their own sources.",
  },
];

export const RESEARCH_SCOPE: RecordEntry[] = [
  { label: "Focus", value: "Pre-colonial African history" },
  { label: "Period", value: "From the earliest societies to the eve of sustained European colonial rule" },
  { label: "Geography", value: "The African continent" },
  { label: "Carried out by", value: "Mikaelson Institute for African Studies" },
];

/** No monographs have been published yet. Add entries here as they are. */
export const MONOGRAPHS: Monograph[] = [];

/** No dispatches have been issued yet. Add entries here as they are. */
export const DISPATCHES: Dispatch[] = [];

export const SCHOOL_CLUBS: SchoolClubOverview = {
  name: "Mikaelson School Clubs",
  constituency: "Secondary-school students",
  format: "Student-led clubs that meet inside their own schools",
  focus: [
    "Habits and personal discipline",
    "Reading, reasoning and debate",
    "Leadership through running the club itself",
    "Projects that serve the school and its community",
  ],
  frameworks: ["epistemic-agency", "applied-human-capability"],
  href: ORG.clubsUrl,
};

export const LEGAL_RECORD: RecordEntry[] = [
  { label: "Public name", value: ORG.initiative },
  { label: "Registered name", value: ORG.registeredName },
  { label: "Legal form", value: "Incorporated Trustees (non-profit, no share capital)" },
  { label: "Governing statute", value: "Companies and Allied Matters Act 2020, Part F" },
  { label: "Registry", value: "Corporate Affairs Commission, Federal Republic of Nigeria" },
  { label: "Registration no.", value: REGISTRATION_LABEL, pending: ORG.registrationNumber === null },
  { label: "Seat", value: ORG.seat },
];

export const GOVERNANCE = [
  {
    title: "Board of Trustees",
    body: "The trustees hold the Initiative’s property and act on its behalf. They are collectively responsible for its conduct and for its compliance with its constitution and the law.",
  },
  {
    title: "Constitution and objects",
    body: "The Initiative’s constitution sets out its charitable objects. Its income and property are applied only to those objects; nothing is paid as profit or dividend to trustees or members.",
  },
  {
    title: "Filing and accountability",
    body: "As an Incorporated Trustees body, the Initiative files periodic returns and statements of affairs with the Corporate Affairs Commission.",
  },
  {
    title: "Relationship to Mikaelson Group",
    body: "Mikaelson Group is the parent brand. The Initiative is a separate legal person; its assets and decisions belong to its trustees and serve its own objects.",
  },
];

export const DESKS: CorrespondenceDesk[] = [
  {
    ref: "MG/CD-01",
    title: "Institutional correspondence",
    forWhom: "Governments, foundations, universities and other institutions",
    handles: ["Institutional partnerships", "Formal introductions", "Requests for briefings"],
    email: ORG.email,
    subjectPrefix: "Institutional",
    engine: "both",
  },
  {
    ref: "MG/CD-02",
    title: "Academic and research enquiries",
    forWhom: "Scholars, archivists, librarians and graduate researchers",
    handles: ["The research archive and its series", "Scholarly collaboration", "Citation and permissions"],
    email: ORG.email,
    subjectPrefix: "Research",
    engine: "initiative",
  },
  {
    ref: "MG/CD-03",
    title: "Frameworks and editorial",
    forWhom: "Readers, editors and practitioners working with the frameworks",
    handles: ["Questions on the four frameworks", "Monographs and dispatches", "Reproduction requests"],
    email: ORG.email,
    subjectPrefix: "Editorial",
    engine: "group",
  },
  {
    ref: "MG/CD-04",
    title: "School clubs",
    forWhom: "School leaders, teachers and education authorities",
    handles: ["How the clubs operate", "Clubs already running in a school", "Safeguarding questions"],
    email: ORG.email,
    subjectPrefix: "School Clubs",
    engine: "initiative",
  },
  {
    ref: "MG/CD-05",
    title: "Governance and legal",
    forWhom: "Regulators, auditors and anyone verifying the Initiative’s standing",
    handles: ["Registration and filings", "Trustee matters", "Formal notices"],
    email: ORG.email,
    subjectPrefix: "Governance",
    engine: "initiative",
  },
  {
    ref: "MG/CD-06",
    title: "Press",
    forWhom: "Journalists and broadcasters",
    handles: ["Interview requests", "Statements", "Background on the institution"],
    email: ORG.email,
    subjectPrefix: "Press",
    engine: "both",
  },
];

export function mailto(desk: CorrespondenceDesk) {
  return `mailto:${desk.email}?subject=${encodeURIComponent(`[${desk.subjectPrefix}] `)}`;
}

export const NAV = [
  { href: "/frameworks", label: "Frameworks" },
  { href: "/initiative", label: "The Initiative" },
  { href: "/initiative#archive", label: "Research" },
  { href: "/contact", label: "Correspondence" },
] as const;
