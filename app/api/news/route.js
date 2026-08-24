import Parser from 'rss-parser';
import { NextResponse } from 'next/server';

const parser = new Parser();

function cleanText(text) {
  return (text || '')
    .replace(/<[^>]*>/g, '')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#038;|&amp;/g, '&')
    .replace(/&#8230;/g, '...')
    .trim();
}

export async function GET() {
  try {
    const feed = await parser.parseURL('https://www.soompi.com/feed');
    const items = (feed.items || []).map((item) => {
      let excerpt = cleanText(item.contentSnippet || item.content || '');
      const postIndex = excerpt.indexOf('The post ');
      if (postIndex !== -1) excerpt = excerpt.slice(0, postIndex).trim();
      return {
        title: cleanText(item.title),
        link: item.link,
        pubDate: item.pubDate,
        categories: item.categories || [],
        excerpt: excerpt.slice(0, 200),
      };
    });
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
