import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation/ngx';
import { Platform } from '@ionic/angular';
import { EventManager } from '@angular/platform-browser';

enum Availability {
  unchecked,
  available,
  notAvailable
}


interface Provider {
  index: number;
  subtitle: string;
  title: string;
  description: string;
  availability: Availability;
  value: Observable<any>;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  private devicemotion0: BehaviorSubject<string[]> = new BehaviorSubject(['-']);
  devicemotion0$: Observable<string[]> = this.devicemotion0.asObservable();

  private devicemotion1: BehaviorSubject<string[]> = new BehaviorSubject(['-']);
  devicemotion1$: Observable<string[]> = this.devicemotion1.asObservable();

  private devicemotion2: BehaviorSubject<string[]> = new BehaviorSubject(['-']);
  devicemotion2$: Observable<string[]> = this.devicemotion2.asObservable();

  private devicemotion3: BehaviorSubject<string[]> = new BehaviorSubject(['-']);
  devicemotion3$: Observable<string[]> = this.devicemotion3.asObservable();

  private devicemotion4: BehaviorSubject<string[]> = new BehaviorSubject(['-']);
  devicemotion4$: Observable<string[]> = this.devicemotion4.asObservable();

  private devicemotion5: BehaviorSubject<string[]> = new BehaviorSubject(['-']);
  devicemotion5$: Observable<string[]> = this.devicemotion5.asObservable();

  private devicemotion6: BehaviorSubject<string[]> = new BehaviorSubject(['-']);
  devicemotion6$: Observable<string[]> = this.devicemotion6.asObservable();

  providers: Provider[] = [
    {
      index: 0,
      subtitle: 'ionic native',
      title: 'Cordova Device Orientation Plugin',
      description: 'This plugin provides access to the device’s compass which detects the '
        + 'direction or heading that the device is pointed, typically from the top of the device.',
      availability: Availability.unchecked,
      value: this.devicemotion0$
    },
    {
      index: 1,
      subtitle: 'cordova plugin',
      title: 'Navigator Compass',
      description: 'The access to the device compass in the Cordova plugin is provided by a global navigator.compass object.',
      availability: Availability.unchecked,
      value: this.devicemotion1$
    },
    {
      index: 2,
      subtitle: 'window event',
      title: 'DeviceOrientation',
      description: 'Sent when the accelerometer detects a change to the orientation of the device.',
      availability: Availability.unchecked,
      value: this.devicemotion2$
    },
    {
      index: 3,
      subtitle: 'ionic native',
      title: 'Cordova Device Motion Plugin',
      description: 'This plugin provides access to the device’s accelerometer which detects the change (delta) in movement '
        + 'relative to the current device orientation.',
      availability: Availability.unchecked,
      value: this.devicemotion3$
    },
    {
      index: 4,
      subtitle: 'cordova plugin',
      title: 'Navigator Accelerometer',
      description: 'The access to the device accelerometer in the Cordova plugin is obtained by a global navigator.accelerometer object.',
      availability: Availability.unchecked,
      value: this.devicemotion4$
    },
    {
      index: 5,
      subtitle: 'window event',
      title: 'DeviceMotion',
      description: 'Sent when a change in acceleration was added. It is different from the DeviceOrientationEvent because it is listening '
        + 'for changes in acceleration as opposed to orientation.',
      availability: Availability.unchecked,
      value: this.devicemotion5$
    },
    {
      index: 6,
      subtitle: 'Web API',
      title: 'LinearAccelerationSensor',
      description: 'To use this sensor, the user must grant permission to the "accelerometer" device sensor through the Permissions API.',
      availability: Availability.unchecked,
      value: this.devicemotion6$
    }
  ];

