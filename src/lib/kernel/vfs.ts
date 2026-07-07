import { FileNode } from './types';

export class VirtualFileSystem {
  private root: FileNode;
  private inodeTable: Map<string, FileNode> = new Map();
  private nextInode = 1;

  constructor() {
    this.root = {
      name: '',
      path: '/',
      type: 'directory',
      size: 0,
      children: new Map(),
      created: Date.now(),
      modified: Date.now(),
      permissions: 0o755,
      owner: 'root',
    };
    this.inodeTable.set('/', this.root);

    // Initialize system directories
    this.mkdir('/bin', 0o755);
    this.mkdir('/home', 0o755);
    this.mkdir('/etc', 0o755);
    this.mkdir('/tmp', 0o777);
    this.mkdir('/sys', 0o555);
    this.mkdir('/dev', 0o755);
  }

  /**
   * Resolve a path to its absolute form
   */
  private normalizePath(path: string, cwd: string = '/'): string {
    if (path.startsWith('/')) {
      return path;
    }
    return cwd === '/' ? `/${path}` : `${cwd}/${path}`;
  }

  /**
   * Split path into components
   */
  private pathComponents(path: string): string[] {
    return path.split('/').filter((c) => c.length > 0);
  }

  /**
   * Navigate to a directory node
   */
  private navigateTo(path: string): FileNode | null {
    if (path === '/') return this.root;

    const parts = this.pathComponents(path);
    let current = this.root;

    for (const part of parts) {
      if (current.type !== 'directory' || !current.children) {
        return null;
      }
      const next = current.children.get(part);
      if (!next) return null;
      current = next;
    }

    return current;
  }

  /**
   * Create a file
   */
  createFile(path: string, content: string = '', owner: string = 'root'): boolean {
    const normalizedPath = this.normalizePath(path);
    const parentPath = normalizedPath.substring(0, normalizedPath.lastIndexOf('/')) || '/';
    const fileName = normalizedPath.substring(normalizedPath.lastIndexOf('/') + 1);

    const parent = this.navigateTo(parentPath);
    if (!parent || parent.type !== 'directory' || !parent.children) {
      return false;
    }

    if (parent.children.has(fileName)) {
      return false; // File already exists
    }

    const file: FileNode = {
      name: fileName,
      path: normalizedPath,
      type: 'file',
      size: content.length,
      content,
      created: Date.now(),
      modified: Date.now(),
      permissions: 0o644,
      owner,
    };

    parent.children.set(fileName, file);
    this.inodeTable.set(normalizedPath, file);
    return true;
  }

  /**
   * Read a file
   */
  readFile(path: string): string | null {
    const node = this.navigateTo(this.normalizePath(path));
    if (!node || node.type !== 'file') {
      return null;
    }
    return node.content || '';
  }

  /**
   * Write to a file (create or overwrite)
   */
  writeFile(path: string, content: string): boolean {
    const normalizedPath = this.normalizePath(path);
    const node = this.navigateTo(normalizedPath);

    if (node && node.type === 'file') {
      node.content = content;
      node.size = content.length;
      node.modified = Date.now();
      return true;
    }

    return this.createFile(normalizedPath, content);
  }

  /**
   * Delete a file
   */
  deleteFile(path: string): boolean {
    const normalizedPath = this.normalizePath(path);
    const parentPath = normalizedPath.substring(0, normalizedPath.lastIndexOf('/')) || '/';
    const fileName = normalizedPath.substring(normalizedPath.lastIndexOf('/') + 1);

    const parent = this.navigateTo(parentPath);
    if (!parent || parent.type !== 'directory' || !parent.children) {
      return false;
    }

    const deleted = parent.children.delete(fileName);
    if (deleted) {
      this.inodeTable.delete(normalizedPath);
    }
    return deleted;
  }

  /**
   * Create a directory
   */
  mkdir(path: string, permissions: number = 0o755): boolean {
    const normalizedPath = this.normalizePath(path);
    const parentPath = normalizedPath.substring(0, normalizedPath.lastIndexOf('/')) || '/';
    const dirName = normalizedPath.substring(normalizedPath.lastIndexOf('/') + 1);

    const parent = this.navigateTo(parentPath);
    if (!parent || parent.type !== 'directory' || !parent.children) {
      return false;
    }

    if (parent.children.has(dirName)) {
      return false;
    }

    const dir: FileNode = {
      name: dirName,
      path: normalizedPath,
      type: 'directory',
      size: 0,
      children: new Map(),
      created: Date.now(),
      modified: Date.now(),
      permissions,
      owner: 'root',
    };

    parent.children.set(dirName, dir);
    this.inodeTable.set(normalizedPath, dir);
    return true;
  }

  /**
   * List directory contents
   */
  listDirectory(path: string): FileNode[] | null {
    const node = this.navigateTo(this.normalizePath(path));
    if (!node || node.type !== 'directory' || !node.children) {
      return null;
    }
    return Array.from(node.children.values());
  }

  /**
   * Check if path exists
   */
  exists(path: string): boolean {
    return this.navigateTo(this.normalizePath(path)) !== null;
  }

  /**
   * Get file/directory info
   */
  stat(path: string): FileNode | null {
    return this.navigateTo(this.normalizePath(path));
  }

  /**
   * Change directory - resolve to absolute path
   */
  cd(path: string, cwd: string): string | null {
    const target = this.normalizePath(path, cwd);
    const node = this.navigateTo(target);
    if (!node || node.type !== 'directory') {
      return null;
    }
    return target;
  }

  /**
   * Get root node
   */
  getRoot(): FileNode {
    return this.root;
  }
}