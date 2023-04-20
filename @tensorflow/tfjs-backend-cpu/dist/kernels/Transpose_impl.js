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
import { util } from '@tensorflow/tfjs-core';
export function transposeImpl(xVals, xShape, dtype, perm, newShape) {
    const xRank = xShape.length;
    const xSize = util.sizeFromShape(xShape);
    const xStrides = util.computeStrides(xShape);
    const newStrides = util.computeStrides(newShape);
    const result = util.getTypedArrayFromDType(dtype, util.sizeFromShape(newShape));
    for (let i = 0; i < xSize; ++i) {
        const loc = util.indexToLoc(i, xRank, xStrides);
        // Permute location.
        const newLoc = new Array(loc.length);
        for (let i = 0; i < newLoc.length; i++) {
            newLoc[i] = loc[perm[i]];
        }
        const newIndex = util.locToIndex(newLoc, xRank, newStrides);
        result[newIndex] = xVals[i];
    }
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJhbnNwb3NlX2ltcGwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtY3B1L3NyYy9rZXJuZWxzL1RyYW5zcG9zZV9pbXBsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUdILE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUUzQyxNQUFNLFVBQVUsYUFBYSxDQUN6QixLQUFpQixFQUFFLE1BQWdCLEVBQUUsS0FBZSxFQUFFLElBQWMsRUFDcEUsUUFBa0I7SUFDcEIsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUM1QixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3pDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDN0MsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUVqRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQ3RDLEtBQXdCLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBRTVELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsRUFBRSxDQUFDLEVBQUU7UUFDOUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRWhELG9CQUFvQjtRQUNwQixNQUFNLE1BQU0sR0FBYSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0MsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMxQjtRQUVELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztRQUM1RCxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzdCO0lBQ0QsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtEYXRhVHlwZSwgTnVtZXJpY0RhdGFUeXBlLCBUeXBlZEFycmF5fSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuaW1wb3J0IHt1dGlsfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNwb3NlSW1wbChcbiAgICB4VmFsczogVHlwZWRBcnJheSwgeFNoYXBlOiBudW1iZXJbXSwgZHR5cGU6IERhdGFUeXBlLCBwZXJtOiBudW1iZXJbXSxcbiAgICBuZXdTaGFwZTogbnVtYmVyW10pOiBUeXBlZEFycmF5IHtcbiAgY29uc3QgeFJhbmsgPSB4U2hhcGUubGVuZ3RoO1xuICBjb25zdCB4U2l6ZSA9IHV0aWwuc2l6ZUZyb21TaGFwZSh4U2hhcGUpO1xuICBjb25zdCB4U3RyaWRlcyA9IHV0aWwuY29tcHV0ZVN0cmlkZXMoeFNoYXBlKTtcbiAgY29uc3QgbmV3U3RyaWRlcyA9IHV0aWwuY29tcHV0ZVN0cmlkZXMobmV3U2hhcGUpO1xuXG4gIGNvbnN0IHJlc3VsdCA9IHV0aWwuZ2V0VHlwZWRBcnJheUZyb21EVHlwZShcbiAgICAgIGR0eXBlIGFzIE51bWVyaWNEYXRhVHlwZSwgdXRpbC5zaXplRnJvbVNoYXBlKG5ld1NoYXBlKSk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB4U2l6ZTsgKytpKSB7XG4gICAgY29uc3QgbG9jID0gdXRpbC5pbmRleFRvTG9jKGksIHhSYW5rLCB4U3RyaWRlcyk7XG5cbiAgICAvLyBQZXJtdXRlIGxvY2F0aW9uLlxuICAgIGNvbnN0IG5ld0xvYzogbnVtYmVyW10gPSBuZXcgQXJyYXkobG9jLmxlbmd0aCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZXdMb2MubGVuZ3RoOyBpKyspIHtcbiAgICAgIG5ld0xvY1tpXSA9IGxvY1twZXJtW2ldXTtcbiAgICB9XG5cbiAgICBjb25zdCBuZXdJbmRleCA9IHV0aWwubG9jVG9JbmRleChuZXdMb2MsIHhSYW5rLCBuZXdTdHJpZGVzKTtcbiAgICByZXN1bHRbbmV3SW5kZXhdID0geFZhbHNbaV07XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiJdfQ==