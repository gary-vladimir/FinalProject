import { keys } from '../src/server/testing';

test('checking if the username is included', () => {
    expect(keys('GEONAMES_USERNAME')).not.toBe('');
});

test('checking if the weather bit key is included', () => {
    expect(keys('WEATHERBIT_API_KEY')).not.toBe('');
});

test('checking if the pixabay key is included', () => {
    expect(keys('PIXABAY_API_KEY')).not.toBe('');
});
