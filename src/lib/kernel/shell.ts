import { VirtualFileSystem } from './vfs';
import { ProcessManager } from './process-manager';
import { Process } from './types';

export interface CommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export class Shell {
  private fs: VirtualFileSystem;
  private pm: ProcessManager;
  private currentProcess: Process;
  private commandHistory: string[] = [];
  private historyIndex = 0;

  constructor(
    fs: VirtualFileSystem,
    pm: ProcessManager,
    process: Process
  ) {
    this.fs = fs;
    this.pm = pm;
    this.currentProcess = process;
  }

  /**
   * Execute a shell command
   */
  async execute(input: string): Promise<CommandResult> {
    const trimmed = input.trim();
    if (!trimmed) {
      return { stdout: '', stderr: '', exitCode: 0 };
    }

    this.commandHistory.push(trimmed);
    this.historyIndex = this.commandHistory.length;

    // Parse command
    const [cmd, ...args] = trimmed.split(/\s+/);

    // Execute built-in commands
    switch (cmd) {
      case 'ls':
        return this.cmd_ls(args);
      case 'cd':
        return this.cmd_cd(args);
      case 'pwd':
        return this.cmd_pwd();
      case 'mkdir':
        return this.cmd_mkdir(args);
      case 'touch':
        return this.cmd_touch(args);
      case 'cat':
        return this.cmd_cat(args);
      case 'echo':
        return this.cmd_echo(args);
      case 'rm':
        return this.cmd_rm(args);
      case 'ps':
        return this.cmd_ps(args);
      case 'kill':
        return this.cmd_kill(args);
      case 'clear':
        return this.cmd_clear();
      case 'help':
        return this.cmd_help();
      case 'whoami':
        return this.cmd_whoami();
      case 'date':
        return this.cmd_date();
      case 'uname':
        return this.cmd_uname();
      case 'exit':
        return this.cmd_exit();
      default:
        return {
          stdout: '',
          stderr: `Command not found: ${cmd}`,
          exitCode: 127,
        };
    }
  }

  private cmd_ls(args: string[]): CommandResult {
    const path = args[0] || '.';
    const resolved = path === '.' ? this.currentProcess.cwd : path;

    const contents = this.fs.listDirectory(resolved);
    if (!contents) {
      return {
        stdout: '',
        stderr: `Cannot access '${path}': No such file or directory`,
        exitCode: 1,
      };
    }

    const output = contents
      .map((node) => {
        const type = node.type === 'directory' ? '/' : '';
        return `${node.name}${type}`;
      })
      .join('  ');

    return { stdout: output, stderr: '', exitCode: 0 };
  }

  private cmd_cd(args: string[]): CommandResult {
    if (!args.length) {
      return { stdout: '', stderr: 'cd: missing argument', exitCode: 1 };
    }

    const target = this.pm.getProcess(this.currentProcess.pid);
    if (!target) {
      return { stdout: '', stderr: 'Process not found', exitCode: 1 };
    }

    const newCwd = this.fs.cd(args[0], this.currentProcess.cwd);
    if (!newCwd) {
      return {
        stdout: '',
        stderr: `cd: '${args[0]}': No such directory`,
        exitCode: 1,
      };
    }

    this.pm.updateProcessCwd(this.currentProcess.pid, newCwd);
    this.currentProcess.cwd = newCwd;

    return { stdout: '', stderr: '', exitCode: 0 };
  }

  private cmd_pwd(): CommandResult {
    return {
      stdout: this.currentProcess.cwd,
      stderr: '',
      exitCode: 0,
    };
  }

  private cmd_mkdir(args: string[]): CommandResult {
    if (!args.length) {
      return { stdout: '', stderr: 'mkdir: missing argument', exitCode: 1 };
    }

    for (const dir of args) {
      const path =
        dir.startsWith('/') ? dir : `${this.currentProcess.cwd}/${dir}`;
      if (!this.fs.mkdir(path)) {
        return {
          stdout: '',
          stderr: `mkdir: cannot create directory '${dir}'`,
          exitCode: 1,
        };
      }
    }

    return { stdout: '', stderr: '', exitCode: 0 };
  }

