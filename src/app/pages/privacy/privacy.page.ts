import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.page.html',
  styleUrls: ['./privacy.page.scss'],
})
export class PrivacyPage implements OnInit {

  constructor(private ruoter: Router) { }

  ngOnInit() {
    return;
  }

  goRegister() {
    this.ruoter.navigate(['/register']);
  }
}
