/**
 * Potree facade for creating point clouds
 */

class PotreeViewer {
  private container: HTMLElement;
  private viewer: Potree.Viewer;

  constructor(container: HTMLElement) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('Container must be an HTML element');
    }

    this.container = container;
    this.container.style.backgroundColor = '#000';

    this.viewer = new Potree.Viewer(this.container);
  }

  async loadPointCloud(url: string, name: string): Promise<Potree.PointCloud> {
    return new Promise((resolve, reject) => {
      window.Potree.loadPointCloud(url, name, (e) => {
        if (e) {
          this.viewer.scene.addPointCloud(e.pointcloud);

          let material = e.pointcloud.material;
          material.size = 1;

          this.viewer.fitToScreen();
          resolve(e.pointcloud);
        } else {
          reject(new Error('Failed to load point cloud'));
        }
      });
    });
  }
}

export default PotreeViewer;
