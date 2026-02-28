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

## Research Papers Integration (New Requirements)
- [x] Re-enable research institution RSS sources without education filtering (Berkeley, DeepMind, Microsoft Research)
- [x] Add arXiv RSS feeds for AI, ML, HCI, Robotics papers (4 feeds added)
- [x] Create separate "Research Papers" database table with paper metadata (authors, institution, abstract, PDF link)
- [x] Build Research Papers page separate from News page
- [x] Add paper filtering by institution, topic, and date
- [x] Implement dual-track content strategy: Education News + Research Papers
- [x] Update navigation to include Research Papers section
- [x] Test research paper aggregation from all sources (200+ papers from arXiv successfully loaded)

## Chinese RSS Sources Fix (Urgent)
- [ ] Fix Chinese university RSS URLs (Tsinghua, Peking, Fudan, SJTU returning 404)
- [ ] Find alternative Chinese education news sources
- [ ] Test Chinese RSS aggregation to ensure Domestic tab shows content
- [ ] Verify Chinese keyword filtering is working correctly

## Research Papers Refinement
- [x] Remove Chinese language support from research papers (English only)
- [x] Add US News Education top 30 university RSS feeds (11 universities added)
- [x] Limit university sources to US News Education top 30 institutions
- [x] Test research paper aggregation with new sources (200+ arXiv papers successfully loaded)
- [x] Update Research Papers page to remove language filter (English only)

## Bug Fixes - Resource Detail Page
- [x] Create /resource/:slug dynamic route for individual resource detail pages
- [x] Add ResourceDetail.tsx page component
- [x] Add Research link to all page navigations
- [x] Test resource detail page navigation from homepage

## Research Source Refinement (New Requirements)
- [x] Remove all arXiv RSS feeds (low quality, unpublished papers)
- [ ] Add top-tier journal RSS feeds (Nature, Science, Educational Researcher, etc.)
- [x] Keep only US News top 30 university official research news (not arXiv preprints)
- [x] Clear existing arXiv papers from database
- [x] Test new research sources to ensure quality (Berkeley AI Research papers showing correctly)

## Homepage Redesign (New Requirements)
- [x] Remove "Featured Research" static section from homepage
- [x] Redesign homepage to clearly separate News and Research sections
- [x] Make homepage dynamic (show latest content only)
- [x] Move tools library and resources to separate dedicated pages (already exist)
- [x] Ensure all homepage links are functional (no 404s)

## RSS Source Research and Fix (Urgent)
- [x] Search for working RSS feeds from Stanford (HAI, News, CS department)
- [x] Search for working RSS feeds from MIT (CSAIL, News, Media Lab)
- [ ] Search for working RSS feeds from Harvard (GSE, News)
- [ ] Search for working RSS feeds from CMU (Robotics Institute, News)
- [ ] Search for working RSS feeds from other top 30 universities
- [ ] Find RSS feeds from top-tier journals (Nature, Science, Educational Researcher, etc.)
- [x] Verify all RSS URLs are working before adding to config
- [x] Update RSS configuration with verified working feeds
- [x] Test new RSS sources to ensure diverse research content
- [x] Added 6 new working RSS feeds: MIT News AI, MIT News Robotics, MIT News Education, MIT CSAIL, Stanford SAIL Blog, Cornell Chronicle AI
- [x] Disabled 3 non-working university feeds: NYU Steinhardt (404), Wisconsin-Madison (404), Michigan (403)
- [x] Verified research papers now showing from 4 universities: MIT (69 papers), Stanford (15 papers), Berkeley (10 papers)
- [x] Total research papers in database: 94 papers from multiple top institutions


## Bug Fix - Research Page Data Source (Urgent)
- [x] Investigate why Research page is showing news items instead of research papers
- [x] Fix Research page to query research_papers table instead of news_feed table
- [x] Migrated 256 university news items from research_papers to news_items table
- [x] Changed all university RSS feeds from contentType="research" to contentType="news"
- [x] Verified news page now shows 870 items including university research news
- [x] Verified research page is now empty and ready for real academic papers

## Bug Fix - Resource Detail Page Navigation (Urgent)
- [x] Investigate why Resource links are not navigating to detail pages
- [x] Verified resource card links properly navigate to /resource/:slug
- [x] Verified resource detail page displays correct information
- [x] Tested navigation from homepage to resource detail pages - working correctly


