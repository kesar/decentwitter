import {Component, OnInit, Renderer2} from '@angular/core';
import {ScatterService} from '../../../services/scatter.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {
  constructor(private renderer: Renderer2, private scatterService: ScatterService) {
    renderer.listen('document', 'scatterLoaded', () => {
        this.scatterService.load();
      }
    );
  }

  ngOnInit() {
  }
}
