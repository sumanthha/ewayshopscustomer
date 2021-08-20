import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuService } from './menu.service';
import { CommonService } from '.././common/common.service';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  View_items: any;
  cartshow: boolean = false;
  delivery: any;
  quantity: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private MenuService: MenuService,
    private CommonService: CommonService,
    private toastr: ToastrService
  ) {}

  checkout() {
    this.router.navigate(['checkout']);
  }

  ngOnInit() {}
}
