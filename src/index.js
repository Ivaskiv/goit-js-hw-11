import Notiflix from 'notiflix';
import axios from 'axios';
axios.defaults.headers.common['x-api-key'] =
  '41052963-2f038b9fbcfd70669904ee843';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = axios.defaults.headers.common['x-api-key'];

const searchForm = document.querySelector('.search-form');
const searchQuery = document.querySelector('input');
const btnSearch = document.querySelector('button');

btnSearch.addEventListener(
  'click',

  async () => {
    try {
      const galleryCard = await gallery();
      renderUserListItems(galleryCard);
    } catch (error) {
      console.log(error.message);
    }
  }
);
async function gallery() {
  //   const photoCard = [];

  const client = createClient('API_KEY');
  const query = 'Nature';

  client.photos.search({ query, per_page: 1 }).then(photos => {});
}
