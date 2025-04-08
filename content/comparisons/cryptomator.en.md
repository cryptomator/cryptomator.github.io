---
weight: 1

comparison:
  header: |
    <div class="inline-flex flex-col-reverse gap-2 items-center">
      <span class="font-headline font-bold text-primary">CRYPTOMATOR</span>
      <img class="max-w-16 h-12" src="/img/logo.svg">
    </div>
  footer: |
    <a class="btn btn-primary w-full px-2 md:px-4 py-1 md:py-1" href="/pricing/">Pricing</a>
  generalFeatures:
    cloudStorageOptimized: |
      <i class="fas fa-check-circle text-xl lg:text-2xl text-primary"></i>
    cloudProviderAgnostic: |
      <i class="fas fa-check-circle text-xl lg:text-2xl text-primary"></i>
    unlimitedDevices: |
      <i class="fas fa-check-circle text-xl lg:text-2xl text-primary"></i>
    integratedSharing: |
      <div class="has-tooltip">
        <i class="relative fas fa-times-circle text-xl lg:text-2xl text-red-600">
          <i class="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 fas fa-info-circle text-xs text-gray-600 bg-white border border-white rounded-full"></i>
        </i>
        <div class="tooltip tooltip-center rounded-sm shadow-md bg-white text-xs w-max max-w-3xs p-2">vaults can only be shared as a whole</div>
      </div>
    offlineKeyRecovery: |
      <i class="fas fa-check-circle text-xl lg:text-2xl text-primary"></i>
    syncConflictDetection: |
      <i class="fas fa-check-circle text-xl lg:text-2xl text-primary"></i>
    crossPlatformSupport: |
      <i class="fas fa-check-circle text-xl lg:text-2xl text-primary"></i>
  securityRelevantFeatures:
    fileContentEncryption: |
      <i class="fas fa-check-circle text-xl lg:text-2xl text-primary"></i>
    fileNameEncryption: |
      <i class="fas fa-check-circle text-xl lg:text-2xl text-primary"></i>
    fileAttributeEncryption: |
      <div class="has-tooltip">
        <i class="relative fas fa-times-circle text-xl lg:text-2xl text-red-600">
          <i class="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 fas fa-info-circle text-xs text-gray-600 bg-white border border-white rounded-full"></i>
        </i>
        <div class="tooltip tooltip-center rounded-sm shadow-md bg-white text-xs w-max max-w-3xs p-2">planned</div>
      </div>
    foss: |
      <i class="fas fa-check-circle text-xl lg:text-2xl text-primary"></i>
    directoryObfuscation: |
      <i class="fas fa-check-circle text-xl lg:text-2xl text-primary"></i>
    integrityProtection: |
      <i class="fas fa-check-circle text-xl lg:text-2xl text-primary"></i>
    quantumResistant: |
      <div class="flex items-center justify-center divide-x divide-gray-400">
        <div class="px-4">
          <div class="has-tooltip">
            <i class="relative fas fa-check-circle text-xl lg:text-2xl text-primary">
              <i class="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 fas fa-info-circle text-xs text-gray-600 bg-white border border-white rounded-full"></i>
            </i>
            <div class="tooltip tooltip-center rounded-sm shadow-md bg-white text-xs w-max max-w-3xs p-2">Cryptomator uses symmetric encryption AES-GCM and AES-SIV</div>
          </div>
        </div>
        <div class="px-4">
          <div class="has-tooltip">
            <i class="relative fas fa-times-circle text-xl lg:text-2xl text-red-600">
              <i class="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 fas fa-info-circle text-xs text-gray-600 bg-white border border-white rounded-full"></i>
            </i>
            <div class="tooltip tooltip-center rounded-sm shadow-md bg-white text-xs w-max max-w-3xs p-2">Cryptomator Hub uses asymmetric encryption ECDH and ECDSA; planned to switch to quantum-resistant algorithms as soon as standardization matures</div>
          </div>
        </div>
      </div>
    auditedCryptography: |
      <i class="fas fa-check-circle text-xl lg:text-2xl text-primary"></i>
    memoryHardKDF: |
      <i class="fas fa-check-circle text-xl lg:text-2xl text-primary"></i>
    shareKeys: |
      <div class="flex items-center justify-center divide-x divide-gray-400">
        <div class="px-4">
          <div class="has-tooltip">
            <i class="relative fas fa-times-circle text-xl lg:text-2xl text-red-600">
              <i class="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 fas fa-info-circle text-xs text-gray-600 bg-white border border-white rounded-full"></i>
            </i>
            <div class="tooltip tooltip-center rounded-sm shadow-md bg-white text-xs w-max max-w-3xs p-2">with Cryptomator</div>
          </div>
        </div>
        <div class="px-4">
          <div class="has-tooltip">
            <i class="relative fas fa-check-circle text-xl lg:text-2xl text-primary">
              <i class="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 fas fa-info-circle text-xs text-gray-600 bg-white border border-white rounded-full"></i>
            </i>
            <div class="tooltip tooltip-center rounded-sm shadow-md bg-white text-xs w-max max-w-3xs p-2">with Cryptomator Hub</div>
          </div>
        </div>
      </div>

_build:
  render: false
  list: local
---
