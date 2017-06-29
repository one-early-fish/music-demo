import axios from 'axios';

export const ERR_OK = 200;

export function getSearchInfo(data) {
  return new Promise((resolve, reject) => {
    axios.get('/search', {
      params: data
    })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function getMusicUrl(data) {
  return new Promise((resolve, reject) => {
    axios.get('/music/url', {
      params: data
    })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function getMusicLrc(data) {
  return new Promise((resolve, reject) => {
    axios.get('/lyric', {
      params: data
    })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
