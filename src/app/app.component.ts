import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    AngularEditorModule,
    HttpClientModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  textToConvert: string = '';
  previewText: string = '';

  parameters = {
    removeTitles: true,
    removeParenthesis: true,
    removePunctuation: true,
    CharPerSeconds: 30,
    maxWordsPerSubtitles: 3,
  }

  editorConfig: AngularEditorConfig = {
    placeholder: 'Enter or copy text here...',
    height: '45vh',
    width: '100%',
    enableToolbar: true,
    showToolbar: true,
    editable: true,
    sanitize: false
  }

  Convert() {
    let splitedByWords = this.htmlToText(this.textToConvert).split(' ');
    let text = '';
    let line = '';
    let lineCount = 1;
    let wordCount = 0;
    let timer = 0;
    splitedByWords.forEach((word: string, index) => {
      if (word != '' && word != '\n') {
        line += word + ' ';
        wordCount++
      }

      if (line.length && (word == '\n' || wordCount >= this.parameters.maxWordsPerSubtitles || index == splitedByWords.length - 1)) {
        let oldTime = timer;
        line = line.trim()
        timer += line.length / this.parameters.CharPerSeconds;
        text += lineCount + '\n' + this.timerToTime(oldTime) + ' --> ' + this.timerToTime(timer) + '\n' + line.trim() + '\n\n';
        line = '';
        wordCount = 0;
        lineCount++
      }
    });
    this.previewText = text;
  }

  /**
   * 
   * @param html html to convert
   * @returns text formated to strip all html tags and other unwanted characters
   */
  htmlToText(html: string) {
    let text = html;
    text = text.replace(/\s+/g, ' ');
    if (this.parameters.removeTitles) {
      text = text.replace(/<h1[^>]*>(.*?)<\/h1>|<h2[^>]*>(.*?)<\/h2>|<h3[^>]*>(.*?)<\/h3>|<h4>(.*?)<\/h4[^>]*>|<h5[^>]*>(.*?)<\/h5>|<h6[^>]*>(.*?)<\/h6>/g, '\n');
    }

    if (this.parameters.removeParenthesis) {
      text = text.replace(/\(.*?\)|\[.*?\]|\{.*?\}/g, '');
    }

    if (this.parameters.removePunctuation) {
      text = text.replace(/[.!?,;:]/g, ' \n');
      text = text.replace(/[#$%\^&\*\_`~]/g, '');
    }
    text = text.replace(/<br>|<\/div>|<\/p>|<\/h1>|<h\/2>|<\/h3>|<\/h3>|<\/h4>|<\/h5>|<\/h6>/g, '\n');
    text = text.replace(/<[^>]*>/g, ' ');
    text = text.replace(/\n\n+/g, '\n');
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
