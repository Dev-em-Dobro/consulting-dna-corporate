import type { EditorSection } from './page-copy/fields.ts';
import { fieldsForCopy } from './page-copy/structured.ts';

export const DEFAULT_APPROACH_COPY = {
  "metadata": {
    "title": "The 5H® Framework | CorporateDNA",
    "description": "The 5H® Methodology is the neuroscience-led formula behind CorporateDNA's results across 36 countries: Head, Heart, Hunch, Hands and Habits."
  },
  "hero": {
    "eyebrow": "Our approach",
    "title": "Lead with 5H®",
    "subtitle": "The neuroscience-led formula behind our results across 36 countries."
  },
  "introduction": {
    "heading": "Developing the whole self in leadership",
    "paragraphs": [
      "The 5H® gives you more than a single point measurement. It reveals all of a leader's faculties and how those interact and work together under real pressure.",
      "There are five clear lenses through which we approach developing the whole self in leadership: Head, Heart, Hunch, Hands and Habits.",
      "5H® was born from the belief that traditional executive programmes often develop partial leaders, sustainable only in the short term.",
      "Our purpose is to develop whole leaders, where thinking, feeling, sensing, doing and practising are engaged and integrated."
    ]
  },
  "games": {
    "heading": "Two games. Every leader is playing both.",
    "inner": {
      "heading": "Inner Game",
      "body": "Who we are and how we show up. What happens inside a leader's mind and emotions.",
      "labels": [
        "Head",
        "Heart",
        "Hunch"
      ]
    },
    "outer": {
      "heading": "Outer Game",
      "body": "How that inner state becomes behaviour, decisions and impact.",
      "labels": [
        "Hands",
        "Habits"
      ]
    },
    "assessmentLabels": [
      "Self-assessment",
      "360 assessment",
      "Situational assessment"
    ]
  },
  "fiveH": {
    "heading": "Five intelligences. One whole leader.",
    "faculties": [
      {
        "name": "Head",
        "intelligence": "Cognitive intelligence",
        "description": "The clarity to think critically, reason strategically and make sense of complexity.",
        "dimensions": [
          "Critical Thinking",
          "Risk Appetite",
          "Growth Mindset",
          "Scenario Planning",
          "Navigating Complexity"
        ]
      },
      {
        "name": "Hands",
        "intelligence": "Execution intelligence",
        "description": "The drive to take action, own outcomes and deliver real results.",
        "dimensions": [
          "Resourcefulness",
          "Role Modelling",
          "Accountability",
          "Stakeholder Centricity",
          "Action Oriented"
        ]
      },
      {
        "name": "Habits",
        "intelligence": "Behavioural intelligence",
        "description": "The discipline to show up consistently, lead by example and build lasting trust.",
        "dimensions": [
          "Listening & Questioning",
          "Leading with Why",
          "Consistency",
          "Ownership",
          "Transparency"
        ]
      },
      {
        "name": "Hunch",
        "intelligence": "Intuitive intelligence",
        "description": "The instinct to sense patterns, stay curious and make timely, wise decisions.",
        "dimensions": [
          "Judgement & Discernment",
          "Curiosity",
          "Sensing & Sensemaking",
          "Insightfulness",
          "Accelerated Decisioning"
        ]
      },
      {
        "name": "Heart",
        "intelligence": "Emotional intelligence",
        "description": "The courage to lead with empathy, authenticity and emotional connection.",
        "dimensions": [
          "Courage & Resilience",
          "Empathy",
          "Authentic Energy",
          "Interpersonal Savvy",
          "Connection & Collaboration"
        ]
      }
    ],
    "note": "(Most leadership development stops at the Head)"
  },
  "framework": {
    "heading": "What happens underneath drives the outcome.",
    "body": "Five connected forms of intelligence, centred on the values, beliefs and drivers that shape how a leader shows up.",
    "copyright": "The 5H© Framework. © 2026 Corporate DNA Consulting. All rights reserved."
  },
  "profiler": {
    "label": "The DNA 360 Profiler",
    "heading": "The 5H, as an assessment.",
    "paragraphs": [
      "The 5H was the catalyst for building the DNA 360™ Profiler with Dr Nigel Guenole, our Head of Assessments, and his team of PhD researchers.",
      "A situational psychometric assessment using over 125 organisational scenarios, measuring a leader's ability to flex between inner and outer game behaviours according to the situation in front of them."
    ],
    "facts": [
      {
        "value": "125+",
        "label": "organisational scenarios\nin one assessment"
      },
      {
        "value": "PhD led",
        "label": "Built in house with\nDr Nigel Guenole, Head of Assessments"
      }
    ]
  },
  "learning": {
    "label": "From intent to action",
    "heading": "Making the learning",
    "accent": "real.",
    "body": "Body copy to be confirmed (max 500 characters)."
  },
  "faq": {
    "label": "Frequently asked questions",
    "items": [
      {
        "question": "How is the 5H different from other leadership models?",
        "answer": "The 5H develops five connected forms of intelligence together, helping leaders translate inner awareness into visible behaviour and repeatable habits."
      },
      {
        "question": "What does the 5H look like in a room?",
        "answer": "Leaders work with live business situations, practise new responses, receive feedback and connect insight directly to the decisions in front of them."
      },
      {
        "question": "How do you measure whether it worked?",
        "answer": "The DNA 360 Profiler and supporting diagnostics create a measurable view of leadership impact, development priorities and behaviour change over time."
      }
    ]
  },
  "cta": {
    "heading": "Ready to lead with 5H®?",
    "buttonLabel": "Start a conversation"
  }
};

export type ApproachCopy = typeof DEFAULT_APPROACH_COPY;

export const EDITOR_SECTIONS: EditorSection[] = [
  {
    "id": "metadata",
    "title": "Search and browser title",
    "anchor": "/approach"
  },
  {
    "id": "hero",
    "title": "Hero",
    "anchor": "/approach"
  },
  {
    "id": "introduction",
    "title": "Whole leadership introduction",
    "anchor": "/approach#whole-leader"
  },
  {
    "id": "games",
    "title": "Inner and outer game",
    "anchor": "/approach#two-games"
  },
  {
    "id": "fiveH",
    "title": "Five intelligences",
    "anchor": "/approach#the-five-h"
  },
  {
    "id": "framework",
    "title": "The 5H framework",
    "anchor": "/approach#framework"
  },
  {
    "id": "profiler",
    "title": "DNA 360 Profiler",
    "anchor": "/approach#dna-360-profiler"
  },
  {
    "id": "learning",
    "title": "Making the learning real",
    "anchor": "/approach#learning"
  },
  {
    "id": "faq",
    "title": "Frequently asked questions",
    "anchor": "/approach#learning"
  },
  {
    "id": "cta",
    "title": "Closing invitation",
    "anchor": "/approach#approach-cta"
  }
].map((section) => ({
  id: section.id, title: section.title, anchor: section.anchor,
  fields: fieldsForCopy(DEFAULT_APPROACH_COPY[section.id as keyof ApproachCopy], section.id),
}));
