---
weight: 5

comparison:
  header: |
    <div class="inline-flex flex-col-reverse gap-2 items-center">
      <span class="font-normal">AxCrypt</span>
      <img class="max-w-16 h-12" src="/img/comparisons/axcrypt-logo.svg" aria-hidden="true">
    </div>
  footer: |
    <button class="btn btn-primary w-full px-2 md:px-4 py-1 md:py-1" disabled>Coming Soon</button>
  generalFeatures:
    cloudStorageOptimized: |
      <i class="fa-solid fa-check-circle text-xl lg:text-2xl text-primary"></i>
    cloudProviderAgnostic: |
      <i class="fa-solid fa-check-circle text-xl lg:text-2xl text-primary"></i>
    unlimitedDevices: |
      <i class="fa-solid fa-check-circle text-xl lg:text-2xl text-primary"></i>
    integratedSharing: |
      <i class="fa-solid fa-check-circle text-xl lg:text-2xl text-primary"></i>
    syncConflictDetection: |
      <div class="has-tooltip">
        <i class="relative fa-solid fa-minus-circle text-xl lg:text-2xl text-gray-600">
          <i class="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 fa-solid fa-info-circle text-xs text-gray-600 bg-white border border-white rounded-full"></i>
        </i>
        <div class="tooltip tooltip-center rounded-sm shadow-md bg-white text-xs w-max max-w-3xs p-2">Nicht anwendbar ohne Dateinamen-Verschlüsselung.</div>
      </div>
    crossPlatformSupport: |
      <div class="has-tooltip">
        <i class="relative fa-solid fa-times-circle text-xl lg:text-2xl text-red-600">
          <i class="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 fa-solid fa-info-circle text-xs text-gray-600 bg-white border border-white rounded-full"></i>
        </i>
        <div class="tooltip tooltip-center rounded-sm shadow-md bg-white text-xs w-max max-w-3xs p-2">Kein Linux.</div>
      </div>
  securityRelevantFeatures:
    fileContentEncryption: |
      <i class="fa-solid fa-check-circle text-xl lg:text-2xl text-primary"></i>
    fileNameEncryption: |
      <i class="fa-solid fa-times-circle text-xl lg:text-2xl text-red-600"></i>
    fileAttributeEncryption: |
      <i class="fa-solid fa-times-circle text-xl lg:text-2xl text-red-600"></i>
    foss: |
      <i class="fa-solid fa-times-circle text-xl lg:text-2xl text-red-600"></i>
    directoryObfuscation: |
      <i class="fa-solid fa-times-circle text-xl lg:text-2xl text-red-600"></i>
    integrityProtection: |
      <i class="fa-solid fa-check-circle text-xl lg:text-2xl text-primary"></i>
    quantumResistant: |
      <div class="flex items-center justify-center divide-x divide-gray-400">
        <div class="px-4">
          <div class="has-tooltip">
            <i class="relative fa-solid fa-check-circle text-xl lg:text-2xl text-primary">
              <i class="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 fa-solid fa-info-circle text-xs text-gray-600 bg-white border border-white rounded-full"></i>
            </i>
            <div class="tooltip tooltip-center rounded-sm shadow-md bg-white text-xs w-max max-w-3xs p-2">Verwendet symmetrische Verschlüsselung AES.</div>
          </div>
        </div>
        <div class="px-4">
          <div class="has-tooltip">
            <i class="relative fa-solid fa-times-circle text-xl lg:text-2xl text-red-600">
              <i class="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 fa-solid fa-info-circle text-xs text-gray-600 bg-white border border-white rounded-full"></i>
            </i>
            <div class="tooltip tooltip-center rounded-sm shadow-md bg-white text-xs w-max max-w-3xs p-2">Verwendet asymmetrische Verschlüsselung RSA.</div>
          </div>
        </div>
      </div>
    auditedCryptography: |
      <i class="fa-solid fa-times-circle text-xl lg:text-2xl text-red-600"></i>
    memoryHardKDF: |
      <i class="fa-solid fa-times-circle text-xl lg:text-2xl text-red-600"></i>
    shareKeys: |
      <i class="fa-solid fa-check-circle text-xl lg:text-2xl text-primary"></i>

build:
  render: false
  list: local
---
