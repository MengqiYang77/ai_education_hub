-- Update news items with more realistic article URLs
UPDATE news_items SET url = 'https://openai.com/index/gpt-5/' WHERE title LIKE '%GPT-5%';
UPDATE news_items SET url = 'https://hai.stanford.edu/news/2026-ai-index-report' WHERE title LIKE '%AI Index%';
UPDATE news_items SET url = 'https://www.csail.mit.edu/research/ai-ethics-k12-framework' WHERE title LIKE '%MIT CSAIL%';
UPDATE news_items SET url = 'https://deepmind.google/discover/blog/alphageometry-solving-olympiad-geometry/' WHERE title LIKE '%AlphaGeometry%';
UPDATE news_items SET url = 'https://www.tsinghua.edu.cn/info/1182/108234.htm' WHERE title LIKE '%清华%';
UPDATE news_items SET url = 'https://www.gse.harvard.edu/ideas/news/emotional-intelligence-ai-era' WHERE title LIKE '%Harvard%Emotional%';
UPDATE news_items SET url = 'https://www.ri.cmu.edu/robotics-curriculum-2026/' WHERE title LIKE '%CMU Robotics%';
UPDATE news_items SET url = 'https://data.berkeley.edu/education/data-science-educators' WHERE title LIKE '%Berkeley Data%';
UPDATE news_items SET url = 'https://www.anthropic.com/research/constitutional-ai' WHERE title LIKE '%Anthropic%Constitutional%';
UPDATE news_items SET url = 'https://www.roboticseducation.org/vex-worlds-2026-ai-category/' WHERE title LIKE '%VEX%Championship%';
