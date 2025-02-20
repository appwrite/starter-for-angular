import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Client } from 'appwrite';
import { environment } from '../environments/environment';

interface Log {
  date: Date;
  method: string;
  path: string;
  status: number;
  response: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, DatePipe],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('detailsRef') detailsRef!: ElementRef;

  detailHeight: number = 0;
  logs: Log[] = [];
  status: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  showLogs: boolean = false;

  // Environment variables - you'll need to set these up in your environment.ts
  endpoint = environment.appwriteEndpoint;
  projectId = environment.appwriteProjectId;
  projectName = environment.appwriteProjectName;

  private client: Client;

  constructor() {
    this.client = new Client()
      .setEndpoint(environment.appwriteEndpoint)
      .setProject(environment.appwriteProjectId);
  }

  ngOnInit() {
    this.updateHeight();
    window.addEventListener('resize', () => this.updateHeight());
  }

  ngAfterViewInit() {
    this.updateHeight();
  }

  ngOnDestroy() {
    window.removeEventListener('resize', () => this.updateHeight());
  }

  updateHeight() {
    if (this.detailsRef?.nativeElement) {
      this.detailHeight = this.detailsRef.nativeElement.clientHeight;
    }
  }

  async sendPing() {
    if (this.status === 'loading') return;
    this.status = 'loading';

    try {
      const result = await this.client.ping();
      const log: Log = {
        date: new Date(),
        method: 'GET',
        path: '/v1/ping',
        status: 200,
        response: JSON.stringify(result),
      };
      this.logs = [log, ...this.logs];
      this.status = 'success';
    } catch (err: any) {
      const log: Log = {
        date: new Date(),
        method: 'GET',
        path: '/v1/ping',
        status: err instanceof Error ? 500 : err.code,
        response: err instanceof Error ? 'Something went wrong' : err.message,
      };
      this.logs = [log, ...this.logs];
      this.status = 'error';
    }
    this.showLogs = true;
  }
}
