import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ConversionsService } from './services/conversions.service';

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

  constructor(
    private conversionsService: ConversionsService
  ) {

  }

  Convert() {
    let text = '';
    let line = '';
    let lineCount = 1;
    let wordCount = 0;
    let timer = 0;

    let splitedByWords = this.conversionsService.htmlToText(this.textToConvert, this.parameters).split(' ');

    splitedByWords.forEach((word: string, index) => {
      if (word != '' && word != '\n') {
        line += word + ' ';
        wordCount++
      }

      if (line.length && (word == '\n' || wordCount >= this.parameters.maxWordsPerSubtitles || index == splitedByWords.length - 1)) {
        let oldTime = timer;
        line = line.trim()
        timer += line.length / this.parameters.CharPerSeconds;
        text += lineCount + '\n' + this.conversionsService.timerToTime(oldTime) + ' --> ' + this.conversionsService.timerToTime(timer) + '\n' + line.trim() + '\n\n';
        line = '';
        wordCount = 0;
        lineCount++
      }
    });
    this.previewText = text;
  }

  DownloadSrt() {
    const file = new Blob([this.previewText], { type: 'text/plain' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'subtitle.srt';
    link.click();
    URL.revokeObjectURL(url);
    link.remove();
  }
}
