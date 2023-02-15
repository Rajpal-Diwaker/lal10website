import { Component, OnInit } from '@angular/core';
import { PageService } from '../page.service';
import { UserService } from '../../_services/user.service';
import { GoogleAnalyticsService } from 'src/app/google-analytics.service';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit {
  blogsArr;
  sortedBlogsArr;
  defaultImage = 'assets/images/placeholder.png';
  tendingBlogsArr;

  constructor(private pageService: PageService, private mainService: UserService,
              private googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit() {
    this.mainService.setTitle('Lal10 Blogs');
    this.googleAnalyticsService.pageView('Lal10 Blogs');
    this.getBlogs();
  }

  getBlogs() {
    this.pageService.blogs().subscribe(res => {
      if (res && res.code === 200) {
        this.blogsArr = res.result;
        this.tendingBlogsArr = res.tranding;
        this.sortedBlogsArr = res.result;
      } else {
        this.mainService.error(res.message);
      }
    }, error => {
      this.mainService.error(error);
    });
  }

  openBlogs(url) {
    window.open(url, '_blank');
  }

  // function to search blogs
  searchBlogs(e) {
    const val = e.target.value;
    if (!val) {
      this.sortedBlogsArr = this.blogsArr;
      return;
    }
    this.sortedBlogsArr = this.blogsArr.filter(obj =>
      obj.title.toLowerCase().indexOf(val.toLowerCase()) >= 0
    );
  }

}
