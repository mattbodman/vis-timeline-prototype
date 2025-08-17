import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-custom-group-template',
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="custom-group-container">
      <div class="group-header">
        <span class="group-title">
          <mat-icon class="header-icon">business</mat-icon>
          {{ groupContent() }}
        </span>
        <span class="group-id-badge">ID: {{ groupId() }}</span>
      </div>
      <div class="group-actions">
        <button 
          mat-raised-button
          color="primary"
          (click)="onPrimaryAction()"
          [attr.data-group]="groupId()"
          class="custom-action-btn"
        >
          <mat-icon>add</mat-icon>
          Create
        </button>
        <button 
          mat-raised-button
          color="accent"
          (click)="onSecondaryAction()"
          [attr.data-group]="groupId()"
          class="custom-action-btn"
        >
          <mat-icon>visibility</mat-icon>
          View
        </button>
        <button 
          mat-raised-button
          color="warn"
          (click)="onTertiaryAction()"
          [attr.data-group]="groupId()"
          class="custom-action-btn"
        >
          <mat-icon>settings</mat-icon>
          Settings
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .custom-group-container {
        display: flex;
        flex-direction: column;
        padding: 8px 12px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 8px;
        color: white;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        min-width: 200px;
      }

      .group-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .group-title {
        display: flex;
        align-items: center;
        gap: 6px;
        font-weight: 600;
        font-size: 14px;
        color: #ffffff;
      }

      .header-icon {
        font-size: 18px !important;
        width: 18px !important;
        height: 18px !important;
        color: #ffffff !important;
      }

      .group-id-badge {
        background: rgba(255, 255, 255, 0.2);
        padding: 2px 6px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 500;
      }

      .group-actions {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }

      .custom-action-btn {
        flex: 1;
        min-width: 80px;
        font-size: 11px !important;
        padding: 4px 8px !important;
        height: auto !important;
        line-height: 1.2 !important;
      }

      .custom-action-btn mat-icon {
        font-size: 14px !important;
        width: 14px !important;
        height: 14px !important;
        margin-right: 4px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomGroupTemplateComponent {
  readonly groupId = input.required<string | number>();
  readonly groupContent = input.required<string>();

  onPrimaryAction(): void {
    console.log('🌟 Custom template PRIMARY action clicked for group:', this.groupId());
  }

  onSecondaryAction(): void {
    console.log('📈 Custom template SECONDARY action clicked for group:', this.groupId());
  }

  onTertiaryAction(): void {
    console.log('🔧 Custom template TERTIARY action clicked for group:', this.groupId());
  }
}