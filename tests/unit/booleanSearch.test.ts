import { evaluateBooleanExpression } from '../../convex/forum';

describe('evaluateBooleanExpression', () => {
  it('handles AND', () => {
    expect(evaluateBooleanExpression('apple AND banana', 'apple banana')).toBe(true);
    expect(evaluateBooleanExpression('apple AND banana', 'apple cherry')).toBe(false);
  });

  it('handles OR', () => {
    expect(evaluateBooleanExpression('apple OR banana', 'apple cherry')).toBe(true);
    expect(evaluateBooleanExpression('apple OR banana', 'grape cherry')).toBe(false);
  });

  it('handles NOT', () => {
    expect(evaluateBooleanExpression('apple NOT banana', 'apple cherry')).toBe(true);
    expect(evaluateBooleanExpression('apple NOT banana', 'apple banana')).toBe(false);
  });
});
