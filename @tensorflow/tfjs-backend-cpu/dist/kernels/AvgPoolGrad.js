/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import { AvgPoolGrad, backend_util, buffer } from '@tensorflow/tfjs-core';
import { assertNotComplex } from '../cpu_util';
export function avgPoolGrad(args) {
    const { inputs, backend, attrs } = args;
    const { dy, input } = inputs;
    const x = input;
    assertNotComplex([dy, input], 'avgPoolGrad');
    const { filterSize, strides, pad } = attrs;
    const convInfo = backend_util.computePool2DInfo(x.shape, filterSize, strides, 1 /* dilations */, pad);
    const strideHeight = convInfo.strideHeight;
    const strideWidth = convInfo.strideWidth;
    const filterHeight = convInfo.filterHeight;
    const filterWidth = convInfo.filterWidth;
    const dilationHeight = convInfo.dilationHeight;
    const dilationWidth = convInfo.dilationWidth;
    const effectiveFilterHeight = convInfo.effectiveFilterHeight;
    const effectiveFilterWidth = convInfo.effectiveFilterWidth;
    const padLeft = effectiveFilterWidth - 1 - convInfo.padInfo.left;
    const padTop = effectiveFilterHeight - 1 - convInfo.padInfo.top;
    const dx = buffer(x.shape, 'float32');
    const avgMultiplier = 1 / (filterHeight * filterWidth);
    const dyData = backend.data.get(dy.dataId).values;
    const dyBuf = buffer(dy.shape, 'float32', dyData);
    for (let b = 0; b < convInfo.batchSize; ++b) {
        for (let d = 0; d < convInfo.inChannels; ++d) {
            for (let dxR = 0; dxR < convInfo.inHeight; ++dxR) {
                for (let dxC = 0; dxC < convInfo.inWidth; ++dxC) {
                    // Shader code begins.
                    const dyRCorner = dxR - padTop;
                    const dyCCorner = dxC - padLeft;
                    let dotProd = 0;
                    for (let wR = 0; wR < effectiveFilterHeight; wR += dilationHeight) {
                        const dyR = (dyRCorner + wR) / strideHeight;
                        if (dyR < 0 || dyR >= convInfo.outHeight ||
                            Math.floor(dyR) !== dyR) {
                            continue;
                        }
                        for (let wC = 0; wC < effectiveFilterWidth; wC += dilationWidth) {
                            const dyC = (dyCCorner + wC) / strideWidth;
                            if (dyC < 0 || dyC >= convInfo.outWidth ||
                                Math.floor(dyC) !== dyC) {
                                continue;
                            }
                            const pixel = dyBuf.get(b, dyR, dyC, d);
                            dotProd += pixel;
                        }
                    }
                    dx.set(dotProd * avgMultiplier, b, dxR, dxC, d);
                }
            }
        }
    }
    return backend.makeTensorInfo(dx.shape, dx.dtype, dx.values);
}
export const avgPoolGradConfig = {
    kernelName: AvgPoolGrad,
    backendName: 'cpu',
    kernelFunc: avgPoolGrad
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXZnUG9vbEdyYWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtY3B1L3NyYy9rZXJuZWxzL0F2Z1Bvb2xHcmFkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNILE9BQU8sRUFBQyxXQUFXLEVBQXVDLFlBQVksRUFBRSxNQUFNLEVBQTZDLE1BQU0sdUJBQXVCLENBQUM7QUFHekosT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRTdDLE1BQU0sVUFBVSxXQUFXLENBQUMsSUFJM0I7SUFDQyxNQUFNLEVBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUMsR0FBRyxJQUFJLENBQUM7SUFDdEMsTUFBTSxFQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUMsR0FBRyxNQUFNLENBQUM7SUFDM0IsTUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDO0lBQ2hCLGdCQUFnQixDQUFDLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQzdDLE1BQU0sRUFBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBQyxHQUFHLEtBQUssQ0FBQztJQUV6QyxNQUFNLFFBQVEsR0FBRyxZQUFZLENBQUMsaUJBQWlCLENBQzNDLENBQUMsQ0FBQyxLQUF5QyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQ2hFLENBQUMsQ0FBQyxlQUFlLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDNUIsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQztJQUMzQyxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDO0lBQ3pDLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUM7SUFDM0MsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQztJQUN6QyxNQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsY0FB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O0tBQ0Y7SUFDRCxPQUFPLE9BQU8sQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMvRCxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQWlCO0lBQzdDLFVBQVUsRUFBRSxXQUFXO0lBQ3ZCLFdBQVcsRUFBRSxLQUFLO0lBQ2xCLFVBQVUsRUFBRSxXQUFvQztDQUNqRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuaW1wb3J0IHtBdmdQb29sR3JhZCwgQXZnUG9vbEdyYWRBdHRycywgQXZnUG9vbEdyYWRJbnB1dHMsIGJhY2tlbmRfdXRpbCwgYnVmZmVyLCBLZXJuZWxDb25maWcsIEtlcm5lbEZ1bmMsIFJhbmssIFRlbnNvckluZm99IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCB7TWF0aEJhY2tlbmRDUFV9IGZyb20gJy4uL2JhY2tlbmRfY3B1JztcbmltcG9ydCB7YXNzZXJ0Tm90Q29tcGxleH0gZnJvbSAnLi4vY3B1X3V0aWwnO1xuXG5leHBvcnQgZnVuY3Rpb24gYXZnUG9vbEdyYWQoYXJnczoge1xuICBpbnB1dHM6IEF2Z1Bvb2xHcmFkSW5wdXRzLFxuICBiYWNrZW5kOiBNYXRoQmFja2VuZENQVSxcbiAgYXR0cnM6IEF2Z1Bvb2xHcmFkQXR0cnNcbn0pOiBUZW5zb3JJbmZvIHtcbiAgY29uc3Qge2lucHV0cywgYmFja2VuZCwgYXR0cnN9ID0gYXJncztcbiAgY29uc3Qge2R5LCBpbnB1dH0gPSBpbnB1dHM7XG4gIGNvbnN0IHggPSBpbnB1dDtcbiAgYXNzZXJ0Tm90Q29tcGxleChbZHksIGlucHV0XSwgJ2F2Z1Bvb2xHcmFkJyk7XG4gIGNvbnN0IHtmaWx0ZXJTaXplLCBzdHJpZGVzLCBwYWR9ID0gYXR0cnM7XG5cbiAgY29uc3QgY29udkluZm8gPSBiYWNrZW5kX3V0aWwuY29tcHV0ZVBvb2wyREluZm8oXG4gICAgICB4LnNoYXBlIGFzIFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdLCBmaWx0ZXJTaXplLCBzdHJpZGVzLFxuICAgICAgMSAvKiBkaWxhdGlvbnMgKi8sIHBhZCk7XG4gIGNvbnN0IHN0cmlkZUhlaWdodCA9IGNvbnZJbmZvLnN0cmlkZUhlaWdodDtcbiAgY29uc3Qgc3RyaWRlV2lkdGggPSBjb252SW5mby5zdHJpZGVXaWR0aDtcbiAgY29uc3QgZmlsdGVySGVpZ2h0ID0gY29udkluZm8uZmlsdGVySGVpZ2h0O1xuICBjb25zdCBmaWx0ZXJXaWR0aCA9IGNvbnZJbmZvLmZpbHRlcldpZHRoO1xuICBjb25zdCBkaWxhdGlvbkhlaWdodCA9IGNvbnZJbmZvLmRpbGF0aW9uSGVpZ2h0O1xuICBjb25zdCBkaWxhdGlvbldpZHRoID0gY29udkluZm8uZGlsYXRpb25XaWR0aDtcbiAgY29uc3QgZWZmZWN0aXZlRmlsdGVySGVpZ2h0ID0gY29udkluZm8uZWZmZWN0aXZlRmlsdGVySGVpZ2h0O1xuICBjb25zdCBlZmZlY3RpdmVGaWx0ZXJXaWR0aCA9IGNvbnZJbmZvLmVmZmVjdGl2ZUZpbHRlcldpZHRoO1xuICBjb25zdCBwYWRMZWZ0ID0gZWZmZWN0aXZlRmlsdGVyV2lkdGggLSAxIC0gY29udkluZm8ucGFkSW5mby5sZWZ0O1xuICBjb25zdCBwYWRUb3AgPSBlZmZlY3RpdmVGaWx0ZXJIZWlnaHQgLSAxIC0gY29udkluZm8ucGFkSW5mby50b3A7XG4gIGNvbnN0IGR4ID1cbiAgICAgIGJ1ZmZlcjxSYW5rLlI0Pih4LnNoYXBlIGFzIFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdLCAnZmxvYXQzMicpO1xuXG4gIGNvbnN0IGF2Z011bHRpcGxpZXIgPSAxIC8gKGZpbHRlckhlaWdodCAqIGZpbHRlcldpZHRoKTtcblxuICBjb25zdCBkeURhdGEgPSBiYWNrZW5kLmRhdGEuZ2V0KGR5LmRhdGFJZCkudmFsdWVzIGFzIEZsb2F0MzJBcnJheTtcbiAgY29uc3QgZHlCdWYgPSBidWZmZXI8UmFuay5SND4oXG4gICAgICBkeS5zaGFwZSBhcyBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSwgJ2Zsb2F0MzInLCBkeURhdGEpO1xuXG4gIGZvciAobGV0IGIgPSAwOyBiIDwgY29udkluZm8uYmF0Y2hTaXplOyArK2IpIHtcbiAgICBmb3IgKGxldCBkID0gMDsgZCA8IGNvbnZJbmZvLmluQ2hhbm5lbHM7ICsrZCkge1xuICAgICAgZm9yIChsZXQgZHhSID0gMDsgZHhSIDwgY29udkluZm8uaW5IZWlnaHQ7ICsrZHhSKSB7XG4gICAgICAgIGZvciAobGV0IGR4QyA9IDA7IGR4QyA8IGNvbnZJbmZvLmluV2lkdGg7ICsrZHhDKSB7XG4gICAgICAgICAgLy8gU2hhZGVyIGNvZGUgYmVnaW5zLlxuICAgICAgICAgIGNvbnN0IGR5UkNvcm5lciA9IGR4UiAtIHBhZFRvcDtcbiAgICAgICAgICBjb25zdCBkeUNDb3JuZXIgPSBkeEMgLSBwYWRMZWZ0O1xuICAgICAgICAgIGxldCBkb3RQcm9kID0gMDtcbiAgICAgICAgICBmb3IgKGxldCB3UiA9IDA7IHdSIDwgZWZmZWN0aXZlRmlsdGVySGVpZ2h0OyB3UiArPSBkaWxhdGlvbkhlaWdodCkge1xuICAgICAgICAgICAgY29uc3QgZHlSID0gKGR5UkNvcm5lciArIHdSKSAvIHN0cmlkZUhlaWdodDtcbiAgICAgICAgICAgIGlmIChkeVIgPCAwIHx8IGR5UiA+PSBjb252SW5mby5vdXRIZWlnaHQgfHxcbiAgICAgICAgICAgICAgICBNYXRoLmZsb29yKGR5UikgIT09IGR5Uikge1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IHdDID0gMDsgd0MgPCBlZmZlY3RpdmVGaWx0ZXJXaWR0aDsgd0MgKz0gZGlsYXRpb25XaWR0aCkge1xuICAgICAgICAgICAgICBjb25zdCBkeUMgPSAoZHlDQ29ybmVyICsgd0MpIC8gc3RyaWRlV2lkdGg7XG4gICAgICAgICAgICAgIGlmIChkeUMgPCAwIHx8IGR5QyA+PSBjb252SW5mby5vdXRXaWR0aCB8fFxuICAgICAgICAgICAgICAgICAgTWF0aC5mbG9vcihkeUMpICE9PSBkeUMpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGNvbnN0IHBpeGVsID0gZHlCdWYuZ2V0KGIsIGR5UiwgZHlDLCBkKTtcbiAgICAgICAgICAgICAgZG90UHJvZCArPSBwaXhlbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZHguc2V0KGRvdFByb2QgKiBhdmdNdWx0aXBsaWVyLCBiLCBkeFIsIGR4QywgZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGJhY2tlbmQubWFrZVRlbnNvckluZm8oZHguc2hhcGUsIGR4LmR0eXBlLCBkeC52YWx1ZXMpO1xufVxuXG5leHBvcnQgY29uc3QgYXZnUG9vbEdyYWRDb25maWc6IEtlcm5lbENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogQXZnUG9vbEdyYWQsXG4gIGJhY2tlbmROYW1lOiAnY3B1JyxcbiAga2VybmVsRnVuYzogYXZnUG9vbEdyYWQgYXMgdW5rbm93biBhcyBLZXJuZWxGdW5jXG59O1xuIl19