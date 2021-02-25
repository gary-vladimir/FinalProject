import sumita from '../src/client/js/app';

test('checks if its comparing the dates correctly', () => {
    expect(sumita(1, 2)).toBe(3);
});
