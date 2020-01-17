/* eslint-env serviceworker */
/* global fetch */

const dataCacheName = 'podcasts-data_{{DEVMODE}}'
const cacheName = 'podcasts_{{DEVMODE}}'
const episodesCacheName = 'qit-episodes'
const cacheNames = [cacheName, dataCacheName, episodesCacheName]

const filesToCache = ['/', '/index.html', '/manifest.json', '/favicon.ico']

const getAllFilesToCache = async filesToCache => {
  let files

  try {
    files = await fetch('asset-manifest.json').then(data => data.json())
  } catch (error) {
    console.log(`Asset Manifest Error: ${error}`)
  }

  const filepaths = files ? Object.values(files) : []
  return [...filepaths, ...filesToCache]
}

self.addEventListener('install', function (e) {
  console.log('[ServiceWorker] Install')
  e.waitUntil(
    getAllFilesToCache(filesToCache).then(files => {
      caches.open(cacheName).then(cache => {
        console.log('[ServiceWorker] Caching app shell')
        cache.addAll(files)
        return self.skipWaiting()
      })
    })
  )
})

self.addEventListener('activate', function (e) {
  console.log('[ServiceWorker] Activate')
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          if (!cacheNames.includes(key)) {
            console.log('[ServiceWorker] Removing old cache', key)
            return caches.delete(key)
          }
        })
      )
    })
  )
  return self.clients.claim()
})

self.addEventListener('fetch', function (e) {
  console.log('[Service Worker] Fetch', e.request.url)
  // TODO last search!
  e.respondWith(
    caches.match(e.request).then(function (response) {
      return (
        response ||
        fetch(e.request).catch(e => {
          console.log(`Service worker error: ${e}`)
        })
      )
    })
  )
})
