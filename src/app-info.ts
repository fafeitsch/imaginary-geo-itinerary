import store from './store';

let appInfoButton: HTMLButtonElement;
let appInfo: HTMLDivElement;

export function toggleAppInfo() {
  appInfo.classList.toggle('d-none');
  appInfo.classList.toggle('d-flex');
}

export function initAppInfo() {
  store.get.name$.subscribe(
    (name) => (document.querySelector('title')!.innerHTML = name)
  );
  store.get.info$.subscribe(
    (info) =>
      (document.getElementById(
        'imprint'
      )!.innerHTML = `<a href=\"${info.link}\" target=\"_blank\">${info.label}</a>`)
  );

  appInfoButton = document.getElementById('info-opener')! as HTMLButtonElement;
  appInfo = document.getElementById('app-info')! as HTMLDivElement;
  document.getElementById('app-version')!.innerText = `Version: ` + APP_VERSION;
  appInfoButton.addEventListener('click', () => {
    toggleAppInfo();
  });
}