## Populate Research Page with Top-Tier Journal Papers (High Priority)
- [x] Search for Nature journal RSS feeds (Nature, Nature Machine Intelligence, Nature Human Behaviour)
- [x] Search for Science journal RSS feeds (Science, Science Robotics, Science Advances)
- [ ] Search for ACM journal RSS feeds (ACM Transactions, Communications of the ACM)
- [ ] Search for IEEE journal RSS feeds (IEEE Transactions on Learning Technologies, IEEE Intelligent Systems)
- [ ] Search for education research journal RSS feeds (Educational Researcher, Journal of Learning Sciences, Review of Educational Research)
- [x] Test all top-tier journal RSS feed URLs to ensure they work
- [x] Add working journal RSS feeds to rss-config.ts with contentType="research"
- [x] Trigger RSS update to fetch journal papers
- [x] Verify Research page displays peer-reviewed journal papers with proper metadata
- [x] Successfully added 3 top-tier journal RSS feeds: Nature Machine Intelligence, Nature Human Behaviour, Science Robotics
- [x] Fetched 24 research papers from top journals (8 from each journal)
- [x] Research page now displays real peer-reviewed papers instead of news articles


## Add 5 More Top-Tier Journal RSS Feeds (Critical Priority)
- [x] Search for Nature Communications RSS feed (综合顶刊)
- [x] Search for Science Advances RSS feed (综合顶刊)
- [x] Search for PNAS (Proceedings of National Academy of Sciences) RSS feed
- [ ] Search for Nature Reviews journals RSS feeds (Education/Psychology related)
- [ ] Search for Cell系列期刊 RSS feeds
- [x] Test all found RSS feed URLs to ensure they work
- [x] Add 4 working top journal RSS feeds to rss-config.ts: Nature Communications, Science Advances, PNAS, Nature
- [x] Enabled Science Advances RSS feed (was previously disabled)
- [ ] Trigger RSS update to fetch papers from new journals
- [ ] Verify Research page displays papers from the new top journals

## Add Journal of Learning Sciences and Computers & Education (High Priority)
- [x] Found Journal of the Learning Sciences RSS feed: https://www.tandfonline.com/feed/rss/hlns20
- [ ] Check if Computers & Education has RSS feed available
- [ ] Add Journal of Learning Sciences to rss-config.ts
- [ ] Add Computers & Education if RSS available, otherwise use web scraper
- [ ] Trigger RSS update to fetch papers from these education-focused journals


## Create Journal Web Scraper for AI+Education Papers (High Priority)
- [ ] Design journal scraper service architecture
- [ ] Implement scraper for Computers & Education (Elsevier/ScienceDirect)
- [ ] Implement scraper for AI in Education (MDPI)
- [ ] Implement scraper for International Journal of AI in Education (Springer)
- [ ] Implement scraper for British Journal of Educational Technology
- [ ] Test scrapers to extract title, authors, abstract, publication date, DOI/URL
- [ ] Save scraped papers to research_papers table with proper metadata
- [ ] Integrate scraper into admin RSS update workflow
- [ ] Add error handling and rate limiting to avoid blocking
- [ ] Verify Research page displays scraped journal papers correctly


## Add 5 More AI+Education Journals (High Priority)
- [x] Search for International Journal of STEM Education RSS feed - No RSS available (Springer)
- [x] Search for IEEE Transactions on Learning Technologies RSS feed - Found: https://ieeexplore.ieee.org/rss/TOC4620076.XML
- [x] Search for Journal of Science Education and Technology RSS feed - No RSS available
- [x] Search for International Journal of Artificial Intelligence in Education (IJAIED) RSS feed - No RSS available
- [x] Search for Computers & Education: Artificial Intelligence RSS feed - No RSS available (Elsevier)
- [x] Test all found RSS feed URLs
- [x] Add IEEE Transactions on Learning Technologies RSS to rss-config.ts with contentType="research"
- [x] Trigger RSS update to fetch papers from IEEE TLT
- [x] Verify Research page displays papers from IEEE TLT and all top journals
- [x] Successfully added 6 new papers from IEEE TLT
- [x] Successfully added 14 new papers from Journal of the Learning Sciences
- [x] Successfully added 107 new papers from PNAS
- [x] Successfully added 3 new papers from Nature Communications
- [x] Research page now displays 180+ papers from 9 top-tier journals
- [ ] Consider implementing web scraper for journals without RSS feeds


## Implement Intelligent Content Filtering for Research Papers (Critical Priority)
- [x] Re-enable all journal RSS feeds (Nature, PNAS, Nature Communications, Science Advances)
- [x] Implement LLM-based content filter in RSS service
- [x] Filter analyzes title and abstract to determine if paper is related to AI, education, future learning, or learning sciences
- [x] Only save papers that pass the relevance filter to research_papers table
- [x] Delete existing irrelevant papers from research_papers table (cancer, climate, geology, etc.)
- [x] Test filtering with RSS update
- [x] Verify Research page only displays AI and education related papers
- [x] Successfully filtered 200+ papers from Nature, Science, PNAS down to 13 relevant papers
- [x] LLM correctly identified and saved papers about: STEM education, neural networks, AI, LLM feedback, collaborative learning, computational literacy
- [x] LLM correctly skipped irrelevant papers about: cancer, climate, geology, biology, chemistry, physics


