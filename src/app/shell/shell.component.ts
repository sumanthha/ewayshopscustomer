import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MediaObserver } from '@angular/flex-layout';
import { CommonService } from '../common/common.service';
import { AuthenticationService } from '@app/auth';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit {
  notifyBadge: string;
  constructor(
    private router: Router,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private media: MediaObserver,
    private CommonService: CommonService,
    private spinner: NgxSpinnerService
  ) {}

  sideBarOpen: boolean = true;
  public innerWidth: any;
  profilePic: any;
  profileName: any;
  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = true;
  isShowing1 = false;
  ngOnInit() {
    this.spinner.show();
    //this.CommonService.Notify_count.subscribe((count) => (this.notifyBadge = count));
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 767) {
      this.sideBarOpen = false;
    }

    this.profilePic = localStorage.getItem('profilePic');
    this.CommonService.profilePic.subscribe((res) => {
      this.profilePic = res;
    });
    console.log(this.profileName, 'profile');
    this.CommonService.name.subscribe((res) => {
      this.profileName = res;
    });
  }

  showSubSubMenu1() {
    if (!this.isShowing1) {
      this.isShowing1 = true;
    } else {
      this.isShowing1 = false;
    }
  }

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }
  logout() {
    localStorage.clear();
    this.CommonService.updateIdentity('', '');
    this.authenticationService.logout();
  }

  // get username(): string | null {
  //   const credentials = this.credentialsService.credentials;
  //   return credentials ? credentials.access : null;
  // }

  get isMobile(): boolean {
    return this.media.isActive('xs') || this.media.isActive('sm');
  }

  get title(): string {
    return this.titleService.getTitle();
  }
  product() {
    this.router.navigate(['product']);
  }
  profile() {
    this.router.navigate(['profile']);
  }
  setting() {
    this.router.navigate(['profile']);
  }
}
