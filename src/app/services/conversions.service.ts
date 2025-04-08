import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConversionsService {

  constructor() { }

  /**
   * 
   * @param html html to convert
   * @returns text formated to strip all html tags and other unwanted characters
   */
  htmlToText(html: string, options?: any) {
    let text = html;
    text = text.replace(/\s+/g, ' ');
    if (options.removeTitles) {
      text = text.replace(/<h1[^>]*>(.*?)<\/h1>|<h2[^>]*>(.*?)<\/h2>|<h3[^>]*>(.*?)<\/h3>|<h4>(.*?)<\/h4[^>]*>|<h5[^>]*>(.*?)<\/h5>|<h6[^>]*>(.*?)<\/h6>/g, ' \n');
    }

    if (options.removeParenthesis) {
      text = text.replace(/\(.*?\)|\[.*?\]|\{.*?\}/g, '');
    }

    if (options.removePunctuation) {
      text = text.replace(/[.!?,;:]/g, ' \n');
      text = text.replace(/[#$%\^&\*\_`~]/g, '');
    }
    text = text.replace(/<br>|<\/div>|<\/p>|<\/h1>|<h\/2>|<\/h3>|<\/h3>|<\/h4>|<\/h5>|<\/h6>/g, ' \n');
    text = text.replace(/<[^>]*>/g, ' ');
    text = text.replace(/\n(\s*\n)+/g, '\n');
    text = text.trim()
    return text;
  }

  /**
   * 
   * @param timer time in seconds
   * @returns time string in the format HH:MM:SS,MS
   */
  timerToTime(timer: number) {
    let hours: string | number = Math.floor(timer / 3600);
    if (hours < 10) hours = '0' + hours;
    let minutes: string | number = Math.floor((timer % 3600) / 60);
    if (minutes < 10) minutes = '0' + minutes
    let seconds: string | number = Math.floor(timer % 60);
    if (seconds < 10) seconds = '0' + seconds;
    let milliseconds: string | number = Math.floor((timer - Math.floor(timer)) * 1000);
    if (milliseconds < 10) milliseconds = '00' + milliseconds;
    else if (milliseconds < 100) milliseconds = '0' + milliseconds;
    return `${hours}:${minutes}:${seconds},${milliseconds}`;
  }
}
