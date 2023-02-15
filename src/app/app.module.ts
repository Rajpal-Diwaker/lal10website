import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpInterceptorService } from './_interceptors/http.interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './_interceptors/auth.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedService } from './_services/shared.service';
import { NgxSpinnerModule } from "ngx-spinner";
import { DatediffPipe } from './_pipes/datediff.pipe';
import { GoogleAnalyticsService } from './google-analytics.service';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { LazyImgDirective } from './_directives/lazyImage.directive';

@NgModule({
  declarations: [
    AppComponent,
    DatediffPipe,
    HeaderComponent,
    FooterComponent,
    LazyImgDirective
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    // LayoutModule,
    NgxSpinnerModule,
    AutocompleteLibModule,
    ReactiveFormsModule
  ],
  providers: [ {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true},
               {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
              //  {provide: LocationStrategy, useClass: HashLocationStrategy},
               SharedService, GoogleAnalyticsService, Title
                // {provide: LocationStrategy, useClass: PathLocationStrategy}
              ],
  bootstrap: [AppComponent]
})
export class AppModule { }
