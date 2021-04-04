'use strict'
const systemInfo = require('systeminformation')
const colors = require('colors')

const client = require('./client')

const pjson = require('./package.json')

colors.setTheme({
  database: 'grey',
  upload: 'grey',
  uploadsuccess: 'green',
  statustitle: 'cyan',
  statusmessage: 'brightCyan',
  successvalue: 'green',
  successname: 'brightGreen',
  success: 'brightGreen',
  printstatus: 'white',
  error: 'brightRed'
});

systemInfo.osInfo().then(async data => {
  console.log(`\n
  ${' __        __      '.red}${'_              '.yellow}${'___             '.magenta}${'____        _   '.cyan}
  ${' \\ \\      / /__   '.red}${'/ \\   _ __ ___ '.yellow}${'/ _ \\ _ __   ___'.magenta}${'| __ )  ___ | |_ '.cyan}
  ${'  \\ \\ /\\ / / _ \\ '.red}${'/ _ \\ | \'__/ _ \\'.yellow}${' | | | \'_ \\ / _ \\'.magenta}${'  _ \\ / _ \\| __|'.cyan}
  ${'   \\ V  V /  __/'.red}${'/ ___ \\| | |  __/'.yellow}${' |_| | | | |  __/'.magenta}${' |_) | (_) | |_ '.cyan}
  ${'    \\_/\\_/\\___/'.red}${'/_/   \\_\\_|  \\___|'.yellow}${'\\___/|_| |_|\\___|'.magenta}${'____/ \\___/ \\__|'.cyan}
  Version: ${(pjson.version).statustitle}
  Author: ${(pjson.author).statustitle}
  Homepage: ${(pjson.homepage).statustitle}
  OS: ${(data.platform).statustitle}
  Distro: ${(data.distro).statustitle}
  Kernel: ${( data.kernel).statustitle}
  Arch: ${(data.arch).statustitle}`)
  const ram = await systemInfo.mem()

  if (ram.free <= 4194304) {
    console.log(
      `${
      '     _  _____ _____ _____ _   _ _____ ___ ___  _   _ \n' +
      '    / \\|_   _|_   _| ____| \\ | |_   _|_ _/ _ \\| \\ | |\n' +
      '   / _ \\ | |   | | |  _| |  \\| | | |  | | | | |  \\| |\n' +
      '  / ___ \\| |   | | | |___| |\\  | | |  | | |_| | |\\  |\n' +
      ' /_/   \\_\\_|   |_| |_____|_| \\_| |_| |___\\___/|_| \\_|\n' +
      '                                                  \n' +
      'There might be to few free memory! WeAreOneBot need atleast 40MB RAM\n' +
      'Current free Ram: '.error}${(ram.used / (1024 ** 2)).toFixed(2)}MB`)
    process.exit(5)
  }

  await client.init()
})