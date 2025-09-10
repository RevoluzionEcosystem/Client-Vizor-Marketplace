import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// utils/scrape.ts
import axios from 'axios';
import * as cheerio from 'cheerio';

export const scrapeData = async (url: string): Promise<any> => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Replace the following code with the actual scraping logic
    const results: any[] = [];
    $('selector').each((index, element) => {
      const result = $(element).text(); // Adjust as needed
      results.push(result);
    });

    return results;
  } catch (error) {
    console.error('Error scraping data:', error);
    throw error;
  }
};