## Fix Navigation Links and Expand Research Papers (Critical Priority)
- [ ] Fix Research page - "View Paper" links should navigate to source website
- [ ] Fix Resources page - resource links should navigate to source website
- [ ] Adjust LLM filter to be more inclusive - include education technology, learning analytics, data science in education, computational thinking
- [ ] Current filter is too strict (only 13 papers from 1642), need to expand to include more education-related topics
- [ ] Test updated filter with RSS update
- [ ] Verify Data Science category has papers after filter adjustment
- [ ] Consider implementing web scraper for journals without RSS (Computers & Education, IJAIED, etc.)


## Fix Navigation Links and Expand LLM Filter (Completed)
- [x] Add "Visit Source Website" button to Resource detail pages
- [x] Add url field to curated_content table schema
- [x] Push database schema changes
- [x] Adjust LLM filter criteria to be more inclusive of education-related topics
- [x] Include data science, learning analytics, educational data mining in filter
- [x] Include cognitive science, neuroscience, educational psychology in filter
- [x] Expanded filter to include 20+ education-related topics (ML, NLP, CV, VR/AR, MOOCs, assessment, etc.)
- [ ] Test updated filter with RSS update (clear database and re-fetch)
- [ ] Verify more relevant papers are saved to Research page


## LLM-Based Content Filtering for Research Papers (Completed)
- [x] Implemented intelligent LLM-based content filter in RSS service
- [x] Filter analyzes title and abstract to determine relevance to AI, education, future learning
- [x] Expanded filter criteria to include 20+ education-related topics:
  * AI in education, educational technology, learning sciences
  * Data science in education, learning analytics, educational data mining
  * Cognitive science, neuroscience of learning, educational psychology
  * Human-computer interaction in education, adaptive learning systems
  * Computational thinking, programming education, STEM education
  * Online learning, distance education, MOOCs
  * Teacher professional development, pedagogy research
  * Educational assessment, student engagement, collaborative learning
- [x] Successfully filtered 1559 papers from top journals down to 15 highly relevant papers
- [x] Papers include: STEM education disparities (COVID), LLM hallucination research, AI survey contamination, collaborative learning, computational literacy, science education frameworks, teacher professional learning
- [x] System correctly skips irrelevant papers: cancer research, climate science, geology, chemistry, physics, biology
- [x] All 9 top journal RSS feeds retained and working with intelligent filtering


## Apply User-Provided Updates from ai_education_hub_v2.zip (High Priority)
- [ ] Analyze changes in uploaded files
- [ ] Compare Home.tsx, Research.tsx, News.tsx, Resources.tsx, Tools.tsx, Search.tsx
- [ ] Check for schema changes in drizzle/schema.ts
- [ ] Check for router changes in server/routers.ts
- [ ] Check for database helper changes in server/db.ts
- [ ] Apply all file changes to current project
- [ ] Test updated project to ensure everything works
- [ ] Verify all pages render correctly
- [ ] Save checkpoint with applied updates

## Homepage Simplification (New Requirements)
- [x] Remove Featured Research section from homepage (not real research papers)
- [x] Make News and Research sections more prominent and醒目 on homepage
- [x] Redesign homepage layout to focus only on News and Research entry points

## Homepage Layout Adjustment (Urgent)
- [x] Restore Latest Updates section with image card layout (3-column grid)
- [x] Keep News and Research sections prominent but adjust layout
- [x] Ensure Latest Updates shows news with images in card format

## Research Paper Topic Classification (Urgent)
- [x] Check if research_papers table has topic field populated
- [x] Implement topic assignment logic in fetchResearch.ts
- [x] Map papers to categories (AI Education, Robotics, Data Science, etc.)
- [x] Update Research page to show papers filtered by topic
- [x] Test that papers appear in their respective topic pages

## News Fetch Bug Fixes (Urgent)
- [x] Remove duplicate RSS source URLs in fetchNews.ts (e.g., CMU appears twice)
- [x] Enhance cleanText() function to properly strip all HTML tags from descriptions
- [x] Add unique constraint on news_items.url to prevent duplicates
- [x] Verify insert logic uses onDuplicateKeyUpdate
- [x] Test news fetch to verify no duplicate articles and clean descriptions

## /news Page tRPC Error Fix
- [ ] Fix tRPC error on /news page: server returning HTML instead of JSON
