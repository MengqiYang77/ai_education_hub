import axios from 'axios';
import * as cheerio from 'cheerio';
import { getDb } from './db';
import { researchPapers } from '../drizzle/schema';
import * as schema from '../drizzle/schema';

interface ScrapedPaper {
  title: string;
  authors?: string;
  abstract?: string;
  publishedAt?: Date;
  source: string;
  url: string;
  doi?: string;
}

export class JournalScraperService {
  private readonly USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
  
  /**
   * Scrape Computers & Education journal (ScienceDirect)
   */
  async scrapeComputersAndEducation(): Promise<ScrapedPaper[]> {
    try {
      console.log('[Scraper] Fetching Computers & Education...');
      const url = 'https://www.sciencedirect.com/journal/computers-and-education/articles-in-press';
      const response = await axios.get(url, {
        headers: { 'User-Agent': this.USER_AGENT },
        timeout: 15000,
      });
      
      const $ = cheerio.load(response.data);
      const papers: ScrapedPaper[] = [];
      
      // ScienceDirect uses specific article containers
      $('.article-content').each((_: number, element: any) => {
        const $el = $(element);
        const title = $el.find('.article-title a').text().trim();
        const authors = $el.find('.author-list').text().trim();
        const url = 'https://www.sciencedirect.com' + $el.find('.article-title a').attr('href');
        const doi = $el.find('.doi').text().replace('DOI:', '').trim();
        
        if (title && url) {
          papers.push({
            title,
            authors: authors || undefined,
            source: 'Computers & Education',
            url,
            doi: doi || undefined,
            publishedAt: new Date(),
          });
        }
      });
      
      console.log(`[Scraper] Found ${papers.length} papers from Computers & Education`);
      return papers.slice(0, 10); // Limit to 10 most recent
    } catch (error) {
      console.error('[Scraper] Error scraping Computers & Education:', error);
      return [];
    }
  }
  
  /**
   * Scrape AI in Education journal (MDPI)
   */
  async scrapeAIInEducation(): Promise<ScrapedPaper[]> {
    try {
      console.log('[Scraper] Fetching AI in Education (MDPI)...');
      const url = 'https://www.mdpi.com/journal/aieduc';
      const response = await axios.get(url, {
        headers: { 'User-Agent': this.USER_AGENT },
        timeout: 15000,
      });
      
      const $ = cheerio.load(response.data);
      const papers: ScrapedPaper[]= [];
      
      // MDPI uses article-content class for articles
      $('.article-content').each((_: number, element: any) => {
        const $el = $(element);
        const title = $el.find('.title-link').text().trim();
        const authors = $el.find('.authors').text().trim();
        const abstract = $el.find('.abstract-full').text().trim();
        const articleUrl = $el.find('.title-link').attr('href');
        const doi = $el.find('.doi').text().trim();
        
        if (title && articleUrl) {
          papers.push({
            title,
            authors: authors || undefined,
            abstract: abstract || undefined,
            source: 'AI in Education (MDPI)',
            url: articleUrl.startsWith('http') ? articleUrl : `https://www.mdpi.com${articleUrl}`,
            doi: doi || undefined,
            publishedAt: new Date(),
          });
        }
      });
      
      console.log(`[Scraper] Found ${papers.length} papers from AI in Education`);
      return papers.slice(0, 10);
    } catch (error) {
      console.error('[Scraper] Error scraping AI in Education:', error);
      return [];
    }
  }
  
  /**
   * Scrape International Journal of AI in Education (Springer)
   */
  async scrapeIJAIED(): Promise<ScrapedPaper[]> {
    try {
      console.log('[Scraper] Fetching IJAIED (Springer)...');
      const url = 'https://link.springer.com/journal/40593/volumes-and-issues';
      const response = await axios.get(url, {
        headers: { 'User-Agent': this.USER_AGENT },
        timeout: 15000,
      });
      
      const $ = cheerio.load(response.data);
      const papers: ScrapedPaper[] = [];
      
      // Springer uses specific article list structure
      $('.app-card-open__heading').each((_: number, element: any) => {
        const $el = $(element);
        const title = $el.find('a').text().trim();
        const articleUrl = $el.find('a').attr('href');
        
        if (title && articleUrl) {
          papers.push({
            title,
            source: 'International Journal of AI in Education',
            url: articleUrl.startsWith('http') ? articleUrl : `https://link.springer.com${articleUrl}`,
            publishedAt: new Date(),
          });
        }
      });
      
      console.log(`[Scraper] Found ${papers.length} papers from IJAIED`);
      return papers.slice(0, 10);
    } catch (error) {
      console.error('[Scraper] Error scraping IJAIED:', error);
      return [];
    }
  }
  
  /**
   * Scrape all configured journals and save to database
   */
  async scrapeAllJournals(): Promise<number> {
    console.log('[Scraper] Starting journal scraping...');
    
    const allPapers: ScrapedPaper[] = [];
    
    // Scrape each journal
    const computersEd = await this.scrapeComputersAndEducation();
    const aiInEd = await this.scrapeAIInEducation();
    const ijaied = await this.scrapeIJAIED();
    
    allPapers.push(...computersEd, ...aiInEd, ...ijaied);
    
    // Save to database
    let savedCount = 0;
    for (const paper of allPapers) {
      try {
        // Check if paper already exists by URL
        const dbInstance = await getDb();
        if (!dbInstance) continue;
        
        const db = dbInstance as ReturnType<typeof import('drizzle-orm/mysql2').drizzle<typeof schema>>;
        
        const existing = await db.query.researchPapers.findFirst({
          where: (papers: any, { eq }: any) => eq(papers.url, paper.url),
        });
        
        if (!existing && db) {
          await db.insert(researchPapers).values({
            title: paper.title,
            authors: paper.authors,
            abstract: paper.abstract,
            publishedAt: paper.publishedAt || new Date(),
            source: paper.source,
            url: paper.url,
            pdfUrl: paper.doi ? `https://doi.org/${paper.doi}` : undefined,
          });
          savedCount++;
        }
      } catch (error) {
        console.error(`[Scraper] Error saving paper "${paper.title}":`, error);
      }
    }
    
    console.log(`[Scraper] Saved ${savedCount} new papers from ${allPapers.length} scraped`);
    return savedCount;
  }
}

export const journalScraper = new JournalScraperService();
