import { VirtualFileSystem } from './vfs';
import { ProcessManager } from './process-manager';
import { Shell } from './shell';
import { Process, Signal, SignalType } from './types';

export class Kernel {
  private fs: VirtualFileSystem;
  private pm: ProcessManager;
  private shells: Map<number, Shell> = new Map();
  private signals: Map<number, Signal> = new Map();
  private bootTime: number;

  constructor() {
    this.fs = new VirtualFileSystem();
    this.pm = new ProcessManager();
    this.bootTime = Date.now();

    this.initializeSignals();
    this.initializeSystemFiles();
  }

  private initializeSignals(): void {
    const signals: Signal[] = [
      { signum: SignalType.SIGHUP, name: 'SIGHUP' },
      { signum: SignalType.SIGINT, name: 'SIGINT' },
      { signum: SignalType.SIGQUIT, name: 'SIGQUIT' },
      { signum: SignalType.SIGKILL, name: 'SIGKILL' },
      { signum: SignalType.SIGSEGV, name: 'SIGSEGV' },
      { signum: SignalType.SIGTERM, name: 'SIGTERM' },
    ];

    for (const signal of signals) {
      this.signals.set(signal.signum, signal);
    }
  }

  private initializeSystemFiles(): void {
    const passwd = `root:x:0:0:root:/root:/bin/sh
user:x:1000:1000:user:/home/user:/bin/sh`;
    this.fs.createFile('/etc/passwd', passwd);

    this.fs.createFile('/etc/hostname', 'qynlos');
    this.fs.createFile('/proc/uptime', '0');

    const sysinfo = `System: QynlOS\nKernel: 0.1.0\nArchitecture: x86_64\nCPUs: 1`;
    this.fs.createFile('/proc/sysinfo', sysinfo);
  }

  boot(): void {
    const init = this.pm.createProcess('init', null, '/');
    this.createShell(init.pid);
  }

  createShell(pid: number): Shell | null {
    const process = this.pm.getProcess(pid);
    if (!process) {
      return null;
    }

    const shell = new Shell(this.fs, this.pm, process);
    this.shells.set(pid, shell);
    return shell;
  }

  async executeCommand(
    pid: number,
    command: string
  ): Promise<{ stdout: string; stderr: string; exitCode: number } | null> {
    const shell = this.shells.get(pid);
    if (!shell) {
      return null;
    }

    return await shell.execute(command);
  }

  fork(ppid: number, name: string): Process | null {
    const parent = this.pm.getProcess(ppid);
    if (!parent) {
      return null;
    }

    const child = this.pm.createProcess(name, ppid, parent.cwd);
    return child;
  }

  sendSignal(pid: number, signum: number): boolean {
    const process = this.pm.getProcess(pid);
    const signal = this.signals.get(signum);

    if (!process || !signal) {
      return false;
    }

    if (signum === SignalType.SIGKILL) {
      this.pm.terminateProcess(pid, 137);
      return true;
    }

    if (signum === SignalType.SIGTERM) {
      this.pm.terminateProcess(pid, 15);
      return true;
    }

    if (signal.handler) {
      signal.handler(process);
      return true;
    }

    return true;
  }

  getProcessList(): Process[] {
    return this.pm.getAllProcesses();
  }

  getSystemStats(): {
    uptime: number;
    processes: number;
    memory: number;
    bootTime: number;
  } {
    const stats = this.pm.getStats();
    return {
      uptime: Date.now() - this.bootTime,
      processes: stats.totalProcesses,
      memory: stats.totalMemory,
      bootTime: this.bootTime,
    };
  }

  getFilesystem(): VirtualFileSystem {
    return this.fs;
  }

  getProcessManager(): ProcessManager {
    return this.pm;
  }

  getShell(pid: number): Shell | null {
    return this.shells.get(pid) || null;
  }
}