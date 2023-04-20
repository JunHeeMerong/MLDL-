import { assert } from '../util';
import { op } from './operation';
import { pad } from './pad';
/**
 * Pads a `tf.Tensor3D` with a given value and paddings. See `pad` for details.
 */
function pad3d_(x, paddings, constantValue = 0) {
    assert(paddings.length === 3 && paddings[0].length === 2 &&
        paddings[1].length === 2 && paddings[2].length === 2, () => 'Invalid number of paddings. Must be length of 2 each.');
    return pad(x, paddings, constantValue);
}
export const pad3d = /* @__PURE__ */ op({ pad3d_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFkM2QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9wYWQzZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFrQkEsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUMvQixPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxPQUFPLENBQUM7QUFFMUI7O0dBRUc7QUFDSCxTQUFTLE1BQU0sQ0FDWCxDQUFzQixFQUN0QixRQUFnRSxFQUNoRSxhQUFhLEdBQUcsQ0FBQztJQUNuQixNQUFNLENBQ0YsUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDO1FBQzdDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUN4RCxHQUFHLEVBQUUsQ0FBQyx1REFBdUQsQ0FBQyxDQUFDO0lBQ25FLE9BQU8sR0FBRyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDekMsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLEtBQUssR0FBRyxlQUFlLENBQUMsRUFBRSxDQUFDLEVBQUMsTUFBTSxFQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cbmltcG9ydCB7VGVuc29yM0R9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge1RlbnNvckxpa2V9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7YXNzZXJ0fSBmcm9tICcuLi91dGlsJztcbmltcG9ydCB7b3B9IGZyb20gJy4vb3BlcmF0aW9uJztcbmltcG9ydCB7cGFkfSBmcm9tICcuL3BhZCc7XG5cbi8qKlxuICogUGFkcyBhIGB0Zi5UZW5zb3IzRGAgd2l0aCBhIGdpdmVuIHZhbHVlIGFuZCBwYWRkaW5ncy4gU2VlIGBwYWRgIGZvciBkZXRhaWxzLlxuICovXG5mdW5jdGlvbiBwYWQzZF8oXG4gICAgeDogVGVuc29yM0R8VGVuc29yTGlrZSxcbiAgICBwYWRkaW5nczogW1tudW1iZXIsIG51bWJlcl0sIFtudW1iZXIsIG51bWJlcl0sIFtudW1iZXIsIG51bWJlcl1dLFxuICAgIGNvbnN0YW50VmFsdWUgPSAwKTogVGVuc29yM0Qge1xuICBhc3NlcnQoXG4gICAgICBwYWRkaW5ncy5sZW5ndGggPT09IDMgJiYgcGFkZGluZ3NbMF0ubGVuZ3RoID09PSAyICYmXG4gICAgICAgICAgcGFkZGluZ3NbMV0ubGVuZ3RoID09PSAyICYmIHBhZGRpbmdzWzJdLmxlbmd0aCA9PT0gMixcbiAgICAgICgpID0+ICdJbnZhbGlkIG51bWJlciBvZiBwYWRkaW5ncy4gTXVzdCBiZSBsZW5ndGggb2YgMiBlYWNoLicpO1xuICByZXR1cm4gcGFkKHgsIHBhZGRpbmdzLCBjb25zdGFudFZhbHVlKTtcbn1cblxuZXhwb3J0IGNvbnN0IHBhZDNkID0gLyogQF9fUFVSRV9fICovIG9wKHtwYWQzZF99KTtcbiJdfQ==