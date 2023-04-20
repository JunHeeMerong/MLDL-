/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
import { ENGINE } from '../engine';
import { dispose, tidy } from '../globals';
import { add } from '../ops/add';
import { div } from '../ops/div';
import { mul } from '../ops/mul';
import { pow } from '../ops/pow';
import { scalar } from '../ops/scalar';
import { sqrt } from '../ops/sqrt';
import { square } from '../ops/square';
import { sub } from '../ops/sub';
import { zerosLike } from '../ops/zeros_like';
import { Optimizer } from './optimizer';
export class AdamOptimizer extends Optimizer {
    constructor(learningRate, beta1, beta2, epsilon = null) {
        super();
        this.learningRate = learningRate;
        this.beta1 = beta1;
        this.beta2 = beta2;
        this.epsilon = epsilon;
        this.accumulatedFirstMoment = [];
        this.accumulatedSecondMoment = [];
        tidy(() => {
            // accB* will be updated by batch.
            this.accBeta1 = scalar(beta1).variable();
            this.accBeta2 = scalar(beta2).variable();
        });
        if (epsilon == null) {
            this.epsilon = ENGINE.backend.epsilon();
        }
    }
    /** @nocollapse */
    static get className() {
        // Name matters for Python compatibility.
        // This is a getter instead of a property because when it's a property, it
        // prevents the entire class from being tree-shaken.
        return 'Adam';
    }
    applyGradients(variableGradients) {
        const varNames = Array.isArray(variableGradients) ?
            variableGradients.map(v => v.name) :
            Object.keys(variableGradients);
        tidy(() => {
            const oneMinusAccBeta1 = sub(1, this.accBeta1);
            const oneMinusAccBeta2 = sub(1, this.accBeta2);
            varNames.forEach((name, i) => {
                const value = ENGINE.registeredVariables[name];
                const trainable = false;
                if (this.accumulatedFirstMoment[i] == null) {
                    this.accumulatedFirstMoment[i] = {
                        originalName: `${name}/m`,
                        variable: tidy(() => zerosLike(value).variable(trainable))
                    };
                }
                if (this.accumulatedSecondMoment[i] == null) {
                    this.accumulatedSecondMoment[i] = {
                        originalName: `${name}/v`,
                        variable: tidy(() => zerosLike(value).variable(trainable))
                    };
                }
                const gradient = Array.isArray(variableGradients) ?
                    variableGradients[i].tensor :
                    variableGradients[name];
                if (gradient == null) {
                    return;
                }
                const firstMoment = this.accumulatedFirstMoment[i].variable;
                const secondMoment = this.accumulatedSecondMoment[i].variable;
                const newFirstMoment = add(mul(firstMoment, this.beta1), mul(gradient, 1 - this.beta1));
                const newSecondMoment = add(mul(secondMoment, this.beta2), mul(square(gradient), 1 - this.beta2));
                const biasCorrectedFirstMoment = div(newFirstMoment, oneMinusAccBeta1);
                const biasCorrectedSecondMoment = div(newSecondMoment, oneMinusAccBeta2);
                firstMoment.assign(newFirstMoment);
                secondMoment.assign(newSecondMoment);
                const newValue = add(mul(div(biasCorrectedFirstMoment, add(sqrt(biasCorrectedSecondMoment), this.epsilon)), -this.learningRate), value);
                value.assign(newValue);
            });
            this.accBeta1.assign(mul(this.accBeta1, this.beta1));
            this.accBeta2.assign(mul(this.accBeta2, this.beta2));
        });
        this.incrementIterations();
    }
    dispose() {
        this.accBeta1.dispose();
        this.accBeta2.dispose();
        if (this.accumulatedFirstMoment != null) {
            dispose(this.accumulatedFirstMoment.map(v => v.variable));
        }
        if (this.accumulatedSecondMoment != null) {
            dispose(this.accumulatedSecondMoment.map(v => v.variable));
        }
    }
    async getWeights() {
        // Order matters for Python compatibility.
        const variables = [...this.accumulatedFirstMoment, ...this.accumulatedSecondMoment];
        return [await this.saveIterations()].concat(variables.map(v => ({ name: v.originalName, tensor: v.variable })));
    }
    async setWeights(weightValues) {
        weightValues = await this.extractIterations(weightValues);
        tidy(() => {
            this.accBeta1.assign(pow(this.beta1, this.iterations_ + 1));
            this.accBeta2.assign(pow(this.beta2, this.iterations_ + 1));
        });
        const variableCount = weightValues.length / 2;
        const trainable = false;
        this.accumulatedFirstMoment =
            weightValues.slice(0, variableCount).map(v => ({
                originalName: v.name,
                variable: v.tensor.variable(trainable)
            }));
        this.accumulatedSecondMoment =
            weightValues.slice(variableCount, variableCount * 2)
                .map(v => ({
                originalName: v.name,
                variable: v.tensor.variable(trainable)
            }));
    }
    getConfig() {
        return {
            'learningRate': this.learningRate,
            'beta1': this.beta1,
            'beta2': this.beta2,
            'epsilon': this.epsilon,
        };
    }
    /** @nocollapse */
    static fromConfig(cls, config) {
        return new cls(config['learningRate'], config['beta1'], config['beta2'], config['epsilon']);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRhbV9vcHRpbWl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wdGltaXplcnMvYWRhbV9vcHRpbWl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQyxNQUFNLFlBQVksQ0FBQztBQUN6QyxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDL0IsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUMvQixPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDckMsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUNqQyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3JDLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDL0IsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBSzVDLE9BQU8sRUFBQyxTQUFTLEVBQW9CLE1BQU0sYUFBYSxDQUFDO0FBRXpELE1BQU0sT0FBTyxhQUFjLFNBQVEsU0FBUztJQWMxQyxZQUNjLFlBQW9CLEVBQVksS0FBYSxFQUM3QyxLQUFhLEVBQVksVUFBa0IsSUFBSTtRQUMzRCxLQUFLLEVBQUUsQ0FBQztRQUZJLGlCQUFZLEdBQVosWUFBWSxDQUFRO1FBQVksVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUM3QyxVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQVksWUFBTyxHQUFQLE9BQU8sQ0FBZTtRQUxyRCwyQkFB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bkIsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPO1NBQ3hCLENBQUM7SUFDSixDQUFDO0lBRUQsa0JBQWtCO0lBQ2xCLE1BQU0sQ0FBVSxVQUFVLENBQ3RCLEdBQStCLEVBQUUsTUFBa0I7UUFDckQsT0FBTyxJQUFJLEdBQUcsQ0FDVixNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFDeEQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDekIsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0VOR0lORX0gZnJvbSAnLi4vZW5naW5lJztcbmltcG9ydCB7ZGlzcG9zZSwgdGlkeX0gZnJvbSAnLi4vZ2xvYmFscyc7XG5pbXBvcnQge2FkZH0gZnJvbSAnLi4vb3BzL2FkZCc7XG5pbXBvcnQge2Rpdn0gZnJvbSAnLi4vb3BzL2Rpdic7XG5pbXBvcnQge211bH0gZnJvbSAnLi4vb3BzL211bCc7XG5pbXBvcnQge3Bvd30gZnJvbSAnLi4vb3BzL3Bvdyc7XG5pbXBvcnQge3NjYWxhcn0gZnJvbSAnLi4vb3BzL3NjYWxhcic7XG5pbXBvcnQge3NxcnR9IGZyb20gJy4uL29wcy9zcXJ0JztcbmltcG9ydCB7c3F1YXJlfSBmcm9tICcuLi9vcHMvc3F1YXJlJztcbmltcG9ydCB7c3VifSBmcm9tICcuLi9vcHMvc3ViJztcbmltcG9ydCB7emVyb3NMaWtlfSBmcm9tICcuLi9vcHMvemVyb3NfbGlrZSc7XG5pbXBvcnQge0NvbmZpZ0RpY3QsIFNlcmlhbGl6YWJsZSwgU2VyaWFsaXphYmxlQ29uc3RydWN0b3J9IGZyb20gJy4uL3NlcmlhbGl6YXRpb24nO1xuaW1wb3J0IHtWYXJpYWJsZX0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7TmFtZWRUZW5zb3IsIE5hbWVkVmFyaWFibGVNYXB9IGZyb20gJy4uL3RlbnNvcl90eXBlcyc7XG5cbmltcG9ydCB7T3B0aW1pemVyLCBPcHRpbWl6ZXJWYXJpYWJsZX0gZnJvbSAnLi9vcHRpbWl6ZXInO1xuXG5leHBvcnQgY2xhc3MgQWRhbU9wdGltaXplciBleHRlbmRzIE9wdGltaXplciB7XG4gIC8qKiBAbm9jb2xsYXBzZSAqL1xuICBzdGF0aWMgZ2V0IGNsYXNzTmFtZSgpIHtcbiAgICAvLyBOYW1lIG1hdHRlcnMgZm9yIFB5dGhvbiBjb21wYXRpYmlsaXR5LlxuICAgIC8vIFRoaXMgaXMgYSBnZXR0ZXIgaW5zdGVhZCBvZiBhIHByb3BlcnR5IGJlY2F1c2Ugd2hlbiBpdCdzIGEgcHJvcGVydHksIGl0XG4gICAgLy8gcHJldmVudHMgdGhlIGVudGlyZSBjbGFzcyBmcm9tIGJlaW5nIHRyZWUtc2hha2VuLlxuICAgIHJldHVybiAnQWRhbSc7XG4gIH1cbiAgcHJpdmF0ZSBhY2NCZXRhMTogVmFyaWFibGU7XG4gIHByaXZhdGUgYWNjQmV0YTI6IFZhcmlhYmxlO1xuXG4gIHByaXZhdGUgYWNjdW11bGF0ZWRGaXJzdE1vbWVudDogT3B0aW1pemVyVmFyaWFibGVbXSA9IFtdO1xuICBwcml2YXRlIGFjY3VtdWxhdGVkU2Vjb25kTW9tZW50OiBPcHRpbWl6ZXJWYXJpYWJsZVtdID0gW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcm90ZWN0ZWQgbGVhcm5pbmdSYXRlOiBudW1iZXIsIHByb3RlY3RlZCBiZXRhMTogbnVtYmVyLFxuICAgICAgcHJvdGVjdGVkIGJldGEyOiBudW1iZXIsIHByb3RlY3RlZCBlcHNpbG9uOiBudW1iZXIgPSBudWxsKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aWR5KCgpID0+IHtcbiAgICAgIC8vIGFjY0IqIHdpbGwgYmUgdXBkYXRlZCBieSBiYXRjaC5cbiAgICAgIHRoaXMuYWNjQmV0YTEgPSBzY2FsYXIoYmV0YTEpLnZhcmlhYmxlKCk7XG4gICAgICB0aGlzLmFjY0JldGEyID0gc2NhbGFyKGJldGEyKS52YXJpYWJsZSgpO1xuICAgIH0pO1xuXG4gICAgaWYgKGVwc2lsb24gPT0gbnVsbCkge1xuICAgICAgdGhpcy5lcHNpbG9uID0gRU5HSU5FLmJhY2tlbmQuZXBzaWxvbigpO1xuICAgIH1cbiAgfVxuXG4gIGFwcGx5R3JhZGllbnRzKHZhcmlhYmxlR3JhZGllbnRzOiBOYW1lZFZhcmlhYmxlTWFwfE5hbWVkVGVuc29yW10pIHtcbiAgICBjb25zdCB2YXJOYW1lcyA9IEFycmF5LmlzQXJyYXkodmFyaWFibGVHcmFkaWVudHMpID9cbiAgICAgICAgdmFyaWFibGVHcmFkaWVudHMubWFwKHYgPT4gdi5uYW1lKSA6XG4gICAgICAgIE9iamVjdC5rZXlzKHZhcmlhYmxlR3JhZGllbnRzKTtcbiAgICB0aWR5KCgpID0+IHtcbiAgICAgIGNvbnN0IG9uZU1pbnVzQWNjQmV0YTEgPSBzdWIoMSwgdGhpcy5hY2NCZXRhMSk7XG4gICAgICBjb25zdCBvbmVNaW51c0FjY0JldGEyID0gc3ViKDEsIHRoaXMuYWNjQmV0YTIpO1xuXG4gICAgICB2YXJOYW1lcy5mb3JFYWNoKChuYW1lLCBpKSA9PiB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gRU5HSU5FLnJlZ2lzdGVyZWRWYXJpYWJsZXNbbmFtZV07XG4gICAgICAgIGNvbnN0IHRyYWluYWJsZSA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5hY2N1bXVsYXRlZEZpcnN0TW9tZW50W2ldID09IG51bGwpIHtcbiAgICAgICAgICB0aGlzLmFjY3VtdWxhdGVkRmlyc3RNb21lbnRbaV0gPSB7XG4gICAgICAgICAgICBvcmlnaW5hbE5hbWU6IGAke25hbWV9L21gLFxuICAgICAgICAgICAgdmFyaWFibGU6IHRpZHkoKCkgPT4gemVyb3NMaWtlKHZhbHVlKS52YXJpYWJsZSh0cmFpbmFibGUpKVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuYWNjdW11bGF0ZWRTZWNvbmRNb21lbnRbaV0gPT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMuYWNjdW11bGF0ZWRTZWNvbmRNb21lbnRbaV0gPSB7XG4gICAgICAgICAgICBvcmlnaW5hbE5hbWU6IGAke25hbWV9L3ZgLFxuICAgICAgICAgICAgdmFyaWFibGU6IHRpZHkoKCkgPT4gemVyb3NMaWtlKHZhbHVlKS52YXJpYWJsZSh0cmFpbmFibGUpKVxuICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBncmFkaWVudCA9IEFycmF5LmlzQXJyYXkodmFyaWFibGVHcmFkaWVudHMpID9cbiAgICAgICAgICAgIHZhcmlhYmxlR3JhZGllbnRzW2ldLnRlbnNvciA6XG4gICAgICAgICAgICB2YXJpYWJsZUdyYWRpZW50c1tuYW1lXTtcbiAgICAgICAgaWYgKGdyYWRpZW50ID09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmaXJzdE1vbWVudCA9IHRoaXMuYWNjdW11bGF0ZWRGaXJzdE1vbWVudFtpXS52YXJpYWJsZTtcbiAgICAgICAgY29uc3Qgc2Vjb25kTW9tZW50ID0gdGhpcy5hY2N1bXVsYXRlZFNlY29uZE1vbWVudFtpXS52YXJpYWJsZTtcblxuICAgICAgICBjb25zdCBuZXdGaXJzdE1vbWVudCA9XG4gICAgICAgICAgICBhZGQobXVsKGZpcnN0TW9tZW50LCB0aGlzLmJldGExKSwgbXVsKGdyYWRpZW50LCAxIC0gdGhpcy5iZXRhMSkpO1xuICAgICAgICBjb25zdCBuZXdTZWNvbmRNb21lbnQgPVxuICAgICAgICAgICAgYWRkKG11bChzZWNvbmRNb21lbnQsIHRoaXMuYmV0YTIpLFxuICAgICAgICAgICAgICAgIG11bChzcXVhcmUoZ3JhZGllbnQpLCAxIC0gdGhpcy5iZXRhMikpO1xuXG4gICAgICAgIGNvbnN0IGJpYXNDb3JyZWN0ZWRGaXJzdE1vbWVudCA9IGRpdihuZXdGaXJzdE1vbWVudCwgb25lTWludXNBY2NCZXRhMSk7XG4gICAgICAgIGNvbnN0IGJpYXNDb3JyZWN0ZWRTZWNvbmRNb21lbnQgPVxuICAgICAgICAgICAgZGl2KG5ld1NlY29uZE1vbWVudCwgb25lTWludXNBY2NCZXRhMik7XG5cbiAgICAgICAgZmlyc3RNb21lbnQuYXNzaWduKG5ld0ZpcnN0TW9tZW50KTtcbiAgICAgICAgc2Vjb25kTW9tZW50LmFzc2lnbihuZXdTZWNvbmRNb21lbnQpO1xuXG4gICAgICAgIGNvbnN0IG5ld1ZhbHVlID1cbiAgICAgICAgICAgIGFkZChtdWwoZGl2KGJpYXNDb3JyZWN0ZWRGaXJzdE1vbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZChzcXJ0KGJpYXNDb3JyZWN0ZWRTZWNvbmRNb21lbnQpLCB0aGlzLmVwc2lsb24pKSxcbiAgICAgICAgICAgICAgICAgICAgLXRoaXMubGVhcm5pbmdSYXRlKSxcbiAgICAgICAgICAgICAgICB2YWx1ZSk7XG4gICAgICAgIHZhbHVlLmFzc2lnbihuZXdWYWx1ZSk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5hY2NCZXRhMS5hc3NpZ24obXVsKHRoaXMuYWNjQmV0YTEsIHRoaXMuYmV0YTEpKTtcbiAgICAgIHRoaXMuYWNjQmV0YTIuYXNzaWduKG11bCh0aGlzLmFjY0JldGEyLCB0aGlzLmJldGEyKSk7XG4gICAgfSk7XG4gICAgdGhpcy5pbmNyZW1lbnRJdGVyYXRpb25zKCk7XG4gIH1cblxuICBvdmVycmlkZSBkaXNwb3NlKCk6IHZvaWQge1xuICAgIHRoaXMuYWNjQmV0YTEuZGlzcG9zZSgpO1xuICAgIHRoaXMuYWNjQmV0YTIuZGlzcG9zZSgpO1xuXG4gICAgaWYgKHRoaXMuYWNjdW11bGF0ZWRGaXJzdE1vbWVudCAhPSBudWxsKSB7XG4gICAgICBkaXNwb3NlKHRoaXMuYWNjdW11bGF0ZWRGaXJzdE1vbWVudC5tYXAodiA9PiB2LnZhcmlhYmxlKSk7XG4gICAgfVxuICAgIGlmICh0aGlzLmFjY3VtdWxhdGVkU2Vjb25kTW9tZW50ICE9IG51bGwpIHtcbiAgICAgIGRpc3Bvc2UodGhpcy5hY2N1bXVsYXRlZFNlY29uZE1vbWVudC5tYXAodiA9PiB2LnZhcmlhYmxlKSk7XG4gICAgfVxuICB9XG5cbiAgb3ZlcnJpZGUgYXN5bmMgZ2V0V2VpZ2h0cygpOiBQcm9taXNlPE5hbWVkVGVuc29yW10+IHtcbiAgICAvLyBPcmRlciBtYXR0ZXJzIGZvciBQeXRob24gY29tcGF0aWJpbGl0eS5cbiAgICBjb25zdCB2YXJpYWJsZXM6IE9wdGltaXplclZhcmlhYmxlW10gPVxuICAgICAgICBbLi4udGhpcy5hY2N1bXVsYXRlZEZpcnN0TW9tZW50LCAuLi50aGlzLmFjY3VtdWxhdGVkU2Vjb25kTW9tZW50XTtcbiAgICByZXR1cm4gW2F3YWl0IHRoaXMuc2F2ZUl0ZXJhdGlvbnMoKV0uY29uY2F0KFxuICAgICAgICB2YXJpYWJsZXMubWFwKHYgPT4gKHtuYW1lOiB2Lm9yaWdpbmFsTmFtZSwgdGVuc29yOiB2LnZhcmlhYmxlfSkpKTtcbiAgfVxuXG4gIG92ZXJyaWRlIGFzeW5jIHNldFdlaWdodHMod2VpZ2h0VmFsdWVzOiBOYW1lZFRlbnNvcltdKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgd2VpZ2h0VmFsdWVzID0gYXdhaXQgdGhpcy5leHRyYWN0SXRlcmF0aW9ucyh3ZWlnaHRWYWx1ZXMpO1xuICAgIHRpZHkoKCkgPT4ge1xuICAgICAgdGhpcy5hY2NCZXRhMS5hc3NpZ24ocG93KHRoaXMuYmV0YTEsIHRoaXMuaXRlcmF0aW9uc18gKyAxKSk7XG4gICAgICB0aGlzLmFjY0JldGEyLmFzc2lnbihwb3codGhpcy5iZXRhMiwgdGhpcy5pdGVyYXRpb25zXyArIDEpKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHZhcmlhYmxlQ291bnQgPSB3ZWlnaHRWYWx1ZXMubGVuZ3RoIC8gMjtcbiAgICBjb25zdCB0cmFpbmFibGUgPSBmYWxzZTtcbiAgICB0aGlzLmFjY3VtdWxhdGVkRmlyc3RNb21lbnQgPVxuICAgICAgICB3ZWlnaHRWYWx1ZXMuc2xpY2UoMCwgdmFyaWFibGVDb3VudCkubWFwKHYgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsTmFtZTogdi5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFibGU6IHYudGVuc29yLnZhcmlhYmxlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYWluYWJsZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgdGhpcy5hY2N1bXVsYXRlZFNlY29uZE1vbWVudCA9XG4gICAgICAgIHdlaWdodFZhbHVlcy5zbGljZSh2YXJpYWJsZUNvdW50LCB2YXJpYWJsZUNvdW50ICogMilcbiAgICAgICAgICAgIC5tYXAodiA9PiAoe1xuICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsTmFtZTogdi5uYW1lLFxuICAgICAgICAgICAgICAgICAgIHZhcmlhYmxlOiB2LnRlbnNvci52YXJpYWJsZSh0cmFpbmFibGUpXG4gICAgICAgICAgICAgICAgIH0pKTtcbiAgfVxuXG4gIGdldENvbmZpZygpOiBDb25maWdEaWN0IHtcbiAgICByZXR1cm4ge1xuICAgICAgJ2xlYXJuaW5nUmF0ZSc6IHRoaXMubGVhcm5pbmdSYXRlLFxuICAgICAgJ2JldGExJzogdGhpcy5iZXRhMSxcbiAgICAgICdiZXRhMic6IHRoaXMuYmV0YTIsXG4gICAgICAnZXBzaWxvbic6IHRoaXMuZXBzaWxvbixcbiAgICB9O1xuICB9XG5cbiAgLyoqIEBub2NvbGxhcHNlICovXG4gIHN0YXRpYyBvdmVycmlkZSBmcm9tQ29uZmlnPFQgZXh0ZW5kcyBTZXJpYWxpemFibGU+KFxuICAgICAgY2xzOiBTZXJpYWxpemFibGVDb25zdHJ1Y3RvcjxUPiwgY29uZmlnOiBDb25maWdEaWN0KTogVCB7XG4gICAgcmV0dXJuIG5ldyBjbHMoXG4gICAgICAgIGNvbmZpZ1snbGVhcm5pbmdSYXRlJ10sIGNvbmZpZ1snYmV0YTEnXSwgY29uZmlnWydiZXRhMiddLFxuICAgICAgICBjb25maWdbJ2Vwc2lsb24nXSk7XG4gIH1cbn1cbiJdfQ==