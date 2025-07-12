import { NewsItem, NewsSource, NewsAggregator } from '../types'
import { getNewsForDay, getNewsBySource } from '../data/mockNewsData'

export class UPSCNewsAggregator implements NewsAggregator {
  
  async fetchNews(source: NewsSource, date: Date): Promise<NewsItem[]> {
    // In production, this would fetch from actual RSS feeds
    // For demo, we'll use mock data based on date
    
    const today = new Date()
    const daysDiff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    // Map the date difference to our mock data days (1-7)
    const dayNumber = Math.min(Math.max(8 - daysDiff, 1), 7)
    
    const allDayNews = getNewsForDay(dayNumber)
    return allDayNews.filter(news => news.source === source)
  }
  
  async parseRSSFeed(feedUrl: string): Promise<NewsItem[]> {
    // In production, this would parse actual RSS feeds
    // For demo, we'll return mock data based on the feed URL
    
    const sourceMapping: Record<string, NewsSource> = {
      'pib.gov.in': 'PIB',
      'thehindu.com': 'TheHindu',
      'indianexpress.com': 'IndianExpress',
      'economictimes.com': 'EconomicTimes',
      'downtoearth.org': 'DownToEarth'
    }
    
    // Extract source from URL
    const source = Object.entries(sourceMapping).find(([domain]) => 
      feedUrl.includes(domain)
    )?.[1] || 'PIB'
    
    return getNewsBySource(source as NewsSource)
  }
  
  validateNewsItem(item: NewsItem): boolean {
    // Validate required fields
    if (!item.id || !item.title || !item.content || !item.source) {
      return false
    }
    
    // Validate content length
    if (item.content.length < 100) {
      return false
    }
    
    // Validate date
    if (!item.publishedDate || isNaN(item.publishedDate.getTime())) {
      return false
    }
    
    // Validate tags
    if (!item.tags || item.tags.length === 0) {
      return false
    }
    
    return true
  }
  
  // Additional methods for aggregation
  
  async fetchMultipleSources(sources: NewsSource[], date: Date): Promise<NewsItem[]> {
    const allNews: NewsItem[] = []
    
    for (const source of sources) {
      const sourceNews = await this.fetchNews(source, date)
      allNews.push(...sourceNews)
    }
    
    // Sort by published date (newest first)
    allNews.sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime())
    
    return allNews
  }
  
  async fetchWeeklyNews(startDate: Date): Promise<Record<string, NewsItem[]>> {
    const weeklyNews: Record<string, NewsItem[]> = {}
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)
      
      const dayKey = `day${i + 1}`
      const dayNews = await this.fetchMultipleSources(
        ['PIB', 'TheHindu', 'IndianExpress', 'EconomicTimes', 'DownToEarth'],
        currentDate
      )
      
      weeklyNews[dayKey] = dayNews
    }
    
    return weeklyNews
  }
  
  // Source-specific parsing logic
  
  private parsePIBContent(rawContent: string): NewsItem {
    // PIB-specific parsing logic
    // Extract government announcements, schemes, policies
    return {
      id: `pib-${Date.now()}`,
      source: 'PIB',
      title: this.extractTitle(rawContent),
      content: this.extractMainContent(rawContent),
      publishedDate: new Date(),
      url: 'https://pib.gov.in',
      tags: this.extractPIBTags(rawContent),
      originalLength: rawContent.length
    }
  }
  
  private parseTheHinduContent(rawContent: string): NewsItem {
    // The Hindu editorial parsing logic
    // Focus on analysis and opinions
    return {
      id: `hindu-${Date.now()}`,
      source: 'TheHindu',
      title: this.extractTitle(rawContent),
      content: this.extractMainContent(rawContent),
      publishedDate: new Date(),
      url: 'https://thehindu.com',
      author: this.extractAuthor(rawContent),
      tags: this.extractEditorialTags(rawContent),
      originalLength: rawContent.length
    }
  }
  
  // Helper methods
  
  private extractTitle(content: string): string {
    // Extract title from content
    const lines = content.split('\n')
    return lines[0]?.trim() || 'Untitled'
  }
  
  private extractMainContent(content: string): string {
    // Extract main content, removing metadata
    const lines = content.split('\n')
    return lines.slice(1).join('\n').trim()
  }
  
  private extractAuthor(content: string): string {
    // Extract author from content
    const authorMatch = content.match(/By\s+([^,\n]+)/i)
    return authorMatch?.[1]?.trim() || 'Staff Reporter'
  }
  
  private extractPIBTags(content: string): string[] {
    const tags: string[] = []
    
    // Check for common government themes
    if (content.toLowerCase().includes('scheme')) tags.push('scheme')
    if (content.toLowerCase().includes('cabinet')) tags.push('cabinet decision')
    if (content.toLowerCase().includes('minister')) tags.push('ministerial announcement')
    if (content.toLowerCase().includes('policy')) tags.push('policy')
    if (content.toLowerCase().includes('budget')) tags.push('budget')
    
    return tags
  }
  
  private extractEditorialTags(content: string): string[] {
    const tags: string[] = []
    
    // Check for editorial themes
    if (content.toLowerCase().includes('analysis')) tags.push('analysis')
    if (content.toLowerCase().includes('opinion')) tags.push('opinion')
    if (content.toLowerCase().includes('perspective')) tags.push('perspective')
    if (content.toLowerCase().includes('debate')) tags.push('debate')
    
    return tags
  }
  
  // RSS Feed simulation
  
  generateRSSFeedXML(newsItems: NewsItem[]): string {
    const feedItems = newsItems.map(item => `
      <item>
        <title>${this.escapeXML(item.title)}</title>
        <link>${item.url}</link>
        <description>${this.escapeXML(item.content.substring(0, 200))}...</description>
        <pubDate>${item.publishedDate.toUTCString()}</pubDate>
        <guid>${item.id}</guid>
        ${item.author ? `<author>${this.escapeXML(item.author)}</author>` : ''}
        ${item.tags.map(tag => `<category>${this.escapeXML(tag)}</category>`).join('\n')}
      </item>
    `).join('\n')
    
    return `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>UPSC Current Affairs Feed</title>
        <link>https://communityias.com/current-affairs</link>
        <description>Curated current affairs for UPSC preparation</description>
        <language>en</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        ${feedItems}
      </channel>
    </rss>`
  }
  
  private escapeXML(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }
}