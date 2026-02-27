# AI Education Hub - Project TODO

## Database Schema & Backend
- [x] Design and implement database schema for curated content (articles, reports, frameworks)
- [x] Design and implement database schema for news feed items
- [x] Design and implement database schema for tool library with categories
- [x] Design and implement database schema for content categories/topics
- [x] Create tRPC procedures for fetching curated content
- [x] Create tRPC procedures for fetching news feed
- [x] Create tRPC procedures for fetching tools by category
- [ ] Create tRPC procedures for admin content management (CRUD operations)
- [x] Create tRPC procedures for search functionality
- [ ] Implement news aggregation logic (fetch from external sources)

## Frontend UI - Public Pages
- [x] Design color palette and typography based on PANTONE Cloud Dancer theme
- [x] Implement homepage with hero section showcasing platform mission
- [x] Create curated content section on homepage
- [x] Create real-time news feed section on homepage
- [x] Build comprehensive tool library page with category filters
- [x] Implement topic-based navigation system
- [ ] Create individual content detail pages
- [ ] Create individual tool detail pages
- [x] Implement responsive design for mobile and desktop
- [x] Add search functionality UI component
- [ ] Implement search results page

## Frontend UI - Admin Interface
- [ ] Create admin dashboard layout
- [ ] Build content management interface (add/edit/delete curated content)
- [ ] Build news management interface (add/edit/delete news items)
- [ ] Build tool management interface (add/edit/delete tools)
- [ ] Build category management interface
- [ ] Add rich text editor for content creation
- [ ] Implement image upload functionality for content

## Testing & Deployment
- [ ] Write vitest tests for backend procedures
- [ ] Test all CRUD operations
- [ ] Test search functionality
- [ ] Test responsive design on multiple devices
- [ ] Create deployment checkpoint
- [ ] Provide user guide for content management

## Design & Content Updates (New Requirements)
- [x] Redesign UI to extreme minimalist style (NYT/Pantone inspired)
- [x] Update color palette to black/white/gray with minimal accents
- [x] Change typography to serif headings (NYT style)
- [x] Remove decorative icons and shadows
- [x] Increase whitespace and improve content hierarchy
- [x] Update seed data to focus on top-tier institutions (Stanford, MIT, Harvard, etc.)
- [x] Add Chinese language content sources (Tsinghua, Peking University, etc.)
- [x] Add industry-changing sources (OpenAI, DeepMind, Anthropic)
- [x] Create news aggregation focused on breakthrough research

## Bug Fixes
- [x] Fix nested <a> tag error in Home.tsx (Link components should not contain <a> children)

## New Bug Fixes
- [x] Create /news page to fix 404 error
- [x] Create /resources page to fix 404 error
- [x] Create /tools page to fix 404 error
- [x] Create /search page to fix search functionality
- [x] Update seed data with real news article URLs instead of institution homepages

## RSS Aggregation Feature
- [x] Install RSS parsing library (rss-parser)
- [x] Create RSS feed configuration with top-tier institutions (48 sources)
- [x] Implement RSS fetching and parsing logic
- [x] Implement deduplication logic to avoid duplicate news items
- [x] Create admin page for manual RSS refresh
- [ ] Add automatic daily RSS update task (scheduled)
- [x] Test RSS aggregation with all configured sources (160+ articles fetched successfully)

## Content Refinement (New Requirements)
- [x] Separate news display by language: International (English) and Domestic (Chinese)
- [x] Add language filter tabs on News page
- [x] Review and refine RSS sources to focus strictly on education-related content
- [x] Remove pure technology/business RSS sources that don't relate to education (disabled 15+ non-education sources)
- [x] Add education-focused keyword filtering to RSS service
- [x] Implement content filtering logic in RSS service to only save articles related to education
- [x] Update RSS configuration to prioritize education-specific sources (21 education-first sources)
- [x] Test filtered content to ensure quality and relevance (100+ education-focused articles from eSchool News)
