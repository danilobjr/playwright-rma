/**
 * Commitlint Configuration
 *
 * Validates commit messages to ensure they follow the project's emoji + conventional commit format.
 * Emoji is REQUIRED at the start of every commit.
 */

import customPlugin from './commitlint-plugin.cjs'

export default {
  // Don't extend gitmoji - use custom emoji validation
  extends: [],

  // Load custom plugin for better error messages
  plugins: [
    {
      rules: customPlugin.rules,
    },
  ],

  parserPreset: {
    parserOpts: {
      // Custom header pattern - EMOJI IS REQUIRED, scope is optional, subject is required:
      // ✨ feat(scope): description  ✓
      // ✨ feat: description         ✓
      // The emoji must be at the start
      headerPattern:
        /^(✨|🐞|🔧|🚧|📝|💄|🧪|🚀|📦)\s+(\w+)(?:\(([^)]+)\))?(!)?: (.+)$/,
      headerCorrespondence: ['emoji', 'type', 'scope', 'breaking', 'subject'],
    },
  },

  rules: {
    // Custom rule: Emoji is required
    'emoji-required': [2, 'always'],

    // Override default rules to be more permissive with emoji
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'refactor',
        'chore',
        'docs',
        'style',
        'test',
        'perf',
        'build',
      ],
    ],

    // Subject should not be empty (description is required)
    'subject-empty': [2, 'never'],

    // Subject minimum length (at least 10 characters for meaningful description)
    'subject-min-length': [2, 'always', 10],

    // Subject maximum length (keep it concise, max 72 characters)
    'subject-max-length': [2, 'always', 72],

    // Subject should not end with period
    'subject-full-stop': [2, 'never', '.'],

    // Subject should be lowercase (disabled because of proper nouns)
    'subject-case': [0],

    // Header max length (including emoji, type, scope)
    'header-max-length': [2, 'always', 100],

    // Body max line length
    'body-max-line-length': [2, 'always', 100],

    // Scope is optional - disabled validation
    'scope-empty': [0],
    'scope-case': [0],

    // Type should be lowercase
    'type-case': [2, 'always', 'lower-case'],
  },

  // Custom prompt configurations for commitizen
  prompt: {
    questions: {
      type: {
        description: "Select the type of change you're committing",
        enum: {
          feat: {
            emoji: '✨',
            title: 'Feature',
            description: 'A new feature',
          },
          fix: {
            emoji: '🐞',
            title: 'Bug fix',
            description: 'A bug fix',
          },
          refactor: {
            emoji: '🔧',
            title: 'Code Refactoring',
            description:
              'A code change that neither fixes a bug nor adds a feature',
          },
          chore: {
            emoji: '🚧',
            title: 'Chores',
            description:
              'Little tasks inside a major context, including design.',
          },
          docs: {
            emoji: '📝',
            title: 'Documentation',
            description: 'Documentation only changes',
          },
          style: {
            emoji: '💄',
            title: 'Code style (not CSS)',
            description:
              'Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)',
          },
          test: {
            emoji: '🧪',
            title: 'Tests',
            description: 'Adding missing tests or correcting existing tests',
          },
          perf: {
            emoji: '🚀',
            title: 'Performance improvements',
            description: 'A code change that improves performance',
          },
          build: {
            emoji: '📦',
            title: 'Build system',
            description:
              'Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)',
          },
        },
      },
      scope: {
        description: 'What is the scope of this change (e.g. component name)',
      },
      subject: {
        description:
          'Write a short, imperative tense description of the change',
      },
      body: {
        description: 'Provide a longer description of the change (optional)',
      },
      isIssueAffected: {
        description: 'Does this change affect any open issues?',
      },
      // issuesBody: {
      //   description:
      //     'If issues are closed, the commit requires a body. Please enter a longer description of the commit itself',
      // },
      issues: {
        description: 'Add issue references (e.g. "fix #123", "re #456")',
      },
    },
  },
}
