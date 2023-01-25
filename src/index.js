import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createMarkup } from './js/createMarkup';
import { fetchPhotos } from './js/fetchPhotos';

const formInput = document.querySelector('#search-form');
const markupContainer = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

loadMoreButton.style.display = 'none';

let lightbox = new SimpleLightbox('.photo-card a', {
  captionsData: 'alt',
  captionDelay: 250,
});

let currentPage = 1;
let totalHits = 0;

formInput.addEventListener('submit', onSubmit);
loadMoreButton.addEventListener('click', onLoadMoreButton);

async function onSubmit(event) {
  event.preventDefault();

  clearPage();

  currentPage = 1;
  const feedback = await fetchPhotos(formInput, currentPage);

  totalHits = feedback.hits.length;

  if (!totalHits) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    loadMoreButton.style.display = 'none';
    return;
  } else {
    Notiflix.Notify.info(`Hooray! We found ${feedback.totalHits} images.`);
  }

  console.log(feedback);

  const markup = createMarkup(feedback.hits);
  markupContainer.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });

  checkLoadMoreButton(totalHits, feedback);
}

function clearPage() {
  markupContainer.innerHTML = '';
}

async function onLoadMoreButton() {
  currentPage += 1;
  const feedback = await fetchPhotos(formInput, currentPage);
  const markup = createMarkup(feedback.hits);
  markupContainer.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();

  totalHits += feedback.hits.length;

  checkLoadMoreButton(totalHits, feedback);

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function checkLoadMoreButton(iterator, value) {
  if (`${iterator}` === `${value.totalHits}`) {
    loadMoreButton.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  } else {
    loadMoreButton.style.display = 'block';
  }
}
