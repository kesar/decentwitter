import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Pipe({
  name: 'parse'
})

export class ParsePipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {
  }

  transform(value: string): SafeHtml {
    return this.parse(value);
  }

  parse(_text): string {
    _text = _text.replace(/<.*?>/g, '');
    _text = _text.replace(/(\b(https?):\/\/([-A-Z0-9+&@#%?=~_|!:,.;]*)([-A-Z0-9+&@#%?\/=~_|!:,.;]*)[-A-Z0-9+&@#\/%=~_|])/ig, '<a href="$1" target="_blank">$1</a>'); // url
    _text = _text.replace(/(^|[\s\.,])@([a-zA-Z0-9\.]+)/g, ' <a href="/$2">@$2</a>'); // users
    return _text;
  }
}
