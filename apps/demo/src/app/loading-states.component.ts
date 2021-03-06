import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-states',
  template: `
    <susp-default-templates>
      <ng-template suspLoading>
        <div
          class="flex justify-center items-center space-x-1 text-sm text-gray-700 h-full w-full"
        >
          <svg
            fill="none"
            class="w-6 h-6 animate-spin"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clip-rule="evenodd"
              d="M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z"
              fill="currentColor"
              fill-rule="evenodd"
            />
          </svg>

          <div>Loading ...</div>
        </div>
      </ng-template>
      <ng-template suspEmpty>
        <div
          class="flex justify-center items-center space-x-1 text-sm text-gray-700 h-full w-full"
        >
          This is my global empty state
        </div>
      </ng-template>
      <ng-template suspError>
        <div
          class="flex justify-center items-center space-x-1 text-sm text-gray-700 h-full w-full"
        >
          This is my global error state
        </div>
      </ng-template>
    </susp-default-templates>
  `,
})
export class LoadingStatesComponent {}
