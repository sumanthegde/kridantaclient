chrome:
pwd === kridantaclient
root/js/background.js
  is_prod = true
root/manifest.json
  version++
  ensure chrome (manifest v3, service_worker)
/usr/bin/zip -vr kridantaclient_2_0_x.zip root -X

firefox:
pwd === root
js/background.js
  is_prod = true
manifest.json
  version++
  ensure firefox (manifest v2, scripts[], geckoid) // consult ../manifest.firefox.json
/usr/bin/zip -vr kridantaclient_firefox_2_0_x.zip ./* -X
