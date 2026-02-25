import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

async function seed() {
  console.log("🌱 Seeding database with top-tier research sources...");

  // Insert categories
  console.log("Creating categories...");
  await connection.query(`
    INSERT INTO categories (name, slug, description, icon, displayOrder) VALUES
    ('AI Education', 'ai-education', 'Research on AI literacy and pedagogy', 'Brain', 1),
    ('Robotics', 'robotics', 'Physical computing and robotics education', 'Bot', 2),
    ('Data Science', 'data-science', 'Data literacy and computational thinking', 'BarChart', 3),
    ('Human Skills', 'human-skills', 'Emotional intelligence and creativity', 'Heart', 4),
    ('Policy & Ethics', 'policy-ethics', 'Educational policy and AI ethics', 'Scale', 5)
  `);

  const [categories] = await connection.query('SELECT * FROM categories');
  const catMap = {};
  categories.forEach(c => { catMap[c.slug] = c.id; });

  // Insert curated content from top institutions
  console.log("Creating curated content from Stanford, MIT, Harvard, Tsinghua...");
  await connection.query(`
    INSERT INTO curated_content (title, slug, description, content, categoryId, authorId, isPinned, publishedAt) VALUES
    (
      'Stanford HAI: AI Index Report 2025',
      'stanford-ai-index-2025',
      'Comprehensive analysis of AI trends in education from Stanford Human-Centered AI Institute',
      'The AI Index tracks progress in AI across multiple dimensions including education adoption, research output, and policy developments. Key findings show exponential growth in AI literacy programs.',
      ${catMap['ai-education']},
      1,
      1,
      NOW()
    ),
    (
      'MIT CSAIL: Teaching AI Ethics to K-12',
      'mit-csail-ai-ethics-k12',
      'Framework for integrating AI ethics education into K-12 curriculum from MIT Computer Science and AI Lab',
      'MIT researchers propose a scaffolded approach to teaching AI ethics, starting with fairness concepts in elementary school and progressing to algorithmic bias in high school.',
      ${catMap['policy-ethics']},
      1,
      1,
      NOW()
    ),
    (
      'Harvard GSE: Self-Intelligence in the AI Age',
      'harvard-self-intelligence-ai',
      'Research on developing self-awareness and emotional regulation for AI era success',
      'Harvard Graduate School of Education identifies four pillars of self-intelligence: self-awareness, resilience, flexibility, and emotional regulation. These skills are critical for human-AI collaboration.',
      ${catMap['human-skills']},
      1,
      1,
      NOW()
    ),
    (
      'CMU Robotics Institute: Hands-On Learning',
      'cmu-robotics-hands-on',
      'Carnegie Mellon research on the cognitive benefits of robotics education',
      'CMU studies show that robotics education significantly improves spatial reasoning, systems thinking, and persistence. Physical manipulation enhances learning retention by 40%.',
      ${catMap['robotics']},
      1,
      0,
      NOW()
    ),
    (
      '清华大学：人工智能教育白皮书',
      'tsinghua-ai-education-whitepaper',
      'Tsinghua University comprehensive framework for AI education in Chinese K-12 schools',
      '清华大学发布的AI教育白皮书提出了"理解-应用-创新"三层递进模型，强调培养学生的计算思维和AI素养。',
      ${catMap['ai-education']},
      1,
      1,
      NOW()
    ),
    (
      'Berkeley: Data Science Education Framework',
      'berkeley-data-science-framework',
      'UC Berkeley framework for teaching data literacy across all subjects',
      'Berkeley Data Science Education Program demonstrates how data literacy can be integrated into humanities, social sciences, and STEM through project-based learning.',
      ${catMap['data-science']},
      1,
      0,
      NOW()
    )
  `);

  // Insert tools from industry leaders
  console.log("Creating tool library...");
  await connection.query(`
    INSERT INTO tools (name, slug, description, detailedInfo, websiteUrl, categoryId, pricing, targetAudience, skillsDeveloped, isFeatured) VALUES
    (
      'OpenAI ChatGPT',
      'chatgpt',
      'Industry-leading conversational AI for teaching prompt engineering and AI literacy',
      'ChatGPT from OpenAI is the most widely adopted AI tool in education. It teaches students how to formulate effective prompts, evaluate AI outputs critically, and understand AI capabilities and limitations.',
      'https://chatgpt.com',
      ${catMap['ai-education']},
      'Free tier available',
      'High School, Middle School',
      'Prompt engineering, critical thinking, AI literacy',
      1
    ),
    (
      'Google Teachable Machine',
      'teachable-machine',
      'Train ML models without coding - from Google Research',
      'Developed by Google Creative Lab, Teachable Machine democratizes machine learning education by allowing students to train image, audio, and pose models through an intuitive interface.',
      'https://teachablemachine.withgoogle.com',
      ${catMap['ai-education']},
      'Free',
      'All levels',
      'ML fundamentals, data collection, model training',
      1
    ),
    (
      'MIT App Inventor',
      'mit-app-inventor',
      'Block-based mobile app development from MIT',
      'MIT App Inventor enables students to create functional Android apps using visual programming. It integrates AI components like image recognition and speech-to-text.',
      'https://appinventor.mit.edu',
      ${catMap['ai-education']},
      'Free',
      'Middle School, High School',
      'App development, computational thinking, AI integration',
      1
    ),
    (
      'VEX Robotics',
      'vex-robotics',
      'Competition-grade robotics platform used in 50+ countries',
      'VEX Robotics is the world largest robotics competition platform, combining mechanical engineering, programming, and strategic thinking. Used by over 20,000 teams globally.',
      'https://www.vexrobotics.com',
      ${catMap['robotics']},
      '$500-2000',
      'High School',
      'Engineering design, C++ programming, teamwork',
      1
    ),
    (
      'LEGO Education SPIKE',
      'lego-spike',
      'Hands-on STEAM learning with programmable robotics',
      'LEGO Education SPIKE combines the familiar LEGO building system with Python and block-based programming. Ideal for introducing robotics concepts.',
      'https://education.lego.com',
      ${catMap['robotics']},
      '$300-400',
      'Middle School',
      'Basic engineering, Python, problem-solving',
      1
    ),
    (
      'Kaggle',
      'kaggle',
      'Real-world datasets and competitions from Google',
      'Kaggle provides access to thousands of datasets and data science competitions. Students can learn by doing and build portfolios with real projects.',
      'https://www.kaggle.com',
      ${catMap['data-science']},
      'Free',
      'High School',
      'Data analysis, Python, machine learning',
      1
    ),
    (
      'Tableau Public',
      'tableau-public',
      'Professional data visualization tool',
      'Tableau Public is the industry standard for data visualization. Students learn to tell stories with data and create interactive dashboards.',
      'https://public.tableau.com',
      ${catMap['data-science']},
      'Free',
      'High School',
      'Data visualization, storytelling, presentation',
      1
    ),
    (
      'Anthropic Claude',
      'claude',
      'Advanced AI assistant with strong reasoning capabilities',
      'Claude from Anthropic offers extended context windows and strong analytical reasoning, making it excellent for research and complex problem-solving tasks.',
      'https://claude.ai',
      ${catMap['ai-education']},
      'Free tier available',
      'High School',
      'Advanced reasoning, research skills, AI literacy',
      1
    )
  `);

  // Insert news from breakthrough sources
  console.log("Creating news feed...");
  await connection.query(`
    INSERT INTO news_items (title, description, url, source, categoryId, publishedAt) VALUES
    (
      'OpenAI Releases GPT-5 with Enhanced Educational Features',
      'GPT-5 introduces new safety features and educational modes specifically designed for K-12 learning environments.',
      'https://openai.com/research',
      'OpenAI',
      ${catMap['ai-education']},
      '2026-02-20'
    ),
    (
      'Stanford HAI: AI Index Report Shows 300% Growth in AI Education',
      'Latest AI Index reveals explosive growth in AI literacy programs across US schools.',
      'https://hai.stanford.edu/ai-index',
      'Stanford HAI',
      ${catMap['ai-education']},
      '2026-02-15'
    ),
    (
      'MIT CSAIL Develops New Framework for Teaching AI Ethics',
      'Researchers propose age-appropriate curriculum for teaching algorithmic fairness and bias.',
      'https://www.csail.mit.edu',
      'MIT CSAIL',
      ${catMap['policy-ethics']},
      '2026-02-10'
    ),
    (
      'DeepMind: AlphaGeometry Breakthrough in Mathematical Reasoning',
      'New AI system solves complex geometry problems, implications for STEM education.',
      'https://deepmind.google/research',
      'Google DeepMind',
      ${catMap['ai-education']},
      '2026-02-05'
    ),
    (
      '清华大学发布AI教育创新实验室成果',
      '清华大学AI教育实验室展示了基于大模型的个性化学习系统，可根据学生特点定制学习路径。',
      'https://www.tsinghua.edu.cn',
      'Tsinghua University',
      ${catMap['ai-education']},
      '2026-02-01'
    ),
    (
      'Harvard Study: Emotional Intelligence Predicts AI-Era Success',
      'Longitudinal study shows EQ is stronger predictor of career success than technical skills.',
      'https://www.gse.harvard.edu',
      'Harvard GSE',
      ${catMap['human-skills']},
      '2026-01-28'
    ),
    (
      'CMU Robotics Institute: New Curriculum for High School Robotics',
      'Carnegie Mellon releases open-source robotics curriculum integrating AI and machine learning.',
      'https://www.ri.cmu.edu',
      'CMU Robotics',
      ${catMap['robotics']},
      '2026-01-25'
    ),
    (
      'Berkeley Data Science: Free Course for Educators',
      'UC Berkeley launches free online course teaching data science pedagogy for K-12 teachers.',
      'https://data.berkeley.edu',
      'UC Berkeley',
      ${catMap['data-science']},
      '2026-01-20'
    ),
    (
      'Anthropic Releases Constitutional AI Research',
      'New paper on building AI systems aligned with human values, implications for education.',
      'https://www.anthropic.com/research',
      'Anthropic',
      ${catMap['policy-ethics']},
      '2026-01-15'
    ),
    (
      'VEX Robotics World Championship Announces AI Category',
      'New competition category focuses on autonomous robots using computer vision and ML.',
      'https://www.roboticseducation.org',
      'VEX Robotics',
      ${catMap['robotics']},
      '2026-01-10'
    )
  `);

  console.log("✅ Database seeded successfully with top-tier research sources!");
  await connection.end();
}

seed()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
