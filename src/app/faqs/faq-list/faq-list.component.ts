import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FaqService } from '../faq.service';
import { UserService } from '../../_services/user.service';
import { GoogleAnalyticsService } from 'src/app/google-analytics.service';

declare let $: any;

@Component({
  selector: 'app-faq-list',
  templateUrl: './faq-list.component.html',
  styleUrls: ['./faq-list.component.css']
})
export class FaqListComponent implements OnInit, AfterViewInit {
  faqListArr;
  sortedFaqListArr;
  defaultImage = 'assets/images/placeholder.png';
  selectedFaq;

  constructor(private router: Router, private faqService: FaqService, private mainService: UserService,
              private googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit() {
    this.getFaqList();
    this.mainService.setTitle('FAQ');
    this.googleAnalyticsService.pageView('FAQ');
  }

  ngAfterViewInit() {
    $(document).ready(function () {
      // Add minus icon for collapse element which is open by default
      $(".collapse.in").each(function () {
          $(this)
              .siblings(".panel-heading")
              .find(".fa")
              .addClass("rotate");
      });

      // Toggle plus minus icon on show hide of collapse element
      $(".collapse")
          .on("show.bs.collapse", function () {
              $(this)
                  .parent()
                  .find(".fa")
                  .addClass("rotate");
          })
          .on("hide.bs.collapse", function () {
              $(this)
                  .parent()
                  .find(".fa")
                  .removeClass("rotate");
          });
  });
  }

  // function to get faq list
  getFaqList() {
    this.faqService.faqList().subscribe(res => {
      if (res && res.code === 200) {
        this.faqListArr = res.result;
        this.sortedFaqListArr = res.result;
      } else {
        this.mainService.error(res.message);
      }
    }, error => {
      this.mainService.error(error);
    });
  }

  // function to search faq
  searchFaq(e) {
    const val = e.target.value;
    if (!val) {
      this.sortedFaqListArr = this.faqListArr;
      return;
    }
    this.sortedFaqListArr = this.faqListArr.filter(obj =>
      obj.title.toLowerCase().indexOf(val.toLowerCase()) >= 0
    );
  }

  toggleSelectedFaq(data) {
    if (data === this.selectedFaq) {
      this.selectedFaq = -1;
    } else {
      this.selectedFaq = data;
    }
  }

  sendEvent(type: string) {
    this.googleAnalyticsService.eventEmitter('FAQs', type);
  }

  handleClickFaq(val) {
    const newVal = `faq_${val}`;
    this.sendEvent(newVal);
  }

}
