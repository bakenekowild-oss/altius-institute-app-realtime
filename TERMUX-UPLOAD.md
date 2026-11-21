# Termux nunchi GitHub ki upload cheyyadam

## Mundhu Termux lo install cheyyandi
```
pkg update -y
pkg install git unzip -y
```

## Zip extract cheyyandi (Download folder lo unte)
```
cd ~/storage/downloads
unzip altius-institute-app-realtime.zip
cd altius-institute-app-realtime
```
Storage permission lekapothe: `termux-setup-storage` ani oka sari run cheyyandi.

## GitHub repo create cheyyandi (phone browser lo)
github.com > New repository > name: altius-institute-app > Public > Create.
Token kosam: GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic) > Generate new token > repo tick petti Generate. Aa token ni evariki ivvoddu, Termux lone vadandi.

## Termux lo upload commands (USERNAME, REPO peru marchandi)
```
git init
git add .
git commit -m "Altius Institute App realtime version"
git branch -M main
git remote add origin https://github.com/USERNAME/altius-institute-app.git
git push -u origin main
```
Password adigithe, password badulu mee GitHub Token paste cheyyandi.

## Tarvatha APK ela vasthundi
GitHub repo > Actions tab > Build APK > Run workflow > 3-5 min wait > Artifacts lo app-debug.apk download cheyyandi.
