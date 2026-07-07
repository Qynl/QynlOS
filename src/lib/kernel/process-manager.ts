import { Process } from './types';

export class ProcessManager {
  private processes: Map<number, Process> = new Map();
  private nextPid = 1000;
  private pidQueue: number[] = [];

  /**
   * Create a new process
   */
  createProcess(
    name: string,
    ppid: number | null = null,
    cwd: string = '/'
  ): Process {
    const pid = this.allocatePid();
    const process: Process = {
      id: `${name}-${pid}`,
      name,
      pid,
      ppid,
      state: 'running',
      memory: 0,
      cpu: 0,
      created: Date.now(),
      cwd,
      env: {
        PATH: '/bin:/usr/bin',
        HOME: '/home/user',
        USER: 'user',
        SHELL: '/bin/sh',
        PWD: cwd,
      },
    };

    this.processes.set(pid, process);
    return process;
  }

  /**
   * Get process by PID
   */
  getProcess(pid: number): Process | undefined {
    return this.processes.get(pid);
  }

  /**
   * Get all processes
   */
  getAllProcesses(): Process[] {
    return Array.from(this.processes.values());
  }

  /**
   * Get child processes
   */
  getChildProcesses(ppid: number): Process[] {
    return Array.from(this.processes.values()).filter(
      (p) => p.ppid === ppid
    );
  }

  /**
   * Update process state
   */
  updateProcessState(
    pid: number,
    state: Process['state']
  ): boolean {
    const process = this.processes.get(pid);
    if (!process) return false;

    process.state = state;
    return true;
  }

  /**
   * Update process CWD
   */
  updateProcessCwd(pid: number, cwd: string): boolean {
    const process = this.processes.get(pid);
    if (!process) return false;

    process.cwd = cwd;
    process.env.PWD = cwd;
    return true;
  }

  /**
   * Terminate a process
   */
  terminateProcess(pid: number, exitCode: number = 0): boolean {
    const process = this.processes.get(pid);
    if (!process) return false;

    process.state = 'stopped';
    process.exitCode = exitCode;

    // Terminate child processes
    const children = this.getChildProcesses(pid);
    for (const child of children) {
      this.terminateProcess(child.pid, 1);
    }

    // Remove process after cleanup
    setTimeout(() => {
      this.processes.delete(pid);
      this.freePid(pid);
    }, 100);

    return true;
  }

  /**
   * Allocate a new PID
   */
  private allocatePid(): number {
    if (this.pidQueue.length > 0) {
      return this.pidQueue.shift()!;
    }
    return this.nextPid++;
  }

  /**
   * Free a PID for reuse
   */
  private freePid(pid: number): void {
    this.pidQueue.push(pid);
  }

  /**
   * Get process statistics
   */
  getStats(): {
    totalProcesses: number;
    runningProcesses: number;
    stoppedProcesses: number;
    totalMemory: number;
  } {
    const processes = Array.from(this.processes.values());
    return {
      totalProcesses: processes.length,
      runningProcesses: processes.filter((p) => p.state === 'running')
        .length,
      stoppedProcesses: processes.filter((p) => p.state === 'stopped')
        .length,
      totalMemory: processes.reduce((sum, p) => sum + p.memory, 0),
    };
  }
}