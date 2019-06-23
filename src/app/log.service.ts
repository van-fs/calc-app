import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';


@Injectable()
/**
 * Service that handles logging to the UI, console and alert service.
 */
export class LogService {

  ref: MatSnackBarRef<SimpleSnackBar>;

  constructor(
    private snackBar: MatSnackBar
  ) {

  }

  /**
   * Closes the current snackbar in the UI.
   */
  dismiss() {
    if (this.ref) {
      this.ref.dismiss();
    }
  }

  /**
   * Log an event that is feedback to the user.
   * @param message The message to display in the UI
   * @param duration Time in ms to show the message
   */
  info(message: string, duration?: number): MatSnackBarRef<SimpleSnackBar> {
    const ref = this.snackBar.open(message, '', {
      duration,
    });

    // keep a ref for dismissal
    this.ref = ref;

    return ref;
  }

  /**
   * Log an event that is an error. An error message will be displayed to the user
   * from the snackbar.
   * @param message The message to display in the UI or a generic one if not provided
   * @param err An error object to be logged to the console
   */
  async error(message?: string, err?: any): Promise<MatSnackBarRef<SimpleSnackBar>> {
    if (!message) {
      message = 'An error has occurred.';
    }

    // send error to the user
    return this.snackBar.open(message, 'OK');
  }

}
