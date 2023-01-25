import axios from 'axios';

const url = 'https://pixabay.com/api/?';
const KEY_ACCESS = '33083400-032cb2f9b6c3b7dcd104a82f5';

async function fetchPhotos(value, page) {
  const response = await axios(url, {
    params: {
      key: KEY_ACCESS,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: `${page}`,
      q: `${value.searchQuery.value}`,
    },
  });
  const result = await response.data;
  return result;
}

export { fetchPhotos };
