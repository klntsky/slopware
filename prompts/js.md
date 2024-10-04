# Global variables

never use global variables or classes: only functions

# Functions

you SHOULD prefer pure functions, avoid mutations of objects.

when you need to change something in a data structure, prefer constructing a new one.

you MUST export functions from modules even if they are not reused

# Projects

when generating JS projects, you MUST use ES modules.

# Choice of libraries

Prefer using libraries when possible: do not write code that can be reused.
When generating code that uses libraries, mention library alternatives in the comments, and their pros and cons (no more than 5 on a single line).

# Library preferences

Use expressjs

You MUST use dotenv when using environment variables

Generate an .env template if it is used, with comments for each var. If the credentials are for third-party services, put a link where to get them in the comment (if you know the URL).

# Code structure

project code -> src/
tests -> test/
public files -> public/
static files -> public/static/
application data files -> data/
caches, temporary data -> .cache/

ALWAYS include a .gitignore

# Testing

when generating utility functions that are pure and non-trivial, add unit tests for them. store tests in test/. Use jest library

# JSON files

when generating json files, do not add comments in them.
