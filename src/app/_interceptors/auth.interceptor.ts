import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Router } from "@angular/router";
import { UserService } from '../_services/user.service';
import { app_strings } from '../_constants/app_strings';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private userService: UserService, private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const secureReq = req.clone({
            headers: new HttpHeaders ({

            })
        });

        const token = this.userService.getToken()
        const headerObj = {

            'Authorization': token
        }

        // if(req.headers.get('multiparty')){
        //     delete headerObj['Content-Type']
        // }

        if (req.headers.get('noauth')){
            return next.handle(secureReq)
        }
        else {

            const clonedreq = req.clone({
                headers: new HttpHeaders (headerObj)
            });

            return next.handle(clonedreq).pipe(
                tap(
                    event => { },
                    err => {

                        if(err.error.message.length > 100){
                            this.userService.error(app_strings.ERROR_OCCURRED)
                            return
                        }
                        this.userService.error(err.error.message || app_strings.ERROR_OCCURRED)
                    }
                )
            );
        }
    }
}
