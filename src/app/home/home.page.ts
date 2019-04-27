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

  providers: Provider[] = [
    {
      subtitle: 'ionic native',
      title: 'Cordova Device Orientation Plugin',
      description: 'This plugin provides access to the device’s compass which detects the '
        + 'direction or heading that the device is pointed, typically from the top of the device.',
      availability: Availability.unchecked,
      value: this.devicemotion0$
    },
    {
      subtitle: 'cordova plugin',
      title: 'Navigator Compass',
      description: 'The access to the device compass in the Cordova plugin is provided by a global navigator.compass object.',
      availability: Availability.unchecked,
      value: this.devicemotion1$
    },
    {
      subtitle: 'window event',
      title: 'DeviceOrientation',
      description: 'Sent when the accelerometer detects a change to the orientation of the device.',
      availability: Availability.unchecked,
      value: this.devicemotion2$
    },
    {
      subtitle: 'ionic native',
      title: 'Cordova Device Motion Plugin',
      description: 'This plugin provides access to the device’s accelerometer which detects the change (delta) in movement '
        + 'relative to the current device orientation.',
      availability: Availability.unchecked,
      value: this.devicemotion3$
    },
    {
      subtitle: 'cordova plugin',
      title: 'Navigator Accelerometer',
      description: 'The access to the device accelerometer in the Cordova plugin is obtained by a global navigator.accelerometer object.',
      availability: Availability.unchecked,
      value: this.devicemotion4$
    },
    {
      subtitle: 'window event',
      title: 'DeviceMotion',
      description: 'Sent when a change in acceleration was added. It is different from the DeviceOrientationEvent because it is listening '
        + 'for changes in acceleration as opposed to orientation.',
      availability: Availability.unchecked,
      value: this.devicemotion5$
    }
  ];

  constructor(
    private deviceMotion: DeviceMotion,
    private deviceOrientation: DeviceOrientation,
    private platform: Platform,
    private eventManager: EventManager) { }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.addEventListener();
      this.checkAvailibility();
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
  }

  private addEventListener() {
    let nav: any;
    nav = window.navigator;

    /** DeviceOrientation: ionic native plugin */
    if (this.platform.is('cordova')) {
      this.deviceOrientation.watchHeading().subscribe((data: DeviceOrientationCompassHeading) => {
        const info = [];
        info.push(`magneticHeading: ${data.magneticHeading}`);
        info.push(`trueHeading: ${data.trueHeading}`);
        info.push(`headingAccuracy: ${data.headingAccuracy}`);
        info.push(`timestamp: ${data.timestamp}`);
        this.devicemotion0.next(info);
      });
    }

    /** DeviceOrientation: navigator object */
    if (nav && nav.compass) {
      nav.compass.watchHeading((data: any) => {
        const info = [];
        info.push(`magneticHeading: ${data.magneticHeading}`);
        info.push(`trueHeading: ${data.trueHeading}`);
        info.push(`headingAccuracy: ${data.headingAccuracy}`);
        info.push(`timestamp: ${data.timestamp}`);
        this.devicemotion1.next(info);
      }, () => { }, { frequency: 100 });
    }

    /** DeviceOrientation: window event */
    this.eventManager.addGlobalEventListener('window', 'deviceorientation', (event: DeviceOrientationEvent) => {
      // window.addEventListener('deviceorientation', (event: DeviceOrientationEvent) => {
      const info = [];
      info.push(`absolute: ${event.absolute}`);
      info.push(`alpha: ${event.alpha}`);
      info.push(`beta: ${event.beta}`);
      info.push(`gamma: ${event.gamma}`);
      this.devicemotion2.next(info);
    });

    /** DeviceMotion: ionic native plugin */
    if (this.platform.is('cordova')) {
      this.deviceMotion.watchAcceleration().subscribe((data: DeviceMotionAccelerationData) => {
        const info = [];
        info.push(`x: ${data.x}`);
        info.push(`y: ${data.y}`);
        info.push(`z: ${data.z}`);
        info.push(`timestamp: ${data.timestamp}`);
        this.devicemotion3.next(info);
      });
    }

    /** DeviceMotion: navigator object */
    if (nav && nav.accelerometer) {
      nav.accelerometer.watchAcceleration((data: any) => {
        const info = [];
        info.push(`x: ${data.x}`);
        info.push(`y: ${data.y}`);
        info.push(`z: ${data.z}`);
        info.push(`timestamp: ${data.timestamp}`);
        this.devicemotion4.next(info);
      }, () => { }, { frequency: 100 });
    }

    /** DeviceMotion: window event */
    this.eventManager.addGlobalEventListener('window', 'devicemotion', (event: DeviceMotionEvent) => {
      // window.addEventListener('devicemotion', (event: DeviceMotionEvent) => {
      const info = [];
      info.push(`x: ${event.acceleration.x}`);
      info.push(`y: ${event.acceleration.y}`);
      info.push(`z: ${event.acceleration.z}`);
      this.devicemotion5.next(info);
    });

    /** compassneedscalibration: window event */
    window.addEventListener('compassneedscalibration', (event) => { event.preventDefault(); }, true);
  }
}
