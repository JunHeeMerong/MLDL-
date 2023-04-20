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
import { Any, backend_util, util } from '@tensorflow/tfjs-core';
import { reduce } from '../kernel_utils/reduce';
import { reshape } from './Reshape';
import { transpose } from './Transpose';
export function any(args) {
    const { inputs, backend, attrs } = args;
    const { x } = inputs;
    const { axis, keepDims } = attrs;
    const xRank = x.shape.length;
    const origAxes = util.parseAxisParam(axis, x.shape);
    let axes = origAxes;
    const permutedAxes = backend_util.getAxesPermutation(axes, xRank);
    let permutedX = x;
    if (permutedAxes != null) {
        permutedX = transpose({ inputs: { x }, backend, attrs: { perm: permutedAxes } });
        axes = backend_util.getInnerMostAxes(axes.length, xRank);
    }
    backend_util.assertAxesAreInnerMostDims('any', axes, xRank);
    const [outShape, reduceShape] = backend_util.computeOutAndReduceShapes(permutedX.shape, axes);
    const inSize = util.sizeFromShape(reduceShape);
    const a2D = reshape({ inputs: { x: permutedX }, backend, attrs: { shape: [-1, inSize] } });
    const reduced = reduce(a2D, a2D.dtype, 'any', backend);
    let res;
    if (keepDims) {
        const newShape = backend_util.expandShapeToKeepDim(outShape, origAxes);
        res = reshape({ inputs: { x: reduced }, backend, attrs: { shape: newShape } });
    }
    else {
        res = reshape({ inputs: { x: reduced }, backend, attrs: { shape: outShape } });
    }
    backend.disposeIntermediateTensorInfo(a2D);
    backend.disposeIntermediateTensorInfo(reduced);
    if (permutedAxes != null) {
        backend.disposeIntermediateTensorInfo(permutedX);
    }
    return res;
}
export const anyConfig = {
    kernelName: Any,
    backendName: 'webgl',
    kernelFunc: any
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQW55LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9rZXJuZWxzL0FueS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsR0FBRyxFQUF1QixZQUFZLEVBQXdDLElBQUksRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBR3pILE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUM5QyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2xDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFdEMsTUFBTSxVQUFVLEdBQUcsQ0FDZixJQUFxRTtJQUV2RSxNQUFNLEVBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUMsR0FBRyxJQUFJLENBQUM7SUFDdEMsTUFBTSxFQUFDLENBQUMsRUFBQyxHQUFHLE1BQU0sQ0FBQztJQUNuQixNQUFNLEVBQUMsSUFBSSxFQUFFLFFBQVEsRUFBQyxHQUFHLEtBQUssQ0FBQztJQUUvQixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUU3QixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDcEQsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDO0lBQ3BCLE1BQU0sWUFBWSxHQUFHLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDbEUsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ2xCLElBQUksWUFBWSxJQUFJLElBQUksRUFBRTtRQUN4QixTQUFTLEdBQUcsU0FBUyxDQUFDLEVBQUMsTUFBTSxFQUFFLEVBQUMsQ0FBQyxFQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFDLElBQUksRUFBRSxZQUFZLEVBQUMsRUFBQyxDQUFDLENBQUM7UUFDM0UsSUFBSSxHQUFHLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQzFEO0lBRUQsWUFBWSxDQUFDLDBCQUEwQixDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDNUQsTUFBTSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsR0FDekIsWUFBWSxDQUFDLHlCQUF5QixDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDbEUsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUUvQyxNQUFNLEdBQUcsR0FDTCxPQUFPLENBQUMsRUFBQyxNQUFNLEVBQUUsRUFBQyxDQUFDLEVBQUUsU0FBUyxFQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxFQUFDLEVBQUMsQ0FBQyxDQUFDO0lBQzdFLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFFdkQsSUFBSSxHQUFHLENBQUM7SUFDUixJQUFJLFFBQVEsRUFBRTtRQUNaLE1BQU0sUUFBUSxHQUFHLFlBQVksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDdkUsR0FBRyxHQUFHLE9BQU8sQ0FBQyxFQUFDLE1BQU0sRUFBRSxFQUFDLENBQUMsRUFBRSxPQUFPLEVBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBQyxFQUFDLENBQUMsQ0FBQztLQUMxRTtTQUFNO1FBQ0wsR0FBRyxHQUFHLE9BQU8sQ0FBQyxFQUFDLE1BQU0sRUFBRSxFQUFDLENBQUMsRUFBRSxPQUFPLEVBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBQyxFQUFDLENBQUMsQ0FBQztLQUMxRTtJQUVELE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMzQyxPQUFPLENBQUMsNkJBQTZCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFL0MsSUFBSSxZQUFZLElBQUksSUFBSSxFQUFFO1FBQ3hCLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUNsRDtJQUVELE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FBaUI7SUFDckMsVUFBVSxFQUFFLEdBQUc7SUFDZixXQUFXLEVBQUUsT0FBTztJQUNwQixVQUFVLEVBQUUsR0FBNEI7Q0FDekMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtBbnksIEFueUF0dHJzLCBBbnlJbnB1dHMsIGJhY2tlbmRfdXRpbCwgS2VybmVsQ29uZmlnLCBLZXJuZWxGdW5jLCBUZW5zb3JJbmZvLCB1dGlsfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuXG5pbXBvcnQge01hdGhCYWNrZW5kV2ViR0x9IGZyb20gJy4uL2JhY2tlbmRfd2ViZ2wnO1xuaW1wb3J0IHtyZWR1Y2V9IGZyb20gJy4uL2tlcm5lbF91dGlscy9yZWR1Y2UnO1xuaW1wb3J0IHtyZXNoYXBlfSBmcm9tICcuL1Jlc2hhcGUnO1xuaW1wb3J0IHt0cmFuc3Bvc2V9IGZyb20gJy4vVHJhbnNwb3NlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGFueShcbiAgICBhcmdzOiB7aW5wdXRzOiBBbnlJbnB1dHMsIGJhY2tlbmQ6IE1hdGhCYWNrZW5kV2ViR0wsIGF0dHJzOiBBbnlBdHRyc30pOlxuICAgIFRlbnNvckluZm8ge1xuICBjb25zdCB7aW5wdXRzLCBiYWNrZW5kLCBhdHRyc30gPSBhcmdzO1xuICBjb25zdCB7eH0gPSBpbnB1dHM7XG4gIGNvbnN0IHtheGlzLCBrZWVwRGltc30gPSBhdHRycztcblxuICBjb25zdCB4UmFuayA9IHguc2hhcGUubGVuZ3RoO1xuXG4gIGNvbnN0IG9yaWdBeGVzID0gdXRpbC5wYXJzZUF4aXNQYXJhbShheGlzLCB4LnNoYXBlKTtcbiAgbGV0IGF4ZXMgPSBvcmlnQXhlcztcbiAgY29uc3QgcGVybXV0ZWRBeGVzID0gYmFja2VuZF91dGlsLmdldEF4ZXNQZXJtdXRhdGlvbihheGVzLCB4UmFuayk7XG4gIGxldCBwZXJtdXRlZFggPSB4O1xuICBpZiAocGVybXV0ZWRBeGVzICE9IG51bGwpIHtcbiAgICBwZXJtdXRlZFggPSB0cmFuc3Bvc2Uoe2lucHV0czoge3h9LCBiYWNrZW5kLCBhdHRyczoge3Blcm06IHBlcm11dGVkQXhlc319KTtcbiAgICBheGVzID0gYmFja2VuZF91dGlsLmdldElubmVyTW9zdEF4ZXMoYXhlcy5sZW5ndGgsIHhSYW5rKTtcbiAgfVxuXG4gIGJhY2tlbmRfdXRpbC5hc3NlcnRBeGVzQXJlSW5uZXJNb3N0RGltcygnYW55JywgYXhlcywgeFJhbmspO1xuICBjb25zdCBbb3V0U2hhcGUsIHJlZHVjZVNoYXBlXSA9XG4gICAgICBiYWNrZW5kX3V0aWwuY29tcHV0ZU91dEFuZFJlZHVjZVNoYXBlcyhwZXJtdXRlZFguc2hhcGUsIGF4ZXMpO1xuICBjb25zdCBpblNpemUgPSB1dGlsLnNpemVGcm9tU2hhcGUocmVkdWNlU2hhcGUpO1xuXG4gIGNvbnN0IGEyRCA9XG4gICAgICByZXNoYXBlKHtpbnB1dHM6IHt4OiBwZXJtdXRlZFh9LCBiYWNrZW5kLCBhdHRyczoge3NoYXBlOiBbLTEsIGluU2l6ZV19fSk7XG4gIGNvbnN0IHJlZHVjZWQgPSByZWR1Y2UoYTJELCBhMkQuZHR5cGUsICdhbnknLCBiYWNrZW5kKTtcblxuICBsZXQgcmVzO1xuICBpZiAoa2VlcERpbXMpIHtcbiAgICBjb25zdCBuZXdTaGFwZSA9IGJhY2tlbmRfdXRpbC5leHBhbmRTaGFwZVRvS2VlcERpbShvdXRTaGFwZSwgb3JpZ0F4ZXMpO1xuICAgIHJlcyA9IHJlc2hhcGUoe2lucHV0czoge3g6IHJlZHVjZWR9LCBiYWNrZW5kLCBhdHRyczoge3NoYXBlOiBuZXdTaGFwZX19KTtcbiAgfSBlbHNlIHtcbiAgICByZXMgPSByZXNoYXBlKHtpbnB1dHM6IHt4OiByZWR1Y2VkfSwgYmFja2VuZCwgYXR0cnM6IHtzaGFwZTogb3V0U2hhcGV9fSk7XG4gIH1cblxuICBiYWNrZW5kLmRpc3Bvc2VJbnRlcm1lZGlhdGVUZW5zb3JJbmZvKGEyRCk7XG4gIGJhY2tlbmQuZGlzcG9zZUludGVybWVkaWF0ZVRlbnNvckluZm8ocmVkdWNlZCk7XG5cbiAgaWYgKHBlcm11dGVkQXhlcyAhPSBudWxsKSB7XG4gICAgYmFja2VuZC5kaXNwb3NlSW50ZXJtZWRpYXRlVGVuc29ySW5mbyhwZXJtdXRlZFgpO1xuICB9XG5cbiAgcmV0dXJuIHJlcztcbn1cblxuZXhwb3J0IGNvbnN0IGFueUNvbmZpZzogS2VybmVsQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBBbnksXG4gIGJhY2tlbmROYW1lOiAnd2ViZ2wnLFxuICBrZXJuZWxGdW5jOiBhbnkgYXMgdW5rbm93biBhcyBLZXJuZWxGdW5jXG59O1xuIl19