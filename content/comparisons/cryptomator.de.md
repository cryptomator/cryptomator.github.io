---
weight: 1

comparison:
  header: |
    <div class="inline-flex flex-col-reverse gap-2 items-center">
      <span class="font-headline font-bold text-primary">CRYPTOMATOR</span>
      <img class="max-w-16 h-12" src="/img/logo.svg">
    </div>
  footer: |
    <a class="btn btn-primary w-full px-2 md:px-4 py-1 md:py-1" href="/de/pricing/" data-umami-event="comparisons-cryptomator-cta">Preise</a>
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
        <div class="tooltip tooltip-center rounded-sm shadow-md bg-white text-xs w-max max-w-3xs p-2">Tresore lassen sich nur als Ganzes teilen.</div>
      </div>
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
        <div class="tooltip tooltip-center rounded-sm shadow-md bg-white text-xs w-max max-w-3xs p-2">In Planung, aber nicht auf der aktuellen Roadmap.</div>
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
            <div class="tooltip tooltip-center rounded-sm shadow-md bg-white text-xs w-max max-w-3xs p-2">Cryptomator verwendet symmetrische Verschlüsselung AES-GCM und AES-SIV.</div>
          </div>
        </div>
        <div class="px-4">
          <div class="has-tooltip">
            <i class="relative fas fa-times-circle text-xl lg:text-2xl text-red-600">
              <i class="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 fas fa-info-circle text-xs text-gray-600 bg-white border border-white rounded-full"></i>
            </i>
            <div class="tooltip tooltip-center rounded-sm shadow-md bg-white text-xs w-max max-w-3xs p-2">Cryptomator Hub verwendet asymmetrische Verschlüsselung ECDH und ECDSA; Umstieg auf quantenresistente Algorithmen in Planung, sobald die Standardisierung ausgreift ist.</div>
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
            <div class="tooltip tooltip-center rounded-sm shadow-md bg-white text-xs w-max max-w-3xs p-2">Die gemeinsame Nutzung passwortbasierter Cryptomator-Tresore wird nicht empfohlen.</div>
          </div>
        </div>
        <div class="px-4">
          <div class="has-tooltip">
            <i class="relative fas fa-check-circle text-xl lg:text-2xl text-primary">
              <i class="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 fas fa-info-circle text-xs text-gray-600 bg-white border border-white rounded-full"></i>
            </i>
            <div class="tooltip tooltip-center rounded-sm shadow-md bg-white text-xs w-max max-w-3xs p-2">Cryptomator Hub ermöglicht die sichere gemeinsame Nutzung von Tresoren ohne Weitergabe von Passwörtern.</div>
          </div>
        </div>
      </div>

build:
  render: false
  list: local
---
