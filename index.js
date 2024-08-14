import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import ru from './locales/ru.js';

const i18nInstance  = i18next.createInstance();
i18nInstance.init({
  lng: 'ru',
  debug: true,
  resources: {
    ru,
  },
});

yup.setLocale({
  string: {
    url: i18nInstance.t('invalidURL'), 
  },
});

let schema = yup.string().url('Ссылка должна быть валидным URL');

export default () => {
  const state = {
    form: {
      isValid: true,
      error: '',
    },
  };

  const input = document.querySelector('#url-input');
  const form = document.querySelector('.rss-form');
  const feedBackEl = document.querySelector('.feedback');

  const watchedState = onChange(state, (path, currentValue) => {
    if (path === 'form.error') {
      feedBackEl.textContent = currentValue;
    }

    if (path === 'form.isValid') {
      if (state.form.isValid === false) {
        input.classList.add('is-invalid');
      } else {
        input.classList.remove('is-invalid');
      }
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    schema.validate(url)
      .then(() => {
        watchedState.form.isValid = true;
        watchedState.form.error = '';
      })
      .catch(() => {
        watchedState.form.error = i18nInstance.t('invalidURL');
        watchedState.form.isValid = false;
      })
  });
};