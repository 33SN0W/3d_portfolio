import * as THREE from "three";

type LoadingListener = (progress: number, isComplete: boolean) => void;

let _progress = 0;
let _isComplete = false;
const _listeners = new Set<LoadingListener>();

function notify() {
  _listeners.forEach((fn) => fn(_progress, _isComplete));
}

export function initAssetLoading(): void {
  if (typeof window === "undefined") return;

  THREE.DefaultLoadingManager.onStart = () => {
    _isComplete = false;
    _progress = 0;
    notify();
  };

  THREE.DefaultLoadingManager.onProgress = (_url, loaded, total) => {
    _progress = total > 0 ? Math.round((loaded / total) * 100) : 0;
    _isComplete = loaded >= total && total > 0;
    notify();
  };

  THREE.DefaultLoadingManager.onLoad = () => {
    _progress = 100;
    _isComplete = true;
    notify();
  };
}

export function getLoadingState() {
  return { progress: _progress, isComplete: _isComplete };
}

export function subscribeLoading(listener: LoadingListener): () => void {
  _listeners.add(listener);
  listener(_progress, _isComplete);
  return () => _listeners.delete(listener);
}
