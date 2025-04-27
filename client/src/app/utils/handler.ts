import { HttpErrorResponse } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";

export const toPromise = <T>(observable: Observable<T>): Promise<T> => new Promise((resolve, reject) => {
    observable.pipe(
        catchError((response => {
            reject(response.error);
            return catchErrorHandler(response);
        }))
    ).subscribe(resolve);
});

export const catchErrorHandler = ((httpErrorResponse: HttpErrorResponse) => {
    // let router = inject(Router);
    // let cookie = inject(CookieService);
    if (httpErrorResponse.status === 401) {

    } else {
        if (typeof (httpErrorResponse.error) === 'string') {
            (httpErrorResponse.error)
        } else if (typeof (httpErrorResponse.error) === 'object') {
            if (httpErrorResponse?.error?.errorMessage) {
                let messages: string[] = httpErrorResponse.error.errorMessage;
                let concat = messages.join("<br>");
                alert(concat);
            }
        } else {
            alert('Http failure response')
        }
    }

    return throwError(httpErrorResponse);
});
