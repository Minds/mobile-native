export default `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      :root .light {
        --primary-text: #43434d;
        --icon: #7d7d82;
        --primary-bg: #ffffff;
        --secondary-bg: #f6f7f7;
        --tertiary-bg: #e3e4e9;
        --success: #59A05E;
        --danger: #CA4A34;
      }

      :root .dark {
        --primary-text: #ffffff;
        --icon: #aeb0b8;
        --primary-bg: #1f252c;
        --secondary-bg: #1a2025;
        --tertiary-bg: #404e53;
        --success: #5AC36F;
        --danger: #CA4A34;
      }

      * {
        color: var(--primary-text);
        font-family: Helvetica, sans-serif !important;
      }

      body {
        margin: 0;
        padding: 4px;
        background-color: var(--primary-bg, transparent);
      }

      .frc-icon {
        fill: var(--icon) !important;
        stroke: var(--icon) !important;
      }

      .frc-text b {
        color: var(--primary-text);
      }

      .frc-button {
        background-color: var(--tertiary-bg) !important;
        color: var(--primary-text);
      }

      .frc-button:hover {
        background-color: var(--secondary-bg) !important;
      }

      .success svg {
        fill: var(--success) !important;
        stroke: var(--success) !important;
      }

      .danger svg {
        fill: var(--danger) !important;
        stroke: var(--danger) !important;
      }
    </style>
  </head>
  <body>
    <div id="captcha"></div>
  </body>
  <script
    type="module"
    src="https://unpkg.com/friendly-challenge@0.9.1/widget.module.min.js"
  ></script>
  <script
    nomodule
    src="https://unpkg.com/friendly-challenge@0.9.1/widget.min.js"
  ></script>
  <script>
    let widgetInstance;

    function postMessage(data) {
      window.ReactNativeWebView.postMessage(JSON.stringify(data))
    }

    function setTheme(theme) {
      document.querySelector('body').className = theme;
    }

    function onSuccess() {
      try {
        document.querySelector('.frc-container').className =
          'frc-container success';
      } catch (e) {
        console.error(e);
      }
    }

    function onError() {
      try {
        document.querySelector('.frc-container').className =
          'frc-container danger';
      } catch (e) {
        console.error(e);
      }
    }

    function reset() {
      if (widgetInstance) {
        widgetInstance.reset();
      }
    }

    document.addEventListener('DOMContentLoaded', function (event) {
      try {
        widgetInstance = new friendlyChallenge.WidgetInstance(
          document.getElementById('captcha'),
          {
            startMode: 'auto',
            sitekey: 'minds-front',
            puzzleEndpoint:
              'api/v3/friendly-captcha/puzzle',
            doneCallback: solution => {
              postMessage({ solution });
              onSuccess();
            },
            errorCallback: error => {
              postMessage({ error });
              onError();
            },
          },
        );
      } catch (error) {
        postMessage({ error });
        onError();
      }
    });
  </script>
</html>`;