  private cmd_touch(args: string[]): CommandResult {
    if (!args.length) {
      return { stdout: '', stderr: 'touch: missing argument', exitCode: 1 };
    }

    for (const file of args) {
      const path =
        file.startsWith('/') ? file : `${this.currentProcess.cwd}/${file}`;
      if (!this.fs.createFile(path)) {
        return {
          stdout: '',
          stderr: `touch: cannot create file '${file}'`,
          exitCode: 1,
        };
      }
    }

    return { stdout: '', stderr: '', exitCode: 0 };
  }

  private cmd_cat(args: string[]): CommandResult {
    if (!args.length) {
      return { stdout: '', stderr: 'cat: missing argument', exitCode: 1 };
    }

    const contents: string[] = [];
    for (const file of args) {
      const path =
        file.startsWith('/') ? file : `${this.currentProcess.cwd}/${file}`;
      const content = this.fs.readFile(path);
      if (content === null) {
        return {
          stdout: '',
          stderr: `cat: cannot open file '${file}'`,
          exitCode: 1,
        };
      }
      contents.push(content);
    }

    return { stdout: contents.join('\n'), stderr: '', exitCode: 0 };
  }

  private cmd_echo(args: string[]): CommandResult {
    return { stdout: args.join(' '), stderr: '', exitCode: 0 };
  }

  private cmd_rm(args: string[]): CommandResult {
    if (!args.length) {
      return { stdout: '', stderr: 'rm: missing argument', exitCode: 1 };
    }

    for (const file of args) {
      const path =
        file.startsWith('/') ? file : `${this.currentProcess.cwd}/${file}`;
      if (!this.fs.deleteFile(path)) {
        return {
          stdout: '',
          stderr: `rm: cannot remove '${file}'`,
          exitCode: 1,
        };
      }
    }

    return { stdout: '', stderr: '', exitCode: 0 };
  }

  private cmd_ps(): CommandResult {
    const processes = this.pm.getAllProcesses();
    const lines = [
      'PID\tNAME\t\tSTATE\t\tMEM',
      ...processes.map(
        (p) =>
          `${p.pid}\t${p.name.padEnd(8)}\t${p.state.padEnd(8)}\t${p.memory}KB`
      ),
    ];

    return { stdout: lines.join('\n'), stderr: '', exitCode: 0 };
  }

  private cmd_kill(args: string[]): CommandResult {
    if (!args.length) {
      return { stdout: '', stderr: 'kill: missing argument', exitCode: 1 };
    }

    const pid = parseInt(args[0]);
    if (isNaN(pid)) {
      return {
        stdout: '',
        stderr: `kill: '${args[0]}' is not a valid PID`,
        exitCode: 1,
      };
    }

    if (this.pm.terminateProcess(pid)) {
      return { stdout: '', stderr: '', exitCode: 0 };
    }

    return {
      stdout: '',
      stderr: `kill: cannot kill process ${pid}`,
      exitCode: 1,
    };
  }

  private cmd_clear(): CommandResult {
    return { stdout: '\x1Bc', stderr: '', exitCode: 0 };
  }

  private cmd_help(): CommandResult {
    const help = `QynlOS Shell - Available Commands:
  ls [path]          - List directory contents
  cd <path>          - Change directory
  pwd                - Print working directory
  mkdir <dir>        - Create directory
  touch <file>       - Create file
  cat <file>         - Display file contents
  echo <text>        - Print text
  rm <file>          - Remove file
  ps                 - List processes
  kill <pid>         - Terminate process
  whoami             - Show current user
  date               - Show current date/time
  uname              - Show system information
  clear              - Clear screen
  help               - Show this help
  exit               - Exit shell`;

    return { stdout: help, stderr: '', exitCode: 0 };
  }

  private cmd_whoami(): CommandResult {
    return {
      stdout: this.currentProcess.env.USER || 'user',
      stderr: '',
      exitCode: 0,
    };
  }

  private cmd_date(): CommandResult {
    return {
      stdout: new Date().toLocaleString(),
      stderr: '',
      exitCode: 0,
    };
  }

  private cmd_uname(): CommandResult {
    return {
      stdout: 'QynlOS 1.0.0 (Kernel 0.1.0)',
      stderr: '',
      exitCode: 0,
    };
  }

  private cmd_exit(): CommandResult {
    this.pm.terminateProcess(this.currentProcess.pid);
    return { stdout: '', stderr: '', exitCode: 0 };
  }

  /**
   * Get command history
   */
  getHistory(): string[] {
    return [...this.commandHistory];
  }

  /**
   * Get current process
   */
  getCurrentProcess(): Process {
    return this.currentProcess;
  }
}