# Quick guide
`npm run install` - will install the needed dependencies. it'll also find your dota 2 installation and symlink the project there, so you can edit the project here and dota will automatically see the changes.
`npm run dev` - starts a process which will update the .js files whenever you change .ts files. Never edit the js files directly, update ts files and js files will update automatically (when you have `npm run dev` running). You can also run `npm run build` to compile ts files to js manually
`npm run launch` - launches dota 2 tools

Just always remember to have `npm run dev` running. Otherwise, your changes to TS files will not have any effect.

# From scratch
```sh
git clone <repo url>
cd <repo>
npm run install
npm run launch
npm run dev # keep this terminal running in the background
# build maps in Hammer
# dota_launch_custom_game trollnelves2 classic
# edit TS files as needed
```


