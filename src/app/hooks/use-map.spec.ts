import { act } from 'react';
import useOlMap from './use-map';
import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import BaseLayer from 'ol/layer/Base';

describe('useOlMap Hook - Layer Addition', () => {
  beforeEach(() => {
    // @ts-expect-error
    global.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });
  it('should toggle layer and state visibility', async () => {
    const { result } = renderHook(() => useOlMap());

    const layer = new BaseLayer({ visible: false });

    result.current.layers.push({ layer: layer, visible: layer.getVisible() });

    await act(async () => {
      result.current.toggleLayerVisibility(layer);
    });

    expect(result.current.layers[0].visible).toBe(true);
    expect(result.current.layers[0].layer.getVisible()).toBe(true);

    await act(async () => {
      result.current.toggleLayerVisibility(layer);
    });

    expect(result.current.layers[0].visible).toBe(false);
    expect(result.current.layers[0].layer.getVisible()).toBe(false);
  });
});
