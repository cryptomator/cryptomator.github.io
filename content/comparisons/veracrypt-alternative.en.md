---
weight: 3

comparison:
  header: |
    <div class="inline-flex flex-col-reverse gap-2 items-center">
      <span class="font-normal">VeraCrypt</span>
      <img class="max-w-16 h-12" src="/img/comparisons/veracrypt-logo.svg">
    </div>
  footer: |
    <button class="btn btn-primary w-full px-2 md:px-4 py-1 md:py-1" disabled>Coming Soon</button>
  generalFeatures:
    cloudStorageOptimized: |
      <i class="fas fa-times-circle text-xl lg:text-2xl text-red-600"></i>
    cloudProviderAgnostic: |
      <div class="has-tooltip">
        <i class="relative fas fa-check-circle text-xl lg:text-2xl text-primary">
          <i class="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 fas fa-info-circle text-xs text-gray-600 bg-white border border-white rounded-full"></i>
        </i>
        <div class="tooltip tooltip-center rounded-sm shadow-md bg-white text-xs w-max max-w-3xs p-2">Technically compatible, but it is not useful without cloud storage optimization.</div>
      </div>
    unlimitedDevices: |
      <i class="fas fa-check-circle text-xl lg:text-2xl text-primary"></i>
    integratedSharing: |
      <i class="fas fa-times-circle text-xl lg:text-2xl text-red-600"></i>
    offlineKeyRecovery: |
      <i class="fas fa-check-circle text-xl lg:text-2xl text-primary"></i>
    syncConflictDetection: |
      <i class="fas fa-times-circle text-xl lg:text-2xl text-red-600"></i>
    crossPlatformSupport: |
      <div class="has-tooltip">
        <i class="relative fas fa-check-circle text-xl lg:text-2xl text-primary">
          <i class="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 fas fa-info-circle text-xs text-gray-600 bg-white border border-white rounded-full"></i>
        </i>
        <div class="tooltip tooltip-center rounded-sm shadow-md bg-white text-xs w-max max-w-3xs p-2">Mobile apps are not official.</div>
      </div>
  securityRelevantFeatures:
    fileContentEncryption: |
      <i class="fas fa-check-circle text-xl lg:text-2xl text-primary"></i>
    fileNameEncryption: |
      <i class="fas fa-check-circle text-xl lg:text-2xl text-primary"></i>
    fileAttributeEncryption: |
      <i class="fas fa-check-circle text-xl lg:text-2xl text-primary"></i>
    foss: |
      <i class="fas fa-check-circle text-xl lg:text-2xl text-primary"></i>
    directoryObfuscation: |
      <i class="fas fa-check-circle text-xl lg:text-2xl text-primary"></i>
    integrityProtection: |
      <i class="fas fa-times-circle text-xl lg:text-2xl text-red-600"></i>
    quantumResistant: |
      <i class="fas fa-check-circle text-xl lg:text-2xl text-primary"></i>
    auditedCryptography: |
      <i class="fas fa-check-circle text-xl lg:text-2xl text-primary"></i>
    memoryHardKDF: |
      <i class="fas fa-times-circle text-xl lg:text-2xl text-red-600"></i>
    shareKeys: |
      <i class="fas fa-times-circle text-xl lg:text-2xl text-red-600"></i>

_build:
  render: false
  list: local
---
