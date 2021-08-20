import { Title } from '@angular/platform-browser';
import { Component, OnInit, Input, NgZone,Renderer2,ElementRef,ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthenticationService } from '@app/auth';
import { CommonService } from '../../common/common.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { NgxSpinnerService } from 'ngx-spinner';
export interface Store {
  branch_name: string;
}
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  myControl = new FormControl();
  filteredOptions: Observable<Store[]>;
  @ViewChild('noti') notiEle: ElementRef;
  @ViewChild('bell') bell: ElementRef;
  @Input() sidenav!: MatSidenav;
  homeFilterbtn: any;
  selectedLang: string;
  selectLoc: string;
  showSignup: boolean;
  mainCate: any;
  // apiurl: any = albaApp.api;
  isLogin: boolean = false;
  profileData: any;
  shortName: string;
  profilePic: any;
  search: any;
  zipcode: any;
  options: Store[] = [];
  profileName: string;
  logged: boolean = false;
  latitude: number;
  private geoCoder: any;
  longitude: number;
  zoom: number;
  address: any;
  branch: any;
  cartbadge: any = 0;
  lati: string;
  longi: string;
  showNotification: boolean = false;
  notification_list: any;
  notifybadge: any;
  disabled_headericon: boolean = false;
  constructor(
    private router: Router,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private CommonService: CommonService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private Spinner: NgxSpinnerService,
    private renderer: Renderer2
  ) {
    this.profilePic = localStorage.getItem('profilePic');
    this.profileName = localStorage.getItem('profileName');
    this.CommonService.profilePic.subscribe((res) => {
      this.profilePic = res;
    });
    this.CommonService.name.subscribe((res) => {
      this.profileName = res;
      this.logged = true;
    });
    this.CommonService.count.subscribe(() => {
      if (this.authenticationService.isAuthenticated()) {
        this.Spinner.show();
        this.authenticationService.GetNotificationCount().subscribe((response) => {
          this.Spinner.hide();
          if (response['status'] == 'ok') {
            this.notifybadge  = response['data'];
          }
        });
        
      }
    });
    this.CommonService.cart_count.subscribe(() => {
      if (this.authenticationService.isAuthenticated()) {
        this.Spinner.show();
        this.authenticationService.viewCartItems().subscribe((response) => {
          this.Spinner.hide();
          if (response['status'] == 'ok') {
            this.cartbadge = response['data']['data'].length;
          }
        });
      }
    });
    this.renderer.listen('window', 'click',(e:Event)=>{
      console.log(e.target);
      console.log(this.bell?.nativeElement);
      if(e.target == this.bell?.nativeElement || e.target == this.notiEle?.nativeElement){
          this.showNotification=true;
          this.notify();
      } else{
        this.showNotification=false;
      }
  });
  }

  ngOnInit(): void {
    if (this.profileName == null || this.profileName == '') {
      this.disabled_headericon = true;
    }
    if (this.authenticationService.isAuthenticated()) {
      this.Spinner.show();
      this.authenticationService.GetNotificationCount().subscribe((response) => {
        this.Spinner.hide();
        if (response['status'] == 'ok') {
          this.notifybadge  = response['data'];
          console.log(this.notifybadge,"notifybadge")
          //this.notifybadge = response['data'].length;
        }
      });
      
    }

    this.geoCoder = new google.maps.Geocoder();
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
    });
    let store_req = {
      zipcode: '',
      branch_name: '',
      page_count: 12,
      page_number: 1,
    };
    this.Spinner.show();
    this.authenticationService.getStoreList(store_req).subscribe((response) => {
      this.Spinner.hide();
      if (response['status'] == 'OK') {
        for (let i = 0; i < response['data'].length; i++) {
          let data = {
            branch_name: response['data'][i].branch_name,
          };
          this.options.push(data);
        }
      }
    });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) => (name ? this._filter(name) : this.options.slice()))
    );
  }
  public setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.CommonService.get_Currentlocation(this.latitude, this.longitude);
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }
  notify() {
    this.authenticationService.getNotificationList().subscribe((response) => {
      this.Spinner.hide();
      if (response['status'] == 'OK') {
        this.notification_list = response['data'];
        //this.notifybadge = response['data'].length;
      }
    });
    // if (this.notification_list.length > 0) {
    //   this.showNotification = !this.showNotification;
    // }
    this.CommonService.notification_count('');
  }
  getAddress(latitude: any, longitude: any) {
    this.geoCoder.geocode({ location: { lat: latitude, lng: longitude } }, (results: any, status: any) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }
  displayFn(user: Store): string {
    return user && user.branch_name ? user.branch_name : '';
  }

  private _filter(name: string): Store[] {
    const filterValue = name.toLowerCase();

    return this.options.filter((option) => option.branch_name.toLowerCase().indexOf(filterValue) === 0);
  }
  wishlist() {
    if (this.authenticationService.isAuthenticated()) {
      this.router.navigate(['/wishlist']);
    }
  }
  order() {
    this.router.navigate(['/myorders']);
  }
  mycart() {
    if (this.authenticationService.isAuthenticated()) {
      this.router.navigate(['/mycart']);
    }
  }

  searchFilter(id?: any, arr?: any) {
    for (let i = 0; i < this.homeFilterbtn.length; i++) {
      this.homeFilterbtn[i].isClicked = false;
      this.homeFilterbtn[arr].isClicked = true;
    }
  }

  changeLang(e: any) {
    this.selectedLang = e;
  }
  changeLoc(e: any) {
    this.selectLoc = e;
  }
  onKeyDownZipcode(event: any) {
    let zipcode = event.target.value.trim().toLowerCase();
    this.CommonService.getzipcode(zipcode);
    this.router.navigate(['/home']);
  }
  onChangeEvent(event: any) {
    let zipcode = event.target.value.trim().toLowerCase();
    this.CommonService.getzipcode(zipcode);
  }
  getStringValue(value: any): string {
    if (value != undefined) {
      return value.toString();
    }
  }
  changeHotel(event: any) {
    this.lati = this.getStringValue(this.latitude);
    this.longi = this.getStringValue(this.longitude);
    if (event != undefined) {
      if (event.length == 0) {
        this.CommonService.getbranchname('');
      }
    }
  }
  onSelectionChange(event: any) {
    let branch_name = event.option.value;

    if (branch_name['branch_name'].length == 0) {
      this.CommonService.getbranchname('');
      this.router.navigate(['home']);
    } else {
      this.CommonService.getbranchname(branch_name['branch_name']);
      this.router.navigate(['home']);
    }
  }

  // get username(): string | null {
  //   const credentials = this.credentialsService.credentials;
  //   return credentials ? credentials.role : null;
  // }
  get title(): string {
    return this.titleService.getTitle();
  }
  profile() {
    this.router.navigate(['/profile']);
  }
  home() {
    this.router.navigate(['/home']);
  }
}
