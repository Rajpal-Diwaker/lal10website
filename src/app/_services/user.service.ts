import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from "rxjs";
import { ToastrService } from "ngx-toastr";
import * as FileSaver from "file-saver";
import Swal from "sweetalert2";
import { app_strings } from "../_constants/app_strings";
import * as XLSX from "xlsx";
const EXCEL_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const EXCEL_EXTENSION = ".xlsx";
import { NgxSpinnerService } from "ngx-spinner";
import { Title } from '@angular/platform-browser';
@Injectable({
  providedIn: "root",
})
export class UserService {
  base_url: string = environment.base_url;
  moduleName: string = "auth";
  userRoute: string = "api/v2/user";
  adminRoute: string = "api/v2/admin";
  webRoute: string = "api/v2/web";
  artisanRoute: string = "api/v2/artisan";
  userId: BehaviorSubject<any> = new BehaviorSubject(null);
  noauthHeaders = new HttpHeaders({ 'noauth': 'yes' });
  constructor(private http: HttpClient, private toastr: ToastrService, private spinner: NgxSpinnerService,
              private titleService: Title) {}

  success(msg) {
    if (!msg) return;
    this.toastr.success(msg);
  }

  error(msg) {
    if (!msg) return;
    this.toastr.error(msg);
  }

  warning(msg) {
    if (!msg) return;
    this.toastr.warning(msg);
  }

  info(msg) {
    if (!msg) return;
    this.toastr.info(msg);
  }

  setToken(token) {
    if(!token) return
    return localStorage.setItem("X-ID", token);
  }
  dta: BehaviorSubject<any> = new BehaviorSubject(null)
  setData(ob: object) {
    this.dta.next(ob)
  }
clearLocal(){
  return localStorage.clear();
}
  getData(): Observable<any> {
    return this.dta
  }

  getToken() {
    return localStorage.getItem("X-ID");
  }

  checkEmailVerified() {
    return localStorage.getItem('isEmailVerified');
  }

  // login(ob): Observable<any>{
  //   const uri = `${this.base_url}/${this.userRoute}/login`
  //   return this.http.post(uri, ob, {headers: this.noauthHeaders})
  // }

  isAuthenticated(): boolean {
    if (this.getToken()) {
      return true;
    } else {
      return false;
    }
  }

  getProductId() {
    return localStorage.getItem('redirectToProductX');
  }

  confirmPopup(texxt): Promise<any> {
    return Swal.fire({
      title: "Are you sure?",
      text: texxt,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    });
  }

  imagePreview(file){
    const reader = new FileReader();
    let previewPromise;

    previewPromise = new Promise((resolve, reject) => {
      reader.onload = (loaded: any) => {
        let preview = loaded.target.result
        resolve(preview)
      }

      reader.readAsDataURL(file)
    })

    return previewPromise;
    // let imageUrl;
    // let reader = new FileReader();
    // reader.readAsDataURL(file);
    // reader.onload = (_event) => {
    //     imageUrl = reader.result;
    //   };
    // return imageUrl;
  }

  setuserId(id) {
    this.userId.next(id);
  }

  getuserId(): BehaviorSubject<any> {
    return this.userId;
  }

  download(
    byteArrays,
    contentType = "application/vnd.ms-excel",
    FILENAME = "report"
  ) {
    const blob = new Blob(byteArrays, { type: contentType });
    const blobUrl = URL.createObjectURL(blob);

    FileSaver.saveAs(
      blobUrl,
      FILENAME + "_export_" + new Date().getTime() + app_strings.XLS_EXTENSION
    );
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ["data"],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  typeOfStore(): Observable<any> {
    const uri = `${this.base_url}/${this.webRoute}/typeOfStore`
    return this.http.get(uri, { headers: this.noauthHeaders })
  }

  login(ob): Observable<any> {
    const uri = `${this.base_url}/${this.webRoute}/login`
    return this.http.post(uri, ob, { headers: this.noauthHeaders })
  }

  signUp(ob): Observable<any> {
    const uri = `${this.base_url}/${this.webRoute}/signUp`
    return this.http.post(uri, ob, { headers: this.noauthHeaders })
  }
  forgotPassword(ob): Observable<any> {
    const uri = `${this.base_url}/${this.webRoute}/forgotPassword`
    return this.http.post(uri, ob, { headers: this.noauthHeaders })
  }
  checkEmail(ob): Observable<any> {
    const uri = `${this.base_url}/${this.webRoute}/checkemail`
    return this.http.post(uri, ob, { headers: this.noauthHeaders })
  }
  checkUserMobile(ob): Observable<any> {
    const uri = `${this.base_url}/${this.webRoute}/checkUserMobile`
    return this.http.post(uri, ob, { headers: this.noauthHeaders })
  }
  hearAboutUs(): Observable<any> {
    const uri = `${this.base_url}/${this.webRoute}/hearAboutUs`
    return this.http.get(uri, { headers: this.noauthHeaders })
  }

  products(ob = { type: 'products' }): Observable<any> {
    const uri = `${this.base_url}/${this.artisanRoute}/getManageListing?type=${ob.type}`
    return this.http.get(uri, { headers: this.noauthHeaders })
  }
  productsSignUp(ob = { type: 'products' }): Observable<any> {
    const uri = `${this.base_url}/${this.webRoute}/getAllsubcategory`
    return this.http.get(uri, { headers: this.noauthHeaders })
  }
  getCountryCodeJson() {
    return this.http.get('assets/json/countryCodes.json');
  }
  showSpinner() {
    this.spinner.show();
  }
  hideSpinner() {
    this.spinner.hide();
  }
  resetPassword(ob): Observable<any> {
    const uri = `${this.base_url}/${this.webRoute}/resetPassword`;
    return this.http.post(uri, ob, { headers: this.noauthHeaders });
  }
  verifyEmail(data): Observable<any> {
    const uri = `${this.base_url}/${this.webRoute}/userVerify?link=${data}`;
    return this.http.get(uri, { headers: this.noauthHeaders });
  }
  custImportant(): Observable<any> {
    const uri = `${this.base_url}/${this.webRoute}/getCustomerImportant`;
    return this.http.get(uri, { headers: this.noauthHeaders });
  }
  getCountry(): Observable<any> {
    const uri = `${this.base_url}/${this.webRoute}/getCountry`;
    return this.http.get(uri, { headers: this.noauthHeaders });
  }
  // function to subscribe email
  // subscribeEmail(payload): Observable<any> {
  //   const url = `${this.base_url}/${this.webRoute}/subscribe`;
  //   return this.http.post(url, payload, {headers: this.noauthHeaders});
  // }


  //  layout service
  mainCategory(): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/getCategory`;
    if (this.getToken()) {
      return this.http.get(url);
    } else {
      return this.http.get(url, {headers: this.noauthHeaders});
    }
  }

  // function to search product
  searchProduct(payload): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/masterSearch?search=${payload.term}`;
    return this.http.get(url, {headers: this.noauthHeaders});
  }

  // function to subscribe email
  subscribeEmail(payload): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/subscribe`;
    return this.http.post(url, payload, {headers: this.noauthHeaders});
  }

  // function to get catalogue
  catalogue(): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/getCatalogue`;
    return this.http.get(url, {headers: this.noauthHeaders});
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
}