  constructor(
    private deviceMotion: DeviceMotion,
    private deviceOrientation: DeviceOrientation,
    private platform: Platform,
    private eventManager: EventManager) { }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.checkAvailibility();
      this.addEventListener();
    });
  }

  checkAvailibility() {
    let nav: any;
    nav = window.navigator;

    if (nav && nav.compass) { this.providers[1].availability = Availability.available; } else {
      this.providers[1].availability = Availability.notAvailable;
    }

    if (nav && nav.accelerometer) { this.providers[4].availability = Availability.available; } else {
      this.providers[4].availability = Availability.notAvailable;
    }

    if ((window as any).DeviceOrientationEvent) { this.providers[2].availability = Availability.available; } else {
      this.providers[2].availability = Availability.notAvailable;
    }

    if ((window as any).DeviceMotionEvent) { this.providers[5].availability = Availability.available; } else {
      this.providers[5].availability = Availability.notAvailable;
    }

    if (this.platform.is('cordova')) {
      this.providers[0].availability = Availability.available;
      this.providers[3].availability = Availability.available;
    } else {
      this.providers[0].availability = Availability.notAvailable;
      this.providers[3].availability = Availability.notAvailable;
    }

    if ('LinearAccelerationSensor' in window) { this.providers[6].availability = Availability.available; } else {
      this.providers[6].availability = Availability.notAvailable;
    }
  }

  private addEventListener() {
    let nav: any;
    nav = window.navigator;

    /** DeviceOrientation: ionic native plugin */
    if (this.platform.is('cordova')) {
      this.deviceOrientation.watchHeading().subscribe((data: DeviceOrientationCompassHeading) => {
        this.headingHandler(data, this.devicemotion0);
      });
    }

    /** DeviceOrientation: navigator object */
    if (nav && nav.compass) {
      nav.compass.watchHeading((data: any) => { this.headingHandler(data, this.devicemotion1); }, () => { }, { frequency: 100 });
    }

    /** DeviceOrientation: window event */
    if ('DeviceOrientationEvent' in window) {
      this.eventManager.addGlobalEventListener('window', 'deviceorientation', (event: DeviceOrientationEvent) => {
        // window.addEventListener('deviceorientation', (event: DeviceOrientationEvent) => {
        this.rotationHandler(event, this.devicemotion2);
      });
    }

    /** DeviceMotion: ionic native plugin */
    if (this.platform.is('cordova')) {
      this.deviceMotion.watchAcceleration({ frequency: 100 }).subscribe((data: DeviceMotionAccelerationData) => {
        this.accelerationHandler(data, this.devicemotion3);
      });
    }

    /** DeviceMotion: navigator object */
    if (nav && nav.accelerometer) {
      nav.accelerometer.watchAcceleration((data: any) => {
        this.accelerationHandler(data, this.devicemotion4);
      }, () => { }, { frequency: 100 });
    }

    /** DeviceMotion: window event */
    if ('DeviceMotionEvent' in window) {
      this.eventManager.addGlobalEventListener('window', 'devicemotion', (event: DeviceMotionEvent) => {
        // window.addEventListener('devicemotion', (event: DeviceMotionEvent) => {
        this.accelerationHandler(event.acceleration, this.devicemotion5);
      });
    }

    /** LinearAccelerationSensor: Web API */
    if ('LinearAccelerationSensor' in window) {
      const accelerometer = new LinearAccelerationSensor();
      accelerometer.addEventListener('reading', e => { this.accelerationHandler(accelerometer, this.devicemotion6); });
      accelerometer.start();
    }

    /** compassneedscalibration: window event */
    window.addEventListener('compassneedscalibration', (event) => { event.preventDefault(); }, true);
  }

  private accelerationHandler(acceleration, subject) {
    let info;
    const xyz = '[X, Y, Z]';
    info = xyz.replace('X', acceleration.x && acceleration.x.toFixed(3));
    info = info.replace('Y', acceleration.y && acceleration.y.toFixed(3));
    info = info.replace('Z', acceleration.z && acceleration.z.toFixed(3));
    subject.next(info);
  }

  private rotationHandler(rotation, subject) {
    let info;
    const xyz = '[X, Y, Z]';
    info = xyz.replace('X', rotation.alpha && rotation.alpha.toFixed(3));
    info = info.replace('Y', rotation.beta && rotation.beta.toFixed(3));
    info = info.replace('Z', rotation.gamma && rotation.gamma.toFixed(3));
    subject.next(info);
  }

  private headingHandler(heading, subject) {
    let info;
    const xyz = '[X, Y, Z]';
    info = xyz.replace('X', heading.magneticHeading && heading.magneticHeading.toFixed(3));
    info = info.replace('Y', heading.trueHeading && heading.trueHeading.toFixed(3));
    info = info.replace('Z', heading.headingAccuracy && heading.headingAccuracy.toFixed(3));
    subject.next(info);
  }
}
