import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import Notiflix from 'notiflix';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '41052963-2f038b9fbcfd70669904ee843';
const searchQuery = document.querySelector('input');
const gallery = document.querySelector('.gallery');
const btnSearch = document.querySelector('button');
const btnLoadMore = document.querySelector('.load-more');
const per_page = 40;

let page = 1;
let lightbox;

//функція для ініціалізації SimpleLightbox
function initLightbox() {
  lightbox = new SimpleLightbox('.photo-card a');
}
//викликати initLightbox при старті скрипта
initLightbox();

btnLoadMore.style.display = 'none';
//+слухач подій для форми пошуку
btnSearch.addEventListener('click', handleSearch);
btnLoadMore.addEventListener('click', handleLoadMore);
//==============
async function fetchSearch(query, currentPage) {
  try {
    //отр. зображення з Pixabay API на основі пошукового запиту
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: currentPage,
        per_page,
      },
    });
    return response.data;
  } catch (e) {
    console.error('Error:', e);
    throw e;
  }
}
//==============форма пошуку
async function handleSearch(event) {
  event.preventDefault();
  const query = searchQuery.value.trim();
  if (query === '') {
    return;
  }
  try {
    const data = await fetchSearch(query, 1);

    if (data.hits.length === 0) {
      Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    gallery.innerHTML = '';
    const imageCards = data.hits.map(createImageCard);
    gallery.append(...imageCards);
    lightbox.refresh();

    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

    if (data.totalHits <= per_page) {
      btnLoadMore.style.display = 'none';
    } else {
      btnLoadMore.style.display = 'block';
    }
    //скинути з-ння page до 1
    page = 1;
  } catch (e) {
    console.error('Error:', e);
  }
}
//==============ф-я завантажити більше зображень
async function handleLoadMore() {
  try {
    const query = searchQuery.value.trim();
    const data = await fetchSearch(query, page + 1);

    if (data.hits.length > 0) {
      const imageCards = data.hits.map(createImageCard);
      gallery.append(...imageCards);
      page += 1;
      lightbox.refresh();

      if (page * per_page >= data.totalHits) {
        btnLoadMore.style.display = 'none';
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        return;
      } else {
        btnLoadMore.style.display = 'block';
      }
    }
  } catch (e) {
    console.error('Error:', e);
  }
}
//==============створення карток для зображень
function createImageCard(image) {
  const {
    webformatURL,
    tags,
    likes,
    views,
    comments,
    downloads,
    largeImageURL,
    id,
  } = image;
  const card = document.createElement('div');
  card.classList.add('photo-card');

  card.innerHTML = `
  <a class="gallery-link" href="${largeImageURL}">
    <div class="gallery-item" id="${id}">
      <img src="${webformatURL}" alt="${tags}" loading="lazy">
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${likes}</p>
        <p class="info-item"><b>Views:</b> ${views}</p>
        <p class="info-item"><b>Comments:</b> ${comments}</p>
        <p class="info-item"><b>Downloads:</b> ${downloads}</p>
      </div>
    </div>
  </a>
  `;
  return card;
}
