import { current } from '../src/client/js/testing';

test('check that the difference between two dates is correct', () => {
    expect(current('2021-3-2', '2021-2-25')).toBe(5);
});
test('check that the difference between two dates is correct', () => {
    expect(current('2021-3-5', '2021-2-25')).toBe(8);
});
test('check that the difference between two dates is correct', () => {
    expect(current('2021-3-1', '2021-2-25')).toBe(4);
});
