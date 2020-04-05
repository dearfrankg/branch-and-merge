const shell = require("shelljs");

// shell.config.verbose = true;

if (!shell.which("git")) {
  shell.echo("Sorry, this script requires git");
  shell.exit(1);
}

const run = (cmd, options = {}) => shell.exec(cmd, { silent: false, ...options }).stdout;

const assertError = (condition, message) => {
  if (condition) {
    shell.echo(message);
    shell.exit(1);
  }
};

const title = (msg) => run(`echo "\n\n${msg}"`);

const gitLog = () => {
  title("GIT LOG");
  run("git log --all --decorate --oneline --graph -10");
};
// START PROCESS

const curDir = run("pwd", { silent: true });
assertError(!/branch-and-merge\n$/.test(curDir), "Change to start directory");

title("RESETING WORK DIR WITH EMPTY GIT REPO");
run("rm -rf work");
run("mkdir work");
shell.cd("work");
run("git init");
run("git status");

title("COMMIT TWO FILES TO MASTER");
run("touch f1 f2");
run("git add f1; git commit -m 'add f1'");
run("git add f2; git commit -m 'add f2'");
gitLog();

title("CREATE TWO BRANCHES");
run("git checkout -b br2; ");
run("git checkout -b br1; ");
run("git branch ");
gitLog();

title("CHANGE branch: br1, file: f1");
run("echo 'change1' >> f1");
run("cat f1");
run("git commit -am 'change1 on f1'");
gitLog();

title("MERGE br1 into master -- fast-forward merge");
run("git checkout master ");
run("git merge br1 ");
gitLog();

title("DELETE br1");
run("git branch -d br1 ");
gitLog();

title("CHANGE branch: br2, file: f2");
run("git checkout br2");
run("git branch");
run("echo 'change1' >> f2");
run("cat f2");
run("git commit -am 'change1 on f2'");
gitLog();

title("MERGE br2 into master -- three-way merge");
run("git checkout master ");
run("git merge br2 ");
gitLog();

title("DELETE br2");
run("git branch -d br2 ");
gitLog();

title("CREATE FEATURE BRANCH");
run("git branch feature");
run("git branch ");
gitLog();

title("COMMIT TWO FILES TO MASTER BRANCH");
run("touch f3 f4");
run("git add f3; git commit -m 'add f3'");
run("git add f4; git commit -m 'add f4'");
gitLog();

title("COMMIT TWO FILES TO FEATURE BRANCH");
run("git checkout feature");
run("touch f5 f6");
run("git add f5; git commit -m 'add f5'");
run("git add f6; git commit -m 'add f6'");
gitLog();

title("MERGE master into feature");
run("git merge master ");
gitLog();
