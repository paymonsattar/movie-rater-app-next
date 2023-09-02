import { paginate } from '../../src/index';

describe('Paginate Utility', () => {
  it('should correctly calculate offset and limit for page 1', () => {
    const { offset, limit } = paginate(1, 10);
    expect(offset).toBe(0);
    expect(limit).toBe(10);
  });

  it('should correctly calculate offset and limit for page 2', () => {
    const { offset, limit } = paginate(2, 10);
    expect(offset).toBe(10);
    expect(limit).toBe(10);
  });

  it('should correctly calculate offset and limit for page 3 with limit 20', () => {
    const { offset, limit } = paginate(3, 20);
    expect(offset).toBe(40);
    expect(limit).toBe(20);
  });

  it('should correctly calculate offset and limit for page 0 (treat as page 1)', () => {
    const { offset, limit } = paginate(0, 10);
    expect(offset).toBe(0);
    expect(limit).toBe(10);
  });

  it('should correctly calculate offset and limit for negative page (treat as page 1)', () => {
    const { offset, limit } = paginate(-1, 10);
    expect(offset).toBe(0);
    expect(limit).toBe(10);
  });

  it('should correctly calculate offset and limit for limit 0 (no limit)', () => {
    const { offset, limit } = paginate(1, 0);
    expect(offset).toBe(0);
    expect(limit).toBe(0);
  });

  it('should correctly calculate offset and limit for negative limit (treat as no limit)', () => {
    const { offset, limit } = paginate(1, -10);
    expect(offset).toBe(0);
    expect(limit).toBe(0);
  });
});
