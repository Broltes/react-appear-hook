const readline = require('readline');
const util = require('util');
const exec = require('child_process').execFileSync;

async function ask(question) {
  const readLineFromShell = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve, reject) => {
    readLineFromShell.question(question, answer => {
      resolve(answer);
      readLineFromShell.close();
    });
  });
}

async function main() {
  const inputVer = await ask(
    `请输入发布版本号：`
  );
  exec('npm', ['version', inputVer]);

  const releaseVer = require('../package.json').version;
  console.log(`正在发布 ${releaseVer} ... \n\r`);

  exec('rm', ['-rf', 'lib']);
  exec('rm', ['-rf', 'es']);
  exec('npm', ['run', 'build'], { stdio: 'inherit' });
  exec('npm', [
    'publish',
    '--tag',
    /-/.test(releaseVer) ? 'beta' : 'latest'
  ]);
  exec('git', ['push', '--follow-tags']);
}
try {
  main();
} catch (e) {
  console.error(e);
}
