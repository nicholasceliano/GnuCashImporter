module.exports = {
    pluginOptions: {
    electronBuilder: {
        builderOptions: {
            productName: "GnuCash Importer",
            appId: 'GnuCashImporter',
            win: {
                "target": [
                    "nsis"
                ],
              icon: 'src/assets/logo.png',
              "requestedExecutionLevel": "requireAdministrator"
            },
            "nsis": {
                "installerIcon": "public/logo.ico",
                "uninstallerIcon": "public/logo.ico",
                "uninstallDisplayName": "CPU Monitor",
                "oneClick": false,
                "allowToChangeInstallationDirectory": true
            }
        },
    },
},
}