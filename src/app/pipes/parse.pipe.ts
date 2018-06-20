import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Pipe({
  name: 'parse'
})

export class ParsePipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {
  }

  transform(value: string): SafeHtml {
    return this.urlifyHashtags(value);
  }

  urlifyHashtags(_text): string {
    let userRegex = /^@([a-zA-Z0-9\.]+)/g;
    //return _text.replace(userRegex, '<a href="/$1" routerLinkActive="active-link">@$1</a>');
    return _text;
  }
}
